'use client';

function createClientFetcher(proxyPrefix: string, baseUrl?: string) {
  return async function (
    input: string | URL | globalThis.Request,
    init?: RequestInit
  ): Promise<Response> {
    // Always prefer same-origin proxy routes in browser to avoid CORS/mixed-content issues.
    const prefix = proxyPrefix || baseUrl || '';
    const path = typeof input === 'string' ? input.replace(/^\/+/, '') : String(input);
    const url = prefix ? `${prefix}/${path}` : `/${path}`;

    return fetch(url, {
      ...init,
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  };
}

export const $fetchC = createClientFetcher(
  '/site-api',
  process.env.NEXT_PUBLIC_API_URL as string
);
export const $fetchCP = createClientFetcher(
  '/prop-api',
  process.env.NEXT_PUBLIC_PROP_URL as string
);
