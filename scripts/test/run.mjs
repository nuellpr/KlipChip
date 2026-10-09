// Runner suite: node scripts/test/run.mjs [--e2e]
//
// Semua file di folder ini adalah skrip mandiri: *.mjs memakai node:assert,
// test_*.py memakai assert Python polos -- tanpa test framework sama sekali.
//
// Test ber-prasyarat eksternal dilewati kecuali --e2e / QA_E2E=1:
//   - bilingual-api, dashboard-social -> butuh dev server di QA_BASE (default http://localhost:3100)
//   - e2e-bilingual           -> butuh python + clip_worker.py + ffmpeg
// Test Python butuh interpreter python3/python; kalau tidak ada, dilewati
// dengan alasan jelas supaya CI tetap hijau (dan tidak gagal misterius).
import { spawnSync } from 'node:child_process';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

const DIR = import.meta.dirname;
const SERVER_TESTS = new Set(['bilingual-api.mjs', 'dashboard-social.mjs', 'e2e-bilingual.mjs']);
const runE2E = process.argv.includes('--e2e') || process.env.QA_E2E === '1';

// Test meng-import file .ts langsung (type stripping bawaan Node), jadi Node
// sisi ini harus >= 23.6. Node versi lama gagal dengan
// ERR_UNKNOWN_FILE_EXTENSION yang tidak menjelaskan apa pun.
const [nodeMajor, nodeMinor] = process.versions.node.split('.').map(Number);
if (nodeMajor < 23 || (nodeMajor === 23 && nodeMinor < 6)) {
  console.error(
    `Node ${process.versions.node} terlalu lama untuk suite ini.\n` +
    'Test meng-import src/lib/*.ts langsung, yang butuh Node >= 23.6 ' +
    '(type stripping tanpa flag).\n' +
    'Pakai Node dari .nvmrc, contoh: nvm install && nvm use'
  );
  process.exit(1);
}

const isJsTest = (f) => f.endsWith('.mjs') && f !== 'run.mjs' && !f.startsWith('_');
const isPyTest = (f) => f.endsWith('.py') && /^test_.*\.py$/.test(f);

const all = readdirSync(DIR).filter((f) => isJsTest(f) || isPyTest(f)).sort();
const selected = all.filter((f) => runE2E || !SERVER_TESTS.has(f));
const skipped = all.filter((f) => !selected.includes(f));

// Cari interpreter Python sekali saja. `python3` dulu karena itu yang ada di runner CI;
// `python` cadangan untuk Windows yang tidak menyediakan alias python3.
function findPython() {
  for (const candidate of ['python3', 'python']) {
    const probe = spawnSync(candidate, ['--version'], { encoding: 'utf8', stdio: 'ignore' });
    if (probe.status === 0) return candidate;
  }
  return null;
}

const python = findPython();
const pyFiles = selected.filter(isPyTest);
const jsFiles = selected.filter(isJsTest);

if (!pyFiles.length && !jsFiles.length) {
  console.error('Tidak ada test ditemukan di', DIR);
  process.exit(1);
}

if (pyFiles.length && !python) {
  console.error(`SKIP  test Python (${pyFiles.length}) — tidak ada python3/python di PATH`);
  for (const f of pyFiles) skipped.push(f);
}

const results = [];
const runOne = (file, bin, args) => {
  const started = process.hrtime.bigint();
  const r = spawnSync(bin, args, { stdio: ['ignore', 'pipe', 'pipe'], encoding: 'utf8' });
  const ms = Number((process.hrtime.bigint() - started) / 1000000n);
  const ok = r.status === 0;
  const name = file.replace(/\.(mjs|py)$/, '');
  results.push({ name, ok, ms, out: `${r.stdout ?? ''}${r.stderr ?? ''}` });
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${file.padEnd(26)} ${ms}ms`);
  if (!ok) process.stdout.write(results.at(-1).out);
};

for (const file of [...jsFiles, ...(python ? pyFiles : [])]) {
  runOne(
    file,
    file.endsWith('.py') ? python : process.execPath,
    [join(DIR, file)]
  );
}

const failed = results.filter((r) => !r.ok);
if (skipped.length) {
  console.log(`\nSKIP (butuh prasyarat eksternal): ${skipped.map((f) => f.replace(/\.(mjs|py)$/, '')).join(', ')}`);
  console.log('Jalankan dengan --e2e saat dev server / python + ffmpeg tersedia.');
}

console.log(`\n${results.length - failed.length}/${results.length} lulus, ${failed.length} gagal`);
process.exit(failed.length ? 1 : 0);
