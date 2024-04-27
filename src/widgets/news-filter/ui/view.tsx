import { NewsCards } from './news-cards';
import { NewsPagination } from '@/src/widgets/news-filter/ui/news-pagination';
import { INewsFilterResponse } from '@/src/app/server-actions';
import { FC } from 'react';

type Props = {
	data: INewsFilterResponse;
};

export const NewsFilter: FC<Props> = async ({ data }) => {
	return (
		<div>
			<NewsCards news={data.data.news.rows} />
			<NewsPagination
				pages={data.data.news.pages}
				page={data.data.news.page}
				categoryName={data.data.news.categoryName}
			/>
		</div>
	);
};
