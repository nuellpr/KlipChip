/**
 * Server auth — Better Auth.
 *
 * Menggantikan session token HMAC buatan sendiri (src/lib/auth.ts versi lama).
 * Pemanggil yang tidak berubah: `getCurrentUser()` tetap diekspor dengan
 * signature yang sama supaya ~15 route handler tidak perlu disentuh.
 *
 * Metode yang aktif: email+password (tidak perlu infra email) dan Google.
 * Magic link / OTP sengaja tidak dipakai karena project ini belum punya
 * kemampuan kirim email sama sekali -- lihat cara pakai di .env.example.
 */
import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { headers } from 'next/headers';
import { prisma } from './prisma.ts';

/**
 * Base URL dan host yang dipercaya.
 *
 * Host tunnel dev (ngrok) berubah setiap kali tunnel dinyalakan ulang, jadi
 * tidak bisa ditulis satu-satu. Better Auth menerima wildcard pada
 * `allowedHosts`, dan setiap host yang terdaftar di sana otomatis ikut
 * dipercaya sebagai origin -- tanpa itu, sign-in/sign-out dari browser yang
 * membuka host tunnel akan ditolak 403 oleh pemeriksaan Origin.
 *
 * Pola tunnel hanya aktif DI LUAR PRODUKSI. Di produksi, mempercayai seluruh
 * domain ngrok berarti siapa pun dengan satu host ngrok bisa dianggap origin
 * yang sah, jadi daftarnya harus eksplisit lewat BETTER_AUTH_ALLOWED_HOSTS.
 */
const isProduction = process.env.NODE_ENV === 'production';

const DEV_ONLY_HOSTS = [
  'localhost:3000',
  'localhost:3100',
  '127.0.0.1:3000',
  '127.0.0.1:3100',
  // Tunnel dev: host acak per sesi.
  '*.ngrok-free.app',
  '*.ngrok-free.dev',
  '*.ngrok.io',
  '*.ngrok.app',
];

const allowedHosts = [
  ...(isProduction ? [] : DEV_ONLY_HOSTS),
  ...(process.env.BETTER_AUTH_ALLOWED_HOSTS?.split(',') ?? []),
].map((v) => v.trim()).filter(Boolean);

const explicitBaseURL =
  process.env.BETTER_AUTH_URL?.trim() ||
  process.env.NEXT_PUBLIC_APP_URL?.trim() ||
  '';

// Kalau base URL eksplisit ada, pakai itu. Kalau tidak, biarkan Better Auth
// menurunkannya dari request yang masuk tetapi batasi ke allowedHosts.
const baseURL = explicitBaseURL || { allowedHosts };

// Asal tambahan di luar allowedHosts, dipisah koma.
const trustedOrigins = (process.env.BETTER_AUTH_TRUSTED_ORIGINS?.split(',') ?? [])
  .map((v) => v.trim())
  .filter(Boolean);

export const auth = betterAuth({
  baseURL,
  trustedOrigins: [...new Set(trustedOrigins)],
  database: prismaAdapter(prisma, { provider: 'sqlite' }),

  emailAndPassword: {
    enabled: true,
    // Tidak ada email verification: project belum punya pengirim email.
    // Kalau nanti ditambah SMTP, nyalakan ini dan kirim link verifikasi.
    requireEmailVerification: false,
    minPasswordLength: 8,
    maxPasswordLength: 128,
  },

  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    },
  },

  session: {
    // Sebelumnya session token berlaku 30 hari; disamakan supaya user tidak
    // tiba-tiba ter-logout.
    expiresIn: 60 * 60 * 24 * 30,
    updateAge: 60 * 60 * 24,
    // Session dibaca di setiap route handler. Cache cookie menghindari query
    // DB per request; DB tetap sumber kebenaran (Better Auth memvalidasi token
    // yang ditandatangani di dalam cookie).
    cookieCache: { enabled: true, maxAge: 60 * 5 },
  },

  // Kolom tambahan milik app yang ditulis Better Auth saat user dibuat lewat
  // Google. Tanpa ini, avatar Google tidak tersimpan.
  user: {
    additionalFields: {
      role: { type: 'string', required: false, defaultValue: 'user', input: false },
      balanceClips: { type: 'number', required: false, defaultValue: 0, input: false },
      avatarUrl: { type: 'string', required: false, input: false },
      provider: { type: 'string', required: false, input: false },
    },
  },

  plugins: [nextCookies()],
});

/**
 * Pengganti getCurrentUser() lama. Mengembalikan baris User beserta kolom
 * milik app (role, balanceClips, avatarUrl), bukan objek session Better Auth,
 * supaya route handler yang sudah ada tetap bisa memakai `user.id`,
 * `user.email`, `user.balanceClips`.
 */
export async function getCurrentUser() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) return null;
    return session.user as Awaited<ReturnType<typeof prisma.user.findUnique>>;
  } catch {
    return null;
  }
}
