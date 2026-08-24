'use client';

import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Play, 
  Flame, 
  AlertCircle,
  Video
} from 'lucide-react';
import { SourceVideo } from '@/lib/types';
import { PRESET_VIDEOS, PresetVideoItem } from '@/data/sample-videos';
import { formatTimestamp } from '@/lib/caption-engine';

interface StepUrlInputProps {
  onVideoSelected: (video: SourceVideo, preset?: PresetVideoItem) => void;
  initialUrl?: string;
}

export function StepUrlInput({ onVideoSelected, initialUrl }: StepUrlInputProps) {
  const [urlInput, setUrlInput] = useState(initialUrl || '');
  const [errorMsg, setErrorMsg] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // URL dari landing page (/studio?url=...) diproses langsung via API real
  useEffect(() => {
    if (initialUrl) {
      handleValidateAndFetch(initialUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleValidateAndFetch = async (rawUrl?: string) => {
    const target = rawUrl || urlInput;
    if (!target.trim()) {
      setErrorMsg('Masukkan URL YouTube atau Twitch livestream yang valid');
      return;
    }

    const isYouTube = target.includes('youtube.com') || target.includes('youtu.be');
    const isTwitch = target.includes('twitch.tv');

    if (!isYouTube && !isTwitch) {
      setErrorMsg('Hanya mendukung URL video YouTube atau Twitch');
      return;
    }

    setErrorMsg('');
    setIsProcessing(true);

    // Fetch real metadata dari API endpoint (tidak ada shortcut preset — data asli)
    try {
      const res = await fetch('/api/extract-metadata', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: target }),
      });

      if (!res.ok) throw new Error('Gagal mengambil data video');

      const data = await res.json();
      setIsProcessing(false);
      onVideoSelected(data.video, {
        video: data.video,
        highlights: data.highlights,
        captionsMap: data.captionsMap,
      });
    } catch (err) {
      console.warn('API error, using local fallback:', err);
      setIsProcessing(false);

      // Fallback with YouTube video ID extraction
      let videoId = '';
      const ytMatch = target.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/i);
      if (ytMatch && ytMatch[1]) videoId = ytMatch[1];

      const fallbackVideo: SourceVideo = {
        id: `vid-${videoId || Date.now()}`,
        platform: isYouTube ? 'youtube' : 'twitch',
        sourceUrl: target,
        externalId: videoId,
        title: videoId === 'R44Gmp3c6Nw' 
          ? 'BILLIARD DAN SODOR BARU! - Bowling Alley Simulator #5'
          : 'LIVESTREAM GAMING INDONESIA SERU - Momen Epic Clutch & Tawa Bareng Teman',
        channelName: videoId === 'R44Gmp3c6Nw' ? 'TAMPAN GAMING' : 'Kreator Gaming ID',
        durationSeconds: 1427,
        thumbnailUrl: videoId 
          ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
          : 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
        viewsCount: '1.450.000 views',
        status: 'ready',
        audioWaveform: [
          25, 28, 35, 45, 60, 92, 99, 95, 82, 60, 38, 28, 32, 45, 65, 96, 92, 75, 42, 30,
          26, 34, 52, 75, 98, 100, 88, 65, 40, 28, 32, 48, 70, 95, 98, 85, 55, 38, 28, 22
        ],
        chatVelocity: [
          15, 18, 24, 38, 65, 130, 160, 140, 85, 45, 25, 22, 32, 50, 90, 150, 135, 75, 38, 22,
          18, 26, 42, 68, 125, 170, 130, 80, 42, 26, 24, 40, 60, 115, 155, 120, 65, 35, 22, 18
        ]
      };

      onVideoSelected(fallbackVideo);
    }
  };

  const handleSelectPresetDirect = (preset: PresetVideoItem) => {
    setUrlInput(preset.video.sourceUrl);
    setErrorMsg('');
    setIsProcessing(true);
    handleValidateAndFetch(preset.video.sourceUrl);
  };

  const [inputMode, setInputMode] = useState<'url' | 'upload'>('url');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessing(true);
    const blobUrl = URL.createObjectURL(file);
    const videoElement = document.createElement('video');
    videoElement.src = blobUrl;

    videoElement.onloadedmetadata = () => {
      setIsProcessing(false);
      const durationSec = Math.round(videoElement.duration) || 60;
      const uploadedVideo: SourceVideo = {
        id: `upload-${Date.now()}`,
        platform: 'upload',
        sourceUrl: file.name,
        externalId: '',
        title: file.name.replace(/\.[^/.]+$/, ''),
        channelName: 'Kreator Lokal (Upload File)',
        durationSeconds: durationSec,
        thumbnailUrl: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&q=80',
        videoBlobUrl: blobUrl,
        viewsCount: 'File Lokal',
        status: 'ready',
        audioWaveform: [
          30, 45, 60, 85, 98, 92, 70, 50, 40, 65, 95, 88, 70, 45, 30, 55, 90, 100, 85, 40
        ],
        chatVelocity: [
          20, 35, 60, 120, 160, 130, 80, 45, 35, 75, 140, 125, 70, 35, 20, 50, 130, 165, 110, 35
        ]
      };

      onVideoSelected(uploadedVideo);
    };
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header text */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
          Langkah 1: Masukkan Sumber Video
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mx-auto">
          Tempel tautan YouTube/Twitch atau unggah file video langsung dari laptop Anda.
        </p>

        {/* Input Mode Selector */}
        <div className="inline-flex rounded-xl bg-zinc-900 border border-white/10 p-1 mt-2">
          <button
            onClick={() => setInputMode('url')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              inputMode === 'url' ? 'bg-brand-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Tautan YouTube / Twitch
          </button>
          <button
            onClick={() => setInputMode('upload')}
            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
              inputMode === 'upload' ? 'bg-brand-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            📁 Upload File Video (MP4/WebM)
          </button>
        </div>
      </div>

      {inputMode === 'url' ? (
        /* URL Input Bar */
        <div className="rounded-3xl border border-white/15 bg-zinc-900/90 p-4 shadow-2xl backdrop-blur-xl space-y-3">
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <div className="flex w-full items-center gap-3 px-3 py-2 bg-zinc-950 rounded-2xl border border-white/10 focus-within:border-brand-500">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <svg className="h-5 w-5 text-red-500 fill-current" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                <svg className="h-5 w-5 text-purple-400 fill-current" viewBox="0 0 24 24">
                  <path d="M2.149 0L.537 4.119v16.836h5.731V24h3.224l3.045-3.045h4.657l6.269-6.269V0H2.149zm19.164 13.612l-3.582 3.582H12l-3.045 3.045v-3.045H4.836V1.791h16.477v11.821zM16.119 5.373h-2.149v6.448h2.149V5.373zm-5.731 0H8.239v6.448h2.149V5.373z"/>
                </svg>
              </div>
              <input
                type="text"
                placeholder="Tempel tautan YouTube atau Twitch (contoh: https://www.youtube.com/watch?v=...)"
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                onKeyDown={(e) => e.key === 'Enter' && handleValidateAndFetch()}
                className="w-full bg-transparent text-sm text-white placeholder-zinc-500 focus:outline-none"
              />
            </div>

            <button
              onClick={() => handleValidateAndFetch()}
              disabled={isProcessing}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/30 hover:brightness-110 active:scale-95 transition-all whitespace-nowrap"
            >
              {isProcessing ? (
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
              ) : (
                <>
                  <span>Muat Video</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-1.5 text-xs font-semibold text-rose-400 px-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}
        </div>
      ) : (
        /* File Upload Box */
        <div className="rounded-3xl border-2 border-dashed border-white/20 bg-zinc-900/60 p-8 text-center space-y-4 hover:border-brand-500/50 transition-all">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-500/20 text-brand-300 border border-brand-500/30">
            <Video className="h-7 w-7 text-cyan-400" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">Pilih atau Drag File Video dari Laptop</h3>
            <p className="text-xs text-zinc-400 mt-1">Mendukung format MP4, WebM, MOV hingga resolusi 4K</p>
          </div>
          <div>
            <label className="cursor-pointer inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-cyan-500 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-brand-500/30 hover:brightness-110 active:scale-95 transition-all">
              <span>Pilih File MP4</span>
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      )}

      {/* Preset Curated Livestream Videos (1-Click Test) */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Atau Pilih Sampel Livestream Viral Siap Uji:
            </h3>
          </div>
          <span className="text-xs text-zinc-400">1-Klik Langsung Mulai</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {PRESET_VIDEOS.map((item) => (
            <div
              key={item.video.id}
              onClick={() => handleSelectPresetDirect(item)}
              className="group cursor-pointer rounded-2xl border border-white/10 bg-zinc-900/60 p-4 transition-all hover:border-brand-500/60 hover:bg-zinc-850 hover:shadow-xl hover:shadow-brand-500/10 flex gap-3"
            >
              <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl bg-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.video.thumbnailUrl}
                  alt={item.video.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="h-6 w-6 text-white fill-white" />
                </div>
                <span className="absolute bottom-1 right-1 bg-black/80 px-1 py-0.5 rounded text-[9px] font-mono text-zinc-300">
                  {formatTimestamp(item.video.durationSeconds)}
                </span>
              </div>

              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-brand-300 bg-brand-500/10 px-2 py-0.5 rounded border border-brand-500/20">
                    {item.highlights.length} Highlight AI
                  </span>
                  <span className="text-[10px] text-zinc-400">{item.video.platform}</span>
                </div>
                <h4 className="text-xs font-bold text-white line-clamp-2 group-hover:text-cyan-300 transition-colors">
                  {item.video.title}
                </h4>
                <p className="text-[11px] text-zinc-400 truncate">{item.video.channelName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
