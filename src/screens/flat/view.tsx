import { FC } from 'react';

type Props = {
	id: string;
};

export const FlatPage: FC<Props> = ({ id }) => {
	return (
		<div>
			<h1>Flat Page</h1>
		</div>
	);
};
