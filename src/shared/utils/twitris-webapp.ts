import useAuth from '@/src/shared/stores/auth';

const TWITRIS_WEBAPP_URL = process.env.NEXT_PUBLIC_TWITRIS_WEBAPP_URL?.trim() || '';
export const TWITRIS_AUTH_SESSION_KEY = 'spaininter_twitris_auth_session';
export const TWITRIS_AUTH_SESSION_CREATED_EVENT = 'spaininter:twitris-auth-session-created';
const TWITRIS_AUTH_SESSION_TTL_MS = 2 * 60 * 1000;
const TWITRIS_STATUS_POLL_INTERVAL_MS = 1000;
const TWITRIS_STATUS_POLL_TIMEOUT_MS = 2 * 60 * 1000;
const activePollSessions = new Set<string>();
const TWITRIS_WAIT_BANNER_ID = 'twitris-auth-wait-banner';
const TWITRIS_WAIT_BANNER_STYLE_ID = 'twitris-auth-wait-banner-style';

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

function ensureWaitBannerStyles() {
	if (document.getElementById(TWITRIS_WAIT_BANNER_STYLE_ID)) return;
	const style = document.createElement('style');
	style.id = TWITRIS_WAIT_BANNER_STYLE_ID;
	style.textContent = `@keyframes twitris-auth-spin { to { transform: rotate(360deg); } }`;
	document.head.appendChild(style);
}

function showWaitBanner() {
	if (typeof document === 'undefined') return;
	ensureWaitBannerStyles();
	if (document.getElementById(TWITRIS_WAIT_BANNER_ID)) return;

	const banner = document.createElement('div');
	banner.id = TWITRIS_WAIT_BANNER_ID;
	banner.style.position = 'fixed';
	banner.style.top = '16px';
	banner.style.right = '16px';
	banner.style.zIndex = '2147483647';
	banner.style.display = 'flex';
	banner.style.alignItems = 'center';
	banner.style.gap = '10px';
	banner.style.padding = '12px 14px';
	banner.style.borderRadius = '12px';
	banner.style.background = 'rgba(255,255,255,0.96)';
	banner.style.border = '1px solid #e2e8f0';
	banner.style.boxShadow = '0 10px 24px rgba(0,0,0,0.14)';
	banner.style.backdropFilter = 'blur(6px)';
	banner.style.color = '#0f172a';
	banner.style.fontSize = '14px';
	banner.style.fontWeight = '600';

	const spinner = document.createElement('div');
	spinner.style.width = '16px';
	spinner.style.height = '16px';
	spinner.style.border = '2px solid #cbd5e1';
	spinner.style.borderTopColor = '#334155';
	spinner.style.borderRadius = '999px';
	spinner.style.animation = 'twitris-auth-spin 0.8s linear infinite';

	const text = document.createElement('span');
	text.textContent =
		'Ожидаем подтверждение в Telegram...';

	banner.appendChild(spinner);
	banner.appendChild(text);
	document.body.appendChild(banner);
}

function hideWaitBanner() {
	if (typeof document === 'undefined') return;
	const banner = document.getElementById(TWITRIS_WAIT_BANNER_ID);
	if (banner) banner.remove();
}

function detectLocaleFromPath(): string {
	try {
		const parts = window.location.pathname.split('/').filter(Boolean);
		if (parts.length > 0) return parts[0];
	} catch {
		// ignore
	}
	return 'en';
}

function getApiBaseUrl(): string {
	const envApi = process.env.NEXT_PUBLIC_API_URL?.trim();
	if (envApi) return envApi.replace(/\/$/, '');
	return window.location.origin;
}

async function startTwitrisStatusPolling(sessionId: string): Promise<void> {
	if (activePollSessions.has(sessionId)) return;
	activePollSessions.add(sessionId);
	showWaitBanner();

	const startedAt = Date.now();
	const apiBase = getApiBaseUrl();

	try {
		while (Date.now() - startedAt < TWITRIS_STATUS_POLL_TIMEOUT_MS) {
			try {
				const res = await fetch(
					`${apiBase}/api/user/auth/status?sessionId=${encodeURIComponent(sessionId)}`,
					{
						method: 'GET',
						credentials: 'include',
					},
				);

				if (res.ok) {
					const data = await res.json();
					if (data?.success && data?.accessToken) {
						const auth = useAuth.getState();
						auth.setAccessToken(data.accessToken);
						try {
							await auth.validateToken();
						} catch {
							// ignore, profile page will revalidate anyway
						}
						localStorage.removeItem(TWITRIS_AUTH_SESSION_KEY);
						hideWaitBanner();
						const locale = detectLocaleFromPath();
						window.location.assign(`/${locale}/profile`);
						return;
					}
				}
			} catch {
				// ignore and continue polling
			}

			await sleep(TWITRIS_STATUS_POLL_INTERVAL_MS);
		}
	} finally {
		activePollSessions.delete(sessionId);
	}
}

function createSessionId(): string {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID();
	}

	// Fallback UUID v4-like generator for old browsers.
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
		const r = Math.random() * 16 | 0;
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

export function openTwitrisWebApp(locale: string): boolean {
	if (!TWITRIS_WEBAPP_URL) {
		console.error(
			'NEXT_PUBLIC_TWITRIS_WEBAPP_URL is not set. Use a direct frontend URL.'
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
	showWaitBanner();

	// Let browser paint the waiting banner before opening Telegram tab.
	setTimeout(() => {
		const url = buildLoginUrl(TWITRIS_WEBAPP_URL, sessionId, locale);
		const newTab = window.open(url, '_blank', 'noopener,noreferrer');
		if (!newTab) {
			localStorage.removeItem(TWITRIS_AUTH_SESSION_KEY);
			console.warn('Popup blocked');
		}
	}, 50);

	void startTwitrisStatusPolling(sessionId);

	return true;
}
