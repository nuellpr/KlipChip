# Ide yang Bisa Dicuri

Sumber: [op7418/Youtube-clipper-skill](https://github.com/op7418/Youtube-clipper-skill) (2.2k★, skill Claude Code: yt-dlp → AI semantic chapters → FFmpeg clip → subtitle bilingual burn-in).

## 1. Subtitle bilingual + burn-in ⭐ paling bernilai
- **Apa**: translate SRT klip ke dua bahasa (format dua baris per cue), lalu hardcode ke video via filter FFmpeg `subtitles=`.
- **Di KlipChip**: extend `scripts/render-runner.mjs` — step tambahan setelah clip utama; output `<nama>_bilingual.srt` + `<nama>_sub.mp4`. Toggle di `src/components/studio/step-render-export.tsx`, field di schema Clip.
- **Prasyarat**: FFmpeg build dengan libass. Verifikasi dulu: `ffmpeg -filters 2>&1 | grep subtitles` — kosong = fitur tidak bisa jalan di mesin user.

## 2. Batch translation (pola teknis untuk #1)
- Translate **20–25 baris SRT per request**, bukan 1 baris per request → hemat ~95% panggilan forge API, lebih konsisten hasilnya.
- Terapkan sebagai helper `translateSrtBatch()` (mis. di `src/lib/`) kalau #1 dikerjakan.

## 3. Auto-summary konten sosmed per klip
- **Apa**: dari transkrip klip, AI generate caption siap-post (gaya Xiaohongshu/Douyin/X).
- **Di KlipChip**: murah — satu call forge tambahan di pipeline (`highlight-ai.ts` atau saat enqueue), tampilkan di dashboard/download page sebagai teks copy-paste.

## 4. Chapter semantik dari transkrip
- Sudah sejiwa dengan `highlight-ai.ts` kita (AI pilih segmen berdasar makna). Tidak ada yang perlu dicuri — hanya konfirmasi pendekatan kita benar.

## Yang TIDAK dicuri
- yt-dlp sebagai engine download (berat, area abu-abu ToS; url-guard + stream langsung kita lebih ketat).
- Model "skill CLI lokal" — KlipChip adalah web app multi-user dengan antrean render.

---
Urutan sarannya: #1 (+#2) → #3. #1 butuh verifikasi libass dulu sebelum dikomitmkan ke user.
