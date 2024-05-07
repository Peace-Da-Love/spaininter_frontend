import { unstable_setRequestLocale } from 'next-intl/server';
import { getNews, metadataAction } from '@/src/app/server-actions';
import { notFound } from 'next/navigation';
import { redirect } from '@/src/shared/utils';
import { NewsPage } from '@/src/screens/news';
import { Metadata } from 'next';

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
	// Enable static rendering
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
		redirect({
			pathname: '/news/[link]',
			params: {
				link: initialData.data.news.link
			}
		});
	}

	return <NewsPage data={initialData} />;
}
