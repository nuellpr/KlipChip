import { prisma } from './prisma.ts';

/**
 * Refund kredit render yang gagal — IDEMPOTEN.
 *
 * Gate: hanya clip berstatus aktif (processing/paid/pending) yang di-flip ke
 * `failed`. Flip mengenai tepat 1 baris ⇒ belum pernah direfund ⇒ saldo +1.
 * Flip 0 baris ⇒ sudah failed/direfund sebelumnya ⇒ TANPA increment.
 * Dipakai runner (render gagal/timeout) dan sweeper (stale job).
 */
export async function refundFailedRender(
  clipId: string,
  reason: string
): Promise<{ refunded: boolean }> {
  return prisma.$transaction(async (tx) => {
    const flipped = await tx.clip.updateMany({
      where: { id: clipId, status: { in: ['processing', 'paid', 'pending'] } },
      data: {
        status: 'failed',
        renderProgress: 0,
        renderStep:
          'Render gagal: ' +
          reason.slice(0, 240) +
          ' Saldo klip dikembalikan.',
      },
    });
    if (flipped.count === 0) {
      return { refunded: false };
    }

    const clip = await tx.clip.findUnique({
      where: { id: clipId },
      select: { userId: true },
    });
    if (!clip) {
      return { refunded: false };
    }

    await tx.user.update({
      where: { id: clip.userId },
      data: { balanceClips: { increment: 1 } },
    });
    console.error(
      '[refund] clip=%s user=%s credit+1 reason=%s',
      clipId,
      clip.userId,
      reason.slice(0, 240)
    );
    return { refunded: true };
  });
}
