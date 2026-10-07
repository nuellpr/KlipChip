import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { processPaymentWebhook } from '@/lib/payments';
import { fetchPaymentRequest, MayarError } from '@/lib/mayar';

// Batas pencarian kandidat. Mayar tidak menandatangani webhook (docs tidak
// menyebut header signature sama sekali), jadi isi body diperlakukan sebagai
// petunjuk saja -- kebenaran selalu dicek ulang ke API Mayar.
const MAX_CANDIDATES = 5;

/**
 * Terjemahkan payload webhook Mayar menjadi daftar kandidat pembayaran lokal.
 * Docs: https://docs.mayar.id/integration/webhook
 * Field yang dipakai: data.customerEmail, data.amount, data.status
 */
function extractCandidates(payload: unknown): { email: string | null; amountIdr: number | null }[] {
  if (!payload || typeof payload !== 'object') return [];
  const data = (payload as { data?: Record<string, unknown> }).data;
  if (!data || typeof data !== 'object') return [];

  const email = typeof data.customerEmail === 'string' ? data.customerEmail.toLowerCase() : null;
  const amountIdr = typeof data.amount === 'number' ? Math.round(data.amount) : null;
  if (!email && !amountIdr) return [];
  return [{ email, amountIdr }];
}

// POST /api/payments/webhook — dipanggil oleh Mayar saat payment.received
//
// Keamanan: Mayar tidak menyediakan signature/HMAC untuk webhook. Kalau payload
// dipercaya apa adanya, siapa pun yang tahu URL bisa kredit klip gratis. Jadi
// route ini hanya memakai body sebagai PETUNJUK kandidat, lalu mengonfirmasi ke
// API Mayar (server-to-server, pakai API token) sebelum mengubah status.
export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return NextResponse.json({ error: 'Payload bukan JSON valid' }, { status: 400 });
  }

  const candidates = extractCandidates(payload);
  if (!candidates.length) {
    return NextResponse.json({ received: true, matched: false, reason: 'no_usable_fields' });
  }

  const pending = await prisma.payment.findMany({
    where: {
      status: 'pending',
      mayarPaymentId: { not: null },
      ...(candidates[0].email ? { user: { email: candidates[0].email } } : {}),
      ...(candidates[0].amountIdr ? { amountIdr: candidates[0].amountIdr } : {}),
    },
    include: { clip: true },
    orderBy: { createdAt: 'desc' },
    take: MAX_CANDIDATES,
  });

  if (!pending.length) {
    return NextResponse.json({ received: true, matched: false, reason: 'no_local_candidate' });
  }

  const results: { reference: string; status: string; confirmed: boolean }[] = [];

  for (const payment of pending) {
    let confirmedStatus = 'unknown';
    try {
      const detail = await fetchPaymentRequest(payment.mayarPaymentId as string);
      if (detail) confirmedStatus = detail.status;
    } catch (err) {
      // Mayar tidak bisa dihubungi: jangan menebak, tandai belum terkonfirmasi.
      console.error('[webhook] gagal verifikasi ke Mayar', {
        reference: payment.providerReference,
        message: err instanceof MayarError ? err.message : String(err),
      });
      results.push({ reference: payment.providerReference, status: 'verify_failed', confirmed: false });
      continue;
    }

    if (confirmedStatus !== 'paid') {
      results.push({ reference: payment.providerReference, status: confirmedStatus, confirmed: false });
      continue;
    }

    // Terverifikasi di Mayar -> baru crewkan status lokal (idempotent).
    const result = await processPaymentWebhook({
      reference: payment.providerReference,
      status: 'paid',
      paidAt: new Date().toISOString(),
    });
    results.push({
      reference: payment.providerReference,
      status: result.ok ? (result.payment?.status ?? 'paid') : 'failed_to_apply',
      confirmed: result.ok,
    });
  }

  const matched = results.some((r) => r.confirmed);
  return NextResponse.json({ received: true, matched, results });
}