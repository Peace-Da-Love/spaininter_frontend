import { FC } from 'react';
import { NewsCard } from '@/src/entities/news-card';
import { NewsItem } from '@/src/shared/types';

type Props = {
	news: NewsItem[];
};

export const NewsCards: FC<Props> = ({ news }) => {
	return (
		<div
			className={
				'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr gap-2.5 sm:gap-5'
			}
		>
			{news.map(item => {
				return (
					<NewsCard
						key={`News item - ${item.newsId}`}
						imageUrl={item.posterLink}
						title={item.title}
						category={item.categoryName}
						date={item.createdAt}
						link={item.link}
						categoryLink={item.categoryLink}
						city={item.city}
						className={'col-span-1'}
					/>
				);
			})}
		</div>
	);
};
