import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Spaininter Group',
		short_name: 'Spaininter',
		description: 'Spaininter Group',
		theme_color: '#000000',
		background_color: '#ffffff',
		start_url: '/',
		display: 'standalone',
		icons: [
			{
				src: '/icon72.png',
				sizes: '72x72',
				type: 'image/png'
			},
			{
				src: '/icon-96x96.png',
				sizes: '96x96',
				type: 'image/png'
			},
			{
				src: '/icon.png',
				sizes: '128x128',
				type: 'image/png'
			},
			{
				src: '/icon-144x144.png',
				sizes: '144x144',
				type: 'image/png'
			},
			{
				src: '/icon-152x152.png',
				sizes: '152x152',
				type: 'image/png'
			},
			{
				src: '/icon-192x192.png',
				sizes: '192x192',
				type: 'image/png'
			},
			{
				src: '/icon-384x384.png',
				sizes: '384x384',
				type: 'image/png'
			},
			{
				src: '/icon-512x512.png',
				sizes: '512x512',
				type: 'image/png'
			}
		]
	};
}
