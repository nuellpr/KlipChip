'use client';

import React from 'react';
import Link from 'next/link';
import { Check, ShieldCheck, ArrowRight, Coins } from 'lucide-react';

export function PricingSection() {
  return (
    <section id="pricing" className="py-20 bg-zinc-950/80 border-t border-white/10 relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3.5 py-1 text-xs font-semibold text-emerald-300">
            <Coins className="h-3.5 w-3.5" />
            <span>Model Bisnis Transparan</span>
          </div>
          <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl text-white font-display">
            Bayar Hanya Saat Anda Membutuhkan Clip
          </h2>
          <p className="text-base text-zinc-400">
            Tidak ada jebakan kartu kredit atau tagihan bulanan otomatis yang tak terduga. Pilih bayar satuan per clip via QRIS atau paket hemat untuk kreator aktif.
          </p>
        </div>

        {/* 3 Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch mb-16">
          {/* Plan 1: Pay-Per-Clip (Main MVP Focus) */}
          <div className="relative rounded-3xl border-2 border-brand-500 bg-gradient-to-b from-brand-950/40 via-zinc-900 to-zinc-900 p-8 shadow-2xl shadow-brand-500/20 flex flex-col justify-between">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-500 to-cyan-400 px-4 py-1 text-xs font-extrabold uppercase tracking-wider text-white shadow-lg">
              ⭐ Paling Populer (MVP)
            </div>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-white">Pay-Per-Clip</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Untuk kebutuhan sesekali / uji coba</p>
                </div>
                <span className="rounded-xl bg-brand-500/20 text-brand-300 p-2.5 font-bold text-xs border border-brand-500/30">
                  Mikro-Bayar
                </span>
              </div>

              <div className="my-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl sm:text-5xl font-black text-white font-display">Rp 5.000</span>
                  <span className="text-sm font-medium text-zinc-400">/ klip selesai</span>
                </div>
                <p className="text-xs text-emerald-400 mt-1 font-medium">
                  ✓ Tanpa langganan bulanan • Diskon Beta Publik
                </p>
              </div>

              <ul className="space-y-3 text-xs text-zinc-300 mb-8 border-t border-white/10 pt-6">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Deteksi Highlight Audio Spike & Chat</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Auto-Caption Slang Gaming Indo (Whisper)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Resolusi Full HD 1080x1920 (Tanpa Watermark)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Preview Gratis Sebelum Bayar</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Link Download MP4 Aktif Selama 7 Hari</span>
                </li>
              </ul>
            </div>

            <Link
              href="/studio"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <span>Mulai Buat Clip (Rp 5.000)</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {/* Plan 2: Paket Starter Bulanan */}
          <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-8 flex flex-col justify-between hover:border-white/20 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Paket Starter</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Untuk kreator rutin 2-3 clip/minggu</p>
                </div>
                <span className="rounded-xl bg-white/5 text-zinc-300 p-2 text-xs border border-white/10">
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
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Kuota 15 Klip HD / Bulan</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Semua Fitur Pay-Per-Clip Termasuk</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Prioritas Antrean Render (Fast Lane)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Riwayat Simpan Cloud 30 Hari</span>
                </li>
              </ul>
            </div>

            <Link
              href="/pricing"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-800 hover:bg-zinc-700 py-3.5 text-sm font-bold text-white border border-white/10 transition-all"
            >
              <span>Pilih Paket Starter</span>
            </Link>
          </div>

          {/* Plan 3: Creator Pro */}
          <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-8 flex flex-col justify-between hover:border-white/20 transition-all">
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">Creator Pro</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">Untuk daily streamer & editor tim</p>
                </div>
                <span className="rounded-xl bg-purple-500/10 text-purple-300 p-2 text-xs border border-purple-500/20">
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
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Kuota 50 Klip HD / Bulan</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Kustomisasi Kamus Slang Komunitas Sendiri</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Batch Processing Beberapa Timestamp</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Support Prioritas via WhatsApp</span>
                </li>
              </ul>
            </div>

            <Link
              href="/pricing"
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-800 hover:bg-zinc-700 py-3.5 text-sm font-bold text-white border border-white/10 transition-all"
            >
              <span>Pilih Creator Pro</span>
            </Link>
          </div>
        </div>

        {/* Local Payment Methods Verification Badges */}
        <div className="rounded-2xl border border-white/10 bg-zinc-900/40 p-6 flex flex-col md:flex-row items-center justify-between gap-4">
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
            <span className="rounded-lg bg-zinc-800 border border-white/10 px-3 py-1.5 text-zinc-200">
              ⚡ QRIS All Payment
            </span>
            <span className="rounded-lg bg-zinc-800 border border-white/10 px-3 py-1.5 text-zinc-200">
              GoPay / OVO / DANA
            </span>
            <span className="rounded-lg bg-zinc-800 border border-white/10 px-3 py-1.5 text-zinc-200">
              ShopeePay
            </span>
            <span className="rounded-lg bg-zinc-800 border border-white/10 px-3 py-1.5 text-zinc-200">
              BCA / Mandiri / BRI VA
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
