import { useTranslations } from 'next-intl';
import { unstable_setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';

type Props = {
	params: { locale: string };
};

export const metadata: Metadata = {
	title: 'Home',
	description: 'This is the home page'
};

export default function IndexPage({ params: { locale } }: Props) {
	// Enable static rendering
	unstable_setRequestLocale(locale);

	const t = useTranslations('IndexPage');

	return (
		<div className={''}>
			<p className='max-w-[590px]'>
				{t.rich('description', {
					code: chunks => <code className='font-mono text-white'>{chunks}</code>
				})}
			</p>
		</div>
	);
}
