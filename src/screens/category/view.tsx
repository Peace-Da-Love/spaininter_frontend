import { FC, Fragment } from 'react';
import { IFilterNewsResponse } from '@/src/app/server-actions';
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
			<section className={'scroll-pt-40'} id='news'>
				<h1 className={'sr-only'}>{title}</h1>
				<PaginationCards
					currentPage={data.data.currentPage}
					pageCount={data.data.pageCount}
					hasNextPage={data.data.hasNextPage}
					hasPreviousPage={data.data.hasPreviousPage}
					news={data.data.news}
					categoryLink={categoryLink}
				/>
			</section>
		</Fragment>
	);
};
