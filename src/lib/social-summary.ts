import { prisma } from './prisma.ts';

const FORGE_BASE_URL = process.env.FORGE_BASE_URL || 'https://run.forgeapi.org/v1';
const CONTEXT_BUDGET = 4000;

interface SocialCopy {
  title: string;
  desc: string;
  hashtags: string[];
}
interface SocialPackage {
  tiktok: SocialCopy;
  reels: SocialCopy;
  shorts: SocialCopy;
}

function modelCandidates(): string[] {
  const list = [process.env.FORGE_MODEL || 'MiniMax-M3', process.env.FORGE_MODEL_FALLBACK || '']
    .map((m) => m.trim())
    .filter(Boolean);
  return [...new Set(list)];
}

async function forgeChat(content: string): Promise<string | null> {
  const apiKey = process.env.FORGE_API_KEY;
  if (!apiKey) return null;
  for (const model of modelCandidates()) {
    const out = await forgeChatOnce(content, apiKey, model);
    if (out !== null) return out;
  }
  return null;
}

async function forgeChatOnce(content: string, apiKey: string, model: string): Promise<string | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`${FORGE_BASE_URL}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${apiKey}` },
        body: JSON.stringify({
          model,
          messages: [{ role: 'user', content }],
          response_format: { type: 'json_object' },
        }),
        signal: AbortSignal.timeout(30_000),
      });
      if (res.status === 429 || res.status >= 500) {
        if (attempt === 0) {
          await new Promise((r) => setTimeout(r, 1500));
          continue;
        }
        return null;
      }
      if (!res.ok) return null;
      const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
      return data.choices?.[0]?.message?.content ?? null;
    } catch (err) {
      const retriable = err instanceof Error && (err.name === 'AbortError' || err.name === 'TimeoutError' || err.message.includes('fetch'));
      if (attempt === 0 && retriable) {
        await new Promise((r) => setTimeout(r, 1500));
        continue;
      }
      console.warn(`[Forge] degraded (model=${model}):`, err instanceof Error ? err.message : err);
      return null;
    }
  }
  return null;
}

function clampCopy(raw: unknown): SocialCopy | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  const title = typeof r.title === 'string' ? r.title.slice(0, 100) : '';
  const desc = typeof r.desc === 'string' ? r.desc.slice(0, 500) : '';
  const hashtags = Array.isArray(r.hashtags)
    ? r.hashtags.filter((h): h is string => typeof h === 'string').slice(0, 10)
    : [];
  if (!title && !desc) return null;
  return { title, desc, hashtags };
}

export async function summarizeClipForSocial(clipId: string): Promise<boolean> {
  try {
    if (!process.env.FORGE_API_KEY) return false;
    const clip = await prisma.clip.findUnique({ where: { id: clipId } });
    if (!clip) return false;

    let caps: { text?: string; startSeconds?: number; endSeconds?: number }[] = [];
    try {
      const parsed = JSON.parse(clip.captionsJson);
      if (Array.isArray(parsed)) caps = parsed;
    } catch {
      caps = [];
    }
    let context = '';
    for (const c of caps) {
      const line = `[${Number(c.startSeconds) || 0}-${Number(c.endSeconds) || 0}s] ${String(c.text || '')}\n`;
      if (context.length + line.length > CONTEXT_BUDGET) break;
      context += line;
    }
    if (!context.trim()) context = `Judul video: ${clip.videoTitle} oleh ${clip.channelName}.\n`;

    const content = await forgeChat(
      `Kamu ahli social media untuk konten gaming pendek. Berdasarkan transkrip klip berikut, buat SATU paket copy bahasa Indonesia gaya viral untuk tiga platform.\n\n` +
      `Transkrip:\n${context}\n` +
      `Balas HANYA JSON valid dengan bentuk persis:\n` +
      `{"tiktok":{"title":"...","desc":"...","hashtags":["#..."]},"reels":{"title":"...","desc":"...","hashtags":["#..."]},"shorts":{"title":"...","desc":"...","hashtags":["#..."]}}\n` +
      `title maks 100 karakter, desc maks 500 karakter, 5-10 hashtag relevan per platform.`
    );
    if (!content) return false;

    let parsed: unknown;
    try {
      parsed = JSON.parse(content);
    } catch {
      return false;
    }
    const obj = (parsed ?? {}) as Record<string, unknown>;
    const tiktok = clampCopy(obj.tiktok);
    const reels = clampCopy(obj.reels);
    const shorts = clampCopy(obj.shorts);
    if (!tiktok || !reels || !shorts) return false;

    const pkg: SocialPackage = { tiktok, reels, shorts };
    await prisma.clip.update({ where: { id: clipId }, data: { socialSummary: JSON.stringify(pkg) } });
    return true;
  } catch (err) {
    console.warn('[social-summary] gagal (diabaikan):', err instanceof Error ? err.message : err);
    return false;
  }
}
