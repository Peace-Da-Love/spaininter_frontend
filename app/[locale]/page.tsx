import { redirect } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { Metadata } from 'next';
import { locales } from '@/src/shared/configs';

const SITE_URL = process.env.SITE_URL;

type Props = {
  params: { locale: string };
  searchParams?: Record<string, string>;
};

export async function generateMetadata({
  params: { locale }
}: Omit<Props, 'children'>): Promise<Metadata> {
  const t = await getTranslations({ locale, namespace: 'MetaData.PropertyCatalogPage' });

  const hrefLangs: Record<string, string> = locales.reduce((acc, loc) => {
    acc[loc] = `${SITE_URL}/${loc}`;
    return acc;
  }, {} as Record<string, string>);

  return {
    title: t('titleDefault'),
    description: t('descriptionDefault'),
    alternates: {
      languages: {
        'x-default': hrefLangs['en'],
        ...hrefLangs,
      },
      canonical: `${SITE_URL}/en/property-catalog`,
    },
    openGraph: {
      title: t('titleDefault'),
      description: t('descriptionDefault'),
    },
  };
}

export default async function IndexPage({ params: { locale }, searchParams }: Props) {
  const query = new URLSearchParams(searchParams || {}).toString();
  redirect(`/${locale}/property-catalog${query ? `?${query}` : ''}`);
}
