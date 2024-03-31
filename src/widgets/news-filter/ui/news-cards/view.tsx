import { NewsCard } from '@/src/entities/news-card';
import { News } from '@/src/shared/types';
import { FC } from 'react';
import { useTranslations } from 'next-intl';

type Props = {
	news: News[];
};

export const NewsCards: FC<Props> = ({ news }) => {
	const t = useTranslations('Alarms');

	return (
		<div
			className={
				'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr gap-2.5 sm:gap-5'
			}
		>
			{news.map(news => {
				return (
					<NewsCard
						key={news.news_id}
						imageUrl={news.poster_link}
						title={news.newsTranslations[0].title}
						category={news.category.categoryTranslations[0].category_name}
						date={news.createdAt}
						link={news.newsTranslations[0].link}
						className={'col-span-1'}
					/>
				);
			})}
			{news.length === 0 && (
				<div className={'col-span-4 flex justify-center items-center pt-10'}>
					<p className={'text-primary text-4xl'}>{t('empty')}</p>
				</div>
			)}
		</div>
	);
};
