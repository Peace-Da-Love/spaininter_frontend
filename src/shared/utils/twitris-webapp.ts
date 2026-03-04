const TWITRIS_WEBAPP_URL_WEB =
	process.env.NEXT_PUBLIC_TWITRIS_WEBAPP_URL_WEB?.trim() || '';
const TWITRIS_WEBAPP_URL_TMA =
	process.env.NEXT_PUBLIC_TWITRIS_WEBAPP_URL_TMA?.trim() || '';

function resolveTwitrisUrlTemplate(): string {
	const hasTelegramInitData = Boolean(window.Telegram?.WebApp?.initData);

	if (hasTelegramInitData) {
		return TWITRIS_WEBAPP_URL_TMA;
	}

	return TWITRIS_WEBAPP_URL_WEB;
}

export function openTwitrisWebApp(locale: string): boolean {
	const template = resolveTwitrisUrlTemplate();

	if (!template) {
		console.error(
			'Set NEXT_PUBLIC_TWITRIS_WEBAPP_URL_WEB and NEXT_PUBLIC_TWITRIS_WEBAPP_URL_TMA.'
		);
		return false;
	}

	const url = template.replace('{locale}', locale);

	window.location.assign(url);
	return true;
}
