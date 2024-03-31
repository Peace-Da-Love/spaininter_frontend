export type News = {
	news_id: number;
	createdAt: string;
	poster_link: string;
	newsTranslations: {
		title: string;
		link: string;
	}[];
	category: {
		category_id: number;
		categoryTranslations: {
			category_name: string;
		}[];
	};
};
