export type VideoPlatform = 'youtube' | 'twitch' | 'upload';

export type JobStatus = 'draft' | 'processing' | 'preview' | 'paid' | 'completed' | 'failed';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type PaymentMethod = 'qris' | 'gopay' | 'ovo' | 'dana' | 'shopeepay' | 'bca_va' | 'mandiri_va' | 'bri_va' | 'bni_va' | 'credit';

export type DurationPreset = 'short' | 'medium' | 'long' | 'auto';

export type LanguageCode = 'auto' | 'id' | 'en' | 'ms' | 'jv' | 'ko' | 'ja' | 'es';

export type LayoutMode = 'auto' | 'fit_blur' | 'crop_1_1_blur' | 'split' | 'gameplay' | 'face';

export type SubtitleSource = 'auto' | 'whisper' | 'youtube' | 'manual' | 'none';

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl: string;
  provider: 'google' | 'magic_link';
  balanceClips: number;
  isSubscribed: boolean;
  createdAt: string;
}

export interface TranscriptSegment {
  startSeconds: number;
  endSeconds: number;
  text: string;
}

export interface SourceVideo {
  id: string;
  platform: VideoPlatform;
  sourceUrl: string;
  externalId: string;
  title: string;
  channelName: string;
  durationSeconds: number;
  thumbnailUrl: string;
  videoBlobUrl?: string; // for direct raw video playback/recording
  viewsCount?: string;
  description?: string;
  status: 'ready' | 'processing' | 'error';
  audioWaveform?: number[]; // Loudness data points (0-100)
  chatVelocity?: number[];  // Chat messages per sec data points
  transcript?: TranscriptSegment[]; // Real transcript (SRT) jika tersedia
}

export interface HighlightCandidate {
  id: string;
  sourceVideoId: string;
  title: string;
  startSeconds: number;
  endSeconds: number;
  duration: number;
  audioScore: number;  // 0 - 100
  chatScore: number;   // 0 - 100
  totalScore: number;  // 0 - 100
  tags: string[];
  description: string;
  chatSpikeReason: string;
}

export interface CaptionWord {
  word: string;
  startOffset: number; // offset in seconds from caption line start
  endOffset: number;
  isSlang?: boolean;
  normalizedFrom?: string;
}

export interface CaptionLine {
  id: string;
  startSeconds: number;
  endSeconds: number;
  text: string;
  words: CaptionWord[];
  confidence: number; // 0 - 100
  hasSlang: boolean;
}

export type CaptionStyle = 'hormozi' | 'neon' | 'clean' | 'punchy' | 'smart-bg-focus' | 'box-highlight' | 'word-focus' | 'underline-focus' | 'gradient-glow' | 'game-streamer';
export type CaptionPosition = 'bottom' | 'middle' | 'top';

export interface CaptionConfig {
  style: CaptionStyle;
  position: CaptionPosition;
  fontSize: 'sm' | 'md' | 'lg' | 'xl';
  textColor: string;
  highlightColor: string;
  showBackgroundBox: boolean;
  uppercase: boolean;
}

export interface ClipProject {
  id: string;
  userId: string;
  name: string;
  sourceVideo: SourceVideo;
  startSeconds: number;
  endSeconds: number;
  duration: number;
  status: JobStatus;
  captions: CaptionLine[];
  captionConfig: CaptionConfig;
  language: LanguageCode;
  layout: LayoutMode;
  subtitleSource: SubtitleSource;
  previewUrl?: string;
  outputUrl?: string;
  paymentId?: string;
  priceIdr: number;
  renderProgress?: number; // 0 - 100
  renderStep?: string;
  createdAt: string;
  completedAt?: string;
  rating?: number;
  feedbackText?: string;
}

export interface PaymentTransaction {
  id: string;
  userId: string;
  clipId: string;
  clipTitle: string;
  amountIdr: number;
  method: PaymentMethod;
  status: PaymentStatus;
  providerReference: string;
  paidAt?: string;
  createdAt: string;
}

export interface SlangEntry {
  id: string;
  slang: string;
  normalized: string;
  category: 'FiveM / GTA' | 'Minecraft' | 'Mobile Legends' | 'Valorant' | 'Livestream Indo' | 'Umum Gaming';
  meaning: string;
  exampleSentence: string;
  isOfficial: boolean;
}
