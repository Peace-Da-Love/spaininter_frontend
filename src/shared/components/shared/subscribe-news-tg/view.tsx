import Link from 'next/link';
import { cn } from '@/src/shared/utils';
import IcTelegram from '@/src/app/icons/ic_telegram_big.svg';
import { useTranslations } from 'next-intl';

export const SubscribeNewsTg = () => {
	const t = useTranslations('Components');

	return (
		<Link
			aria-label={t('subscribeNewsOur')}
			className={cn(
				'inline-flex w-full sm:w-auto items-center justify-center gap-2.5 text-xl font-medium text-white bg-light-blue rounded-3xl py-8 px-5'
			)}
			href='https://t.me/SpainInter'
			target='_blank'
		>
			<IcTelegram />
			<i className={'not-italic'}>{t('subscribeNewsOur')}</i>
		</Link>
	);
};
