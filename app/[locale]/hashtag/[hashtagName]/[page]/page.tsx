import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import {
	getFilterNews
} from '../../../../../src/app/server-actions';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { capitalize } from '@/src/shared/utils';
import { locales } from '@/src/shared/configs';
import { CategoryPage } from '@/src/screens/category';

type Props = {
	params: { locale: string; page: string; hashtagName: string };
};

const SITE_URL = process.env.SITE_URL;

export async function generateMetadata({
	params: { locale, hashtagName, page }
}: Omit<Props, 'children'>): Promise<Metadata> {
	const t = await getTranslations({
		locale
	});

	const refactoredHashtagName = hashtagName.includes('-')
		? hashtagName.split('-').join('/')
		: hashtagName;
	const hashtag = capitalize(refactoredHashtagName || 'Hashtag');

	const hrefLangs: Record<string, string> = locales.reduce((acc, locale) => {
		acc[locale] = `${SITE_URL}/${locale}/hashtag/${hashtagName}/${page}`;
		return acc;
	}, {} as Record<string, string>);

	return {
		title: t('MetaData.HashtagPage.title', { hashtag }),
		description: t('MetaData.HashtagPage.description', { hashtag }),
		alternates: {
			languages: {
				'x-default': hrefLangs['en'],
				...hrefLangs
			},
			canonical: hrefLangs['en']
		}
	};
}

export default async function Page({
	params: { locale, page, hashtagName }
}: Props) {
	// Enable static rendering
	unstable_setRequestLocale(locale);

	const initialData = await getFilterNews({
		page: parseInt(page),
		hashtag: hashtagName,
		locale
	});

	if (!initialData) {
		notFound();
	}

	const t = await getTranslations({
		locale
	});

	return (
		<CategoryPage
			data={initialData}
			hashtagLink={hashtagName}
			title={t('MetaData.HashtagPage.title', {
				hashtag: capitalize(hashtagName.replace(/-/g, '/'))
			})}
		/>
	);
}

