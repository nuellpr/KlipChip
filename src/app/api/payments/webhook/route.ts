import { NextRequest, NextResponse } from 'next/server';
import {
  processPaymentWebhook,
  verifyWebhookSignature,
  PaymentWebhookPayload,
} from '@/lib/payments';

// POST /api/payments/webhook — dipanggil oleh payment gateway
// Wajib menyertakan header x-klipchip-signature (HMAC-SHA256 dari raw body)
export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get('x-klipchip-signature');

  if (!verifyWebhookSignature(rawBody, signature)) {
    return NextResponse.json({ error: 'Signature tidak valid' }, { status: 401 });
  }

  let payload: PaymentWebhookPayload;
  try {
    payload = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: 'Payload bukan JSON valid' }, { status: 400 });
  }

  if (!payload.reference || !['paid', 'failed'].includes(payload.status)) {
    return NextResponse.json({ error: 'Payload webhook tidak lengkap' }, { status: 400 });
  }

  const result = await processPaymentWebhook(payload);

  if (!result.ok) {
    return NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 });
  }

  return NextResponse.json({
    received: true,
    alreadyProcessed: result.alreadyProcessed ?? false,
    status: result.payment.status,
  });
}
