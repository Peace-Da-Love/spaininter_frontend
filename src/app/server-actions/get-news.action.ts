'use server';

import { $fetch } from '@/src/app/api';

interface Params {
	id: string | number;
}

export interface NewsResponse {
	statusCode: number;
	message: string;
	data: {
		news: INews;
	};
}

interface INews {
	newsId: number;
	posterLink: string;
	city: string;
	title: string;
	content: string;
	link: string;
	categoryId: number;
	categoryName: string;
	categoryLink: string;
	views: number;
	createdAt: string;
	updatedAt: string;
}

export async function getNews(
	params: Params
): Promise<NewsResponse | undefined> {
	const { id } = params;

	const response = await $fetch(`news/site/${id}`);
	if (!response.ok) return undefined;
	const data = (await response.json()) as NewsResponse;

	return data;
}
