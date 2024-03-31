import { FC } from 'react';

type Props = {
	children: React.ReactNode;
};

export const Provider: FC<Props> = ({ children }) => {
	return <>{children}</>;
};
