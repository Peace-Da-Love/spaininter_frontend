import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import createMiddleware from 'next-intl/middleware';
import { pathnames, locales, localePrefix } from '@/src/shared/configs';

const intlMiddleware = createMiddleware({
	defaultLocale: 'en',
	locales,
	pathnames,
	localePrefix
  })

function parseLocalePath(pathname: string): {
  locale: string;
  segmentsAfterLocale: string[];
} | null {
  const segments = pathname.split('/').filter(Boolean);
  if (!segments.length) {
    return null;
  }

  const [locale, ...segmentsAfterLocale] = segments;
  if (!locales.includes(locale as (typeof locales)[number])) {
    return null;
  }

  return {
    locale,
    segmentsAfterLocale
  };
}

  export default function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl
  
	// Ignore any system/service requests:
	// - /.well-known (Chrome DevTools, PWA, etc.)
	// - /favicon.ico, /manifest.webmanifest, etc.
	if (
	  pathname.startsWith('/.well-known') ||
	  pathname === '/favicon.ico' ||
	  pathname === '/manifest.webmanifest'
	) {
	  return NextResponse.next()
	}

  const localePath = parseLocalePath(pathname);
  const isChannelAgnosticApiPath =
    pathname.startsWith('/prop-api/') ||
    pathname.startsWith('/site-api/') ||
    (localePath &&
      (localePath.segmentsAfterLocale[0] === 'prop-api' ||
        localePath.segmentsAfterLocale[0] === 'site-api'));

  if (isChannelAgnosticApiPath) {
    return NextResponse.next();
  }

	// All other routes are handled by next-intl
	const response = intlMiddleware(request);
  return response;
  }



export const config = {
	matcher: [
		// Enable a redirect to a matching locale at the root
		'/',

		// Set a cookie to remember the previous locale for
		// all requests that have a locale prefix
		'/(ru|en|es|fr|de|sv|no|nl|pl)/:path*',

		// Enable redirects that add missing locales
		// (e.g. `/pathnames` -> `/en/pathnames`)
		'/((?!_next|_vercel|.*\\..*).*)'
	]
};
