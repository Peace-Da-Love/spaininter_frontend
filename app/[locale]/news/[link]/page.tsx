import { unstable_setRequestLocale } from 'next-intl/server';
import {
	getCategoriesByLangCode,
	getNews,
	metadataAction
} from '@/src/app/server-actions';
import { notFound } from 'next/navigation';
import { redirect } from '@/src/shared/utils';
import { NewsPage } from '@/src/screens/news';
import { Metadata } from 'next';
import { Fragment } from 'react';
import { MobileMenu } from '@/src/widgets/mobile-menu';

type Props = {
	params: { locale: string; link: string };
};

const SITE_URL = process.env.SITE_URL;

export async function generateMetadata({
	params: { locale, link }
}: Omit<Props, 'children'>): Promise<Metadata> {
	const metadata = await metadataAction.getNewsByIdMetadata({
		id: link.split('-')[0],
		langCode: locale
	});

	if (!metadata) {
		notFound();
	}

	const hrefLangs: Record<string, string> = metadata?.data.links.reduce(
		(acc, locale) => {
			acc[
				locale.language.language_code
			] = `${SITE_URL}/${locale.language.language_code}/news/${locale.link}`;
			return acc;
		},
		{} as Record<string, string>
	);

	return {
		title: metadata?.data.news.title,
		description: metadata?.data.news.description,
		other: {
			'article:published_time': metadata?.data.news.createdAt as string,
			'article:modified_time': metadata?.data.news.updatedAt as string
		},
		alternates: {
			languages: {
				'x-default': hrefLangs['en'],
				...hrefLangs
			},
			canonical: hrefLangs['en']
		},
		openGraph: {
			images: [
				{
					url: metadata?.data.news.posterLink as string
				}
			]
		}
	};
}

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
