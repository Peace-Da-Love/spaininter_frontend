"use client";
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { locales } from '@/src/shared/configs';

export type Gift = {
  background?: string | null;
  pattern?: string | null;
  model?: string | null;
  rarity?: string | null;
};

export type User = {
  id: number;
  telegram_id?: string | null;
  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  photo_url?: string | null;
  gift?: Gift | null;
};

interface AuthState {
  accessToken: string | null;
  user: User | null;
  hasHydrated: boolean;
  setHasHydrated: (value: boolean) => void;
  setAccessToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  clearAuth: () => void;
  isAuthenticated: () => boolean;
  validateToken: () => Promise<void>;
  refreshAccessToken: () => Promise<string | null>;
  fetchWithAuth: (input: string | URL | globalThis.Request, init?: RequestInit) => Promise<Response>;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;
let refreshPromise: Promise<string | null> | null = null;

const withApiBaseUrl = (input: string | URL | globalThis.Request) => {
  if (typeof input !== 'string') return input;
  if (/^https?:\/\//i.test(input)) return input;
  if (!API_BASE_URL) return input;
  const prefix = input.startsWith('/') ? '' : '/';
  return `${API_BASE_URL}${prefix}${input}`;
};

const getLocaleFromPath = () => {
  try {
    const parts = window.location.pathname.split('/').filter(Boolean);
    if (parts.length && locales.includes(parts[0] as any)) return parts[0];
  } catch {
    // ignore
  }
  return 'en';
};

const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      hasHydrated: false,
      setHasHydrated: (value: boolean) => {
        set(() => ({ hasHydrated: value }));
      },
      setAccessToken: (token: string | null) => {
        set(() => ({ accessToken: token }));
      },
      setUser: (user: User | null) => {
        set(() => ({ user }));
      },
      clearAuth: () => {
        set(() => ({ accessToken: null, user: null }));
      },
      isAuthenticated: () => Boolean(get().accessToken),
      refreshAccessToken: async () => {
        try {
          if (!API_BASE_URL) return null;
          const res = await fetch(`${API_BASE_URL}/api/auth/user/refresh`, {
            method: 'POST',
            credentials: 'include',
          });
          if (!res.ok) return null;
          const data = await res.json();
          if (data?.accessToken) {
            set(() => ({ accessToken: data.accessToken }));
            return data.accessToken;
          }
          return null;
        } catch {
          return null;
        }
      },
      fetchWithAuth: async (input, init) => {
        const token = get().accessToken;
        const headers = new Headers(init?.headers || {});
        if (token) {
          headers.set('Authorization', `Bearer ${token}`);
        }
        const url = withApiBaseUrl(input);
        const res = await fetch(url, { ...init, headers, credentials: 'include'});
        if (res.status !== 401) return res;

        if (!refreshPromise) {
          refreshPromise = get().refreshAccessToken();
        }
        const newToken = await refreshPromise;
        refreshPromise = null;

        if (!newToken) {
          set(() => ({ accessToken: null, user: null }));
          return res;
        }

        const retryHeaders = new Headers(init?.headers || {});
        retryHeaders.set('Authorization', `Bearer ${newToken}`);
        return fetch(url, { ...init, headers: retryHeaders, credentials: 'include' });
      },
      validateToken: async () => {
        const token = get().accessToken;
        if (!token) return;

        try {
          const res = await get().fetchWithAuth('/api/user/me');
          if (res.ok) {
            const data = await res.json();
            if (data?.user) {
              set(() => ({ user: data.user }));
            }
          } else if (res.status === 401) {
            set(() => ({ accessToken: null, user: null }));
          }
        } catch {
          // network error — keep token but don't crash
        }
      },
    }),
    {
      name: 'spaininter-auth',
      partialize: state => ({ accessToken: state.accessToken, user: state.user }),
      onRehydrateStorage: () => state => {
        state?.setHasHydrated(true);
      },
    }
  )
);

export default useAuth;
