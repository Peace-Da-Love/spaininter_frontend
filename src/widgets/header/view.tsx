import { cn } from '@/src/shared/utils';
import { Logo } from '../../shared/components/shared/logo';
import { SiteMenu } from '@/src/widgets/site-menu';

export const Header = () => {
	return (
		<header className={cn('fixed top-5 z-50 flex gap-2.5')}>
			<Logo />
		</header>
	);
};
