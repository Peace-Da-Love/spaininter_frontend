import { FC, Fragment } from 'react';
import { SubscribeNewsTg } from '@/src/shared/components/shared/subscribe-news-tg';
import { IFilterNewsResponse } from '@/src/app/server-actions';
import { TopBar } from '../../widgets/top-bar';
import { NewsCards } from '../../entities/news-cards';

type Props = {
	data: IFilterNewsResponse;
	title: string;
};

export const HomePage: FC<Props> = async ({ data, title }) => {
	return (
		<Fragment>
			<section className={'pb-2.5 md:pb-10'}>
				<h1 className={'sr-only'}>{title}</h1>
				<TopBar news={data.data.news.slice(0, 6)} />
			</section>
			<section className={'scroll-pt-40'} id='news'>
				<NewsCards news={data.data.news.slice(6)} />
				<div className={'text-center pt-5 sm:pt-10'}>
					<SubscribeNewsTg />
				</div>
			</section>
		</Fragment>
	);
};
