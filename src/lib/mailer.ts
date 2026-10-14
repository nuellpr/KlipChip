import type { Transporter } from 'nodemailer';

/**
 * Konfigurasi email dari environment. Mendukung dua penamaan variabel
 * (MAIL_* lebih dulu, lalu SMTP_*) supaya nyaman dipakai.
 * `configured` = cukup host+user+pass; kalau belum diisi, pengiriman
 * jatuh ke fallback console (dev) alih-alih melempar error.
 */
export function getMailConfig() {
  const host = process.env.MAIL_HOST || process.env.SMTP_HOST;
  const user = process.env.MAIL_USER || process.env.SMTP_USER;
  const pass = process.env.MAIL_PASS || process.env.SMTP_PASS || process.env.SMTP_PASSWORD;
  const port = Number.parseInt(process.env.MAIL_PORT || process.env.SMTP_PORT || '587', 10);
  const from = process.env.MAIL_FROM || user;

  return {
    host,
    user,
    pass,
    from,
    port: Number.isFinite(port) ? port : 587,
    configured: Boolean(host && user && pass),
  };
}

// Transporter dibuat lazy + di-cache agar koneksi SMTP dipakai ulang.
let transporter: Transporter | null = null;

export type SendEmailInput = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export type SendEmailResult = {
  delivered: boolean;
  via: 'smtp' | 'console';
};

/**
 * Kirim email. Tanpa konfigurasi SMTP -> fallback console (info) supaya
 * alur dev/OTP tetap jalan tanpa kredensial; dengan konfigurasi -> SMTP.
 */
export async function sendEmail({ to, subject, text, html }: SendEmailInput): Promise<SendEmailResult> {
  const config = getMailConfig();

  if (!config.configured) {
    // Fallback dev: cetak isi email ke log (kode OTP / link tetap terlihat).
    console.info(`[mail:console] to=${to} subject="${subject}"\n${text}`);
    return { delivered: false, via: 'console' };
  }

  if (!transporter) {
    // Import dinamis: memuat mailer jangan ikut memuat nodemailer di dev
    // yang tak memakai SMTP, dan test fungsi murni tetap ringan.
    const { default: nodemailer } = await import('nodemailer');
    transporter = nodemailer.createTransport({
      host: config.host,
      port: config.port,
      secure: config.port === 465,
      auth: { user: config.user, pass: config.pass },
    });
  }

  try {
    await transporter.sendMail({
      from: config.from,
      to,
      subject,
      text,
      html,
    });
    return { delivered: true, via: 'smtp' };
  } catch (err) {
    // Jangan lempar: pemanggil memakai fire-and-forget (void). Kegagalan
    // SMTP dicatat supaya bisa didiagnosa, tapi tak menggagalkan alur auth.
    console.error('[mail] gagal mengirim email via SMTP:', err);
    return { delivered: false, via: 'smtp' };
  }
}
