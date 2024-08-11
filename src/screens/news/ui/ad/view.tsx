import { FC } from 'react';
import { AdWidget } from '../../../../shared/components/shared/ad-widget';
import Link from 'next/link';
import { cn } from '@/src/shared/utils';
import { useTranslations } from 'next-intl';

type Props = {
	adLink: string | null;
	city: string;
};

export const Ad: FC<Props> = ({ adLink, city }) => {
	const t = useTranslations('Components');

	return (
		<div>
			<Link
				href={'https://t.me/SpainDios'}
				className={cn(
					'block text-base text-dark-blue font-medium text-right',
					adLink && 'mb-2'
				)}
			>
				{t('ad')} {city}
			</Link>
			{adLink && <AdWidget adLink={adLink} />}
		</div>
	);
};
