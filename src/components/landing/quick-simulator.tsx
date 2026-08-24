'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Volume2, 
  MessageSquare, 
  Play, 
  Pause, 
  ArrowRight, 
  Flame,
  Wand2
} from 'lucide-react';
import { PRESET_VIDEOS } from '@/data/sample-videos';
import { CaptionStyle } from '@/lib/types';
import { formatTimestamp } from '@/lib/caption-engine';

export function QuickSimulator() {
  const sample = PRESET_VIDEOS[0];
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedHighlightIdx, setSelectedHighlightIdx] = useState(0);
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>('hormozi');

  const selectedHighlight = sample.highlights[selectedHighlightIdx] || sample.highlights[0];
  const demoCaption = sample.captionsMap[selectedHighlight?.id]?.[0]?.text || '';
  const chatPeak = Math.max(...(sample.video.chatVelocity || [0]));

  return (
    <section className="py-16 bg-zinc-950 border-y border-white/10 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300 mb-3">
            <Wand2 className="h-3.5 w-3.5" />
            <span>Simulasi Mesin KlipChip</span>
          </div>
          <h2 className="text-3xl font-extrabold sm:text-4xl text-white">
            Lihat Bagaimana KlipChip Menemukan Momen Viral
          </h2>
          <p className="text-sm text-zinc-400 mt-2">
            AI menganalisis data gelombang audio (audio spike) dan kepadatan obrolan penonton (chat velocity) secara simultan untuk menemukan detik terbaik secara presisi.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left: AI Highlight Analyzer Visualizer (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Video Header Card */}
            <div className="rounded-2xl border border-white/10 bg-zinc-900/80 p-4 shadow-xl">
              <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-lg bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
                    <Flame className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white line-clamp-1">{sample.video.title}</h4>
                    <p className="text-xs text-zinc-400">
                      Durasi Sumber: {formatTimestamp(sample.video.durationSeconds)} • {sample.video.channelName}
                    </p>
                  </div>
                </div>
                <span className="shrink-0 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
                  Analisis Selesai
                </span>
              </div>

              {/* Audio Waveform & Chat Spikes */}
              <div className="space-y-4">
                {/* Audio Spike Waveform */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="flex items-center gap-1.5 text-brand-300 font-semibold">
                      <Volume2 className="h-3.5 w-3.5" />
                      Deteksi Audio Spike (Loudness Teriakan & Reaksi)
                    </span>
                    <span className="text-zinc-500 font-mono">00:00 - 58:00</span>
                  </div>
                  <div className="h-14 rounded-xl bg-zinc-950 p-2 flex items-end gap-1 overflow-hidden border border-white/5">
                    {sample.video.audioWaveform?.map((val, idx) => {
                      const isHot = val > 80;
                      return (
                        <div
                          key={idx}
                          className={`flex-1 rounded-t-sm transition-all ${
                            isHot
                              ? 'bg-gradient-to-t from-brand-500 to-cyan-400 shadow-sm shadow-cyan-400/50'
                              : 'bg-zinc-800 hover:bg-zinc-700'
                          }`}
                          style={{ height: `${val}%` }}
                          title={`Kekuatan Audio: ${val}%`}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Chat Velocity Graph */}
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="flex items-center gap-1.5 text-amber-300 font-semibold">
                      <MessageSquare className="h-3.5 w-3.5" />
                      Aktivitas Chat Stream (Lonjakan Pesan / Detik)
                    </span>
                    <span className="text-emerald-400 font-bold text-[11px]">Puncak: {chatPeak} msg/s</span>
                  </div>
                  <div className="h-10 rounded-xl bg-zinc-950 p-1.5 flex items-end gap-1 overflow-hidden border border-white/5">
                    {sample.video.chatVelocity?.map((val, idx) => (
                      <div
                        key={idx}
                        className="flex-1 rounded-t-sm bg-amber-500/70"
                        style={{ height: `${(val / 160) * 100}%` }}
                        title={`Kecepatan Chat: ${val} pesan/dtk`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Highlight Candidate Cards Selector */}
              <div className="mt-5 space-y-2">
                <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                  3 Rekomendasi Momen AI Terdeteksi:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {sample.highlights.map((hl, idx) => {
                    const isSelected = idx === selectedHighlightIdx;
                    return (
                      <button
                        key={hl.id}
                        onClick={() => {
                          setSelectedHighlightIdx(idx);
                        }}
                        className={`rounded-xl p-2.5 text-left transition-all border ${
                          isSelected
                            ? 'border-cyan-400 bg-brand-600/20 shadow-md shadow-brand-500/20 ring-1 ring-cyan-400/40'
                            : 'border-white/10 bg-zinc-950/60 hover:bg-zinc-850'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-brand-500/30 text-brand-300">
                            Skor: {hl.totalScore}/100
                          </span>
                          <span className="text-[10px] font-mono text-zinc-400">
                            {Math.floor(hl.startSeconds / 60)}:{(hl.startSeconds % 60).toString().padStart(2, '0')}
                          </span>
                        </div>
                        <p className="text-xs font-semibold text-white line-clamp-2 leading-tight">
                          {hl.title}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Live 9:16 Vertical Phone Simulator (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-[280px] sm:w-[310px] aspect-[9/16] rounded-[36px] p-2 bg-gradient-to-b from-zinc-700 via-zinc-900 to-black border-[3px] border-zinc-700 shadow-2xl shadow-brand-500/20 overflow-hidden flex flex-col justify-between">
              {/* Phone Camera Notch */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 h-4 w-28 bg-black rounded-full z-30" />

              {/* Inner Screen */}
              <div className="relative h-full w-full rounded-[28px] overflow-hidden bg-zinc-900 flex flex-col justify-between p-4">
                {/* Background Image / Video Visual */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={sample.video.thumbnailUrl}
                  alt="Video Visual"
                  className="absolute inset-0 h-full w-full object-cover scale-110 blur-[1px] brightness-75"
                />

                {/* Dark gradients top/bottom */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-black/60 pointer-events-none" />

                {/* Top Overlay Badge */}
                <div className="relative z-20 pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10 text-[10px] font-bold text-white">
                    <Flame className="h-3 w-3 text-cyan-400" />
                    <span>9:16 Shorts Clip</span>
                  </div>
                  <span className="text-[10px] font-bold bg-brand-500/80 px-2 py-0.5 rounded text-white font-mono">
                    {selectedHighlight?.duration || 35} Detik
                  </span>
                </div>

                {/* Center Play Button Overlay */}
                <div className="relative z-20 flex flex-col items-center justify-center my-auto">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="h-14 w-14 rounded-full bg-brand-500/90 text-white flex items-center justify-center shadow-xl shadow-brand-500/40 hover:scale-110 active:scale-95 transition-all"
                  >
                    {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                  </button>
                  <span className="text-[10px] text-zinc-300 mt-2 bg-black/60 px-2 py-0.5 rounded-full font-medium">
                    {isPlaying ? 'Putar Animasi Caption' : 'Klik Putar Preview'}
                  </span>
                </div>

                {/* Bottom Auto-Caption Display */}
                <div className="relative z-20 pb-4 space-y-2">
                  <div className="rounded-xl bg-black/80 backdrop-blur-md p-2.5 border border-white/15 text-center">
                    <p className="text-[11px] font-semibold text-cyan-400 mb-1">
                      ⚡ Slang Auto-Caption:
                    </p>
                    <div className="text-sm font-black tracking-wide">
                      {demoCaption ? (
                        <>
                          {captionStyle === 'hormozi' && (
                            <p className="text-white">
                              <span className="text-yellow-400 bg-yellow-400/20 px-1 rounded animate-pulse">
                                {demoCaption.split(' ')[0]}
                              </span>
                              {' '}
                              {demoCaption.split(' ').slice(1).join(' ')}
                            </p>
                          )}
                          {captionStyle === 'neon' && (
                            <p className="text-emerald-300 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]">
                              {demoCaption}
                            </p>
                          )}
                          {captionStyle === 'clean' && (
                            <p className="text-white drop-shadow">{demoCaption}</p>
                          )}
                        </>
                      ) : (
                        <p className="text-white">Momen seru livestream gaming Indonesia!</p>
                      )}
                    </div>
                  </div>

                  {/* Caption Style Switcher */}
                  <div className="flex justify-center gap-1.5">
                    {(['hormozi', 'neon', 'clean'] as CaptionStyle[]).map((style) => (
                      <button
                        key={style}
                        onClick={() => setCaptionStyle(style)}
                        className={`text-[9px] font-bold px-2 py-1 rounded-md transition-all uppercase ${
                          captionStyle === style
                            ? 'bg-cyan-400 text-black shadow-sm'
                            : 'bg-zinc-900/80 text-zinc-400 hover:text-white'
                        }`}
                      >
                        {style}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Launch Full Studio CTA */}
            <div className="mt-4 text-center">
              <Link
                href="/studio"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-300 hover:text-cyan-200 transition-colors"
              >
                <span>Buka Studio Lengkap & Potong Video Sendiri</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
