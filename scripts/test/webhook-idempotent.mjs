// QA — idempotensi processPaymentWebhook terhadap ci.db sungguhan.
// Menutup race saldo dobel pada top-up paket: webhook Mayar dan polling status
// (/api/payments/[reference]) bisa memanggil fungsi ini bersamaan. Kredit hanya
// boleh masuk sekali per pembayaran. (fixture dibersihkan sendiri)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { processPaymentWebhook } from '../../src/lib/payments.ts';

// Plain node tidak memuat .env — parse manual bila DATABASE_URL belum diset.
if (!process.env.DATABASE_URL) {
  const envPath = path.join(process.cwd(), '.env');
  if (fs.existsSync(envPath)) {
    for (const line of fs.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*DATABASE_URL\s*=\s*"?([^"\r\n]+)"?\s*$/);
      if (m) {
        process.env.DATABASE_URL = m[1];
        break;
      }
    }
  }
}

const prisma = new PrismaClient();
let user;
let payment;
try {
  user = await prisma.user.create({
    data: { email: `qa-wh-${Date.now()}@test.local`, name: 'QA Webhook', balanceClips: 0 },
  });
  payment = await prisma.payment.create({
    data: {
      userId: user.id,
      clipId: null,
      packageCode: 'starter',
      creditAmount: 15,
      amountIdr: 6000,
      method: 'qris',
      status: 'pending',
      providerReference: `KC-WHTEST-${Date.now()}`,
    },
  });

  // Pemanggilan pertama → kredit masuk sekali, pembayaran jadi paid.
  const r1 = await processPaymentWebhook({ reference: payment.providerReference, status: 'paid' });
  assert.equal(r1.ok, true);
  assert.equal(r1.alreadyProcessed, false);
  const after1 = await prisma.user.findUnique({ where: { id: user.id } });
  assert.equal(after1.balanceClips, 15, 'saldo harus +15 (0→15) pada pemanggilan pertama');
  const p1 = await prisma.payment.findUnique({ where: { id: payment.id } });
  assert.equal(p1.status, 'paid', 'pembayaran harus berstatus paid');

  // Pemanggilan kedua (webhook ganda / polling bersamaan) → TIDAK kredit lagi.
  const r2 = await processPaymentWebhook({ reference: payment.providerReference, status: 'paid' });
  assert.equal(r2.ok, true);
  assert.equal(r2.alreadyProcessed, true, 'pemanggilan kedua harus idempoten');
  const after2 = await prisma.user.findUnique({ where: { id: user.id } });
  assert.equal(after2.balanceClips, 15, 'saldo TIDAK boleh bertambah lagi');

  console.log('PASS webhook-idempotent');
} finally {
  try {
    if (payment) await prisma.payment.deleteMany({ where: { id: payment.id } });
    if (user) await prisma.user.deleteMany({ where: { id: user.id } });
  } finally {
    await prisma.$disconnect();
  }
}
