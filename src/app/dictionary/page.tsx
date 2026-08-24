'use client';

import React, { useState } from 'react';
import { 
  BookOpen, 
  Search, 
  Plus, 
  CheckCircle2, 
  X
} from 'lucide-react';
import { INITIAL_SLANG_DICTIONARY } from '@/data/slang-dictionary';
import { SlangEntry } from '@/lib/types';

export default function DictionaryPage() {
  const [dictionary, setDictionary] = useState<SlangEntry[]>(INITIAL_SLANG_DICTIONARY);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Add slang form state
  const [newSlang, setNewSlang] = useState('');
  const [newNormalized, setNewNormalized] = useState('');
  const [newCategory, setNewCategory] = useState<SlangEntry['category']>('Livestream Indo');
  const [newMeaning, setNewMeaning] = useState('');
  const [newExample, setNewExample] = useState('');

  const categories = [
    { id: 'all', name: 'Semua Kategori' },
    { id: 'Livestream Indo', name: 'Livestream Indo' },
    { id: 'FiveM / GTA', name: 'FiveM / GTA' },
    { id: 'Minecraft', name: 'Minecraft' },
    { id: 'Mobile Legends', name: 'Mobile Legends' },
    { id: 'Valorant', name: 'Valorant' },
    { id: 'Umum Gaming', name: 'Umum Gaming' },
  ];

  const filteredDictionary = dictionary.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      item.slang.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.normalized.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddSlang = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlang || !newNormalized) return;

    const entry: SlangEntry = {
      id: `slang-${Date.now()}`,
      slang: newSlang.toLowerCase(),
      normalized: newNormalized,
      category: newCategory,
      meaning: newMeaning || 'Istilah slang gaming komunitas Indonesia.',
      exampleSentence: newExample || `${newNormalized} pas momen clutch!`,
      isOfficial: false,
    };

    setDictionary([entry, ...dictionary]);
    setShowAddModal(false);
    setNewSlang('');
    setNewNormalized('');
    setNewMeaning('');
    setNewExample('');
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 text-xs font-bold">
              AI Whisper Normalizer
            </span>
            <span className="text-xs text-zinc-400">• Database Kosakata Lokal</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white font-display mt-1">
            Kamus Slang Gaming Indonesia
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1 max-w-2xl">
            Kamus istilah khusus yang digunakan KlipChip untuk menormalkan audio transkripsi menjadi teks subtitle yang rapi, akurat, dan sesuai konteks komunitas gaming Indonesia.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-brand-600 to-cyan-500 px-5 py-3 text-xs font-bold text-white shadow-lg shadow-brand-500/30 hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus className="h-4 w-4" />
          <span>Ajukan Kata Slang Baru</span>
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
          <span className="text-xs text-zinc-400">Total Kosakata Slang</span>
          <p className="text-2xl font-black text-white mt-1">{dictionary.length} Kata</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
          <span className="text-xs text-zinc-400">Akurasi Transkripsi</span>
          <p className="text-2xl font-black text-emerald-400 mt-1">98.4%</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
          <span className="text-xs text-zinc-400">Kategori Game Didukung</span>
          <p className="text-2xl font-black text-cyan-400 mt-1">6 Game</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-zinc-900/60 p-4">
          <span className="text-xs text-zinc-400">Pembaruan Database</span>
          <p className="text-2xl font-black text-brand-300 mt-1">Harian</p>
        </div>
      </div>

      {/* Search & Category Filter */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-zinc-900/80 p-3 rounded-2xl border border-white/10">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Cari slang (misal: bjir, ggwp, clutch)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-white/10 bg-zinc-950 pl-10 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-brand-500"
          />
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                selectedCategory === cat.id
                  ? 'bg-cyan-400 text-black shadow-md'
                  : 'bg-zinc-950 text-zinc-400 hover:text-white border border-white/5'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Slang Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDictionary.map((item) => (
          <div
            key={item.id}
            className="rounded-3xl border border-white/10 bg-zinc-900/70 p-5 space-y-3 transition-all hover:border-brand-500/40 hover:bg-zinc-850 shadow-lg flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="rounded-full bg-white/5 border border-white/10 px-2.5 py-0.5 text-[10px] font-bold text-zinc-300">
                  {item.category}
                </span>
                {item.isOfficial ? (
                  <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> Terverifikasi
                  </span>
                ) : (
                  <span className="text-[10px] font-semibold text-brand-300">
                    Kustom Pengguna
                  </span>
                )}
              </div>

              <div className="flex items-baseline gap-2">
                <h3 className="text-lg font-black text-white">{item.slang}</h3>
                <span className="text-zinc-500 font-mono text-xs">➔</span>
                <span className="text-sm font-bold text-cyan-300">{item.normalized}</span>
              </div>

              <p className="text-xs text-zinc-400 leading-relaxed mt-2">{item.meaning}</p>
            </div>

            <div className="pt-3 border-t border-white/5">
              <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-1">
                Contoh Teks Subtitle:
              </span>
              <p className="text-xs font-mono text-zinc-300 bg-zinc-950 p-2 rounded-xl border border-white/5 italic">
                &ldquo;{item.exampleSentence}&rdquo;
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Add Slang Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-md rounded-3xl border border-white/15 bg-zinc-900 p-6 shadow-2xl space-y-5">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div>
              <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold uppercase mb-1">
                <BookOpen className="h-4 w-4" />
                <span>Kamus Komunitas</span>
              </div>
              <h3 className="text-xl font-bold text-white">Ajukan Kata Slang Baru</h3>
              <p className="text-xs text-zinc-400 mt-1">
                Masukkan istilah khas game Anda agar KlipChip dapat mengenalinya saat proses transkripsi.
              </p>
            </div>

            <form onSubmit={handleAddSlang} className="space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Kata Slang / Pengucapan</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: bjirr, retri indomaret, clutch"
                  value={newSlang}
                  onChange={(e) => setNewSlang(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Bentuk Normalisasi Subtitle</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Anjir!, Retri Indomaret, Clutch Momen"
                  value={newNormalized}
                  onChange={(e) => setNewNormalized(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Kategori Game</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as SlangEntry['category'])}
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 text-xs text-white focus:border-brand-500 focus:outline-none"
                >
                  <option value="Livestream Indo">Livestream Indo</option>
                  <option value="FiveM / GTA">FiveM / GTA</option>
                  <option value="Minecraft">Minecraft</option>
                  <option value="Mobile Legends">Mobile Legends</option>
                  <option value="Valorant">Valorant</option>
                  <option value="Umum Gaming">Umum Gaming</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Arti / Konteks Istilah</label>
                <input
                  type="text"
                  placeholder="Penjelasan singkat..."
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-300">Contoh Kalimat Subtitle</label>
                <input
                  type="text"
                  placeholder="Contoh kalimat saat diucapkan..."
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  className="w-full rounded-xl border border-white/10 bg-zinc-950 px-4 py-2.5 text-xs text-white placeholder-zinc-500 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 rounded-xl bg-zinc-800 py-2.5 text-xs font-bold text-zinc-300 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 py-2.5 text-xs font-bold text-white shadow-md shadow-brand-500/30"
                >
                  Simpan Kata Slang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
