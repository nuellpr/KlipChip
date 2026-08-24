import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { Readable } from 'stream';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

interface RouteContext {
  params: Promise<{ id: string }>;
}

// GET /api/clips/[id]/download — unduhan terproteksi (hanya pemilik & klip selesai)
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

  if (clip.status !== 'completed' || !clip.outputFilename) {
    return NextResponse.json(
      { error: 'Klip belum selesai dirender atau belum dibayar' },
      { status: 403 }
    );
  }

  const safeFilename = path.basename(clip.outputFilename);
  const filePath = path.join(process.cwd(), 'storage', safeFilename);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json(
      { error: 'File hasil render tidak ditemukan di server' },
      { status: 404 }
    );
  }

  // Streaming dari disk — memori tetap datar berapa pun ukuran file.
  const stat = fs.statSync(filePath);
  const stream = fs.createReadStream(filePath);
  const downloadName = `klipchip_${clip.id.slice(-8)}_9x16.mp4`;

  return new Response(Readable.toWeb(stream) as unknown as ReadableStream, {
    headers: {
      'Content-Type': 'video/mp4',
      'Content-Length': String(stat.size),
      'Content-Disposition': `attachment; filename="${downloadName}"`,
      'Cache-Control': 'private, no-store',
    },
  });
}
