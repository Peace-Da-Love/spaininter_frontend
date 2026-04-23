const TWITRIS_WEBAPP_URL = process.env.NEXT_PUBLIC_TWITRIS_WEBAPP_URL?.trim() || '';
export const TWITRIS_AUTH_SESSION_KEY = 'spaininter_twitris_auth_session';
export const TWITRIS_AUTH_SESSION_CREATED_EVENT = 'spaininter:twitris-auth-session-created';
const TWITRIS_AUTH_SESSION_TTL_MS = 2 * 60 * 1000;

function createSessionId(): string {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID();
	}

	// Fallback UUID v4-like generator for old browsers.
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}

function buildLoginUrl(rawUrl: string, sessionId: string, locale: string): string {
	const interpolated = rawUrl.replace('{locale}', locale);
	const url = new URL(interpolated);
	const startValue = `login_${sessionId}`;

	const currentStart = url.searchParams.get('startapp');
	if (currentStart) {
		url.searchParams.set('startapp', startValue);
	} else {
		url.searchParams.append('startapp', startValue);
	}

	return url.toString();
}

function buildBaseUrl(rawUrl: string, locale: string): string {
	return rawUrl.replace('{locale}', locale);
}

function openTwitrisUrl(url: string): boolean {
	const newTab = window.open(url, '_blank', 'noopener,noreferrer');
	if (!newTab) {
		// In some browsers noopener/noreferrer can return null even when a tab opens.
	}

	return true;
}

function clearTwitrisAuthSession() {
	localStorage.removeItem(TWITRIS_AUTH_SESSION_KEY);
}

export function openTwitrisDirect(locale: string): boolean {
	if (!TWITRIS_WEBAPP_URL) {
		console.error(
			'NEXT_PUBLIC_TWITRIS_WEBAPP_URL is not set. Use a direct frontend URL.',
		);
		return false;
	}

	clearTwitrisAuthSession();
	return openTwitrisUrl(buildBaseUrl(TWITRIS_WEBAPP_URL, locale));
}

export function openTwitrisWebApp(locale: string): boolean {
	if (!TWITRIS_WEBAPP_URL) {
		console.error(
			'NEXT_PUBLIC_TWITRIS_WEBAPP_URL is not set. Use a direct frontend URL.',
		);
		return false;
	}

	const sessionId = createSessionId();
	const payload = JSON.stringify({
		sessionId,
		createdAt: Date.now(),
		expiresAt: Date.now() + TWITRIS_AUTH_SESSION_TTL_MS,
	});
	localStorage.setItem(TWITRIS_AUTH_SESSION_KEY, payload);
	window.dispatchEvent(new Event(TWITRIS_AUTH_SESSION_CREATED_EVENT));

	return openTwitrisUrl(buildLoginUrl(TWITRIS_WEBAPP_URL, sessionId, locale));
}
