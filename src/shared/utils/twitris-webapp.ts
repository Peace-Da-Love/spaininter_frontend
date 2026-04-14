const TWITRIS_WEBAPP_URL = process.env.NEXT_PUBLIC_TWITRIS_WEBAPP_URL?.trim() || '';

export function openTwitrisWebApp(locale: string): boolean {
	if (!TWITRIS_WEBAPP_URL) {
		console.error(
			'NEXT_PUBLIC_TWITRIS_WEBAPP_URL is not set. Use a direct frontend URL.'
		);
		return false;
	}

	const url = TWITRIS_WEBAPP_URL.replace('{locale}', locale);

	const newTab = window.open(url, '_blank', 'noopener,noreferrer');
	return Boolean(newTab);
}
