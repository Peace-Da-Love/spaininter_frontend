'use client';

import { FC, useEffect } from 'react';
import { cn } from '@/src/shared/utils';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuGroup
} from '@radix-ui/react-dropdown-menu';
import { AlignJustify, X } from 'lucide-react';
import { useSiteMenuStore } from '../store';
import { Button } from '@/src/shared/components/ui';
import { EducationButton } from '@/src/features/education-button';
import { LocaleSwitcher } from '@/src/features/locale-switcher';
import { CitiesButton } from '@/src/features/cities-button';
import { FlatCatalogButton } from '@/src/features/flat-catalog-button';
import { usePathname } from 'next/navigation';

type Props = {
	className?: string;
};

export const SiteMenu: FC<Props> = ({ className }) => {
	const { toggle, isOpen } = useSiteMenuStore();
  	const pathname = usePathname();
  	
	const isPropertyCatalogPage = /^\/[a-z]{2}(\/property-catalog(\b|\/.*))?$/.test(pathname)

	// close menu on route change
	useEffect(() => {
		if (isOpen) toggle(false);
	}, [pathname, toggle]);

	return (
	<DropdownMenu>
		<DropdownMenuTrigger className={cn(className)} asChild>
			<Button variant={'menu'}>
				<AlignJustify size={32} />
			</Button>
		</DropdownMenuTrigger>

		<DropdownMenuContent
		align="end"
		side="right"
		className="flex flex-col gap-2.5 px-2.5 md:flex-row"
		>
			
			{/* Horizontal */}
			<DropdownMenuGroup className="flex flex-row gap-2.5 order-2 md:contents">
				<DropdownMenuItem asChild>
					<LocaleSwitcher />
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<EducationButton />
				</DropdownMenuItem>
			</DropdownMenuGroup>
			
			{/* Vertical */}
			<DropdownMenuGroup className="flex flex-col gap-2.5 translate-x-[calc(100%+0.625rem)] md:translate-x-0 md:flex-row order-1 md:contents">
				{!isPropertyCatalogPage && (
					<DropdownMenuItem asChild>
						<FlatCatalogButton />
					</DropdownMenuItem>
				)}
				<DropdownMenuItem asChild>
					<CitiesButton />
				</DropdownMenuItem>
			</DropdownMenuGroup>

		</DropdownMenuContent>

	</DropdownMenu>
	);

};
