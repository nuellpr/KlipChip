# KlipChip — YouTube & Twitch ke Klip Vertikal 9:16

[![CI](https://github.com/nuellpr/KlipChip/actions/workflows/ci.yml/badge.svg)](https://github.com/nuellpr/KlipChip/actions/workflows/ci.yml)

Aplikasi web untuk mengubah video YouTube/Twitch menjadi klip pendek vertikal dengan auto-caption slang gaming Indonesia, deteksi highlight audio-spike & chat, dan pembayaran pay-per-clip.

> PRD lengkap: `klipchip.md`

## Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS
- **Database**: SQLite via Prisma 6 (siap migrasi ke PostgreSQL)
- **Auth**: Better Auth — session berbasis database (tabel `Session`), cookie httpOnly bertanda tangan. Email+password + Google OAuth.
- **Payments**: Mayar (Request Payment v2) — checkout di halaman Mayar, status masuk via webhook yang diverifikasi ulang ke API Mayar (HMAC webhook internal sudah dihapus, Mayar tidak menandatangani webhook)
- **Video**: Python worker (`scripts/clip_worker.py`) + `yt-dlp` + FFmpeg 7.1 (crop 9:16 + burn caption ASS karaoke)
- **AI**: OpenRouter (endpoint OpenAI-compatible) untuk skor highlight, terjemahan bilingual, dan ringkasan sosmed. Model default `apodex/apodex-1.1-mini:free`. Tanpa API key, semua fitur ini otomatis jatuh ke heuristik lokal.

## Prasyarat

- **Node.js dari `.nvmrc`** (versi 24) dan npm. Bukan Node 20: test suite meng-import file `.ts` langsung, yang butuh Node >= 23.6. `npm test` menolak jalan di versi lebih tua dengan pesan jelas.
- **Python 3.10+** (untuk worker *dan* test `test_*.py`). Wajib ada di PATH kalau mau menjalankan test Python; kalau tidak ada, runner melewatinya dan mencetat alasannya.
- FFmpeg: letakkan `ffmpeg.exe` di `bin/` (unduh dari [ffmpeg.org](https://ffmpeg.org/download.html)) atau pastikan `ffmpeg` ada di PATH. File biner tidak di-commit karena ukurannya besar.
- `yt-dlp` ter-install di Python: `pip install yt-dlp`

## Setup Cepat

```powershell
# 1. Install dependencies
npm install
pip install yt-dlp

# 2. Environment
copy .env.example .env
# Wajib diisi: DATABASE_URL, BETTER_AUTH_SECRET, BETTER_AUTH_URL.
# BETTER_AUTH_URL harus host yang dibuka browser -- kalau dev server di-tunnel
# (ngrok), isi dengan host ngrok, bukan localhost, kalau tidak sign-in/sign-out
# akan 403. Generate secret: openssl rand -base64 32

# 3. Database (SQLite)
npx prisma db push
npx prisma generate

# 4. Jalankan dev server
npm run dev
# Buka http://localhost:3000
```

## Build & Production

```powershell
npm run build   # produksi bundle (wajib 0 error)
npm start       # jalankan hasil build di http://localhost:3000
```

Cek kualitas (semuanya wajib 0 error, jalan di CI juga):

```powershell
npm run lint      # eslint .
npx tsc --noEmit  # typecheck
npm test          # suite QA scripts/test/
```

## Test

`scripts/test/*.mjs` menggunakan `node:assert`; `scripts/test/test_*.py` menggunakan
`assert` Python polos — keduanya tanpa test framework. `npm test` menjalankan semuanya
lewat `scripts/test/run.mjs` dan keluar non-zero kalau ada yang gagal.

```powershell
npm test           # 13 test, butuh DATABASE_URL saja (+ python kalau ada)
npm run test:e2e   # + 3 test yang butuh dev server (localhost:3100) dan/atau python+ffmpeg
```

Test yang butuh `.env` membaca `DATABASE_URL` langsung dari file itu, jadi tidak perlu set manual.
Beberapa test menulis fixture ke database lalu membersihkannya sendiri.
Test Python menguji `translate_lines` (batch/retry/degrade) dan `build_ass_file`
(bilingual `.ass`) — jalur yang tidak disentuh test `.mjs` mana pun.

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
| `/api/auth/[...all]` | GET/POST | Semua endpoint Better Auth (sign-up, sign-in, sign-out, get-session, callback Google) |
| `/api/auth/me` | GET / PATCH | User saat ini; PATCH ubah nama & avatar |
| `/api/extract-metadata` | POST | Metadata video + kandidat highlight (audio RMS asli) |
| `/api/clips` | GET / POST | List & buat klip |
| `/api/clips/[id]` | PATCH / DELETE | Update rating/status, hapus |
| `/api/clips/[id]/status` | GET | Polling status render |
| `/api/clips/[id]/download` | GET | Unduh file (hanya pemilik & completed) |
| `/api/render-clip` | POST | Antrekan job render (diproses proses `npm run worker`) |
| `/api/payments/packages` | POST | Ambil paket kredit |
| `/api/payments/create` | POST | Buat payment request di Mayar, kembalikan link checkout |
| `/api/payments/webhook` | POST | Webhook Mayar (`payment.received`) — konfirmasi ulang ke API Mayar sebelum mengcredited |
| `/api/payments/simulate` | POST | Konfirmasi lokal tanpa Mayar (dev only, 404 di production) |
| `/api/payments/[reference]` | GET | Polling status |
| `/api/payments/use-credit` | POST | Pakai saldo kredit |
| `/api/admin/stats` | GET | Statistik admin |

## Keamanan

- Session cookie httpOnly + HMAC, masa berlaku 30 hari
- Webhook Mayar **tidak ditandatangani** (docs resmi tidak menyebut header signature), jadi `/api/payments/webhook` memperlakukan body sebagai petunjuk kandidat saja dan selalu mengonfirmasi status lewat `GET /hl/v2/payments/{id}` dengan API token sebelum kredit diberikan. Route tidak lagi mempercayai payload webhook apa adanya.
- Rate limit: 30 clip/jam, 20 payment/jam, 10 render/jam per user
- Polling status pembayaran hanya menyentuh database; panggilan ke API Mayar dijaga 4×/menit/user karena kuota gateway 50 request/menit per API key.
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
src/lib/auth.ts        # Better Auth server instance + getCurrentUser()
src/lib/payments.ts    # sign/verify webhook
src/lib/clips.ts       # serializer Clip → ClipProject
src/components/auth-gate.tsx
```

## Catatan

- `cookies.txt` (untuk video privat/age-restricted) diletakkan di root dan otomatis di-ignore git.
- Untuk PostgreSQL produksi, ganti `DATABASE_URL` ke `postgresql://...` dan `npx prisma db push`.
- Deteksi **audio spike** memakai RMS envelope asli dari audio yang diunduh. Deteksi **chat velocity** masih *estimasi* dari kepadatan kata transcript (`buildChatVelocity` di `src/lib/transcript-analysis.ts`), bukan data chat asli.
- Konfigurasi AI terpusat di `src/lib/ai-provider.ts`. Nama env lama (`FORGE_API_KEY`, `FORGE_BASE_URL`, `FORGE_MODEL`) masih diterima sebagai cadangan, jadi `.env` yang sudah ada tidak perlu diedit.
- `apodex/apodex-1.1-mini:free` adalah model **reasoning-first**: pengukuran pertama memakai ~1000 token hanya untuk berpikir. Kalau sering kena `finish_reason=length` (JSON terpotong), ganti `MODEL_NAME` ke model yang lebih ringan atau persingkat prompt.
- Pembayaran memakai **Mayar Request Payment v2**. Kalau `MAYAR_API_KEY` belum diisi atau ditolak Mayar (401/403), checkout otomatis jatuh ke jalur konfirmasi lokal — jadi demo lokal tetap jalan tanpa kredensial. Di production kredensial salah akan **gagal keras**, bukan diam-diam memberi klip gratis.

## Catatan Produksi (Single VPS)

Proses yang harus idup ada dua: **web** (`next start`) dan **worker** (`npm run worker`). Karena
butuh dua proses, cara paling ringan pakai pm2:

```bash
npm ci --omit=dev          # atau npm ci lalu npm run build
npm run build
mkdir -p storage/logs      # tempat pm2 menulis log
cp .env.example .env       # lalu isi MAYAR_API_KEY / OPENROUTER_API_KEY dll
npx prisma db push         # skema database
pm2 start ecosystem.config.cjs
pm2 save                   # hidup lagi setelah reboot
pm2 startup                # sekali saja, ikuti instruksi yang dicetak
pm2 logs klipchip-worker   # pantau worker
```

`ecosystem.config.cjs` mengunci worker di **1 instance** (`exec_mode: fork`) — klaim job memakai
SQLite, jadi scale worker hanya membuat dua proses berebut job yang sama. Kalau butuh multi-worker,
pindah dulu ke PostgreSQL dan ubah klaim job ke `SELECT ... FOR UPDATE SKIP LOCKED`.

- (b) Rate limiter masih in-memory → valid untuk satu instance; ganti ke Redis jika web dijalankan multi-instance.
- (c) cookies.txt bersifat global & kedaluwarsa → perbarui manual saat YouTube mulai menolak render.
- (d) Retensi storage: file hasil render lebih tua dari RETENTION_DAYS hari (default 7) dihapus otomatis oleh worker.
- (e) Jika web dan worker dipisah host, migrasi SQLite → PostgreSQL WAJIB dilakukan dulu (SQLite tidak mendukung akses lintas mesin).
- (f) Worker mengaktifkan WAL mode SQLite saat start secara otomatis (mengurangi SQLITE_BUSY antara webapp dan worker).
