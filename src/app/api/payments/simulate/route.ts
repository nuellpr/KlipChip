import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { processPaymentWebhook } from '@/lib/payments';

// POST /api/payments/simulate — simulasi gateway pembayaran (HANYA development).
// Menjalankan jalur webhook lengkap: payload ditandatangani lalu diverifikasi,
// persis seperti gateway asli memanggil /api/payments/webhook.
export async function POST(req: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Endpoint tidak tersedia' }, { status: 404 });
  }

  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Belum masuk' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const reference = typeof body.reference === 'string' ? body.reference : '';
    const status = body.status === 'failed' ? 'failed' : 'paid';

    if (!reference) {
      return NextResponse.json({ error: 'Reference wajib diisi' }, { status: 400 });
    }

    // Hanya pemilik transaksi yang boleh mengonfirmasinya — reference milik
    // user lain tidak boleh dibayarkan lewat endpoint ini.
    const payment = await prisma.payment.findUnique({
      where: { providerReference: reference },
    });
    if (!payment || payment.userId !== user.id) {
      return NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 });
    }

    const result = await processPaymentWebhook({
      reference,
      status: status as 'paid' | 'failed',
      paidAt: new Date().toISOString(),
    });

    if (!result.ok) {
      return NextResponse.json({ error: 'Transaksi tidak ditemukan' }, { status: 404 });
    }

    return NextResponse.json({
      received: true,
      status: result.payment.status,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Simulasi gagal';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
