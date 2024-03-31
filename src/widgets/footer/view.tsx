import { Logo } from '@/src/shared/components/shared/logo';
import { SubscribeNews } from '@/src/shared/components/shared/subscribe-news';
import IcTgChannel from '@/src/app/icons/ic_telegram_ch.svg';
import Link from 'next/link';

export const Footer = () => {
	return (
		<footer className={'w-full bg-primary rounded-t-3xl py-5'}>
			<div
				className={'container flex justify-between items-center md:pb-0 pb-24'}
			>
				<Logo />
				<div className={'flex items-center gap-10'}>
					<SubscribeNews theme='light' />
					<Link
						className={'inline-block'}
						href='https://t.me/u6996'
						target='_blank'
					>
						<span className={'sr-only'}>Join our telegram channel</span>
						<IcTgChannel />
					</Link>
				</div>
			</div>
		</footer>
	);
};
