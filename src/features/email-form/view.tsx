'use client';

import React, { forwardRef, ForwardedRef } from 'react';
import { Button } from '@/src/shared/components/ui';
import IcMail from '@/src/app/icons/ic_email.svg';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@radix-ui/react-dropdown-menu';
import { ContactForm } from './ui/contact-form';

interface EmailFormProps {}

export const EmailForm = forwardRef<HTMLButtonElement, EmailFormProps>(
	(props, ref: ForwardedRef<HTMLButtonElement>) => {
		return (
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button ref={ref} variant={'menu'}>
						<IcMail />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent className={'px-2.5'} side={'right'}>
					<DropdownMenuItem asChild>
						<ContactForm />
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		);
	}
);

EmailForm.displayName = 'EmailForm';
