import { NewsHashtag } from './news-card.type';

export interface NewsItem {
	newsId: number;
	title: string;
	link: string;
	hashtagName: string;
	hashtagLink: string;
	hashtags?: NewsHashtag[];
	posterLink: string;
	city: string;
	createdAt: string;
}
