/**
 * Kontensi tulis Prisma/SQLite (transaksi bersamaan gagal ambil lock) aman
 * dicoba ulang -> route balas 409, bukan 500 mentah.
 */
export function isWriteConflict(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  // Prisma interactive-transaction write conflict.
  if ((err as { code?: unknown }).code === 'P2034') return true;
  // Driver SQLite mentah (di luar transaksi interaktif): SQLITE_BUSY / SQLITE_LOCKED.
  const message = (err as { message?: unknown }).message;
  return typeof message === 'string' && /database is locked|SQLITE_BUSY|SQLITE_LOCKED/i.test(message);
}
