import { FlatCard } from '@/src/shared/components/shared/flat-card';

export const CatalogPage = () => {
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
				<FlatCard />
				<FlatCard />
				<FlatCard />
				<FlatCard />
				<FlatCard />
			</div>
		</section>
	);
};
