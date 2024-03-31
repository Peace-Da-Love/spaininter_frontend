import Link from 'next/link';
import { cn } from '@/src/shared/utils';
import { FC } from 'react';
import IcTelegram from '@/src/app/icons/ic_telegram_small.svg';
import { useTranslations } from 'next-intl';

type Props = {
	theme: 'dark' | 'light';
};

export const SubscribeNews: FC<Props> = ({ theme }) => {
	const t = useTranslations('Components');

	return (
		<Link
			href='https://t.me/u6996'
			target='_blank'
			className={cn(
				'inline-flex items-center gap-2.5 font-medium',
				theme === 'dark' ? 'text-primary' : 'text-white'
			)}
		>
			{t('subscribeNews')}
			<IcTelegram />
		</Link>
	);
};
