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

export async function getLatestNewsAction(): Promise<
	IFilterNewsResponse | undefined
> {
	const limit = 14;

	const response = await $fetch(`news/latest?limit=${limit}`);
	if (!response.ok) return undefined;
	const data = (await response.json()) as IFilterNewsResponse;

	return data;
}
