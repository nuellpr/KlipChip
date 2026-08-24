import { cookies } from 'next/headers';
import crypto from 'crypto';
import { prisma } from './prisma';

const AUTH_SECRET = process.env.AUTH_SECRET || 'klipchip-dev-secret-change-me';

export const SESSION_COOKIE = 'kc_session';
export const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 hari

export function createSessionToken(userId: string): string {
  const ts = Date.now().toString();
  const payload = `${userId}.${ts}`;
  const sig = crypto.createHmac('sha256', AUTH_SECRET).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

export function verifySessionToken(token: string): string | null {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [userId, ts, sig] = parts;

  const expectedSig = crypto
    .createHmac('sha256', AUTH_SECRET)
    .update(`${userId}.${ts}`)
    .digest('hex');

  const sigBuf = Buffer.from(sig, 'utf8');
  const expectedBuf = Buffer.from(expectedSig, 'utf8');
  if (sigBuf.length !== expectedBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expectedBuf)) return null;

  const issuedAt = parseInt(ts, 10);
  if (Number.isNaN(issuedAt)) return null;
  if (Date.now() - issuedAt > SESSION_MAX_AGE_SECONDS * 1000) return null;

  return userId;
}

export async function getCurrentUser() {
  try {
    const store = await cookies();
    const token = store.get(SESSION_COOKIE)?.value;
    if (!token) return null;
    const userId = verifySessionToken(token);
    if (!userId) return null;
    return await prisma.user.findUnique({ where: { id: userId } });
  } catch {
    return null;
  }
}
