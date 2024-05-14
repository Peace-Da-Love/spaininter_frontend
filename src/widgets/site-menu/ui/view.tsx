import { BurgerButton } from './burger-button';
import { Menu } from './menu';
import { FC } from 'react';
import { cn } from '@/src/shared/utils';

type Props = {
	className?: string;
};

export const SiteMenu: FC<Props> = ({ className }) => {
	return (
		<div
			className={cn(
				'flex gap-2.5 flex-row-reverse md:flex-row items-end md:items-start',
				className
			)}
		>
			<BurgerButton />
			<Menu />
		</div>
	);
};
