import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Heart, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-zinc-950/80 pt-12 pb-8 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/klipchip-logo.svg" alt="Logo KlipChip" className="h-9 w-9" />
              <div className="flex flex-col">
                <span className="text-lg font-bold text-white tracking-tight leading-tight">
                  Klip<span className="text-cyan-400">Chip</span>
                </span>
                <span className="text-[9px] text-zinc-500 font-medium">Livestream-to-Clip AI</span>
              </div>
            </div>
            <p className="text-xs leading-relaxed text-zinc-400">
              Platform highlight AI & auto-caption slang gaming Indonesia tercepat untuk YouTube dan Twitch livestream. Siap dipublikasikan ke Shorts, Reels, dan TikTok dalam hitungan menit.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-300 bg-brand-500/10 border border-brand-500/20 px-3 py-1.5 rounded-lg w-fit">
              <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
              <span>Dibuat khusus untuk Kreator Indonesia 🇮🇩</span>
            </div>
          </div>

          {/* Col 2: Fitur Utama */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Fitur Utama</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/studio" className="hover:text-brand-400 transition-colors">
                  Deteksi Highlight Audio Spike
                </Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-brand-400 transition-colors">
                  Analisis Lonjakan Chat Stream
                </Link>
              </li>
              <li>
                <Link href="/dictionary" className="hover:text-brand-400 transition-colors">
                  Auto-Caption Slang Gaming Indo
                </Link>
              </li>
              <li>
                <Link href="/studio" className="hover:text-brand-400 transition-colors">
                  Crop Vertikal 9:16 Otomatis
                </Link>
              </li>
              <li>
                <Link href="/pricing" className="hover:text-brand-400 transition-colors">
                  Pembayaran Per Clip (QRIS)
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Sumber & Komunitas */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Kamus & Kategori</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/dictionary?cat=fivem" className="hover:text-brand-400 transition-colors">
                  Slang GTA V / FiveM Roleplay
                </Link>
              </li>
              <li>
                <Link href="/dictionary?cat=minecraft" className="hover:text-brand-400 transition-colors">
                  Istilah Minecraft Hardcore & Clutch
                </Link>
              </li>
              <li>
                <Link href="/dictionary?cat=mlbb" className="hover:text-brand-400 transition-colors">
                  Mobile Legends Lord Steal & Retri
                </Link>
              </li>
              <li>
                <Link href="/dictionary?cat=valo" className="hover:text-brand-400 transition-colors">
                  Valorant Radiant Clutch Slang
                </Link>
              </li>
              <li>
                <Link href="/dictionary" className="hover:text-brand-400 transition-colors">
                  Ajukan Kata Slang Baru
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Keamanan & Legal */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white tracking-wider uppercase">Keamanan & Layanan</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center gap-1.5 text-zinc-300">
                <ShieldCheck className="h-4 w-4 text-emerald-400" />
                <span>QRIS, GoPay & VA Terverifikasi</span>
              </div>
              <p className="text-[11px] text-zinc-500 leading-normal">
                KlipChip memproses sumber video legal sesuai lisensi kreator. Tidak mengunduh konten berbayar atau terproteksi hak cipta tanpa izin.
              </p>
              <div className="pt-2 text-[11px] text-zinc-500">
                <span>Target Waktu Render: &lt; 3 Menit</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between border-t border-white/10 pt-6 text-xs text-zinc-500">
          <p>© 2026 KlipChip Indonesia. All rights reserved. Sesuai PRD KlipChip MVP.</p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span className="flex items-center gap-1">
              Made with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> for Indonesian Creators
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
