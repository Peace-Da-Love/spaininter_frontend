'use client';

import { FC, useEffect, useRef } from 'react';
import { cn } from '@/src/shared/utils';
import { Link } from '@/src/shared/utils';
import { AlignJustify, X } from 'lucide-react';
import { useSiteMenuStore } from '../store';
import { Button } from '@/src/shared/components/ui';
import { EducationButton } from '@/src/features/education-button';
import { LocaleSwitcher } from '@/src/features/locale-switcher';
import { CitiesButton } from '@/src/features/cities-button';
import { FlatCatalogButton } from '@/src/features/flat-catalog-button';
import IcNewspaper from '@/src/app/icons/ic_newspaper.svg';
import { usePathname } from 'next/navigation';

type Props = {
	className?: string;
};

export const SiteMenu: FC<Props> = ({ className }) => {
	const { toggle, isOpen } = useSiteMenuStore();
	const pathname = usePathname();
	const menuRef = useRef<HTMLDivElement>(null);
	
	const isPropertyCatalogPage = /^\/[a-z]{2}(\/property-catalog(\b|\/.*))?$/.test(pathname)
	
	// Определяем, где должно отображаться содержимое меню
	const isMobileMenu = className?.includes('md:hidden')
	const isDesktopMenu = className?.includes('md:flex')

	// close menu on route change
	useEffect(() => {
		if (isOpen) toggle(false);
	}, [pathname, toggle]);

	// close menu when clicking outside, but allow clicks on Radix UI elements
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Element;
			const isMenuButton = target.closest('[data-menu-button]');
			const isMenuElement = target.closest('[data-menu-content]');
			const isRadixElement = target.closest('[data-radix-popper-content-wrapper], [data-radix-select-content], [data-radix-select-item], [data-radix-select-trigger]');
			
			// Don't close menu if clicking on menu elements or Radix UI elements
			if (!isMenuButton && !isMenuElement && !isRadixElement) {
				toggle(false);
			}
		};

		if (isOpen) {
			document.addEventListener('mousedown', handleClickOutside);
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [isOpen, toggle]);
	
	return (
		<>
			<Button 
				variant={'menu'} 
				className={cn(className)}
				onClick={() => toggle()}
				data-menu-button
			>
				{isOpen ? <X size={32} /> : <AlignJustify size={32} />}
			</Button>

			{isOpen && (
				<div 
					className={cn(
						"fixed bottom-2.5 right-2.5 z-50 flex flex-col gap-2.5 md:relative md:bottom-auto md:right-auto md:flex-row md:gap-2.5",
						isMobileMenu && "md:hidden",
						isDesktopMenu && "hidden md:flex"
					)}
					ref={menuRef}
					data-menu-content
					onClick={(e) => e.stopPropagation()}
				>
					
					<div className="flex flex-col gap-2.5 absolute bottom-20 right-0 md:relative md:bottom-auto md:right-auto md:flex-row md:flex-row-reverse md:order-2">
						{!isPropertyCatalogPage && (
							<FlatCatalogButton />
						)}
						<CitiesButton />
						{isPropertyCatalogPage && (
							<Button variant={'menu'} asChild>
								<Link href={'/news'}> 
									<IcNewspaper />
								</Link>
							</Button>
						)}
					</div>
					
					<div className="flex flex-row gap-2.5 absolute right-20 bottom-0 md:relative md:bottom-auto md:right-auto md:order-1">
						<LocaleSwitcher />
						<EducationButton />
					</div>
				</div>
			)}
		</>
	);
};
