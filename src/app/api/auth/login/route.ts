import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from '@/lib/auth';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const provider = body.provider === 'google' ? 'google' : 'magic_link';

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: 'Alamat email tidak valid' }, { status: 400 });
    }

    const displayName =
      typeof body.name === 'string' && body.name.trim().length > 0
        ? body.name.trim().slice(0, 60)
        : email.split('@')[0];

    const user = await prisma.user.upsert({
      where: { email },
      update: { provider },
      create: { email, name: displayName, provider, balanceClips: 3 },
    });

    const token = createSessionToken(user.id);
    const res = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        balanceClips: user.balanceClips,
      },
    });

    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: 'lax',
      // Secure=false agar cookie tetap terkirim di localhost http (dev & prod lokal)
      secure: false,
      maxAge: SESSION_MAX_AGE_SECONDS,
      path: '/',
    });

    return res;
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal masuk';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
