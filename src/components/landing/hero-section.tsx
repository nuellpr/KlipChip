'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Sparkles,
  ArrowRight,
  Play,
  Flame,
  AlertTriangle,
} from 'lucide-react';
import { PRESET_VIDEOS } from '@/data/sample-videos';
import { Hero3D } from './hero-3d';
import { Reveal } from '@/components/motion/reveal';

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
      <div className="aurora-bg opacity-70" aria-hidden="true" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <Reveal>
            <div className="inline-flex items-center gap-2 rounded-full border border-brand-500/40 bg-brand-500/15 px-4 py-1.5 text-xs font-semibold text-brand-300 shadow-inner backdrop-blur-md">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-accent animate-pulse-ring" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
              </span>
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              <span>AI Highlight &amp; Slang Caption Bahasa Indonesia</span>
            </div>
          </Reveal>

          {/* Main Headline */}
          <Reveal delay={90}>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-6xl lg:text-7xl font-display text-white drop-shadow-[0_4px_24px_rgba(124,58,237,0.35)]">
              Ubah Livestream Gaming Jadi{' '}
              <span className="gradient-text">Klip 9:16 Viral</span> dalam 3 Menit.
            </h1>
          </Reveal>

          {/* Subtitle */}
          <Reveal delay={180}>
            <p className="mx-auto max-w-2xl text-base text-[#94A3B8] sm:text-lg lg:text-xl font-normal leading-relaxed">
              Tempel link YouTube atau Twitch, KlipChip otomatis mendeteksi{' '}
              <strong className="text-white">teriakan audio spike</strong>,{' '}
              <strong className="text-white">lonjakan chat penonton</strong>, dan memberi{' '}
              <strong className="text-[#A78BFA]">auto-caption slang lokal</strong>. Bayar Rp 5.000 per clip via QRIS!
            </p>
          </Reveal>

          {/* Main URL Input Box */}
          <Reveal delay={270}>
            <div className="mx-auto max-w-2xl pt-2">
              <div className="relative flex flex-col sm:flex-row items-center rounded-2xl border border-white/15 bg-[#1E1C35]/90 p-2 hyper-shadow backdrop-blur-xl focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/40 transition-all duration-300">
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
                  className="group/btn relative w-full overflow-hidden sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 via-brand-500 to-[#F43F5E] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#7C3AED]/40 transition-all duration-300 hover:scale-[1.02] hover:brightness-110 active:scale-95 whitespace-nowrap"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 -left-2/3 w-1/2 -skew-x-12 bg-white/25 blur-md transition-transform duration-700 ease-smooth group-hover/btn:translate-x-[340%]"
                  />
                  {isLoading ? (
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  ) : (
                    <>
                      <span>Cari Highlight AI</span>
                      <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                    </>
                  )}
                </button>
              </div>

              {urlError && (
                <p className="mt-2 flex items-center gap-1.5 px-3 text-left text-xs font-semibold text-rose-400">
                  <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                  {urlError}
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
                  {PRESET_VIDEOS.slice(0, 2).map((item, index) => (
                    <Reveal key={item.video.id} delay={320 + index * 90}>
                      <button
                        onClick={() => handleSelectPreset(item.video.sourceUrl)}
                        className="group flex w-full items-center gap-3 rounded-xl border border-white/10 bg-[#1E1C35]/70 p-2.5 text-left transition-all duration-300 hover:border-brand-500/60 hover:bg-[#27273B]/90 hyper-card-hover active:scale-[0.99]"
                      >
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-lg bg-zinc-800">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={item.video.thumbnailUrl}
                            alt={item.video.title}
                            className="h-full w-full object-cover transition-transform duration-500 ease-smooth group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <Play className="h-4 w-4 text-white fill-white opacity-80 transition-transform duration-300 group-hover:scale-125" />
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
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Social Proof & Metrics Checklist */}
          <div className="pt-6 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-4xl mx-auto border-t border-white/10">
            {[
              { value: '< 3 Menit', label: 'Waktu Render Preview', tone: 'text-white' },
              { value: 'Rp 5.000', label: 'Pay-Per-Clip via QRIS', tone: 'text-[#F43F5E]' },
              { value: '60+ Slang', label: 'Kamus Gaming Indo', tone: 'text-[#A78BFA]' },
              { value: '9:16 HD', label: 'Shorts, Reels, TikTok', tone: 'text-emerald-400' },
            ].map((metric, index) => (
              <Reveal key={metric.label} delay={380 + index * 80}>
                <div className="flex h-full flex-col items-center justify-center rounded-xl border border-white/5 bg-[#1E1C35]/50 p-3 transition-all duration-300 hover:-translate-y-1 hover:border-brand-500/30 hover:bg-[#1E1C35]/80">
                  <span className={`text-xl font-black sm:text-2xl ${metric.tone}`}>{metric.value}</span>
                  <span className="mt-0.5 text-[11px] text-[#94A3B8]">{metric.label}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
