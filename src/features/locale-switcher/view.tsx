import { LocaleSwitcherSelect } from './ui/locale-switcher-select';
import { useLocale } from 'next-intl';
import { locales } from '@/src/shared/configs';
import { FC } from 'react';

type Props = {
	className?: string;
};

export const LocaleSwitcher: FC<Props> = ({ className }) => {
	const locale = useLocale();

	return (
		<LocaleSwitcherSelect className={className} defaultValue={locale}>
			{locales.map(cur => (
				<option key={cur} value={cur}>
					{cur}
				</option>
			))}
		</LocaleSwitcherSelect>
	);
};
