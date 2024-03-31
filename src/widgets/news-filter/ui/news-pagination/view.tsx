import { cn } from '@/src/shared/utils';
import { FC } from 'react';
import { Link } from '@/src/shared/utils';

type Props = {
	pages: number;
	page: number | string;
	categoryName: string;
};

export const NewsPagination: FC<Props> = ({ pages, page, categoryName }) => {
	const arrPages = Array.from({ length: pages }, (_, i) => i + 1);

	return (
		<div className={'pt-5 sm:pt-10'}>
			<ul className={'flex justify-center items-center gap-2.5'}>
				{arrPages.map(item => (
					<li key={`Pagination item - ${item}`}>
						<Link
							title={`Go to page ${item}`}
							href={{
								pathname: '/category/[categoryName]/[page]',
								params: {
									page: item,
									categoryName: categoryName
								}
							}}
							scroll={false}
							className={cn(
								`w-6 h-6 inline-flex items-center justify-center rounded-full text-secondary text-xs font-medium transition-colors hover:bg-primary hover:text-white`,
								Number(page) === item && 'bg-primary text-white'
							)}
						>
							{item}
						</Link>
					</li>
				))}
			</ul>
		</div>
	);
};
