'use client';

import React, { useState } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/use-auth';

interface AuthGateProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const MIN_PASSWORD = 8;

export function AuthGate({
  children,
  title = 'Masuk untuk Melanjutkan',
  description = 'Kelola riwayat klip, pembayaran, dan unduhan video Anda dengan akun KlipChip.',
}: AuthGateProps) {
  const { user, isLoading, login, register, loginWithGoogle } = useAuth();
  const [mode, setMode] = useState<'in' | 'up'>('in');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < MIN_PASSWORD) {
      setErrorMsg(`Password minimal ${MIN_PASSWORD} karakter.`);
      return;
    }

    setIsSubmitting(true);
    try {
      if (mode === 'in') {
        await login(email, password);
      } else {
        await register(email, password, name.trim() || email.split('@')[0]);
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Gagal, coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await loginWithGoogle();
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Login Google gagal.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-brand-400" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md rounded-3xl border border-white/15 bg-zinc-900 p-8 shadow-2xl space-y-6">
          <div className="text-center">
            <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/20 border border-brand-500/30 p-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/klipchip-logo.svg" alt="KlipChip" className="h-full w-full" />
            </div>
            <h2 className="text-xl font-bold text-white font-display">{title}</h2>
            <p className="text-xs text-zinc-400 mt-1.5">{description}</p>
          </div>

          <div className="flex gap-1 rounded-xl bg-zinc-950 p-1">
            {(['in', 'up'] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => { setMode(m); setErrorMsg(''); }}
                className={`flex-1 rounded-lg py-2 text-xs font-bold transition-all ${
                  mode === m ? 'bg-brand-600 text-white' : 'text-zinc-400 hover:text-white'
                }`}
              >
                {m === 'in' ? 'Masuk' : 'Daftar'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'up' && (
              <input
                type="text"
                placeholder="Nama kreator"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-brand-500 focus:outline-none"
              />
            )}
            <input
              type="email"
              required
              placeholder="nama@emailkreator.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-brand-500 focus:outline-none"
            />
            <input
              type="password"
              required
              placeholder="Password (min 8 karakter)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-brand-500 focus:outline-none"
            />
            {errorMsg && <p className="text-xs font-semibold text-rose-400">{errorMsg}</p>}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 py-3 text-sm font-bold text-white hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-brand-600/30 disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span>{mode === 'in' ? 'Masuk' : 'Daftar'}</span>
              )}
            </button>
          </form>

          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-[10px] uppercase tracking-widest text-zinc-500">atau</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-zinc-950 py-3 text-sm font-bold text-white transition-all hover:border-white/30 disabled:opacity-60"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="currentColor"
                d="M21.35 11.1h-9.17v2.96h5.27c-.24 1.42-1.72 4.16-5.27 4.16-3.08 0-5.6-2.55-5.6-5.7s2.52-5.7 5.6-5.7c1.76 0 2.94.75 3.61 1.39l2.46-2.37C16.7 4.34 14.6 3.5 12.18 3.5 7.6 3.5 3.85 7.24 3.85 11.82s3.75 8.32 8.33 8.32c4.81 0 8-3.38 8-8.15 0-.55-.06-.97-.13-1.39z"
              />
            </svg>
            Lanjutkan dengan Google
          </button>

          <p className="text-[11px] text-zinc-500 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            <span>Session dikelola Better Auth, cookie httpOnly bertanda tangan.</span>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
