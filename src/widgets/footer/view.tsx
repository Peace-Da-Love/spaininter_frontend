import { Logo } from '@/src/shared/components/shared/logo';
import { SubscribeNews } from '@/src/shared/components/shared/subscribe-news';
import IcTgChannel from '@/src/app/icons/ic_telegram_ch.svg';
import Link from 'next/link';
import { useTranslations } from 'next-intl';

export const Footer = () => {
	const t = useTranslations('Components');

	return (
		<footer className={'w-full bg-primary rounded-t-3xl py-5'}>
			<div
				className={'container flex justify-between items-center md:pb-0 pb-10'}
			>
				<Logo />
				<div className={'flex items-center gap-10'}>
					<SubscribeNews theme='light' className={'hidden sm:inline-flex'} />
					<Link
						title={t('subscribeNewsOur')}
						aria-label={t('subscribeNewsOur')}
						className={'inline-block'}
						href='https://gospodbog.com'
						target='_blank'
					>
						<span className={'sr-only'}>{t('subscribeNewsOur')}</span>
						<IcTgChannel />
					</Link>
				</div>
			</div>
		</footer>
	);
};
