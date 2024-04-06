import { NotFoundPage } from '@/src/screens/not-found';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Page Not Found',
	description: 'Oops... Page Not Found'
};

export default function NotFound() {
	return <NotFoundPage />;
}
