# KlipChip — YouTube & Twitch ke Klip Vertikal 9:16

Aplikasi web untuk mengubah video YouTube/Twitch menjadi klip pendek vertikal dengan auto-caption slang gaming Indonesia, deteksi highlight audio-spike & chat, dan pembayaran pay-per-clip.

> PRD lengkap: `klipchip.md`

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Database**: SQLite via Prisma 6 (siap migrasi ke PostgreSQL)
- **Auth**: Session cookie httpOnly HMAC-SHA256 (magic-link / Google placeholder)
- **Payments**: API pay-per-clip dengan webhook HMAC-SHA256 terverifikasi (QRIS / E-Wallet / VA)
- **Video**: Python worker (`scripts/clip_worker.py`) + `yt-dlp` + FFmpeg 7.1 (crop 9:16 + burn caption ASS karaoke)

## Prasyarat

- Node.js 20+ dan npm
- Python 3.10+ (untuk worker)
- FFmpeg: letakkan `ffmpeg.exe` di `bin/` (unduh dari [ffmpeg.org](https://ffmpeg.org/download.html)) atau pastikan `ffmpeg` ada di PATH. File biner tidak di-commit karena ukurannya besar.
- `yt-dlp` ter-install di Python: `pip install yt-dlp`

## Setup Cepat

```powershell
# 1. Install dependencies
npm install
pip install yt-dlp

# 2. Environment
copy .env.example .env
# Isi DATABASE_URL (default: file:D:/KlipChip/prisma/dev.db sudah benar untuk lokal)
# AUTH_SECRET dan PAYMENT_WEBHOOK_SECRET bebas string random

# 3. Database (SQLite)
npx prisma db push
npx prisma generate

# 4. Jalankan dev server
npm run dev
# Buka http://localhost:3000
```

## Build & Production

```powershell
npm run build   # lint + typecheck + build (wajib 0 error)
npm start       # jalankan hasil build di http://localhost:3000
```

Lint terpisah:

```powershell
npx eslint src
npx tsc --noEmit
```

## Alur Penggunaan (5 Langkah Studio)

1. **Sumber Video** — tempel URL YouTube/Twitch atau upload file lokal
2. **Highlight AI** — pilih rekomendasi audio-spike & chat-velocity (atau input manual 5–180 detik)
3. **Editor 9:16** — preview vertikal, koreksi teks caption, pilih gaya (hormozi/neon/clean/punchy), posisi & warna
4. **Checkout** — pilih QRIS / E-Wallet / VA, bayar Rp 5.000 (webhook terverifikasi HMAC, simulate gateway di dev)
5. **Render & Unduh** — FFmpeg memotong, crop 9:16 (1080×1920), burn caption ASS karaoke, unduh via endpoint terproteksi; rating caption setelah unduh

Dashboard (`/dashboard`) menampilkan riwayat klip, status render, invoice, retry, dan hapus — semua persisten di database per akun.

## Struktur API

| Endpoint | Method | Deskripsi |
|---|---|---|
| `/api/auth/login` | POST | Login / daftar dengan email |
| `/api/auth/logout` | POST | Hapus session |
| `/api/auth/me` | GET | User saat ini |
| `/api/extract-metadata` | POST | Ambil metadata YouTube (oEmbed) + highlight mock |
| `/api/clips` | GET / POST | List & buat klip |
| `/api/clips/[id]` | PATCH / DELETE | Update rating/status, hapus |
| `/api/clips/[id]/download` | GET | Unduh file (hanya pemilik & completed) |
| `/api/payments/create` | POST | Buat transaksi pending |
| `/api/payments/webhook` | POST | Webhook gateway (verifikasi HMAC) |
| `/api/payments/simulate` | POST | Simulasi gateway (dev only) |
| `/api/payments/[reference]` | GET | Polling status |
| `/api/render-clip` | POST | Render final via Python worker |

## Keamanan

- Session cookie httpOnly + HMAC, masa berlaku 30 hari
- Webhook pembayaran verifikasi `x-klipchip-signature` (HMAC-SHA256 raw body)
- Rate limit: 30 clip/jam, 20 payment/jam, 10 render/jam per user
- Download terproteksi: cek pemilik + status `completed` + file ada
- Validasi durasi klip 5–180 detik, sanitasi URL untuk cegah SSRF

## Worker Video

`scripts/clip_worker.py` menerima 6 arg: `url startSec endSec outputPath [cookiesPath] [jobJsonPath]`

- `jobJsonPath` berisi `{ captions, captionConfig }` → dibakar menjadi `.ass` (ASS karaoke per kata untuk gaya `hormozi`)
- FFmpeg filter: `crop=ih*9/16:ih:(iw-ih*9/16)/2:0,scale=1080:1920:flags=lanczos,setsar=1,subtitles=cap.ass`

## Direktori Penting

```
prisma/schema.prisma   # model User, Clip, Payment
storage/               # hasil render (gitignored)
storage/jobs/          # job JSON sementara
src/lib/auth.ts        # session HMAC
src/lib/payments.ts    # sign/verify webhook
src/lib/clips.ts       # serializer Clip → ClipProject
src/components/auth-gate.tsx
```

## Catatan

- `cookies.txt` (untuk video privat/age-restricted) diletakkan di root dan otomatis di-ignore git.
- Untuk PostgreSQL produksi, ganti `DATABASE_URL` ke `postgresql://...` dan `npx prisma db push`.
