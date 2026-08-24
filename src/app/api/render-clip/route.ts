import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { isRenderableSourceUrl } from '@/lib/url-guard';

// POST /api/render-clip — masukkan klip yang sudah dibayar ke antrean render (ClipJob)
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Belum masuk' }, { status: 401 });
  }

  if (!checkRateLimit(`render:${user.id}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Batas render per jam tercapai. Coba lagi nanti.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const clipId = typeof body.clipId === 'string' ? body.clipId : '';

    const clip = await prisma.clip.findUnique({
      where: { id: clipId },
      include: { payment: true },
    });

    if (!clip || clip.userId !== user.id) {
      return NextResponse.json({ error: 'Klip tidak ditemukan' }, { status: 404 });
    }

    const storageDir = path.join(process.cwd(), 'storage');

    // Idempotent: klip sudah selesai dan file masih ada
    if (clip.status === 'completed' && clip.outputFilename) {
      const existingPath = path.join(storageDir, path.basename(clip.outputFilename));
      if (fs.existsSync(existingPath)) {
        return NextResponse.json({
          success: true,
          alreadyRendered: true,
          downloadUrl: `/api/clips/${clip.id}/download`,
          sizeBytes: fs.statSync(existingPath).size,
        });
      }
    }

    // Wajib sudah dibayar (webhook pembayaran mengubah status menjadi paid)
    if (clip.payment?.status !== 'paid') {
      return NextResponse.json(
        { error: 'Klip belum dibayar. Selesaikan pembayaran terlebih dahulu.' },
        { status: 402 }
      );
    }

    if (!isRenderableSourceUrl(clip.sourceUrl)) {
      return NextResponse.json(
        { error: 'Sumber video harus URL https dari YouTube atau Twitch' },
        { status: 400 }
      );
    }

    await prisma.$transaction([
      prisma.clip.update({
        where: { id: clip.id },
        data: {
          status: 'processing',
          renderProgress: 0,
          renderStep: 'Masuk antrean render...',
        },
      }),
      prisma.clipJob.upsert({
        where: { clipId: clip.id },
        create: { clipId: clip.id, status: 'pending' },
        update: { status: 'pending', attempts: 0, error: null, startedAt: null },
      }),
    ]);

    console.log(`[API /api/render-clip] Klip ${clip.id} masuk antrean render oleh user ${user.id}`);

    return NextResponse.json({ success: true, queued: true, clipId: clip.id });
  } catch (err) {
    console.error('[API /api/render-clip]', err);
    return NextResponse.json({ error: 'Gagal memasukkan klip ke antrean render' }, { status: 500 });
  }
}
