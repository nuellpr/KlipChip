'use client';

import React, { useState } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { useAuth } from '@/lib/use-auth';

interface AuthGateProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

export function AuthGate({
  children,
  title = 'Masuk untuk Melanjutkan',
  description = 'Kelola riwayat klip, pembayaran, dan unduhan video Anda dengan akun KlipChip.',
}: AuthGateProps) {
  const { user, isLoading, login } = useAuth();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      await login(email, name || undefined);
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Login gagal, coba lagi.');
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

          <form onSubmit={handleSubmit} className="space-y-3">
            <input
              type="text"
              placeholder="Nama kreator (opsional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-brand-500 focus:outline-none"
            />
            <input
              type="email"
              required
              placeholder="nama@emailkreator.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-brand-500 focus:outline-none"
            />
            {errorMsg && (
              <p className="text-xs font-semibold text-rose-400">{errorMsg}</p>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 py-3 text-sm font-bold text-white hover:brightness-110 active:scale-95 transition-all shadow-lg shadow-brand-600/30 disabled:opacity-60"
            >
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <span>Masuk / Daftar Sekaligus</span>
              )}
            </button>
          </form>

          <p className="text-[11px] text-zinc-500 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="h-3 w-3" />
            <span>Session aman berbasis cookie httpOnly terenkripsi.</span>
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
