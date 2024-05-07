'use client';

import { FC, useEffect, useRef } from 'react';

type Props = {
	adLink: string;
};

export const AdWidget: FC<Props> = ({ adLink }) => {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const scriptElement = document.createElement('script');
		scriptElement.src = 'https://telegram.org/js/telegram-widget.js?22';
		scriptElement.async = true;
		scriptElement.dataset.telegramPost = adLink;
		scriptElement.dataset.commentsLimit = '5';
		scriptElement.dataset.colorful = '1';

		ref.current?.appendChild(scriptElement);

		return () => {
			ref.current?.removeChild(scriptElement);
		};
	}, []);

	return <div ref={ref} />;
};
