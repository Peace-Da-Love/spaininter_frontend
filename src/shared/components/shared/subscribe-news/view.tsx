import Link from 'next/link';
import { cn } from '@/src/shared/utils';
import { FC } from 'react';
import IcTelegram from '@/src/app/icons/ic_telegram_small.svg';
import { useTranslations } from 'next-intl';

type Props = {
	theme: 'dark' | 'light';
	className?: string;
};

export const SubscribeNews: FC<Props> = ({ theme, className }) => {
	const t = useTranslations('Components');

	return (
		<Link
			href='https://t.me/SpainInter'
			target='_blank'
			className={cn(
				'inline-flex items-center gap-2.5 font-medium',
				theme === 'dark' ? 'text-primary' : 'text-white',
				className
			)}
		>
			{t('subscribeNews')}
			<IcTelegram />
		</Link>
	);
};
