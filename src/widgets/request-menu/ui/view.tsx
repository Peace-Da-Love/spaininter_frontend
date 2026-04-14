'use client';

import IcMessage from '@/src/app/icons/ic_message.svg';
import { cn } from '@/src/shared/utils';
import { FC } from 'react';
import { Button } from '@/src/shared/components/ui';

type Props = {
	className?: string;
};

export const RequestMenu: FC<Props> = ({ className }) => {
	return (
		<Button className={cn('animate-animation-pulse', className)} variant={'menu'} asChild>
			<a
				href="https://t.me/spaininter?direct"
				aria-label="Telegram"
				target="_blank"
				rel="noopener noreferrer"
			>
				<IcMessage />
			</a>
		</Button>
	);
};
