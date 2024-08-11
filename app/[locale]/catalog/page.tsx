import { unstable_setRequestLocale } from 'next-intl/server';
import { CatalogPage } from '@/src/screens/catalog';
import { getCatalog } from '@/src/app/server-actions';

type Props = {
	params: { locale: string };
};

export default async function Page({ params: { locale } }: Props) {
	// Enable static rendering
	unstable_setRequestLocale(locale);

	const initialData = await getCatalog({ locale });
	console.log(initialData);

	return <CatalogPage />;
}
