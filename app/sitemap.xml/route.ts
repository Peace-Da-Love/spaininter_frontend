import { metadataAction } from '@/src/app/server-actions';
import { locales } from '@/src/shared/configs';

const SITE_URL = process.env.SITE_URL;

async function generateSiteMap() {
	const newsMetaData = await metadataAction.getNewsMetadata();
	const newsXML = newsMetaData?.data.map(news => {
		return `<url>
                <loc>${SITE_URL}/en/news/${
			news.newsTranslations.find(
				translation => translation.language.language_code === 'en'
			)?.link
		}</loc>
                <changefreq>monthly</changefreq>
                <lastmod>${news.updatedAt}</lastmod>
                ${news.newsTranslations
									.map(translation => {
										if (translation.language.language_code === 'en') return '';
										return `<xhtml:link 
                rel="alternate"
                hreflang="${translation.language.language_code}"
                href="${SITE_URL}/${translation.language.language_code}/news/${translation.link}" />`;
									})
									.join('')}
                </url>`;
	});

	return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
      <url>
        <loc>${SITE_URL}/en</loc>
        <changefreq>daily</changefreq>
        ${locales
					.map(locale => {
						if (locale === 'en') return '';
						return `<xhtml:link rel="alternate" hreflang="${locale}" href="${SITE_URL}/${locale}" />`;
					})
					.join('')}
      </url>
      ${newsXML?.join('')}
    </urlset>
	`;
}

export async function GET() {
	const body = await generateSiteMap();
	const simplifiedBody = body.replace(/>\s+</g, '><').replace(/\s+/g, ' ');

	return new Response(simplifiedBody, {
		status: 200,
		headers: {
			'Content-type': 'application/xml'
		}
	});
}
