/**
 * Konfigurasi provider AI untuk highlight scoring dan ringkasan sosmed.
 *
 * Default: OpenRouter. Endpoint-nya OpenAI-compatible, jadi format request/
 * response tidak berubah dari gateway sebelumnya.
 *
 * Dua skema nama variabel diterima dan diurutkan dari yang paling spesifik:
 *   OpenRouter : OPENROUTER_API_KEY / OPENROUTER_BASE_URL / MODEL_NAME
 *   Forge (lama): FORGE_API_KEY      / FORGE_BASE_URL      / FORGE_MODEL
 * Sengaja tidak dibersihkan: file .env yang sudah ada tidak perlu diedit.
 */

const DEFAULT_BASE_URL = 'https://openrouter.ai/api/v1';
const DEFAULT_MODEL = 'apodex/apodex-1.1-mini:free';

/** Dialihkan ke Forge hanya kalau ada Forge-specific env yang benar-benar diisi. */
function env(...names: string[]): string {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return '';
}

export function getAiBaseUrl(): string {
  return env('OPENROUTER_BASE_URL', 'FORGE_BASE_URL') || DEFAULT_BASE_URL;
}

export function getAiApiKey(): string {
  return env('OPENROUTER_API_KEY', 'FORGE_API_KEY', 'FORGE_API_KEYR');
}

export function getAiModel(): string {
  return env('MODEL_NAME', 'OPENROUTER_MODEL', 'FORGE_MODEL') || DEFAULT_MODEL;
}

/** Model cadangan dicoba kalau model utama gagal / kena rate limit. */
export function getAiFallbackModel(): string {
  return env('OPENROUTER_MODEL_FALLBACK', 'FORGE_MODEL_FALLBACK');
}

/** Daftar model untuk dicoba berurutan; entri kosong dibuang. */
export function getAiModels(): string[] {
  return [getAiModel(), getAiFallbackModel()].filter(Boolean);
}

export function isAiConfigured(): boolean {
  return Boolean(getAiApiKey());
}

/**
 * Header request. OpenRouter merekomendasikan HTTP-Referer + X-Title supaya
 * aplikasi bisa diidentifikasi di dashboard dan free-tier-nya tidak nol.
 */
export function aiHeaders(apiKey: string): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${apiKey}`,
  };
  if (isOpenRouter()) {
    headers['HTTP-Referer'] = 'https://klipchip.app';
    headers['X-Title'] = 'KlipChip';
  }
  return headers;
}

function isOpenRouter(): boolean {
  return !/forgeapi\.org/i.test(getAiBaseUrl());
}