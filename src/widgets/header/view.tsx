import { cn } from '@/src/shared/utils';
import { Logo } from '../../shared/components/shared/logo';
import { SubscribeNews } from '@/src/shared/components/shared/subscribe-news';

export const Header = () => {
	return (
		<header
			className={cn('w-full py-8 container flex justify-between items-center')}
		>
			<Logo />
			<SubscribeNews theme='dark' />
		</header>
	);
};
