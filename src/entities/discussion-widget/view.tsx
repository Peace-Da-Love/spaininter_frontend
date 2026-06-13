'use client';

import { FC, useEffect, useRef } from 'react';

type Props = {
	pageUrl?: string;
};

export const DiscussionWidget: FC<Props> = ({ pageUrl }) => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const scriptElement = document.createElement('script');
		scriptElement.src = 'https://telegram.org/js/telegram-widget.js?22';
		scriptElement.async = true;
		scriptElement.dataset.telegramDiscussion = 'spaininter';
		scriptElement.dataset.commentsLimit = '5';
		scriptElement.dataset.colorful = '1';
		const discussionPageUrl =
			pageUrl ??
			document.querySelector<HTMLLinkElement>("link[rel='canonical']")?.href;

		if (discussionPageUrl) {
			scriptElement.dataset.pageUrl = discussionPageUrl;
		}

		const container = ref.current;
		container?.appendChild(scriptElement);

		return () => {
			container?.removeChild(scriptElement);
		};
	}, [pageUrl]);

	return <div className={'mb-4'} ref={ref} />;
};
