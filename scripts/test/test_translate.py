"""QA t3a: translate_lines — batch, retry, degrade, baris hilang.
Standalone assert-style (konvensi scripts/test/*.mjs), tanpa framework."""
import json
import os
import sys
import threading
from http.server import BaseHTTPRequestHandler, HTTPServer

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from clip_worker import translate_lines  # noqa: E402


class FakeForge(BaseHTTPRequestHandler):
    calls = []
    mode = 'ok'

    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        body = json.loads(self.rfile.read(length))
        FakeForge.calls.append(body)
        if FakeForge.mode == 'fail500':
            self.send_response(500)
            self.end_headers()
            return
        if FakeForge.mode == 'flaky':
            if len(FakeForge.calls) % 2 == 1:
                self.send_response(500)
                self.end_headers()
                return
        prompt = body['messages'][0]['content']
        numbered = [l for l in prompt.splitlines() if '.| ' in l]
        out_lines = []
        for l in numbered:
            idx, text = l.split('.| ', 1)
            if FakeForge.mode == 'missing' and idx.strip() == '2':
                continue
            out_lines.append(f"{idx}.| TERJ-{text}")
        payload = json.dumps({
            'choices': [{'message': {'content': '\n'.join(out_lines)}}]
        }).encode()
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        self.end_headers()
        self.wfile.write(payload)

    def log_message(self, *a):
        pass


def main():
    server = HTTPServer(('127.0.0.1', 0), FakeForge)
    port = server.server_address[1]
    threading.Thread(target=server.serve_forever, daemon=True).start()

    os.environ['FORGE_API_KEY'] = 'test-key'
    os.environ['FORGE_BASE_URL'] = f'http://127.0.0.1:{port}/v1'
    os.environ.pop('FORGE_MODEL', None)

    # 1. Skip total tanpa API key
    del os.environ['FORGE_API_KEY']
    assert translate_lines(['halo'], 'en') == [], 'tanpa key harus []'
    os.environ['FORGE_API_KEY'] = 'test-key'

    # 2. 40 baris -> tepat 2 panggilan (batch 22 + 18), hasil terindex benar
    FakeForge.calls.clear()
    FakeForge.mode = 'ok'
    lines40 = [f'baris {i}' for i in range(40)]
    out = translate_lines(lines40, 'en')
    assert len(FakeForge.calls) == 2, f'40 baris harus 2 batch, dapat {len(FakeForge.calls)}'
    assert len(out) == 40 and out[0] == 'TERJ-baris 0' and out[39] == 'TERJ-baris 39'
    print('[PASS] 40 baris -> 2 batch, index terjaga')

    # 3. Retry: 500 lalu sukses (mode flaky gagal tiap panggilan ganjil)
    #    2 baris = 1 batch -> 2 panggilan (500 lalu ok)
    FakeForge.calls.clear()
    FakeForge.mode = 'flaky'
    out = translate_lines(['satu', 'dua'], 'en')
    assert out == ['TERJ-satu', 'TERJ-dua'], f'retry gagal: {out}'
    assert len(FakeForge.calls) == 2, f'1 batch + 1 retry = 2 panggilan, dapat {len(FakeForge.calls)}'
    print('[PASS] 500 -> retry -> sukses')

    # 4. Semua gagal -> [] (degrade single-track)
    FakeForge.calls.clear()
    FakeForge.mode = 'fail500'
    out = translate_lines(['a', 'b'], 'en')
    assert out == [], f'total gagal harus [], dapat {out}'
    print('[PASS] semua gagal -> []')

    # 5. Baris hilang dari respons -> terjemahan kosong
    FakeForge.calls.clear()
    FakeForge.mode = 'missing'
    out = translate_lines(['satu', 'dua', 'tiga'], 'en')
    assert out[0] == 'TERJ-satu' and out[1] == '' and out[2] == 'TERJ-tiga'
    print('[PASS] baris hilang -> terjemahan kosong')

    # 6. Hard cap 120 baris
    FakeForge.calls.clear()
    FakeForge.mode = 'ok'
    out = translate_lines([f'x{i}' for i in range(300)], 'en')
    assert len(out) == 120, f'cap 120, dapat {len(out)}'
    print('[PASS] hard cap 120 baris')

    server.shutdown()
    print('T3A TRANSLATE: ALL PASS')


if __name__ == '__main__':
    main()
