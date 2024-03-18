import { FC, ReactNode } from 'react';

type Props = {
	children: ReactNode;
};

export const Main: FC<Props> = ({ children }) => {
	return <main className={'flex-grow container pb-12'}>{children}</main>;
};
