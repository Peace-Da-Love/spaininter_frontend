'use server';

import { $fetch } from '@/src/app/api';

interface Params {
	languageCode: string;
}

interface RecommendedNewsResponse {
	statusCode: number;
	message: string;
	data: {
		news: {
			page: number;
			pages: number;
			count: number;
			rows: NewsItem[];
		};
	};
}

interface NewsItem {
	news_id: number;
	createdAt: string;
	poster_link: string;
	views: number;
	newsTranslations: NewsTranslation[];
	category: {
		category_id: number;
		categoryTranslations: CategoryTranslation[];
	};
}

interface NewsTranslation {
	title: string;
	link: string;
}

interface CategoryTranslation {
	category_name: string;
}

export async function getRecommendedNews(
	params: Params
): Promise<RecommendedNewsResponse | undefined> {
	const { languageCode } = params;
	const page = 1;
	const limit = 6;

	const response = await $fetch(
		`news/recommended-news/?page=${page}&limit=${limit}&languageCode=${languageCode}`
	);
	if (!response.ok) return undefined;
	const data = await response.json();

	return data;
}
