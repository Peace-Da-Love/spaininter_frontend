'use client';

import { ChannelLink } from '@/src/shared/utils';
import { useLocale } from 'next-intl';

export const NotFoundPage = () => {
	const locale = useLocale();

	return (
		<section
			className={
				'mx-auto my-10 max-w-xl flex flex-col justify-center items-center'
			}
		>
			<h1 className={'text-8xl font-bold mt-10'}>404</h1>
			<h2 className={'text-4xl font-semibold mt-4'}>Page not found</h2>
			<ChannelLink
				locale={locale}
				className={
					'text-xl font-medium mt-4 text-light-blue hover:underline underline-offset-2'
				}
				href='/'
			>
				Go to Home page
			</ChannelLink>
		</section>
	);
};
