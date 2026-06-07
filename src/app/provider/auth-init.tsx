"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import useAuth from '@/src/shared/stores/auth';
import { locales } from '@/src/shared/configs';
import { LoadingSpinner } from '@/src/shared/components/ui/loading-spinner';
import {
  TWITRIS_AUTH_SESSION_KEY,
  TWITRIS_AUTH_SESSION_CREATED_EVENT,
} from '@/src/shared/utils/twitris-webapp';

const AUTH_SESSION_POLL_INTERVAL_MS = 1000;
const AUTH_SESSION_POLL_TIMEOUT_MS = 2 * 60 * 1000;
const AUTH_SUCCESS_BANNER_TIMEOUT_MS = 5000;

type TwitrisAuthBannerStatus = 'idle' | 'waiting' | 'success';

type PendingTwitrisSession = {
  sessionId: string;
  createdAt?: number;
  expiresAt?: number;
  returnTo?: string;
};

const isValidUuid = (value: string) =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );

export const AuthInit = () => {
  const router = useRouter();
  const setAccessToken = useAuth(state => state.setAccessToken);
  const setUser = useAuth(state => state.setUser);
  const validateToken = useAuth(state => state.validateToken);
  const refreshAccessToken = useAuth(state => state.refreshAccessToken);
  const didRun = useRef(false);
  const sessionPollingInProgressRef = useRef(false);
  const successBannerTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const twitrisAuthBannerStatusRef = useRef<TwitrisAuthBannerStatus>('idle');
  const [twitrisAuthBannerStatus, setTwitrisAuthBannerStatus] =
    useState<TwitrisAuthBannerStatus>('idle');

  const getApiBase = () => process.env.NEXT_PUBLIC_API_URL?.trim().replace(/\/$/, '') || '';

  const detectLocale = () => {
    try {
      const parts = window.location.pathname.split('/').filter(Boolean);
      if (parts.length && locales.includes(parts[0] as any)) return parts[0];
      const nav = navigator.language?.split('-')[0];
      if (nav && locales.includes(nav as any)) return nav;
    } catch {
      // ignore
    }
    return 'en';
  };

  const getCurrentUrl = () =>
    `${window.location.pathname}${window.location.search}${window.location.hash}`;

  const getSafeReturnTo = (value?: string) => {
    if (!value || !value.startsWith('/') || value.startsWith('//')) {
      return getCurrentUrl();
    }

    return value;
  };

  const removeAuthTokenFromUrl = () => {
    const params = new URLSearchParams(window.location.search);
    params.delete('authToken');
    const newSearch = params.toString();
    const newUrl =
      window.location.pathname +
      (newSearch ? `?${newSearch}` : '') +
      window.location.hash;
    window.history.replaceState({}, '', newUrl);
  };

  const setAuthBannerStatus = (status: TwitrisAuthBannerStatus) => {
    twitrisAuthBannerStatusRef.current = status;
    setTwitrisAuthBannerStatus(status);
  };

  const clearSuccessBannerTimeout = () => {
    if (successBannerTimeoutRef.current) {
      clearTimeout(successBannerTimeoutRef.current);
      successBannerTimeoutRef.current = null;
    }
  };

  const startSuccessBannerTimeout = () => {
    clearSuccessBannerTimeout();
    successBannerTimeoutRef.current = setTimeout(() => {
      setAuthBannerStatus('idle');
      successBannerTimeoutRef.current = null;
    }, AUTH_SUCCESS_BANNER_TIMEOUT_MS);
  };

  const showSuccessBanner = () => {
    setAuthBannerStatus('success');

    if (document.visibilityState === 'visible') {
      startSuccessBannerTimeout();
    }
  };

  const readPendingSession = (): PendingTwitrisSession | null => {
    try {
      const raw = localStorage.getItem(TWITRIS_AUTH_SESSION_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw) as PendingTwitrisSession;
      if (!parsed?.sessionId || !isValidUuid(parsed.sessionId)) {
        localStorage.removeItem(TWITRIS_AUTH_SESSION_KEY);
        return null;
      }

      const now = Date.now();
      if (parsed.expiresAt && parsed.expiresAt < now) {
        localStorage.removeItem(TWITRIS_AUTH_SESSION_KEY);
        return null;
      }

      return parsed;
    } catch {
      localStorage.removeItem(TWITRIS_AUTH_SESSION_KEY);
      return null;
    }
  };

  const clearPendingSession = () => {
    localStorage.removeItem(TWITRIS_AUTH_SESSION_KEY);
    setAuthBannerStatus('idle');
  };

  const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

  const tryFinalizeTwitrisSession = async (): Promise<boolean> => {
    if (sessionPollingInProgressRef.current) {
      return false;
    }

    const pending = readPendingSession();
    if (!pending) {
      setAuthBannerStatus('idle');
      return false;
    }

    const apiBase = getApiBase();
    if (!apiBase) {
      return false;
    }

    setAuthBannerStatus('waiting');
    sessionPollingInProgressRef.current = true;
    const startedAt = Date.now();

    try {
      while (Date.now() - startedAt < AUTH_SESSION_POLL_TIMEOUT_MS) {
        try {
          const res = await fetch(
            `${apiBase}/api/user/auth/status?sessionId=${encodeURIComponent(
              pending.sessionId,
            )}`,
            {
              method: 'GET',
              credentials: 'include',
              cache: 'no-store',
              headers: {
                'Cache-Control': 'no-cache, no-store, max-age=0',
                Pragma: 'no-cache',
              },
            },
          );

          if (res.ok) {
            const data = await res.json();
            if (data?.success && data?.accessToken) {
              setAccessToken(data.accessToken);
              await validateToken();
              const returnTo = getSafeReturnTo(pending.returnTo);
              localStorage.removeItem(TWITRIS_AUTH_SESSION_KEY);
              showSuccessBanner();
              if (returnTo !== getCurrentUrl()) {
                router.replace(returnTo);
              }
              return true;
            }
          }
        } catch {
          // ignore and continue polling
        }

        await sleep(AUTH_SESSION_POLL_INTERVAL_MS);
      }
    } finally {
      sessionPollingInProgressRef.current = false;
    }

    clearPendingSession();
    return false;
  };

  useEffect(() => {
    const run = async () => {
      try {
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        const params = new URLSearchParams(window.location.search);
        const authToken = params.get('authToken');

        if (
          pathParts.length >= 2 &&
          locales.includes(pathParts[0] as any) &&
          pathParts[1] === 'tma' &&
          !authToken
        ) {
          return;
        }

        if (authToken) {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/auth/handoff`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ authToken }),
          });

          if (res.ok) {
            const data = await res.json();
            if (data?.accessToken) {
              setAccessToken(data.accessToken);
            }
            if (data?.user) {
              setUser(data.user);
            } else if (data?.accessToken) {
              try {
                await validateToken();
              } catch {
                // ignore
              }
            }

            removeAuthTokenFromUrl();

            router.replace(`/${detectLocale()}`);
            return;
          }

          removeAuthTokenFromUrl();
        }

        const finalized = await tryFinalizeTwitrisSession();
        if (finalized) {
          return;
        }

        try {
          const currentToken = useAuth.getState().accessToken;
          if (!currentToken) {
            await refreshAccessToken();
          }
          await validateToken();
        } catch {
          // ignore
        }
      } catch {
        // ignore errors client-side
      }
    };

    if (!didRun.current) {
      didRun.current = true;
      void run();
    }

    const handleSessionCreated = () => {
      clearSuccessBannerTimeout();
      setAuthBannerStatus('waiting');
      void tryFinalizeTwitrisSession();
    };

    const handleVisibilityChange = () => {
      if (
        document.visibilityState === 'visible' &&
        twitrisAuthBannerStatusRef.current === 'success' &&
        !successBannerTimeoutRef.current
      ) {
        startSuccessBannerTimeout();
      }
    };

    window.addEventListener(
      TWITRIS_AUTH_SESSION_CREATED_EVENT,
      handleSessionCreated,
    );
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener(
        TWITRIS_AUTH_SESSION_CREATED_EVENT,
        handleSessionCreated,
      );
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      clearSuccessBannerTimeout();
    };
    // run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (twitrisAuthBannerStatus === 'idle') {
    return null;
  }

  const isSuccessBanner = twitrisAuthBannerStatus === 'success';

  return (
    <div className="fixed right-4 top-4 z-[120] pointer-events-none">
      <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-slate-200 bg-white/95 px-4 py-3 shadow-lg backdrop-blur">
        {isSuccessBanner ? (
          <CheckCircle2 size={18} className="text-emerald-600" />
        ) : (
          <LoadingSpinner size={18} className="text-slate-700" />
        )}
        <div className="text-sm font-medium text-slate-800">
          {isSuccessBanner
            ? 'Регистрация успешно завершена'
            : 'Ожидаем подтверждение в Telegram...'}
        </div>
      </div>
    </div>
  );
};

export default AuthInit;
