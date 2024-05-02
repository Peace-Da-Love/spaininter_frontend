import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { HomePage } from '@/src/screens/home';
import { getLatestNewsAction } from '@/src/app/server-actions';
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

	const hrefLangs: Record<string, string> = locales.reduce((acc, locale) => {
		acc[locale] = `${SITE_URL}/${locale}`;
		return acc;
	}, {} as Record<string, string>);

	return {
		title: t('title'),
		description: t('description'),
		alternates: {
			languages: {
				'x-default': hrefLangs['en'],
				...hrefLangs
			}
		}
	};
}

export default async function IndexPage({ params: { locale } }: Props) {
	// Enable static rendering
	unstable_setRequestLocale(locale);

	const initialData = await getLatestNewsAction();

	if (!initialData) {
		notFound();
	}

	const t = await getTranslations({ locale, namespace: 'MetaData.IndexPage' });

	return <HomePage title={t('title')} data={initialData} />;
}
