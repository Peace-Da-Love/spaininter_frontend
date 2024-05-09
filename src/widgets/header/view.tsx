import { cn } from '@/src/shared/utils';
import { Logo } from '../../shared/components/shared/logo';

export const Header = () => {
	return (
		<header className={cn('fixed top-5 z-50')}>
			<Logo />
		</header>
	);
};
