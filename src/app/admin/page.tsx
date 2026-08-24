'use client';

import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Layers, CreditCard, Coins, AlertCircle, RefreshCw } from 'lucide-react';
import { AuthGate } from '@/components/auth-gate';
import { useAuth } from '@/lib/use-auth';

function AdminContent() {
  const { user } = useAuth();
  const [data, setData] = useState<{
    stats: { totalUsers: number; totalClips: number; completedClips: number; totalRevenue: number; pendingPayments: number };
    users: { id: string; email: string; name: string; role: string; balanceClips: number; provider: string; createdAt: string }[];
    clips: { id: string; name: string; userId: string; status: string; priceIdr: number; createdAt: string; paymentId: string | null }[];
    payments: { id: string; reference: string; status: string; amountIdr: number; method: string; clipId: string; createdAt: string }[];
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin/stats', { cache: 'no-store' });
      const j = await res.json();
      if (!res.ok) throw new Error(j.error || 'Gagal');
      setData(j);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Gagal memuat');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchStats(); }, []);

  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4">
        <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-8 text-center max-w-md">
          <AlertCircle className="h-8 w-8 text-rose-400 mx-auto" />
          <h2 className="text-lg font-bold text-white mt-3">Akses Ditolak</h2>
          <p className="text-xs text-zinc-400 mt-1">Akun <b>{user.email}</b> bukan admin. Hubungi admin_WEB.</p>
        </div>
      </div>
    );
  }

  if (loading) return <div className="min-h-[60vh] flex items-center justify-center"><RefreshCw className="h-8 w-8 animate-spin text-brand-400" /></div>;
  if (error) return <div className="min-h-[60vh] flex items-center justify-center text-rose-400 text-sm">{error}</div>;
  if (!data) return null;

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      <div className="border-b border-white/10 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-white font-display flex items-center gap-2"><ShieldCheck className="h-7 w-7 text-emerald-400" /> Admin KlipChip</h1>
          <p className="text-xs text-zinc-400 mt-1">Kelola pengguna, klip, dan pendapatan — hanya untuk <b>{user?.email}</b></p>
        </div>
        <button onClick={fetchStats} className="rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 px-4 py-2 text-xs font-bold text-white flex items-center gap-2"><RefreshCw className="h-3.5 w-3.5" /> Refresh</button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4"><p className="text-xs text-zinc-400 flex items-center gap-1"><Users className="h-3.5 w-3.5" /> Users</p><p className="text-2xl font-black text-white mt-1">{data.stats.totalUsers}</p></div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4"><p className="text-xs text-zinc-400 flex items-center gap-1"><Layers className="h-3.5 w-3.5" /> Klip</p><p className="text-2xl font-black text-white mt-1">{data.stats.totalClips}</p></div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4"><p className="text-xs text-zinc-400">Selesai</p><p className="text-2xl font-black text-emerald-400 mt-1">{data.stats.completedClips}</p></div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4"><p className="text-xs text-zinc-400 flex items-center gap-1"><Coins className="h-3.5 w-3.5 text-amber-400" /> Revenue</p><p className="text-lg font-black text-cyan-300 mt-1">Rp {data.stats.totalRevenue.toLocaleString('id-ID')}</p></div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4"><p className="text-xs text-zinc-400">Pending Pay</p><p className="text-2xl font-black text-amber-300 mt-1">{data.stats.pendingPayments}</p></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
          <h3 className="text-sm font-bold text-white mb-4">Pengguna Terbaru</h3>
          <div className="space-y-2 max-h-[320px] overflow-auto pr-1">
            {data.users.map((u) => (
              <div key={u.id} className="flex items-center justify-between rounded-xl bg-zinc-950 border border-white/5 px-3 py-2">
                <div className="min-w-0"><p className="text-xs font-bold text-white truncate">{u.name} {u.role === 'admin' && <span className="ml-1 rounded bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 text-[10px]">ADMIN</span>}</p><p className="text-[11px] text-zinc-500 truncate">{u.email} • {u.provider}</p></div>
                <span className="text-xs text-amber-300 font-bold">{u.balanceClips} klip</span>
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
          <h3 className="text-sm font-bold text-white mb-4">Klip Terbaru</h3>
          <div className="space-y-2 max-h-[320px] overflow-auto pr-1">
            {data.clips.map((c) => (
              <div key={c.id} className="rounded-xl bg-zinc-950 border border-white/5 px-3 py-2">
                <p className="text-xs font-bold text-white truncate">{c.name}</p>
                <p className="text-[11px] text-zinc-500">{c.status} • Rp {c.priceIdr.toLocaleString('id-ID')} • {new Date(c.createdAt).toLocaleDateString('id-ID')} {c.paymentId ? '• Lunas' : ''}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
        <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2"><CreditCard className="h-4 w-4" /> Pembayaran Terbaru</h3>
        <div className="space-y-2 max-h-[320px] overflow-auto pr-1">
          {data.payments.map((p) => (
            <div key={p.id} className="flex items-center justify-between rounded-xl bg-zinc-950 border border-white/5 px-3 py-2">
              <div><p className="text-xs font-mono text-white">{p.reference}</p><p className="text-[11px] text-zinc-500">{p.method} • Rp {p.amountIdr.toLocaleString('id-ID')} • {new Date(p.createdAt).toLocaleString('id-ID')}</p></div>
              <span className={`text-xs font-bold px-2 py-1 rounded-full border ${p.status === 'paid' ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300' : p.status === 'pending' ? 'bg-amber-500/15 border-amber-500/30 text-amber-300' : 'bg-zinc-800 border-white/10 text-zinc-400'}`}>{p.status}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AdminPage() {
  return <AuthGate title="Admin — Login diperlukan" description="Halaman ini hanya untuk admin."><AdminContent /></AuthGate>;
}
