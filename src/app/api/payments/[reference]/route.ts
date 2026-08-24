import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';

interface RouteContext {
  params: Promise<{ reference: string }>;
}

// GET /api/payments/[reference] — polling status pembayaran oleh klien
export async function GET(_req: NextRequest, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Belum masuk' }, { status: 401 });
  }

  const { reference } = await context.params;
  const payment = await prisma.payment.findUnique({
    where: { providerReference: reference },
  });

  if (!payment || payment.userId !== user.id) {
    return NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 });
  }

  return NextResponse.json({
    payment: {
      reference: payment.providerReference,
      status: payment.status,
      method: payment.method,
      amountIdr: payment.amountIdr,
      clipId: payment.clipId,
      paidAt: payment.paidAt?.toISOString() ?? null,
    },
  });
}
