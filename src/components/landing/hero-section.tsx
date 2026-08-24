'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  Flame,
} from 'lucide-react';
import { PRESET_VIDEOS } from '@/data/sample-videos';
import { Hero3D } from './hero-3d';

export function HeroSection() {
  const router = useRouter();
  const [urlInput, setUrlInput] = useState('');
  const [urlError, setUrlError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleStartClipped = (url?: string) => {
    const targetUrl = url || urlInput;
    if (!targetUrl.trim()) {
      setUrlError('Silakan masukkan URL YouTube atau Twitch');
      return;
    }

    const isValid =
      targetUrl.includes('youtube.com') ||
      targetUrl.includes('youtu.be') ||
      targetUrl.includes('twitch.tv');

    if (!isValid) {
      setUrlError('Hanya mendukung URL video YouTube atau Twitch yang valid');
      return;
    }

    setUrlError('');
    setIsLoading(true);

    setTimeout(() => {
      // Route to studio with query param
      router.push(`/studio?url=${encodeURIComponent(targetUrl)}`);
    }, 400);
  };

  const handleSelectPreset = (presetUrl: string) => {
    setUrlInput(presetUrl);
    handleStartClipped(presetUrl);
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 scanlines">
      {/* Hyperrealistic parallax 3D background */}
      <Hero3D />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-500/15 px-4 py-1.5 text-xs font-semibold text-brand-300 shadow-inner backdrop-blur-md">
            <span className="flex h-2 w-2 rounded-full bg-accent animate-ping" />
            <Sparkles className="h-3.5 w-3.5 text-accent" />
            <span>AI Highlight & Slang Caption Bahasa Indonesia</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl font-display text-white drop-shadow-[0_4px_24px_rgba(124,58,237,0.35)]">
            Ubah Livestream Gaming Jadi{' '}
            <span className="gradient-text">Klip 9:16 Viral</span> dalam 3 Menit.
          </h1>

          {/* Subtitle */}
          <p className="mx-auto max-w-2xl text-base text-[#94A3B8] sm:text-lg lg:text-xl font-normal leading-relaxed">
            Tempel link YouTube atau Twitch, KlipChip otomatis mendeteksi{' '}
            <strong className="text-white">teriakan audio spike</strong>,{' '}
            <strong className="text-white">lonjakan chat penonton</strong>, dan memberi{' '}
            <strong className="text-[#A78BFA]">auto-caption slang lokal</strong>. Bayar Rp 5.000 per clip via QRIS!
          </p>

          {/* Main URL Input Box */}
          <div className="mx-auto max-w-2xl pt-2">
            <div className="relative flex flex-col sm:flex-row items-center rounded-2xl border border-white/15 bg-[#1E1C35]/90 p-2 hyper-shadow backdrop-blur-xl focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/40 transition-all">
              <div className="flex w-full items-center gap-3 px-3 py-2">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <svg className="h-5 w-5 text-[#FF0000] fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <svg className="h-5 w-5 text-[#6441a5] fill-current" viewBox="0 0 24 24">
                    <path d="M2.149 0L.537 4.119v16.836h5.731V24h3.224l3.045-3.045h4.657l6.269-6.269V0H2.149zm19.164 13.612l-3.582 3.582H12l-3.045 3.045v-3.045H4.836V1.791h16.477v11.821zM16.119 5.373h-2.149v6.448h2.149V5.373zm-5.731 0H8.239v6.448h2.149V5.373z"/>
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Tempel link YouTube atau Twitch di sini (misal: youtube.com/watch?v=...)"
                  value={urlInput}
                  onChange={(e) => {
                    setUrlInput(e.target.value);
                    if (urlError) setUrlError('');
                  }}
                  onKeyDown={(e) => e.key === 'Enter' && handleStartClipped()}
                  className="w-full bg-transparent text-sm text-white placeholder-[#64748B] focus:outline-none"
                />
              </div>
              <button
                onClick={() => handleStartClipped()}
                disabled={isLoading}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-[#F43F5E] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#7C3AED]/40 hover:brightness-110 hover:scale-[1.02] active:scale-95 transition-all whitespace-nowrap"
              >
                {isLoading ? (
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <span>Cari Highlight AI</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </div>

            {urlError && (
              <p className="mt-2 text-xs font-semibold text-rose-400 text-left px-3">
                ⚠️ {urlError}
              </p>
            )}

            {/* Quick Demo Pickers */}
            <div className="mt-5 space-y-2 text-left">
              <div className="flex items-center justify-between text-xs text-[#94A3B8] px-1">
                <span className="flex items-center gap-1 font-medium">
                  <Flame className="h-3.5 w-3.5 text-amber-400" />
                  Atau coba langsung 1-klik dengan sampel video livestream viral:
                </span>
                <span className="hidden sm:inline text-[11px] text-[#64748B]">Klik untuk memuat</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {PRESET_VIDEOS.slice(0, 2).map((item) => (
                  <button
                    key={item.video.id}
                    onClick={() => handleSelectPreset(item.video.sourceUrl)}
                    className="group flex items-center gap-3 rounded-xl border border-white/10 bg-[#1E1C35]/70 p-2.5 text-left transition-all hover:border-brand-500/60 hover:bg-[#27273B]/90 hyper-card-hover"
                  >
                    <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.video.thumbnailUrl}
                        alt={item.video.title}
                        className="h-full w-full object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                        <Play className="h-4 w-4 text-white fill-white opacity-80" />
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-xs font-semibold text-zinc-200 group-hover:text-[#A78BFA]">
                        {item.video.title}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#94A3B8]">
                        <span className="text-brand-300 font-medium">{item.video.channelName}</span>
                        <span>•</span>
                        <span className="text-emerald-400">3 Highlight Siap</span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Social Proof & Metrics Checklist */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-white/10">
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1E1C35]/50 border border-white/5">
              <span className="text-xl sm:text-2xl font-black text-white">&lt; 3 Menit</span>
              <span className="text-[11px] text-[#94A3B8] mt-0.5">Waktu Render Preview</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1E1C35]/50 border border-white/5">
              <span className="text-xl sm:text-2xl font-black text-[#F43F5E]">Rp 5.000</span>
              <span className="text-[11px] text-[#94A3B8] mt-0.5">Pay-Per-Clip via QRIS</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1E1C35]/50 border border-white/5">
              <span className="text-xl sm:text-2xl font-black text-[#A78BFA]">60+ Slang</span>
              <span className="text-[11px] text-[#94A3B8] mt-0.5">Kamus Gaming Indo</span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#1E1C35]/50 border border-white/5">
              <span className="text-xl sm:text-2xl font-black text-emerald-400">9:16 HD</span>
              <span className="text-[11px] text-[#94A3B8] mt-0.5">Shorts, Reels, TikTok</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
