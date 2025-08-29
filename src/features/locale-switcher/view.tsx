'use client';

import { useLocale } from 'next-intl';
import { locales } from '@/src/shared/configs';
import { SelectItem } from '@/src/shared/components/ui';
import { LocaleSwitcherSelect } from './ui/locale-switcher-select';
import { forwardRef } from 'react';

type Props = {
	className?: string;
};
export const LocaleSwitcher = forwardRef<HTMLButtonElement, Props>((props, ref) => {
	const currentLocale = useLocale();

	return (
		<LocaleSwitcherSelect ref={ref} defaultValue={currentLocale} {...props}>
			{locales.map(locale => {
				return (
					<SelectItem value={locale} key={locale} className={'uppercase'}>
						{locale}
					</SelectItem>
				);
			})}
		</LocaleSwitcherSelect>
	);
});

LocaleSwitcher.displayName = 'LocaleSwitcher';
