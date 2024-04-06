import { unstable_setRequestLocale } from 'next-intl/server';
import { ReactNode } from 'react';
import { locales } from '@/src/shared/configs';
import { clsx } from 'clsx';
import { getFonts } from '@/src/app/fonts';
import { PageLayout } from '@/src/app/layouts/page-layout';
import NextTopLoader from 'nextjs-toploader';
import { Metadata } from 'next';
import Script from 'next/script';

type Props = {
	children: ReactNode;
	params: { locale: string };
};

export function generateStaticParams() {
	return locales.map(locale => ({ locale }));
}

const SITE_URL = process.env.SITE_URL as string;
const YANDEX_VERIFICATION = process.env.YANDEX_VERIFICATION as string;
const GOOGLE_VERIFICATION = process.env.GOOGLE_VERIFICATION as string;
const YANDEX_METRIKA_ID = process.env.YANDEX_METRIKA_ID as string;

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
				url: '/metadata/og-image.jpg',
				alt: 'Og Image'
			}
		]
	},
	verification: {
		yandex: YANDEX_VERIFICATION,
		google: GOOGLE_VERIFICATION
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
			<head>
				<Script id='yandex-metrika' type='text/javascript'>
					{`
             (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
             m[i].l=1*new Date();
             for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
             k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
             (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");

             ym(${YANDEX_METRIKA_ID}, "init", {
                  clickmap:true,
                  trackLinks:true,
                  accurateTrackBounce:true,
                  webvisor:true
             });
          `}
				</Script>
				<noscript>
					<div>
						<img
							src='https://mc.yandex.ru/watch/96951677'
							style={{
								position: 'absolute',
								left: '-9999px'
							}}
							alt=''
						/>
					</div>
				</noscript>
			</head>
			<body className={clsx(getFonts())}>
				<NextTopLoader showSpinner={false} color={'#000000'} />
				<PageLayout>{children}</PageLayout>

				<Script
					defer
					data-domain='spaininter.com'
					src='https://stat.arcostec.es/js/script.js'
				/>
			</body>
		</html>
	);
}
