// Rate limiter sederhana berbasis memori (per proses server).
// Cukup untuk MVP lokal; untuk produksi gunakan Redis.

interface WindowEntry {
  timestamps: number[];
}

const store = new Map<string, WindowEntry>();

/**
 * Cek apakah aksi diizinkan untuk key tertentu.
 * @param key       Identifier unik (mis. userId + aksi)
 * @param limit     Jumlah maksimal aksi dalam window
 * @param windowMs  Panjang window dalam milidetik
 */
export function checkRateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = store.get(key) || { timestamps: [] };
  entry.timestamps = entry.timestamps.filter((t) => now - t < windowMs);

  if (entry.timestamps.length >= limit) {
    store.set(key, entry);
    return false;
  }

  entry.timestamps.push(now);
  store.set(key, entry);
  return true;
}
