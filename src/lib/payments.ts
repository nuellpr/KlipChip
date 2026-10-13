import { prisma } from './prisma.ts';
import { CLIP_PRICE_IDR, CREDIT_PACKAGES, getCreditPackage } from './pricing.ts';

export { CLIP_PRICE_IDR, CREDIT_PACKAGES, getCreditPackage };

export interface PaymentWebhookPayload {
  reference: string;
  status: 'paid' | 'failed';
  paidAt?: string;
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
  if (payment.status === 'paid' || payment.status === 'failed') {
    return { ok: true as const, alreadyProcessed: true, payment };
  }

  const newStatus = payload.status === 'paid' ? 'paid' : 'failed';

  return prisma.$transaction(async (tx) => {
    // Guard atomik: flip hanya berhasil kalau status masih seperti yang kita
    // baca (optimistic concurrency). Webhook dan polling bisa masuk bersamaan;
    // yang kalah melihat count=0 dan TIDAK menambah saldo — menutup race saldo
    // dobel pada top-up paket.
    const claimed = await tx.payment.updateMany({
      where: { id: payment.id, status: payment.status },
      data: {
        status: newStatus,
        paidAt: payload.status === 'paid' ? new Date(payload.paidAt || Date.now()) : null,
      },
    });

    if (claimed.count === 0) {
      const current = await tx.payment.findUnique({
        where: { id: payment.id },
        include: { clip: true },
      });
      return { ok: true as const, alreadyProcessed: true, payment: current ?? payment };
    }

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

    const updated = await tx.payment.findUnique({
      where: { id: payment.id },
      include: { clip: true },
    });
    return { ok: true as const, alreadyProcessed: false, payment: updated ?? payment };
  });
}
