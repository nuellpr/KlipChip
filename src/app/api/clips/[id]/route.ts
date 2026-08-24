import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { serializeClip } from '@/lib/clips';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// PATCH /api/clips/[id] — perbarui status, rating, atau feedback klip
export async function PATCH(req: NextRequest, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Belum masuk' }, { status: 401 });
  }

  const { id } = await context.params;
  const clip = await prisma.clip.findUnique({ where: { id } });
  if (!clip || clip.userId !== user.id) {
    return NextResponse.json({ error: 'Klip tidak ditemukan' }, { status: 404 });
  }

  try {
    const body = await req.json();
    const data: Record<string, unknown> = {};

    // Rating kualitas caption (PRD: alur langkah 13)
    if (body.rating !== undefined) {
      const rating = Math.round(Number(body.rating));
      if (rating < 1 || rating > 5) {
        return NextResponse.json({ error: 'Rating harus 1 sampai 5' }, { status: 400 });
      }
      data.rating = rating;
      if (typeof body.feedbackText === 'string') {
        data.feedbackText = body.feedbackText.trim().slice(0, 500);
      }
    }

    // Pembaruan status oleh pemilik (mis. selesai render sisi-klien untuk upload lokal)
    if (typeof body.status === 'string') {
      const allowed = ['draft', 'processing', 'preview', 'completed', 'failed'];
      // Status 'paid' hanya boleh diset oleh webhook pembayaran
      if (!allowed.includes(body.status)) {
        return NextResponse.json({ error: 'Status tidak valid' }, { status: 400 });
      }
      data.status = body.status;
      if (body.status === 'completed') {
        data.completedAt = new Date();
        data.renderProgress = 100;
      }
    }

    if (typeof body.renderStep === 'string') {
      data.renderStep = body.renderStep.slice(0, 300);
    }
    if (Number.isInteger(body.renderProgress)) {
      data.renderProgress = Math.min(100, Math.max(0, body.renderProgress));
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Tidak ada data yang diperbarui' }, { status: 400 });
    }

    const updated = await prisma.clip.update({
      where: { id },
      data,
      include: { payment: true },
    });

    return NextResponse.json({ clip: serializeClip(updated) });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal memperbarui klip';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

// DELETE /api/clips/[id] — hapus riwayat klip
export async function DELETE(_req: NextRequest, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Belum masuk' }, { status: 401 });
  }

  const { id } = await context.params;
  const clip = await prisma.clip.findUnique({ where: { id } });
  if (!clip || clip.userId !== user.id) {
    return NextResponse.json({ error: 'Klip tidak ditemukan' }, { status: 404 });
  }

  await prisma.clip.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
