import { strict as assert } from 'node:assert';
import { spawnSync } from 'node:child_process';
import { existsSync, readFileSync, rmSync, statSync, copyFileSync } from 'node:fs';
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
let mode = 'translate';
const forgeCalls = [];
const server = createServer((req, res) => {
  let body = '';
  req.on('data', (c) => { body += c; });
  req.on('end', () => {
    forgeCalls.push(mode);
    if (mode === 'fail500') { res.writeHead(500); res.end(); return; }
    const parsed = JSON.parse(body);
    const prompt = parsed.messages?.[0]?.content || '';
    res.writeHead(200, { 'Content-Type': 'application/json' });
    if (/Translate each numbered subtitle line/.test(prompt)) {
      const out = prompt.split('\n').filter((l) => /\d+\.\| /.test(l))
        .map((l) => l.replace(/^(\d+)\.\| .*/, '$1.| TERJEMAHAN'))
        .join('\n');
      res.end(JSON.stringify({ choices: [{ message: { content: out } }] }));
    } else {
      res.end(JSON.stringify({ choices: [{ message: { content: JSON.stringify({
        tiktok: { title: `TT ${stamp}`, desc: 'Desc TT', hashtags: ['#fyp'] },
        reels: { title: `RL ${stamp}`, desc: 'Desc RL', hashtags: ['#reels'] },
        shorts: { title: `SH ${stamp}`, desc: 'Desc SH', hashtags: ['#shorts'] },
      }) } }] }));
    }
  });
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
// ai-provider.ts prioritise OPENROUTER_* di atas FORGE_*, dan env tingkat OS bisa
// menimpa apa pun. Stub harus pakai nama berprioritas tinggi.
process.env.OPENROUTER_API_KEY = 'qa-key';
process.env.OPENROUTER_BASE_URL = `http://127.0.0.1:${server.address().port}/v1`;
delete process.env.FORGE_API_KEY;
delete process.env.FORGE_BASE_URL;

const { prisma } = await import('../../src/lib/prisma.ts');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const STORAGE = join(ROOT, 'storage');

function ffmpegPath() {
  const r = spawnSync('python', ['-c', "import sys; sys.path.insert(0, 'scripts'); from clip_worker import get_ffmpeg_path; print(get_ffmpeg_path())"], { cwd: ROOT, encoding: 'utf8' });
  if (r.error || r.status !== 0) {
    throw new Error(`python tidak bisa dijalankan (${r.error?.message ?? `exit ${r.status}`}): ${(r.stderr ?? '').trim().slice(-300)}`);
  }
  return r.stdout.trim().split(/\r?\n/).filter(Boolean).pop();
}

const created = { users: [], clips: [], files: [] };
async function cleanup() {
  for (const id of created.clips) {
    await prisma.clip.delete({ where: { id } }).catch(() => {});
    rmSync(join(STORAGE, 'jobs', `${id}.json`), { force: true });
  }
  for (const f of created.files) rmSync(f, { force: true });
  for (const id of created.users) await prisma.user.delete({ where: { id } }).catch(() => {});
}

try {
  const user = await prisma.user.create({ data: { email: `qa-f3e-${stamp}@test.local`, name: 'F3E' } });
  created.users.push(user.id);
  const caps = [
    { id: 'c1', startSeconds: 0, endSeconds: 3, text: 'halo gais', words: [], confidence: 90, hasSlang: false },
    { id: 'c2', startSeconds: 3, endSeconds: 6, text: 'ini klip keren', words: [], confidence: 90, hasSlang: false },
    { id: 'c3', startSeconds: 6, endSeconds: 9, text: 'sampai jumpa', words: [], confidence: 90, hasSlang: false },
  ];
  const clip = await prisma.clip.create({
    data: {
      userId: user.id, name: `f3e-${stamp}`, platform: 'youtube',
      sourceUrl: 'https://www.youtube.com/watch?v=FIXTURE', videoTitle: 'F3E Title', channelName: 'chan',
      startSeconds: 0, endSeconds: 10, duration: 10, status: 'paid',
      captionsJson: JSON.stringify(caps), language: 'auto', layout: 'auto', subtitleSource: 'manual',
      bilingualSubtitles: true, secondaryLanguage: 'en',
    },
  });
  created.clips.push(clip.id);
  await prisma.clipJob.create({ data: { clipId: clip.id, status: 'pending' } });

  // Fixture video lokal menggantikan hasil yt-dlp (worker memakai file yang sudah ada)
  const fp = ffmpegPath();
  assert.ok(fp && existsSync(fp), `ffmpeg tidak ditemukan: ${fp}`);
  const rawPath = join(STORAGE, `klipchip_${clip.id}_9x16_raw.mp4`);
  created.files.push(rawPath, join(STORAGE, `klipchip_${clip.id}_9x16.ass.snapshot`), join(STORAGE, `klipchip_${clip.id}_9x16.mp4`));
  const gen = spawnSync(fp, ['-y', '-f', 'lavfi', '-i', 'testsrc=duration=12:size=640x360:rate=24', '-f', 'lavfi', '-i', 'sine=frequency=440:duration=12', '-shortest', rawPath], { encoding: 'utf8' });
  assert.ok(existsSync(rawPath) && statSync(rawPath).size > 10000, `fixture gagal: ${gen.stderr?.slice(-200)}`);
  console.log('[PASS] fixture video lokal siap (12s + audio)');

  const { runOnce } = await import('../../scripts/render-runner.mjs');
  process.env.KLIPCHIP_WORKER_PATH = join(ROOT, 'scripts', 'test', 'ass_snapshot_worker.py');
  const pending = runOnce();
  let final = null;
  for (;;) {
    const c = await prisma.clip.findUnique({ where: { id: clip.id } });
    if (!c || c.status === 'completed' || c.status === 'failed') { final = c; break; }
    await sleep(300);
  }
  await pending;
  assert.equal(final.status, 'completed', `render harus completed, dapat ${final.status}`);

  // .ass asli dihapus worker pasca-burn; snapshot wrapper QA menyimpan salinannya
  const assPath = join(STORAGE, `klipchip_${clip.id}_9x16.ass.snapshot`);
  assert.ok(existsSync(assPath), '.ass tidak ada');
  const ass = readFileSync(assPath, 'utf8');
  assert.ok(ass.includes('Style: CaptionSub'), '.ass tanpa Style CaptionSub');
  const layer1 = ass.split('\n').filter((l) => l.startsWith('Dialogue: 1,'));
  assert.equal(layer1.length, 3, `harus 3 Dialogue Layer-1, dapat ${layer1.length}`);
  assert.ok(layer1.every((l) => l.includes('TERJEMAHAN')), 'track terjemahan kosong');
  console.log('[PASS] .ass memuat Style CaptionSub + 3 Dialogue Layer-1 berisi terjemahan');

  const outPath = join(STORAGE, `klipchip_${clip.id}_9x16.mp4`);
  assert.ok(existsSync(outPath) && statSync(outPath).size > 10000, 'mp4 output tidak ada/terlalu kecil');
  const dur = spawnSync(fp, ['-i', outPath], { encoding: 'utf8' });
  const m = (dur.stderr || '').match(/Duration: (\d+):(\d+):([\d.]+)/);
  const secs = m ? (+m[1]) * 3600 + (+m[2]) * 60 + (+m[3]) : -1;
  assert.ok(secs >= 9 && secs <= 13, `durasi ${secs}s harus ~10s`);
  console.log(`[PASS] mp4 ada, durasi ${secs}s (~window 10s)`);

  await sleep(1500);
  const after = await prisma.clip.findUnique({ where: { id: clip.id } });
  assert.ok(after.socialSummary.includes('TT ') && after.socialSummary.includes('shorts'), 'socialSummary tidak terisi pasca-render');
  console.log('[PASS] ringkasan sosmed otomatis terisi setelah render sukses');

  mode = 'fail500';
  console.log('F3 E2E BILINGUAL: ALL PASS');

  // Skenario gagal: Forge mati total -> render tetap completed single-track
  const user2 = await prisma.user.create({ data: { email: `qa-f3e2-${stamp}@test.local`, name: 'F3E2' } });
  created.users.push(user2.id);
  const clip2 = await prisma.clip.create({
    data: {
      userId: user2.id, name: `f3e2-${stamp}`, platform: 'youtube',
      sourceUrl: 'https://www.youtube.com/watch?v=FIXTURE', videoTitle: 'F3E2', channelName: 'chan',
      startSeconds: 0, endSeconds: 10, duration: 10, status: 'paid',
      captionsJson: JSON.stringify(caps), subtitleSource: 'manual',
      bilingualSubtitles: true, secondaryLanguage: 'en',
    },
  });
  created.clips.push(clip2.id);
  created.files.push(
    join(STORAGE, `klipchip_${clip2.id}_9x16_raw.mp4`),
    join(STORAGE, `klipchip_${clip2.id}_9x16.ass.snapshot`),
    join(STORAGE, `klipchip_${clip2.id}_9x16.mp4`),
  );
  await prisma.clipJob.create({ data: { clipId: clip2.id, status: 'pending' } });
  copyFileSync(outPath, join(STORAGE, `klipchip_${clip2.id}_9x16_raw.mp4`));
  const p2 = runOnce();
  let f2 = null;
  for (;;) {
    const c = await prisma.clip.findUnique({ where: { id: clip2.id } });
    if (!c || c.status === 'completed' || c.status === 'failed') { f2 = c; break; }
    await sleep(300);
  }
  await p2;
  assert.equal(f2.status, 'completed', 'Forge 500: render tetap completed');
  const ass2 = join(STORAGE, `klipchip_${clip2.id}_9x16.ass.snapshot`);
  const ass2txt = existsSync(ass2) ? readFileSync(ass2, 'utf8') : '';
  assert.ok(ass2txt.includes('Dialogue: 0,'), 'Forge 500: caption utama tetap ter-burn');
  assert.ok(!ass2txt.includes('Style: CaptionSub'), 'Forge 500: tidak boleh ada track sub');
  await sleep(1200);
  const after2 = await prisma.clip.findUnique({ where: { id: clip2.id } });
  assert.equal(after2.socialSummary, '', 'Forge 500: socialSummary tetap kosong');
  console.log('[PASS] degrade: Forge mati -> completed single-track + summary kosong, proses hidup');
} finally {
  await cleanup();
  server.close();
  await prisma.$disconnect();
}
