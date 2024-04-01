import { LocaleSwitcherSelect } from './ui/locale-switcher-select';
import { useLocale, useTranslations } from 'next-intl';
import { locales } from '@/src/shared/configs';
import { FC } from 'react';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue
} from '@/src/shared/components/ui';

type Props = {
	className?: string;
};

export const LocaleSwitcher: FC<Props> = ({ className }) => {
	const t = useTranslations('Components');
	const locale = useLocale();

	return (
		<LocaleSwitcherSelect defaultValue={locale}>
			<SelectLabel>{t('language')}</SelectLabel>
			{locales.map(locale => (
				<SelectItem
					className={'text-primary uppercase'}
					key={locale}
					value={locale}
				>
					{locale}
				</SelectItem>
			))}
		</LocaleSwitcherSelect>
	);
};
