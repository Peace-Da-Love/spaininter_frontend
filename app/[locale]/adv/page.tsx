import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { getCatalog } from '@/src/app/server-actions';
import { AdvPage } from '@/src/screens/adv';
import { MinicardLabels } from '@/src/shared/types';
import { Metadata } from 'next';
import { $fetchP } from '@/src/app/server-api';
import { Property } from '@/src/shared/types';

type Props = {
  params: { locale: string };
};

export async function generateMetadata({
  params: { locale }
}: Props): Promise<Metadata> {
  return {
    title: 'Properties Advertisement',
    description: 'Browse our property collection'
  };
}

async function getFirstPageProperties(locale: string): Promise<Property[]> {
  // Load only first page on server for faster initial load
  try {
    const qs = new URLSearchParams();
    qs.set('page', '1');

    const url = `properties?${qs.toString()}`;
    const response = await $fetchP(url, {
      headers: {
        'Accept-Language': locale,
      },
    });

    if (!response.ok) return [];

    const data = (await response.json()) as Property[];
    return data || [];
  } catch (error) {
    console.error('Error fetching first page properties:', error);
    return [];
  }
}

export default async function Page({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const minicardLabels: MinicardLabels = {
    area: t('Pages.Property.area'),
    bedrooms: t('Pages.Property.bedrooms'),
    baths: t('Pages.Property.baths'),
    beach: t('Pages.Property.beach'),
    pool: t('Pages.Property.pool'),
    gym: t('Pages.Property.gym'),
    parking: t('Pages.Property.parking'),
    showMore: t('Pages.Property.showMore'),
    hide: t('Pages.Property.hide')
  };

  // Load only first page on server - rest will load on client
  const properties = await getFirstPageProperties(locale);

  return (
    <AdvPage
      properties={properties}
      locale={locale}
      minicardLabels={minicardLabels}
    />
  );
}

