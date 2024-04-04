import { unstable_setRequestLocale } from 'next-intl/server';
import { getCategoriesByLangCode, getNews } from '@/src/app/server-actions';
import { notFound, RedirectType } from 'next/navigation';
import { redirect } from '@/src/shared/utils';
import { NewsPage } from '@/src/screens/news';
import { Metadata } from 'next';
import { Fragment } from 'react';
import { MobileMenu } from '@/src/widgets/mobile-menu';

type Props = {
	params: { locale: string; link: string };
};

export const metadata: Metadata = {
	title: 'Home',
	description: 'This is the home page'
};

export default async function Page({ params: { locale, link } }: Props) {
	const id = link.split('-')[0];
	const initialData = await getNews({
		languageCode: locale,
		id
	});
	const categories = await getCategoriesByLangCode(locale);

	if (!initialData) {
		notFound();
	}

	if (initialData.data.news.newsTranslations[0].link !== link) {
		redirect({
			pathname: '/news/[link]',
			params: {
				link: initialData.data.news.newsTranslations[0].link
			}
		});
	}
	// Enable static rendering
	unstable_setRequestLocale(locale);
	return (
		<Fragment>
			<NewsPage data={initialData} />
			<MobileMenu categories={categories?.data.categories} />
		</Fragment>
	);
}
