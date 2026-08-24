'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { User, Mail, Calendar, Coins, Save, LogOut, Layers, CreditCard, ShieldCheck, Camera } from 'lucide-react';
import { AuthGate } from '@/components/auth-gate';
import { useAuth } from '@/lib/use-auth';
import { ClipProject } from '@/lib/types';

function ProfileContent() {
  const { user, logout, refresh } = useAuth();
  const [editName, setEditName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [saveError, setSaveError] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [createdAt, setCreatedAt] = useState<string>('');
  const [provider, setProvider] = useState<string>('');
  const [clips, setClips] = useState<ClipProject[]>([]);

  useEffect(() => {
    if (user) {
      setEditName(user.name);
      setAvatarUrl(user.avatarUrl || '');
    }
    // ambil detail lengkap (createdAt, provider) + riwayat
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d?.user?.createdAt) setCreatedAt(d.user.createdAt);
        if (d?.user?.provider) setProvider(d.user.provider);
        if (d?.user?.avatarUrl) setAvatarUrl(d.user.avatarUrl);
      })
      .catch(() => {});
    fetch('/api/clips', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { clips: [] }))
      .then((d) => setClips(d.clips || []))
      .catch(() => {});
  }, [user]);

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 500 * 1024) {
      setAvatarError('Gambar maksimal 500KB');
      return;
    }
    if (!file.type.startsWith('image/')) {
      setAvatarError('Hanya file gambar yang didukung');
      return;
    }
    setAvatarError('');
    setIsUploadingAvatar(true);
    try {
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Gagal membaca file'));
        reader.readAsDataURL(file);
      });
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ avatarUrl: dataUrl }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan avatar');
      setAvatarUrl(dataUrl);
      refresh();
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'Gagal upload avatar');
    } finally {
      setIsUploadingAvatar(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveError('');
    setSaveMsg('');
    setIsSaving(true);
    try {
      const res = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editName }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Gagal menyimpan');
      setSaveMsg('Nama berhasil diperbarui!');
      refresh();
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Gagal menyimpan');
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  const totalSpent = clips.filter((c) => c.paymentId).length * 500;
  const completedCount = clips.filter((c) => c.status === 'completed').length;

  const joinDate = createdAt
    ? new Date(createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
    : '-';

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-8">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-extrabold text-white font-display">Profil Saya</h1>
        <p className="text-sm text-zinc-400 mt-1">Kelola nama tampilan, lihat informasi akun, saldo, dan riwayat pembelian.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kartu profil */}
        <div className="lg:col-span-1 rounded-3xl border border-white/10 bg-zinc-900/80 p-6 space-y-5">
          <div className="flex flex-col items-center text-center">
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploadingAvatar}
              title="Klik untuk ganti foto profil"
              className="group relative h-20 w-20 rounded-full overflow-hidden bg-gradient-to-tr from-brand-500 to-cyan-400 flex items-center justify-center text-white font-black text-2xl focus:outline-none focus:ring-2 focus:ring-brand-500 disabled:opacity-60"
            >
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={avatarUrl} alt={user.name} className="h-full w-full object-cover" />
              ) : (
                <span>{user.name.charAt(0).toUpperCase()}</span>
              )}
              <span className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="h-5 w-5 text-white" />
              </span>
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleAvatarChange} className="hidden" />
            {isUploadingAvatar && <p className="text-xs text-cyan-300 mt-1">Mengunggah...</p>}
            {avatarError && <p className="text-xs font-semibold text-rose-400 mt-1">{avatarError}</p>}
            <p className="text-[11px] text-zinc-500 mt-1">Klik foto untuk ganti (maks 500KB)</p>
            <h2 className="text-lg font-bold text-white mt-3">{user.name}</h2>
            <p className="text-xs text-zinc-400 flex items-center gap-1">
              <Mail className="h-3 w-3" /> {user.email}
            </p>
            <span className="mt-2 inline-flex items-center gap-1 rounded-full border border-white/10 bg-zinc-950 px-3 py-1 text-xs font-semibold text-zinc-300">
              <ShieldCheck className="h-3 w-3 text-emerald-400" />
              {provider === 'google' ? 'Login via Google' : 'Magic Link'}
            </span>
          </div>

          <div className="space-y-2 text-xs border-t border-white/10 pt-4">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Bergabung</span>
              <span className="text-white font-medium">{joinDate}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span className="flex items-center gap-1"><Coins className="h-3.5 w-3.5 text-amber-400" /> Kredit</span>
              <span className="text-amber-300 font-bold">
                {user.role === 'admin' ? '∞ (Admin)' : user.balanceClips} Kredit
              </span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span className="flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> Total klip</span>
              <span className="text-white font-medium">{clips.length}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span className="flex items-center gap-1"><CreditCard className="h-3.5 w-3.5" /> Total belanja</span>
              <span className="text-cyan-300 font-bold">Rp {totalSpent.toLocaleString('id-ID')}</span>
            </div>
            <div className="flex items-center justify-between text-zinc-400">
              <span>Selesai dirender</span>
              <span className="text-emerald-400 font-bold">{completedCount}</span>
            </div>
          </div>

          <button
            onClick={() => logout()}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 py-2.5 text-xs font-bold text-white transition-all"
          >
            <LogOut className="h-4 w-4" /> Keluar Akun
          </button>
        </div>

        {/* Form edit + riwayat singkat */}
        <div className="lg:col-span-2 space-y-6">
          <form onSubmit={handleSave} className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="h-4 w-4 text-brand-400" /> Ganti Nama Profil
            </h3>
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              minLength={2}
              maxLength={60}
              className="w-full rounded-xl border border-white/15 bg-zinc-950 px-4 py-2.5 text-sm text-white placeholder-zinc-500 focus:border-brand-500 focus:outline-none"
              placeholder="Nama tampilan baru"
            />
            {saveError && <p className="text-xs font-semibold text-rose-400">{saveError}</p>}
            {saveMsg && <p className="text-xs font-semibold text-emerald-400">{saveMsg}</p>}
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-500 px-5 py-2.5 text-xs font-bold text-white transition-all disabled:opacity-60"
            >
              <Save className="h-4 w-4" /> {isSaving ? 'Menyimpan...' : 'Simpan Nama'}
            </button>
            <p className="text-[11px] text-zinc-500">Nama akan tampil di navbar dan invoice. Email tidak dapat diubah.</p>
          </form>

          <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-white">Riwayat Pembelian Terbaru</h3>
              <Link href="/dashboard" className="text-xs font-bold text-cyan-300 hover:underline">
                Lihat semua â†’
              </Link>
            </div>
            {clips.length === 0 ? (
              <p className="text-xs text-zinc-500 text-center py-8">Belum ada pembelian klip.</p>
            ) : (
              <div className="space-y-2">
                {clips.slice(0, 5).map((c) => (
                  <div key={c.id} className="flex items-center justify-between rounded-xl bg-zinc-950 border border-white/5 px-4 py-3">
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-white truncate max-w-[220px]">{c.name}</p>
                      <p className="text-[11px] text-zinc-500">
                        {new Date(c.createdAt).toLocaleDateString('id-ID')} â€¢ {c.status} â€¢ Rp {c.priceIdr.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <span className={`text-[11px] font-bold px-2 py-1 rounded-full border ${c.paymentId ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : 'bg-zinc-800 border-white/10 text-zinc-400'}`}>
                      {c.paymentId ? 'Lunas' : 'Belum bayar'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <AuthGate title="Masuk untuk melihat profil" description="Login terlebih dahulu untuk mengelola profil Anda.">
      <ProfileContent />
    </AuthGate>
  );
}
