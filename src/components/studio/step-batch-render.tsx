'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Download, Sparkles, Layers, Plus, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { SourceVideo } from '@/lib/types';

export interface BatchClipItem {
  clipId: string;
  name: string;
  startSeconds: number;
  endSeconds: number;
}

interface StepBatchRenderProps {
  video: SourceVideo;
  batchClips: BatchClipItem[];
  paymentReference: string;
  onReset: () => void;
}

interface ClipStatus {
  progress: number;
  step: string;
  status: string;
  downloadUrl: string | null;
}

export function StepBatchRender({ video, batchClips, paymentReference, onReset }: StepBatchRenderProps) {
  const [statuses, setStatuses] = useState<Record<string, ClipStatus>>({});
  const [allDone, setAllDone] = useState(false);

  useEffect(() => {
    let mounted = true;
    const init: Record<string, ClipStatus> = {};
    for (const c of batchClips) {
      init[c.clipId] = { progress: 10, step: 'Mengantre di render worker...', status: 'processing', downloadUrl: null };
    }
    setStatuses(init);

    const snapshot = batchClips;

    async function poll() {
      const deadline = Date.now() + 20 * 60 * 1000;
      while (mounted && Date.now() < deadline) {
        const entries = await Promise.all(
          snapshot.map(async (c) => {
            try {
              const r = await fetch(`/api/clips/${c.clipId}/status`, { cache: 'no-store' });
              if (!r.ok) return [c.clipId, init[c.clipId]] as const;
              const s = await r.json();
              return [
                c.clipId,
                {
                  progress: typeof s.renderProgress === 'number' ? s.renderProgress : 10,
                  step: s.renderStep || 'Memproses...',
                  status: s.status || 'processing',
                  downloadUrl: s.downloadUrl || null,
                },
              ] as const;
            } catch {
              return [c.clipId, init[c.clipId]] as const;
            }
          })
        );
        const next: Record<string, ClipStatus> = {};
        for (const [id, st] of entries) next[id] = st as ClipStatus;
        if (!mounted) return;
        setStatuses(next);
        const done = snapshot.every((c) => next[c.clipId]?.status === 'completed');
        if (done) {
          setAllDone(true);
          break;
        }
        await new Promise((r) => setTimeout(r, 3000));
      }
    }
    poll();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (allDone) {
      try {
        confetti({ particleCount: 120, spread: 80, origin: { y: 0.5 } });
      } catch {}
    }
  }, [allDone]);

  const handleDownload = (url: string) => {
    if (url.startsWith('/api/') || url.startsWith('http')) {
      window.location.href = url;
      return;
    }
    const a = document.createElement('a');
    a.href = url;
    a.download = `klipchip_${Date.now()}_9x16_shorts.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{allDone ? 'Semua Video Berhasil Dibuat!' : 'Sedang Merender Beberapa Klip...'}</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white font-display">
          {allDone ? `${batchClips.length} Klip 9:16 Siap Diunduh` : 'Pipeline Render Batch Sedang Berjalan'}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          Ref Pembayaran: <span className="font-mono text-cyan-300">{paymentReference}</span> • Dari 1 URL:{' '}
          <span className="text-white">{video.title.slice(0, 40)}</span>
        </p>
      </div>

      {/* List of batch clips */}
      <div className="space-y-4">
        {batchClips.map((c, idx) => {
          const st = statuses[c.clipId] || { progress: 0, step: 'Menunggu...', status: 'processing', downloadUrl: null };
          const done = st.status === 'completed';
          const failed = st.status === 'failed';
          return (
            <div
              key={c.clipId}
              className="rounded-3xl border border-white/10 bg-zinc-900/90 p-5 sm:p-6 space-y-4 shadow-xl"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-brand-500/20 text-brand-300 font-extrabold text-sm">
                    #{idx + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{c.name}</p>
                    <p className="text-[11px] text-zinc-400 font-mono">
                      {Math.round(c.startSeconds)}s – {Math.round(c.endSeconds)}s ({Math.round(c.endSeconds - c.startSeconds)}s)
                    </p>
                  </div>
                </div>
                {done && (
                  <span className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 text-xs font-bold text-emerald-400 shrink-0">
                    ✓ Selesai
                  </span>
                )}
                {failed && (
                  <span className="rounded-lg bg-rose-500/15 border border-rose-500/30 px-2.5 py-1 text-xs font-bold text-rose-400 shrink-0">
                    Gagal
                  </span>
                )}
              </div>

              {/* Progress bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-zinc-300 flex items-center gap-2">
                    <Zap className="h-3.5 w-3.5 text-cyan-400" />
                    {st.step}
                  </span>
                  <span className="font-mono text-cyan-300">{st.progress}%</span>
                </div>
                <div className="h-2.5 w-full rounded-full bg-zinc-950 overflow-hidden border border-white/10 p-0.5">
                  <div
                    className="h-full bg-gradient-to-r from-brand-600 via-cyan-400 to-emerald-400 rounded-full transition-all duration-300"
                    style={{ width: `${st.progress}%` }}
                  />
                </div>
              </div>

              {done && st.downloadUrl && (
                <button
                  onClick={() => handleDownload(st.downloadUrl as string)}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-brand-500 to-cyan-400 py-3 text-sm font-black text-black shadow-xl shadow-cyan-400/30 hover:brightness-110 active:scale-95 transition-all"
                >
                  <Download className="h-4 w-4 stroke-[2.5]" />
                  <span>Unduh Video #{idx + 1}</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer actions */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
        {allDone && (
          <Link
            href="/dashboard"
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 px-6 py-4 text-sm font-bold text-white transition-all"
          >
            <Layers className="h-4 w-4 text-brand-300" />
            <span>Buka Riwayat Project</span>
          </Link>
        )}
        <button
          onClick={onReset}
          className="flex items-center gap-2 rounded-2xl bg-zinc-900 border border-white/10 hover:bg-zinc-800 px-6 py-3 text-xs font-bold text-zinc-300 hover:text-white transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Buat Klip Baru dari Video Lain</span>
        </button>
      </div>
    </div>
  );
}
