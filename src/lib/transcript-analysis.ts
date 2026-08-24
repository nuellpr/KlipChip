import { CaptionLine, TranscriptSegment } from './types';
import { INITIAL_SLANG_DICTIONARY } from '@/data/slang-dictionary';

const SLANG_WORDS = new Set(
  INITIAL_SLANG_DICTIONARY.flatMap((s) => s.slang.toLowerCase().split(/\s+/).filter(Boolean))
);

const SLANG_PHRASES = INITIAL_SLANG_DICTIONARY.map((s) => s.slang.toLowerCase()).sort(
  (a, b) => b.length - a.length
);

const BIN_SECONDS = 5;
const WINDOW_MIN_SECONDS = 15;

export function tokenize(segments: TranscriptSegment[], startSec: number, endSec: number): string[] {
  const words: string[] = [];
  for (const s of segments) {
    if (s.endSeconds < startSec || s.startSeconds > endSec) continue;
    for (const w of s.text.toLowerCase().split(/\s+/)) {
      const clean = w.replace(/[^a-z0-9\u00C0-\u024F]/gi, '');
      if (clean.length > 1) words.push(clean);
    }
  }
  return words;
}

function countSlangs(text: string): string[] {
  const lower = ` ${text.toLowerCase()} `;
  const hits: string[] = [];
  for (const phrase of SLANG_PHRASES) {
    if (phrase.includes(' ') && lower.includes(` ${phrase} `)) hits.push(phrase);
  }
  for (const word of lower.split(/\s+/)) {
    const clean = word.replace(/[^a-z0-9\u00C0-\u024F]/gi, '');
    if (SLANG_WORDS.has(clean)) hits.push(clean);
  }
  return [...new Set(hits)];
}

interface BinScore {
  binStart: number;
  wordDensity: number;
  slangCount: number;
  score: number;
}

/** Skor hype per 5-detik-bin berdasarkan densitas kata & slang asli dari transcript. */
export function scoreTranscriptBins(segments: TranscriptSegment[], videoDuration: number): BinScore[] {
  const bins: BinScore[] = [];
  for (let t = 0; t < videoDuration; t += BIN_SECONDS) {
    const segs = segments.filter((s) => s.endSeconds > t && s.startSeconds < t + BIN_SECONDS);
    const words = tokenize(segments, t, t + BIN_SECONDS);
    const slangCount = countSlangs(segs.map((s) => s.text).join(' ')).length;
    bins.push({
      binStart: t,
      wordDensity: words.length / BIN_SECONDS,
      slangCount,
      score: 0,
    });
  }
  const maxDensity = Math.max(1, ...bins.map((b) => b.wordDensity));
  const maxSlang = Math.max(1, ...bins.map((b) => b.slangCount));
  for (const b of bins) {
    const normDensity = b.wordDensity / maxDensity;
    const normSlang = b.slangCount / maxSlang;
    b.score = Math.round((normDensity * 0.5 + normSlang * 0.5) * 100);
  }
  return bins;
}

export interface HeuristicWindow {
  startSeconds: number;
  endSeconds: number;
  score: number;
  evidence: number;
}

/**
 * Pilih window momen terbaik secara data-driven dari transcript:
 * geser window 30 detik (step 10s), sum skor bin, ambil top N tanpa overlap.
 */
export function selectHighlightWindows(
  segments: TranscriptSegment[],
  videoDuration: number,
  count = 3,
  windowLen = 30
): HeuristicWindow[] {
  if (segments.length === 0) return [];
  // Adaptasikan panjang window untuk video pendek agar tetap proporsional
  windowLen = Math.min(windowLen, Math.max(10, Math.floor(videoDuration / Math.max(1, count))));
  const bins = scoreTranscriptBins(segments, videoDuration);

  const candidates: HeuristicWindow[] = [];
  const step = Math.min(10, Math.max(5, windowLen / 3));
  for (let t = 0; t + windowLen <= videoDuration; t += step) {
    const overlap = bins.filter((b) => b.binStart >= t && b.binStart < t + windowLen);
    if (overlap.length === 0) continue;
    const score = Math.round(
      overlap.reduce((acc, b) => acc + b.score, 0) / overlap.length
    );
    const denseBin = overlap.reduce((a, b) => (b.wordDensity > a.wordDensity ? b : a), overlap[0]);
    candidates.push({
      startSeconds: t,
      endSeconds: t + windowLen,
      score,
      evidence: denseBin.binStart,
    });
  }
  candidates.sort((a, b) => b.score - a.score);

  const selected: HeuristicWindow[] = [];
  for (const cand of candidates) {
    const overlap = selected.some(
      (s) => cand.startSeconds < s.endSeconds && cand.endSeconds > s.startSeconds
    );
    if (!overlap) selected.push(cand);
    if (selected.length >= count) break;
  }

  return selected.map((w) => {
    const start = Math.max(0, Math.min(w.startSeconds, videoDuration - windowLen));
    return { ...w, startSeconds: start, endSeconds: start + windowLen };
  });
}

