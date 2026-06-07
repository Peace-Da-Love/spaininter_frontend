import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import {
  getPropertyById,
  getPropertyLocalizedLinks
} from '@/src/app/server-actions/get-property-by-id.action';
import { FlatPage } from '@/src/screens/flat';
import { MinicardLabels } from '@/src/shared/types';
import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';

const SITE_URL = process.env.SITE_URL;

type Props = {
  params: { locale: string; slug: string };
  searchParams: { from?: string };
};

function encodeSlug(slug: string): string {
  try {
    return encodeURIComponent(decodeURIComponent(slug));
  } catch {
    return encodeURIComponent(slug);
  }
}

export async function generateMetadata({
  params: { locale, slug }
}: Omit<Props, 'children'>): Promise<Metadata> {
  try {
    const property = await getPropertyById({ locale, slug });

    if (!property) {
      return {
        title: 'Property Not Found',
        description: 'The requested property could not be found.',
        robots: {
          index: false,
          follow: false
        }
      };
    }

    const images = Array.isArray(property.images)
      ? property.images.map(img => `https://prop.spaininter.com${img}`)
      : [];

    const localizedLinks = await getPropertyLocalizedLinks(slug);
    const hrefLangs: Record<string, string> = localizedLinks.reduce(
      (acc, link) => {
        acc[
          link.locale
        ] = `${SITE_URL}/${link.locale}/property-catalog/flat/${encodeSlug(link.slug)}`;
        return acc;
      },
      {} as Record<string, string>
    );
    const canonical = property.slug
      ? `${SITE_URL}/${locale}/property-catalog/flat/${encodeSlug(property.slug)}`
      : hrefLangs[locale];

    return {
      title: property.title || 'Property',
      description: property.description || '',
      alternates: {
        languages: {
          'x-default': hrefLangs['en'] ?? canonical,
          ...hrefLangs
        },
        canonical
      },
      openGraph: {
        title: property.title || '',
        description: property.description || '',
        images
      }
    };
  } catch (err) {
    console.error('[generateMetadata] ERROR:', err);
    return {
      title: 'Error loading property',
      description: 'An unexpected error occurred while loading this property.',
      robots: {
        index: false,
        follow: false
      }
    };
  }
}

export default async function Page({
  params: { locale, slug },
  searchParams
}: Props) {
  // Enable static rendering
  unstable_setRequestLocale(locale);

  const property = await getPropertyById({ locale, slug });

  if (!property) {
    notFound();
  }

  if (property.slug && encodeSlug(property.slug) !== encodeSlug(slug)) {
    permanentRedirect(`/${locale}/property-catalog/flat/${encodeSlug(property.slug)}`);
  }

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

  return (
    <FlatPage
      property={property}
      locale={locale}
      minicardLabels={minicardLabels}
      backUrl={searchParams.from || `/${locale}/property-catalog`}
    />
  );
}
