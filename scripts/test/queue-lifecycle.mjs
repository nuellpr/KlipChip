import { readFileSync, writeFileSync, mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import assert from 'node:assert';

if (!process.env.DATABASE_URL) {
  try {
    const env = readFileSync(resolve(process.cwd(), '.env'), 'utf8');
    const m = env.match(/^DATABASE_URL\s*=\s*(.+)$/m);
    if (m) process.env.DATABASE_URL = m[1].trim().replace(/^["']|["']$/g, '');
  } catch {}
}

const { prisma } = await import('../../src/lib/prisma.ts');
const { runOnce, runOneSweepTick } = await import('../../scripts/render-runner.mjs');

let tmp = null;

function ensureFakes() {
  if (!tmp) tmp = mkdtempSync(join(tmpdir(), 'lifecycle-qa-'));
  writeFileSync(
    join(tmp, 'fake-success.mjs'),
    [
      "import { writeFileSync } from 'node:fs';",
      "console.log('[Whisper] Mulai transkripsi');",
      "setTimeout(() => console.log('[Subtitle] Sukses'), 120);",
      "setTimeout(() => { console.log('[FFmpeg] Encoding'); writeFileSync(process.argv[5], 'MP4DUMMY'); process.exit(0); }, 240);",
    ].join('\n')
  );
  writeFileSync(
    join(tmp, 'fake-hang.mjs'),
    ["console.log('[Whisper] Mulai transkripsi');", 'setTimeout(() => {}, 60000);'].join('\n')
  );
}

async function seed(clipStatus) {
  const stamp = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const user = await prisma.user.create({
    data: { email: `qa-lc-${stamp}@test.local`, name: 'QA Lifecycle', balanceClips: 5 },
  });
  const clip = await prisma.clip.create({
    data: {
      userId: user.id,
      name: 'QA Lifecycle Klip',
      platform: 'youtube',
      sourceUrl: 'https://www.youtube.com/watch?v=qalifecycle',
      videoTitle: 'QA Lifecycle Video',
      channelName: 'QA Channel',
      startSeconds: 0,
      endSeconds: 10,
      duration: 10,
      status: clipStatus,
    },
  });
  return { user, clip };
}

async function cleanupFixtures({ userIds = [], clipIds = [] } = {}) {
  for (const id of clipIds) await prisma.clip.deleteMany({ where: { id } });
  for (const id of userIds) await prisma.user.deleteMany({ where: { id } });
}

async function main() {
  let trackedUsers = [];
  let trackedClips = [];

  try {
    ensureFakes();
    const fakeSuccess = join(tmp, 'fake-success.mjs');
    const fakeHang = join(tmp, 'fake-hang.mjs');

    process.env.PROGRESS_THROTTLE_MS = '50';

    console.log('== Skenario A: enqueue -> runOnce(fake-success) -> completed ==');
    process.env.KLIPCHIP_WORKER_PATH = fakeSuccess;
    process.env.RENDER_TIMEOUT_MS = '60000';
    const a = await seed('paid');
    trackedUsers.push(a.user.id);
    trackedClips.push(a.clip.id);
    await prisma.clipJob.create({ data: { clipId: a.clip.id, status: 'pending' } });
    const rA = await runOnce();
    assert.strictEqual(rA.outcome, 'completed', 'A: outcome harus completed');
    const clipA = await prisma.clip.findUnique({ where: { id: a.clip.id } });
    const jobA = await prisma.clipJob.findUnique({ where: { clipId: a.clip.id } });
    const userA = await prisma.user.findUnique({ where: { id: a.user.id } });
    assert.strictEqual(clipA.status, 'completed', 'A: clip completed');
    assert.strictEqual(clipA.renderProgress, 100, 'A: progress 100');
    assert.ok(clipA.outputFilename && clipA.outputFilename.includes(a.clip.id.slice(0, 8)), 'A: outputFilename terisi');
    assert.ok(clipA.completedAt instanceof Date, 'A: completedAt terisi');
    assert.strictEqual(jobA.status, 'completed', 'A: ClipJob completed');
    assert.strictEqual(userA.balanceClips, 5, 'A: saldo tidak berubah saat sukses');
    console.log('PASS A');

    console.log('== Skenario B: fake-hang -> timeout kill + refund tepat sekali ==');
    process.env.KLIPCHIP_WORKER_PATH = fakeHang;
    process.env.RENDER_TIMEOUT_MS = '3000';
    const b = await seed('paid');
    trackedUsers.push(b.user.id);
    trackedClips.push(b.clip.id);
    await prisma.clipJob.create({ data: { clipId: b.clip.id, status: 'pending' } });
    const t0 = Date.now();
    const rB = await runOnce();
    const dt = Date.now() - t0;
    assert.strictEqual(rB.outcome, 'failed', 'B: outcome harus failed');
    assert.ok(dt < 20000, `B: harus dibunuh cepat, dt=${dt}ms`);
    const clipB = await prisma.clip.findUnique({ where: { id: b.clip.id } });
    const jobB = await prisma.clipJob.findUnique({ where: { clipId: b.clip.id } });
    const userB = await prisma.user.findUnique({ where: { id: b.user.id } });
    assert.strictEqual(clipB.status, 'failed', 'B: clip failed');
    assert.strictEqual(userB.balanceClips, 6, 'B: refund tepat sekali (5->6)');
    assert.strictEqual(jobB.status, 'failed', 'B: ClipJob failed');
    assert.match(jobB.error || '', /batas waktu|timeout/i, 'B: pesan timeout');
    console.log(`PASS B (hang dibunuh ${dt}ms, refund sekali 5->6)`);

    console.log('== Skenario C: baris stale -> sweeper gagalkan + refund sekali ==');
    delete process.env.KLIPCHIP_WORKER_PATH;
    process.env.RENDER_TIMEOUT_MS = '60000';
    const c = await seed('processing');
    trackedUsers.push(c.user.id);
    trackedClips.push(c.clip.id);
    await prisma.clipJob.create({
      data: {
        clipId: c.clip.id,
        status: 'processing',
        attempts: 1,
        startedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      },
    });
    const resC = await runOneSweepTick();
    assert.ok(resC.swept >= 1, 'C: minimal 1 job tersapu');
    const jobC = await prisma.clipJob.findUnique({ where: { clipId: c.clip.id } });
    const clipC = await prisma.clip.findUnique({ where: { id: c.clip.id } });
    const userC = await prisma.user.findUnique({ where: { id: c.user.id } });
    assert.strictEqual(jobC.status, 'failed', 'C: ClipJob failed');
    assert.strictEqual(jobC.error, 'stale-processing-swept', 'C: error stale-processing-swept');
    assert.strictEqual(clipC.status, 'failed', 'C: clip failed');
    assert.strictEqual(userC.balanceClips, 6, 'C: refund tepat sekali (5->6)');
    await runOneSweepTick();
    const userC2 = await prisma.user.findUnique({ where: { id: c.user.id } });
    assert.strictEqual(userC2.balanceClips, 6, 'C: tick kedua TIDAK refund lagi (idempoten)');
    console.log('PASS C');

    console.log('ALL PASS');
  } finally {
    await cleanupFixtures({ userIds: trackedUsers, clipIds: trackedClips }).catch(() => {});
    if (tmp) rmSync(tmp, { recursive: true, force: true });
    await prisma.$disconnect().catch(() => {});
  }
}

main().catch((err) => {
  console.error('FAIL:', err && err.message ? err.message : err);
  process.exit(1);
});
