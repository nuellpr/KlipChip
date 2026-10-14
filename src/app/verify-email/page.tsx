'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, MailCheck } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

function VerifyEmailInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') ?? '';
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resent, setResent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const verify = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const res = await authClient.emailOtp.verifyEmail({ email, otp });
      if (res.error) {
        setErrorMsg(res.error.message || 'Kode salah atau sudah kedaluwarsa.');
        return;
      }
      // Setelah verified, cek apakah sudah ada sesi (auto sign-in) lalu arahkan.
      const session = await authClient.getSession();
      router.push(session.data ? '/studio' : '/');
    } catch {
      setErrorMsg('Gagal memverifikasi. Coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resend = async () => {
    setErrorMsg('');
    try {
      await authClient.emailOtp.sendVerificationOtp({ email, type: 'email-verification' });
      setResent(true);
    } catch {
      setErrorMsg('Gagal mengirim ulang kode.');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/15 bg-zinc-900 p-8 shadow-2xl space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/20 border border-brand-500/30">
            <MailCheck className="h-7 w-7 text-brand-400" />
          </div>
          <h1 className="text-xl font-bold text-white font-display">Verifikasi Email</h1>
          <p className="text-xs text-zinc-400 mt-1.5">
            Masukkan kode 6 angka yang kami kirim ke{' '}
            <span className="text-white">{email || 'email kamu'}</span>.
          </p>
        </div>

        <form onSubmit={verify} className="space-y-3">
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            required
            maxLength={6}
            placeholder="······"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
            className="w-full rounded-xl border border-white/15 bg-zinc-950 px-4 py-2.5 text-center text-lg tracking-[0.6em] text-white placeholder-zinc-600 focus:border-brand-500 focus:outline-none"
          />
          {errorMsg && <p className="text-xs font-semibold text-rose-400">{errorMsg}</p>}
          <button
            type="submit"
            disabled={isSubmitting || otp.length < 6}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 py-3 text-sm font-bold text-white hover:brightness-110 active:scale-95 transition-all disabled:opacity-60"
          >
            {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verifikasi'}
          </button>
        </form>

        <div className="text-center text-[11px] text-zinc-500">
          Tidak menerima kode?{' '}
          <button type="button" onClick={resend} className="font-semibold text-brand-400 hover:text-white">
            Kirim ulang
          </button>
          {resent && <span className="ml-1 text-emerald-400">· kode terkirim</span>}
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
        </div>
      }
    >
      <VerifyEmailInner />
    </Suspense>
  );
}
