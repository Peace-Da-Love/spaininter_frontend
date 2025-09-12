import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { getPropertyById } from '@/src/app/server-actions';
import { FlatPage} from '@/src/screens/flat';
import { MinicardLabels } from '@/src/shared/types';

type Props = {
    params: { locale: string; id: string };
    searchParams: { from?: string };
};

export default async function Page({ params: { locale, id }, searchParams }: Props) {
    // Enable static rendering
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
    
    const property = await getPropertyById({ locale, id });

  return (
    <FlatPage
      property={property}
      locale={locale}
      minicardLabels={minicardLabels}
      backUrl={searchParams.from || `/${locale}/property-catalog`}
    />
  );
}
