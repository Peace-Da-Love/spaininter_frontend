import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { getCategoryByName, getNewsFilter } from '@/src/app/server-actions';
import { HomePage } from '@/src/screens/home';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { capitalize } from '@/src/shared/utils';

type Props = {
	params: { locale: string; page: string; categoryName: string };
};

export async function generateMetadata({
	params: { locale, categoryName }
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

	return {
		title: t('MetaData.CategoryPage.title', { category }),
		description: t('MetaData.CategoryPage.description', { category })
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
