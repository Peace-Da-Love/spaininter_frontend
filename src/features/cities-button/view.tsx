'use client';
import { ChannelLink } from '@/src/shared/utils';
import IcCities from '@/src/app/icons/ic_cities.svg';
import IcNewspaper from '@/src/app/icons/ic_newspaper.svg';
import { Button } from '@/src/shared/components/ui';
import { usePathname } from 'next/navigation';
import { locales } from '@/src/shared/configs';
import { forwardRef } from 'react';

export const CitiesButton = forwardRef<HTMLButtonElement, {}>((props, ref) => {
	const path = usePathname();
	const locale = path.split('/').filter(Boolean)[0] || 'en';
	const thisPageIsCatalogTelegram: string | undefined = locales.find(locale => {
		return `/${locale}/catalog-telegram` === path || `/${locale}/tma/catalog-telegram` === path;
	});
	
	return (
		<Button variant={'menu'} asChild>
			<ChannelLink
				locale={locale}
				href={
					thisPageIsCatalogTelegram !== undefined ? '/news' : '/catalog-telegram'
				}
			>
				{thisPageIsCatalogTelegram !== undefined ? (
					<IcNewspaper />
				) : (
					<IcCities />
				)}
			</ChannelLink>
		</Button>
	);
});

CitiesButton.displayName = 'CitiesButton';
