import { spawn, execSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync, readdirSync, statSync, rmSync } from 'node:fs';
import { basename, join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { prisma } from '../src/lib/prisma.ts';
import { refundFailedRender } from '../src/lib/refund.ts';
import { summarizeClipForSocial } from '../src/lib/social-summary.ts';

const ROOT = process.cwd();
const STORAGE = join(ROOT, 'storage');
const JOBS_DIR = join(STORAGE, 'jobs');
const MARKERS = [
  ['[Whisper] Mulai transkripsi', 45, 'Transkripsi audio (Whisper)...'],
  ['[Subtitle] Sukses', 55, 'Caption siap, menyiapkan layout...'],
  ['[FFmpeg] Encoding', 75, 'Encoding video vertikal...'],
];

function envInt(name, dflt) {
  const v = Number(process.env[name]);
  return Number.isFinite(v) && v > 0 ? v : dflt;
}

function loadEnvFile() {
  const p = join(ROOT, '.env');
  if (!existsSync(p)) return;
  for (const raw of readFileSync(p, 'utf8').split(/\r?\n/)) {
    const line = raw.trim();
    if (!line || line.startsWith('#')) continue;
    const eq = line.indexOf('=');
    if (eq <= 0) continue;
    const key = line.slice(0, eq).trim();
    let val = line.slice(eq + 1).trim();
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    if (!(key in process.env)) process.env[key] = val;
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

let pythonBinCache = null;
function pythonBin() {
  if (pythonBinCache) return pythonBinCache;
  for (const cand of ['python', 'python3']) {
    try {
      execSync(`${cand} --version`, { stdio: 'ignore' });
      pythonBinCache = cand;
      return cand;
    } catch {}
  }
  throw new Error('Tidak menemukan python/python3 di PATH');
}

function commandFor(workerPath) {
  return workerPath.endsWith('.py') ? pythonBin() : process.execPath;
}

export function killTree(child) {
  if (!child || !child.pid) return;
  if (process.platform === 'win32') {
    try {
      spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
    } catch {}
  } else {
    try {
      process.kill(-child.pid, 'SIGKILL');
    } catch {
      try {
        child.kill('SIGKILL');
      } catch {}
    }
  }
}

function safeParse(v, dflt) {
  if (v == null) return dflt;
  try {
    const o = JSON.parse(v);
    return o ?? dflt;
  } catch {
    return dflt;
  }
}

async function claimNextJob() {
  const candidate = await prisma.clipJob.findFirst({
    where: { status: 'pending' },
    orderBy: { createdAt: 'asc' },
    select: { id: true },
  });
  if (!candidate) return null;
  const claimed = await prisma.clipJob.updateMany({
    where: { id: candidate.id, status: 'pending' },
    data: { status: 'processing', attempts: { increment: 1 }, startedAt: new Date() },
  });
  if (claimed.count !== 1) return null;
  return prisma.clipJob.findUnique({ where: { id: candidate.id }, include: { clip: true } });
}

async function processJob(job) {
  const clip = job.clip;
  const workerPath = resolve(ROOT, process.env.KLIPCHIP_WORKER_PATH || 'scripts/clip_worker.py');
  const outputPath = join(STORAGE, `klipchip_${clip.id}_9x16.mp4`);
  mkdirSync(JOBS_DIR, { recursive: true });
  const jobJsonPath = join(JOBS_DIR, `${clip.id}.json`);
  writeFileSync(
    jobJsonPath,
    JSON.stringify({
      captions: safeParse(clip.captionsJson, []),
      captionConfig: safeParse(clip.captionConfigJson, {}),
      startSeconds: clip.startSeconds,
      endSeconds: clip.endSeconds,
      language: clip.language,
      layout: clip.layout,
      subtitleSource: clip.subtitleSource,
      bilingualSubtitles: clip.bilingualSubtitles === true,
      secondaryLanguage: clip.secondaryLanguage || 'en',
    })
  );
  const cookiesPath = existsSync(join(ROOT, 'cookies.txt')) ? join(ROOT, 'cookies.txt') : '';
  const args = [workerPath, clip.sourceUrl, String(clip.startSeconds), String(clip.endSeconds), outputPath, cookiesPath, jobJsonPath];
  const cmd = commandFor(workerPath);
  console.log(`[runner] claim job=${job.id} clip=${clip.id} worker=${basename(workerPath)} cmd=${cmd}`);
  const child = spawn(cmd, args, { detached: true, stdio: ['ignore', 'pipe', 'pipe'], cwd: ROOT });
  const timeoutMs = envInt('RENDER_TIMEOUT_MS', 900000);
  const throttleMs = envInt('PROGRESS_THROTTLE_MS', 10000);
  let timedOut = false;
  let settled = false;
  let tail = '';
  let lastWrite = 0;
  const timer = setTimeout(() => {
    timedOut = true;
    console.log(`[runner] TIMEOUT job=${job.id} setelah ${Math.round(timeoutMs / 1000)}s -> kill tree pid=${child.pid}`);
    killTree(child);
  }, timeoutMs);
  const onLine = async (line) => {
    tail = (tail + line + '\n').slice(-4000);
    const hit = MARKERS.find(([m]) => line.includes(m));
    if (!hit) return;
    const now = Date.now();
    if (now - lastWrite < throttleMs) return;
    lastWrite = now;
    try {
      await prisma.clip.update({ where: { id: clip.id }, data: { renderProgress: hit[1], renderStep: hit[2] } });
    } catch {}
  };
  let outBuf = '';
  child.stdout.setEncoding('utf8');
  child.stdout.on('data', (chunk) => {
    outBuf += chunk;
    const lines = outBuf.split(/\r?\n/);
    outBuf = lines.pop();
    for (const l of lines) if (l.trim()) void onLine(l);
  });
  let errBuf = '';
  child.stderr.setEncoding('utf8');
  child.stderr.on('data', (chunk) => {
    errBuf += chunk;
    tail = (tail + chunk).slice(-4000);
  });
  return await new Promise((resolveDone) => {
    child.on('close', async (code) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      try {
        if (code === 0 && existsSync(outputPath)) {
          await prisma.$transaction([
            prisma.clipJob.update({ where: { id: job.id }, data: { status: 'completed', error: null, logTail: null, completedAt: new Date() } }),
            prisma.clip.update({
              where: { id: clip.id },
              data: { status: 'completed', renderProgress: 100, renderStep: 'Selesai', outputFilename: basename(outputPath), completedAt: new Date() },
            }),
          ]);
          console.log(`[runner] SELESAI clip=${clip.id}`);
          void summarizeClipForSocial(clip.id).catch(() => {});
          resolveDone({ claimed: true, outcome: 'completed' });
          return;
        }
        const reason = timedOut ? `Render melebihi batas waktu ${Math.round(timeoutMs / 1000)} detik.` : `Worker berhenti dengan kode ${code ?? 'signal'}.`;
        console.log(`[runner] GAGAL clip=${clip.id} reason=${reason}`);
        await refundFailedRender(clip.id, reason);
        await prisma.clipJob.update({
          where: { id: job.id },
          data: { status: 'failed', error: reason, logTail: tail.slice(-2000), completedAt: new Date() },
        });
        resolveDone({ claimed: true, outcome: 'failed', reason });
      } catch (err) {
        console.error(`[runner] error finalize job=${job.id}:`, err);
        resolveDone({ claimed: true, outcome: 'failed', reason: String(err) });
      }
    });
    child.on('error', async (err) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      const reason = `Gagal menjalankan worker: ${err.message}`;
      console.error(`[runner] spawn-error job=${job.id}:`, err.message);
      try {
        await refundFailedRender(clip.id, reason);
        await prisma.clipJob.update({ where: { id: job.id }, data: { status: 'failed', error: reason, logTail: tail.slice(-2000), completedAt: new Date() } });
      } catch {}
      resolveDone({ claimed: true, outcome: 'failed', reason });
    });
  });
}

export async function runOnce() {
  const job = await claimNextJob();
  if (!job) return { claimed: false };
  return processJob(job);
}

export async function runOneSweepTick() {
  const graceMs = envInt('RENDER_TIMEOUT_MS', 900000) * 1.2;
  const cutoff = new Date(Date.now() - graceMs);
  const stuckNull = await prisma.clipJob.updateMany({
    where: { status: 'processing', startedAt: null },
    data: { status: 'pending' },
  });
  if (stuckNull.count > 0) console.log(`[sweep] reset ${stuckNull.count} job tanpa startedAt ke pending`);
  const stale = await prisma.clipJob.findMany({
    where: { status: 'processing', startedAt: { lt: cutoff } },
    select: { id: true, clipId: true },
  });
  for (const job of stale) {
    console.log(`[sweep] recovered stale job ${job.id}`);
    try {
      await refundFailedRender(job.clipId, 'Render dihentikan karena melebihi batas waktu (stale-processing-swept).');
      await prisma.clipJob.update({ where: { id: job.id }, data: { status: 'failed', error: 'stale-processing-swept', completedAt: new Date() } });
    } catch (err) {
      console.error(`[sweep] gagal menyapu job ${job.id}:`, err);
    }
  }
  return { reset: stuckNull.count, swept: stale.length };
}

export async function cleanupStorage() {
  const retentionMs = envInt('RETENTION_DAYS', 7) * 86400000;
  const cutoff = Date.now() - retentionMs;
  let removed = 0;
  const sweepDir = (dir, ext) => {
    if (!existsSync(dir)) return;
    for (const name of readdirSync(dir)) {
      if (!name.endsWith(ext)) continue;
      const p = join(dir, name);
      try {
        const st = statSync(p);
        if (!st.isFile() || st.mtimeMs >= cutoff) continue;
        rmSync(p);
        removed++;
        console.log('[retention] removed %s', p);
      } catch {}
    }
  };
  sweepDir(JOBS_DIR, '.json');
  sweepDir(STORAGE, '.mp4');
  return { removed };
}

async function main() {
  loadEnvFile();
  await prisma.$queryRawUnsafe('PRAGMA journal_mode=WAL');
  await runOneSweepTick();
  console.log('[runner] render-runner aktif (POLL_MS=%d, RENDER_TIMEOUT_MS=%d)', envInt('POLL_MS', 5000), envInt('RENDER_TIMEOUT_MS', 900000));
  let lastSweep = Date.now();
  let lastCleanup = Date.now();
  while (true) {
    if (Date.now() - lastSweep >= envInt('SWEEP_INTERVAL_MS', 60000)) {
      lastSweep = Date.now();
      try {
        await runOneSweepTick();
      } catch (err) {
        console.error('[runner] sweep error:', err);
      }
    }
    if (Date.now() - lastCleanup >= envInt('CLEANUP_INTERVAL_MS', 86400000)) {
      lastCleanup = Date.now();
      try {
        await cleanupStorage();
      } catch (err) {
        console.error('[runner] cleanup error:', err);
      }
    }
    let r;
    try {
      r = await runOnce();
    } catch (err) {
      console.error('[runner] tick error:', err);
      r = { claimed: false };
    }
    if (!r.claimed) await sleep(envInt('POLL_MS', 5000));
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
