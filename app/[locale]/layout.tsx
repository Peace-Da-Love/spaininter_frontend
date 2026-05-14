export const dynamic = 'force-dynamic';

import { unstable_setRequestLocale, getMessages } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';
import { ReactNode } from 'react';
import { locales } from '@/src/shared/configs';
import { clsx } from 'clsx';
import { getFonts } from '@/src/app/fonts';
import { PageLayout } from '@/src/app/layouts/page-layout';
import { Metadata } from 'next';
import Script from 'next/script';
import type { Viewport } from 'next'
import {Provider} from "@/src/app/provider";
import AuthInit from '@/src/app/provider/auth-init';

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

export const viewport: Viewport = {
  themeColor: '#FFFFFF',
  colorScheme: 'light',
}

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
	const messages = await getMessages();

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
							src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
							style={{
								position: 'absolute',
								left: '-9999px'
							}}
							alt=''
						/>
					</div>
				</noscript>
			</head>
			<body  className={clsx(getFonts(), 'relative min-h-screen')}>
			  <NextIntlClientProvider locale={locale} messages={messages}>
				  <Provider>
            <AuthInit />
            <PageLayout>{children}</PageLayout>
          </Provider>
        </NextIntlClientProvider>

			<Script id="spaininter-stat" strategy="afterInteractive">
				{`
				(function() {
					const api = 'https://stat.spaininter.com/api/event';
					const domain = 'spaininter.com';

					const shortenUrl = (href) => {
						try {
							const url = new URL(href);
							const parts = url.pathname.split('/').filter(Boolean);
							const [locale, section, slug] = parts;

							if (section === 'news' && slug) {
								const id = slug.split('-')[0];

								if (locale && /^\\d+$/.test(id)) {
									url.pathname = \`/\${locale}/news/\${id}\`;
									return url.toString();
								}
							}

							return href;
						} catch {
							return href;
						}
					};

					const track = (event, options) => {
						if (/^localhost$|^127(\\.[0-9]+){0,2}\\.[0-9]+$|^\\[::1?\\]$/.test(window.location.hostname) || window.location.protocol === 'file:') {
							options && options.callback && options.callback();
							return;
						}

						const xhr = new XMLHttpRequest();
						const payload = {
							name: event,
							url: shortenUrl(options && options.url ? options.url : window.location.href),
							domain: domain,
							referrer: document.referrer || null
						};

						xhr.open('POST', api, true);
						xhr.setRequestHeader('Content-Type', 'text/plain');
						xhr.send(JSON.stringify(payload));
						xhr.onreadystatechange = function() {
							if (xhr.readyState === 4 && options && options.callback) {
								options.callback();
							}
						};
					};

					const queuedEvents = window.plausible && window.plausible.q || [];
					window.plausible = track;
					for (let i = 0; i < queuedEvents.length; i++) {
						track.apply(this, queuedEvents[i]);
					}

					let previousPathname;
					const trackPageview = () => {
						if (previousPathname !== window.location.pathname) {
							previousPathname = window.location.pathname;
							track('pageview');
						}
					};

					const history = window.history;
					if (history.pushState) {
						const originalPushState = history.pushState;
						history.pushState = function() {
							originalPushState.apply(this, arguments);
							trackPageview();
						};
						window.addEventListener('popstate', trackPageview);
					}

					if (document.visibilityState === 'prerender') {
						document.addEventListener('visibilitychange', function() {
							if (!previousPathname && document.visibilityState === 'visible') {
								trackPageview();
							}
						});
					} else {
						trackPageview();
					}
				})();
				`}
			</Script>

			</body>
		</html>
	);
}


