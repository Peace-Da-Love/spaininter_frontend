'use client';

function createClientFetcher(baseUrl: string) {
  return async function (
    input: string | URL | globalThis.Request,
    init?: RequestInit
  ): Promise<Response> {
    return fetch(`${baseUrl}/api/${input}`, {
      ...init,
      cache: 'no-cache',
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
  };
}

export const $fetchC = createClientFetcher(process.env.NEXT_PUBLIC_API_URL as string);
export const $fetchCP = createClientFetcher(process.env.NEXT_PUBLIC_PROP_URL as string);
