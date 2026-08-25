'use client';

import React, { useState, useEffect } from 'react';
import { 
  Play, 
  Pause, 
  Palette, 
  ArrowRight, 
  ArrowLeft, 
  Edit3, 
  Flame, 
  Volume2,
  VolumeX,
  Layers
} from 'lucide-react';
import { CaptionConfig, CaptionLine, CaptionStyle, CaptionPosition, SourceVideo, LanguageCode, LayoutMode, SubtitleSource } from '@/lib/types';
import { getActiveCaption, formatTimestamp } from '@/lib/caption-engine';

const LAYOUT_OPTIONS: { id: LayoutMode; label: string; desc: string }[] = [
  { id: 'auto', label: 'Auto', desc: 'Face tracking, fallback tengah' },
  { id: 'fit_blur', label: 'Fit Penuh + Blur', desc: 'Video utuh + latar blur' },
  { id: 'crop_1_1_blur', label: 'Crop 1:1 + Blur', desc: 'Persegi tengah + latar blur' },
  { id: 'split', label: 'Split', desc: 'Belah kiri-kanan' },
  { id: 'gameplay', label: 'Gameplay', desc: 'Center crop penuh' },
  { id: 'face', label: 'Face', desc: 'Ikuti wajah' },
];

const SUBTITLE_SOURCES: { id: SubtitleSource; label: string; desc: string }[] = [
  { id: 'auto', label: 'Otomatis (Whisper)', desc: 'Transkripsi AI otomatis' },
  { id: 'whisper', label: 'Whisper AI', desc: 'Transkripsi paksa via Whisper' },
  { id: 'youtube', label: 'Caption YouTube', desc: 'Gunakan subtitle bawaan' },
  { id: 'manual', label: 'Manual (Edit Saya)', desc: 'Pakai teks yang diedit' },
  { id: 'none', label: 'Tanpa Subtitle', desc: 'Video bersih tanpa teks' },
];

interface StepVideoEditorProps {
  video: SourceVideo;
  startSeconds: number;
  endSeconds: number;
  initialCaptions: CaptionLine[];
  initialLanguage: LanguageCode;
  initialLayout: LayoutMode;
  initialSubtitleSource: SubtitleSource;
  onProceedToCheckout: (
    captions: CaptionLine[],
    config: CaptionConfig,
    meta?: { language?: LanguageCode; layout?: LayoutMode; subtitleSource?: SubtitleSource; bilingualSubtitles?: boolean; secondaryLanguage?: string }
  ) => void;
  onBack: () => void;
}

