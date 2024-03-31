import { PreviewNews } from '@/src/entities/preview-news';
import { useLocale } from 'next-intl';
import { getRecommendedNews } from '@/src/app/server-actions';
import { NewsCard } from '@/src/entities/news-card';

export const Recommends = async () => {
	const locale = useLocale();
	const news = await getRecommendedNews({ languageCode: locale });

	if (!news) return <div>Error!</div>;

	if (!news.data.news.rows.length) return <div>No news found!</div>;

	const previewNews = news.data.news.rows[0];
	const concatNews = news.data.news.rows.slice(1);

	return (
		<div className={'flex flex-col lg:grid lg:grid-cols-4 gap-5'}>
			<PreviewNews
				imageUrl={previewNews.poster_link}
				title={previewNews.newsTranslations[0].title}
				category={previewNews.category.categoryTranslations[0].category_name}
				date={previewNews.createdAt}
				link={previewNews.newsTranslations[0].link}
				className={'lg:col-span-3'}
			/>
			<div
				className={
					'hidden lg:flex lg:col-span-1 lg:flex-col gap-2.5 item lg:justify-between'
				}
			>
				{concatNews.map(item => {
					return (
						<NewsCard
							key={`Recommended news item - ${item.news_id}`}
							imageUrl={item.poster_link}
							title={item.newsTranslations[0].title}
							category={item.category.categoryTranslations[0].category_name}
							date={item.createdAt}
							link={item.newsTranslations[0].link}
							variant='horizontal'
							className={'flex-none max-w-xs'}
						/>
					);
				})}
			</div>
		</div>
	);
};
