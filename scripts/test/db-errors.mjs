// QA — klasifikasi kontensi tulis (isWriteConflict): 409-retryable vs error lain.
// Pure function, tanpa DB. Mengunci deteksi P2034 & pesan SQLite busy/locked.
import assert from 'node:assert/strict';
import { isWriteConflict } from '../../src/lib/db-errors.ts';

// Positif: harus terdeteksi sebagai kontensi tulis -> route balas 409.
assert.equal(isWriteConflict({ code: 'P2034' }), true, 'P2034 (write conflict Prisma)');
assert.equal(isWriteConflict({ message: 'database is locked' }), true, 'SQLITE_BUSY');
assert.equal(isWriteConflict({ message: 'SQLITE_LOCKED: database table is locked' }), true);
assert.equal(isWriteConflict(new Error('SQLITE_BUSY: database is locked')), true);

// Negatif: bukan kontensi -> tetap 500.
assert.equal(isWriteConflict({ code: 'P2002', message: 'Unique constraint failed' }), false);
assert.equal(isWriteConflict({ code: 'P2028', message: 'Transaction already closed' }), false);
assert.equal(isWriteConflict(new Error('validation failed')), false);
assert.equal(isWriteConflict(null), false);
assert.equal(isWriteConflict(undefined), false);
assert.equal(isWriteConflict('boom'), false);

console.log('PASS db-errors');
