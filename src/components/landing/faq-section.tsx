'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { Reveal } from '@/components/motion/reveal';

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Bagaimana cara kerja deteksi highlight audio spike dan reaksi penonton?',
      a: 'Skor audio spike memakai lapisan gelombang audio ASLI dari video sumber, sehingga perubahan energi loudness yang mendadak (teriakan, tawa heboh, ledakan in-game) terdeteksi langsung. Sementara itu, layar reaksi penonton adalah ESTIMASI dari kepadatan kata transkrip otomatis — bukan data chat livestream sungguhan. Kombinasi keduanya memberi skor relevansi momen viral.',
    },
    {
      q: 'Apakah auto-caption benar-benar mengenali istilah gaul gaming Indonesia?',
      a: 'Ya! Kami menyematkan kamus normalisasi khusus slang Indonesia seperti "bjir", "ggwp", "rata lu", "bocil kematian", "water bucket clutch", "fail rp", dan "retri indomaret". Jika ada kata baru dari komunitas Anda, Anda juga dapat mengeditnya langsung di preview editor atau menambahkannya ke kamus slang.',
    },
    {
      q: 'Apakah saya bisa mencoba dan melihat preview sebelum membayar?',
      a: 'Tentu! Anda dapat memasukkan URL, memilih timestamp atau rekomendasi AI, melihat transkripsi caption dan preview vertikal secara gratis. Pembayaran Rp 5.000 hanya dilakukan saat Anda ingin merender dan mengunduh video final 1080x1920 tanpa watermark.',
    },
    {
      q: 'Metode pembayaran apa saja yang didukung untuk Pay-Per-Clip?',
      a: 'Kami mendukung QRIS (bisa discan dengan BCA, Mandiri, BRI, BNI, GoPay, OVO, DANA, LinkAja, ShopeePay) serta Virtual Account bank-bank besar di Indonesia. Konfirmasi pembayaran diverifikasi secara instan via webhook otomatis.',
    },
    {
      q: 'Bagaimana jika proses render gagal setelah saya membayar?',
      a: 'Sesuai prinsip keandalan produk kami, setiap job yang gagal diproses memiliki tombol retry otomatis maksimal 3 kali. Jika video tetap tidak dapat dirender karena kendala sumber video, saldo klip atau dana pembayaran Anda akan otomatis dikembalikan (auto-refund / credit balance).',
    },
    {
      q: 'Platform video apa saja yang didukung untuk saat ini?',
      a: 'Pada fase MVP ini, KlipChip mendukung URL video dan rekaman livestream (VOD) dari YouTube dan Twitch yang dapat diakses publik secara legal.',
    },
  ];

  return (
    <section className="py-20 bg-zinc-950 border-t border-white/10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 space-y-3">
          <Reveal>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3.5 py-1 text-xs font-semibold text-zinc-300">
              <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
              <span>Pertanyaan Populer</span>
            </div>
          </Reveal>
          <Reveal delay={90}>
            <h2 className="text-3xl font-extrabold text-white font-display">
              Frequently Asked Questions (FAQ)
            </h2>
          </Reveal>
          <Reveal delay={170}>
            <p className="text-sm text-zinc-400">
              Punya pertanyaan seputar KlipChip? Temukan jawabannya di bawah ini.
            </p>
          </Reveal>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <Reveal key={idx} delay={60 + idx * 70}>
                <div
                  className={`overflow-hidden rounded-2xl border bg-zinc-900/60 transition-colors duration-300 ease-smooth ${
                    isOpen
                      ? 'border-cyan-400/40 bg-zinc-900'
                      : 'border-white/10 hover:border-cyan-400/25'
                  }`}
                >
                  <button
                    onClick={() => setOpenIdx(isOpen ? null : idx)}
                    aria-expanded={isOpen}
                    className="flex w-full items-center justify-between gap-4 p-5 text-left text-sm font-bold text-white hover:text-cyan-300 active:scale-[0.995] transition-all duration-200"
                  >
                    <span className="flex items-center gap-3">
                      <span
                        className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors duration-300 ${
                          isOpen ? 'bg-cyan-400' : 'bg-zinc-600'
                        }`}
                      />
                      {faq.q}
                    </span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-300 ease-smooth ${
                        isOpen ? 'rotate-180 text-cyan-400' : ''
                      }`}
                    />
                  </button>
                  {/* Buka/tutup halus lewat grid-template-rows (tanpa animasi height) */}
                  <div
                    className={`grid transition-all duration-300 ease-smooth ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="border-t border-white/5 px-5 pb-5 pt-3 pl-[38px] text-xs leading-relaxed text-zinc-300">
                        {faq.a}
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
