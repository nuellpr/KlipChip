import { strict as assert } from 'node:assert';
import { readFileSync } from 'node:fs';
import { createServer } from 'node:http';
import { join, resolve } from 'node:path';

const ROOT = resolve(import.meta.dirname, '../..');
if (!process.env.DATABASE_URL) {
  for (const line of readFileSync(join(ROOT, '.env'), 'utf8').split(/\r?\n/)) {
    const m = line.match(/^\s*DATABASE_URL\s*=\s*"?([^"\r\n]+)"?\s*$/);
    if (m) { process.env.DATABASE_URL = m[1]; break; }
  }
}

const stamp = Date.now();
let mode = 'ok';
const server = createServer((req, res) => {
  let body = '';
  req.on('data', (c) => { body += c; });
  req.on('end', () => {
    if (mode === 'fail500') { res.writeHead(500); res.end(); return; }
    if (mode === 'broken') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ choices: [{ message: { content: 'BUKAN JSON{{{' } }] }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    const pkg = {
      tiktok: { title: `T${stamp}`, desc: 'd'.repeat(600).slice(0, 500), hashtags: Array.from({ length: 15 }, (_, i) => `#t${i}`) },
      reels: { title: 'R', desc: 'D', hashtags: ['#reels'] },
      shorts: { title: 'S', desc: 'D', hashtags: ['#shorts'] },
    };
    res.end(JSON.stringify({ choices: [{ message: { content: JSON.stringify(pkg) } }] }));
  });
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;

process.env.FORGE_API_KEY = 'qa-key';
process.env.FORGE_BASE_URL = `http://127.0.0.1:${port}/v1`;
const { prisma } = await import('../../src/lib/prisma.ts');
const { summarizeClipForSocial } = await import('../../src/lib/social-summary.ts');

async function seedClip() {
  const user = await prisma.user.create({ data: { email: `qa-t4-${stamp}-${Math.random().toString(36).slice(2)}@test.local`, name: 'T4' } });
  const clip = await prisma.clip.create({
    data: {
      userId: user.id, name: 'T4 Clip', platform: 'youtube', sourceUrl: 'https://www.youtube.com/watch?v=qa',
      videoTitle: 'T4 Title', channelName: 'chan', startSeconds: 0, endSeconds: 10, duration: 10,
      status: 'completed',
      captionsJson: JSON.stringify([{ startSeconds: 0, endSeconds: 2, text: 'halo gais' }]),
    },
  });
  return { user, clip };
}
async function wipe(r) {
  await prisma.clip.delete({ where: { id: r.clip.id } }).catch(() => {});
  await prisma.user.delete({ where: { id: r.user.id } }).catch(() => {});
}

try {
  // Happy: paket valid -> true, kolom terisi, clamp bekerja
  mode = 'ok';
  let r = await seedClip();
  assert.equal(await summarizeClipForSocial(r.clip.id), true, 'happy harus true');
  const afterA = await prisma.clip.findUnique({ where: { id: r.clip.id } });
  const pkg = JSON.parse(afterA.socialSummary);
  assert.ok(pkg.tiktok && pkg.reels && pkg.shorts, '3 platform ada');
  assert.ok(pkg.tiktok.desc.length <= 500 && pkg.tiktok.hashtags.length <= 10, 'clamp bekerja');
  console.log('[PASS] happy: JSON 3 platform tersimpan + clamp');
  await wipe(r);

  // Failure: Forge 500 terus -> false, kolom tetap ''
  mode = 'fail500';
  r = await seedClip();
  assert.equal(await summarizeClipForSocial(r.clip.id), false, '500 harus false');
  assert.equal((await prisma.clip.findUnique({ where: { id: r.clip.id } })).socialSummary, '', 'kolom tetap kosong');
  console.log('[PASS] 500 -> false + kolom kosong');

  // Failure: JSON rusak -> false
  mode = 'broken';
  r = await seedClip();
  assert.equal(await summarizeClipForSocial(r.clip.id), false, 'JSON rusak harus false');
  console.log('[PASS] JSON rusak -> false');

  // Failure: tanpa API key -> false tanpa panggil jaringan
  delete process.env.FORGE_API_KEY;
  r = await seedClip();
  assert.equal(await summarizeClipForSocial(r.clip.id), false, 'tanpa key harus false');
  console.log('[PASS] tanpa FORGE_API_KEY -> false (skip total)');
  process.env.FORGE_API_KEY = 'qa-key';

  console.log('T4 SOCIAL: ALL PASS');
} finally {
  server.close();
  await prisma.$disconnect();
}
