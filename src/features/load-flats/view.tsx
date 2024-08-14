'use client';

import { useState } from 'react';
import { getCatalog } from '@/src/app/server-actions';
import { useLocale } from 'next-intl';
import { Button } from '@/src/shared/components/ui';
import { Property } from '@/src/shared/types';
import { FlatCard } from '@/src/shared/components/shared/flat-card';

export const LoadFlats = () => {
	const locale = useLocale();
	const [page, setPage] = useState<number>(2);
	const [isFetching, setIsFetching] = useState<boolean>(false);
	const [flats, setFlats] = useState<Property[]>([]);

	const loadFlats = async () => {
		try {
			setIsFetching(true);
			const data = await getCatalog({ locale, page });
			if (!data) {
				return;
			}
			setFlats([...flats, ...data]);
			setPage(page + 1);
		} catch (error) {
			console.error(error);
		} finally {
			setIsFetching(false);
		}
	};

	return (
		<div className={'text-center mt-5'}>
			<div
				className={
					'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr gap-2.5 sm:gap-5'
				}
			>
				{flats.map((item, index) => {
					return (
						<FlatCard
							images={item.images}
							key={index}
							description={item.description}
							price={item.price}
							beds={item.beds}
							features={item.features}
						/>
					);
				})}
			</div>
			<Button
				className={'mt-5 py-1.5 px-5'}
				disabled={isFetching}
				variant='primary'
				onClick={loadFlats}
			>
				Загрузить еще
			</Button>
		</div>
	);
};
