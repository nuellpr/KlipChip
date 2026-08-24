'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Check, 
  Coins, 
  ArrowRight, 
  Calculator,
  CreditCard,
  Loader2
} from 'lucide-react';
import { FaqSection } from '@/components/landing/faq-section';
import { CLIP_PRICE_IDR, CREDIT_PACKAGES } from '@/lib/pricing';

export default function PricingPage() {
  const [clipsCount, setClipsCount] = useState<number>(10);
  const [buyingCode, setBuyingCode] = useState<string | null>(null);
  const [buyError, setBuyError] = useState('');
  const [buyStatus, setBuyStatus] = useState('');

  const payPerClipCost = clipsCount * CLIP_PRICE_IDR;

  let recommendedPlan = 'Pay-Per-Clip';
  if (clipsCount > 8 && clipsCount <= 25) {
    recommendedPlan = 'Paket Starter (Hemat)';
  } else if (clipsCount > 25) {
    recommendedPlan = 'Creator Pro (Paling Hemat)';
  }

  const handleBuyPackage = async (code: string) => {
    setBuyingCode(code);
    setBuyError('');
    setBuyStatus('Membuat transaksi pembelian kredit...');
    try {
      const createRes = await fetch('/api/payments/packages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ packageCode: code, method: 'qris' }),
      });
      const createData = await createRes.json().catch(() => ({}));
      if (!createRes.ok) {
        throw new Error(createData.error || 'Gagal membuat transaksi paket');
      }

      setBuyStatus('Mengonfirmasi pembayaran simulasi gateway...');
      const simRes = await fetch('/api/payments/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference: createData.payment.reference }),
      });
      const simData = await simRes.json().catch(() => ({}));
      if (!simRes.ok) {
        throw new Error(simData.error || 'Gateway gagal mengonfirmasi');
      }

      setBuyStatus(`✓ ${createData.payment.creditAmount} kredit berhasil ditambahkan ke saldo Anda!`);
      setTimeout(() => {
        window.location.reload();
      }, 1200);
    } catch (err) {
      setBuyError(err instanceof Error ? err.message : 'Gagal membeli paket.');
      setBuyStatus('');
    } finally {
      setBuyingCode(null);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-xs font-semibold text-emerald-300">
          <Coins className="h-3.5 w-3.5" />
          <span>Harga Transparan — Akun Baru Dapat 3 Kredit Gratis</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-white font-display">
          Harga Sederhana & Ramah Kantong Kreator
        </h1>
        <p className="text-base text-zinc-400 leading-relaxed">
          1 kredit = 1 klip. Bayar Rp {CLIP_PRICE_IDR.toLocaleString('id-ID')} per clip via QRIS, atau beli paket
          kredit agar harga per clip makin murah.
        </p>
      </div>

      {/* Buy status / error */}
      {(buyStatus || buyError) && (
        <div
          className={`max-w-2xl mx-auto rounded-2xl border px-4 py-3 text-xs font-semibold ${
            buyError
              ? 'border-rose-500/40 bg-rose-500/10 text-rose-300'
              : 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
          }`}
        >
          {buyError || buyStatus}
        </div>
      )}

      {/* Interactive Cost & ROI Calculator */}
      <div className="rounded-3xl border border-white/15 bg-zinc-900/90 p-6 sm:p-8 max-w-4xl mx-auto shadow-2xl backdrop-blur-xl space-y-6">
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <Calculator className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Kalkulator Penghematan KlipChip</h3>
              <p className="text-xs text-zinc-400">
                Geser estimasi jumlah klip yang ingin Anda upload ke Shorts/TikTok per bulan:
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-cyan-300 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/20">
            Rekomendasi: {recommendedPlan}
          </span>
        </div>

        {/* Slider */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-zinc-300 font-medium">Target Klip Per Bulan:</span>
            <span className="font-mono text-2xl font-black text-cyan-300">
              {clipsCount} Klip Vertikal / Bulan
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={60}
            value={clipsCount}
            onChange={(e) => setClipsCount(Number(e.target.value))}
            className="w-full h-3 bg-zinc-950 rounded-lg appearance-none cursor-pointer accent-cyan-400"
          />
          <div className="flex justify-between text-xs text-zinc-500">
            <span>1 Klip</span>
            <span>15 Klip (Starter)</span>
            <span>30 Klip</span>
            <span>50+ Klip (Pro)</span>
          </div>
        </div>

        {/* Comparison Result Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/10">
          <div className="rounded-2xl bg-zinc-950 p-4 border border-white/5 space-y-1">
            <span className="text-xs text-zinc-400">Biaya Pay-Per-Clip:</span>
            <p className="text-xl font-black text-white">
              Rp {payPerClipCost.toLocaleString('id-ID')}
            </p>
            <p className="text-[11px] text-zinc-500">Rp {CLIP_PRICE_IDR} x {clipsCount} klip</p>
          </div>

          {CREDIT_PACKAGES.map((pkg) => (
            <div key={pkg.code} className="rounded-2xl bg-zinc-950 p-4 border border-brand-500/30 space-y-1">
              <span className="text-xs text-brand-300 font-bold">{pkg.name} ({pkg.credits} Kredit):</span>
              <p className="text-xl font-black text-brand-300">Rp {pkg.priceIdr.toLocaleString('id-ID')}</p>
              <p className="text-[11px] text-emerald-400">
                {clipsCount >= Math.ceil(pkg.credits * 0.6)
                  ? `Hemat Rp ${Math.max(0, (payPerClipCost - pkg.priceIdr)).toLocaleString('id-ID')}`
                  : `~Rp ${pkg.perClipIdr} / clip`}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-6xl mx-auto">
        {/* Pay-Per-Clip */}
        <div className="relative rounded-3xl border-2 border-brand-500 bg-zinc-900/90 p-8 flex flex-col justify-between shadow-2xl shadow-brand-500/20">
          <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-brand-500 to-cyan-400 px-4 py-1 text-xs font-bold uppercase tracking-wider text-white">
            Default Tanpa Langganan
          </div>

          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-2xl font-bold text-white">Pay-Per-Clip</h3>
                <p className="text-xs text-zinc-400 mt-0.5">Bayar satuan saat butuh</p>
              </div>
              <span className="rounded-xl bg-brand-500/20 text-brand-300 px-3 py-1 text-xs font-bold border border-brand-500/30">
                Mikro-Bayar
              </span>
            </div>

            <div className="my-6">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black text-white font-display">Rp 500</span>
                <span className="text-sm text-zinc-400">/ clip</span>
              </div>
              <p className="text-xs text-emerald-400 mt-1">✓ Akun baru gratis 3 kredit</p>
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
                <span>6 Mode Layout & Pilih Sumber Subtitle</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Ekspor 1080x1920 MP4 (Tanpa Watermark)</span>
              </li>
              <li className="flex items-center gap-2">
                <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                <span>Preview Gratis Sebelum Bayar</span>
              </li>
            </ul>
          </div>

          <Link
            href="/studio"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-cyan-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/30 hover:brightness-110 active:scale-95 transition-all"
          >
            <span>Mulai Klip Pertama (Rp 500)</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Package Cards */}
        {CREDIT_PACKAGES.map((pkg, idx) => (
          <div
            key={pkg.code}
            className={`rounded-3xl border p-8 flex flex-col justify-between transition-all ${
              idx === 0
                ? 'border-white/10 bg-zinc-900/60 hover:border-white/20'
                : 'border-cyan-500/40 bg-zinc-900/80 shadow-2xl shadow-cyan-500/10'
            }`}
          >
            {idx === 1 && (
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-cyan-400 to-emerald-400 px-4 py-1 text-xs font-bold uppercase tracking-wider text-black">
                Paling Hemat
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-white">{pkg.name}</h3>
                  <p className="text-xs text-zinc-400 mt-0.5">{pkg.credits} Kredit ({pkg.credits} Klip)</p>
                </div>
                <span className="rounded-xl bg-cyan-500/10 text-cyan-300 px-3 py-1 text-xs border border-cyan-500/20">
                  {pkg.credits} Kredit
                </span>
              </div>

              <div className="my-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-white font-display">
                    Rp {pkg.priceIdr.toLocaleString('id-ID')}
                  </span>
                </div>
                <p className="text-xs text-emerald-400 mt-1">{pkg.tagline}</p>
              </div>

              <ul className="space-y-3 text-xs text-zinc-300 mb-8 border-t border-white/10 pt-6">
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>{pkg.credits} kredit langsung masuk ke saldo</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Tanpa kedaluwarsa (permanen)</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Semua fitur Pay-Per-Clip termasuk</span>
                </li>
                <li className="flex items-center gap-2">
                  <Check className="h-4 w-4 text-emerald-400 shrink-0" />
                  <span>Prioritas antrean render cepat</span>
                </li>
              </ul>
            </div>

            <button
              onClick={() => handleBuyPackage(pkg.code)}
              disabled={buyingCode !== null}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-zinc-800 hover:bg-zinc-700 py-3.5 text-sm font-bold text-white border border-white/10 transition-all disabled:opacity-60"
            >
              {buyingCode === pkg.code ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <CreditCard className="h-4 w-4 text-cyan-300" />
                  <span>Beli {pkg.credits} Kredit</span>
                </>
              )}
            </button>
          </div>
        ))}
      </div>

      <FaqSection />
    </div>
  );
}
