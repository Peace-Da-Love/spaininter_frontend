export type News = {
	news_id: number;
	createdAt: string;
	poster_link: string;
	newsTranslations: {
		title: string;
		link: string;
	}[];
	hashtag: {
		hashtag_id: number;
		hashtag_name: string;
	};
};