export function StepVideoEditor({
  video,
  startSeconds,
  endSeconds,
  initialCaptions,
  initialLanguage,
  initialLayout,
  initialSubtitleSource,
  onProceedToCheckout,
  onBack,
}: StepVideoEditorProps) {
  const duration = Math.max(5, endSeconds - startSeconds);

  // Playback state
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTimeOffset, setCurrentTimeOffset] = useState(0); // 0 to duration
  const [isMuted, setIsMuted] = useState(false);
  const [framingMode, setFramingMode] = useState<'center' | 'split' | 'facecam'>('center');

  // Render options
  const [language] = useState<LanguageCode>(initialLanguage);
  const [layout, setLayout] = useState<LayoutMode>(initialLayout);
  const [subtitleSource, setSubtitleSource] = useState<SubtitleSource>(initialSubtitleSource);
  const [bilingualSubtitles, setBilingualSubtitles] = useState(false);
  const [secondaryLanguage, setSecondaryLanguage] = useState('en');

  // Captions state
  const [captions, setCaptions] = useState<CaptionLine[]>(initialCaptions);
  const [editingLineId, setEditingLineId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState('');

  // Caption styling state
  const [captionConfig, setCaptionConfig] = useState<CaptionConfig>({
    style: 'hormozi',
    position: 'bottom',
    fontSize: 'lg',
    textColor: '#FFFFFF',
    highlightColor: '#FACC15',
    showBackgroundBox: true,
    uppercase: true,
  });

  // Playback loop
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp = performance.now();

    const loop = (now: number) => {
      if (isPlaying) {
        const delta = (now - lastTimestamp) / 1000;
        setCurrentTimeOffset((prev) => {
          const next = prev + delta;
          if (next >= duration) {
            return 0; // loop
          }
          return next;
        });
      }
      lastTimestamp = now;
      if (isPlaying) {
        animationFrameId = requestAnimationFrame(loop);
      }
    };

    if (isPlaying) {
      lastTimestamp = performance.now();
      animationFrameId = requestAnimationFrame(loop);
    }

    return () => cancelAnimationFrame(animationFrameId);
  }, [isPlaying, duration]);

  // Current absolute time for caption matching
  const currentAbsoluteTime = startSeconds + currentTimeOffset;
  const { activeLine, activeWordIndex } = getActiveCaption(captions, currentAbsoluteTime);

  // Handle caption edit save
  const handleSaveCaptionEdit = (lineId: string) => {
    setCaptions((prev) =>
      prev.map((c) => {
        if (c.id === lineId) {
          const words = editingText.trim().split(/\s+/);
          const dur = c.endSeconds - c.startSeconds;
          const timePerWord = dur / Math.max(1, words.length);

          return {
            ...c,
            text: editingText,
            words: words.map((w, idx) => ({
              word: w,
              startOffset: Number((idx * timePerWord).toFixed(1)),
              endOffset: Number(((idx + 1) * timePerWord).toFixed(1)),
              isSlang: ['bjir', 'ggwp', 'clutch', 'gokil', 'anjir', 'rata', 'bocil'].some((s) =>
                w.toLowerCase().includes(s)
              ),
            })),
          };
        }
        return c;
      })
    );
    setEditingLineId(null);
  };

  const handleStartEdit = (line: CaptionLine) => {
    setEditingLineId(line.id);
    setEditingText(line.text);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-brand-500/20 text-brand-300 border border-brand-500/30 px-2 py-0.5 text-xs font-bold">
              Langkah 3 dari 5
            </span>
            <span className="text-xs text-zinc-400">• Studio Video 9:16 & Caption</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
            Editor Video & Auto-Caption Slang
          </h2>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs text-zinc-400 bg-zinc-900 border border-white/10 px-3 py-1.5 rounded-xl font-mono">
            Durasi: {duration}s ({formatTimestamp(startSeconds)} - {formatTimestamp(endSeconds)})
          </span>
        </div>
      </div>

      {/* Main Studio Grid: Left Player (9:16) & Right Control Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: 9:16 Vertical Video Studio Player (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="relative w-[300px] sm:w-[320px] aspect-[9/16] rounded-[36px] p-2 bg-gradient-to-b from-zinc-700 via-zinc-900 to-black border-[3px] border-zinc-700 shadow-2xl shadow-brand-500/30 overflow-hidden flex flex-col justify-between">
            {/* Phone Notch */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 h-4 w-28 bg-black rounded-full z-30 flex items-center justify-center">
              <div className="h-2 w-2 rounded-full bg-zinc-800" />
            </div>

            {/* Screen Area */}
            <div className="relative h-full w-full rounded-[28px] overflow-hidden bg-black flex flex-col justify-between p-3 select-none">
              {/* Background Video Player (Live YouTube iframe or HTML5 Video or Thumbnail) */}
              {video.externalId && isPlaying ? (
                <div className="absolute inset-0 overflow-hidden bg-black flex items-center justify-center">
                  <iframe
                    className="absolute h-[130%] w-[380%] max-w-none object-cover pointer-events-none"
                    src={`https://www.youtube.com/embed/${video.externalId}?autoplay=1&start=${Math.floor(startSeconds + currentTimeOffset)}&controls=0&mute=${isMuted ? 1 : 0}&enablejsapi=1&rel=0&loop=1`}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    title="Live YouTube Playback"
                  />
                </div>
              ) : video.videoBlobUrl ? (
                <video
                  src={video.videoBlobUrl}
                  className="absolute inset-0 h-full w-full object-cover"
                  autoPlay={isPlaying}
                  muted={isMuted}
                  loop
                />
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={video.thumbnailUrl}
                  alt={video.title}
                  className={`absolute inset-0 h-full w-full object-cover transition-all duration-300 ${
                    framingMode === 'facecam'
                      ? 'object-left scale-150'
                      : framingMode === 'split'
                      ? 'object-center scale-125'
                      : 'object-center scale-110'
                  } brightness-90`}
                />
              )}

              {/* Gradient overlays for readability */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/85 pointer-events-none" />

              {/* Top Bar inside Player */}
              <div className="relative z-20 pt-3 flex items-center justify-between">
                <div className="flex items-center gap-1.5 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] font-bold text-white">
                  <Flame className="h-3 w-3 text-cyan-400" />
                  <span>9:16 HD</span>
                </div>
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="rounded-full bg-black/60 p-1.5 text-zinc-300 hover:text-white"
                >
                  {isMuted ? <VolumeX className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
                </button>
              </div>

              {/* Center Play/Pause Click Handler */}
              <div
                onClick={() => setIsPlaying(!isPlaying)}
                className="relative z-10 my-auto flex flex-col items-center justify-center cursor-pointer group"
              >
                <div className="h-16 w-16 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                  {isPlaying ? <Pause className="h-7 w-7" /> : <Play className="h-7 w-7 ml-1" />}
                </div>
              </div>

              {/* Caption Overlay Container based on position */}
              <div
                className={`relative z-20 transition-all ${
                  captionConfig.position === 'top'
                    ? 'mb-auto pt-6'
                    : captionConfig.position === 'middle'
                    ? 'my-auto'
                    : 'mt-auto pb-4'
                }`}
              >
                {activeLine ? (
                  <div
                    className={`rounded-2xl p-2.5 text-center transition-all ${
                      captionConfig.showBackgroundBox
                        ? 'bg-black/80 backdrop-blur-md border border-white/15 shadow-xl'
                        : ''
                    }`}
                  >
                    <div
                      className={`font-black tracking-wide leading-tight ${
                        captionConfig.fontSize === 'sm'
                          ? 'text-xs'
                          : captionConfig.fontSize === 'md'
                          ? 'text-sm'
                          : captionConfig.fontSize === 'lg'
                          ? 'text-base sm:text-lg'
                          : 'text-xl'
                      }`}
                    >
                      {activeLine.words.map((w, idx) => {
                        const isCurrentWord = idx === activeWordIndex;
                        const wordText = captionConfig.uppercase ? w.word.toUpperCase() : w.word;
                        const style = captionConfig.style;

                        if (style === 'hormozi') {
                          return (
                            <span
                              key={idx}
                              className={`inline-block mx-0.5 transition-all duration-150 ${
                                isCurrentWord
                                  ? 'scale-115 font-black drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]'
                                  : w.isSlang
                                  ? 'text-cyan-300'
                                  : 'text-white'
                              }`}
                              style={{
                                color: isCurrentWord
                                  ? captionConfig.highlightColor
                                  : w.isSlang
                                  ? '#38bdf8'
                                  : captionConfig.textColor,
                              }}
                            >
                              {wordText}{' '}
                            </span>
                          );
                        }

                        if (style === 'neon') {
                          return (
                            <span
                              key={idx}
                              className="inline-block mx-0.5 text-emerald-300 drop-shadow-[0_0_10px_rgba(16,185,129,0.9)]"
                            >
                              {wordText}{' '}
                            </span>
                          );
                        }

                        if (style === 'punchy') {
                          return (
                            <span
                              key={idx}
                              className="inline-block mx-0.5 text-rose-400 drop-shadow-[0_0_6px_rgba(0,0,0,1)] font-extrabold"
                            >
                              {wordText}{' '}
                            </span>
                          );
                        }

                        if (style === 'smart-bg-focus') {
                          return (
                            <span
                              key={idx}
                              className={`inline-block mx-0.5 px-1.5 py-0.5 rounded transition-all duration-150 ${
                                isCurrentWord
                                  ? 'bg-cyan-500/30 text-white font-bold scale-105'
                                  : w.isSlang
                                  ? 'bg-purple-500/20 text-cyan-300'
                                  : 'bg-zinc-800/50 text-zinc-200'
                              }`}
                            >
                              {wordText}{' '}
                            </span>
                          );
                        }

                        if (style === 'box-highlight') {
                          return (
                            <span
                              key={idx}
                              className={`inline-block mx-0.5 px-1 py-0.5 border-2 rounded transition-all duration-150 ${
                                isCurrentWord
                                  ? `border-${captionConfig.highlightColor} bg-${captionConfig.highlightColor}/20 text-white`
                                  : 'border-zinc-600 text-zinc-300'
                              }`}
                              style={{
                                borderColor: isCurrentWord ? captionConfig.highlightColor : '#3f3f46',
                                backgroundColor: isCurrentWord ? captionConfig.highlightColor + '33' : 'transparent',
                              }}
                            >
                              {wordText}{' '}
                            </span>
                          );
                        }

                        if (style === 'word-focus') {
                          return (
                            <span
                              key={idx}
                              className={`inline-block mx-0.5 transition-all duration-150 ${
                                isCurrentWord
                                  ? 'text-4xl font-black text-white drop-shadow-[0_0_20px_rgba(255,255,255,0.4)]'
                                  : w.isSlang
                                  ? 'text-base text-cyan-400'
                                  : 'text-base text-zinc-400'
                              }`}
                            >
                              {wordText}{' '}
                            </span>
                          );
                        }

                        if (style === 'underline-focus') {
                          return (
                            <span
                              key={idx}
                              className={`inline-block mx-0.5 transition-all duration-150 ${
                                isCurrentWord
                                  ? 'text-white font-bold border-b-4 border-cyan-400 pb-0.5'
                                  : w.isSlang
                                  ? 'text-cyan-300 border-b border-cyan-700'
                                  : 'text-zinc-300 border-b border-zinc-700'
                              }`}
                            >
                              {wordText}{' '}
                            </span>
                          );
                        }

                        if (style === 'gradient-glow') {
                          const hue = (idx / activeLine.words.length) * 360;
                          return (
                            <span
                              key={idx}
                              className="inline-block mx-0.5 font-bold"
                              style={{
                                color: `hsl(${hue}, 80%, 60%)`,
                                textShadow: `0 0 20px hsl(${hue}, 80%, 50%, 0.6)`,
                              }}
                            >
                              {wordText}{' '}
                            </span>
                          );
                        }

                        if (style === 'game-streamer') {
                          return (
                            <span
                              key={idx}
                              className={`inline-block mx-0.5 font-extrabold transition-all duration-150 ${
                                isCurrentWord
                                  ? 'text-white drop-shadow-[0_0_20px_rgba(244,63,94,0.9)] scale-105'
                                  : 'text-rose-400 drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]'
                              }`}
                              style={{
                                WebkitTextStroke: isCurrentWord ? '1px #000' : '0.5px #000',
                              }}
                            >
                              {wordText}{' '}
                            </span>
                          );
                        }

                        // Clean fallback
                        return (
                          <span
                            key={idx}
                            className="inline-block mx-0.5 text-white drop-shadow"
                          >
                            {wordText}{' '}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <div className="text-center text-[10px] text-zinc-500 py-1">
                    (Tidak ada caption pada detik ini)
                  </div>
                )}
              </div>

              {/* Bottom Playback Progress Bar */}
              <div className="relative z-20 space-y-1 pt-2">
                <input
                  type="range"
                  min={0}
                  max={duration}
                  step={0.1}
                  value={currentTimeOffset}
                  onChange={(e) => setCurrentTimeOffset(Number(e.target.value))}
                  className="w-full h-1.5 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
                />
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono">
                  <span>{formatTimestamp(currentAbsoluteTime)}</span>
                  <span>{Math.round(currentTimeOffset)}s / {Math.round(duration)}s</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Framing Options below player */}
          <div className="mt-4 flex items-center gap-2 bg-zinc-900 border border-white/10 p-1.5 rounded-2xl text-xs">
            <span className="text-[11px] text-zinc-400 px-2 font-medium">Framing:</span>
            <button
              onClick={() => setFramingMode('center')}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                framingMode === 'center'
                  ? 'bg-brand-600 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Tengah
            </button>
            <button
              onClick={() => setFramingMode('facecam')}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                framingMode === 'facecam'
                  ? 'bg-brand-600 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Fokus Kiri
            </button>
            <button
              onClick={() => setFramingMode('split')}
              className={`px-3 py-1 rounded-xl font-bold transition-all ${
                framingMode === 'split'
                  ? 'bg-brand-600 text-white'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Zoom Fit
            </button>
          </div>
        </div>

        {/* Right Column: Customization Controls & Inline Caption Editor (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tab 0: Mode Layout & Sumber Subtitle */}
          <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6 space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Layers className="h-4 w-4 text-purple-400" />
                <span>Mode Layout & Sumber Subtitle</span>
              </h3>
            </div>

            {/* Layout modes */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Mode Layout Video</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {LAYOUT_OPTIONS.map((lo) => (
                  <button
                    key={lo.id}
                    onClick={() => setLayout(lo.id)}
                    className={`rounded-xl px-3 py-2 text-left transition-all border ${
                      layout === lo.id
                        ? 'border-purple-400 bg-purple-500/10 ring-1 ring-purple-400'
                        : 'border-white/10 bg-zinc-950/60 hover:bg-zinc-800'
                    }`}
                  >
                    <p className={`text-xs font-bold ${layout === lo.id ? 'text-purple-300' : 'text-white'}`}>
                      {lo.label}
                    </p>
                    <p className="text-[10px] text-zinc-400">{lo.desc}</p>
                  </button>
                ))}
              </div>
            </div>

            {/* Subtitle source */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Sumber Subtitle</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {SUBTITLE_SOURCES.map((ss) => (
                  <button
                    key={ss.id}
                    onClick={() => setSubtitleSource(ss.id)}
                    className={`rounded-xl px-3 py-2 text-left transition-all border ${
                      subtitleSource === ss.id
                        ? 'border-cyan-400 bg-brand-950/40 ring-1 ring-cyan-400'
                        : 'border-white/10 bg-zinc-950/60 hover:bg-zinc-800'
                    }`}
                  >
                    <p className={`text-xs font-bold ${subtitleSource === ss.id ? 'text-cyan-300' : 'text-white'}`}>
                      {ss.label}
                    </p>
                    <p className="text-[10px] text-zinc-400">{ss.desc}</p>
                  </button>
                ))}
              </div>
              <p className="text-[10px] text-zinc-500">
                Bahasa: {language === 'auto' ? 'Otomatis (deteksi sendiri)' : language.toUpperCase()} — diatur di Langkah 2.
              </p>
            </div>

            {/* Bilingual subtitles */}
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-300">Subtitle Bilingual</label>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => setBilingualSubtitles(!bilingualSubtitles)}
                  disabled={subtitleSource === 'none'}
                  className={`rounded-xl px-4 py-2 text-xs font-bold transition-all border disabled:opacity-40 disabled:cursor-not-allowed ${
                    bilingualSubtitles && subtitleSource !== 'none'
                      ? 'border-cyan-400 bg-brand-950/40 ring-1 ring-cyan-400 text-cyan-300'
                      : 'border-white/10 bg-zinc-950/60 hover:bg-zinc-800 text-white'
                  }`}
                >
                  {bilingualSubtitles && subtitleSource !== 'none' ? 'Aktif' : 'Nonaktif'}
                </button>
                <select
                  value={secondaryLanguage}
                  onChange={(e) => setSecondaryLanguage(e.target.value)}
                  disabled={subtitleSource === 'none' || !bilingualSubtitles}
                  className="rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 text-xs font-bold text-white disabled:opacity-40"
                >
                  <option value="en">EN</option>
                  <option value="ja">JA</option>
                  <option value="ko">KO</option>
                  <option value="es">ES</option>
                </select>
              </div>
              <p className="text-[10px] text-zinc-500">
                Terjemahan ditampilkan di bawah caption utama saat render backend.
              </p>
            </div>
          </div>

          {/* Tab 1: Caption Style Preset Selection */}
          <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <Palette className="h-4 w-4 text-cyan-400" />
                <span>Pilih Gaya Animasi Caption</span>
              </h3>
              <span className="text-xs text-brand-300 font-semibold">4 Gaya Viral</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 max-h-48 overflow-y-auto">
              {[
                { id: 'hormozi', name: 'Hormozi Pop', desc: 'Bold Word Bounce' },
                { id: 'neon', name: 'Neon Gamer', desc: 'Cyberpunk Glow' },
                { id: 'punchy', name: 'Punchy TikTok', desc: 'Heavy Dark Border' },
                { id: 'clean', name: 'Clean Subtitle', desc: 'Minimalist Clean' },
                { id: 'smart-bg-focus', name: 'Smart BG Focus', desc: 'Dynamic backdrop' },
                { id: 'box-highlight', name: 'Box Highlight', desc: 'Word boxes' },
                { id: 'word-focus', name: 'Word Focus', desc: 'Enlarged word' },
                { id: 'underline-focus', name: 'Underline Focus', desc: 'Animated underline' },
                { id: 'gradient-glow', name: 'Gradient Glow', desc: 'Color shift' },
                { id: 'game-streamer', name: 'Game Streamer', desc: 'Bold neon' },
              ].map((st) => {
                const isSelected = captionConfig.style === st.id;
                return (
                  <button
                    key={st.id}
                    onClick={() => setCaptionConfig({ ...captionConfig, style: st.id as CaptionStyle })}
                    className={`rounded-2xl p-3 text-left transition-all border ${
                      isSelected
                        ? 'border-cyan-400 bg-brand-950/40 ring-1 ring-cyan-400 text-white shadow-lg'
                        : 'border-white/10 bg-zinc-950/60 text-zinc-400 hover:text-white hover:bg-zinc-800'
                    }`}
                  >
                    <p className="text-xs font-bold text-white">{st.name}</p>
                    <p className="text-[10px] text-zinc-400 mt-0.5">{st.desc}</p>
                  </button>
                );
              })}
            </div>

            {/* Sub-settings: Position, Font Size, Colors */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/5">
              {/* Position */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Posisi Caption</label>
                <div className="flex rounded-xl bg-zinc-950 p-1 border border-white/10">
                  {(['top', 'middle', 'bottom'] as CaptionPosition[]).map((pos) => (
                    <button
                      key={pos}
                      onClick={() => setCaptionConfig({ ...captionConfig, position: pos })}
                      className={`flex-1 py-1 text-xs font-bold rounded-lg capitalize transition-all ${
                        captionConfig.position === pos
                          ? 'bg-brand-600 text-white'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {pos === 'top' ? 'Atas' : pos === 'middle' ? 'Tengah' : 'Bawah'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Font Size */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Ukuran Font</label>
                <div className="flex rounded-xl bg-zinc-950 p-1 border border-white/10">
                  {(['sm', 'md', 'lg', 'xl'] as const).map((sz) => (
                    <button
                      key={sz}
                      onClick={() => setCaptionConfig({ ...captionConfig, fontSize: sz })}
                      className={`flex-1 py-1 text-xs font-bold rounded-lg uppercase transition-all ${
                        captionConfig.fontSize === sz
                          ? 'bg-brand-600 text-white'
                          : 'text-zinc-400 hover:text-white'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Toggles */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-zinc-300">Format Huruf</label>
                <div className="flex gap-2">
                  <button
                    onClick={() =>
                      setCaptionConfig({ ...captionConfig, uppercase: !captionConfig.uppercase })
                    }
                    className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      captionConfig.uppercase
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-zinc-950 border-white/10 text-zinc-400'
                    }`}
                  >
                    HURUF BESAR
                  </button>
                  <button
                    onClick={() =>
                      setCaptionConfig({
                        ...captionConfig,
                        showBackgroundBox: !captionConfig.showBackgroundBox,
                      })
                    }
                    className={`flex-1 py-1.5 text-xs font-bold rounded-xl border transition-all ${
                      captionConfig.showBackgroundBox
                        ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                        : 'bg-zinc-950 border-white/10 text-zinc-400'
                    }`}
                  >
                    Box Latar
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Tab 2: Interactive Inline Caption Editor */}
          <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                  <Edit3 className="h-4 w-4 text-brand-400" />
                  <span>Koreksi & Edit Teks Caption Slang</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Klik pada baris kalimat untuk mengoreksi teks atau menambahkan slang kustom Anda.
                </p>
              </div>
              <span className="text-xs text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20 font-semibold">
                Whisper AI Indo 98%
              </span>
            </div>

            <div className="space-y-3 max-h-[280px] overflow-y-auto pr-1">
              {captions.map((line) => {
                const isEditing = editingLineId === line.id;
                const isCurrentlyActive = activeLine?.id === line.id;

                return (
                  <div
                    key={line.id}
                    className={`rounded-2xl p-3.5 border transition-all ${
                      isCurrentlyActive
                        ? 'border-cyan-400 bg-brand-950/30'
                        : 'border-white/10 bg-zinc-950/60'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs mb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-zinc-400 bg-zinc-900 px-2 py-0.5 rounded text-[11px]">
                          {formatTimestamp(line.startSeconds)} ➔ {formatTimestamp(line.endSeconds)}
                        </span>
                        {line.hasSlang && (
                          <span className="rounded bg-brand-500/20 text-brand-300 px-2 py-0.5 text-[10px] font-bold">
                            ⚡ Slang Terdeteksi
                          </span>
                        )}
                      </div>

                      {!isEditing && (
                        <button
                          onClick={() => handleStartEdit(line)}
                          className="flex items-center gap-1 text-[11px] text-zinc-400 hover:text-cyan-300 transition-colors"
                        >
                          <Edit3 className="h-3 w-3" />
                          <span>Edit Teks</span>
                        </button>
                      )}
                    </div>

                    {isEditing ? (
                      <div className="space-y-2">
                        <textarea
                          rows={2}
                          value={editingText}
                          onChange={(e) => setEditingText(e.target.value)}
                          className="w-full rounded-xl border border-cyan-400 bg-zinc-900 p-2.5 text-xs text-white focus:outline-none"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingLineId(null)}
                            className="px-3 py-1 rounded-lg text-xs text-zinc-400 hover:text-white"
                          >
                            Batal
                          </button>
                          <button
                            onClick={() => handleSaveCaptionEdit(line.id)}
                            className="px-3.5 py-1 rounded-lg bg-cyan-400 text-xs font-bold text-black hover:bg-cyan-300 transition-all"
                          >
                            Simpan Perubahan
                          </button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-xs font-medium text-white leading-relaxed">{line.text}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Bottom Nav Action */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali ke Highlight AI</span>
            </button>

            <button
              onClick={() => onProceedToCheckout(captions, captionConfig, { language, layout, subtitleSource, bilingualSubtitles: bilingualSubtitles && subtitleSource !== 'none', secondaryLanguage })}
              className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <span>Lanjut ke Checkout & Render (1 Kredit / Rp 500)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
