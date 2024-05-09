import { Link } from '@/src/shared/utils';
import IcHome from '@/src/app/icons/ic_home.svg';

export const HomeLink = () => {
	return (
		<Link href={'/'} className={'inline-block'}>
			<IcHome />
			<span className={'sr-only'}>Home</span>
		</Link>
	);
};
