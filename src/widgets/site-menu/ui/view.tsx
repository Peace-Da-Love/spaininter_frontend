'use client';

import { FC, useEffect, useRef } from 'react';
import { cn } from '@/src/shared/utils';
import { ChannelLink } from '@/src/shared/utils';
import { openTwitrisWebApp } from '@/src/shared/utils';
import { useSiteMenuStore } from '../store';
import { Button } from '@/src/shared/components/ui';
import { LocaleSwitcher } from '@/src/features/locale-switcher';
import { CitiesButton } from '@/src/features/cities-button';
import { FlatCatalogButton } from '@/src/features/flat-catalog-button';
import { ProfileButton } from '@/src/features/profile-button';
import IcNewspaper from '@/src/app/icons/ic_newspaper.svg';
import { usePathname, useSearchParams } from 'next/navigation';
import useAuth from '@/src/shared/stores/auth';
import { useTranslations } from 'next-intl';
import { KeyRound, Plus } from 'lucide-react';

type Props = {
	className?: string;
};

const CreateNews: FC<{ locale: string; isVisible: boolean }> = ({
	locale,
	isVisible
}) => {
	const accessToken = useAuth(state => state.accessToken);
	const user = useAuth(state => state.user);
	const hasHydrated = useAuth(state => state.hasHydrated);
	const t = useTranslations('Pages.News');

	if (!isVisible || !hasHydrated || !accessToken || !user?.id) return null;

	return (
		<Button variant="menu" asChild>
			<ChannelLink
				locale={locale}
				href="/news/create"
				aria-label={t('addArticle')}
				title={t('addArticle')}
			>
				<Plus className="h-8 w-8" />
			</ChannelLink>
		</Button>
	);
};

export const SiteMenu: FC<Props> = ({ className }) => {
	const { toggle, isOpen } = useSiteMenuStore();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const accessToken = useAuth(state => state.accessToken);
	const hasHydrated = useAuth(state => state.hasHydrated);
	const menuRef = useRef<HTMLDivElement>(null);
	const locale = pathname.split('/').filter(Boolean)[0] || 'en';
	const isAuthorized = hasHydrated && Boolean(accessToken);
	
	const isPropertyCatalogPage = /\/property-catalog(\b|\/.*)$/.test(pathname)
	const isNewsPage = /\/news\/[^/]+$/.test(pathname)
	const isNewsCatalogPage = /^\/[^/]+\/news\/?$/.test(pathname)
	
    // Mobile menu should be shown the same on all breakpoints

	// control menu on route change
	useEffect(() => {
		const parts = pathname.split('/').filter(Boolean);
		const pcIndex = parts.indexOf('property-catalog');
		if (pcIndex !== -1) {
			// Don't open menu on flat pages
			const isFlatPage = pathname.includes('/property-catalog/flat/');
			if (isFlatPage) {
				toggle(false);
				return;
			}
			
			// Check if there are filters in the path (province/town) or in the query parameters
			const hasPathFilters = parts.length > pcIndex + 1;
			const hasQueryFilters = Boolean(
				searchParams.get('type') || searchParams.get('order') || searchParams.get('ref')
			);
			
			// Open the menu only if there are filters, otherwise close it.
			if (hasPathFilters || hasQueryFilters) {
				toggle(true);
			} else {
				toggle(false);
			}
		} else {
			toggle(false);
		}
	}, [pathname, searchParams, toggle]);

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
				type="button"
				className={cn(className)}
				onClick={() => toggle()}
				data-menu-button
			>
				<span className="relative size-10">
					<span
						className={cn(
							'absolute inset-0 m-auto size-10 rounded-full bg-current transition-transform duration-300 ease-out',
							isOpen ? 'scale-0' : 'scale-100'
						)}
					/>
					<span
						className={cn(
							'absolute left-1/2 top-1/2 h-1 w-10 -translate-x-1/2 -translate-y-1/2 rounded bg-current transition-transform duration-300 ease-out',
							isOpen ? 'rotate-45 scale-100' : 'rotate-45 scale-0'
						)}
					/>
					<span
						className={cn(
							'absolute left-1/2 top-1/2 h-1 w-10 -translate-x-1/2 -translate-y-1/2 rounded bg-current transition-transform duration-300 ease-out',
							isOpen ? '-rotate-45 scale-100' : '-rotate-45 scale-0'
						)}
					/>
				</span>
			</Button>

            {isOpen && (
                <div 
                    className={cn(
                        "fixed bottom-2.5 right-2.5 z-50 flex flex-col gap-2.5"
                    )}
                    ref={menuRef}
                    data-menu-content
                    onClick={(e) => e.stopPropagation()}
                >
					
                    <div className="flex flex-col gap-2.5 absolute bottom-20 right-0">
						<CreateNews locale={locale} isVisible={isNewsCatalogPage} />
						{!isPropertyCatalogPage && (
							<FlatCatalogButton />
						)}
						
						{!isNewsCatalogPage && (
							<Button variant="menu" asChild>
								<ChannelLink locale={locale} href='/news'>
									<IcNewspaper />
								</ChannelLink>
							</Button>
						)}
							
						<CitiesButton />
					</div>
					
					
                    <div className="flex flex-row items-end gap-2.5 absolute right-20 bottom-0">
						
						<div className="flex flex-col gap-2.5">
							<LocaleSwitcher />
						</div>
						<div className="flex flex-col gap-2.5">
							{isAuthorized ? (
								<ProfileButton />
							) : (
								<Button
									variant="menu"
									type="button"
									onClick={() => openTwitrisWebApp(locale)}
								>
									<span className="flex size-full items-center justify-center">
										<KeyRound className="block h-8 w-8 shrink-0" />
									</span>
								</Button>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	);
};
