import { NextRequest, NextResponse } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import { prisma } from '@/lib/prisma';
import { getCurrentUser } from '@/lib/auth';
import { checkRateLimit } from '@/lib/rate-limit';

export const maxDuration = 300; // render bisa memakan waktu beberapa menit

// POST /api/render-clip — render final klip yang sudah dibayar via Python worker
export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: 'Belum masuk' }, { status: 401 });
  }

  if (!checkRateLimit(`render:${user.id}`, 10, 60 * 60 * 1000)) {
    return NextResponse.json(
      { error: 'Batas render per jam tercapai. Coba lagi nanti.' },
      { status: 429 }
    );
  }

  try {
    const body = await req.json();
    const clipId = typeof body.clipId === 'string' ? body.clipId : '';

    const clip = await prisma.clip.findUnique({
      where: { id: clipId },
      include: { payment: true },
    });

    if (!clip || clip.userId !== user.id) {
      return NextResponse.json({ error: 'Klip tidak ditemukan' }, { status: 404 });
    }

    const storageDir = path.join(process.cwd(), 'storage');

    // Idempotent: klip sudah selesai dan file masih ada
    if (clip.status === 'completed' && clip.outputFilename) {
      const existingPath = path.join(storageDir, path.basename(clip.outputFilename));
      if (fs.existsSync(existingPath)) {
        return NextResponse.json({
          success: true,
          alreadyRendered: true,
          downloadUrl: `/api/clips/${clip.id}/download`,
          sizeBytes: fs.statSync(existingPath).size,
        });
      }
    }

    // Wajib sudah dibayar (webhook pembayaran mengubah status menjadi paid)
    if (clip.payment?.status !== 'paid') {
      return NextResponse.json(
        { error: 'Klip belum dibayar. Selesaikan pembayaran terlebih dahulu.' },
        { status: 402 }
      );
    }

    if (!clip.sourceUrl.startsWith('http')) {
      return NextResponse.json(
        { error: 'Sumber video bukan URL yang dapat dirender oleh server' },
        { status: 400 }
      );
    }

    await prisma.clip.update({
      where: { id: clip.id },
      data: {
        status: 'processing',
        renderProgress: 25,
        renderStep: 'Memotong segmen video (FFmpeg Trimming)...',
      },
    });

    fs.mkdirSync(storageDir, { recursive: true });
    const jobsDir = path.join(storageDir, 'jobs');
    fs.mkdirSync(jobsDir, { recursive: true });

    const outputFilename = `klipchip_${clip.id}_9x16.mp4`;
    const outputPath = path.join(storageDir, outputFilename);
    const jobPath = path.join(jobsDir, `${clip.id}.json`);

    let captions: unknown[] = [];
    let captionConfig: Record<string, unknown> = {};
    try {
      const parsed = JSON.parse(clip.captionsJson || '[]');
      if (Array.isArray(parsed)) captions = parsed;
    } catch {
      captions = [];
    }
    try {
      captionConfig = JSON.parse(clip.captionConfigJson || '{}');
    } catch {
      captionConfig = {};
    }

    fs.writeFileSync(
      jobPath,
      JSON.stringify({
        captions,
        captionConfig,
        startSeconds: clip.startSeconds,
        endSeconds: clip.endSeconds,
        language: clip.language,
        layout: clip.layout,
        subtitleSource: clip.subtitleSource,
      }),
      'utf8'
    );

    const cookiesPath = path.join(process.cwd(), 'cookies.txt');
    const workerScript = path.join(process.cwd(), 'scripts', 'clip_worker.py');

    const args = [
      workerScript,
      clip.sourceUrl,
      clip.startSeconds.toString(),
      clip.endSeconds.toString(),
      outputPath,
      fs.existsSync(cookiesPath) ? cookiesPath : '',
      jobPath,
    ];

    console.log(`[API /api/render-clip] Render klip ${clip.id} oleh user ${user.id}`);

    return await new Promise<NextResponse>((resolve) => {
      const child = spawn('python', args, { cwd: process.cwd() });

      let stderrData = '';

      child.stdout.on('data', (data) => {
        console.log(`[Worker STDOUT]: ${data}`);
      });

      child.stderr.on('data', (data) => {
        stderrData += data.toString();
        console.log(`[Worker STDERR]: ${data}`);
      });

      child.on('close', async (code) => {
        try {
          if (code === 0 && fs.existsSync(outputPath)) {
            await prisma.clip.update({
              where: { id: clip.id },
              data: {
                status: 'completed',
                renderProgress: 100,
                renderStep: 'Render selesai! File MP4 1080x1920 siap diunduh.',
                outputFilename,
                completedAt: new Date(),
              },
            });
            resolve(
              NextResponse.json({
                success: true,
                downloadUrl: `/api/clips/${clip.id}/download`,
                sizeBytes: fs.statSync(outputPath).size,
              })
            );
          } else {
            // Render gagal setelah pembayaran → kembalikan saldo otomatis (sesuai PRD)
            const errMsg = (stderrData || 'Worker gagal memproses video').slice(0, 280);
            await prisma.$transaction([
              prisma.clip.update({
                where: { id: clip.id },
                data: {
                  status: 'failed',
                  renderProgress: 0,
                  renderStep: `Render gagal: ${errMsg}. Saldo klip telah dikembalikan.`,
                },
              }),
              prisma.user.update({
                where: { id: user.id },
                data: { balanceClips: { increment: 1 } },
              }),
            ]);
            resolve(
              NextResponse.json({
                success: false,
                refunded: true,
                error: errMsg,
              })
            );
          }
        } catch (dbErr) {
          console.error('DB update error after worker close:', dbErr);
          resolve(
            NextResponse.json(
              { success: false, error: 'Gagal memperbarui status klip' },
              { status: 500 }
            )
          );
        }
      });

      child.on('error', async (err) => {
        console.error('Failed to spawn python worker:', err);
        try {
          await prisma.$transaction([
            prisma.clip.update({
              where: { id: clip.id },
              data: {
                status: 'failed',
                renderStep: 'Python worker tidak dapat dijalankan. Saldo klip dikembalikan.',
              },
            }),
            prisma.user.update({
              where: { id: user.id },
              data: { balanceClips: { increment: 1 } },
            }),
          ]);
        } catch (dbErr) {
          console.error('DB update error after spawn error:', dbErr);
        }
        resolve(
          NextResponse.json({
            success: false,
            refunded: true,
            error: err.message,
          })
        );
      });
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Server error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
