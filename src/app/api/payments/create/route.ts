import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { createPaymentRequest, isMayarConfigured, mayFallBackToLocal, MayarError } from '@/lib/mayar';

function generateReference(): string {
  return `KC-PAY-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
}

// POST /api/payments/create — buat request payment di Mayar untuk sebuah klip
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Belum masuk' }, { status: 401 });
  }

  if (!checkRateLimit(`payments:create:${user.id}`, 20, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Terlalu banyak percobaan pembayaran. Coba lagi nanti.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const clipId = typeof body.clipId === 'string' ? body.clipId : '';
    const method = typeof body.method === 'string' ? body.method : 'qris';

    const clip = await prisma.clip.findUnique({
      where: { id: clipId },
      include: { payment: true },
    });

    if (!clip || clip.userId !== user.id) {
      return NextResponse.json({ error: 'Klip tidak ditemukan' }, { status: 404 });
    }

    // Idempotent: pakai ulang pembayaran pending yang sudah ada
    if (clip.payment) {
      if (clip.payment.status === 'paid') {
        return NextResponse.json({ error: 'Klip ini sudah dibayar' }, { status: 409 });
      }
      if (clip.payment.status === 'pending' && clip.payment.payLink) {
        return NextResponse.json({
          payment: {
            reference: clip.payment.providerReference,
            status: clip.payment.status,
            method: clip.payment.method,
            amountIdr: clip.payment.amountIdr,
          },
          // Link checkout milik Mayar; status final datang lewat webhook.
          payLink: clip.payment.payLink,
        });
      }
      // pending tanpa link / failed / refunded → hapus agar bisa dibuat ulang
      await prisma.payment.delete({ where: { id: clip.payment.id } });
    }

    const reference = generateReference();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Mayar belum dikonfigurasi -> tetap buat transaksi lokal tanpa link checkout.
    // Client memakai ketiadaan payLink sebagai sinyal untuk jalur konfirmasi lokal.
    const gatewayConfigured = isMayarConfigured();
    let payLink: string | null = null;
    let mayarPaymentId: string | null = null;

    if (gatewayConfigured) {
      try {
        const mayar = await createPaymentRequest({
          name: `KlipChip ${clip.name}`.slice(0, 120),
          amount: clip.priceIdr,
          email: user.email,
          description: `Klip 9:16 - ${clip.videoTitle ?? clip.name}`,
          expiredAt: expiresAt,
          extraData: { reference, clipId: clip.id },
        });
        payLink = mayar.link;
        mayarPaymentId = mayar.id;
      } catch (err) {
        if (err instanceof MayarError) {
          if (mayFallBackToLocal(err)) {
            console.warn(`[payments] Mayar tidak dipakai, konfirmasi lokal: ${err.message}`);
          } else {
            return NextResponse.json({ error: err.message }, { status: err.status });
          }
        } else {
          throw err;
        }
      }
    }

    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        clipId: clip.id,
        amountIdr: clip.priceIdr,
        method,
        status: 'pending',
        providerReference: reference,
        mayarPaymentId,
        payLink,
      },
    });

    return NextResponse.json(
      {
        payment: {
          reference: payment.providerReference,
          status: payment.status,
          method: payment.method,
          amountIdr: payment.amountIdr,
        },
        payLink,
        gatewayConfigured,
        expiresAt: expiresAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal membuat pembayaran';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}