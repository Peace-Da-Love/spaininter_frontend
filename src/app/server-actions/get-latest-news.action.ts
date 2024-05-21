'use server';

import { $fetch } from '@/src/app/api';
import { News, NewsItem } from '@/src/shared/types';

export interface IFilterNewsResponse {
	statusCode: number;
	message: string;
	data: {
		currentPage: number;
		pageCount: number;
		hasNextPage: boolean;
		hasPreviousPage: boolean;
		news: NewsItem[];
	};
}

type Params = {
	locale: string;
};

export async function getLatestNewsAction(
	params: Params
): Promise<IFilterNewsResponse | undefined> {
	const limit = 34;

	const response = await $fetch(`news/latest?limit=${limit}`, {
		headers: {
			'Accept-Language': params.locale
		}
	});
	if (!response.ok) return undefined;
	const data = (await response.json()) as IFilterNewsResponse;

	return data;
}
