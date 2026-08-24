import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { CLIP_PRICE_IDR } from '@/lib/payments';

// POST /api/payments/use-credit — bayar klip dengan 1 kredit saldo (tanpa gateway)
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Belum masuk' }, { status: 401 });
  }

  if (!checkRateLimit(`payments:credit:${user.id}`, 20, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Terlalu banyak percobaan. Coba lagi nanti.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const clipId = typeof body.clipId === 'string' ? body.clipId : '';

    const clip = await prisma.clip.findUnique({
      where: { id: clipId },
      include: { payment: true },
    });

    if (!clip || clip.userId !== user.id) {
      return NextResponse.json({ error: 'Klip tidak ditemukan' }, { status: 404 });
    }

    if (clip.payment) {
      if (clip.payment.status === 'paid') {
        return NextResponse.json({ error: 'Klip ini sudah dibayar' }, { status: 409 });
      }
      if (clip.payment.status === 'pending') {
        return NextResponse.json(
          { error: 'Masih ada transaksi pending untuk klip ini. Selesaikan atau tunggu kedaluwarsa.' },
          { status: 409 }
        );
      }
      await prisma.payment.delete({ where: { id: clip.payment.id } });
    }

    const isAdmin = user.role === 'admin';
    if (!isAdmin && user.balanceClips <= 0) {
      return NextResponse.json(
        { error: 'Saldo kredit habis. Beli kredit atau bayar per clip.' },
        { status: 402 }
      );
    }

    const reference = `KC-CREDIT-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;

    const result = await prisma.$transaction(async (tx) => {
      const current = await tx.user.findUnique({ where: { id: user.id } });
      if (!current) {
        return { ok: false as const, reason: 'no_credit' };
      }
      if (current.role !== 'admin') {
        if (current.balanceClips <= 0) {
          return { ok: false as const, reason: 'no_credit' };
        }
        await tx.user.update({
          where: { id: user.id },
          data: { balanceClips: { decrement: 1 } },
        });
      }
      const payment = await tx.payment.create({
        data: {
          userId: user.id,
          clipId: clip.id,
          amountIdr: CLIP_PRICE_IDR,
          method: 'credit',
          status: 'paid',
          providerReference: reference,
          paidAt: new Date(),
        },
      });
      await tx.clip.update({
        where: { id: clip.id },
        data: { status: 'paid', renderStep: 'Pembayaran dengan kredit diterima, menunggu render final.' },
      });
      return { ok: true as const, payment };
    });

    if (!result.ok) {
      return NextResponse.json({ error: 'Saldo kredit habis. Beli kredit terlebih dahulu.' }, { status: 402 });
    }

    return NextResponse.json({
      payment: {
        reference: result.payment.providerReference,
        status: result.payment.status,
        method: result.payment.method,
        amountIdr: result.payment.amountIdr,
      },
      balanceClips: isAdmin ? user.balanceClips : user.balanceClips - 1,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal memakai kredit';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
