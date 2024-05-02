'use server';

import { cookies } from 'next/headers';

const BASE_URL = process.env.API_URL as string;

export const $fetch = async function(
	input: string | URL | globalThis.Request,
	init?: RequestInit
): Promise<Response> {
	const cookieStore = cookies();
	const locale = cookieStore.get('NEXT_LOCALE');

	return fetch(`${BASE_URL}/api/${input}`, {
		...init,
		cache: 'no-cache',
		headers: {
			'Content-Type': 'application/json',
			'Accept-Language': locale?.value ?? 'en',
			...init?.headers
		}
	});
};
