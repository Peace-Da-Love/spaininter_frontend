import { PreviewNews } from '@/src/entities/preview-news';
import { useLocale } from 'next-intl';
import { getRecommendedNews, NewsItem } from '@/src/app/server-actions';
import { NewsCard } from '@/src/entities/news-card';
import { FC } from 'react';

type Props = {
	news: NewsItem[];
};

export const TopBar: FC<Props> = ({ news }) => {
	if (!news.length) return <div>No news found!</div>;

	const previewNews = news[0];
	const concatNews = news.slice(1);

	return (
		<div className={'flex flex-col lg:grid lg:grid-cols-4 gap-5'}>
			<PreviewNews
				imageUrl={previewNews.posterLink}
				title={previewNews.title}
				category={previewNews.categoryName}
				date={previewNews.createdAt}
				link={previewNews.link}
				categoryLink={previewNews.categoryLink}
				city={previewNews.city}
				className={'lg:col-span-3'}
			/>
			<div
				className={'flex col-span-1 flex-col gap-2.5 item lg:justify-between'}
			>
				{concatNews.map(item => {
					return (
						<NewsCard
							key={`Top bar news item - ${item.newsId}`}
							imageUrl={item.posterLink}
							title={item.title}
							category={item.categoryName}
							date={item.createdAt}
							link={item.link}
							categoryLink={item.categoryLink}
							variant='horizontal'
							city={item.city}
							className={'flex-none'}
						/>
					);
				})}
			</div>
		</div>
	);
};
