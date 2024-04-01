import { Link } from '@/src/shared/utils';
import IcLogo from '@/src/app/icons/ic_logo.svg';
import { useTranslations } from 'next-intl';

export const Logo = () => {
	const t = useTranslations('Components');

	return (
		<Link className={'inline-block w-10 h-10'} href='/'>
			<span className={'sr-only'}>{t('logo')}</span>
			<IcLogo />
		</Link>
	);
};
