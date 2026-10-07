import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';
import { processPaymentWebhook } from '@/lib/payments';
import { fetchPaymentRequest, MayarError } from '@/lib/mayar';

interface RouteContext {
  params: Promise<{ reference: string }>;
}

// Usia minimal sebelum menelusuri ke Mayar. Webhook biasanya tiba dalam
// hitungan detik; jaring pengaman ini hanya menangkap kasus webhook hilang/lambat.
const RECONCILE_AFTER_MS = 30_000;

// Batas rekonsiliasi per user. Kuota Mayar 50 request/menit per API key dan
// dipakai bersama seluruh pengguna, jadi polling klien tidak boleh memanggil
// API gateway secara langsung.
const RECONCILE_WINDOW_MS = 60_000;

// GET /api/payments/[reference] — status pembayaran untuk klien
//
// Default hanya membaca database (gratis). Kalau masih pending dan sudah cukup
// lama, barulah satu panggilan ke API Mayar untuk memastikan webhook tidak hilang.
export async function GET(_req: NextRequest, context: RouteContext) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Belum masuk' }, { status: 401 });
  }

  const { reference } = await context.params;
  let payment = await prisma.payment.findUnique({
    where: { providerReference: reference },
  });

  if (!payment || payment.userId !== user.id) {
    return NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 });
  }

  let reconciled = false;
  const ageMs = Date.now() - payment.createdAt.getTime();
  const mayarId = payment.mayarPaymentId;

  if (payment.status === 'pending' && mayarId && ageMs >= RECONCILE_AFTER_MS) {
    if (checkRateLimit(`payments:reconcile:${user.id}`, 4, RECONCILE_WINDOW_MS)) {
      try {
        const detail = await fetchPaymentRequest(mayarId);
        reconciled = true;
        if (detail?.status === 'paid') {
          const applied = await processPaymentWebhook({
            reference: payment.providerReference,
            status: 'paid',
            paidAt: new Date().toISOString(),
          });
          if (applied.ok) {
            payment = await prisma.payment.findUnique({
              where: { providerReference: reference },
            });
          }
        }
      } catch (err) {
        // Status Mayar tidak bisa diambil: jawab dengan DB lokal apa adanya.
        console.error('[payments] rekonsiliasi Mayar gagal', {
          reference,
          message: err instanceof MayarError ? err.message : String(err),
        });
      }
    }
  }

  if (!payment) {
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
    reconciled,
  });
}