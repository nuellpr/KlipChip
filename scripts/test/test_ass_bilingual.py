"""QA t3b: build_ass_file — Style CaptionSub + Dialogue Layer-1 berpasangan; noop tanpa terjemahan."""
import os
import sys
import tempfile

sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))
from clip_worker import build_ass_file  # noqa: E402


def make_caps():
    return [
        {'startSeconds': 0.0, 'endSeconds': 1.0, 'text': 'satu', 'words': []},
        {'startSeconds': 1.0, 'endSeconds': 2.0, 'text': 'dua', 'words': []},
        {'startSeconds': 2.0, 'endSeconds': 3.0, 'text': 'tiga', 'words': []},
    ]


def render(caps, translations):
    fd, path = tempfile.mkstemp(suffix='.ass')
    os.close(fd)
    try:
        build_ass_file(caps, {'style': 'clean', 'position': 'bottom', 'fontSize': 'lg',
                              'textColor': '#FFFFFF', 'highlightColor': '#FACC15',
                              'showBackgroundBox': True, 'uppercase': True},
                       0.0, 10.0, path, translations)
        with open(path, encoding='utf-8') as f:
            return f.read()
    finally:
        os.unlink(path)


def main():
    # Happy: 3 caption + terjemahan [isi, kosong, isi] -> CaptionSub + tepat 2 Dialogue Layer 1
    out = render(make_caps(), ['hello', '', 'ciao'])
    assert 'Style: CaptionSub' in out, 'Style CaptionSub hilang'
    layer1 = [l for l in out.splitlines() if l.startswith('Dialogue: 1,')]
    assert len(layer1) == 2, f'harus 2 Dialogue Layer-1, dapat {len(layer1)}'
    assert 'hello' in layer1[0] and 'ciao' in layer1[1]
    prim = [l for l in out.splitlines() if l.startswith('Dialogue: 0,')]
    p0 = prim[0].split(',')[1:3]
    s0 = layer1[0].split(',')[1:3]
    assert p0 == s0, f'waktu tidak berpasangan: {p0} vs {s0}'
    sub_style = [l for l in out.splitlines() if l.startswith('Style: CaptionSub,')]
    assert len(sub_style) == 1 and sub_style[0].endswith(',2,60,60,60,1'), \
        f'CaptionSub harus Alignment 2 MarginV 60: {sub_style}'
    print('[PASS] CaptionSub + 2 Dialogue Layer-1 berpasangan waktu')

    # Baris di luar window tetap tidak menghasilkan sub
    caps = make_caps() + [{'startSeconds': 50.0, 'endSeconds': 51.0, 'text': 'luar', 'words': []}]
    out = render(caps, ['a', 'b', 'c', 'd'])
    assert len([l for l in out.splitlines() if l.startswith('Dialogue: 1,')]) == 3
    print('[PASS] caption di luar window dilewati')

    # Noop: tanpa terjemahan -> output identik perilaku lama (tanpa CaptionSub)
    out_noop = render(make_caps(), None)
    assert 'CaptionSub' not in out_noop and 'Dialogue: 1,' not in out_noop
    out_empty = render(make_caps(), ['', '', ''])
    assert out_noop == out_empty, 'translations kosong-list vs None harus identik'
    print('[PASS] noop: tanpa/kosong terjemahan = perilaku lama')

    print('T3B ASS: ALL PASS')


if __name__ == '__main__':
    main()
