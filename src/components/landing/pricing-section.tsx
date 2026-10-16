'use client';

import React from 'react';
import Link from 'next/link';
import { Check, ShieldCheck, ArrowRight, Coins, Star, Zap } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-zinc-950/80 border-t border-white/10 relative overflow-hidden">
      <div className="aurora-bg opacity-60" aria-hidden="true" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <Reveal>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300">
              <Coins className="h-3.5 w-3.5" />
              <span>Model Bisnis Transparan</span>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl text-white font-display">
              Bayar Hanya Saat Anda Membutuhkan Clip
            </h2>
          </Reveal>
          <Reveal delay={170}>
            <p className="text-base text-zinc-400">
              Tidak ada jebakan kartu kredit atau tagihan bulanan otomatis yang tak terduga. Pilih bayar satuan per clip via QRIS atau paket hemat untuk kreator aktif.
            </p>
          </Reveal>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-16">
          {/* Plan 1: Pay-Per-Clip (Main MVP Focus) */}
          <Reveal delay={80} className="h-full">
            <div className="group relative h-full rounded-3xl border-2 border-brand-500 bg-gradient-to-b from-brand-950/40 via-zinc-900 to-zinc-900 p-8 shadow-2xl shadow-brand-500/20 flex flex-col justify-between transition-all duration-500 ease-smooth hover:-translate-y-1.5 hover:border-brand-400 hover:shadow-[0_28px_70px_-24px_rgba(139,92,246,0.6)]">
              {/* Spotlight halus mengikuti area atas kartu saat hover (CSS saja) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 ease-smooth group-hover:opacity-100"
                style={{
                  background: 'radial-gradient(460px circle at 50% 0%, rgba(139,92,246,0.22), transparent 70%)',
                }}
              />

              <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                <span
                  aria-hidden="true"
                  className="absolute inset-0 rounded-full border-2 border-brand-400/80 animate-pulse-ring"
                />
                <div className="relative flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-500 to-cyan-400 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg">
                  <Star className="h-3.5 w-3.5 fill-white" />
                  <span>Paling Populer (MVP)</span>
                </div>
              </div>

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white">Pay-Per-Clip</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Untuk kebutuhan sesekali / uji coba</p>
                  </div>
                  <span className="rounded-xl bg-brand-500/20 text-brand-300 p-2.5 font-bold text-xs border border-brand-500/30 transition-transform duration-500 ease-snap group-hover:scale-105">
                    Mikro-Bayar
                  </span>
                </div>

                <div className="my-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-white font-display">Rp 5.000</span>
                    <span className="text-sm font-medium text-zinc-400">/ klip selesai</span>
                  </div>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                    <Check className="h-3.5 w-3.5 shrink-0" />
                    <span>Tanpa langganan bulanan • Diskon Beta Publik</span>
                  </p>
                </div>

                <ul className="space-y-3 text-xs text-zinc-300 mb-8 border-t border-white/10 pt-6">
                  <li className="flex items-center gap-2 transition-transform duration-300 ease-smooth hover:translate-x-0.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Deteksi Highlight Audio Spike & Chat</span>
                  </li>
                  <li className="flex items-center gap-2 transition-transform duration-300 ease-smooth hover:translate-x-0.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Auto-Caption Slang Gaming Indo (Whisper)</span>
                  </li>
                  <li className="flex items-center gap-2 transition-transform duration-300 ease-smooth hover:translate-x-0.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Resolusi Full HD 1080x1920 (Tanpa Watermark)</span>
                  </li>
                  <li className="flex items-center gap-2 transition-transform duration-300 ease-smooth hover:translate-x-0.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Preview Gratis Sebelum Bayar</span>
                  </li>
                  <li className="flex items-center gap-2 transition-transform duration-300 ease-smooth hover:translate-x-0.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Link Download MP4 Aktif Selama 7 Hari</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/studio"
                className="relative flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/30 transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:brightness-110 active:scale-[0.98]"
              >
                <span>Mulai Buat Clip (Rp 5.000)</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-300 ease-smooth group-hover:translate-x-0.5" />
              </Link>
            </div>
          </Reveal>

          {/* Plan 2: Paket Starter Bulanan */}
          <Reveal delay={170} className="h-full">
            <div className="group relative h-full rounded-3xl border border-white/10 bg-zinc-900/60 p-8 flex flex-col justify-between transition-all duration-500 ease-smooth hover:-translate-y-1.5 hover:border-brand-500/60 hover:bg-zinc-900 hover:shadow-[0_24px_60px_-28px_rgba(124,58,237,0.5)]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 ease-smooth group-hover:opacity-100"
                style={{
                  background: 'radial-gradient(420px circle at 50% 0%, rgba(124,58,237,0.14), transparent 70%)',
                }}
              />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">Paket Starter</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Untuk kreator rutin 2-3 clip/minggu</p>
                  </div>
                  <span className="rounded-xl bg-white/5 text-zinc-300 p-2 text-xs border border-white/10 transition-transform duration-500 ease-snap group-hover:scale-105">
                    15 Klip
                  </span>
                </div>

                <div className="my-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white font-display">Rp 49.000</span>
                    <span className="text-sm font-medium text-zinc-400">/ bulan</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">Hanya ~Rp 3.260 / clip</p>
                </div>

                <ul className="space-y-3 text-xs text-zinc-300 mb-8 border-t border-white/10 pt-6">
                  <li className="flex items-center gap-2 transition-transform duration-300 ease-smooth hover:translate-x-0.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Kuota 15 Klip HD / Bulan</span>
                  </li>
                  <li className="flex items-center gap-2 transition-transform duration-300 ease-smooth hover:translate-x-0.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Semua Fitur Pay-Per-Clip Termasuk</span>
                  </li>
                  <li className="flex items-center gap-2 transition-transform duration-300 ease-smooth hover:translate-x-0.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Prioritas Antrean Render (Fast Lane)</span>
                  </li>
                  <li className="flex items-center gap-2 transition-transform duration-300 ease-smooth hover:translate-x-0.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Riwayat Simpan Cloud 30 Hari</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/pricing"
                className="relative flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-800 hover:bg-zinc-700 py-3.5 text-sm font-bold text-white border border-white/10 transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:border-white/20 active:scale-[0.98]"
              >
                <span>Pilih Paket Starter</span>
              </Link>
            </div>
          </Reveal>

          {/* Plan 3: Creator Pro */}
          <Reveal delay={260} className="h-full">
            <div className="group relative h-full rounded-3xl border border-white/10 bg-zinc-900/60 p-8 flex flex-col justify-between transition-all duration-500 ease-smooth hover:-translate-y-1.5 hover:border-brand-500/60 hover:bg-zinc-900 hover:shadow-[0_24px_60px_-28px_rgba(124,58,237,0.5)]">
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-px rounded-3xl opacity-0 transition-opacity duration-500 ease-smooth group-hover:opacity-100"
                style={{
                  background: 'radial-gradient(420px circle at 50% 0%, rgba(124,58,237,0.14), transparent 70%)',
                }}
              />

              <div className="relative">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-white">Creator Pro</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">Untuk daily streamer & editor tim</p>
                  </div>
                  <span className="rounded-xl bg-purple-500/10 text-purple-300 p-2 text-xs border border-purple-500/20 transition-transform duration-500 ease-snap group-hover:scale-105">
                    50 Klip
                  </span>
                </div>

                <div className="my-6">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-black text-white font-display">Rp 149.000</span>
                    <span className="text-sm font-medium text-zinc-400">/ bulan</span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">Hanya ~Rp 2.980 / clip</p>
                </div>

                <ul className="space-y-3 text-xs text-zinc-300 mb-8 border-t border-white/10 pt-6">
                  <li className="flex items-center gap-2 transition-transform duration-300 ease-smooth hover:translate-x-0.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Kuota 50 Klip HD / Bulan</span>
                  </li>
                  <li className="flex items-center gap-2 transition-transform duration-300 ease-smooth hover:translate-x-0.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Kustomisasi Kamus Slang Komunitas Sendiri</span>
                  </li>
                  <li className="flex items-center gap-2 transition-transform duration-300 ease-smooth hover:translate-x-0.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Batch Processing Beberapa Timestamp</span>
                  </li>
                  <li className="flex items-center gap-2 transition-transform duration-300 ease-smooth hover:translate-x-0.5">
                    <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                    <span>Support Prioritas via WhatsApp</span>
                  </li>
                </ul>
              </div>

              <Link
                href="/pricing"
                className="relative flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-800 hover:bg-zinc-700 py-3.5 text-sm font-bold text-white border border-white/10 transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:border-white/20 active:scale-[0.98]"
              >
                <span>Pilih Creator Pro</span>
              </Link>
            </div>
          </Reveal>
        </div>

        {/* Local Payment Methods Verification Badges */}
        <Reveal delay={120}>
          <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 flex flex-col md:flex-row items-center justify-between gap-4 transition-colors duration-500 ease-smooth hover:border-brand-500/30">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Metode Pembayaran Lokal Indonesia Didukung:</p>
                <p className="text-xs text-zinc-400">Konfirmasi instan otomatis dalam 3 detik via webhook resmi.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 font-bold text-xs">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-800 border border-white/10 px-3 py-1.5 text-zinc-200 transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:border-brand-500/40 hover:text-white">
                <Zap className="h-3.5 w-3.5 text-cyan-400" />
                QRIS All Payment
              </span>
              <span className="rounded-lg bg-zinc-800 border border-white/10 px-3 py-1.5 text-zinc-200 transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:border-brand-500/40 hover:text-white">
                GoPay / OVO / DANA
              </span>
              <span className="rounded-lg bg-zinc-800 border border-white/10 px-3 py-1.5 text-zinc-200 transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:border-brand-500/40 hover:text-white">
                ShopeePay
              </span>
              <span className="rounded-lg bg-zinc-800 border border-white/10 px-3 py-1.5 text-zinc-200 transition-all duration-300 ease-smooth hover:-translate-y-0.5 hover:border-brand-500/40 hover:text-white">
                BCA / Mandiri / BRI VA
              </span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
