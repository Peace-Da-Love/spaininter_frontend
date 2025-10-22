import { Montserrat } from 'next/font/google';

export const montserrat = Montserrat({
	subsets: ['latin', 'latin-ext', 'cyrillic', 'cyrillic-ext'],
	weight: ['300', '400', '500', '600', '700'],
	display: 'swap',
	variable: '--montserrat-font'
});
