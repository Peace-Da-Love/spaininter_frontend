import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { getCategoryByName, getNewsFilter } from '@/src/app/server-actions';
import { HomePage } from '@/src/screens/home';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { capitalize } from '@/src/shared/utils';
import { locales } from '@/src/shared/configs';

type Props = {
	params: { locale: string; page: string; categoryName: string };
};

const SITE_URL = process.env.SITE_URL;

export async function generateMetadata({
	params: { locale, categoryName, page }
}: Omit<Props, 'children'>): Promise<Metadata> {
	const t = await getTranslations({
		locale
	});

	let category: string;

	if (categoryName === 'latest') {
		category = t('IndexPage.navigation.latest');
	} else {
		const refactoredCategoryName = categoryName.includes('-')
			? categoryName.split('-').join('/')
			: categoryName;
		const trCategory = await getCategoryByName({
			langCode: locale,
			name: refactoredCategoryName
		});
		category = capitalize(trCategory?.data.categoryName || 'Category');
	}

	const hrefLangs: Record<string, string> = locales.reduce((acc, locale) => {
		acc[locale] = `${SITE_URL}/${locale}/category/${categoryName}/${page}`;
		return acc;
	}, {} as Record<string, string>);

	return {
		title: t('MetaData.CategoryPage.title', { category }),
		description: t('MetaData.CategoryPage.description', { category }),
		alternates: {
			languages: {
				'x-default': hrefLangs['en'],
				...hrefLangs
			},
			canonical: `${SITE_URL}/${locale}/category/${categoryName}/${page}`
		}
	};
}

export default async function Page({
	params: { locale, page, categoryName }
}: Props) {
	const refactoredCategoryName = categoryName.includes('-')
		? categoryName.split('-').join('/')
		: categoryName;
	const initialData = await getNewsFilter({
		languageCode: locale,
		page: page,
		search: refactoredCategoryName
	});

	if (!initialData) {
		notFound();
	}

	const t = await getTranslations({
		locale
	});

	let category: string;

	if (categoryName === 'latest') {
		category = t('IndexPage.navigation.latest');
	} else {
		const refactoredCategoryName = categoryName.includes('-')
			? categoryName.split('-').join('/')
			: categoryName;
		const trCategory = await getCategoryByName({
			langCode: locale,
			name: refactoredCategoryName
		});
		category = capitalize(trCategory?.data.categoryName || 'Category');
	}

	// Enable static rendering
	unstable_setRequestLocale(locale);
	return (
		<HomePage
			title={t('MetaData.CategoryPage.title', { category })}
			data={initialData}
		/>
	);
}
