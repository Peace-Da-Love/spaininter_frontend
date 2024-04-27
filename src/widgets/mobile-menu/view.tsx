import { HomeLink } from './ui/home-link';
import { LocaleSwitcher } from '@/src/features/locale-switcher';

export const MobileMenu = () => {
	return (
		<div
			className={
				'block md:hidden fixed bottom-0 left-0 z-50 w-full backdrop-blur-xl bg-white/60'
			}
		>
			<div className={'flex justify-between px-16 py-4 bg-whit'}>
				<HomeLink />
				<LocaleSwitcher />
			</div>
		</div>
	);
};
