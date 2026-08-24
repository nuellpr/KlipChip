'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Zap, 
  Video, 
  Layers, 
  BookOpen, 
  CreditCard, 
  User as UserIcon, 
  LogOut, 
  Sparkles, 
  Menu, 
  X,
  Coins,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import { useAuth } from '@/lib/use-auth';

export function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isLoading, login, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);

  const navLinks = [
    { name: 'Beranda', href: '/', icon: Zap },
    { name: 'Studio Klip', href: '/studio', icon: Video, badge: 'AI Highlight' },
    { name: 'Riwayat Klip', href: '/dashboard', icon: Layers },
    { name: 'Kamus Slang', href: '/dictionary', icon: BookOpen, badge: 'Indo Slang' },
    { name: 'Harga', href: '/pricing', icon: CreditCard },
  ];

  const handleLogin = async (e: React.FormEvent, provider: 'google' | 'magic_link') => {
    e.preventDefault();
    if (!emailInput || isSubmittingAuth) return;
    setAuthError('');
    setIsSubmittingAuth(true);
    try {
      await login(emailInput, nameInput || undefined, provider);
      setShowAuthModal(false);
      setEmailInput('');
      setNameInput('');
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Login gagal, coba lagi.');
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/60 backdrop-blur-xl transition-all">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link href="/" className="group flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/klipchip-logo.svg" alt="KlipChip" className="h-10 w-10 transition-transform group-hover:scale-105" />
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="text-xl font-extrabold tracking-tight text-white">
                    Klip<span className="text-cyan-400">Chip</span>
                  </span>
                  <span className="rounded bg-brand-500/20 px-1.5 py-0.5 text-[10px] font-bold text-brand-300 border border-brand-500/30">
                    MVP
                  </span>
                </div>
                <span className="text-[10px] text-zinc-400 font-medium tracking-wide">
                  Livestream-to-Clip AI
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-brand-500/15 text-white font-semibold shadow-inner'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${isActive ? 'text-brand-400' : 'text-zinc-500'}`} />
                    <span>{link.name}</span>
                    {link.badge && (
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-semibold ${
                        isActive ? 'bg-brand-400/20 text-brand-300' : 'bg-white/10 text-zinc-400'
                      }`}>
                        {link.badge}
                      </span>
                    )}
                    {isActive && (
                      <span className="absolute bottom-0 left-2 right-2 h-0.5 bg-gradient-to-r from-brand-500 to-cyan-400 rounded-full" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Actions (Auth & Quick Launch) */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                {/* Credit balance badge */}
                <div className="flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300 shadow-sm">
                  <Coins className="h-3.5 w-3.5 text-amber-400" />
                  <span>Kredit: {user.role === 'admin' ? '∞ (Admin)' : user.balanceClips}</span>
                </div>

                {/* User avatar dropdown info */}
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-zinc-900/80 px-2.5 py-1 text-xs font-medium text-zinc-300">
                  <Link href="/profile" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                    {user.avatarUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={user.avatarUrl} alt={user.name} className="h-6 w-6 rounded-full object-cover border border-white/10" />
                    ) : (
                      <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-brand-500 to-cyan-400 flex items-center justify-center text-white font-bold text-[11px] uppercase">
                        {user.name.charAt(0)}
                      </div>
                    )}
                    <span className="max-w-[100px] truncate text-zinc-200">{user.name}</span>
                  </Link>
                  <button
                    onClick={() => logout()}
                    title="Keluar Akun"
                    className="ml-1 text-zinc-500 hover:text-rose-400 transition-colors"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                disabled={isLoading}
                className="flex items-center gap-1.5 rounded-lg border border-white/15 bg-white/5 px-3.5 py-1.5 text-xs font-medium text-zinc-200 hover:bg-white/10 hover:text-white transition-all"
              >
                {isLoading ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin text-zinc-400" />
                ) : (
                  <UserIcon className="h-3.5 w-3.5 text-zinc-400" />
                )}
                <span>Masuk / Login</span>
              </button>
            )}

            {user?.role === 'admin' && (
              <Link
                href="/admin"
                className="hidden sm:inline-flex items-center gap-1.5 rounded-lg bg-amber-500/15 border border-amber-500/30 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-500/25 transition-all"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                <span>Admin</span>
              </Link>
            )}
            {/* Quick CTA */}
            <Link
              href="/studio"
              className="relative inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-brand-500 px-4 py-2 text-xs font-bold text-white shadow-lg shadow-brand-600/30 transition-all hover:brightness-110 hover:scale-[1.02] active:scale-[0.98]"
            >
              <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
              <span>Buat Clip (Rp 5.000)</span>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/studio"
              className="rounded-lg bg-brand-600 px-3 py-1.5 text-xs font-bold text-white"
            >
              Klip
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="rounded-lg p-2 text-zinc-400 hover:bg-white/10 hover:text-white"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-white/10 bg-zinc-950 px-4 pt-2 pb-6 space-y-3">
            <div className="space-y-1">
              {navLinks.map((link) => {
                const isActive = pathname === link.href;
                const Icon = link.icon;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center justify-between rounded-lg px-3 py-2.5 text-sm font-medium ${
                      isActive
                        ? 'bg-brand-600/20 text-brand-300 font-semibold'
                        : 'text-zinc-400 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="h-4 w-4" />
                      <span>{link.name}</span>
                    </div>
                    {link.badge && (
                      <span className="text-[10px] bg-brand-500/20 text-brand-300 px-2 py-0.5 rounded-full">
                        {link.badge}
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-between">
              {user ? (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 text-xs text-zinc-300">
                    <Coins className="h-4 w-4 text-amber-400" />
                    <span>Kredit: {user.role === 'admin' ? '∞ (Admin)' : user.balanceClips}</span>
                  </div>
                  <button
                    onClick={() => logout()}
                    className="text-xs text-rose-400 hover:underline"
                  >
                    Keluar Akun
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setShowAuthModal(true);
                  }}
                  className="w-full text-center py-2 rounded-lg bg-white/10 text-xs font-semibold text-white"
                >
                  Masuk dengan Google / Magic Link
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Auth Modal Simulation */}
      {showAuthModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-zinc-900 p-6 shadow-2xl">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-center mb-6">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/20 border border-brand-500/30 p-1.5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src="/klipchip-logo.svg" alt="KlipChip" className="h-full w-full" />
              </div>
              <h3 className="text-xl font-bold text-white">Masuk ke KlipChip</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Kelola riwayat klip, unduh video tanpa batas waktu, dan nikmati sistem pay-per-clip cepat.
              </p>
            </div>

            <form onSubmit={(e) => handleLogin(e, 'magic_link')} className="space-y-3">
              <input
                type="text"
                placeholder="Nama kreator (opsional)"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-brand-500 focus:outline-none"
              />
              <input
                type="email"
                required
                placeholder="nama@emailkreator.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-brand-500 focus:outline-none"
              />

              {authError && (
                <p className="text-xs font-semibold text-rose-400">{authError}</p>
              )}

              {/* Google Sign in â€” OAuth sungguhan */}
              <a
                href="/api/auth/google"
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/15 bg-zinc-800/80 px-4 py-2.5 text-sm font-semibold text-white hover:bg-zinc-700 transition-all"
              >
                <svg className="h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                  />
                </svg>
                <span>Lanjutkan dengan Google</span>
              </a>
              <p className="text-[11px] text-zinc-500 text-center">
                Memerlukan <code className="text-zinc-300">GOOGLE_CLIENT_ID</code> di <code className="text-zinc-300">.env</code>
              </p>

              <div className="flex items-center gap-2 text-xs text-zinc-500">
                <div className="h-[1px] flex-1 bg-white/10" />
                <span>atau</span>
                <div className="h-[1px] flex-1 bg-white/10" />
              </div>

              <button
                type="submit"
                disabled={isSubmittingAuth}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-brand-600 py-2.5 text-sm font-bold text-white hover:bg-brand-500 transition-all shadow-lg shadow-brand-600/30 disabled:opacity-60"
              >
                {isSubmittingAuth ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <span>Masuk dengan Email</span>
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
