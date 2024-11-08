import { CityCard } from '@/src/entities/city-card';
import { FC } from 'react';

interface Props {}
export const CatalogTelegram: FC<Props> = ({}) => {
	const data = [
		{
			id: 1,
			imageUrl: '/images/catalog-telegram-stub.png',
			title: 'Мадрид',
			links: [
				{
					link: 'https://google.com',
					text: 'Форум/чат'
				},

				{
					link: 'https://google.com',
					text: 'Маркет'
				},
				{
					link: 'https://google.com',
					text: 'Севилья'
				}
			]
		},
		{
			id: 2,
			imageUrl: '/images/catalog-telegram-stub.png',
			title: 'Мадрид',
			links: [
				{
					link: 'https://google.com',
					text: 'Форум/чат'
				},

				{
					link: 'https://google.com',
					text: 'Маркет'
				},
				{
					link: 'https://google.com',
					text: 'Севилья'
				}
			]
		},
		{
			id: 3,
			imageUrl: '/images/catalog-telegram-stub.png',
			title: 'Мадрид',
			links: [
				{
					link: 'https://google.com',
					text: 'Форум/чат'
				},

				{
					link: 'https://google.com',
					text: 'Маркет'
				},
				{
					link: 'https://google.com',
					text: 'Севилья'
				}
			]
		},
		{
			id: 4,
			imageUrl: '/images/catalog-telegram-stub.png',
			title: 'Мадрид',
			links: [
				{
					link: 'https://google.com',
					text: 'Форум/чат'
				},

				{
					link: 'https://google.com',
					text: 'Маркет'
				},
				{
					link: 'https://google.com',
					text: 'Севилья'
				}
			]
		}
	];
	return (
		<div className=''>
			<ul className='grid grid-cols-[repeat(auto-fit,_minmax(155px,1fr))] gap-[10px] items-start'>
				{data.map(({ imageUrl, links, title, id }) => {
					return (
						<CityCard
							tag='li'
							cardInfo={{ id, imageUrl, links, title }}
							key={id}
							className=''
						/>
					);
				})}
			</ul>
		</div>
	);
};
