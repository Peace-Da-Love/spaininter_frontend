import { PreviewNews } from '@/src/entities/preview-news';
import { NewsCard } from '@/src/entities/news-card';
import { FC } from 'react';
import { NewsItem } from '@/src/shared/types';

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
				hashtagName={previewNews.hashtagName}
				hashtags={previewNews.hashtags}
				date={previewNews.createdAt}
				link={previewNews.link}
				hashtagLink={previewNews.hashtagLink}
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
							hashtagName={item.hashtagName}
							hashtags={item.hashtags}
							date={item.createdAt}
							link={item.link}
							hashtagLink={item.hashtagLink}
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
