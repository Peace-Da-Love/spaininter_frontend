'use server';

import { $fetchS } from '../server-api';
import { News, NewsItem } from '@/src/shared/types';

export interface ILatestNewsResponse {
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
	page: number;
	category: string;
	locale: string;
};

export async function getFilterNews(
	params: Params
): Promise<ILatestNewsResponse | undefined> {
	const limit = 8;

	const response = await $fetchS(
		`news/filter?limit=${limit}&page=${params.page}&category=${params.category}`,
		{
			headers: {
				'Accept-Language': params.locale
			}
		}
	);
	if (!response.ok) return undefined;
	const data = (await response.json()) as ILatestNewsResponse;

	return data;
}
