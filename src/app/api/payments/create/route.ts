import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

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

function generateReference(): string {
  return `KC-PAY-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
}

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
    return {
      type: 'virtual_account',
      bank,
      vaNumber,
      expiresAt,
    };
  }

  return {
    type: 'ewallet',
    wallet: method.toUpperCase(),
    expiresAt,
  };
}

// POST /api/payments/create — buat transaksi pembayaran untuk sebuah klip
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
    const method = VALID_METHODS.includes(body.method) ? body.method : 'qris';

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
      if (clip.payment.status === 'pending') {
        const updated = await prisma.payment.update({
          where: { id: clip.payment.id },
          data: { method },
        });
        return NextResponse.json({
          payment: {
            reference: updated.providerReference,
            status: updated.status,
            method: updated.method,
            amountIdr: updated.amountIdr,
          },
          gateway: buildGatewayPayload(method, updated.providerReference, updated.amountIdr),
        });
      }
      // status failed/refunded → hapus agar bisa dibuat ulang
      await prisma.payment.delete({ where: { id: clip.payment.id } });
    }

    const reference = generateReference();
    const payment = await prisma.payment.create({
      data: {
        userId: user.id,
        clipId: clip.id,
        amountIdr: clip.priceIdr,
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
        },
        gateway: buildGatewayPayload(method, reference, clip.priceIdr),
      },
      { status: 201 }
    );
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gagal membuat pembayaran';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