/** Deskripsi data-driven dari isi sebuah window transcript (untuk title/desc/tags). */
export function describeWindow(segments: TranscriptSegment[], startSec: number, endSec: number, channelName: string) {
  const inWindow = segments.filter(
    (s) => s.endSeconds > startSec && s.startSeconds < endSec
  );
  const fullText = inWindow.map((s) => s.text).join(' ');
  const slangs = countSlangs(fullText);
  const words = tokenize(segments, startSec, endSec);
  const topWords = [...new Set(words)].slice(0, 4).map((w) => w.charAt(0).toUpperCase() + w.slice(1));

  let hourglassTitle = `Puncak reaksi ${inWindow.length > 0 ? (inWindow[0].text.trim().split(/\s+/).slice(0, 6).join(' ')) : 'momen'}`;
  hourglassTitle = hourglassTitle.replace(/[.,!?;:]+$/, '');
  if (hourglassTitle.length > 48) hourglassTitle = hourglassTitle.slice(0, 45).trim() + '...';
  if (!hourglassTitle || hourglassTitle.length < 8) hourglassTitle = `Momen Seru di ${channelName}`;

  const tags: string[] = [];
  if (slangs.length > 0) tags.push(...slangs.map((s) => s.toUpperCase()).slice(0, 2));
  if (words.length > 0) tags.push('Chat Hype');
  if (tags.length === 0) tags.push('Momen Seru');

  return {
    title: hourglassTitle,
    tags,
    description: `Rangkuman dari transcript: "${inWindow.length ? inWindow.slice(0, 2).map((s) => s.text.trim()).join(' ').slice(0, 120) : ''}" — ${
      slangs.length > 0 ? `${slangs.length} slang terdeteksi di window ini.` : 'Momen dengan intensitas chat tertinggi.'
    }`,
  };
}

/** Bangun CaptionLine asli dari segmen transcript yang tumpang tindih dengan window. */
export function buildCaptionsFromTranscript(
  segments: TranscriptSegment[],
  startSec: number,
  endSec: number,
  idPrefix = 'tr'
): CaptionLine[] {
  const result: CaptionLine[] = [];
  for (const s of segments) {
    if (s.endSeconds < startSec || s.startSeconds > endSec) continue;
    const absStart = Math.max(startSec, s.startSeconds);
    const absEnd = Math.min(endSec, s.endSeconds);
    if (absEnd - absStart < 0.35) continue;

    const cleanText = s.text.replace(/<[^>]+>/g, ' ').trim();
    if (!cleanText) continue;

    const toks = cleanText.split(/\s+/);
    const per = (absEnd - absStart) / Math.max(1, toks.length);
    const words = toks.map((tok, i) => {
      const clean = tok.replace(/[^a-z0-9\u00C0-\u024F]/gi, '').toLowerCase();
      const isSlang = SLANG_PHRASES.includes(clean) || SLANG_WORDS.has(clean);
      return {
        word: tok,
        startOffset: Number((i * per).toFixed(2)),
        endOffset: Number(((i + 1) * per).toFixed(2)),
        isSlang: isSlang || undefined,
        ...(isSlang ? { normalizedFrom: clean } : {}),
      };
    });

    result.push({
      id: `${idPrefix}-${Math.round(absStart * 1000)}-${result.length}`,
      startSeconds: Math.round(absStart * 100) / 100,
      endSeconds: Math.round(absEnd * 100) / 100,
      text: cleanText,
      words,
      confidence: 88,
      hasSlang: words.some((w) => w.isSlang),
    });
  }
  return result;
}

/** Estimasi aktivitas chat (msg/s) per bucket dari kepadatan kata transcript asli. */
export function buildChatVelocity(segments: TranscriptSegment[], videoDuration: number, points = 40): number[] {
  const bucketSize = videoDuration / points;
  const out: number[] = [];
  for (let i = 0; i < points; i++) {
    const t = i * bucketSize;
    const words = tokenize(segments, t, t + bucketSize);
    const perSec = (words.length / Math.max(1, bucketSize)) * 6;
    out.push(Math.min(160, Math.round(perSec)));
  }
  return out;
}

/**
 * Waveform 40 titik: nilai RMS ASLI di dalam window yang berhasil dianalisis,
 * di luar window → estimasi dari kepadatan transcript (speech density).
 */
export function buildWaveform(
  videoDuration: number,
  envWindows: Map<string, { points: { t: number; value: number }[] }>,
  segments: TranscriptSegment[],
  points = 40
): number[] {
  const bucketSize = videoDuration / points;
  const out: number[] = [];
  for (let i = 0; i < points; i++) {
    const t = i * bucketSize + bucketSize / 2;
    let value = 0;
    for (const env of envWindows.values()) {
      const near = env.points.find((p) => Math.abs(p.t - t) <= bucketSize / 2);
      if (near) {
        value = Math.max(value, near.value);
      }
    }
    if (value === 0 && segments.length > 0) {
      const words = tokenize(segments, t - bucketSize / 2, t + bucketSize / 2);
      value = Math.min(80, 12 + words.length * 4);
    }
    out.push(value === 0 ? 8 : Math.min(100, Math.round(value)));
  }
  return out;
}
