import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
	return {
		name: 'Spaininter Group',
		short_name: 'Spaininter',
		description: 'Spaininter Group',
		theme_color: '#000000',
		background_color: '#ffffff',
		start_url: '/',
		display: 'standalone'
	};
}
