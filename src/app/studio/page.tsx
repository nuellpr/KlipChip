'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { StepUrlInput } from '@/components/studio/step-url-input';
import { StepHighlightAi } from '@/components/studio/step-highlight-ai';
import { StepVideoEditor } from '@/components/studio/step-video-editor';
import { StepCheckout } from '@/components/studio/step-checkout';
import { StepRenderExport } from '@/components/studio/step-render-export';
import { AuthGate } from '@/components/auth-gate';
import { useAuth } from '@/lib/use-auth';
import { 
  SourceVideo, 
  HighlightCandidate, 
  CaptionLine, 
  CaptionConfig, 
  PaymentMethod,
  DurationPreset,
  LanguageCode,
  LayoutMode,
  SubtitleSource
} from '@/lib/types';
import { PresetVideoItem } from '@/data/sample-videos';
import { generateAutoCaptionsForCustomTime } from '@/lib/caption-engine';
import { CLIP_PRICE_IDR } from '@/lib/pricing';

function StudioContent() {
  const searchParams = useSearchParams();
  const urlParam = searchParams.get('url');

  // Multi-step state: 1: url, 2: highlight, 3: editor, 4: checkout, 5: render
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Studio project data
  const [selectedVideo, setSelectedVideo] = useState<SourceVideo | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<PresetVideoItem | undefined>(undefined);
  const [initialUrlConsumed, setInitialUrlConsumed] = useState(false);
  const [startSeconds, setStartSeconds] = useState<number>(0);
  const [endSeconds, setEndSeconds] = useState<number>(35);
  const [captions, setCaptions] = useState<CaptionLine[]>([]);
  const [captionConfig, setCaptionConfig] = useState<CaptionConfig>({
    style: 'hormozi',
    position: 'bottom',
    fontSize: 'lg',
    textColor: '#FFFFFF',
    highlightColor: '#FACC15',
    showBackgroundBox: true,
    uppercase: true,
  });
  const [paymentRef, setPaymentRef] = useState<string>('');
  const [clipId, setClipId] = useState<string | null>(null);
  const [isSavingClip, setIsSavingClip] = useState(false);
  const [saveError, setSaveError] = useState('');
  const [durationPreset, setDurationPreset] = useState<DurationPreset>('auto');
  const [language, setLanguage] = useState<LanguageCode>('auto');
  const [layout, setLayout] = useState<LayoutMode>('auto');
  const [subtitleSource, setSubtitleSource] = useState<SubtitleSource>('auto');
  const { user, refresh: refreshAuth } = useAuth();

  // Handle URL param on direct mount: teruskan ke StepUrlInput
  // agar diproses lewat API real (bukan data preset kalengan)
  const initialUrl = urlParam && !selectedVideo && !initialUrlConsumed ? urlParam : undefined;

  // Step 1 -> Step 2
  const handleVideoSelected = (video: SourceVideo, preset?: PresetVideoItem) => {
    setSelectedVideo(video);
    setSelectedPreset(preset);
    setInitialUrlConsumed(true);
    setCurrentStep(2);
  };

  // Step 2 -> Step 3
  const handleHighlightSelected = (
    startSec: number,
    endSec: number,
    highlight?: HighlightCandidate
  ) => {
    setStartSeconds(startSec);
    setEndSeconds(endSec);

    // Retrieve preset captions or generate auto captions
    if (highlight && selectedPreset && selectedPreset.captionsMap[highlight.id]) {
      setCaptions(selectedPreset.captionsMap[highlight.id]);
    } else {
      const generated = generateAutoCaptionsForCustomTime(
        startSec,
        endSec,
        undefined,
        selectedVideo?.transcript
      );
      setCaptions(generated);
    }

    setCurrentStep(3);
  };

  // Step 3 -> Step 4 (simpan klip ke database terlebih dahulu)
  const handleProceedToCheckout = async (
    finalCaptions: CaptionLine[],
    finalConfig: CaptionConfig,
    finalMeta?: { language?: LanguageCode; layout?: LayoutMode; subtitleSource?: SubtitleSource; bilingualSubtitles?: boolean; secondaryLanguage?: string }
  ) => {
    setCaptions(finalCaptions);
    setCaptionConfig(finalConfig);
    if (finalMeta?.language) setLanguage(finalMeta.language);
    if (finalMeta?.layout) setLayout(finalMeta.layout);
    if (finalMeta?.subtitleSource) setSubtitleSource(finalMeta.subtitleSource);

    if (!selectedVideo) {
      setCurrentStep(4);
      return;
    }

    setIsSavingClip(true);
    setSaveError('');

    try {
      const res = await fetch('/api/clips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: `${selectedVideo.title.slice(0, 60)} [Klip 9:16]`,
          platform: selectedVideo.platform,
          sourceUrl: selectedVideo.sourceUrl.startsWith('http')
            ? selectedVideo.sourceUrl
            : `https://www.youtube.com/watch?v=${selectedVideo.externalId}`,
          externalId: selectedVideo.externalId,
          videoTitle: selectedVideo.title,
          channelName: selectedVideo.channelName,
          thumbnailUrl: selectedVideo.thumbnailUrl,
          sourceDurationSec: selectedVideo.durationSeconds,
          startSeconds,
          endSeconds,
          captions: finalCaptions,
          captionConfig: finalConfig,
          language: finalMeta?.language ?? language,
          layout: finalMeta?.layout ?? layout,
          subtitleSource: finalMeta?.subtitleSource ?? subtitleSource,
          bilingualSubtitles: finalMeta?.bilingualSubtitles === true,
          secondaryLanguage: finalMeta?.secondaryLanguage ?? 'en',
          priceIdr: CLIP_PRICE_IDR,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menyimpan klip');
      }
      setClipId(data.clip.id);
      setCurrentStep(4);
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Gagal menyimpan klip, coba lagi.');
    } finally {
      setIsSavingClip(false);
    }
  };

  // Step 4 -> Step 5
  const handlePaymentSuccess = (method: PaymentMethod, reference: string) => {
    setPaymentRef(reference);
    refreshAuth();
    setCurrentStep(5);
  };

  // Reset to start new clip
  const handleReset = () => {
    setSelectedVideo(null);
    setSelectedPreset(undefined);
    setCaptions([]);
    setClipId(null);
    setPaymentRef('');
    setSaveError('');
    setDurationPreset('auto');
    setLanguage('auto');
    setLayout('auto');
    setSubtitleSource('auto');
    setCurrentStep(1);
  };

  const stepsList = [
    { num: 1, name: '1. Sumber Video' },
    { num: 2, name: '2. Highlight AI' },
    { num: 3, name: '3. Editor 9:16' },
    { num: 4, name: '4. Bayar 1 Kredit / Rp 500' },
    { num: 5, name: '5. Unduh Video' },
  ];

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Step Indicator Header */}
        <div className="mb-10 max-w-3xl mx-auto">
          <div className="flex items-center justify-between">
            {stepsList.map((st) => {
              const isPassed = currentStep > st.num;
              const isCurrent = currentStep === st.num;

              return (
                <div key={st.num} className="flex flex-col items-center">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-brand-600 text-white ring-4 ring-brand-500/20 shadow-lg shadow-brand-500/30'
                        : isPassed
                        ? 'bg-emerald-500 text-black font-extrabold'
                        : 'bg-zinc-800 text-zinc-500 border border-white/5'
                    }`}
                  >
                    {isPassed ? '✓' : st.num}
                  </div>
                  <span
                    className={`text-[10px] mt-1.5 font-semibold hidden sm:inline ${
                      isCurrent
                        ? 'text-cyan-300'
                        : isPassed
                        ? 'text-emerald-400'
                        : 'text-zinc-500'
                    }`}
                  >
                    {st.name}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="relative mt-2 h-1 w-full bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-brand-500 via-cyan-400 to-emerald-400 transition-all duration-500"
              style={{ width: `${((currentStep - 1) / 4) * 100}%` }}
            />
          </div>
        </div>

        {/* Error saat menyimpan klip ke server */}
        {saveError && (
          <div className="max-w-3xl mx-auto mb-6 rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-300 flex items-center justify-between gap-3">
            <span>{saveError}</span>
            <button
              onClick={() => setSaveError('')}
              className="text-xs text-zinc-300 hover:text-white underline shrink-0"
            >
              Tutup
            </button>
          </div>
        )}

        {/* Overlay saat menyimpan klip */}
        {isSavingClip && (
          <div className="max-w-3xl mx-auto mb-6 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3 text-sm font-semibold text-cyan-300 flex items-center gap-2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-cyan-300 border-t-transparent" />
            <span>Menyimpan draft klip ke server...</span>
          </div>
        )}

        {/* Step 1 */}
        {currentStep === 1 && <StepUrlInput onVideoSelected={handleVideoSelected} initialUrl={initialUrl} />}

        {/* Step 2 */}
        {currentStep === 2 && selectedVideo && (
          <StepHighlightAi
            video={selectedVideo}
            preset={selectedPreset}
            durationPreset={durationPreset}
            language={language}
            onDurationPresetChange={setDurationPreset}
            onLanguageChange={setLanguage}
            onHighlightSelected={handleHighlightSelected}
            onBack={() => setCurrentStep(1)}
          />
        )}

        {/* Step 3 */}
        {currentStep === 3 && selectedVideo && (
          <StepVideoEditor
            video={selectedVideo}
            startSeconds={startSeconds}
            endSeconds={endSeconds}
            initialCaptions={captions}
            initialLanguage={language}
            initialLayout={layout}
            initialSubtitleSource={subtitleSource}
            onProceedToCheckout={handleProceedToCheckout}
            onBack={() => setCurrentStep(2)}
          />
        )}

        {/* Step 4 */}
        {currentStep === 4 && selectedVideo && (
          <StepCheckout
            video={selectedVideo}
            duration={endSeconds - startSeconds}
            priceIdr={CLIP_PRICE_IDR}
            balanceClips={user?.balanceClips ?? 0}
            isUnlimitedCredits={user?.role === 'admin'}
            clipId={clipId}
            onPaymentSuccess={handlePaymentSuccess}
            onBack={() => setCurrentStep(3)}
          />
        )}

        {/* Step 5 */}
        {currentStep === 5 && selectedVideo && (
          <StepRenderExport
            video={selectedVideo}
            startSeconds={startSeconds}
            endSeconds={endSeconds}
            captions={captions}
            captionConfig={captionConfig}
            paymentReference={paymentRef || 'KC-PAY-DEMO'}
            clipId={clipId}
            onReset={handleReset}
          />
        )}
      </div>
    </div>
  );
}

export default function StudioPage() {
  return (
    <AuthGate
      title="Masuk ke KlipChip Studio"
      description="Masuk terlebih dahulu agar draft klip, pembayaran, dan hasil render Anda tersimpan aman di akun."
    >
      <Suspense fallback={<div className="p-8 text-center text-zinc-400">Memuat KlipChip Studio...</div>}>
        <StudioContent />
      </Suspense>
    </AuthGate>
  );
}
