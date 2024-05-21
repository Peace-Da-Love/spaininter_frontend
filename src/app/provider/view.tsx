import { FC } from 'react';
import { ReCaptchaProvider } from 'next-recaptcha-v3';
import NextTopLoader from 'nextjs-toploader';

type Props = {
	children: React.ReactNode;
};

const RECAPTCHA_SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY as string;

export const Provider: FC<Props> = ({ children }) => {
	return (
		<ReCaptchaProvider reCaptchaKey={RECAPTCHA_SITE_KEY}>
			<NextTopLoader showSpinner={false} color={'#000000'} />
			{children}
		</ReCaptchaProvider>
	);
};
