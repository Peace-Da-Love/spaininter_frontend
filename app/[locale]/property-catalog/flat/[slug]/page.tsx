import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import { getPropertyById } from '@/src/app/server-actions';
import { FlatPage} from '@/src/screens/flat';
import { MinicardLabels } from '@/src/shared/types';
import { Metadata } from 'next';

type Props = {
    params: { locale: string; slug: string };
    searchParams: { from?: string };
};

export async function generateMetadata({
    params: { locale, slug }
}: Omit<Props, 'children'>): Promise<Metadata> {
    const property = await getPropertyById({ locale, slug });
    
    return {
        title: property.title,
        description: property.description,
        openGraph: {
            title: property.title,
            description: property.description,
            images: property.images.map(img => `https://prop.spaininter.com${img}`),
        },
    };
}

export default async function Page({ params: { locale, slug }, searchParams }: Props) {
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
    
    const property = await getPropertyById({ locale, slug });

  return (
    <FlatPage
      property={property}
      locale={locale}
      minicardLabels={minicardLabels}
      backUrl={searchParams.from || `/${locale}/property-catalog`}
    />
  );
}
