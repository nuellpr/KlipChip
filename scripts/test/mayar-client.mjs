// QA lib Mayar:parsing payload, penanganan error, gating token.
// Tidak menyentuh API sungguhan -- fetch di-stub.
//
// Jalankan: node scripts/test/mayar-client.mjs
import { strict as assert } from 'node:assert';

process.env.MAYAR_API_BASE = 'https://mayar.test/hl/v2';
process.env.MAYAR_API_TOKEN = 'test-token';

const { createPaymentRequest, fetchPaymentRequest, isMayarConfigured, MayarError } = await import('../../src/lib/mayar.ts');

const realFetch = globalThis.fetch;
let lastCall = null;
const calls = [];

function stub(handler) {
  lastCall = null;
  calls.length = 0;
  globalThis.fetch = async (url, init) => {
    calls.push({ url, init });
    lastCall = { url, init, body: init?.body ? JSON.parse(init.body) : null };
    return handler(url, init);
  };
}

const json = (status, payload) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const savedToken = process.env.MAYAR_API_TOKEN;
const savedKey = process.env.MAYAR_API_KEY;

try {
  // --- sukses: hanya field yang terisi yang dikirim, amount dibulatkan ---
  stub(() => json(200, {
    statusCode: 200,
    messages: 'success',
    data: {
      id: 'pay-uuid-1',
      transactionId: 'trx-uuid-1',
      link: 'https://mayar.test/pl/abc123',
      redirectUrl: null,
    },
  }));

  const created = await createPaymentRequest({
    name: 'KlipChip klip',
    amount: 5000.7,
    email: 'user@example.com',
    description: 'desc',
    expiredAt: new Date('2030-01-01T00:00:00.000Z'),
  });

  assert.equal(created.id, 'pay-uuid-1', 'id diteruskan');
  assert.equal(created.link, 'https://mayar.test/pl/abc123', 'link diteruskan');
  assert.equal(lastCall.url, 'https://mayar.test/hl/v2/payments/create', 'endpoint benar');
  assert.equal(lastCall.init.headers.Authorization, 'Bearer test-token', 'bearer token dikirim');
  assert.equal(lastCall.body.amount, 5001, 'amount dibulatkan ke integer');
  assert.equal(lastCall.body.expiredAt, '2030-01-01T00:00:00.000Z', 'expiredAt jadi ISO string');
  assert.ok(!('paymentMethod' in lastCall.body), 'field kosong tidak ikut dikirim');
  assert.ok(!('redirectUrl' in lastCall.body), 'redirectUrl kosong tidak ikut dikirim');
  console.log('[PASS] create: payload, header, dan bentuk respons');

  // --- respons tanpa link harus dianggap gagal, bukan|Mayaril Circus --- 
  stub(() => json(200, { statusCode: 200, messages: 'success', data: { id: 'x' } }));
  await assert.rejects(
    () => createPaymentRequest({ name: 'a', amount: 1000 }),
    (err) => err instanceof MayarError && /tidak mengembalikan id\/link/.test(err.message),
    'respons tanpa link harus ditolak'
  );
  console.log('[PASS] respons tanpa id/link ditolak');

  // --- error HTTP: pesan dari Mayar harus sampai ke pemanggil (prefix host ikut) ---
  stub(() => json(400, { statusCode: 400, messages: 'Validation Error' }));
  await assert.rejects(
    () => createPaymentRequest({ name: 'a', amount: 1000 }),
    (err) =>
      err instanceof MayarError && err.status === 400 && /mayar\.test/.test(err.message) && /Validation Error/.test(err.message),
    'status 400 diteruskan dengan pesan asli + host tujuan'
  );

  stub(() => json(429, { statusCode: 429, messages: 'Duplicate request detected.' }));
  await assert.rejects(
    () => createPaymentRequest({ name: 'a', amount: 1000 }),
    (err) => err instanceof MayarError && err.status === 429,
    'rate limit 429 diteruskan'
  );
  console.log('[PASS] error HTTP diteruskan apa adanya + host disebut (400 / 429)');

  // --- HTML diBalik proxy bukan 200 harus jadi error 502, bukan crash --- 
  stub(() => new Response('<html>502 Bad Gateway</html>', { status: 200 }));
  await assert.rejects(
    () => createPaymentRequest({ name: 'a', amount: 1000 }),
    (err) => err instanceof MayarError && err.status === 502,
    'respons non-JSON jadi 502'
  );
  console.log('[PASS] respons non-JSON (proxy error) jadi MayarError 502');

  // --- timeout / offline --- 
  stub(() => { throw new TypeError('fetch failed'); });
  await assert.rejects(
    () => createPaymentRequest({ name: 'a', amount: 1000 }),
    (err) => err instanceof MayarError && err.status === 502,
    'gagal jaringan jadi MayarError 502'
  );

  stub(() => {
    const e = new Error('aborted');
    e.name = 'AbortError';
    throw e;
  });
  await assert.rejects(
    () => createPaymentRequest({ name: 'a', amount: 1000 }),
    (err) => err instanceof MayarError && /timeout/.test(err.message),
    'timeout dikenali'
  );
  console.log('[PASS] kegagalan jaringan dan timeout jadi 502 yang jelas');

  // --- fetch detail dipakai webhook untuk konfirmasi --- 
  stub(() => json(200, { statusCode: 200, messages: 'success', data: { id: 'pay-uuid-1', amount: 5000, status: 'paid' } }));
  const detail = await fetchPaymentRequest('pay-uuid-1');
  assert.equal(detail.status, 'paid', 'status terbaca');
  assert.equal(detail.amount, 5000, 'amount terbaca');
  assert.equal(lastCall.url, 'https://mayar.test/hl/v2/payments/pay-uuid-1', 'endpoint detail benar');

  stub(() => json(200, { statusCode: 200, messages: 'success', data: { id: 'pay-uuid-1', status: 'unpaid' } }));
  assert.equal((await fetchPaymentRequest('pay-uuid-1')).status, 'unpaid', 'unpaid bukan paid');

  stub(() => json(200, { statusCode: 200, messages: 'success', data: {} }));
  assert.equal(await fetchPaymentRequest('pay-uuid-1'), null, 'data tanpa status -> null, bukan crash');
  console.log('[PASS] fetchPaymentRequest: paid / unpaid / data kosong');

// --- key kosong harus gagal dengan pesan yang bisa ditindaklanjuti ---
  // Node 24 otomatis memuat .env, jadi kedua nama harus dibersihkan eksplisit
  // supaya jalur "belum terkonfigurasi" benar-benar teruji.
  delete process.env.MAYAR_API_TOKEN;
  delete process.env.MAYAR_API_KEY;

  // Route create bergantung pada isMayarConfigured untuk memutuskan degrade,
  // jadi keduanya harus sepakat soal status konfigurasi.
  assert.equal(isMayarConfigured(), false, 'tanpa key -> belum terkonfigurasi');
  process.env.MAYAR_API_KEY = '   ';
  assert.equal(isMayarConfigured(), false, 'key whitespace dihitung belum terkonfigurasi');

  await assert.rejects(
    () => createPaymentRequest({ name: 'a', amount: 1000 }),
    (err) => err instanceof MayarError && err.status === 503 && /Mayar/.test(err.message),
    'key kosong -> 503 dengan petunjuk'
  );

  // Nama variabel alternatif: dashboard Mayar menyebutnya "API Key".
  process.env.MAYAR_API_KEY = 'key-dari-dashboard';
  assert.equal(isMayarConfigured(), true, 'MAYAR_API_KEY dianggap terkonfigurasi');
  stub(() => json(200, { statusCode: 200, messages: 'success', data: { id: 'i', link: 'https://mayar.test/pl/x' } }));
  await createPaymentRequest({ name: 'a', amount: 1000 });
  assert.equal(lastCall.init.headers.Authorization, 'Bearer key-dari-dashboard', 'MAYAR_API_KEY dipakai sebagai bearer');
  delete process.env.MAYAR_API_KEY;

  // MAYAR_API_TOKEN tetap diterima dan lebih diprioritaskan.
  process.env.MAYAR_API_KEY = 'key-dari-dashboard';
  process.env.MAYAR_API_TOKEN = 'token-dari-dokumentasi';
  stub(() => json(200, { statusCode: 200, messages: 'success', data: { id: 'i', link: 'https://mayar.test/pl/x' } }));
  await createPaymentRequest({ name: 'a', amount: 1000 });
  assert.equal(lastCall.init.headers.Authorization, 'Bearer token-dari-dokumentasi', 'MAYAR_API_TOKEN menang atas MAYAR_API_KEY');
  console.log('[PASS] gating key: kosong ditolak, 2 nama variabel diterima, TOKEN diprioritaskan');

  console.log('MAYAR CLIENT: ALL PASS');
} finally {
  // Kembalikan key asli kalau ada; proses ini boleh mengubahnya.
  const saved = { MAYAR_API_TOKEN: savedToken, MAYAR_API_KEY: savedKey };
  for (const [k, v] of Object.entries(saved)) {
    if (v === undefined) delete process.env[k];
    else process.env[k] = v;
  }
  globalThis.fetch = realFetch;
}