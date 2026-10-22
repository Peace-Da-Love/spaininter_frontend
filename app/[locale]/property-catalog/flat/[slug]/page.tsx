import { getTranslations, unstable_setRequestLocale } from 'next-intl/server';
import {
  getPropertyById,
  getPropertyLocalizedLinks
} from '@/src/app/server-actions/get-property-by-id.action';
import { FlatPage } from '@/src/screens/flat';
import { MinicardLabels, Property } from '@/src/shared/types';
import { Metadata } from 'next';
import { notFound, permanentRedirect } from 'next/navigation';
import { extractBeforeCR } from '@/src/shared/utils';

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

function cleanText(value?: string | null): string {
  return (value ?? '')
    .replace(/&#13;|<br\s*\/?>/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function getAbsoluteImageUrl(path: string): string {
  return /^https?:\/\//i.test(path) ? path : `https://prop.spaininter.com${path}`;
}

function getCanonicalPropertyUrl(locale: string, slug: string): string {
  return `${SITE_URL}/${locale}/property-catalog/flat/${encodeSlug(slug)}`;
}

function buildPropertyJsonLd(property: Property, locale: string) {
  const canonicalUrl = property.slug
    ? getCanonicalPropertyUrl(locale, property.slug)
    : `${SITE_URL}/${locale}/property-catalog`;
  const name = cleanText(extractBeforeCR(property.title));
  const description = cleanText(property.description) || cleanText(property.title) || name;
  const images = Array.isArray(property.images)
    ? property.images.map(getAbsoluteImageUrl)
    : [];
  const latitude = property.location?.latitude
    ? Number(property.location.latitude)
    : undefined;
  const longitude = property.location?.longitude
    ? Number(property.location.longitude)
    : undefined;
  const additionalProperty = [
    property.beds
      ? {
          '@type': 'PropertyValue',
          name: 'Bedrooms',
          value: property.beds
        }
      : undefined,
    property.baths
      ? {
          '@type': 'PropertyValue',
          name: 'Bathrooms',
          value: property.baths
        }
      : undefined,
    typeof property.surface_area === 'number'
      ? {
          '@type': 'PropertyValue',
          name: 'Surface area',
          value: property.surface_area,
          unitText: 'm2'
        }
      : undefined,
    typeof property.pool === 'boolean'
      ? {
          '@type': 'PropertyValue',
          name: 'Pool',
          value: property.pool ? 'Yes' : 'No'
        }
      : undefined,
    property.ref
      ? {
          '@type': 'PropertyValue',
          name: 'Reference',
          value: property.ref
        }
      : undefined
  ].filter(Boolean);

  const breadcrumbList = {
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Property Catalog',
        item: `${SITE_URL}/${locale}/property-catalog`
      },
      property.province
        ? {
            '@type': 'ListItem',
            position: 2,
            name: property.province,
            item: `${SITE_URL}/${locale}/property-catalog/${encodeURIComponent(property.province)}`
          }
        : undefined,
      property.province && property.town
        ? {
            '@type': 'ListItem',
            position: 3,
            name: property.town,
            item: `${SITE_URL}/${locale}/property-catalog/${encodeURIComponent(property.province)}/${encodeURIComponent(property.town)}`
          }
        : undefined,
      {
        '@type': 'ListItem',
        position: property.province && property.town ? 4 : property.province ? 3 : 2,
        name,
        item: canonicalUrl
      }
    ].filter(Boolean)
  };

  const product = {
    '@type': 'Product',
    '@id': `${canonicalUrl}#property`,
    name,
    description,
    image: images.length > 0 ? images : undefined,
    sku: property.ref || String(property._id),
    category: property._type || undefined,
    offers: property.price
      ? {
          '@type': 'Offer',
          url: canonicalUrl,
          price: property.price,
          priceCurrency: property.currency || 'EUR',
          availability: 'https://schema.org/InStock'
        }
      : undefined,
    additionalProperty:
      additionalProperty.length > 0 ? additionalProperty : undefined
  };

  const place =
    property.town || property.province || (!isNaN(latitude ?? NaN) && !isNaN(longitude ?? NaN))
      ? {
          '@type': 'Place',
          '@id': `${canonicalUrl}#place`,
          name: [property.town, property.province, property.country]
            .filter(Boolean)
            .join(', '),
          address: {
            '@type': 'PostalAddress',
            addressLocality: property.town || undefined,
            addressRegion: property.province || undefined,
            addressCountry: property.country || 'Spain'
          },
          geo:
            !isNaN(latitude ?? NaN) && !isNaN(longitude ?? NaN)
              ? {
                  '@type': 'GeoCoordinates',
                  latitude,
                  longitude
                }
              : undefined
        }
      : undefined;

  return {
    '@context': 'https://schema.org',
    '@graph': [breadcrumbList, product, place].filter(Boolean)
  };
}

function stringifyJsonLd(value: unknown): string {
  return JSON.stringify(value).replace(/</g, '\\u003c');
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
  const jsonLd = buildPropertyJsonLd(property, locale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: stringifyJsonLd(jsonLd) }}
      />
      <FlatPage
        property={property}
        locale={locale}
        minicardLabels={minicardLabels}
        backUrl={searchParams.from || `/${locale}/property-catalog`}
      />
    </>
  );
}
