import { MetadataRoute } from 'next';

const SITE_URL = process.env.SITE_URL;

export default function robots(): MetadataRoute.Robots {
	return {
		rules: {
			userAgent: '*',
			allow: '/'
		},
		sitemap: `${SITE_URL}/sitemap.xml`
	};
}
