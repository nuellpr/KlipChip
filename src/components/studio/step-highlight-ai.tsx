'use client';

import React, { useState } from 'react';
import { 
  Volume2, 
  MessageSquare, 
  Sparkles, 
  Sliders, 
  ArrowRight, 
  ArrowLeft,
  Timer,
  Languages
} from 'lucide-react';
import { SourceVideo, HighlightCandidate, DurationPreset, LanguageCode } from '@/lib/types';
import { PresetVideoItem } from '@/data/sample-videos';
import { formatTimestamp } from '@/lib/caption-engine';

const DURATION_PRESETS: { id: DurationPreset; label: string; min: number; max: number; desc: string }[] = [
  { id: 'short', label: 'Singkat', min: 15, max: 30, desc: '15–30 detik' },
  { id: 'medium', label: 'Sedang', min: 30, max: 60, desc: '30–60 detik' },
  { id: 'long', label: 'Panjang', min: 60, max: 120, desc: '60–120 detik' },
  { id: 'auto', label: 'Otomatis', min: 5, max: 120, desc: 'Ikuti momen' },
];

const LANGUAGES: { id: LanguageCode; label: string }[] = [
  { id: 'auto', label: 'Otomatis' },
  { id: 'id', label: 'Indonesia' },
  { id: 'en', label: 'Inggris' },
  { id: 'ms', label: 'Melayu' },
  { id: 'jv', label: 'Jawa' },
  { id: 'ko', label: 'Korea' },
  { id: 'ja', label: 'Jepang' },
  { id: 'es', label: 'Spanyol' },
];

interface StepHighlightAiProps {
  video: SourceVideo;
  preset?: PresetVideoItem;
  durationPreset: DurationPreset;
  language: LanguageCode;
  onDurationPresetChange: (p: DurationPreset) => void;
  onLanguageChange: (l: LanguageCode) => void;
  onHighlightSelected: (startSec: number, endSec: number, highlight?: HighlightCandidate) => void;
  onBack: () => void;
}

