'use server';

import { $fetch } from '@/src/app/api';

interface Params {
	languageCode: string;
	id: string | number;
}

export interface NewsResponse {
	statusCode: number;
	message: string;
	data: {
		news: NewsItem;
	};
}

interface NewsItem {
	news_id: number;
	views: number;
	poster_link: string;
	city: string;
	province: string;
	createdAt: string;
	newsTranslations: NewsTranslation[];
	category: {
		category_id: number;
		categoryTranslations: CategoryTranslation[];
	};
	updatedAt: string;
}

interface NewsTranslation {
	title: string;
	content: string;
	link: string;
}

interface CategoryTranslation {
	category_name: string;
}

export async function getNews(
	params: Params
): Promise<NewsResponse | undefined> {
	const { languageCode, id } = params;

	const response = await $fetch(`news/?languageCode=${languageCode}&id=${id}`);
	if (!response.ok) return undefined;
	const data = (await response.json()) as NewsResponse;

	return data;
}
