import { useTranslations } from 'next-intl';

export const CoursesPage = () => {
	const t = useTranslations('Pages.Courses');

	return (
		<section>
			<div
				className={
					'h-screen bg-cover bg-courses rounded-3xl pt-28 md:pt-48 px-8 md:px-32'
				}
			>
				<h1
					className={'text-3xl md:text-4xl font-bold text-white mb-12 md:mb-16'}
				>
					{t('title')}
				</h1>
				<ul className={'pl-5 text-white text-base md:text-xl font-bold'}>
					<li className={'mb-2.5 last:mb-0 marker'}>{t('list.photo')}</li>
					<li className={'mb-2.5 last:mb-0 marker'}>{t('list.shortVideo')}</li>
					<li className={'mb-2.5 last:mb-0 marker'}>{t('list.telegram')}</li>
					<li className={'mb-2.5 last:mb-0 marker'}>{t('list.crypto')}</li>
					<li className={'mb-2.5 last:mb-0 marker'}>{t('list.work')}</li>
				</ul>
			</div>
		</section>
	);
};
