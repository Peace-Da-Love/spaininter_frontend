'use server';

function createFetcher(baseUrl: string) {
	return async function (
		input: string | URL | globalThis.Request,
		init?: RequestInit
	): Promise<Response> {
		return fetch(`${baseUrl}/api/${input}`, {
		...init,
		cache: "no-store",
		headers: {
			"Content-Type": "application/json",
			...init?.headers,
		},
		});
	};
}

export const $fetchS = createFetcher(process.env.API_URL as string);
export const $fetchP = createFetcher(process.env.PROP_URL as string);
