'use client';

import { cn } from '@/src/shared/utils';
import { Logo } from '../../shared/components/shared/logo';
import { SiteMenu } from '@/src/widgets/site-menu';
import { usePathname } from 'next/navigation';

export const Header = () => {
	const pathname = usePathname();
	const isPropertyCatalogPage = /^\/[a-z]{2}\/property-catalog(\b|$)/.test(pathname);
	const isFlatPage = pathname.includes('/property-catalog/flat/');
	const isAdvPage = /^\/[a-z]{2}\/adv(\b|$)/.test(pathname);
	
	if ((!isPropertyCatalogPage || isFlatPage) && !isAdvPage) {
		return (
			<header className={cn('fixed top-5 z-50 flex gap-2.5')}>
				<Logo />
				<SiteMenu className={'hidden md:flex'} />
			</header>
		);
	}
	
	return null;
};
