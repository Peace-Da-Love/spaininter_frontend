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
  
	// All other routes are handled by next-intl
	return intlMiddleware(request)
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
