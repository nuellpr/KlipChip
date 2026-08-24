// QA todo 8 — grep-based: route unduhan wajib streaming, bukan buffering.
// Jalankan: node scripts/test/download-streams.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';

const src = fs.readFileSync('src/app/api/clips/[id]/download/route.ts', 'utf8');

assert.ok(!src.includes('readFileSync'), 'readFileSync (buffering seluruh file) harus hilang');
assert.ok(src.includes('createReadStream'), 'wajib createReadStream dari disk');
assert.ok(src.includes('Readable.toWeb'), 'wajib konversi ke web stream via Readable.toWeb');
assert.ok(src.includes("'Content-Length'"), 'header Content-Length dipertahankan');
assert.ok(src.includes("'Content-Disposition'"), 'header Content-Disposition dipertahankan');
assert.ok(/userId\s*!==\s*user\.id/.test(src), 'cek kepemilikan klip dipertahankan');
assert.ok(src.includes("status !== 'completed'"), 'cek status completed dipertahankan');

console.log('PASS download-streams');
