import { HomeLink } from './ui/home-link';
import { LocaleSwitcher } from '@/src/features/locale-switcher';
import { MobileNavigation } from './ui/mobile-navigation';
import { FC } from 'react';

type Props = {
	categoryName?: string;
};

export const MobileMenu: FC<Props> = ({ categoryName }) => {
	return (
		<div
			className={
				'block md:hidden fixed bottom-0 left-0 z-50 w-full backdrop-blur-xl bg-white/60'
			}
		>
			<MobileNavigation categoryName={categoryName} />
			<div className={'flex justify-between px-16 pb-4 bg-whit'}>
				<HomeLink />
				<LocaleSwitcher />
			</div>
		</div>
	);
};
