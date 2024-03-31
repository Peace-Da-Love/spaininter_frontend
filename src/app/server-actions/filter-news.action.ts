'use server';

import { $fetch } from '@/src/app/api';
import { News } from '@/src/shared/types';

export interface INewsFilterResponse {
	statusCode: number;
	message: string;
	data: {
		news: {
			categoryName: string;
			page: number;
			pages: number;
			count: number;
			rows: News[];
		};
	};
}

type Params = {
	languageCode: string;
	page?: number | string;
	search?: string;
};

export async function getNewsFilter(
	params: Params
): Promise<INewsFilterResponse | undefined> {
	const languageCode = params.languageCode;
	const limit = 8;
	const page = params.page ?? 1;
	const search = params.search ?? 'latest';

	const response = await $fetch(
		`news/news-by-filter/?languageCode=${languageCode}&limit=${limit}&page=${page}&search=${search}`
	);
	if (!response.ok) return undefined;
	const data = (await response.json()) as INewsFilterResponse;

	return data;
}
