'use client';

import { ChannelLink } from '@/src/shared/utils';
import IcLogo from '@/src/app/icons/ic_logo.svg';
import { usePathname } from 'next/navigation';

export const Logo = () => {
	const pathname = usePathname();
	const locale = pathname.split('/').filter(Boolean)[0] || 'en';

	return (
		<ChannelLink
			locale={locale}
			className={
				'inline-flex items-center justify-center size-[72px] rounded-3xl backdrop-blur-xl bg-gray-300/40'
			}
			href='/'
		>
			<IcLogo />
		</ChannelLink>
	);
};
