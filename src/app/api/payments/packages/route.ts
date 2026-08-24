import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { getCreditPackage } from '@/lib/payments';

const VALID_METHODS = [
  'qris',
  'gopay',
  'ovo',
  'dana',
  'shopeepay',
  'bca_va',
  'mandiri_va',
  'bri_va',
  'bni_va',
];

function buildGatewayPayload(method: string, reference: string, amountIdr: number) {
  const expiresAt = new Date(Date.now() + 15 * 60 * 1000).toISOString();
  if (method === 'qris') {
    return {
      type: 'qris',
      qrString: `00020101021126580014ID.KLIPCHIP.WWW01189360000201100000000215${reference}053033605404${amountIdr}5802ID5915KLIPCHIP INDO6007JAKARTA62070703A016304X`,
      expiresAt,
    };
  }
  if (method.includes('_va')) {
    const bank = method.replace('_va', '').toUpperCase();
    const vaNumber = `8801${crypto.randomInt(100000000000, 999999999999)}`;
    return { type: 'virtual_account', bank, vaNumber, expiresAt };
  }
  return { type: 'ewallet', wallet: method.toUpperCase(), expiresAt };
}

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
    const method = VALID_METHODS.includes(body.method) ? body.method : 'qris';

    const pkg = getCreditPackage(packageCode);
    if (!pkg) {
      return NextResponse.json({ error: 'Paket tidak ditemukan' }, { status: 404 });
    }

    const reference = `KC-PKG-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
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
        gateway: buildGatewayPayload(method, reference, pkg.priceIdr),
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal membuat pembelian paket';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
