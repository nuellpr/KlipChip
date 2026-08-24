import { CaptionLine, SlangEntry, TranscriptSegment } from './types';
import { INITIAL_SLANG_DICTIONARY } from '@/data/slang-dictionary';
import { buildCaptionsFromTranscript } from './transcript-analysis';

export function formatTimestamp(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  const hrs = Math.floor(mins / 60);

  if (hrs > 0) {
    const remainMins = mins % 60;
    return `${hrs}:${remainMins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

export function formatDuration(seconds: number): string {
  if (seconds < 60) return `${Math.round(seconds)}d`;
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  if (secs === 0) return `${mins}m`;
  return `${mins}m ${secs}d`;
}

export function normalizeSlangInText(rawText: string, customSlangs: SlangEntry[] = []): {
  normalizedText: string;
  matchedSlangs: string[];
} {
  const dictionary = [...INITIAL_SLANG_DICTIONARY, ...customSlangs];
  let normalized = rawText;
  const matchedSlangs: string[] = [];

  for (const item of dictionary) {
    const regex = new RegExp(`\\b${item.slang}\\b`, 'gi');
    if (regex.test(normalized)) {
      matchedSlangs.push(item.slang);
      normalized = normalized.replace(regex, item.normalized);
    }
  }

  return {
    normalizedText: normalized,
    matchedSlangs,
  };
}

export function getActiveCaption(captions: CaptionLine[], currentAbsoluteSeconds: number): {
  activeLine: CaptionLine | null;
  activeWordIndex: number;
} {
  if (!captions || captions.length === 0) {
    return { activeLine: null, activeWordIndex: -1 };
  }

  const activeLine = captions.find(
    (c) => currentAbsoluteSeconds >= c.startSeconds && currentAbsoluteSeconds <= c.endSeconds
  );

  if (!activeLine) {
    return { activeLine: null, activeWordIndex: -1 };
  }

  const offsetInLine = currentAbsoluteSeconds - activeLine.startSeconds;
  let activeWordIndex = -1;

  for (let i = 0; i < activeLine.words.length; i++) {
    const w = activeLine.words[i];
    if (offsetInLine >= w.startOffset && offsetInLine <= w.endOffset) {
      activeWordIndex = i;
      break;
    }
  }

  // If between words, keep the latest word that started
  if (activeWordIndex === -1 && activeLine.words.length > 0) {
    for (let i = activeLine.words.length - 1; i >= 0; i--) {
      if (offsetInLine >= activeLine.words[i].startOffset) {
        activeWordIndex = i;
        break;
      }
    }
  }

  return { activeLine, activeWordIndex };
}

export function generateAutoCaptionsForCustomTime(
  startSec: number,
  endSec: number,
  customText?: string,
  transcriptSegments?: TranscriptSegment[]
): CaptionLine[] {
  const duration = Math.max(5, endSec - startSec);

  // Real captions dari transcript asli (SRT) jika tersedia
  if (transcriptSegments && transcriptSegments.length > 0) {
    const real = buildCaptionsFromTranscript(transcriptSegments, startSec, endSec, 'c-tr');
    if (real.length > 0) return real;
  }

  const midSec = startSec + duration / 2;

  if (customText && customText.trim().length > 0) {
    const words = customText.trim().split(/\s+/);
    const wordCount = words.length;
    const timePerWord = duration / wordCount;

    return [
      {
        id: `c-gen-custom-1`,
        startSeconds: startSec,
        endSeconds: endSec,
        text: customText,
        words: words.map((w, idx) => ({
          word: w,
          startOffset: Number((idx * timePerWord).toFixed(1)),
          endOffset: Number(((idx + 1) * timePerWord).toFixed(1)),
          isSlang: ['bjir', 'ggwp', 'clutch', 'gokil', 'anjir', 'rata'].some(s => w.toLowerCase().includes(s)),
        })),
        confidence: 95,
        hasSlang: true,
      }
    ];
  }

  return [
    {
      id: `c-gen-1`,
      startSeconds: startSec,
      endSeconds: midSec,
      text: 'Momen seru livestream gaming Indonesia terdeteksi audio spike!',
      words: [
        { word: 'Momen', startOffset: 0.0, endOffset: 0.8 },
        { word: 'seru', startOffset: 0.9, endOffset: 1.5 },
        { word: 'livestream', startOffset: 1.6, endOffset: 2.4 },
        { word: 'gaming', startOffset: 2.5, endOffset: 3.1 },
        { word: 'Indonesia', startOffset: 3.2, endOffset: 4.2 },
        { word: 'terdeteksi', startOffset: 4.3, endOffset: 5.2 },
        { word: 'audio', startOffset: 5.3, endOffset: 5.8 },
        { word: 'spike!', startOffset: 5.9, endOffset: (midSec - startSec) },
      ],
      confidence: 96,
      hasSlang: false,
    },
    {
      id: `c-gen-2`,
      startSeconds: midSec,
      endSeconds: endSec,
      text: 'GOKIL GGWP! Rata lu semua momen clutch paling hype!',
      words: [
        { word: 'GOKIL', startOffset: 0.0, endOffset: 0.9, isSlang: true, normalizedFrom: 'gokil' },
        { word: 'GGWP!', startOffset: 1.0, endOffset: 2.0, isSlang: true, normalizedFrom: 'ggwp' },
        { word: 'Rata', startOffset: 2.1, endOffset: 2.8, isSlang: true, normalizedFrom: 'rata' },
        { word: 'lu', startOffset: 2.9, endOffset: 3.4, isSlang: true, normalizedFrom: 'lu' },
        { word: 'semua', startOffset: 3.5, endOffset: 4.2 },
        { word: 'momen', startOffset: 4.3, endOffset: 5.0 },
        { word: 'clutch', startOffset: 5.1, endOffset: 5.8, isSlang: true, normalizedFrom: 'clutch' },
        { word: 'paling', startOffset: 5.9, endOffset: 6.5 },
        { word: 'hype!', startOffset: 6.6, endOffset: (endSec - midSec) },
      ],
      confidence: 98,
      hasSlang: true,
    }
  ];
}
