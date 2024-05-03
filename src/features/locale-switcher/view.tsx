import { LocaleSwitcherSelect } from './ui/locale-switcher-select';
import { useLocale, useTranslations } from 'next-intl';
import { locales } from '@/src/shared/configs';
import { FC } from 'react';
import { SelectItem, SelectLabel } from '@/src/shared/components/ui';

type Props = {
	className?: string;
};

export const LocaleSwitcher: FC<Props> = ({ className }) => {
	const t = useTranslations('Components');
	const locale = useLocale();

	return (
		<LocaleSwitcherSelect className={className} defaultValue={locale}>
			<SelectLabel>{t('language')}</SelectLabel>
			{locales.map(locale => (
				<SelectItem
					className={'text-primary uppercase relative'}
					key={locale}
					value={locale}
				>
					{locale}
				</SelectItem>
			))}
		</LocaleSwitcherSelect>
	);
};
