'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Layers, 
  Search, 
  Download, 
  Play, 
  RotateCw, 
  FileText, 
  Trash2, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Zap,
  X,
  Printer,
  RefreshCw
} from 'lucide-react';
import { ClipProject, JobStatus } from '@/lib/types';
import { AuthGate } from '@/components/auth-gate';
import { useAuth } from '@/lib/use-auth';

function DashboardContent() {
  const { user } = useAuth();
  const [clips, setClips] = useState<ClipProject[]>([]);
  const [isLoadingClips, setIsLoadingClips] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeInvoiceClip, setActiveInvoiceClip] = useState<ClipProject | null>(null);
  const [activePreviewClip, setActivePreviewClip] = useState<ClipProject | null>(null);
  const [retryingClipId, setRetryingClipId] = useState<string | null>(null);

  const fetchClips = async () => {
    setIsLoadingClips(true);
    setLoadError('');
    try {
      const res = await fetch('/api/clips', { cache: 'no-store' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Gagal memuat riwayat klip');
      }
      const data = await res.json();
      setClips(data.clips || []);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : 'Gagal memuat riwayat klip');
      setClips([]);
    } finally {
      setIsLoadingClips(false);
    }
  };

  useEffect(() => {
    fetchClips();
  }, []);

  // Filter clips
  const filteredClips = clips.filter((c) => {
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sourceVideo.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.sourceVideo.channelName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleRetryJob = async (clipId: string) => {
    setRetryingClipId(clipId);
    try {
      const res = await fetch('/api/render-clip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clipId }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Retry render gagal');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Retry render gagal');
    } finally {
      setRetryingClipId(null);
      fetchClips();
    }
  };

  const handleDeleteClip = async (clipId: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus riwayat klip ini?')) return;
    try {
      const res = await fetch(`/api/clips/${clipId}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Gagal menghapus klip');
      }
      setClips((prev) => prev.filter((c) => c.id !== clipId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Gagal menghapus klip');
    }
  };

  const getStatusBadge = (status: JobStatus) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="h-3 w-3" />
            <span>Selesai</span>
          </span>
        );
      case 'paid':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 px-2.5 py-0.5 text-xs font-bold text-cyan-400 animate-pulse">
            <Clock className="h-3 w-3" />
            <span>Membakar Caption...</span>
          </span>
        );
      case 'preview':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-purple-500/15 border border-purple-500/30 px-2.5 py-0.5 text-xs font-bold text-purple-300">
            <span>Preview Siap</span>
          </span>
        );
      case 'processing':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 text-xs font-bold text-amber-300">
            <Clock className="h-3 w-3" />
            <span>Antrean Render</span>
          </span>
        );
      case 'failed':
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/15 border border-rose-500/30 px-2.5 py-0.5 text-xs font-bold text-rose-400">
            <AlertCircle className="h-3 w-3" />
            <span>Gagal (Bisa Retry)</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-zinc-700 px-2.5 py-0.5 text-xs font-bold text-zinc-300">
            <span>Draft</span>
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Dashboard Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-brand-500/20 text-brand-300 border border-brand-500/30 px-2 py-0.5 text-xs font-bold">
              Kreator Hub
            </span>
            <span className="text-xs text-zinc-400">â€¢ Manajemen Proyek Klip</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-display mt-1">
            Riwayat Klip & Status Render
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Lihat daftar klip yang pernah dibuat, unduh ulang file video, periksa invoice, atau lakukan retry jika ada job yang tertunda.
          </p>
        </div>

        <Link
          href="/studio"
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-brand-500/30 hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Buat Klip Baru (Rp 5.000)</span>
        </Link>
        <button
          onClick={fetchClips}
          disabled={isLoadingClips}
          className="flex items-center justify-center gap-2 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 px-4 py-3 text-xs font-bold text-white transition-all disabled:opacity-60"
          title="Muat Ulang Riwayat"
        >
          <RefreshCw className={`h-4 w-4 ${isLoadingClips ? 'animate-spin' : ''}`} />
          <span>Muat Ulang</span>
        </button>
      </div>

      {/* Stats Quick Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
          <span className="text-xs font-medium text-zinc-400">Total Klip Dibuat</span>
          <p className="text-2xl font-black text-white mt-1">{clips.length}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
          <span className="text-xs font-medium text-zinc-400">Klip Siap Unduh</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">
            {clips.filter((c) => c.status === 'completed').length}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
          <span className="text-xs font-medium text-zinc-400">Kredit Tersisa</span>
          <p className="text-2xl font-black text-amber-300 mt-1">
            {user?.role === 'admin' ? '∞' : user?.balanceClips ?? 0} Kredit
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
          <span className="text-xs font-medium text-zinc-400">Total Pengeluaran</span>
          <p className="text-2xl font-black text-cyan-400 mt-1">
            Rp {(clips.filter((c) => c.paymentId).length * 500).toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/80 p-3 rounded-2xl border border-white/10">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari judul klip atau streamer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-950 pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {[
            { id: 'all', name: 'Semua' },
            { id: 'completed', name: 'Selesai' },
            { id: 'paid', name: 'Sedang Render' },
            { id: 'preview', name: 'Preview' },
            { id: 'failed', name: 'Gagal' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                statusFilter === tab.id
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              {tab.name}
            </button>
          ))}
        </div>
      </div>

      {/* Clips List Cards */}
      <div className="space-y-4">
        {isLoadingClips ? (
          <div className="text-center py-16 bg-zinc-900/40 rounded-3xl border border-white/5 space-y-3">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-400 border-t-transparent mx-auto" />
            <p className="text-xs text-zinc-400">Memuat riwayat klip...</p>
          </div>
        ) : loadError ? (
          <div className="text-center py-16 bg-zinc-900/40 rounded-3xl border border-rose-500/30 space-y-3">
            <AlertCircle className="h-10 w-10 text-rose-500 mx-auto" />
            <h3 className="text-base font-bold text-white">Gagal memuat riwayat</h3>
            <p className="text-xs text-zinc-400">{loadError}</p>
            <button
              onClick={fetchClips}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 hover:bg-brand-500 px-5 py-2 text-xs font-bold text-white transition-all"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Coba Lagi
            </button>
          </div>
        ) : filteredClips.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/40 rounded-3xl border border-white/5 space-y-3">
            <Layers className="h-10 w-10 text-zinc-600 mx-auto" />
            <h3 className="text-base font-bold text-white">Tidak ada klip yang sesuai filter</h3>
            <p className="text-xs text-zinc-400">Coba ubah kata kunci pencarian atau status filter.</p>
          </div>
        ) : (
          filteredClips.map((clip) => {
            const isRetrying = retryingClipId === clip.id;

            return (
              <div
                key={clip.id}
                className="rounded-3xl border border-white/10 bg-zinc-900/70 p-5 transition-all hover:border-white/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-5"
              >
                {/* Left info & thumbnail */}
                <div className="flex items-start gap-4 min-w-0 flex-1">
                  <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-2xl bg-zinc-800 border border-white/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={clip.previewUrl || clip.sourceVideo.thumbnailUrl}
                      alt={clip.name}
                      className="h-full w-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 bg-black/80 px-1.5 py-0.5 rounded text-[9px] font-mono text-white">
                      {clip.duration}s
                    </div>
                  </div>

                  <div className="min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {getStatusBadge(clip.status)}
                      <span className="text-[11px] font-semibold text-brand-300">
                        {clip.sourceVideo.channelName}
                      </span>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {new Date(clip.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white truncate max-w-lg">{clip.name}</h3>

                    <p className="text-xs text-zinc-400 truncate">
                      Sumber: {clip.sourceVideo.title}
                    </p>

                    {clip.renderStep && (
                      <p className="text-[11px] text-zinc-400">
                        Status: <span className="text-cyan-300">{clip.renderStep}</span>
                      </p>
                    )}
                  </div>
                </div>

                {/* Right Action buttons */}
                <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                  {clip.status === 'completed' && (
                    <>
                      <button
                        onClick={() => setActivePreviewClip(clip)}
                        className="flex items-center gap-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 px-3.5 py-2 text-xs font-bold text-white border border-white/10 transition-all"
                      >
                        <Play className="h-3.5 w-3.5" />
                        <span>Preview</span>
                      </button>

                      {clip.outputUrl && (
                        <a
                          href={clip.outputUrl}
                          download
                          className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-brand-500/20 hover:brightness-110 transition-all"
                        >
                          <Download className="h-3.5 w-3.5" />
                          <span>Unduh MP4</span>
                        </a>
                      )}
                    </>
                  )}

                  {clip.status === 'failed' && (
                    <button
                      onClick={() => handleRetryJob(clip.id)}
                      disabled={isRetrying}
                      className="flex items-center gap-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 px-4 py-2 text-xs font-bold text-white transition-all shadow-md shadow-rose-600/30"
                    >
                      <RotateCw className={`h-3.5 w-3.5 ${isRetrying ? 'animate-spin' : ''}`} />
                      <span>{isRetrying ? 'Mencoba Ulang...' : 'Coba Ulang Job (Retry)'}</span>
                    </button>
                  )}

                  {clip.status === 'preview' && (
                    <Link
                      href={`/studio?url=${encodeURIComponent(clip.sourceVideo.sourceUrl)}`}
                      className="flex items-center gap-1.5 rounded-xl bg-brand-600 hover:bg-brand-500 px-4 py-2 text-xs font-bold text-white transition-all"
                    >
                      <Zap className="h-3.5 w-3.5" />
                      <span>Lanjutkan Edit</span>
                    </Link>
                  )}

                  {clip.paymentId && (
                    <button
                      onClick={() => setActiveInvoiceClip(clip)}
                      className="rounded-xl p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                      title="Lihat Invoice Pembayaran"
                    >
                      <FileText className="h-4 w-4" />
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteClip(clip.id)}
                    className="rounded-xl p-2 text-zinc-500 hover:text-rose-400 hover:bg-zinc-800 transition-all"
                    title="Hapus Klip"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Invoice Modal */}
      {activeInvoiceClip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-zinc-900 p-6 shadow-2xl space-y-6">
            <button
              onClick={() => setActiveInvoiceClip(null)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-brand-500/20 border border-brand-500/30 flex items-center justify-center p-1">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/klipchip-logo.svg" alt="KlipChip" className="h-full w-full" />
                </div>
                <span className="text-lg font-bold text-white">KlipChip Invoice</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                LUNAS
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>No. Referensi:</span>
                <span className="font-mono text-white">{activeInvoiceClip.paymentId}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Tanggal Transaksi:</span>
                <span className="text-white">
                  {new Date(activeInvoiceClip.createdAt).toLocaleString('id-ID')}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Item Layanan:</span>
                <span className="text-white font-semibold">1x Klip Vertikal 9:16 (1080p HD)</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Nama Proyek:</span>
                <span className="text-white truncate max-w-[200px] text-right">
                  {activeInvoiceClip.name}
                </span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Metode Bayar:</span>
                <span className="text-cyan-300">QRIS Dynamic (Instant Webhook)</span>
              </div>
            </div>

            <div className="pt-3 border-t border-white/10 flex justify-between items-baseline">
              <span className="text-sm font-bold text-white">Total Dibayar:</span>
              <span className="text-2xl font-black text-emerald-400">
                Rp {activeInvoiceClip.priceIdr.toLocaleString('id-ID')}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 py-2.5 text-xs font-bold text-white border border-white/10"
              >
                <Printer className="h-3.5 w-3.5" />
                <span>Cetak / Simpan PDF</span>
              </button>
              <button
                onClick={() => setActiveInvoiceClip(null)}
                className="flex-1 rounded-xl bg-brand-600 hover:bg-brand-500 py-2.5 text-xs font-bold text-white"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {activePreviewClip && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-sm rounded-3xl border border-white/15 bg-zinc-900 p-4 shadow-2xl space-y-4">
            <button
              onClick={() => setActivePreviewClip(null)}
              className="absolute top-4 right-4 z-20 text-zinc-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="relative aspect-[9/16] rounded-2xl overflow-hidden bg-black flex flex-col justify-between p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={activePreviewClip.previewUrl || activePreviewClip.sourceVideo.thumbnailUrl}
                alt={activePreviewClip.name}
                className="absolute inset-0 h-full w-full object-cover brightness-90"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/80 pointer-events-none" />

              <div className="relative z-10">
                <span className="flex items-center gap-1 text-[10px] font-bold bg-brand-600 text-white px-2 py-0.5 rounded-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/klipchip-logo.svg" alt="Logo" className="h-3 w-3" />
                  <span>9:16 Shorts</span>
                </span>
              </div>

              <div className="relative z-10 bg-black/80 p-3 rounded-xl text-center border border-white/15">
                <p className="text-xs font-bold text-cyan-300">
                  {activePreviewClip.captions[0]?.text || 'Klip siap dipublikasi!'}
                </p>
              </div>
            </div>

            <button
              onClick={() => setActivePreviewClip(null)}
              className="w-full py-2.5 rounded-xl bg-brand-600 text-xs font-bold text-white"
            >
              Tutup Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <AuthGate
      title="Masuk ke Riwayat Klip"
      description="Akun Anda diperlukan untuk melihat riwayat klip, invoice, dan mengunduh hasil render."
    >
      <DashboardContent />
    </AuthGate>
  );
}
