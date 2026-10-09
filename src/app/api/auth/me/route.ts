import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

/**
 * Provider login sebenarnya, dibaca dari tabel Account milik Better Auth.
 * Kolom `User.provider` tetap ada untuk kompatibilitas tampilan, tapi isinya
 * tidak diperbarui oleh Better Auth, jadi jangan dipakai sebagai sumber
 * kebenaran. 'credential' = email+password (dulu disebut magic_link).
 */
async function resolveProvider(userId: string): Promise<'google' | 'password'> {
  const account = await prisma.account.findFirst({
    where: { userId, providerId: 'google' },
    select: { id: true },
  });
  return account ? 'google' : 'password';
}

function serialize(user: {
  id: string;
  email: string;
  name: string;
  balanceClips: number;
  role: string;
  avatarUrl: string;
  createdAt: Date;
}, provider: 'google' | 'password') {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    balanceClips: user.balanceClips,
    role: user.role,
    avatarUrl: user.avatarUrl,
    provider,
    createdAt: user.createdAt.toISOString(),
  };
}

export async function GET() {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Belum masuk' }, { status: 401 });
  }
  return NextResponse.json({ user: serialize(user, await resolveProvider(user.id)) });
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
      user: serialize(updated, await resolveProvider(user.id)),
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Gagal memperbarui profil';
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
