import { ReactNode } from 'react';
import Script from 'next/script';
import TmaInit from '@/src/app/provider/tma-init';
import { Metadata } from 'next';

type Props = {
	children: ReactNode;
};

export const metadata: Metadata = {
	robots: {
		index: false,
		follow: true
	}
};

export default function TmaLayout({ children }: Props) {
	return (
		<section data-view-channel='tma'>
			<Script
				src='https://telegram.org/js/telegram-web-app.js'
				strategy='beforeInteractive'
			/>
			<TmaInit />
			{children}
		</section>
	);
}
