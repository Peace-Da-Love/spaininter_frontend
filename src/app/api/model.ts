import axios from 'axios';

const BASE_URL = process.env.API_URL as string;

export const $api = axios.create({
	baseURL: `http://localhost:8000/api`,
	withCredentials: true,
	headers: {
		'Content-Type': 'application/json'
	}
});

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
