import assert from 'node:assert/strict';
import { isRenderableSourceUrl } from '../../src/lib/url-guard.ts';

const allow = [
  'https://youtube.com/watch?v=dQw4w9WgXcQ',
  'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
  'https://youtu.be/dQw4w9WgXcQ',
  'https://twitch.tv/videos/123456',
  'https://www.twitch.tv/videos/123456',
  'https://m.twitch.tv/videos/123456',
  'https://player.twitch.tv/?video=123456',
];

const deny = [
  'http://youtube.com/watch?v=dQw4w9WgXcQ',
  'http://youtu.be/x',
  'https://evil.com/x',
  'https://youtube.com.evil.com/x',
  'https://notyoutube.com/watch?v=x',
  'javascript:alert(1)',
  'ftp://youtu.be/x',
  '',
  'bukan url',
];

for (const u of allow) assert.equal(isRenderableSourceUrl(u), true, `should allow: ${u}`);
for (const u of deny) assert.equal(isRenderableSourceUrl(u), false, `should deny: ${u}`);

console.log('PASS url-guard');
