import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { HomePage } from '@/src/screens/home';
import { getNewsFilter } from '@/src/app/server-actions';
import { notFound } from 'next/navigation';
import { locales } from '@/src/shared/configs';

type Props = {
	params: { locale: string };
};

const SITE_URL = process.env.SITE_URL;

export async function generateMetadata({
	params: { locale }
}: Omit<Props, 'children'>): Promise<Metadata> {
	const t = await getTranslations({ locale, namespace: 'MetaData.IndexPage' });

	return {
		title: t('title'),
		description: t('description'),
		alternates: {
			languages: {
				'ru-RU': `${SITE_URL}/ru`,
				'en-US': `${SITE_URL}/en`
			}
		},
		openGraph: {
			locale: locale,
			alternateLocale: locales
		}
	};
}

export default async function IndexPage({ params: { locale } }: Props) {
	const initialData = await getNewsFilter({ languageCode: locale });

	if (!initialData) {
		notFound();
	}

	// Enable static rendering
	unstable_setRequestLocale(locale);
	return <HomePage data={initialData} />;
}
