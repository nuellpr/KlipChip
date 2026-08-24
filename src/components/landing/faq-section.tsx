'use client';

import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Bagaimana cara kerja deteksi highlight audio spike dan chat?',
      a: 'KlipChip memindai gelombang audio video sumber untuk mendeteksi perubahan energi loudness yang mendadak (seperti teriakan, tawa heboh, atau ledakan in-game) sekaligus mencocokkannya dengan grafik lonjakan pesan di chat livestream. Kombinasi ini memberikan skor relevansi momen viral hingga >95%.',
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
          <div className="inline-flex items-center gap-1.5 rounded-full border border-zinc-700 bg-zinc-900 px-3.5 py-1 text-xs font-semibold text-zinc-300">
            <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
            <span>Pertanyaan Populer</span>
          </div>
          <h2 className="text-3xl font-extrabold text-white font-display">
            Frequently Asked Questions (FAQ)
          </h2>
          <p className="text-sm text-zinc-400">
            Punya pertanyaan seputar KlipChip? Temukan jawabannya di bawah ini.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl border border-white/10 bg-zinc-900/60 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenIdx(isOpen ? null : idx)}
                  className="flex w-full items-center justify-between p-5 text-left text-sm font-bold text-white hover:text-cyan-300 transition-colors"
                >
                  <span>{faq.q}</span>
                  <ChevronDown
                    className={`h-4 w-4 shrink-0 text-zinc-400 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-zinc-300 leading-relaxed border-t border-white/5 pt-3">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
