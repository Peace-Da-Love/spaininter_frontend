"use client";

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import useAuth from '@/src/shared/stores/auth';
import { locales } from '@/src/shared/configs';

export const AuthInit = () => {
  const router = useRouter();
  const setAccessToken = useAuth(state => state.setAccessToken);
  const setUser = useAuth(state => state.setUser);
  const validateToken = useAuth(state => state.validateToken);
  const refreshAccessToken = useAuth(state => state.refreshAccessToken);
  const didRun = useRef(false);

  useEffect(() => {
    // React StrictMode runs effects twice in dev; prevent double handoff
    if (didRun.current) return;
    didRun.current = true;
    const run = async () => {
      try {
        const pathParts = window.location.pathname.split('/').filter(Boolean);
        if (
          pathParts.length >= 2 &&
          locales.includes(pathParts[0] as any) &&
          pathParts[1] === 'tma'
        ) {
          return;
        }

        const params = new URLSearchParams(window.location.search);
        const authToken = params.get('authToken');

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

            // remove authToken from URL
            params.delete('authToken');
            const newSearch = params.toString();
            const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash;
            window.history.replaceState({}, '', newUrl);

            // redirect to locale-aware profile
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

            router.push(`/${detectLocale()}/profile`);
            return;
          } else {
            // failed to exchange token, just remove param
            params.delete('authToken');
            const newSearch = params.toString();
            const newUrl = window.location.pathname + (newSearch ? `?${newSearch}` : '') + window.location.hash;
            window.history.replaceState({}, '', newUrl);
          }
        }

        // No authToken: try refresh if accessToken missing, then validate
        try {
          const currentToken = useAuth.getState().accessToken;
          if (!currentToken) {
            await refreshAccessToken();
          }
          await validateToken();
        } catch {
          // ignore
        }
      } catch (e) {
        // ignore errors client-side
      }
    };

    run();
    // run only once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default AuthInit;
