import { strict as assert } from 'node:assert';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { readFileSync } from 'node:fs';

const ROOT = resolve(import.meta.dirname, '../..');
if (!process.env.DATABASE_URL) {
  for (const line of readFileSync(join(ROOT, '.env'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*DATABASE_URL\s*=\s*"?([^"\r\n]+)"?\s*$/);
    if (m) { process.env.DATABASE_URL = m[1]; break; }
  }
}
const { prisma } = await import('../../src/lib/prisma.ts');
const { runOnce } = await import('../../scripts/render-runner.mjs');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const stamp = Date.now();
let user, clip, job;
const tmp = mkdtempSync(join(tmpdir(), 'runner-qa-'));
const fakeSuccess = join(tmp, 'fake-success.mjs');
const fakeHang = join(tmp, 'fake-hang.mjs');
function ensureFakes() {
  mkdirSync(tmp, { recursive: true });
  writeFileSync(fakeSuccess, `
import { writeFileSync } from 'node:fs';
console.log('[Whisper] Mulai transkripsi');
await new Promise(r => setTimeout(r, 150));
console.log('[Subtitle] Sukses');
await new Promise(r => setTimeout(r, 150));
console.log('[FFmpeg] Encoding');
await new Promise(r => setTimeout(r, 150));
writeFileSync(process.argv[5], 'MP4DUMMY');
process.exit(0);
`);
  writeFileSync(fakeHang, `
console.log('[Whisper] Mulai transkripsi');
setTimeout(() => {}, 60000);
`);
}

async function seed(status) {
  user = await prisma.user.create({ data: { email: `qa-runner-${stamp}-${Math.random().toString(36).slice(2)}@test.local`, name: 'QA Runner', balanceClips: 5 } });
  clip = await prisma.clip.create({ data: { userId: user.id, name: 'QA Runner Clip', platform: 'youtube', sourceUrl: 'https://www.youtube.com/watch?v=qa', videoTitle: 'QA Title', channelName: 'QA Channel', startSeconds: 0, endSeconds: 10, duration: 10, status } });
  job = await prisma.clipJob.create({ data: { clipId: clip.id, status: 'pending' } });
}

async function cleanup() {
  if (clip) await prisma.clip.delete({ where: { id: clip.id } }).catch(() => {});
  if (user) await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
  rmSync(tmp, { recursive: true, force: true });
}

try {
  process.env.PROGRESS_THROTTLE_MS = '50';
  process.env.RENDER_TIMEOUT_MS = '60000';
  process.env.KLIPCHIP_WORKER_PATH = fakeSuccess;
  ensureFakes();

  console.log('== Skenario A: worker sukses ==');
  await seed('paid');
  const beforeA = (await prisma.user.findUnique({ where: { id: user.id } })).balanceClips;
  let maxSeen = 0;
  const pending = runOnce();
  for (;;) {
    const c = await prisma.clip.findUnique({ where: { id: clip.id } });
    if (!c) break;
    if (c.renderProgress > maxSeen && c.renderProgress < 100) maxSeen = c.renderProgress;
    if (c.status === 'completed' || c.status === 'failed') break;
    await sleep(40);
  }
  const resA = await pending;
  assert.equal(resA.outcome, 'completed', 'A outcome completed');
  const afterA = await prisma.clip.findUnique({ where: { id: clip.id } });
  assert.equal(afterA.status, 'completed', 'A clip completed');
  assert.equal(afterA.renderProgress, 100, 'A progress 100');
  assert.ok(afterA.outputFilename && afterA.outputFilename.includes(clip.id), 'A outputFilename set');
  assert.ok(maxSeen >= 75, `A progress mencapai tahap encoding (maxSeen=${maxSeen})`);
  const cjA = await prisma.clipJob.findUnique({ where: { id: job.id } });
  assert.equal(cjA.status, 'completed', 'A clipjob completed');
  assert.equal((await prisma.user.findUnique({ where: { id: user.id } })).balanceClips, beforeA, 'A saldo tidak berubah');
  console.log('PASS A: completed chain + progress 45/55/75 terlihat + saldo utuh');

  console.log('== Skenario B: worker hang -> timeout kill + refund sekali ==');
  await cleanup(); user = clip = job = undefined;
  process.env.KLIPCHIP_WORKER_PATH = fakeHang;
  process.env.RENDER_TIMEOUT_MS = '3000';
  ensureFakes();
  await seed('paid');
  const beforeB = (await prisma.user.findUnique({ where: { id: user.id } })).balanceClips;
  const t0 = Date.now();
  const resB = await runOnce();
  const dt = Date.now() - t0;
  assert.equal(resB.outcome, 'failed', 'B outcome failed');
  assert.ok(dt < 20000, `B selesai cepat setelah kill (${dt}ms)`);
  const afterB = await prisma.clip.findUnique({ where: { id: clip.id } });
  assert.equal(afterB.status, 'failed', 'B clip failed');
  const balB = (await prisma.user.findUnique({ where: { id: user.id } })).balanceClips;
  assert.equal(balB, beforeB + 1, `B refund tepat sekali (${beforeB} -> ${balB})`);
  const cjB = await prisma.clipJob.findUnique({ where: { id: job.id } });
  assert.equal(cjB.status, 'failed', 'B clipjob failed');
  assert.ok(cjB.error && /batas waktu|timeout/i.test(cjB.error), 'B error menyebut batas waktu');
  console.log(`PASS B: hang dibunuh ${dt}ms, refund sekali (${beforeB}->${balB}), job failed`);

  console.log('ALL PASS');
} finally {
  await cleanup();
}
