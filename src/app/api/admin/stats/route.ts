import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAdmin } from '@/lib/admin';

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: 'Akses admin diperlukan' }, { status: 403 });

  const [users, clips, payments] = await Promise.all([
    prisma.user.findMany({ orderBy: { createdAt: 'desc' } }),
    prisma.clip.findMany({ include: { payment: true }, orderBy: { createdAt: 'desc' }, take: 100 }),
    prisma.payment.findMany({ orderBy: { createdAt: 'desc' }, take: 100 }),
  ]);

  const totalRevenue = payments.filter((p) => p.status === 'paid').reduce((s, p) => s + p.amountIdr, 0);

  return NextResponse.json({
    stats: {
      totalUsers: users.length,
      totalClips: clips.length,
      completedClips: clips.filter((c) => c.status === 'completed').length,
      totalRevenue,
      pendingPayments: payments.filter((p) => p.status === 'pending').length,
    },
    users: users.map((u) => ({ id: u.id, email: u.email, name: u.name, role: u.role, balanceClips: u.balanceClips, provider: u.provider, createdAt: u.createdAt.toISOString() })),
    clips: clips.map((c) => ({
      id: c.id,
      name: c.name,
      userId: c.userId,
      status: c.status,
      priceIdr: c.priceIdr,
      createdAt: c.createdAt.toISOString(),
      paymentId: c.payment?.providerReference || null,
    })),
    payments: payments.map((p) => ({
      id: p.id,
      reference: p.providerReference,
      status: p.status,
      amountIdr: p.amountIdr,
      method: p.method,
      clipId: p.clipId,
      createdAt: p.createdAt.toISOString(),
    })),
  });
}
