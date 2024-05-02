import { NewsItem } from '@/src/shared/types';
import { NewsCards } from '@/src/entities/news-cards';
import { FC } from 'react';
import {
	Pagination,
	PaginationContent,
	PaginationEllipsis,
	PaginationItem,
	PaginationLink,
	PaginationNext,
	PaginationPrevious
} from '@/src/shared/components/ui';

type Props = {
	currentPage: number;
	pageCount: number;
	hasNextPage: boolean;
	hasPreviousPage: boolean;
	news: NewsItem[];
	categoryLink: string;
};

export const PaginationCards: FC<Props> = ({
	news,
	pageCount,
	currentPage,
	hasPreviousPage,
	hasNextPage,
	categoryLink
}) => {
	return (
		<div>
			<NewsCards news={news} />

			<Pagination className={'mt-5'}>
				<PaginationPrevious
					page={hasPreviousPage ? currentPage - 1 : currentPage}
					categoryLink={categoryLink}
				/>
				<PaginationContent>
					{(() => {
						let ellipsisRendered = false;
						return Array.from({ length: pageCount }, (_, i) => i + 1).map(
							page => {
								const delta = Math.abs(page - currentPage);
								if (delta === 0 || delta === 1 || delta === 2) {
									return (
										<PaginationItem key={`Pagination item -${page}`}>
											<PaginationLink
												page={page}
												categoryLink={categoryLink}
												isActive={page === currentPage}
											>
												{page}
											</PaginationLink>
										</PaginationItem>
									);
								} else if (
									(page === 1 || page === pageCount || delta === 3) &&
									!ellipsisRendered
								) {
									ellipsisRendered = true;
									if (currentPage <= pageCount / 2) {
										// If the current page is in the first half, place the ellipsis on the right
										return page > currentPage ? (
											<PaginationEllipsis
												key={`Pagination item ellipsis -${page}`}
											/>
										) : null;
									} else {
										// If the current page is in the second half, place the ellipsis on the left
										return page < currentPage ? (
											<PaginationEllipsis
												key={`Pagination item ellipsis -${page}`}
											/>
										) : null;
									}
								} else {
									return null;
								}
							}
						);
					})()}
				</PaginationContent>
				<PaginationNext
					page={hasNextPage ? currentPage + 1 : currentPage}
					categoryLink={categoryLink}
				/>
			</Pagination>
		</div>
	);
};
