import { FC, ReactNode } from 'react';
import { SiteMenu } from '@/src/widgets/site-menu';

type Props = {
	children: ReactNode;
};

export const Main: FC<Props> = ({ children }) => {
	return (
		<main className={'w-full flex-grow py-5 pb-20'}>
			{children}
			<div className={'fixed bottom-2.5 right-2.5 z-50 flex gap-2.5'}>
				<SiteMenu className={'flex md:hidden '} />
			</div>
		</main>
	);
};
