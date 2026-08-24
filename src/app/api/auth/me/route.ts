import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Belum masuk' }, { status: 401 });
  }
  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      balanceClips: user.balanceClips,
      provider: user.provider,
      role: (user as unknown as { role?: string }).role || 'user',
      avatarUrl: (user as unknown as { avatarUrl?: string }).avatarUrl || '',
      createdAt: user.createdAt.toISOString(),
    },
  });
}

export async function PATCH(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Belum masuk' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const data: Record<string, unknown> = {};

    if (body.name !== undefined) {
      const name = typeof body.name === 'string' ? body.name.trim() : '';
      if (!name || name.length < 2 || name.length > 60) {
        return NextResponse.json({ error: 'Nama harus 2–60 karakter' }, { status: 400 });
      }
      data.name = name;
    }

    if (body.avatarUrl !== undefined) {
      const avatarUrl = typeof body.avatarUrl === 'string' ? body.avatarUrl.trim() : '';
      // izinkan data URL base64 (max ~500KB) atau https URL
      if (avatarUrl.length > 700000) {
        return NextResponse.json({ error: 'Gambar terlalu besar (maks 500KB)' }, { status: 400 });
      }
      if (avatarUrl && !avatarUrl.startsWith('data:image/') && !avatarUrl.startsWith('https://')) {
        return NextResponse.json({ error: 'Format avatar tidak didukung' }, { status: 400 });
      }
      data.avatarUrl = avatarUrl;
    }

    if (Object.keys(data).length === 0) {
      return NextResponse.json({ error: 'Tidak ada data yang diubah' }, { status: 400 });
    }

    const updated = await prisma.user.update({
      where: { id: user.id },
      data,
    });
    return NextResponse.json({
      user: {
        id: updated.id,
        email: updated.email,
        name: updated.name,
        balanceClips: updated.balanceClips,
        provider: updated.provider,
        role: (updated as unknown as { role?: string }).role || 'user',
        avatarUrl: (updated as unknown as { avatarUrl?: string }).avatarUrl || '',
        createdAt: updated.createdAt.toISOString(),
      },
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Gagal memperbarui profil';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
