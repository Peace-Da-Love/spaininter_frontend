const BASE_URL = process.env.API_URL as string;

export const $fetch = async function(
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
