'use client';

import { forwardRef } from 'react';
import { usePathname } from 'next/navigation';
import { UserRound } from 'lucide-react';
import { ChannelLink } from '@/src/shared/utils';
import { Button } from '@/src/shared/components/ui';

export const ProfileButton = forwardRef<HTMLButtonElement, {}>((props, ref) => {
	const pathname = usePathname();
	const locale = pathname.split('/').filter(Boolean)[0] || 'en';

	return (
		<Button variant={'menu'} asChild>
			<ChannelLink locale={locale} href="/profile" aria-label="Profile">
				<UserRound className="size-8" />
			</ChannelLink>
		</Button>
	);
});

ProfileButton.displayName = 'ProfileButton';
