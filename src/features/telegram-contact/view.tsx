'use client';

import React, { forwardRef, ForwardedRef } from 'react';
import { Button } from '@/src/shared/components/ui';
import IcTelegram from '@/src/app/icons/ic_telegram_small.svg';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@radix-ui/react-dropdown-menu';
import { ContactBox } from './ui/contact-box';

interface TelegramContactProps {}

export const TelegramContact = forwardRef<
	HTMLButtonElement,
	TelegramContactProps
>((props, ref: ForwardedRef<HTMLButtonElement>) => {
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button ref={ref} variant={'menu'}>
					<IcTelegram />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className={'px-2.5'} side={'right'}>
				<DropdownMenuItem asChild>
					<ContactBox />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
});

TelegramContact.displayName = 'TelegramContact';
