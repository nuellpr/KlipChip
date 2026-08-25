import assert from 'node:assert';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Happy: kolom baru ada di tabel Clip dengan default benar
const rows = await prisma.$queryRawUnsafe('PRAGMA table_info(Clip)');
const cols = Object.fromEntries(rows.map((r) => [r.name, r.dflt_value]));
assert.strictEqual(cols.bilingualSubtitles, 'false', `bilingualSubtitles dflt=${cols.bilingualSubtitles}`);
assert.strictEqual(cols.secondaryLanguage, "'en'", `secondaryLanguage dflt=${cols.secondaryLanguage}`);
assert.strictEqual(cols.socialSummary, "''", `socialSummary dflt=${cols.socialSummary}`);
console.log('[PASS] Clip.bilingualSubtitles default false');
console.log('[PASS] Clip.secondaryLanguage default en');
console.log('[PASS] Clip.socialSummary default empty');

// Neg control: detektor yang sama pada tabel TANPA kolom harus gagal menemukannya
// (membuktikan assert tidak false-positive)
const jobRows = await prisma.$queryRawUnsafe('PRAGMA table_info(ClipJob)');
assert.ok(!jobRows.some((r) => r.name === 'bilingualSubtitles'), 'ClipJob tidak boleh punya kolom baru');
console.log('[PASS] neg-control: kolom baru tidak bocor ke tabel lain');

console.log('T1 SCHEMA: ALL PASS');
await prisma.$disconnect();
