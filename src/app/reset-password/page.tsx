'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, KeyRound } from 'lucide-react';
import Link from 'next/link';
import { authClient } from '@/lib/auth-client';

function ResetPasswordInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';
  const urlError = searchParams.get('error');
  const [newPassword, setNewPassword] = useState('');
  const [done, setDone] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (newPassword.length < 8) {
      setErrorMsg('Password minimal 8 karakter.');
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await authClient.resetPassword({ token, newPassword });
      if (res.error) {
        setErrorMsg(res.error.message || 'Link tidak valid atau sudah kedaluwarsa.');
        return;
      }
      setDone(true);
    } catch {
      setErrorMsg('Gagal mengubah password. Coba lagi.');
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
          <h1 className="text-xl font-bold text-white font-display">Reset Password</h1>
        </div>

        {urlError ? (
          <div className="space-y-4 text-center">
            <p className="text-sm font-semibold text-rose-400">Link reset tidak valid atau sudah kedaluwarsa.</p>
            <Link href="/forgot-password" className="inline-block text-xs font-semibold text-brand-400 hover:text-white">
              Minta link baru
            </Link>
          </div>
        ) : done ? (
          <div className="space-y-4 text-center">
            <p className="text-sm text-white">Password berhasil diubah. Silakan masuk dengan password baru.</p>
            <button
              type="button"
              onClick={() => router.push('/')}
              className="w-full rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 py-3 text-sm font-bold text-white hover:brightness-110"
            >
              Ke halaman masuk
            </button>
          </div>
        ) : !token ? (
          <div className="space-y-4 text-center">
            <p className="text-sm font-semibold text-rose-400">Token tidak ditemukan di URL.</p>
            <Link href="/forgot-password" className="inline-block text-xs font-semibold text-brand-400 hover:text-white">
              Minta link reset
            </Link>
          </div>
        ) : (
          <form onSubmit={submit} className="space-y-3">
            <input
              type="password"
              required
              placeholder="Password baru (min 8 karakter)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-brand-500 focus:outline-none"
            />
            {errorMsg && <p className="text-xs font-semibold text-rose-400">{errorMsg}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 py-3 text-sm font-bold text-white hover:brightness-110 active:scale-95 transition-all disabled:opacity-60"
            >
              {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Simpan Password Baru'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-[70vh] flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
        </div>
      }
    >
      <ResetPasswordInner />
    </Suspense>
  );
}
