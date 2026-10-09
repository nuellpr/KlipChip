'use client';

import { useState, useEffect, useCallback } from 'react';
import { authClient } from './auth-client';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  balanceClips: number;
  avatarUrl?: string;
  role: string;
}

/**
 * Hook auth yang bentuknya sama seperti versi HMAC buatan sendiri, supaya
 * AuthGate, navbar, profile page, dan halaman admin tidak perlu diubah.
 *
 * Yang berubah adalah asalnya: session sekarang dari Better Auth (tabel
 * Session), bukan cookie HMAC ber-stateless.
 */
export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user ?? null);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const login = async (email: string, password: string) => {
    const result = await authClient.signIn.email({ email, password });
    if (result.error) {
      throw new Error(result.error.message || 'Email atau password salah.');
    }
    await refresh();
    return user;
  };

  const register = async (email: string, password: string, name: string) => {
    const result = await authClient.signUp.email({ email, password, name });
    if (result.error) {
      throw new Error(result.error.message || 'Gagal mendaftar.');
    }
    await refresh();
    return user;
  };

  const loginWithGoogle = async () => {
    const result = await authClient.signIn.social({
      provider: 'google',
      callbackURL: '/studio',
    });
    if (result.error) {
      throw new Error(result.error.message || 'Login Google gagal.');
    }
  };

  const logout = async () => {
    try {
      await authClient.signOut();
    } finally {
      setUser(null);
    }
  };

  return { user, isLoading, login, register, loginWithGoogle, logout, refresh };
}
