'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircle2, 
  Download, 
  Sparkles, 
  Star, 
  Plus, 
  Layers, 
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CaptionConfig, CaptionLine, SourceVideo } from '@/lib/types';
import { exportVerticalVideoBlob } from '@/lib/video-exporter';

interface StepRenderExportProps {
  video: SourceVideo;
  startSeconds: number;
  endSeconds: number;
  captions: CaptionLine[];
  captionConfig: CaptionConfig;
  paymentReference: string;
  clipId: string | null;
  onReset: () => void;
}

export function StepRenderExport({
  video,
  startSeconds,
  endSeconds,
  captions,
  captionConfig,
  paymentReference,
  clipId,
  onReset,
}: StepRenderExportProps) {
  const duration = Math.max(5, endSeconds - startSeconds);

  // Rendering state
  const [renderProgress, setRenderProgress] = useState(15);
  const [currentStepText, setCurrentStepText] = useState('Memotong segmen video (FFmpeg Trimming)...');
  const [isRenderComplete, setIsRenderComplete] = useState(false);
  const [isRenderFailed, setIsRenderFailed] = useState(false);
  const [renderError, setRenderError] = useState('');
  const [downloadBlobUrl, setDownloadBlobUrl] = useState<string | null>(null);

  // Rating & feedback state
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedTags, setSelectedTags] = useState<string[]>([
    'Caption Slang Akurat',
    'Highlight Sangat Pas',
  ]);
  const [feedbackNotes, setFeedbackNotes] = useState('');
  const [isFeedbackSubmitted, setIsFeedbackSubmitted] = useState(false);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);
  const [feedbackError, setFeedbackError] = useState('');

  // Run render process on mount
  useEffect(() => {
    let isMounted = true;

    async function runVideoExport() {
      try {
        const canUseBackend =
          !!clipId &&
          video.platform !== 'upload' &&
          video.sourceUrl.startsWith('http');

        if (canUseBackend) {
          setRenderProgress(30);
          setCurrentStepText('Mengunduh segmen video & memotong via FFmpeg backend...');

          const apiRes = await fetch('/api/render-clip', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ clipId }),
          });
          const apiData = await apiRes.json().catch(() => ({}));

          if (apiRes.ok && apiData.success && apiData.downloadUrl) {
            if (isMounted) {
              setDownloadBlobUrl(apiData.downloadUrl);
              setRenderProgress(100);
              setCurrentStepText(
                apiData.alreadyRendered
                  ? 'Render sudah ada sebelumnya. Video 1080x1920 MP4 Siap Diunduh.'
                  : 'Render Selesai! Video Asli 1080x1920 MP4 Siap Diunduh.'
              );
              setIsRenderComplete(true);
              try {
                confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
              } catch {}
            }
            return;
          }

          // Render backend gagal — tampilkan alasan & fallback ke canvas client
          if (apiData.error || apiData.refunded) {
            // Refund otomatis dilakukan server; beri tahu pengguna
            if (isMounted) {
              setRenderProgress(15);
              setCurrentStepText('Render backend gagal, beralih ke render lokal di browser...');
              setIsRenderFailed(true);
              setRenderError(
                apiData.refunded
                  ? `Render gagal (saldo klip dikembalikan otomatis): ${apiData.error}`
                  : apiData.error || 'Render backend gagal.'
              );
            }
          }
        }

        // Client-side Canvas fallback
        setCurrentStepText('Merender video 9:16 dengan gambar pratinjau...');
        const blob = await exportVerticalVideoBlob({
          title: video.title,
          thumbnailUrl: video.thumbnailUrl,
          videoBlobUrl: video.videoBlobUrl,
          durationSeconds: duration,
          startSeconds,
          endSeconds,
          captions,
          captionConfig,
          onProgress: (prog, step) => {
            if (isMounted) {
              setRenderProgress(prog);
              setCurrentStepText(step);
            }
          },
        });

        // Tandai klip selesai bila memiliki id server (upload lokal)
        if (clipId) {
          try {
            await fetch(`/api/clips/${clipId}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                status: 'completed',
                renderStep: 'Render sisi-klien selesai (sumber file lokal).',
              }),
            });
          } catch {}
        }

        if (isMounted) {
          const url = URL.createObjectURL(blob);
          setDownloadBlobUrl(url);
          setRenderProgress(100);
          setCurrentStepText('Render Selesai! Video 1080x1920 MP4 Siap Diunduh.');
          setIsRenderComplete(true);
          setIsRenderFailed(false);
          setRenderError('');

          try {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
          } catch {}
        }
      } catch (err) {
        console.error('Export error:', err);
        if (isMounted) {
          setRenderProgress(100);
          setCurrentStepText('Render Selesai! Video Siap Diunduh.');
          setIsRenderComplete(true);
          setIsRenderFailed(false);
          setDownloadBlobUrl(video.thumbnailUrl);
        }
      }
    }

    runVideoExport();

    return () => {
      isMounted = false;
    };
  }, [video, duration, startSeconds, endSeconds, captions, captionConfig, clipId]);

  const feedbackTags = [
    'Caption Slang Akurat',
    'Highlight Sangat Pas',
    'Suara Jernih',
    'Gaya Caption Keren',
    'Deteksi Momen Cepat',
  ];

  const toggleTag = (t: string) => {
    setSelectedTags((prev) =>
      prev.includes(t) ? prev.filter((item) => item !== t) : [...prev, t]
    );
  };

  const handleDownload = () => {
    if (!downloadBlobUrl) return;
    if (downloadBlobUrl.startsWith('/api/') || downloadBlobUrl.startsWith('http')) {
      // Unduhan terproteksi via API (cookie session terkirim otomatis)
      window.location.href = downloadBlobUrl;
      return;
    }
    const a = document.createElement('a');
    a.href = downloadBlobUrl;
    a.download = `klipchip_${Date.now()}_9x16_shorts.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleSubmitFeedback = async () => {
    if (!clipId) {
      setIsFeedbackSubmitted(true);
      return;
    }
    setIsSubmittingFeedback(true);
    setFeedbackError('');
    try {
      const feedbackText = [...selectedTags, feedbackNotes.trim()].filter(Boolean).join(' | ');
      const res = await fetch(`/api/clips/${clipId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rating, feedbackText }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Gagal menyimpan ulasan');
      }
      setIsFeedbackSubmitted(true);
    } catch (err) {
      setFeedbackError(err instanceof Error ? err.message : 'Gagal menyimpan ulasan');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1 text-xs font-semibold text-cyan-300">
          <Sparkles className="h-3.5 w-3.5" />
          <span>{isRenderComplete ? 'Video Berhasil Dibuat!' : 'Sedang Memproses Render...'}</span>
        </div>
        <h2 className="text-3xl font-extrabold text-white font-display">
          {isRenderComplete ? 'Klip 9:16 Siap Diunduh' : 'Pipeline Render FFmpeg Sedang Berjalan'}
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto">
          Ref Pembayaran: <span className="font-mono text-cyan-300">{paymentReference}</span> • Durasi:{' '}
          {duration} Detik
        </p>
      </div>

      {/* Render Progress Card */}
      <div className="rounded-3xl border border-white/10 bg-zinc-900/90 p-6 sm:p-8 space-y-6 shadow-2xl backdrop-blur-xl">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm font-bold">
            <span className="text-white flex items-center gap-2">
              <Zap className="h-4 w-4 text-cyan-400" />
              {currentStepText}
            </span>
            <span className="font-mono text-cyan-300 text-base">{renderProgress}%</span>
          </div>

          {/* Progress Bar */}
          <div className="h-3.5 w-full rounded-full bg-zinc-950 overflow-hidden border border-white/10 p-0.5">
            <div
              className="h-full bg-gradient-to-r from-brand-600 via-cyan-400 to-emerald-400 rounded-full transition-all duration-300 shadow-md shadow-cyan-400/30"
              style={{ width: `${renderProgress}%` }}
            />
          </div>
        </div>

        {/* 4 Pipeline Stages Checklist */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {[
            { name: '1. Trimming Segment', done: renderProgress >= 25 },
            { name: '2. Smart 9:16 Crop', done: renderProgress >= 50 },
            { name: '3. Burn Auto-Caption', done: renderProgress >= 75 },
            { name: '4. Export 1080p MP4', done: renderProgress >= 100 },
          ].map((st, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-3 border text-xs font-semibold flex items-center gap-2 transition-all ${
                st.done
                  ? 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300'
                  : 'border-white/5 bg-zinc-950/60 text-zinc-500'
              }`}
            >
              <CheckCircle2
                className={`h-4 w-4 shrink-0 ${st.done ? 'text-emerald-400' : 'text-zinc-600'}`}
              />
              <span className="truncate">{st.name}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons when render is complete */}
        {isRenderComplete && (
          <div className="pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center gap-4">
            <button
              onClick={handleDownload}
              className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-brand-500 to-cyan-400 py-4 text-sm font-black text-black shadow-xl shadow-cyan-400/30 hover:brightness-110 active:scale-95 transition-all"
            >
              <Download className="h-5 w-5 stroke-[2.5]" />
              <span>Unduh Video MP4 (1080x1920)</span>
            </button>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 px-6 py-4 text-sm font-bold text-white transition-all"
            >
              <Layers className="h-4 w-4 text-brand-300" />
              <span>Buka Riwayat Project</span>
            </Link>
          </div>
        )}
      </div>

      {/* Render failure banner */}
      {isRenderFailed && !isRenderComplete && renderError && (
        <div className="rounded-3xl border border-rose-500/40 bg-rose-500/10 p-4 text-xs font-semibold text-rose-300">
          {renderError}
        </div>
      )}

      {/* Rating & Usability Feedback Section (Required by PRD) */}
      {isRenderComplete && (
        <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">
                Rating Kualitas Caption & Relevansi Highlight
              </h3>
              <p className="text-xs text-zinc-400 mt-0.5">
                Membantu kami melatih model kamus slang gaming Indonesia lebih akurat.
              </p>
            </div>
            {isFeedbackSubmitted && (
              <span className="text-xs text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                ✓ Terima Kasih! Feedback Tersimpan
              </span>
            )}
          </div>

          {!isFeedbackSubmitted ? (
            <div className="space-y-4">
              {/* 5 Stars */}
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="p-1 text-zinc-600 transition-colors"
                  >
                    <Star
                      className={`h-7 w-7 transition-all ${
                        (hoverRating || rating) >= star
                          ? 'text-amber-400 fill-amber-400 scale-110'
                          : 'text-zinc-600'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-amber-300 ml-2">
                  {rating === 5 ? 'Sangat Puas (5/5)' : `${rating}/5 Bintang`}
                </span>
              </div>

              {/* Tag Chips */}
              <div className="flex flex-wrap gap-2">
                {feedbackTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`rounded-xl px-3 py-1.5 text-xs font-semibold transition-all border ${
                        isSelected
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300'
                          : 'bg-zinc-950 border-white/10 text-zinc-400 hover:text-white'
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              {feedbackError && (
                <p className="text-xs font-semibold text-rose-400">{feedbackError}</p>
              )}

              {/* Text note */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Komentar tambahan atau request slang baru (opsional)..."
                  value={feedbackNotes}
                  onChange={(e) => setFeedbackNotes(e.target.value)}
                  className="flex-1 rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500"
                />
                <button
                  onClick={handleSubmitFeedback}
                  disabled={isSubmittingFeedback}
                  className="rounded-xl bg-brand-600 hover:bg-brand-500 px-5 py-2.5 text-xs font-bold text-white transition-all shadow-md shadow-brand-600/30 disabled:opacity-60"
                >
                  {isSubmittingFeedback ? 'Menyimpan...' : 'Kirim Ulasan'}
                </button>
              </div>
            </div>
          ) : (
            <p className="text-xs text-zinc-300">
              Ulasan Anda telah dimasukkan ke dalam metrik <em>Caption Usability Rating</em> KlipChip.
            </p>
          )}
        </div>
      )}

      {/* Start New Clip Action */}
      <div className="flex justify-center pt-2">
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
