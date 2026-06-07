'use client';
import IcCities from '@/src/app/icons/ic_cities.svg';
import { Button } from '@/src/shared/components/ui';
import { forwardRef } from 'react';

export const CitiesButton = forwardRef<HTMLButtonElement, {}>((props, ref) => {
	return (
		<Button variant={'menu'} asChild>
			<a
				href="https://t.me/addlist/zixZWkXQiKY2MmVi"
				target="_blank"
				rel="noopener noreferrer"
				aria-label="Cities"
			>
				<IcCities />
			</a>
		</Button>
	);
});

CitiesButton.displayName = 'CitiesButton';
