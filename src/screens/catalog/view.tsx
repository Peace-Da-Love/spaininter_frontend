import { FlatCard } from '@/src/shared/components/shared/flat-card';
import { Property } from '@/src/shared/types';
import { FC } from 'react';
import { LoadFlats } from '@/src/features/load-flats';

type Props = {
	data: Property[];
};

type CatalogPageProps = {
	data: Property[];
};

export const CatalogPage: FC<CatalogPageProps> = ({ data }) => {
	return (
		<section className={'mt-24'}>
			<h1 className={'text-2xl font-bold mb-4'}>
				Общий каталог домов и апартаментов в Испании для отдыха
			</h1>
			<div
				className={
					'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr gap-2.5 sm:gap-5'
				}
			>
				{data.map((item, index) => {
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
			<LoadFlats />
		</section>
	);
};
