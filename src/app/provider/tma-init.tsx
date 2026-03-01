'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

const DEV_MOCK_THEME: Record<string, string> = {
	bg_color: '#ffffff',
	text_color: '#111111',
	hint_color: '#707579',
	link_color: '#2f80ed',
	button_color: '#2f80ed',
	button_text_color: '#ffffff',
	secondary_bg_color: '#f4f4f5',
	header_bg_color: '#ffffff',
	accent_text_color: '#2f80ed',
	section_bg_color: '#ffffff',
	section_header_text_color: '#2f80ed',
	subtitle_text_color: '#707579',
	destructive_text_color: '#d9534f'
};

function applyThemeParams(themeParams?: Record<string, string>) {
	if (!themeParams || typeof document === 'undefined') {
		return;
	}

	Object.entries(themeParams).forEach(([key, value]) => {
		if (!value) {
			return;
		}

		document.documentElement.style.setProperty(
			`--tg-theme-${key.replace(/_/g, '-')}`,
			value
		);
	});

	const bgColor = themeParams.bg_color;
	if (bgColor) {
		document.documentElement.style.backgroundColor = bgColor;
		document.body.style.backgroundColor = bgColor;
	}
}

function createDevMockIfNeeded() {
	if (typeof window === 'undefined') {
		return;
	}

	if (window.Telegram?.WebApp) {
		return;
	}

	const allowMock =
		process.env.NODE_ENV !== 'production' && isDebugTmaEnabled();
	if (!allowMock) {
		return;
	}

	window.Telegram = {
		WebApp: {
			__isMock: true,
			initData: '',
			initDataUnsafe: {
				user: {
					id: 99281932,
					first_name: 'Dev',
					last_name: 'User',
					username: 'dev_user'
				}
			},
			platform: 'tdesktop',
			version: '8.0',
			colorScheme: 'light',
			isExpanded: true,
			themeParams: DEV_MOCK_THEME,
			ready: () => undefined,
			expand: () => undefined,
			close: () => undefined,
			setHeaderColor: () => undefined,
			setBackgroundColor: () => undefined
		}
	};
}

function isDebugTmaEnabled() {
	if (typeof window === 'undefined') {
		return false;
	}

	const value = new URLSearchParams(window.location.search).get('tmaDebug');
	return value === '1' || value === 'true';
}

function buildWebFallbackUrl() {
	const { pathname, search, hash } = window.location;
	const segments = pathname.split('/').filter(Boolean);

	if (segments.length >= 2 && segments[1] === 'tma') {
		segments.splice(1, 1);
	}

	const cleanPath = `/${segments.join('/')}`;
	const params = new URLSearchParams(search);
	params.delete('tmaDebug');
	const cleanSearch = params.toString();

	return `${cleanPath}${cleanSearch ? `?${cleanSearch}` : ''}${hash || ''}`;
}

function applyTelegramContext() {
	const webApp = window.Telegram?.WebApp;
	if (!webApp) {
		return false;
	}
	const isMock = Boolean(
		(webApp as { __isMock?: boolean }).__isMock
	);
	if (isMock && !isDebugTmaEnabled()) {
		return false;
	}

	const hasInitData = typeof webApp.initData === 'string' && webApp.initData.length > 0;
	const hasUnsafeUser =
		Boolean((webApp.initDataUnsafe as { user?: { id?: number } } | undefined)?.user?.id);

	// In regular browsers telegram-web-app.js may expose WebApp object without real session data.
	// Treat context as valid only for real Telegram sessions (or explicit debug mode).
	if (!hasInitData && !hasUnsafeUser && !isDebugTmaEnabled()) {
		return false;
	}

	webApp.ready?.();
	webApp.expand?.();
	webApp.setHeaderColor?.('bg_color');

	applyThemeParams(webApp.themeParams as Record<string, string> | undefined);
	document.documentElement.setAttribute('data-client-channel', 'tma');
	document.body.setAttribute('data-client-channel', 'tma');
	return true;
}

export default function TmaInit() {
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useEffect(() => {
		createDevMockIfNeeded();

		if (applyTelegramContext()) {
			return;
		}

		const timeoutId = window.setTimeout(() => {
			if (applyTelegramContext()) {
				return;
			}

			if (!isDebugTmaEnabled()) {
				window.location.replace(buildWebFallbackUrl());
			}
		}, 500);

		return () => {
			window.clearTimeout(timeoutId);
		};
	}, [pathname, searchParams]);

	return null;
}
