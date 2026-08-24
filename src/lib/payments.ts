import crypto from 'crypto';
import { prisma } from './prisma';
import { CLIP_PRICE_IDR, CREDIT_PACKAGES, getCreditPackage } from './pricing';

const WEBHOOK_SECRET = process.env.PAYMENT_WEBHOOK_SECRET || 'klipchip-webhook-dev-secret';

export { CLIP_PRICE_IDR, CREDIT_PACKAGES, getCreditPackage };

export interface PaymentWebhookPayload {
  reference: string;
  status: 'paid' | 'failed';
  paidAt?: string;
}

export function signWebhookPayload(rawBody: string): string {
  return crypto.createHmac('sha256', WEBHOOK_SECRET).update(rawBody).digest('hex');
}

export function verifyWebhookSignature(rawBody: string, signature: string | null): boolean {
  if (!signature) return false;
  const expected = signWebhookPayload(rawBody);
  const sigBuf = Buffer.from(signature, 'utf8');
  const expBuf = Buffer.from(expected, 'utf8');
  if (sigBuf.length !== expBuf.length) return false;
  return crypto.timingSafeEqual(sigBuf, expBuf);
}

/**
 * Memproses payload webhook pembayaran secara idempotent.
 * Bisa untuk pembayaran per clip (clipId ada) atau top-up kredit (packageCode ada).
 */
export async function processPaymentWebhook(payload: PaymentWebhookPayload) {
  const payment = await prisma.payment.findUnique({
    where: { providerReference: payload.reference },
    include: { clip: true },
  });

  if (!payment) {
    return { ok: false as const, reason: 'payment_not_found' };
  }

  // Idempotency: pembayaran yang sudah final tidak diproses ulang
  if (payment.status === 'paid') {
    return { ok: true as const, alreadyProcessed: true, payment };
  }

  const newStatus = payload.status === 'paid' ? 'paid' : 'failed';

  const updated = await prisma.$transaction(async (tx) => {
    const p = await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: newStatus,
        paidAt: payload.status === 'paid' ? new Date(payload.paidAt || Date.now()) : null,
      },
    });

    if (payload.status === 'paid') {
      if (payment.packageCode && payment.creditAmount) {
        // Top-up kredit: tambah balanceClips
        await tx.user.update({
          where: { id: payment.userId },
          data: { balanceClips: { increment: payment.creditAmount } },
        });
      } else if (payment.clipId) {
        // Pembayaran per clip
        await tx.clip.update({
          where: { id: payment.clipId },
          data: { status: 'paid', renderStep: 'Pembayaran diterima, menunggu render final.' },
        });
      }
    } else {
      if (payment.clipId) {
        await tx.clip.update({
          where: { id: payment.clipId },
          data: { status: 'preview', renderStep: 'Pembayaran gagal, silakan coba lagi.' },
        });
      }
    }

    return p;
  });

  return { ok: true as const, alreadyProcessed: false, payment: updated };
}
