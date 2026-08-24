'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ShieldCheck, 
  QrCode, 
  Wallet, 
  Building2, 
  Check, 
  Copy, 
  Clock, 
  ArrowLeft, 
  Zap,
  Lock
} from 'lucide-react';
import { PaymentMethod, SourceVideo } from '@/lib/types';

interface StepCheckoutProps {
  video: SourceVideo;
  duration: number;
  priceIdr: number;
  balanceClips: number;
  isUnlimitedCredits: boolean;
  clipId: string | null;
  onPaymentSuccess: (method: PaymentMethod, reference: string) => void;
  onBack: () => void;
}

export function StepCheckout({
  video,
  duration,
  priceIdr,
  balanceClips,
  isUnlimitedCredits,
  clipId,
  onPaymentSuccess,
  onBack,
}: StepCheckoutProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>('qris');
  const [useCredit, setUseCredit] = useState<boolean>(isUnlimitedCredits || balanceClips > 0);
  const [copied, setCopied] = useState(false);
  const [isProcessingPay, setIsProcessingPay] = useState(false);
  const [payError, setPayError] = useState('');
  const [payStatusText, setPayStatusText] = useState('');
  const [countdownSec, setCountdownSec] = useState(900); // 15:00 countdown timer

  // Countdown ticker
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdownSec((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTimer = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

  const pollPaymentStatus = async (reference: string, maxAttempts = 12) => {
    for (let i = 0; i < maxAttempts; i++) {
      await sleep(1000);
      const res = await fetch(`/api/payments/${reference}`, { cache: 'no-store' });
      if (!res.ok) continue;
      const data = await res.json();
      if (data.payment.status === 'paid') return 'paid';
      if (data.payment.status === 'failed') return 'failed';
    }
    return 'timeout';
  };

  const handlePay = async () => {
    setPayError('');
    setPayStatusText(useCredit ? 'Menggunakan 1 kredit saldo...' : 'Membuat transaksi pembayaran...');
    setIsProcessingPay(true);

    try {
      // Jalur demo tanpa akun server: langsung anggap sukses
      if (!clipId) {
        await sleep(800);
        const refCode = `KC-PAY-${Date.now().toString().slice(-8)}`;
        setPayStatusText('');
        setIsProcessingPay(false);
        onPaymentSuccess(useCredit ? 'credit' : selectedMethod, refCode);
        return;
      }

      // Jalur kredit: tanpa gateway
      if (useCredit) {
        const creditRes = await fetch('/api/payments/use-credit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ clipId }),
        });
        const creditData = await creditRes.json().catch(() => ({}));
        if (!creditRes.ok) {
          throw new Error(creditData.error || 'Gagal memakai kredit');
        }
        setPayStatusText('');
        setIsProcessingPay(false);
        onPaymentSuccess('credit', creditData.payment.reference);
        return;
      }

      // 1) Buat transaksi pembayaran di server
      const createRes = await fetch('/api/payments/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clipId, method: selectedMethod }),
      });
      const createData = await createRes.json().catch(() => ({}));
      if (!createRes.ok) {
        throw new Error(createData.error || 'Gagal membuat transaksi');
      }

      const reference = createData.payment.reference;
      setPayStatusText('Menunggu konfirmasi payment gateway (QRIS/VA)...');

      // 2) Simulasikan gateway (dev): kirim webhook ber-signature ke server
      const simRes = await fetch('/api/payments/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reference }),
      });
      const simData = await simRes.json().catch(() => ({}));
      if (!simRes.ok) {
        throw new Error(simData.error || 'Gateway gagal mengonfirmasi pembayaran');
      }

      // 3) Polling status sampai webhook memproses
      const finalStatus = await pollPaymentStatus(reference);

      if (finalStatus === 'paid') {
        setPayStatusText('');
        setIsProcessingPay(false);
        onPaymentSuccess(selectedMethod, reference);
        return;
      }

      if (finalStatus === 'failed') {
        throw new Error('Pembayaran gagal diproses gateway');
      }

      throw new Error('Waktu konfirmasi pembayaran habis. Coba lagi.');
    } catch (err) {
      setIsProcessingPay(false);
      setPayStatusText('');
      setPayError(err instanceof Error ? err.message : 'Terjadi kesalahan saat membayar.');
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-brand-500/20 text-brand-300 border border-brand-500/30 px-2 py-0.5 text-xs font-bold">
              Langkah 4 dari 5
            </span>
            <span className="text-xs text-zinc-400">• Pembayaran Per Clip</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
            Checkout & Pembayaran Aman
          </h2>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl font-semibold">
          <ShieldCheck className="h-4 w-4" />
          <span>Garansi Render Sukses / Auto-Refund</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Payment Method Selection (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Method Tabs */}
          <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6 space-y-5">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Pilih Metode Pembayaran:
            </h3>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setSelectedMethod('qris')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                  selectedMethod === 'qris'
                    ? 'border-cyan-400 bg-brand-950/40 text-cyan-300 ring-1 ring-cyan-400'
                    : 'border-white/10 bg-zinc-950/60 text-zinc-400 hover:text-white'
                }`}
              >
                <QrCode className="h-6 w-6 mb-1.5 text-cyan-400" />
                <span className="text-xs font-bold">QRIS Instant</span>
                <span className="text-[9px] text-zinc-400 mt-0.5">Semua E-Wallet & Bank</span>
              </button>

              <button
                onClick={() => setSelectedMethod('gopay')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                  ['gopay', 'ovo', 'dana', 'shopeepay'].includes(selectedMethod)
                    ? 'border-cyan-400 bg-brand-950/40 text-cyan-300 ring-1 ring-cyan-400'
                    : 'border-white/10 bg-zinc-950/60 text-zinc-400 hover:text-white'
                }`}
              >
                <Wallet className="h-6 w-6 mb-1.5 text-brand-400" />
                <span className="text-xs font-bold">E-Wallet</span>
                <span className="text-[9px] text-zinc-400 mt-0.5">GoPay / OVO / DANA</span>
              </button>

              <button
                onClick={() => setSelectedMethod('bca_va')}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all ${
                  selectedMethod.includes('_va')
                    ? 'border-cyan-400 bg-brand-950/40 text-cyan-300 ring-1 ring-cyan-400'
                    : 'border-white/10 bg-zinc-950/60 text-zinc-400 hover:text-white'
                }`}
              >
                <Building2 className="h-6 w-6 mb-1.5 text-amber-400" />
                <span className="text-xs font-bold">Virtual Account</span>
                <span className="text-[9px] text-zinc-400 mt-0.5">BCA / Mandiri / BRI</span>
              </button>
            </div>

            {/* Method Details Display */}
            {selectedMethod === 'qris' && (
              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 text-center space-y-3">
                <div className="flex items-center justify-between text-xs text-zinc-400 border-b border-white/5 pb-2">
                  <span>Batas Waktu Bayar:</span>
                  <span className="font-mono font-bold text-amber-400 flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {formatTimer(countdownSec)}
                  </span>
                </div>

                {/* Simulated QR Code */}
                <div className="mx-auto w-48 h-48 rounded-2xl bg-white p-3 flex flex-col items-center justify-center shadow-lg">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=00020101021126580014ID.LINKAJA.WWW01189360000201100000000215KlipChipMVP00005303360540450005802ID5915KLIPCHIP INDO6007JAKARTA62070703A016304724B"
                    alt="QRIS Code KlipChip"
                    className="w-full h-full object-contain"
                  />
                </div>
                <div className="text-[11px] text-zinc-400 space-y-0.5">
                  <p className="font-semibold text-white">Scan dengan Aplikasi Bank atau E-Wallet Apapun</p>
                  <p>BCA, Mandiri Livin, BRImo, BNI, GoPay, OVO, DANA, ShopeePay</p>
                </div>
              </div>
            )}

            {['gopay', 'ovo', 'dana', 'shopeepay'].includes(selectedMethod) && (
              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 space-y-4">
                <div className="flex gap-2">
                  {(['gopay', 'ovo', 'dana', 'shopeepay'] as PaymentMethod[]).map((ew) => (
                    <button
                      key={ew}
                      onClick={() => setSelectedMethod(ew)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold uppercase transition-all ${
                        selectedMethod === ew
                          ? 'bg-brand-600 text-white'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {ew}
                    </button>
                  ))}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-300">Nomor HP Akun {selectedMethod.toUpperCase()}</label>
                  <input
                    type="text"
                    defaultValue="081234567890"
                    className="w-full rounded-xl border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-brand-500"
                  />
                  <p className="text-[11px] text-zinc-500">Notifikasi konfirmasi akan dikirim ke aplikasi Anda.</p>
                </div>
              </div>
            )}

            {selectedMethod.includes('_va') && (
              <div className="rounded-2xl border border-white/10 bg-zinc-950 p-5 space-y-4">
                <div className="flex gap-2">
                  {[
                    { id: 'bca_va', name: 'BCA' },
                    { id: 'mandiri_va', name: 'Mandiri' },
                    { id: 'bri_va', name: 'BRI' },
                    { id: 'bni_va', name: 'BNI' },
                  ].map((bank) => (
                    <button
                      key={bank.id}
                      onClick={() => setSelectedMethod(bank.id as PaymentMethod)}
                      className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
                        selectedMethod === bank.id
                          ? 'bg-brand-600 text-white'
                          : 'bg-zinc-900 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {bank.name}
                    </button>
                  ))}
                </div>

                <div className="rounded-xl bg-zinc-900 p-3 flex items-center justify-between border border-white/5">
                  <div>
                    <span className="text-[10px] text-zinc-400 uppercase">Nomor Virtual Account:</span>
                    <p className="font-mono text-base font-extrabold text-cyan-300 mt-0.5">
                      8801 9283 7461 0023
                    </p>
                  </div>
                  <button
                    onClick={() => handleCopy('8801928374610023')}
                    className="flex items-center gap-1 rounded-lg bg-white/10 px-3 py-1.5 text-xs font-bold text-white hover:bg-white/20 transition-all"
                  >
                    {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                    <span>{copied ? 'Tersalin' : 'Salin'}</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Order Summary & Pay Trigger (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          <div className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6 space-y-5 shadow-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-b border-white/10 pb-3">
              Ringkasan Pesanan Klip
            </h3>

            {/* Credit balance & selection */}
            <div
              className={`rounded-2xl border p-4 transition-all ${
                useCredit ? 'border-emerald-400 bg-emerald-500/10' : 'border-white/10 bg-zinc-950/60'
              }`}
            >
              <label className="flex items-center justify-between cursor-pointer gap-3">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={useCredit}
                    disabled={!isUnlimitedCredits && balanceClips <= 0}
                    onChange={(e) => setUseCredit(e.target.checked)}
                    className="h-4 w-4 accent-emerald-500"
                  />
                  <div>
                    <p className="text-xs font-bold text-white">Bayar dengan 1 Kredit</p>
                    <p className="text-[10px] text-zinc-400">
                      Saldo kredit Anda:{' '}
                      <span className="font-bold text-amber-300">
                        {isUnlimitedCredits ? '∞ (Admin)' : balanceClips}
                      </span>{' '}
                      kredit
                    </p>
                  </div>
                </div>
                {useCredit && (
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-lg border border-emerald-500/30">
                    Gratis
                  </span>
                )}
              </label>
              {!isUnlimitedCredits && balanceClips <= 0 && (
                <p className="text-[10px] text-rose-400 mt-2">
                  Kredit habis. <Link href="/pricing" className="underline">Beli kredit</Link> atau bayar per clip.
                </p>
              )}
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between">
                <span className="text-zinc-400">Judul Video:</span>
                <span className="font-medium text-white max-w-[180px] truncate text-right">
                  {video.title}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Durasi Klip:</span>
                <span className="font-bold text-cyan-300">{duration} Detik (Format 9:16)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Resolusi Render:</span>
                <span className="font-medium text-white">Full HD 1080x1920 (60fps)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Watermark:</span>
                <span className="font-bold text-emerald-400">Tanpa Watermark (Clean)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Auto-Caption Slang:</span>
                <span className="font-medium text-white">Bahasa Indonesia Normalizer</span>
              </div>
            </div>

            <div className="pt-4 border-t border-white/10 space-y-2">
              <div className="flex justify-between text-xs text-zinc-400">
                <span>Harga per Clip:</span>
                <span className="line-through">Rp 1.000</span>
              </div>
              <div className="flex justify-between text-xs text-emerald-400">
                <span>Harga Promo:</span>
                <span>- Rp 500</span>
              </div>
              <div className="flex items-baseline justify-between pt-2 border-t border-white/5">
                <span className="text-sm font-bold text-white">Total Tagihan:</span>
                <span className="text-2xl font-black text-white font-display">
                  {useCredit ? (
                    <span className="text-emerald-400">1 Kredit (Rp 0)</span>
                  ) : (
                    <>Rp {priceIdr.toLocaleString('id-ID')}</>
                  )}
                </span>
              </div>
            </div>

            {/* Payment status / error display */}
            {payError && (
              <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-xs font-semibold text-rose-300">
                {payError}
              </div>
            )}
            {payStatusText && !payError && (
              <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-xs font-semibold text-cyan-300 flex items-center gap-2">
                <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
                <span>{payStatusText}</span>
              </div>
            )}

            {/* Instant Payment Trigger (Webhook Terverifikasi Signature) */}
            <button
              onClick={handlePay}
              disabled={isProcessingPay || !clipId}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-brand-500 to-cyan-400 py-4 text-sm font-black text-black shadow-xl shadow-brand-500/30 hover:brightness-110 active:scale-95 transition-all disabled:opacity-60"
            >
              {isProcessingPay ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-black border-t-transparent" />
              ) : (
                <>
                  <Zap className="h-4 w-4 fill-black" />
                  <span>
                    {useCredit
                      ? isUnlimitedCredits
                        ? 'Bayar 1 Kredit (∞ Admin) & Render Instan'
                        : `Bayar 1 Kredit (Sisa ${balanceClips - 1}) & Render Instan`
                      : `Bayar Rp ${priceIdr.toLocaleString('id-ID')} & Render Instan`}
                  </span>
                </>
              )}
            </button>

            {!clipId && (
              <p className="text-[11px] text-amber-400 text-center">
                Mode demo: klip belum tersimpan ke server, pembayaran disimulasikan lokal.
              </p>
            )}

            <p className="text-[11px] text-zinc-500 text-center flex items-center justify-center gap-1">
              <Lock className="h-3 w-3" />
              <span>Webhook transaksi terenkripsi & terverifikasi otomatis.</span>
            </p>
          </div>

          <div className="flex justify-start">
            <button
              onClick={onBack}
              className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Kembali ke Editor Preview</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
