import { unstable_setRequestLocale } from 'next-intl/server';
import { getNews } from '../../../../../src/app/server-actions';
import { notFound, redirect } from 'next/navigation';
import { NewsPage } from '@/src/screens/news';
import { generateMetadata } from '../../../news/[link]/page';

type Props = {
	params: { locale: string; link: string };
};

export { generateMetadata };

export default async function TmaNewsPage({ params: { locale, link } }: Props) {
	unstable_setRequestLocale(locale);

	const id = link.split('-')[0];
	const initialData = await getNews({
		id,
		locale
	});

	if (!initialData) {
		notFound();
	}

	if (initialData.data.news.link !== link) {
		redirect(`/${locale}/tma/news/${initialData.data.news.link}`);
	}

	return <NewsPage data={initialData} />;
}
