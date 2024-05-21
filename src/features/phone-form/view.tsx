'use client';

import React, { forwardRef, ForwardedRef } from 'react';
import { Button } from '@/src/shared/components/ui';
import { Phone } from 'lucide-react';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger
} from '@radix-ui/react-dropdown-menu';
import { ContactForm } from './ui/contact-form';

interface PhoneFormProps {}

export const PhoneForm = forwardRef<HTMLButtonElement, PhoneFormProps>(
	(props, ref: ForwardedRef<HTMLButtonElement>) => {
		return (
			<DropdownMenu modal={false}>
				<DropdownMenuTrigger asChild>
					<Button ref={ref} variant={'menu'}>
						<Phone fill='#192E51' />
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

PhoneForm.displayName = 'PhoneForm';
