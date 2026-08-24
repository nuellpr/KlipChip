'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Play, Sparkles, ArrowRight } from 'lucide-react';
import { PRESET_VIDEOS } from '@/data/sample-videos';

export function VideoShowcase() {
  const [activeVideoId, setActiveVideoId] = useState('video-1');

  const selectedPreset = PRESET_VIDEOS.find((p) => p.video.id === activeVideoId) || PRESET_VIDEOS[0];
  const primaryHighlight = selectedPreset.highlights[0];
  const captions = selectedPreset.captionsMap[primaryHighlight.id] || [];

  return (
    <section className="py-20 bg-zinc-950/60 border-t border-white/10 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-500/10 px-3.5 py-1 text-xs font-semibold text-pink-300 mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Showcase Hasil Clip 9:16</span>
            </div>
            <h2 className="text-3xl font-extrabold sm:text-4xl text-white font-display">
              Contoh Hasil Render KlipChip Siap FYP
            </h2>
            <p className="text-sm text-zinc-400 mt-2 max-w-xl">
              Lihat bagaimana transkripsi slang Indonesia dan animated caption disinkronkan secara mulus dengan momen terpanas livestream.
            </p>
          </div>

          {/* Tab Selector for game categories */}
          <div className="flex flex-wrap gap-2">
            {PRESET_VIDEOS.map((item) => {
              const isSelected = item.video.id === activeVideoId;
              return (
                <button
                  key={item.video.id}
                  onClick={() => setActiveVideoId(item.video.id)}
                  className={`rounded-xl px-3.5 py-2 text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/30'
                      : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-white/5'
                  }`}
                >
                  {item.video.channelName.split(' ')[0]} ({item.video.platform})
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Showcase Showcase Display */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center rounded-3xl border border-white/10 bg-zinc-900/50 p-6 sm:p-8 backdrop-blur-xl">
          {/* 9:16 Vertical Video Frame (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-[280px] sm:w-[320px] aspect-[9/16] rounded-3xl overflow-hidden bg-black border-2 border-white/15 shadow-2xl shadow-brand-500/20 flex flex-col justify-between p-4">
              {/* Background thumbnail */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={selectedPreset.video.thumbnailUrl}
                alt={selectedPreset.video.title}
                className="absolute inset-0 h-full w-full object-cover scale-105 brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none" />

              {/* Header inside frame */}
              <div className="relative z-10 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-600/90 text-white px-2 py-0.5 rounded-full">
                  ⚡ 1080x1920 Vertikal
                </span>
                <span className="text-[10px] font-mono text-zinc-300 bg-black/60 px-2 py-0.5 rounded-full">
                  Durasi: {primaryHighlight.duration}s
                </span>
              </div>

              {/* Center Play Icon */}
              <div className="relative z-10 my-auto flex flex-col items-center">
                <div className="h-16 w-16 rounded-full bg-cyan-400/90 text-black flex items-center justify-center shadow-lg shadow-cyan-400/40">
                  <Play className="h-7 w-7 fill-black ml-1" />
                </div>
              </div>

              {/* Dynamic Slang Captions at bottom */}
              <div className="relative z-10 space-y-2 pb-2">
                <div className="rounded-2xl bg-black/85 backdrop-blur-md p-3 border border-white/15 text-center">
                  <span className="text-[10px] uppercase font-extrabold text-cyan-400 block mb-1">
                    Auto-Caption Slang Normalizer:
                  </span>
                  <p className="text-sm font-black text-white leading-tight">
                    {captions[0]?.text || 'Momen seru livestream gaming Indonesia!'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Details & Performance Metrics (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="rounded-md bg-brand-500/20 text-brand-300 border border-brand-500/30 px-2 py-0.5 text-xs font-bold">
                  Skor AI Highlight: {primaryHighlight.totalScore}/100
                </span>
                <span className="text-xs text-zinc-400">• {selectedPreset.video.channelName}</span>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">{primaryHighlight.title}</h3>
              <p className="text-sm text-zinc-300 leading-relaxed">{primaryHighlight.description}</p>
            </div>

            {/* Analysis Data Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-brand-300">Audio Loudness Spike</span>
                  <span className="text-xs font-mono font-bold text-white">{primaryHighlight.audioScore}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-500 to-cyan-400 rounded-full"
                    style={{ width: `${primaryHighlight.audioScore}%` }}
                  />
                </div>
                <p className="text-[11px] text-zinc-400 mt-2">Deteksi teriakan streamer & reaksi kaget.</p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-zinc-950/70 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-amber-400">Lonjakan Chat Stream</span>
                  <span className="text-xs font-mono font-bold text-white">{primaryHighlight.chatScore}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-zinc-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-amber-500 to-orange-400 rounded-full"
                    style={{ width: `${primaryHighlight.chatScore}%` }}
                  />
                </div>
                <p className="text-[11px] text-zinc-400 mt-2">{primaryHighlight.chatSpikeReason}</p>
              </div>
            </div>

            {/* Slang Normalized Preview */}
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-950/20 p-4">
              <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider mb-2">
                Contoh Deteksi Slang yang Berhasil Dikenali:
              </h4>
              <div className="flex flex-wrap gap-2">
                {['bjir -> Anjir!', 'ggwp -> GGWP (Good Game)', 'rata lu -> Rata Lu Bos!', 'bocil -> Bocil Kematian'].map(
                  (s, idx) => (
                    <span
                      key={idx}
                      className="rounded-lg bg-zinc-900 border border-cyan-500/30 px-2.5 py-1 text-xs font-medium text-cyan-200"
                    >
                      ✓ {s}
                    </span>
                  )
                )}
              </div>
            </div>

            {/* Action CTA */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <Link
                href={`/studio?url=${encodeURIComponent(selectedPreset.video.sourceUrl)}`}
                className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-brand-500/30 hover:brightness-110 transition-all"
              >
                <span>Edit Klip Video Ini Sekarang</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
