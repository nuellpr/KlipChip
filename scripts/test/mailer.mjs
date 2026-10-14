import assert from 'node:assert/strict';
import { getMailConfig } from '../../src/lib/mailer.ts';

const KEYS = [
  'MAIL_HOST', 'SMTP_HOST',
  'MAIL_USER', 'SMTP_USER',
  'MAIL_PASS', 'SMTP_PASS', 'SMTP_PASSWORD',
  'MAIL_PORT', 'SMTP_PORT',
  'MAIL_FROM',
];

// Default tanpa konfigurasi -> tidak configured, port fallback 587.
for (const k of KEYS) delete process.env[k];
const empty = getMailConfig();
assert.equal(empty.configured, false);
assert.equal(empty.port, 587);

// Dengan konfigurasi MAIL_* -> configured, from default = user.
process.env.MAIL_HOST = 'smtp.gmail.com';
process.env.MAIL_USER = 'klipchip@example.com';
process.env.MAIL_PASS = 'app-password';
const configured = getMailConfig();
assert.equal(configured.configured, true);
assert.equal(configured.host, 'smtp.gmail.com');
assert.equal(configured.from, 'klipchip@example.com');

// Port valid + override MAIL_FROM.
process.env.MAIL_PORT = '465';
process.env.MAIL_FROM = 'KlipChip <klipchip@example.com>';
assert.equal(getMailConfig().port, 465);
assert.equal(getMailConfig().from, 'KlipChip <klipchip@example.com>');

// Port tak valid (NaN) -> fallback 587, bukan NaN.
process.env.MAIL_PORT = 'bukan-angka';
assert.equal(getMailConfig().port, 587);

// Fallback penamaan SMTP_* (termaui SMTP_PASSWORD) saat MAIL_* kosong.
for (const k of ['MAIL_HOST', 'MAIL_USER', 'MAIL_PASS', 'MAIL_PORT', 'MAIL_FROM']) delete process.env[k];
process.env.SMTP_HOST = 'smtp.example.com';
process.env.SMTP_USER = 'u@example.com';
process.env.SMTP_PASSWORD = 'pw';
const smtp = getMailConfig();
assert.equal(smtp.configured, true);
assert.equal(smtp.host, 'smtp.example.com');

console.log('PASS mailer');
