import crypto from 'node:crypto';
import fs from 'node:fs';
import assert from 'node:assert';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const base = process.env.QA_BASE || 'http://localhost:3100';

function loadEnvSecret() {
  try {
    const env = fs.readFileSync('.env', 'utf8');
    const m = env.match(/^AUTH_SECRET=(.*)$/m);
    if (m) return m[1].trim().replace(/^["']|["']$/g, '');
  } catch {}
  return 'klipchip-dev-secret-change-me';
}

const secret = loadEnvSecret();
const stamp = Date.now();
const user = await prisma.user.create({ data: { email: `qa-t5-${stamp}@test.local`, name: 'T5 User' } });
const ts = Date.now().toString();
const sig = crypto.createHmac('sha256', secret).update(`${user.id}.${ts}`).digest('hex');
const cookie = { Cookie: `kc_session=${user.id}.${ts}.${sig}` };

const pkg = JSON.stringify({
  tiktok: { title: 'Judul TikTok', desc: 'Deskripsi viral', hashtags: ['#gaming', '#fyp'] },
  reels: { title: 'Judul Reels', desc: 'Deskripsi reels', hashtags: ['#reels'] },
  shorts: { title: 'Judul Shorts', desc: 'Deskripsi shorts', hashtags: ['#shorts'] },
});

const clipA = await prisma.clip.create({
  data: {
    userId: user.id, name: 't5-valid', platform: 'youtube', sourceUrl: 'https://www.youtube.com/watch?v=qa',
    videoTitle: 'T5 A', channelName: 'chan', startSeconds: 0, endSeconds: 10, duration: 10,
    status: 'completed', outputFilename: 'dummy.mp4', socialSummary: pkg,
  },
});
const clipB = await prisma.clip.create({
  data: {
    userId: user.id, name: 't5-broken', platform: 'youtube', sourceUrl: 'https://www.youtube.com/watch?v=qa',
    videoTitle: 'T5 B', channelName: 'chan', startSeconds: 0, endSeconds: 10, duration: 10,
    status: 'completed', socialSummary: 'xxx',
  },
});

try {
  const res = await fetch(`${base}/api/clips`, { headers: cookie });
  assert.equal(res.status, 200, `GET /api/clips code=${res.status}`);
  const data = await res.json();
  const a = (data.clips || []).find((c) => c.id === clipA.id);
  const b = (data.clips || []).find((c) => c.id === clipB.id);
  assert.ok(a && a.socialSummary && a.socialSummary.includes('Judul TikTok'), 'payload klip valid memuat socialSummary');
  assert.ok(b && b.socialSummary === 'xxx', 'payload klip rusak tetap terkirim apa adanya');
  console.log('[PASS] GET /api/clips memuat socialSummary non-empty untuk klip berisi');
  console.log('[PASS] payload tidak membuang nilai rusak (keputusan render di UI)');
  console.log('T5 DASHBOARD PAYLOAD: ALL PASS');
} finally {
  await prisma.clip.delete({ where: { id: clipA.id } }).catch(() => {});
  await prisma.clip.delete({ where: { id: clipB.id } }).catch(() => {});
  await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
  await prisma.$disconnect();
}
