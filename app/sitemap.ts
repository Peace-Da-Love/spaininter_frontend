import { MetadataRoute } from 'next';
import { locales } from '@/src/shared/configs';
import { metadataAction } from '@/src/app/server-actions';

const SITE_URL = process.env.SITE_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
	const translationsHomePage: MetadataRoute.Sitemap = locales.map(locale => {
		return {
			url: `${SITE_URL}/${locale}`,
			changeFrequency: 'daily'
		};
	});

	const newsMetaData = await metadataAction.getNewsMetadata();

	if (!newsMetaData) return [];

	const translationsNewsPages = newsMetaData.data.map(news => {
		const translations: MetadataRoute.Sitemap = news.newsTranslations.map(
			translation => {
				return {
					url: `${SITE_URL}/${translation.language.language_code}/${translation.link}`,
					changeFrequency: 'yearly',
					lastModified: news.updatedAt
				};
			}
		);

		return translations;
	});

	return [
		...translationsHomePage,
		...translationsNewsPages.flatMap(arr => arr)
	];
}
