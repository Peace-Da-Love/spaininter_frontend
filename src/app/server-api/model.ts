'use server';

const BASE_URL = process.env.API_URL as string;
const CATALOG_URL = process.env.API_URL_CATALOG as string;

export const $fetchS = async function(
	input: string | URL | globalThis.Request,
	init?: RequestInit,
	api: string = 'base'
): Promise<Response> {
	const URL_API = api === 'catalog' ? CATALOG_URL : BASE_URL;
	return fetch(`${URL_API}/api/${input}`, {
		...init,
		cache: 'no-store',
		headers: {
			'Content-Type': 'application/json',
			...init?.headers
		}
	});
};
