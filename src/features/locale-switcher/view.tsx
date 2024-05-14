'use client';

import { useLocale } from 'next-intl';
import { locales } from '@/src/shared/configs';
import { FC } from 'react';
import { SelectItem } from '@/src/shared/components/ui';
import { LocaleSwitcherSelect } from './ui/locale-switcher-select';

type Props = {
	className?: string;
};

export const LocaleSwitcher: FC<Props> = ({ className }) => {
	const currentLocale = useLocale();

	return (
		<LocaleSwitcherSelect defaultValue={currentLocale}>
			{locales.map(locale => {
				return (
					<SelectItem value={locale} key={locale} className={'uppercase'}>
						{locale}
					</SelectItem>
				);
			})}
		</LocaleSwitcherSelect>
	);
};
