import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/clips/[id]/status — polling status render untuk pemilik klip
export async function GET(_req: NextRequest, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Belum masuk' }, { status: 401 });
  }

  const { id } = await context.params;
  const clip = await prisma.clip.findUnique({ where: { id } });
  if (!clip || clip.userId !== user.id) {
    return NextResponse.json({ error: 'Klip tidak ditemukan' }, { status: 404 });
  }

  return NextResponse.json({
    status: clip.status,
    renderProgress: clip.renderProgress,
    renderStep: clip.renderStep,
    downloadUrl: clip.status === 'completed' ? `/api/clips/${clip.id}/download` : null,
  });
}
