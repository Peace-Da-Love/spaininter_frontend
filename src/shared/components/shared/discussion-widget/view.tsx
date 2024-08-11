'use client';

import { useEffect, useRef } from 'react';

export const DiscussionWidget = () => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const scriptElement = document.createElement('script');
		scriptElement.src = 'https://telegram.org/js/telegram-widget.js?22';
		scriptElement.async = true;
		scriptElement.dataset.telegramDiscussion = 'spaininter';
		scriptElement.dataset.commentsLimit = '5';
		scriptElement.dataset.colorful = '1';

		ref.current?.appendChild(scriptElement);

		return () => {
			ref.current?.removeChild(scriptElement);
		};
	}, []);

	return <div className={'mb-4'} ref={ref} />;
};
