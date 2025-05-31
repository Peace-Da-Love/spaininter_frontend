import { CatalogTelegram } from '@/src/screens/catalog-telegram';
import { locales } from '@/src/shared/configs';
import { Metadata } from 'next';
import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { FC } from 'react';

type Props = {
	params: { locale: string };
};

const SITE_URL = process.env.SITE_URL;

export async function generateMetadata({
	params: { locale }
}: Omit<Props, 'children'>): Promise<Metadata> {
	const t = await getTranslations({
		locale,
		namespace: 'MetaData.CatalogTelegramPage'
	});

	const hrefLangs: Record<string, string> = locales.reduce((acc, loc) => {
		acc[loc] = `${SITE_URL}/${loc}/catalog-telegram`;
		return acc;
	}, {} as Record<string, string>);

	return {
		title: t('title'),
		description: t('description'),
		alternates: {
			languages: {
				'x-default': hrefLangs['en'],
				...hrefLangs
			},
			canonical: hrefLangs['en']
		},
		openGraph: {
			title: t('title'),
			description: t('description'),
			url: hrefLangs[locale],
			locale,
			type: 'website'
		}
	};
}

const Page: FC<Props> = ({ params: { locale } }) => {
	unstable_setRequestLocale(locale);
	return <CatalogTelegram />;
};

export default Page;
