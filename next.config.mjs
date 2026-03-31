// @ts-check

import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.spaininter.com';
const PROP_URL = process.env.NEXT_PUBLIC_PROP_URL || 'https://prop.spaininter.com';

/** @type {import('next').NextConfig} */
const config = {
	transpilePackages: ['@mdxeditor/editor'],
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'storage.googleapis.com'
			},
			{
				protocol: 'https',
				hostname: 'api.spaininter.com'
			},
			{
				protocol: 'https',
				hostname: 'prop.spaininter.com'
			}
		]
	},
	async rewrites() {
		return [
			{
				source: '/site-api/:path*',
				destination: `${API_URL}/api/:path*`,
				locale: false
			},
			{
				source: '/:locale/site-api/:path*',
				destination: `${API_URL}/api/:path*`,
				locale: false
			},
			{
				source: '/prop-api/:path*',
				destination: `${PROP_URL}/api/:path*`,
				locale: false
			},
			{
				source: '/:locale/prop-api/:path*',
				destination: `${PROP_URL}/api/:path*`,
				locale: false
			}
		];
	},

	webpack(config) {
		const fileLoaderRule = config.module.rules.find(
			/** @param {{ test?: { test?: (value: string) => boolean } }} rule */
			rule =>
			rule.test?.test?.('.svg')
		);

		config.module.rules.push(
			{
				...fileLoaderRule,
				test: /\.svg$/i,
				resourceQuery: /url/
			},
			{
				test: /\.svg$/i,
				issuer: fileLoaderRule.issuer,
				resourceQuery: { not: [...fileLoaderRule.resourceQuery.not, /url/] },
				use: ['@svgr/webpack']
			}
		);

		fileLoaderRule.exclude = /\.svg$/i;

		return config;
	}
};

export default withNextIntl(config);
