type TelegramThemeParams = Partial<
	Record<
		| 'bg_color'
		| 'text_color'
		| 'hint_color'
		| 'link_color'
		| 'button_color'
		| 'button_text_color'
		| 'secondary_bg_color'
		| 'header_bg_color'
		| 'accent_text_color'
		| 'section_bg_color'
		| 'section_header_text_color'
		| 'subtitle_text_color'
		| 'destructive_text_color',
		string
	>
>;

type TelegramWebApp = {
	__isMock?: boolean;
	initData?: string;
	initDataUnsafe?: Record<string, unknown>;
	platform?: string;
	version?: string;
	colorScheme?: 'light' | 'dark';
	isExpanded?: boolean;
	themeParams?: TelegramThemeParams;
	ready?: () => void;
	expand?: () => void;
	close?: () => void;
	openLink?: (url: string) => void;
	openTelegramLink?: (url: string) => void;
	setHeaderColor?: (colorKey: string) => void;
	setBackgroundColor?: (color: string) => void;
};

type TelegramGlobal = {
	WebApp?: TelegramWebApp;
};

declare global {
	interface Window {
		Telegram?: TelegramGlobal;
	}
}

export {};
