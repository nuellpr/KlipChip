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
const rand = Math.random().toString(36).slice(2, 7);
const user = await prisma.user.create({ data: { email: `qa-t2-${stamp}-${rand}@test.local`, name: 'T2 User' } });
const ts = Date.now().toString();
const sig = crypto.createHmac('sha256', secret).update(`${user.id}.${ts}`).digest('hex');
const cookie = `kc_session=${user.id}.${ts}.${sig}`;

const body = (extra) => JSON.stringify({
  name: `t2-${rand}`,
  platform: 'youtube',
  sourceUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  externalId: 'dQw4w9WgXcQ',
  videoTitle: 'T2 Title',
  channelName: 'chan',
  thumbnailUrl: '',
  sourceDurationSec: 100,
  startSeconds: 0,
  endSeconds: 10,
  captions: [],
  priceIdr: 500,
  ...extra,
});

async function postClip(extra) {
  const res = await fetch(`${base}/api/clips`, {
    method: 'POST',
    headers: { Cookie: cookie, 'Content-Type': 'application/json' },
    body: body(extra),
  });
  const data = await res.json().catch(() => ({}));
  return { code: res.status, clip: data.clip };
}

try {
  const a = await postClip({ bilingualSubtitles: true, secondaryLanguage: 'ja' });
  assert.ok(a.code === 200 || a.code === 201, `happy POST code=${a.code}`);
  assert.strictEqual(a.clip.bilingualSubtitles, true, 'happy bilingual true');
  assert.strictEqual(a.clip.secondaryLanguage, 'ja', 'happy lang ja');

  const list = await fetch(`${base}/api/clips`, { headers: { Cookie: cookie } });
  const listData = await list.json();
  const found = (listData.clips || []).find((c) => c.id === a.clip.id);
  assert.ok(found, 'clip ada di GET /api/clips');
  assert.strictEqual(found.bilingualSubtitles, true, 'GET membalikkan bilingual true');
  assert.strictEqual(found.secondaryLanguage, 'ja', 'GET membalikkan lang ja');
  console.log('[PASS] happy: bilingual=true lang=ja tersimpan & dibalikkan GET');

  const b = await postClip({ bilingualSubtitles: 'yes', secondaryLanguage: 'xx' });
  assert.strictEqual(b.clip.bilingualSubtitles, false, "string 'yes' -> false");
  assert.strictEqual(b.clip.secondaryLanguage, 'en', "lang 'xx' -> default en");
  console.log('[PASS] koersi ketat: string truthy -> false, lang tak valid -> en');

  const c = await postClip({});
  assert.strictEqual(c.clip.bilingualSubtitles, false, 'tanpa field -> false');
  assert.strictEqual(c.clip.secondaryLanguage, 'en', 'tanpa field -> en');
  console.log('[PASS] body tanpa field baru: default aman');

  console.log('T2 API: ALL PASS');
} finally {
  await prisma.user.delete({ where: { id: user.id } }).catch(() => {});
  await prisma.$disconnect();
}
