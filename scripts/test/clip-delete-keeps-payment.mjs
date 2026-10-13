// QA — menghapus klip tidak boleh menghapus catatan pembayaran berbayar:
// admin stats menghitung revenue dari tabel Payment. Route DELETE melepas
// (clipId=null) pembayaran berstatus 'paid' sebelum menghapus klip; cascade
// hanya menyapu pembayaran tak bernilai (pending/failed). (fixture dibersihkan sendiri)
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';

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
let paidClip, paidPayment;
let pendingClip, pendingPayment;
try {
  user = await prisma.user.create({
    data: { email: `qa-del-${Date.now()}@test.local`, name: 'QA Delete', balanceClips: 0 },
  });
  paidClip = await prisma.clip.create({
    data: {
      userId: user.id, name: 'paid clip', platform: 'youtube', sourceUrl: 'https://youtu.be/x',
      videoTitle: 't', channelName: 'c', startSeconds: 0, endSeconds: 1, duration: 1, status: 'completed',
    },
  });
  paidPayment = await prisma.payment.create({
    data: {
      userId: user.id, clipId: paidClip.id, amountIdr: 500, method: 'credit', status: 'paid',
      providerReference: `KC-DEL-PAID-${Date.now()}`, paidAt: new Date(),
    },
  });
  pendingClip = await prisma.clip.create({
    data: {
      userId: user.id, name: 'pending clip', platform: 'youtube', sourceUrl: 'https://youtu.be/y',
      videoTitle: 't', channelName: 'c', startSeconds: 0, endSeconds: 1, duration: 1, status: 'preview',
    },
  });
  pendingPayment = await prisma.payment.create({
    data: {
      userId: user.id, clipId: pendingClip.id, amountIdr: 500, method: 'qris', status: 'pending',
      providerReference: `KC-DEL-PEND-${Date.now()}`,
    },
  });

  // Tiru urutan route DELETE untuk klip berbayar: lepas pembayaran PAID dulu.
  const clipWithPayment = await prisma.clip.findUnique({ where: { id: paidClip.id }, include: { payment: true } });
  if (clipWithPayment.payment?.status === 'paid') {
    await prisma.payment.update({ where: { id: clipWithPayment.payment.id }, data: { clipId: null } });
  }
  await prisma.clip.delete({ where: { id: paidClip.id } });

  // Klip belum bayar: tak dilepas → pembayaran pending ikut terhapus cascade.
  await prisma.clip.delete({ where: { id: pendingClip.id } });

  const survivor = await prisma.payment.findUnique({ where: { id: paidPayment.id } });
  assert.ok(survivor, 'pembayaran paid TIDAK boleh hilang saat klip dihapus');
  assert.equal(survivor.status, 'paid', 'pembayaran paid tetap berstatus paid (revenue aman)');
  assert.equal(survivor.clipId, null, 'pembayaran paid dilepas dari klip (clipId null)');

  const gone = await prisma.payment.findUnique({ where: { id: pendingPayment.id } });
  assert.equal(gone, null, 'pembayaran pending ikut terhapus bersama klip (tak ada revenue)');

  console.log('PASS clip-delete-keeps-payment');
} finally {
  try {
    if (paidPayment) await prisma.payment.deleteMany({ where: { id: paidPayment.id } });
    if (pendingPayment) await prisma.payment.deleteMany({ where: { id: pendingPayment.id } });
    if (paidClip) await prisma.clip.deleteMany({ where: { id: paidClip.id } });
    if (pendingClip) await prisma.clip.deleteMany({ where: { id: pendingClip.id } });
    if (user) await prisma.user.deleteMany({ where: { id: user.id } });
  } finally {
    await prisma.$disconnect();
  }
}
