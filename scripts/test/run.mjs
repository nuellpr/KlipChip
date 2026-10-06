// Runner suite: node scripts/test/run.mjs [--e2e]
// Semua file .mjs di folder ini dijalankan sebagai skrip mandiri (pakai node:assert).
// Test ber-prasyarat eksternal dilewati kecuali --e2e / QA_E2E=1:
//   - bilingual-api, dashboard-social -> butuh dev server di QA_BASE (default http://localhost:3100)
//   - e2e-bilingual -> butuh `python` + clip_worker.py + ffmpeg
import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = import.meta.dirname;
const SERVER_TESTS = new Set(['bilingual-api.mjs', 'dashboard-social.mjs', 'e2e-bilingual.mjs']);
const runE2E = process.argv.includes('--e2e') || process.env.QA_E2E === '1';

const isTest = (f) => f.endsWith('.mjs') && f !== 'run.mjs' && !f.startsWith('_');
const files = readdirSync(DIR)
  .filter(isTest)
  .filter((f) => runE2E || !SERVER_TESTS.has(f))
  .sort();

if (!files.length) {
  console.error('Tidak ada test ditemukan di', DIR);
  process.exit(1);
}

const skipped = readdirSync(DIR)
  .filter((f) => isTest(f) && !files.includes(f))
  .map((f) => f.replace(/\.mjs$/, ''));

const results = [];
for (const file of files) {
  const started = process.hrtime.bigint();
  const r = spawnSync(process.execPath, [join(DIR, file)], { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });
  const ms = Number((process.hrtime.bigint() - started) / 1000000n);
  const ok = r.status === 0;
  results.push({ name: file.replace(/\.mjs$/, ''), ok, ms, out: `${r.stdout ?? ''}${r.stderr ?? ''}` });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${file.padEnd(26)} ${ms}ms`);
  if (!ok) process.stdout.write(results.at(-1).out);
}

const failed = results.filter((r) => !r.ok);
if (skipped.length) console.log(`\nSKIP (butuh prasyarat eksternal): ${skipped.join(', ')} — jalankan dengan --e2e`);

console.log(`\n${results.length - failed.length}/${results.length} lulus, ${failed.length} gagal`);
process.exit(failed.length ? 1 : 0);