import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { getCreditPackage } from '@/lib/payments';
import { createPaymentRequest, isMayarConfigured, mayFallBackToLocal, MayarError } from '@/lib/mayar';

// POST /api/payments/packages — beli paket kredit (top-up saldo)
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Belum masuk' }, { status: 401 });
  }

  if (!checkRateLimit(`payments:packages:${user.id}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Terlalu banyak percobaan pembelian. Coba lagi nanti.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const packageCode = typeof body.packageCode === 'string' ? body.packageCode : '';
    const method = typeof body.method === 'string' ? body.method : 'qris';

    const pkg = getCreditPackage(packageCode);
    if (!pkg) {
      return NextResponse.json({ error: 'Paket tidak ditemukan' }, { status: 404 });
    }

    const reference = `KC-PKG-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);

    // Tanpa Mayar, transaksi tetap dicatat lokal dan konfirmasi lewat mode dev.
    const gatewayConfigured = isMayarConfigured();
    let payLink: string | null = null;
    let mayarPaymentId: string | null = null;

    if (gatewayConfigured) {
      try {
        const mayar = await createPaymentRequest({
          name: `KlipChip ${pkg.credits} kredit`,
          amount: pkg.priceIdr,
          email: user.email,
          description: `${pkg.credits} kredit KlipChip`,
          expiredAt: expiresAt,
          extraData: { reference, packageCode: pkg.code },
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
        clipId: null,
        packageCode: pkg.code,
        creditAmount: pkg.credits,
        amountIdr: pkg.priceIdr,
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
          packageCode: payment.packageCode,
          creditAmount: payment.creditAmount,
        },
        payLink,
        gatewayConfigured,
        expiresAt: expiresAt.toISOString(),
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal membuat pembelian paket';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}