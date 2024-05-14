'use client';

import { EducationButton } from '@/src/features/education-button';
import { LocaleSwitcher } from '@/src/features/locale-switcher';
import { useSiteMenuStore } from '../../store';
import { cn } from '@/src/shared/utils';

export const Menu = () => {
	const { isOpen } = useSiteMenuStore();

	return (
		<ul
			className={cn('flex flex-row gap-2.5 md:justify-start items-start', {
				hidden: !isOpen
			})}
		>
			<li>
				<EducationButton />
			</li>
			<li>
				<LocaleSwitcher />
			</li>
		</ul>
	);
};
