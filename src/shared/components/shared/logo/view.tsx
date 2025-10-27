'use client';

import { Link } from '@/src/shared/utils';
import IcLogo from '@/src/app/icons/ic_logo.svg';

export const Logo = () => {
	return (
		<Link
			className={
				'inline-flex items-center justify-center size-[72px] rounded-3xl backdrop-blur-xl bg-gray-300/40'
			}
			href='/'
		>
			<IcLogo />
		</Link>
	);
};
