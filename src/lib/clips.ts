import { Clip, Payment } from '@prisma/client';
import { CaptionConfig, CaptionLine, ClipProject, JobStatus, VideoPlatform } from './types';

export const DEFAULT_CAPTION_CONFIG: CaptionConfig = {
  style: 'hormozi',
  position: 'bottom',
  fontSize: 'lg',
  textColor: '#FFFFFF',
  highlightColor: '#FACC15',
  showBackgroundBox: true,
  uppercase: true,
};

const VALID_STATUSES: JobStatus[] = ['draft', 'processing', 'preview', 'paid', 'completed', 'failed'];
const VALID_LANGUAGES = ['auto', 'id', 'en', 'ms', 'jv', 'ko', 'ja', 'es'];
const VALID_LAYOUTS = ['auto', 'fit_blur', 'crop_1_1_blur', 'split', 'gameplay', 'face'];
const VALID_SUBTITLE_SOURCES = ['auto', 'whisper', 'youtube', 'manual', 'none'];

export function serializeClip(clip: Clip & { payment?: Payment | null }): ClipProject {
  let captions: CaptionLine[] = [];
  try {
    const parsed = JSON.parse(clip.captionsJson);
    if (Array.isArray(parsed)) captions = parsed;
  } catch {
    captions = [];
  }

  let captionConfig = DEFAULT_CAPTION_CONFIG;
  try {
    captionConfig = { ...DEFAULT_CAPTION_CONFIG, ...JSON.parse(clip.captionConfigJson) };
  } catch {
    captionConfig = DEFAULT_CAPTION_CONFIG;
  }

  const hasOutput = clip.status === 'completed' && !!clip.outputFilename;

  return {
    id: clip.id,
    userId: clip.userId,
    name: clip.name,
    sourceVideo: {
      id: `vid-${clip.externalId || clip.id}`,
      platform: clip.platform as VideoPlatform,
      sourceUrl: clip.sourceUrl,
      externalId: clip.externalId,
      title: clip.videoTitle,
      channelName: clip.channelName,
      durationSeconds: clip.sourceDurationSec,
      thumbnailUrl: clip.thumbnailUrl,
      status: 'ready',
    },
    startSeconds: clip.startSeconds,
    endSeconds: clip.endSeconds,
    duration: Math.round(clip.duration),
    status: (VALID_STATUSES.includes(clip.status as JobStatus) ? clip.status : 'draft') as JobStatus,
    captions,
    captionConfig,
    language: VALID_LANGUAGES.includes(clip.language) ? (clip.language as ClipProject['language']) : 'auto',
    layout: VALID_LAYOUTS.includes(clip.layout) ? (clip.layout as ClipProject['layout']) : 'auto',
    subtitleSource: VALID_SUBTITLE_SOURCES.includes(clip.subtitleSource)
      ? (clip.subtitleSource as ClipProject['subtitleSource'])
      : 'auto',
    bilingualSubtitles: clip.bilingualSubtitles,
    secondaryLanguage: clip.secondaryLanguage,
    socialSummary: clip.socialSummary,
    previewUrl: clip.thumbnailUrl || undefined,
    outputUrl: hasOutput ? `/api/clips/${clip.id}/download` : undefined,
    paymentId: clip.payment?.providerReference,
    priceIdr: clip.priceIdr,
    renderProgress: clip.renderProgress,
    renderStep: clip.renderStep ?? undefined,
    createdAt: clip.createdAt.toISOString(),
    completedAt: clip.completedAt?.toISOString(),
    rating: clip.rating ?? undefined,
    feedbackText: clip.feedbackText ?? undefined,
  };
}
