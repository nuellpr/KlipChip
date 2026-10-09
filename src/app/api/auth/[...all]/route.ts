import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

// Semua endpoint Better Auth (sign-in, sign-up, sign-out, callback Google,
// get-session) dilayani dari satu file ini.
export const { POST, GET } = toNextJsHandler(auth);