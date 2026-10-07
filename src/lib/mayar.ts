// Klien Mayar API v2 (Request Payment).
// Docs: https://docs.mayar.id/api-reference-v2/reqpayment/create
//
// Bentuk tipis di atas fetch: tidak ada SDK, tidak ada state, tidak ada retry.
// Semua keputusan (retry, rate limit, idempotensi) milik pemanggil.

const PROD_BASE = 'https://api.mayar.id/hl/v2';
const SANDBOX_BASE = 'https://api.mayar.io/hl/v2';

// Batas 50 request/menit per API key. 429 menyertakan header Retry-After.
const TIMEOUT_MS = 15000;

export type MayarStatus = 'unpaid' | 'paid' | 'closed' | (string & {});

export interface MayarPaymentRequest {
  id: string;
  transactionId: string;
  link: string;
  redirectUrl: string | null;
}

export interface MayarPaymentDetail {
  id: string;
  amount: number;
  status: MayarStatus;
  linkUrl?: string;
}

export interface CreatePaymentInput {
  name: string;
  amount: number;
  email?: string;
  mobile?: string;
  description?: string;
  expiredAt?: Date;
  redirectUrl?: string;
  paymentMethod?: string;
  extraData?: Record<string, unknown>;
}

export class MayarError extends Error {
  readonly status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'MayarError';
    this.status = status;
  }
}

/** Token API Mayar. Tidak ada default — payment yang tak terkonfigurasi harus gagal keras. */
export function getMayarToken(): string {
  const token = process.env.MAYAR_API_TOKEN?.trim();
  if (!token) {
    throw new MayarError(
      'MAYAR_API_TOKEN belum diset. Ambil dari Mayar > Integration > API Key (sandbox: web.mayar.io).',
      503
    );
  }
  return token;
}

/** true kalau memakai domain sandbox (api.mayar.io), bukan produksi. */
export function isSandbox(): boolean {
  return process.env.MAYAR_API_SANDBOX === '1' || process.env.NODE_ENV !== 'production';
}

function baseUrl(): string {
  return process.env.MAYAR_API_BASE?.trim() || (isSandbox() ? SANDBOX_BASE : PROD_BASE);
}

async function request(path: string, init?: RequestInit): Promise<unknown> {
  const token = getMayarToken();
  const url = `${baseUrl()}${path}`;
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let res: Response;
  try {
    res = await fetch(url, {
      ...init,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
        ...init?.headers,
      },
    });
  } catch (err) {
    // Hanya kegagalan jaringan yang masuk sini. Kesalahan konfigurasi (token)
    // sudah divalidasi sebelum try supaya tidak tersamar jadi "gagal jaringan".
    const reason = err instanceof Error && err.name === 'AbortError' ? 'timeout' : 'tidak bisa menghubungi Mayar';
    throw new MayarError(`Gagal memanggil Mayar (${reason})`, 502);
  } finally {
    clearTimeout(timer);
  }

  const text = await res.text();
  let body: { statusCode?: number; messages?: string; data?: unknown };
  try {
    body = JSON.parse(text);
  } catch {
    throw new MayarError(`Respons Mayar bukan JSON (HTTP ${res.status})`, 502);
  }

  if (!res.ok || (body.statusCode !== undefined && body.statusCode >= 400)) {
    const code = res.status;
    throw new MayarError(body.messages || `Mayar menolak permintaan (HTTP ${res.status})`, code);
  }

  return body.data;
}

/** Buat satu payment request. Caller wajib menyimpan `id` untuk verifikasi webhook. */
export async function createPaymentRequest(input: CreatePaymentInput): Promise<MayarPaymentRequest> {
  const payload: Record<string, unknown> = {
    name: input.name,
    amount: Math.round(input.amount),
  };
  if (input.email) payload.email = input.email;
  if (input.mobile) payload.mobile = input.mobile;
  if (input.description) payload.description = input.description;
  if (input.redirectUrl) payload.redirectUrl = input.redirectUrl;
  if (input.paymentMethod) payload.paymentMethod = input.paymentMethod;
  if (input.expiredAt) payload.expiredAt = input.expiredAt.toISOString();
  if (input.extraData) payload.extraData = input.extraData;

  const data = (await request('/payments/create', {
    method: 'POST',
    body: JSON.stringify(payload),
  })) as Partial<MayarPaymentRequest> | null;

  if (!data?.id || !data.link) {
    throw new MayarError('Mayar tidak mengembalikan id/link payment request', 502);
  }

  return {
    id: data.id,
    transactionId: data.transactionId ?? '',
    link: data.link,
    redirectUrl: data.redirectUrl ?? null,
  };
}

/**
 * Ambil status payment request langsung dari Mayar.
 * Dipakai untuk Konfirmasi webhook karena webhook Mayar tidak ditandatangani.
 */
export async function fetchPaymentRequest(id: string): Promise<MayarPaymentDetail | null> {
  const data = (await request(`/payments/${encodeURIComponent(id)}`)) as
    | Partial<MayarPaymentDetail>
    | null;

  if (!data || typeof data.status !== 'string') return null;
  return {
    id: data.id ?? id,
    amount: typeof data.amount === 'number' ? data.amount : 0,
    status: data.status,
    linkUrl: data.linkUrl,
  };
}