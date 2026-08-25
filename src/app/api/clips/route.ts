import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { serializeClip, DEFAULT_CAPTION_CONFIG } from '@/lib/clips';
import { checkRateLimit } from '@/lib/rate-limit';

const VALID_PLATFORMS = ['youtube', 'twitch', 'upload'];
const VALID_LANGUAGES = ['auto', 'id', 'en', 'ms', 'jv', 'ko', 'ja', 'es'];
const VALID_LAYOUTS = ['auto', 'fit_blur', 'crop_1_1_blur', 'split', 'gameplay', 'face'];
const VALID_SUBTITLE_SOURCES = ['auto', 'whisper', 'youtube', 'manual', 'none'];
const VALID_SECONDARY_LANGUAGES = ['en', 'ja', 'ko', 'es'];
const MAX_CLIP_SECONDS = 120;

// GET /api/clips — daftar klip milik pengguna yang sedang masuk
export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Belum masuk' }, { status: 401 });
  }

  const clips = await prisma.clip.findMany({
    where: { userId: user.id },
    include: { payment: true },
    orderBy: { createdAt: 'desc' },
  });

  return NextResponse.json({ clips: clips.map(serializeClip) });
}

// POST /api/clips — buat klip baru (status awal: preview)
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Belum masuk' }, { status: 401 });
  }

  if (!checkRateLimit(`clips:create:${user.id}`, 30, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Terlalu banyak klip dibuat. Coba lagi nanti.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();

    const platform = VALID_PLATFORMS.includes(body.platform) ? body.platform : 'youtube';
    const sourceUrl = typeof body.sourceUrl === 'string' ? body.sourceUrl.trim() : '';
    const videoTitle = typeof body.videoTitle === 'string' ? body.videoTitle.trim() : '';
    const channelName = typeof body.channelName === 'string' ? body.channelName.trim() : '';
    const start = Math.max(0, parseFloat(body.startSeconds) || 0);
    const end = parseFloat(body.endSeconds) || 0;
    const duration = end - start;

    if (!sourceUrl || !videoTitle) {
      return NextResponse.json({ error: 'Data video sumber tidak lengkap' }, { status: 400 });
    }
    if (duration < 5 || duration > MAX_CLIP_SECONDS) {
      return NextResponse.json(
        { error: `Durasi klip harus antara 5 sampai ${MAX_CLIP_SECONDS} detik` },
        { status: 400 }
      );
    }

    const captions = Array.isArray(body.captions) ? body.captions : [];
    const captionConfig =
      body.captionConfig && typeof body.captionConfig === 'object'
        ? { ...DEFAULT_CAPTION_CONFIG, ...body.captionConfig }
        : DEFAULT_CAPTION_CONFIG;

    const language = VALID_LANGUAGES.includes(body.language) ? body.language : 'auto';
    const layout = VALID_LAYOUTS.includes(body.layout) ? body.layout : 'auto';
    const subtitleSource = VALID_SUBTITLE_SOURCES.includes(body.subtitleSource)
      ? body.subtitleSource
      : 'auto';
    const bilingualSubtitles = body.bilingualSubtitles === true;
    const secondaryLanguage = VALID_SECONDARY_LANGUAGES.includes(body.secondaryLanguage)
      ? body.secondaryLanguage
      : 'en';

    const name =
      typeof body.name === 'string' && body.name.trim().length > 0
        ? body.name.trim().slice(0, 120)
        : `${videoTitle.slice(0, 60)} [Klip 9:16]`;

    const priceIdr = Number.isInteger(body.priceIdr) && body.priceIdr > 0 ? body.priceIdr : 500;

    const clip = await prisma.clip.create({
      data: {
        userId: user.id,
        name,
        platform,
        sourceUrl,
        externalId: typeof body.externalId === 'string' ? body.externalId : '',
        videoTitle,
        channelName: channelName || 'Kreator',
        thumbnailUrl: typeof body.thumbnailUrl === 'string' ? body.thumbnailUrl : '',
        sourceDurationSec: Math.round(parseFloat(body.sourceDurationSec) || 0),
        startSeconds: start,
        endSeconds: end,
        duration,
        status: 'preview',
        captionsJson: JSON.stringify(captions),
        captionConfigJson: JSON.stringify(captionConfig),
        language,
        layout,
        subtitleSource,
        bilingualSubtitles,
        secondaryLanguage,
        priceIdr,
        renderStep: 'Preview siap, menunggu pembayaran.',
      },
      include: { payment: true },
    });

    return NextResponse.json({ clip: serializeClip(clip) }, { status: 201 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal membuat klip';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
