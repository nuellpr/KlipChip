// QA todo 2 — idempotensi refund terhadap dev.db sungguhan (fixture dibersihkan).
// Jalankan: node scripts/test/refund-idempotent.mjs
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { PrismaClient } from '@prisma/client';
import { refundFailedRender } from '../../src/lib/refund.ts';

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
let clip;
try {
  user = await prisma.user.create({
    data: {
      email: `qa-refund-${Date.now()}@test.local`,
      name: 'QA Refund',
      balanceClips: 2,
    },
  });
  clip = await prisma.clip.create({
    data: {
      userId: user.id,
      name: 'qa-refund',
      platform: 'youtube',
      sourceUrl: 'https://youtu.be/dQw4w9WgXcQ',
      videoTitle: 'QA Refund Video',
      channelName: 'QA Channel',
      startSeconds: 0,
      endSeconds: 10,
      duration: 10,
      status: 'processing',
    },
  });

  // Panggilan pertama → refund sukses
  const r1 = await refundFailedRender(clip.id, 'worker exit 1');
  assert.equal(r1.refunded, true, 'panggilan pertama harus refunded:true');
  const after1 = await prisma.user.findUnique({ where: { id: user.id } });
  assert.equal(after1.balanceClips, 3, 'saldo harus +1 (2→3)');
  const c1 = await prisma.clip.findUnique({ where: { id: clip.id } });
  assert.equal(c1.status, 'failed', 'status clip harus failed');
  assert.ok(
    c1.renderStep.includes('Saldo klip dikembalikan'),
    'renderStep harus menyebut refund'
  );

  // Panggilan kedua → guard anti dobel-refund
  const r2 = await refundFailedRender(clip.id, 'double call');
  assert.equal(r2.refunded, false, 'panggilan kedua harus refunded:false');
  const after2 = await prisma.user.findUnique({ where: { id: user.id } });
  assert.equal(after2.balanceClips, 3, 'saldo TIDAK boleh bertambah lagi');

  console.log('PASS refund-idempotent');
} finally {
  try {
    if (clip) await prisma.clip.deleteMany({ where: { id: clip.id } }); // cascade ClipJob
    if (user) await prisma.user.deleteMany({ where: { id: user.id } });
  } finally {
    await prisma.$disconnect();
  }
}
