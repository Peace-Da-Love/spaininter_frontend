import { Link } from '@/src/shared/utils';
import Image from 'next/image';

export const Logo = () => {
	return (
		<Link className={'inline-block w-10 h-10'} href='/'>
			<Image
				src='/images/logo.png'
				alt='Spaininter logo'
				width={40}
				height={40}
				quality={100}
			/>
		</Link>
	);
};
