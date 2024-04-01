import { CategoryNavigation } from './category-navigation';
import { NewsCards } from './news-cards';
import { NewsPagination } from '@/src/widgets/news-filter/ui/news-pagination';
import { INewsFilterResponse, TCategory } from '@/src/app/server-actions';
import { FC } from 'react';

type Props = {
	data: INewsFilterResponse;
	categories?: TCategory[];
};

export const NewsFilter: FC<Props> = async ({ data, categories }) => {
	return (
		<div>
			<CategoryNavigation
				categories={categories}
				categoryName={data.data.news.categoryName}
			/>
			<NewsCards news={data.data.news.rows} />
			<NewsPagination
				pages={data.data.news.pages}
				page={data.data.news.page}
				categoryName={data.data.news.categoryName}
			/>
		</div>
	);
};
