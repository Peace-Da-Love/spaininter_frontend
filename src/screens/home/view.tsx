import { FC, Fragment } from 'react';
import { SubscribeNewsTg } from '@/src/shared/components/shared/subscribe-news-tg';
import { NewsFilter } from '@/src/widgets/news-filter';
import {
	getCategoriesByLangCode,
	INewsFilterResponse
} from '@/src/app/server-actions';
import { Recommends } from '@/src/widgets/recommends';
import { MobileMenu } from '@/src/widgets/mobile-menu';
import { useLocale } from 'next-intl';

type Props = {
	data: INewsFilterResponse;
	title: string;
};

export const HomePage: FC<Props> = async ({ data, title }) => {
	const locale = useLocale();
	const categories = await getCategoriesByLangCode(locale);

	return (
		<Fragment>
			<section className={'pb-5 md:pb-10'}>
				<h1 className={'sr-only'}>{title}</h1>
				<Recommends />
			</section>
			<section className={'scroll-pt-40'} id='news'>
				<NewsFilter categories={categories?.data.categories} data={data} />
				<div className={'text-center pt-5 sm:pt-10'}>
					<SubscribeNewsTg />
				</div>
			</section>
			<MobileMenu
				categories={categories?.data.categories}
				categoryName={data.data.news.categoryName}
			/>
		</Fragment>
	);
};
