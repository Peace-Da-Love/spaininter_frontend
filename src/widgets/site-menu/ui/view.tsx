'use client';

import { FC } from 'react';
import { cn } from '@/src/shared/utils';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@radix-ui/react-dropdown-menu';
import { AlignJustify, X } from 'lucide-react';
import { useSiteMenuStore } from '../store';
import { Button } from '@/src/shared/components/ui';
import { EducationButton } from '@/src/features/education-button';
import { LocaleSwitcher } from '@/src/features/locale-switcher';
import { CitiesButton } from '@/src/features/cities-button';

type Props = {
	className?: string;
};

export const SiteMenu: FC<Props> = ({ className }) => {
	const { toggle, isOpen } = useSiteMenuStore();

	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger className={cn(className)} asChild>
				<Button variant={'menu'}>
					{isOpen ? <X size={32} /> : <AlignJustify size={32} />}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align={'end'}
				side={'right'}
				className={'flex flex-row gap-2.5 px-2.5'}
			>
				<DropdownMenuItem asChild>
					<LocaleSwitcher />
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<EducationButton />
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<CitiesButton />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
