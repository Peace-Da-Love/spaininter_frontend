import { FC, ReactNode } from 'react';

type Props = {
	children: ReactNode;
};

export const Main: FC<Props> = ({ children }) => {
	return (
		<main className={'w-full flex-grow container pb-8 sm:pb-12'}>
			{children}
		</main>
	);
};
