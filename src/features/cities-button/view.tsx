'use client';
import { Link } from '@/src/shared/utils';
import IcCities from '@/src/app/icons/ic_cities.svg';
import IcNewspaper from '@/src/app/icons/ic_newspaper.svg';
import { Button } from '@/src/shared/components/ui';
import { usePathname } from 'next/navigation';
import { locales } from '@/src/shared/configs';

export const CitiesButton = () => {
	const path = usePathname();
	const thisPageIsCatalogTelegram: string | undefined = locales.find(locale => {
		return `/${locale}/catalog-telegram` === path;
	});
	console.log(thisPageIsCatalogTelegram);

	return (
		<Button variant={'menu'} asChild>
			<Link
				href={
					thisPageIsCatalogTelegram !== undefined ? '/' : '/catalog-telegram'
				}
			>
				{thisPageIsCatalogTelegram !== undefined ? (
					<IcNewspaper />
				) : (
					<IcCities />
				)}
			</Link>
		</Button>
	);
};
