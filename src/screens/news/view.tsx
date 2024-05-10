import { NewsResponse } from '@/src/app/server-actions';
import { FC } from 'react';
import { MarkdownNews } from './ui/markdown-news';
import { Navigation } from './ui/navigation';
import { Ad } from './ui/ad';
import { SubscribeNewsTg } from '@/src/shared/components/shared/subscribe-news-tg';
import { PreviewNews } from '@/src/entities/preview-news';
import { DiscussionWidget } from '@/src/entities/discussion-widget';
import Image from 'next/image';

type Props = {
	data: NewsResponse;
};

/**
 * NewsPage renders detailed view of a news article including metadata,
 * content, discussions, and related actions like subscribing to newsletters.
 * It uses the given NewsResponse data to display news content and metadata.
 *
 * @param {Props} props - Contains data for a single news article.
 * @returns {JSX.Element} The NewsPage component.
 */
export const NewsPage: FC<Props> = ({ data }: Props): JSX.Element => {
	// Normalizes line breaks and pipes in news content.
	const normalizedContent = data.data.news.content
		.replace(/\\n/g, '\n')
		.replace(/\\|/g, '');

	return (
		<article id='article-content' aria-labelledby='news-title' role='article'>
			<section className='background-section'>
				<PreviewNews
					imageUrl={data.data.news.posterLink}
					title={data.data.news.title}
					category={data.data.news.categoryName}
					date={data.data.news.createdAt}
					link={data.data.news.link}
					categoryLink={data.data.news.categoryLink}
					city={data.data.news.city}
					isTopNews
				/>
				{/* SEO-friendly hidden image for loading but not displaying */}
				<Image
					src={data.data.news.posterLink}
					alt={`${data.data.news.title.slice(0, 20)}... image`}
					width={600}
					height={600}
					style={{ display: 'none' }}
					priority={true} // Ensures the image is preloaded for better LCP
				/>
			</section>
			<section className='grid sm:grid-cols-none lg:grid-cols-[280px_2fr_280px] lg:gap-10 mt-5 lg:mt-10'>
				<aside className='hidden lg:block' />
				<div className='news-content'>
					<MarkdownNews markdown={normalizedContent} />
					<div className='actions mt-10 text-center'>
						<DiscussionWidget />
						<Ad adLink={data.data.news.adLink} city={data.data.news.city} />
					</div>
				</div>
				<aside className='hidden lg:block'>
					<div className={'sticky top-5 left-0 w-full flex flex-col gap-4'}>
						<Navigation markdown={normalizedContent} />
						<SubscribeNewsTg />
					</div>
				</aside>
			</section>
		</article>
	);
};
