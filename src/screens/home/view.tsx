import { FC, Fragment } from 'react';
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
			</section>
		</Fragment>
	);
};
