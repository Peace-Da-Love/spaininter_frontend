import { cn } from '@/src/shared/utils';
import { Logo } from '../../shared/components/shared/logo';
import { SubscribeNews } from '@/src/shared/components/shared/subscribe-news';
import { LocaleSwitcher } from '@/src/features/locale-switcher';

export const Header = () => {
	return (
		<header
			className={cn('w-full py-8 container flex justify-between items-center')}
		>
			<Logo />
			<div className={'flex items-center gap-10'}>
				<SubscribeNews theme='dark' />
				<LocaleSwitcher className={'hidden sm:inline-block'} />
			</div>
		</header>
	);
};
