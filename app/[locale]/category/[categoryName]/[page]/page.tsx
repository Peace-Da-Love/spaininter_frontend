import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { getNewsFilter } from '@/src/app/server-actions';
import { HomePage } from '@/src/screens/home';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

type Props = {
	params: { locale: string; page: string; categoryName: string };
};

export async function generateMetadata({
	params: { locale, categoryName }
}: Omit<Props, 'children'>): Promise<Metadata> {
	const t = await getTranslations({ locale, namespace: 'MetaData.IndexPage' });

	return {
		title: t('title'),
		description: t('description')
	};
}

export default async function Page({
	params: { locale, page, categoryName }
}: Props) {
	const initialData = await getNewsFilter({
		languageCode: locale,
		page: page,
		search: categoryName
	});

	if (!initialData) {
		notFound();
	}

	// Enable static rendering
	unstable_setRequestLocale(locale);
	return <HomePage data={initialData} />;
}
