import { FC, Fragment } from 'react';
import { TopBar } from '@/src/widgets/top-bar';
import { IFilterNewsResponse } from '@/src/app/server-actions';
import { NewsCards } from '@/src/entities/news-cards';
import { SubscribeNewsTg } from '@/src/shared/components/shared/subscribe-news-tg';
import { PaginationCards } from '@/src/widgets/pagination-cards';

type Props = {
	data: IFilterNewsResponse;
	title: string;
	categoryLink: string;
};

export const CategoryPage: FC<Props> = ({ title, data, categoryLink }) => {
	return (
		<Fragment>
			<section className={'pb-2.5 md:pb-10'}>
				<h1 className={'sr-only'}>{title}</h1>
				<TopBar news={data.data.news.slice(0, 6)} />
			</section>
			<section className={'scroll-pt-40'} id='news'>
				<PaginationCards
					currentPage={data.data.currentPage}
					pageCount={data.data.pageCount}
					hasNextPage={data.data.hasNextPage}
					hasPreviousPage={data.data.hasPreviousPage}
					news={data.data.news.slice(6)}
					categoryLink={categoryLink}
				/>
				<div className={'text-center pt-5 sm:pt-10'}>
					<SubscribeNewsTg />
				</div>
			</section>
		</Fragment>
	);
};
