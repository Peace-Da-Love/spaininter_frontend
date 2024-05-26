'use client';

import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@radix-ui/react-dropdown-menu';
import IcMessage from '@/src/app/icons/ic_message.svg';
import { cn } from '@/src/shared/utils';
import { FC } from 'react';
import { Button } from '@/src/shared/components/ui';
import { PhoneForm } from '@/src/features/phone-form';
import { EmailForm } from '@/src/features/email-form';
import { TelegramContact } from '@/src/features/telegram-contact';

type Props = {
	className?: string;
};

export const RequestMenu: FC<Props> = ({ className }) => {
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger className={cn(className)} asChild>
				<Button className={'animate-animation-pulse'} variant={'menu'}>
					<IcMessage />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				side={'top'}
				className={'py-2.5 flex flex-col gap-2.5'}
			>
				<DropdownMenuItem asChild>
					<PhoneForm />
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<EmailForm />
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<TelegramContact />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
