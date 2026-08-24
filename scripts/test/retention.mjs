import { strict as assert } from 'node:assert';
import { writeFileSync, existsSync, rmSync, mkdirSync, utimesSync } from 'node:fs';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '../..');
const { cleanupStorage } = await import('../../scripts/render-runner.mjs');

const STORAGE = join(ROOT, 'storage');
const JOBS = join(STORAGE, 'jobs');
const old = Date.now() - 10 * 86400000;
const f1 = join(JOBS, 'qa-retention-old.json');
const f2 = join(STORAGE, 'qa-retention-old.mp4');
const f3 = join(JOBS, 'qa-retention-fresh.json');
const f4 = join(STORAGE, 'qa-retention-fresh.mp4');
const f5 = join(STORAGE, 'qa-retention-old.txt');
const fixtures = [f1, f2, f3, f4, f5];

try {
  mkdirSync(JOBS, { recursive: true });
  writeFileSync(f1, '{}'); utimesSync(f1, new Date(old), new Date(old));
  writeFileSync(f2, 'OLDMP4'); utimesSync(f2, new Date(old), new Date(old));
  writeFileSync(f3, '{}');
  writeFileSync(f4, 'FRESHMP4');
  writeFileSync(f5, 'KEEPME'); utimesSync(f5, new Date(old), new Date(old));

  const r = await cleanupStorage();
  assert.ok(!existsSync(f1), 'job json lama terhapus');
  assert.ok(!existsSync(f2), 'mp4 lama terhapus');
  assert.ok(existsSync(f3), 'job json segar bertahan');
  assert.ok(existsSync(f4), 'mp4 segar bertahan');
  assert.ok(existsSync(f5), 'ekstensi non-target tidak disentuh');
  console.log(`PASS retention: lama terhapus, segar + .txt aman (removed=${r.removed})`);
} finally {
  for (const f of fixtures) rmSync(f, { force: true });
}