export function StepHighlightAi({
  video,
  preset,
  durationPreset,
  language,
  onDurationPresetChange,
  onLanguageChange,
  onHighlightSelected,
  onBack,
}: StepHighlightAiProps) {
  // Candidate highlights from preset/generated. Jika kosong,
  // pengguna memakai mode Timestamp Manual (tidak ada data yang dimanipulasi).
  const candidates: HighlightCandidate[] = preset?.highlights || [];

  const [mode, setMode] = useState<'ai' | 'manual'>(candidates.length > 0 ? 'ai' : 'manual');
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>(candidates[0]?.id || '');
  
  // Manual timestamp states
  const [manualStart, setManualStart] = useState<number>(candidates[0]?.startSeconds || 120);
  const [manualDuration, setManualDuration] = useState<number>(35);

  const presetInfo = DURATION_PRESETS.find((p) => p.id === durationPreset) || DURATION_PRESETS[3];
  const presetMin = presetInfo.min;
  const presetMax = presetInfo.max;

  const selectedCandidate = candidates.find((c) => c.id === selectedCandidateId) || candidates[0];

  const handleProceed = () => {
    if (mode === 'ai' && selectedCandidate) {
      let start = selectedCandidate.startSeconds;
      let end = selectedCandidate.endSeconds;
      const candDur = end - start;
      if (durationPreset !== 'auto') {
        if (candDur > presetMax) {
          end = Math.min(start + presetMax, video.durationSeconds);
        } else if (candDur < presetMin) {
          start = Math.max(0, Math.min(start - (presetMin - candDur), video.durationSeconds - presetMin));
          end = start + presetMin;
        }
      }
      onHighlightSelected(
        Math.max(0, start),
        Math.min(video.durationSeconds, end),
        selectedCandidate
      );
    } else {
      const dur = Math.min(Math.max(manualDuration, presetMin), Math.min(presetMax, 120));
      const endSec = Math.min(video.durationSeconds, manualStart + dur);
      onHighlightSelected(manualStart, endSec);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Step Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-brand-500/20 text-brand-300 border border-brand-500/30 px-2 py-0.5 text-xs font-bold">
              Langkah 2 dari 5
            </span>
            <span className="text-xs text-zinc-400">• Deteksi Momen Terbaik</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display mt-1">
            Pilih Momen Highlight
          </h2>
        </div>

        {/* Mode Switcher */}
        <div className="flex rounded-xl bg-zinc-900 border border-white/10 p-1">
          <button
            onClick={() => setMode('ai')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              mode === 'ai'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sparkles className="h-3.5 w-3.5" />
            <span>Rekomendasi AI</span>
          </button>
          <button
            onClick={() => setMode('manual')}
            className={`flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
              mode === 'manual'
                ? 'bg-brand-600 text-white shadow-md'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            <Sliders className="h-3.5 w-3.5" />
            <span>Timestamp Manual</span>
          </button>
        </div>
      </div>

      {/* Durasi Preset & Bahasa */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Durasi preset */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-5 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <Timer className="h-4 w-4 text-cyan-400" />
            <span>Durasi Klip</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {DURATION_PRESETS.map((p) => (
              <button
                key={p.id}
                onClick={() => onDurationPresetChange(p.id)}
                className={`rounded-xl px-3 py-2 text-left transition-all border ${
                  durationPreset === p.id
                    ? 'border-cyan-400 bg-brand-950/40 ring-1 ring-cyan-400'
                    : 'border-white/10 bg-zinc-950/60 hover:bg-zinc-800'
                }`}
              >
                <p className={`text-xs font-bold ${durationPreset === p.id ? 'text-cyan-300' : 'text-white'}`}>
                  {p.label}
                </p>
                <p className="text-[10px] text-zinc-400">{p.desc}</p>
              </button>
            ))}
          </div>
          <p className="text-[10px] text-zinc-500">
            Maksimal 120 detik per klip. Mode Otomatis mengikuti durasi asli momen terpilih.
          </p>
        </div>

        {/* Bahasa */}
        <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-5 space-y-3 shadow-xl">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <Languages className="h-4 w-4 text-brand-400" />
            <span>Bahasa Subtitle</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.id}
                onClick={() => onLanguageChange(l.id)}
                className={`rounded-xl px-3 py-2 text-xs font-bold transition-all border ${
                  language === l.id
                    ? 'border-brand-400 bg-brand-500/10 text-brand-300 ring-1 ring-brand-400'
                    : 'border-white/10 bg-zinc-950/60 text-zinc-400 hover:text-white'
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
          <p className="text-[10px] text-zinc-500">
            Bahasa dipakai Whisper untuk transkripsi & caption YouTube. Otomatis = deteksi sendiri.
          </p>
        </div>
      </div>

      {/* Audio Waveform & Chat Timeline Analysis Component */}
      <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6 shadow-xl space-y-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-brand-500/20 border border-brand-500/30 flex items-center justify-center text-brand-400">
              <Volume2 className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">Grafik Gelombang Suara & Aktivitas Chat</h3>
              <p className="text-xs text-zinc-400">
                Puncak warna cyan menunjukkan audio spike (teriakan/klimaks) dan amber menunjukkan lonjakan chat.
              </p>
            </div>
          </div>
          <span className="text-xs font-mono bg-zinc-950 px-2.5 py-1 rounded-lg border border-white/10 text-zinc-300">
            Total: {formatTimestamp(video.durationSeconds)}
          </span>
        </div>

        {/* Audio Waveform Bars */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
            <span className="text-brand-300 flex items-center gap-1">
              <Volume2 className="h-3.5 w-3.5" /> Audio Spike Loudness
            </span>
            <span className="text-emerald-400">Max Relevansi: 99%</span>
          </div>

          <div className="relative h-16 rounded-2xl bg-zinc-950 p-2 flex items-end gap-1 overflow-hidden border border-white/10">
            {video.audioWaveform?.map((val, idx) => {
              const isSpike = val > 80;
              return (
                <div
                  key={idx}
                  className={`flex-1 rounded-t-sm transition-all duration-300 ${
                    isSpike
                      ? 'bg-gradient-to-t from-brand-500 via-cyan-400 to-emerald-300 shadow-sm shadow-cyan-400/50'
                      : 'bg-zinc-800 hover:bg-zinc-700'
                  }`}
                  style={{ height: `${val}%` }}
                />
              );
            })}
          </div>
        </div>

        {/* Chat Velocity Bars */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[11px] text-zinc-400 font-medium">
            <span className="text-amber-400 flex items-center gap-1">
              <MessageSquare className="h-3.5 w-3.5" /> Kecepatan Pesan Chat (msg/s)
            </span>
            <span className="text-amber-300 font-mono">Lonjakan Tertinggi: 160 msg/s</span>
          </div>

          <div className="relative h-10 rounded-2xl bg-zinc-950 p-1.5 flex items-end gap-1 overflow-hidden border border-white/10">
            {video.chatVelocity?.map((val, idx) => (
              <div
                key={idx}
                className="flex-1 rounded-t-sm bg-gradient-to-t from-amber-600 to-amber-400"
                style={{ height: `${(val / 160) * 100}%` }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mode 1: AI Recommended Candidates List */}
      {mode === 'ai' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-cyan-400" />
              <span>Kandidat Momen AI Berperingkat ({candidates.length} Momen)</span>
            </h3>
            <span className="text-xs text-zinc-400">Pilih salah satu untuk diedit</span>
          </div>

          <div className="space-y-3">
            {candidates.length === 0 && (
              <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-4 text-xs text-amber-200">
                Tidak ada kandidat momen dari AI untuk video ini (transcript/audio tidak cukup).
                Alihkan ke mode <b>Timestamp Manual</b> untuk memilih rentang momen sendiri.
              </div>
            )}
            {candidates.map((cand, idx) => {
              const isSelected = cand.id === selectedCandidateId;
              return (
                <div
                  key={cand.id}
                  onClick={() => setSelectedCandidateId(cand.id)}
                  className={`cursor-pointer rounded-2xl p-4 transition-all border ${
                    isSelected
                      ? 'border-cyan-400 bg-brand-950/40 ring-2 ring-cyan-400/30 shadow-xl shadow-brand-500/10'
                      : 'border-white/10 bg-zinc-900/60 hover:bg-zinc-850'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2.5">
                      <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-500/20 text-brand-300 font-extrabold text-xs">
                        #{idx + 1}
                      </span>
                      <h4 className="text-sm font-bold text-white">{cand.title}</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-xs font-bold text-emerald-400">
                        Skor AI: {cand.totalScore}/100
                      </span>
                      <span className="rounded-lg bg-zinc-950 px-2 py-0.5 text-xs font-mono text-cyan-300 border border-white/10">
                        {formatTimestamp(cand.startSeconds)} - {formatTimestamp(cand.endSeconds)} ({cand.duration}s)
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-400 mb-3">{cand.description}</p>

                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-white/5 text-[11px]">
                    <div className="flex flex-wrap gap-1.5">
                      {cand.tags.map((t, tIdx) => (
                        <span
                          key={tIdx}
                          className="rounded-md bg-white/5 border border-white/10 px-2 py-0.5 text-zinc-300 font-medium"
                        >
                          {t}
                        </span>
                      ))}
                    </div>
                    <span className="text-amber-400 font-medium">💬 {cand.chatSpikeReason}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Mode 2: Manual Timestamp Adjuster */}
      {mode === 'manual' && (
        <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6 space-y-6">
          <div className="flex items-center gap-2 text-cyan-300 text-xs font-bold uppercase tracking-wider">
            <Sliders className="h-4 w-4" />
            <span>Pengaturan Rentang Timestamp Manual ({presetMin} - {presetMax} Detik, Preset: {presetInfo.label})</span>
          </div>

          {/* Start Time Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-300">
              <span>Mulai Detik Ke:</span>
              <span className="font-mono font-bold text-white text-sm">
                {formatTimestamp(manualStart)} ({manualStart} detik)
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={Math.max(10, video.durationSeconds - presetMax)}
              value={manualStart}
              onChange={(e) => setManualStart(Number(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
          </div>

          {/* Duration Slider */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-zinc-300">
              <span>Durasi Potongan Klip ({presetInfo.label}):</span>
              <span className="font-mono font-bold text-cyan-300 text-sm">
                {manualDuration} Detik
              </span>
            </div>
            <input
              type="range"
              min={presetMin}
              max={presetMax}
              value={manualDuration}
              onChange={(e) => setManualDuration(Number(e.target.value))}
              className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-cyan-400"
            />
            <div className="flex justify-between text-[10px] text-zinc-500">
              <span>{presetMin} Detik (Min)</span>
              <span>{presetMax} Detik (Maks)</span>
            </div>
          </div>

          {/* Preview Box */}
          <div className="rounded-2xl bg-zinc-950 p-4 border border-white/10 flex items-center justify-between text-xs">
            <div>
              <p className="text-zinc-400">Rentang Waktu Terpilih:</p>
              <p className="font-mono font-bold text-white text-sm mt-0.5">
                {formatTimestamp(manualStart)} ➔ {formatTimestamp(manualStart + manualDuration)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-zinc-400">Total Durasi:</p>
              <p className="font-bold text-emerald-400 text-sm mt-0.5">{manualDuration} Detik</p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Nav Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 rounded-xl border border-white/15 bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 transition-all"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Ganti Sumber Video</span>
        </button>

        <button
          onClick={handleProceed}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-cyan-500 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-brand-500/30 hover:brightness-110 active:scale-95 transition-all"
        >
          <span>Lanjut ke Editor 9:16 & Caption</span>
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
