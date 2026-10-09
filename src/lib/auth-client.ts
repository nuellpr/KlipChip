'use client';

/**
 * Client Better Auth.
 *
 * baseURL dikosongkan agar mengikuti origin halaman saat ini -- dengan begitu
 * dev server di belakang ngrok tetap bisa dipakai tanpa ganti config.
 */
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient();

export const { useSession } = authClient;