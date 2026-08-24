import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE_SECONDS } from '@/lib/auth';

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const payload = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const json = Buffer.from(payload, 'base64').toString('utf-8');
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return NextResponse.redirect(
      new URL('/?error=google_not_configured', req.nextUrl.origin)
    );
  }

  const code = req.nextUrl.searchParams.get('code');
  const state = req.nextUrl.searchParams.get('state');
  const oauthError = req.nextUrl.searchParams.get('error');
  const storedState = req.cookies.get('kc_oauth_state')?.value;

  if (oauthError) {
    return NextResponse.redirect(
      new URL(`/?error=${encodeURIComponent(oauthError)}`, req.nextUrl.origin)
    );
  }

  if (!code || !state || !storedState || state !== storedState) {
    return NextResponse.json({ error: 'State OAuth tidak valid' }, { status: 400 });
  }

  const origin = req.nextUrl.origin;
  const redirectUri = `${origin}/api/auth/google/callback`;

  // Tukar code -> tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }).toString(),
  });

  if (!tokenRes.ok) {
    const errText = await tokenRes.text();
    console.error('Google token exchange failed:', errText);
    return NextResponse.redirect(new URL('/?error=google_token_failed', origin));
  }

  const tokens = (await tokenRes.json()) as {
    access_token?: string;
    id_token?: string;
  };

  // Ambil profil via userinfo atau decode id_token
  let email: string | null = null;
  let name: string | null = null;

  if (tokens.access_token) {
    try {
      const userinfoRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      });
      if (userinfoRes.ok) {
        const profile = (await userinfoRes.json()) as {
          email?: string;
          name?: string;
        };
        email = profile.email ?? null;
        name = profile.name ?? null;
      }
    } catch (e) {
      console.warn('userinfo fetch failed', e);
    }
  }

  // Fallback decode id_token
  if (!email && tokens.id_token) {
    const payload = decodeJwtPayload(tokens.id_token);
    if (payload) {
      email = (payload.email as string) ?? null;
      name = (payload.name as string) ?? (payload.email as string)?.split('@')[0] ?? null;
    }
  }

  if (!email) {
    return NextResponse.redirect(new URL('/?error=google_no_email', origin));
  }

  const normalizedEmail = email.trim().toLowerCase();
  const displayName = (name && name.trim()) || normalizedEmail.split('@')[0];

  const user = await prisma.user.upsert({
    where: { email: normalizedEmail },
    update: { name: displayName, provider: 'google' },
    create: { email: normalizedEmail, name: displayName, provider: 'google', balanceClips: 3 },
  });

  const session = createSessionToken(user.id);
  const res = NextResponse.redirect(new URL('/studio', origin));
  res.cookies.set(SESSION_COOKIE, session, {
    httpOnly: true,
    sameSite: 'lax',
    secure: false,
    maxAge: SESSION_MAX_AGE_SECONDS,
    path: '/',
  });
  // hapus state
  res.cookies.set('kc_oauth_state', '', { maxAge: 0, path: '/' });
  return res;
}
