import { unstable_setRequestLocale } from 'next-intl/server';
import { FlatPage } from '@/src/screens/flat';

type Props = {
	params: { locale: string; id: string };
};

function Page({ params: { locale, id } }: Props) {
	// Enable static rendering
	unstable_setRequestLocale(locale);

	return <FlatPage id={id} />;
}
