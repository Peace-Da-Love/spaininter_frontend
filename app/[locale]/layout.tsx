import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { ReactNode } from 'react';
import { locales } from '@/src/shared/configs';
import { clsx } from 'clsx';
import { getFonts } from '@/src/app/fonts';
import { PageLayout } from '@/src/app/layouts/page-layout';
import NextTopLoader from 'nextjs-toploader';
import { Metadata } from 'next';

type Props = {
	children: ReactNode;
	params: { locale: string };
};

export function generateStaticParams() {
	return locales.map(locale => ({ locale }));
}

const SITE_URL = process.env.SITE_URL as string;

export const metadata: Metadata = {
	metadataBase: new URL(SITE_URL),
	applicationName: 'SpainInter',
	authors: {
		url: 'https://stepsones.me',
		name: 'StepsOnes'
	},
	openGraph: {
		type: 'website',
		url: SITE_URL,
		siteName: 'SpainInter',
		images: [
			{
				url: '/og/og-image.jpg',
				width: 1200,
				height: 630,
				alt: 'Og Image Alt'
			}
		]
	}
};

export default async function LocaleLayout({
	children,
	params: { locale }
}: Props) {
	// Enable static rendering
	unstable_setRequestLocale(locale);

	return (
		<html lang={locale}>
			<body className={clsx(getFonts())}>
				<NextTopLoader showSpinner={false} color={'#000000'} />
				<PageLayout>{children}</PageLayout>
			</body>
		</html>
	);
}
