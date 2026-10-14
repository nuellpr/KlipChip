'use client';

import { useState } from 'react';
import { Loader2, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      // redirectTo absolut (origin halaman ini) supaya link reset mengarah ke
      // origin yang sama (localhost / tunnel), bukan baseURL default.
      const res = await authClient.requestPasswordReset({
        email,
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (res.error) {
        setErrorMsg(res.error.message || 'Gagal mengirim link reset.');
        return;
      }
      setSent(true);
    } catch {
      setErrorMsg('Gagal mengirim link reset.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md rounded-3xl border border-white/15 bg-zinc-900 p-8 shadow-2xl space-y-6">
        <div className="text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/20 border border-brand-500/30">
            <KeyRound className="h-7 w-7 text-brand-400" />
          </div>
          <h1 className="text-xl font-bold text-white font-display">Lupa Password</h1>
          <p className="text-xs text-zinc-400 mt-1.5">
            Masukkan email akunmu. Kami akan mengirim link untuk membuat password baru.
          </p>
        </div>

        {sent ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-white">
              Kalau <span className="font-semibold">{email}</span> terdaftar, link reset sudah dikirim.
              Cek inbox (dan folder spam).
            </p>
            <Link href="/" className="inline-block text-xs font-semibold text-brand-400 hover:text-white">
              ← Kembali ke beranda
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <input
              type="email"
              required
              placeholder="nama@emailkreator.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-brand-500 focus:outline-none"
            />
            {errorMsg && <p className="text-xs font-semibold text-rose-400">{errorMsg}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 py-3 text-sm font-bold text-white hover:brightness-110 active:scale-95 transition-all disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Kirim Link Reset'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
