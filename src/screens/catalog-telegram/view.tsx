'use client';
import { citiesModel, City } from '@/src/app/client-actions/get-cities';
import { CityCard } from '@/src/entities/city-card';
import { FC, useEffect, useState } from 'react';

interface Props {
	forumChatText: string;
}

export const CatalogTelegram: FC<Props> = ({ forumChatText }) => {
	const [cities, setCities] = useState<City[]>([]);
	const [loading, setLoading] = useState<boolean>(true);
	const [error, setError] = useState<string | null>(null);

	const IMAGE_URL = process.env.NEXT_PUBLIC_API_URL as string;

	useEffect(() => {
		const fetchCities = async () => {
			try {
				setLoading(true);
				const data = await citiesModel.getCities();
				const filteredCities = data.data.rows.filter(city => city.photo_url);
				setCities(filteredCities);
			} catch (err) {
				setError('Error loading cities');
			} finally {
				setLoading(false);
			}
		};
		fetchCities();
	}, []);

	if (loading) return <div>Loading...</div>;
	if (error) return <div>{error}</div>;

	return (
		<div className=''>
			<ul className='grid grid-cols-[repeat(auto-fit,_minmax(155px,1fr))] gap-[10px] items-start'>
				{cities.map((city: City) => (
					<CityCard
						tag='li'
						cardInfo={{
							id: city.id,
							imageUrl: `${IMAGE_URL}${city.photo_url}`,
							title: city.name,
							links: city.links.map(link => ({
								text: link.name,
								link: link.url
							}))
						}}
						key={city.id}
						className=''
						forumChatText={forumChatText}
					/>
				))}
			</ul>
		</div>
	);
};
