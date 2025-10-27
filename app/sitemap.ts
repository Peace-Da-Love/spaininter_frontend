import { MetadataRoute } from 'next';
import { locales } from '@/src/shared/configs';
import { metadataAction } from '../src/app/server-actions';
import { pathnames } from '@/src/shared/configs/i18n';

const SITE_URL = process.env.SITE_URL;

// Helper function to get last modified date from API data or default to now
const getLastModified = (value?: string | Date | null): Date => {
	return value ? new Date(value) : new Date();
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	// Home pages (main entry points)
	const homePages: MetadataRoute.Sitemap = locales.map(locale => ({
		url: `${SITE_URL}/${locale}`,
		changeFrequency: 'daily' as const,
		priority: 1.0,
		lastModified: new Date()
	}));

	// Courses pages (with localized paths)
	const coursesPages: MetadataRoute.Sitemap = locales.map(locale => {
		const coursesPath = typeof pathnames['/courses'] === 'object' 
			? pathnames['/courses'][locale as keyof typeof pathnames['/courses']]
			: '/courses';
		return {
			url: `${SITE_URL}/${locale}${coursesPath}`,
			changeFrequency: 'monthly' as const,
			priority: 0.6,
			lastModified: new Date()
		};
	});

	// Catalog Telegram pages
	const catalogTelegramPages: MetadataRoute.Sitemap = locales.map(locale => ({
		url: `${SITE_URL}/${locale}/catalog-telegram`,
		changeFrequency: 'monthly' as const,
		priority: 0.5,
		lastModified: new Date()
	}));

	// News catalog pages
	const newsCatalogPages: MetadataRoute.Sitemap = locales.map(locale => ({
		url: `${SITE_URL}/${locale}/news`,
		changeFrequency: 'daily' as const,
		priority: 0.7,
		lastModified: new Date()
	}));

	// Property Catalog pages
	const propertyCatalogPages: MetadataRoute.Sitemap = locales.map(locale => {
		return {
			url: `${SITE_URL}/${locale}/property-catalog`,
			changeFrequency: 'daily' as const,
			priority: 1.0,
			lastModified: new Date()
		};
	});

	// Get categories metadata for category pages
	const categoryMetadata = await metadataAction.getCategoryMetadata();
	let categoryPages: MetadataRoute.Sitemap = [];

	if (categoryMetadata && categoryMetadata.data) {
		// Only add category main pages (first page) to avoid duplicates
		categoryPages = categoryMetadata.data.flatMap(category =>
			locales.map(locale => ({
				url: `${SITE_URL}/${locale}/category/${encodeURIComponent(category.category_name)}`,
				changeFrequency: 'daily' as const,
				priority: 0.6,
				lastModified: getLastModified(category.last_modified)
			}))
		);
	}

	// Get places metadata for province and town pages
	const placesMetadata = await metadataAction.getPlacesMetadata();
	
	let propertyProvincePages: MetadataRoute.Sitemap = [];
	let propertyTownPages: MetadataRoute.Sitemap = [];

	if (placesMetadata) {
		// Generate province pages with high priority
		propertyProvincePages = placesMetadata.flatMap(province => 
			locales.map(locale => ({
				url: `${SITE_URL}/${locale}/property-catalog/${encodeURIComponent(province.name)}`,
				changeFrequency: 'daily' as const,
				priority: 0.8,
				lastModified: new Date()
			}))
		);

		// Generate town pages with medium priority
		propertyTownPages = placesMetadata.flatMap(province => 
			province.cities.flatMap(town => 
				locales.map(locale => ({
					url: `${SITE_URL}/${locale}/property-catalog/${encodeURIComponent(province.name)}/${encodeURIComponent(town.name)}`,
					changeFrequency: 'daily' as const,
					priority: 0.6,
					lastModified: new Date()
				}))
			)
		);
	}

	// Get properties metadata for individual property pages
	const propertiesMetadata = await metadataAction.getPropertiesMetadata();
	let individualPropertyPages: MetadataRoute.Sitemap = [];

	if (propertiesMetadata && propertiesMetadata.length > 0) {
		individualPropertyPages = propertiesMetadata.flatMap(property => 
			locales.map(locale => ({
				url: `${SITE_URL}/${locale}/property-catalog/flat/${property.slug}`,
				changeFrequency: 'weekly' as const,
				priority: 0.4,
				lastModified: getLastModified(property.date)
			}))
		);
	}

	// Get news metadata
	const newsMetaData = await metadataAction.getNewsMetadata();
	let newsPages: MetadataRoute.Sitemap = [];

	if (newsMetaData) {
		newsPages = newsMetaData.data.flatMap(news =>
			news.newsTranslations.map(translation => ({
				url: `${SITE_URL}/${translation.language.language_code}/${translation.link}`,
				changeFrequency: 'yearly' as const,
				priority: 0.3,
				lastModified: getLastModified(news.updatedAt)
			}))
		);
	}

	// Combine all sitemap entries in logical order
	return [
		...homePages,
		...propertyCatalogPages,
		...propertyProvincePages,
		...propertyTownPages,
		...individualPropertyPages,
		...coursesPages,
		...catalogTelegramPages,
		...newsCatalogPages,
		...categoryPages,
		...newsPages
	];
}