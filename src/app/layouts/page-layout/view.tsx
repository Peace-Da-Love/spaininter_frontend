import { FC, ReactNode } from 'react';
import { cn } from '@/src/shared/utils';
import { Header } from '@/src/widgets/header';
import { Main } from '@/src/widgets/main';
import { Footer } from '@/src/widgets/footer';
import { MobileMenu } from '@/src/widgets/mobile-menu';

type Props = {
	children: ReactNode;
};

export const PageLayout: FC<Props> = ({ children }) => {
	return (
		<div
			className={cn(
				'relative bg-background flex flex-col h-screen justify-between'
			)}
		>
			<Header />
			<Main>{children}</Main>
			<Footer />
			<MobileMenu />
		</div>
	);
};
