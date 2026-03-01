import { ChannelLink } from '@/src/shared/utils';
import IcEducation from '@/src/app/icons/ic_education.svg';
import { Button } from '@/src/shared/components/ui';
import { forwardRef } from 'react';
import { usePathname } from 'next/navigation';

export const EducationButton = forwardRef<HTMLButtonElement, {}>((props, ref) => {
	const pathname = usePathname();
	const locale = pathname.split('/').filter(Boolean)[0] || 'en';

	return (
		<Button variant={'menu'} asChild>
			<ChannelLink locale={locale} href='/courses'>
				<IcEducation />
			</ChannelLink>
		</Button>
	);
});
EducationButton.displayName = 'EducationButton';
