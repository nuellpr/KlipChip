/**
 * Highlight AI via Forge Gateway (OpenAI-compatible).
 * Dipakai di /api/extract-metadata untuk skor golden momen.
 * Jika FORGE_API_KEY tidak diisi, fallback ke heuristik lokal.
 */

export interface TranscriptSegment {
  startSeconds: number;
  endSeconds: number;
  text: string;
}

export interface AiHighlight {
  startSeconds: number;
  endSeconds: number;
  totalScore: number;
  title: string;
  tags: string[];
  description: string;
}

const FORGE_BASE_URL = 'https://run.forgeapi.org/v1';
const DEFAULT_MODEL = 'MiniMax-M3'; // Free tier yang benar-benar jalan dengan saldo $0 (tested OK), 1M context
const FORGE_TIMEOUT_MS = 30_000;
const FORGE_MAX_ATTEMPTS = 2;
const FORGE_BACKOFF_MS = 1500;

/**
 * Fetch Forge dengan timeout + 1 retry (total maks 2 percobaan).
 * Retry HANYA untuk network error/AbortError/HTTP 429/5xx; error HTTP lain
 * langsung null. Gagal total → log degradasi eksplisit → null (heuristik lokal
 * yang melanjutkan).
 */
async function forgeFetchWithRetry(
  body: string,
  apiKey: string,
  model: string
): Promise<Response | null> {
  let lastReason = 'unknown';
  for (let attempt = 1; attempt <= FORGE_MAX_ATTEMPTS; attempt++) {
    try {
      const res = await fetch(`${FORGE_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body,
        signal: AbortSignal.timeout(FORGE_TIMEOUT_MS),
      });
      if (res.ok) return res;
      if (res.status !== 429 && res.status < 500) {
        const errText = await res.text();
        console.warn(`[Forge] ${model} error ${res.status}:`, errText.slice(0, 300));
        return null;
      }
      lastReason = `HTTP ${res.status}`;
    } catch (e) {
      lastReason = e instanceof Error ? `${e.name}: ${e.message}` : String(e);
    }
    if (attempt < FORGE_MAX_ATTEMPTS) {
      await new Promise((r) => setTimeout(r, FORGE_BACKOFF_MS));
    }
  }
  console.warn(
    `[Forge] degraded ke heuristik lokal setelah ${FORGE_MAX_ATTEMPTS} percobaan: ${lastReason}`
  );
  return null;
}

function getForgeConfig() {
  return {
    apiKey: process.env.FORGE_API_KEY || '',
    model: process.env.FORGE_MODEL || DEFAULT_MODEL,
  };
}

export function isForgeConfigured(): boolean {
  return !!getForgeConfig().apiKey;
}

/**
 * Panggil Forge untuk skor highlight. Mengembalikan 3 highlight terbaik atau null jika gagal.
 */
export async function generateHighlightsWithForge(
  segments: TranscriptSegment[],
  videoMeta: { title: string; channelName: string; durationSeconds: number }
): Promise<AiHighlight[] | null> {
  const { apiKey, model } = getForgeConfig();
  if (!apiKey) return null;
  if (segments.length === 0) return null;

  // Batasi transcript agar tidak boros token: ambil 80 segmen pertama / potong 12k karakter
  const transcriptForPrompt = segments
    .slice(0, 80)
    .map((s) => `[${s.startSeconds.toFixed(1)}-${s.endSeconds.toFixed(1)}s] ${s.text}`)
    .join('\n')
    .slice(0, 12000);

  const systemPrompt = `Kamu adalah AI clipper Indonesia ahli viral TikTok/Reels/Shorts. Tugas: pilih 3 GOLDEN MOMEN paling viral dari transcript livestream gaming/podcast Indonesia.

Kriteria skor (0-100):
- Hook kuat 3 detik pertama (pertanyaan, kontroversi, pengakuan)
- Emosi tinggi (teriakan, tawa, kaget), slang gaming Indo (bjir, gokil, ggwp, clutch, bocil kematian, anjir, hoki seumur hidup, kocak gaming, mati konyol)
- Konflik/payoff jelas, bukan filler

Output HARUS JSON valid tanpa markdown:
{"highlights":[{"start":number,"end":number,"score":number,"title":string,"tags":[string],"description":string}]}

Aturan:
- start/end detik (5-40 detik durasi per klip, jangan overlap lebih dari 5 detik)
- score 75-99, urut desc
- title pendek viral (maks 60 karakter)
- tags 2-3 kata kunci
- description 1 kalimat kenapa viral
- WAJIB pilih momen yang ada di transcript, jangan halusinasi timestamp di luar durasi`;

  const userPrompt = `Judul video: "${videoMeta.title}"
Channel: ${videoMeta.channelName}
Durasi: ${videoMeta.durationSeconds} detik

Transcript (timestamped):
${transcriptForPrompt}

Pilih 3 golden momen:`;

  try {
    const res = await forgeFetchWithRetry(
      JSON.stringify({
        model,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
      apiKey,
      model
    );
    if (!res) return null;

    const data = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const content = data.choices?.[0]?.message?.content;
    if (!content) return null;

    const parsed = JSON.parse(content) as { highlights?: AiHighlight[] };
    if (!Array.isArray(parsed.highlights) || parsed.highlights.length === 0) return null;

    // Validasi & clamp
    const validated = parsed.highlights
      .slice(0, 3)
      .map((h) => ({
        startSeconds: Math.max(0, Math.min(h.startSeconds, videoMeta.durationSeconds - 5)),
        endSeconds: Math.max(h.startSeconds + 5, Math.min(h.endSeconds, videoMeta.durationSeconds)),
        totalScore: (() => {
          const raw = (h.totalScore ?? (h as unknown as { score?: number }).score ?? 80) as number;
          const normalized = raw <= 1 ? raw * 100 : raw;
          return Math.max(70, Math.min(99, Math.round(normalized)));
        })(),
        title: String(h.title || 'Momen Viral').slice(0, 80),
        tags: Array.isArray(h.tags) ? h.tags.slice(0, 3).map(String) : ['Viral'],
        description: String(h.description || '').slice(0, 160),
      }))
      .filter((h) => h.endSeconds - h.startSeconds >= 5 && h.endSeconds - h.startSeconds <= 45);

    return validated.length >= 1 ? validated : null;
  } catch (e) {
    console.warn('[Forge] highlight AI gagal, fallback heuristik:', e);
    return null;
  }
}
