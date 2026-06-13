import { unstable_setRequestLocale } from 'next-intl/server';
import { getNews, metadataAction } from '../../../../../src/app/server-actions';
import { notFound, redirect } from 'next/navigation';
import { NewsPage } from '@/src/screens/news';
import { generateMetadata } from '../../../news/[link]/page';
import { getDiscussionPageUrl } from '@/src/screens/news/lib/get-discussion-page-url';

type Props = {
	params: { locale: string; link: string };
};

export { generateMetadata };

export default async function TmaNewsPage({ params: { locale, link } }: Props) {
	unstable_setRequestLocale(locale);

	const id = link.split('-')[0];
	const [initialData, newsMetadata] = await Promise.all([
		getNews({
			id,
			locale
		}),
		metadataAction.getNewsByIdMetadata({
			id,
			langCode: locale
		})
	]);

	if (!initialData) {
		notFound();
	}

	if (initialData.data.news.link !== link) {
		redirect(`/${locale}/tma/news/${initialData.data.news.link}`);
	}

	return (
		<NewsPage
			data={initialData}
			discussionPageUrl={getDiscussionPageUrl(
				newsMetadata,
				locale,
				process.env.SITE_URL
			)}
		/>
	);
}
