'use server';

import { $fetch } from '@/src/app/api';
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
};

export async function getFilterNews(
	params: Params
): Promise<ILatestNewsResponse | undefined> {
	const limit = 14;

	const response = await $fetch(
		`news/filter?limit=${limit}&page=${params.page}&category=${params.category}`
	);
	if (!response.ok) return undefined;
	const data = (await response.json()) as ILatestNewsResponse;

	return data;
}
