import { spawn } from 'child_process';
import fs from 'fs';
import os from 'os';
import path from 'path';

export interface AudioEnvelope {
  windowStartSeconds: number;
  windowEndSeconds: number;
  /** RMS loudness 0-100 per 250ms bucket dengan timestamp absolut */
  points: { t: number; value: number }[];
  /** Peak loudness 0-100 dalam window */
  peak: number;
}

function getFfmpegPath(): string {
  const local = path.join(process.cwd(), 'bin', 'ffmpeg.exe');
  if (fs.existsSync(local)) return local;
  return 'ffmpeg';
}

function runProcess(cmd: string, args: string[], timeoutMs: number): Promise<{ code: number | null; stdout: Buffer; stderr: string }> {
  return new Promise((resolve) => {
    const child = spawn(cmd, args, { cwd: process.cwd() });
    const stdoutChunks: Buffer[] = [];
    let stderrData = '';
    child.stdout.on('data', (d: Buffer) => stdoutChunks.push(d));
    child.stderr.on('data', (d: Buffer) => (stderrData += d.toString()));
    const timer = setTimeout(() => {
      try { child.kill(); } catch {}
      resolve({ code: null, stdout: Buffer.concat(stdoutChunks), stderr: stderrData });
    }, timeoutMs);
    child.on('error', (err) => {
      clearTimeout(timer);
      resolve({ code: null, stdout: Buffer.concat(stdoutChunks), stderr: `${stderrData} ${err.message}` });
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      resolve({ code, stdout: Buffer.concat(stdoutChunks), stderr: stderrData });
    });
  });
}

/**
 * Unduh audio saja untuk rentang [startSec, endSec] via yt-dlp --download-sections.
 * Jauh lebih kecil dari download video penuh, biasanya 2-6 MB per 40 detik.
 */
async function downloadAudioWindow(url: string, startSec: number, endSec: number, cookiesPath: string): Promise<string | null> {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'kc-audio-'));
  try {
    const outTemplate = path.join(tmpDir, 'audio.%(ext)s');
    const args = [
      '-m', 'yt_dlp',
      '--download-sections', `*${startSec}-${endSec}`,
      '--force-keyframes-at-cuts',
      '-f', 'ba/bestaudio/bestaudio/best',
      '-o', outTemplate,
      '--no-playlist',
      '--ffmpeg-location', path.dirname(getFfmpegPath()),
      '--retries', '3',
      '--retry-sleep', '2',
    ];
    if (cookiesPath && fs.existsSync(cookiesPath)) args.push('--cookies', cookiesPath);
    args.push(url);

    const res = await runProcess(process.platform === 'win32' ? 'python' : 'python3', args, 90000);
    if (res.code !== 0) {
      console.warn(`[Audio] yt-dlp audio gagal (${res.code}):`, res.stderr.slice(0, 200));
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
      return null;
    }
    const files = fs.readdirSync(tmpDir).filter((f) => f !== 'audio.wav.tmp');
    if (files.length === 0) {
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
      return null;
    }
    return path.join(tmpDir, files[0]);
  } catch (e) {
    console.warn('[Audio] downloadAudioWindow error:', e);
    return null;
  }
}

/**
 * Analisis envelope loudness REAL dari file audio: decode PCM 8kHz mono via ffmpeg,
 * lalu hitung RMS per 250ms bucket.
 */
function decodeEnvelope(filePath: string, startSec: number, endSec: number): Promise<AudioEnvelope | null> {
  return new Promise((resolve) => {
    const ffmpeg = getFfmpegPath();
    const child = spawn(ffmpeg, ['-v', 'error', '-i', filePath, '-ac', '1', '-ar', '8000', '-f', 's16le', '-'], {
      cwd: process.cwd(),
    });
    const chunks: Buffer[] = [];
    let stderr = '';
    child.stdout.on('data', (d: Buffer) => chunks.push(d));
    child.stderr.on('data', (d: Buffer) => (stderr += d.toString()));
    const timer = setTimeout(() => {
      try { child.kill(); } catch {}
      console.warn('[Audio] ffmpeg decode timeout:', stderr.slice(0, 150));
      resolve(null);
    }, 60000);
    child.on('error', () => { clearTimeout(timer); resolve(null); });
    child.on('close', () => {
      clearTimeout(timer);
      try {
        const buf = Buffer.concat(chunks);
        const sampleCount = Math.floor(buf.length / 2);
        if (sampleCount < 1000) {
          console.warn('[Audio] File audio terlalu pendek untuk dianalisis');
          resolve(null);
          return;
        }
        const samplesPerBucket = Math.round(8000 * 0.25); // 250ms
        const points: { t: number; value: number }[] = [];
        for (let b = 0; b < sampleCount / samplesPerBucket; b++) {
          let sumSq = 0;
          const start = b * samplesPerBucket;
          const end = Math.min(start + samplesPerBucket, sampleCount);
          for (let i = start; i < end; i++) {
            const sample = buf.readInt16LE(i * 2) / 32768;
            sumSq += sample * sample;
          }
          const rms = Math.sqrt(sumSq / Math.max(1, end - start));
          const value = Math.min(100, Math.round(rms * 400));
          points.push({
            t: startSec + (b * 0.25) + 0.125,
            value: value < 3 ? 3 : value,
          });
        }
        const peak = Math.max(0, ...points.map((p) => p.value));
        resolve({
          windowStartSeconds: startSec,
          windowEndSeconds: endSec,
          points: points.filter((p) => p.t >= startSec && p.t <= endSec),
          peak,
        });
      } catch (e) {
        console.warn('[Audio] decodeEnvelope error:', e);
        resolve(null);
      }
    });
  });
}

/**
 * Analisis audio asli untuk beberapa window (mis. kandidat highlight).
 * Return map windowKey -> envelope. Window gagal → tidak dimasukkan.
 */
export async function analyzeAudioWindows(
  url: string,
  windows: { startSeconds: number; endSeconds: number }[],
  cookiesPath = ''
): Promise<Map<string, AudioEnvelope>> {
  const result = new Map<string, AudioEnvelope>();
  let tmpDir = '';
  try {
    for (const w of windows) {
      const audioPath = await downloadAudioWindow(url, w.startSeconds, w.endSeconds, cookiesPath);
      if (!audioPath) continue;
      tmpDir = path.dirname(audioPath);
      const env = await decodeEnvelope(audioPath, w.startSeconds, w.endSeconds);
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
      tmpDir = '';
      if (env) {
        result.set(`${w.startSeconds}-${w.endSeconds}`, env);
      }
    }
  } catch (e) {
    console.warn('[Audio] analyzeAudioWindows error:', e);
  } finally {
    if (tmpDir) {
      try { fs.rmSync(tmpDir, { recursive: true, force: true }); } catch {}
    }
  }
  return result;
}
