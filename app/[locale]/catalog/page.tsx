import { unstable_setRequestLocale } from 'next-intl/server';
import { CatalogPage } from '@/src/screens/catalog';

type Props = {
	params: { locale: string };
};

export default async function Page({ params: { locale } }: Props) {
	// Enable static rendering
	unstable_setRequestLocale(locale);

	return <CatalogPage />;
}
