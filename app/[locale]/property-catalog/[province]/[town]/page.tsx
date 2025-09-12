import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { Metadata } from 'next';
import { PropertyCatalogPage } from '@/src/screens/property-catalog';
import { getCatalog } from '@/src/app/server-actions';
import { PropertyCatalogFilterLabels } from '@/src/shared/types';

type Props = {
  params: { locale: string; province: string; town: string };
  searchParams: { type?: string; order?: 'asc' | 'desc'; ref?: string };
};

export async function generateMetadata({
  params: { locale, town },
}: Omit<Props, 'children'>): Promise<Metadata> {
  const t = await getTranslations({ locale });
  const townName = decodeURIComponent(town);

  return {
    title: t('MetaData.PropertyCatalogPage.titleTown', { town: townName }),
    description: t('MetaData.PropertyCatalogPage.descriptionTown', { town: townName }),
    openGraph: {
      title: t('MetaData.PropertyCatalogPage.titleTown', { town: townName }),
      description: t('MetaData.PropertyCatalogPage.descriptionTown', { town: townName }),
    },
  };
}

export default async function Page({ params: { locale, province, town }, searchParams }: Props) {
  unstable_setRequestLocale(locale);
  const t = await getTranslations({ locale });

  const initialData = await getCatalog({
    locale,
    page: 1,
    province: decodeURIComponent(province),
    town: decodeURIComponent(town),
    type: searchParams.type,
    order: searchParams.order,
    ref: searchParams.ref,
  });
  
  
  if (!initialData) {
    return null;
  }

  const filterLabels: PropertyCatalogFilterLabels = {
    province: t('Pages.PropertyCatalog.filters.province'),
    allProvinces: t('Pages.PropertyCatalog.filters.allProvinces'),
    town: t('Pages.PropertyCatalog.filters.town'),
    allTowns: t('Pages.PropertyCatalog.filters.allTowns'),
    type: t('Pages.PropertyCatalog.filters.type'),
    allTypes: t('Pages.PropertyCatalog.filters.allTypes'),
    price: t('Pages.PropertyCatalog.filters.price'),
    priceAsc: t('Pages.PropertyCatalog.filters.priceAsc'),
    priceDesc: t('Pages.PropertyCatalog.filters.priceDesc'),
    ref: t('Pages.PropertyCatalog.filters.ref'),
    apply: t('Pages.PropertyCatalog.filters.apply'),
    reset: t('Pages.PropertyCatalog.filters.reset')
  };

  return (
    <PropertyCatalogPage
        title={t('Pages.PropertyCatalog.title')}
        loadMore={t('Pages.PropertyCatalog.loadMore')}
        loading={t('Pages.PropertyCatalog.loading')}
        filterLabels={filterLabels}
        locale={locale}
        data={initialData}
        searchParams={searchParams}
    />
  );
}
