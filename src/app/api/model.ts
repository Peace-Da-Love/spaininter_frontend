const BASE_URL = process.env.API_URL as string;

console.log(BASE_URL);

export const $fetch = async function(
	input: string | URL | globalThis.Request,
	init?: RequestInit
): Promise<Response> {
	console.log('input', input);
	return fetch(`${BASE_URL}/api/${input}`, {
		...init,
		cache: 'no-cache',
		headers: {
			'Content-Type': 'application/json',
			...init?.headers
		}
	});
};
