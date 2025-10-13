import { MetadataRoute } from 'next';
import { locales } from '@/src/shared/configs';
import { metadataAction } from '../src/app/server-actions';

const SITE_URL = process.env.SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const propertyCatalogPages: MetadataRoute.Sitemap = locales.map(locale => {
		return {
			url: `${SITE_URL}/${locale}/property-catalog`,
			changeFrequency: 'daily' as const,
			priority: 1.0,
			lastModified: new Date()
		};
	});

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
				lastModified: property.date ? new Date(property.date) : new Date()
			}))
		);
	}

	// Get news metadata
	const newsMetaData = await metadataAction.getNewsMetadata();
	let newsPages: MetadataRoute.Sitemap = [];

	if (newsMetaData) {
		newsPages = newsMetaData.data.map(news => {
			const translations: MetadataRoute.Sitemap = news.newsTranslations.map(
				translation => {
					return {
						url: `${SITE_URL}/${translation.language.language_code}/${translation.link}`,
						changeFrequency: 'yearly' as const,
						priority: 0.3,
						lastModified: news.updatedAt
					};
				}
			);
			return translations;
		}).flatMap(arr => arr);
	}

	// Combine all sitemap entries
	return [
		...propertyCatalogPages,
		...propertyProvincePages,
		...propertyTownPages,
		...individualPropertyPages,
		...newsPages
	];
}