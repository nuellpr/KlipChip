// QA todo 10 - timeout/retry/degradasi provider AI dengan stub global.fetch.
// Jalankan: node scripts/test/ai-resilience.mjs
import assert from 'node:assert/strict';

// src/lib/ai-provider.ts prioritise OPENROUTER_* di atas FORGE_*, dan env
// tingkat OS bisa menimpa apa pun. Stub WAJIB memakai nama berprioritas tinggi
// supaya test tidak menembak API sungguhan.
process.env.OPENROUTER_API_KEY = 'qa-key';
process.env.OPENROUTER_BASE_URL = 'http://127.0.0.1:1/v1';
delete process.env.FORGE_API_KEY;
delete process.env.FORGE_BASE_URL;

const { generateAiHighlights } = await import('../../src/lib/highlight-ai.ts');

const goodBody = {
  choices: [
    {
      message: {
        content: JSON.stringify({
          highlights: [
            {
              startSeconds: 5,
              endSeconds: 20,
              totalScore: 90,
              title: 'Momen keren',
              tags: ['gokil'],
              description: 'Clutch.',
            },
          ],
        }),
      },
    },
  ],
};

const segs = [{ startSeconds: 0, endSeconds: 5, text: 'halo' }];
const meta = { title: 'T', channelName: 'C', durationSeconds: 60 };

// Skenario A — attempt pertama network error, kedua sukses → hasil terurai.
let calls = 0;
globalThis.fetch = async () => {
  calls++;
  if (calls === 1) throw new TypeError('fetch failed');
  return { ok: true, json: async () => goodBody };
};
const rA = await generateAiHighlights(segs, meta);
assert.equal(calls, 2, `harus tepat 2 panggilan (dapat ${calls})`);
assert.ok(Array.isArray(rA), 'hasil harus array highlight');
assert.equal(rA.length, 1);
assert.equal(rA[0].totalScore, 90);

// Skenario B — selalu gagal → null setelah TEPAT 2 panggilan + warn degradasi.
calls = 0;
const warns = [];
const origWarn = console.warn;
console.warn = (...a) => warns.push(a.join(' '));
try {
  globalThis.fetch = async () => {
    calls++;
    throw new TypeError('fetch failed');
  };
  const rB = await generateAiHighlights(segs, meta);
  assert.equal(rB, null, 'harus null saat provider AI down');
  assert.equal(calls, 2, `retry maks 2 panggilan (dapat ${calls})`);
  assert.ok(
    warns.some((w) => w.includes('[ai] degraded')),
    'harus ada log degradasi eksplisit'
  );
} finally {
  console.warn = origWarn;
}

console.log('PASS ai-resilience');
