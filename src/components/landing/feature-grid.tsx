import React from 'react';
import { 
  Volume2, 
  MessageSquare, 
  CreditCard, 
  Zap, 
  CheckCircle2, 
  Languages
} from 'lucide-react';

export function FeatureGrid() {
  const features = [
    {
      icon: Volume2,
      badge: 'Audio AI',
      color: 'text-brand-400 border-brand-500/30 bg-brand-500/10',
      title: 'Deteksi Audio Spike & Teriakan Streamer',
      description:
        'KlipChip memindai lonjakan desibel dan dinamika loudness secara instan untuk menemukan momen klimaks, tawa histeris, dan teriakan clutching tanpa harus menonton video berjam-jam.',
      highlights: ['Algoritma Loudness Filter', 'Rekomendasi Kandidat 5-180 detik', 'Akurasi Deteksi >95%'],
    },
    {
      icon: MessageSquare,
      badge: 'Chat Velocity',
      color: 'text-amber-400 border-amber-500/30 bg-amber-500/10',
      title: 'Analisis Kepadatan & Reaksi Chat Penonton',
      description:
        'Momen terbaik selalu diikuti spam emote dan chat kilat dari penonton. KlipChip menganalisis lonjakan frekuensi pesan livestream YouTube dan Twitch secara real-time.',
      highlights: ['Deteksi Spam Emote & Reaksi', 'Kombinasi Skor Audio + Chat', 'Penanda Timestamp Momen Hype'],
    },
    {
      icon: Languages,
      badge: 'Kamus Slang',
      color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
      title: 'Auto-Caption Slang Gaming Indonesia',
      description:
        'Mesin transkripsi khusus yang memahami bahasa gaul kreator Indonesia seperti "bjir", "ggwp", "rata lu", "bocil kematian", "water bucket clutch", hingga istilah roleplay FiveM.',
      highlights: ['60+ Kosakata Slang Gaming', 'Gaya Subtitle Hormozi & Neon', 'Editor Teks Inline Interaktif'],
    },
    {
      icon: CreditCard,
      badge: 'Pay-Per-Clip',
      color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
      title: 'Bayar Per Clip Rp 5.000 via QRIS',
      description:
        'Tidak ada langganan bulanan mahal jika Anda hanya butuh 1-2 clip sesekali. Cukup scan QRIS, GoPay, OVO, DANA, atau VA BCA/Mandiri dan unduh file 1080p tanpa watermark.',
      highlights: ['Mulai Rp 5.000 / Clip HD', 'Scan QRIS Langsung Selesai', 'Refund Otomatis Bila Gagal'],
    },
  ];

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute left-1/4 top-1/4 h-[400px] w-[400px] rounded-full bg-brand-600/15 blur-[120px] parallax-orb" />
        <div className="absolute right-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full bg-[#F43F5E]/10 blur-[100px] parallax-orb" />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-brand-500/40 bg-brand-500/15 px-3.5 py-1 text-xs font-semibold text-brand-300">
            <Zap className="h-3.5 w-3.5 text-accent" />
            <span>Fitur Unggulan P0 MVP</span>
          </div>
          <h2 className="text-3xl font-extrabold sm:text-4xl lg:text-5xl text-white font-display">
            Semua yang Dibutuhkan Kreator Indonesia untuk Go Viral
          </h2>
          <p className="text-base text-[#94A3B8]">
            Dirancang dari nol untuk mengatasi kelemahan platform editing global yang sering salah mengenali slang lokal dan memaksa langganan ratusan ribu rupiah.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon;
            return (
              <div
                key={idx}
                className="group relative rounded-3xl border border-white/10 bg-[#1E1C35]/80 p-8 transition-all duration-300 hover:border-brand-500/60 hover:bg-[#27273B] hyper-card-hover"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className={`flex h-14 w-14 items-center justify-center rounded-2xl border ${feat.color} shadow-lg shadow-black/50`}>
                    <Icon className="h-7 w-7" />
                  </div>
                  <span className="rounded-full bg-white/5 border border-white/10 px-3 py-1 text-xs font-bold text-zinc-300">
                    {feat.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-[#A78BFA] transition-colors">
                  {feat.title}
                </h3>
                <p className="text-sm text-[#94A3B8] leading-relaxed mb-6">
                  {feat.description}
                </p>

                <div className="space-y-2 pt-4 border-t border-white/5">
                  {feat.highlights.map((item, hIdx) => (
                    <div key={hIdx} className="flex items-center gap-2 text-xs text-[#E2E8F0]">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
