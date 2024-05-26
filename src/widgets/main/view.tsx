import { FC, ReactNode } from 'react';
import { SiteMenu } from '@/src/widgets/site-menu';
import { RequestMenu } from '@/src/widgets/request-menu';

type Props = {
	children: ReactNode;
};

export const Main: FC<Props> = ({ children }) => {
	return (
		<main className={'w-full flex-grow py-5'}>
			{children}

			<SiteMenu
				className={'fixed bottom-2.5 right-2.5 z-50 inline-flex md:hidden'}
			/>
			<RequestMenu className={'fixed bottom-2.5 z-50'} />
		</main>
	);
};
