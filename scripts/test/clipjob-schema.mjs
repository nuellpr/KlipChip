// QA for todo #1: ClipJob schema — valid FK insert works, bogus clipId rejected with P2003.
import { PrismaClient } from '@prisma/client';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

if (!process.env.DATABASE_URL) {
  for (const line of readFileSync('.env', 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*([A-Z_]+)\s*=\s*(.*)\s*$/);
    if (m) process.env[m[1]] ??= m[2].replace(/^["']|["']$/g, '');
  }
}

const prisma = new PrismaClient();
let user, clip;
try {
  user = await prisma.user.create({ data: { email: `qa-${Date.now()}@test.local`, name: 'QA' } });
  clip = await prisma.clip.create({ data: {
    userId: user.id, name: 'qa', platform: 'youtube', sourceUrl: 'https://youtu.be/qa',
    videoTitle: 'qa', channelName: 'qa', startSeconds: 0, endSeconds: 1, duration: 1,
  } });
  const job = await prisma.clipJob.create({ data: { clipId: clip.id } });
  assert.equal(job.status, 'pending');
  assert.equal(job.attempts, 0);
  await assert.rejects(
    () => prisma.clipJob.create({ data: { clipId: 'bogus-nonexistent' } }),
    (e) => e.code === 'P2003',
  );
  console.log('PASS');
} finally {
  if (clip) await prisma.clip.delete({ where: { id: clip.id } }).catch(() => {});
  if (user) await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
  await prisma.$disconnect();
}
