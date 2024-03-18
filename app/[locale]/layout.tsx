import { unstable_setRequestLocale } from 'next-intl/server';
import { ReactNode } from 'react';
import { locales } from '@/src/shared/configs';
import { clsx } from 'clsx';
import { getFonts } from '@/src/app/fonts';
import { PageLayout } from '@/src/app/layouts/page-layout';

type Props = {
	children: ReactNode;
	params: { locale: string };
};

export function generateStaticParams() {
	return locales.map(locale => ({ locale }));
}

export default async function LocaleLayout({
	children,
	params: { locale }
}: Props) {
	// Enable static rendering
	unstable_setRequestLocale(locale);

	return (
		<html lang={locale}>
			<body className={clsx(getFonts())}>
				<PageLayout>{children}</PageLayout>
			</body>
		</html>
	);
}
