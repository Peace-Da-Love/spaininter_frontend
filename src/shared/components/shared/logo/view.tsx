import { Link } from '@/src/shared/utils';
import IcLogo from '@/src/app/icons/ic_logo.svg';
import { useTranslations } from 'next-intl';

export const Logo = () => {
	const t = useTranslations('Components');

	return (
		<Link
			className={
				'inline-flex items-center justify-center size-[72px] rounded-3xl backdrop-blur-xl bg-gray-300/40'
			}
			href='/'
		>
			<span className={'sr-only'}>{t('logo')}</span>
			<IcLogo />
		</Link>
	);
};
