'use client';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const $fetchC = async function(
	input: string | URL | globalThis.Request,
	init?: RequestInit
): Promise<Response> {
	return fetch(`${BASE_URL}/api/${input}`, {
		...init,
		cache: 'no-cache',
		headers: {
			'Content-Type': 'application/json',
			...init?.headers
		}
	});
};
