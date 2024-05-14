import { CoursesPage } from '@/src/screens/courses';
import { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

type Props = {
	params: { locale: string };
};

export async function generateMetadata({
	params: { locale }
}: Omit<Props, 'children'>): Promise<Metadata> {
	const t = await getTranslations({
		locale
	});

	return {
		title: t('MetaData.CoursesPage.title'),
		description: t('MetaData.CoursesPage.description'),
		openGraph: {
			title: t('MetaData.CoursesPage.title'),
			description: t('MetaData.CoursesPage.description'),
			images: [
				{
					url: '/metadata/og-courses.jpg',
					alt: 'Og Image Alt'
				}
			]
		}
	};
}

const Page = () => {
	return <CoursesPage />;
};

export default Page;
