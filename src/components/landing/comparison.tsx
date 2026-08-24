import React from 'react';
import { Check, X, Zap } from 'lucide-react';

export function ComparisonSection() {
  const comparisonData = [
    {
      feature: 'Deteksi Slang & Istilah Gaming Indonesia (FiveM, MLBB, Minecraft)',
      klipchip: true,
      manualEditing: 'Tergantung Editor',
      globalAi: false,
    },
    {
      feature: 'Highlight Berbasis Lonjakan Chat YouTube & Twitch',
      klipchip: true,
      manualEditing: false,
      globalAi: 'Terbatas',
    },
    {
      feature: 'Sistem Bayar Fleksibel Per Clip (Micro-payment Rp 5.000 via QRIS)',
      klipchip: true,
      manualEditing: false,
      globalAi: false,
    },
    {
      feature: 'Waktu dari URL hingga Siap Publikasi',
      klipchip: '< 3 Menit',
      manualEditing: '2 - 4 Jam',
      globalAi: '5 - 10 Menit',
    },
    {
      feature: 'Auto-Crop Vertikal 9:16 Siap Shorts & TikTok',
      klipchip: true,
      manualEditing: true,
      globalAi: true,
    },
    {
      feature: 'Tanpa Perlu Software Editing Berat (Premiere/After Effects)',
      klipchip: true,
      manualEditing: false,
      globalAi: true,
    },
  ];

  return (
    <section className="py-20 bg-zinc-950">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-purple-500/30 bg-purple-500/10 px-3.5 py-1 text-xs font-semibold text-purple-300">
            <Zap className="h-3.5 w-3.5" />
            <span>Mengapa KlipChip?</span>
          </div>
          <h2 className="text-3xl font-extrabold sm:text-4xl text-white font-display">
            Perbandingan KlipChip vs Alternatif Lain
          </h2>
          <p className="text-sm text-zinc-400">
            Dibuat untuk memecahkan masalah nyata kreator lokal: harga terjangkau per clip dan auto-caption yang benar-benar akurat dengan bahasa sehari-hari livestream Indonesia.
          </p>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto rounded-3xl border border-white/10 bg-zinc-900/60 backdrop-blur-xl shadow-2xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-zinc-950/80 text-xs font-bold uppercase tracking-wider text-zinc-400">
                <th className="py-4 px-6">Fitur & Kemampuan</th>
                <th className="py-4 px-6 text-cyan-400 bg-brand-950/40 border-x border-brand-500/30">
                  ⚡ KlipChip (Indonesia)
                </th>
                <th className="py-4 px-6 text-zinc-400">Editing Manual Premiere</th>
                <th className="py-4 px-6 text-zinc-400">AI Global (Opus / Submagic)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-4 px-6 font-medium text-white max-w-xs">{row.feature}</td>
                  
                  {/* KlipChip Column */}
                  <td className="py-4 px-6 font-bold bg-brand-950/20 border-x border-brand-500/20 text-cyan-300">
                    {typeof row.klipchip === 'boolean' ? (
                      <div className="flex items-center gap-1.5 text-cyan-300">
                        <Check className="h-5 w-5 text-emerald-400 stroke-[3]" />
                        <span>Otomatis & Akurat</span>
                      </div>
                    ) : (
                      <span className="text-emerald-400 font-extrabold">{row.klipchip}</span>
                    )}
                  </td>

                  {/* Manual Editing */}
                  <td className="py-4 px-6 text-zinc-400">
                    {typeof row.manualEditing === 'boolean' ? (
                      row.manualEditing ? (
                        <Check className="h-4 w-4 text-zinc-400" />
                      ) : (
                        <X className="h-4 w-4 text-rose-500" />
                      )
                    ) : (
                      <span>{row.manualEditing}</span>
                    )}
                  </td>

                  {/* Global AI */}
                  <td className="py-4 px-6 text-zinc-400">
                    {typeof row.globalAi === 'boolean' ? (
                      row.globalAi ? (
                        <Check className="h-4 w-4 text-zinc-400" />
                      ) : (
                        <div className="flex items-center gap-1 text-rose-400">
                          <X className="h-4 w-4" />
                          <span className="text-xs">Sering Typo Slang</span>
                        </div>
                      )
                    ) : (
                      <span>{row.globalAi}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
