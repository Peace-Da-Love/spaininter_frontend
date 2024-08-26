import { ImageLoader } from './ui/image-loader';
import { Link, priceFormatter } from '@/src/shared/utils';
import IcBed from '@/src/app/icons/ic_bed.svg';
import { Property } from '@/src/shared/types';
import { FC } from 'react';

type FlatCardProps = Pick<
	Property,
	'description' | 'price' | 'beds' | 'features' | 'images'
>;

const IMAGE_URL = 'https://api.peacedalove.com';

export const FlatCard: FC<FlatCardProps> = props => {
	return (
		<div className={'bg-card rounded-3xl w-full max-w-3xl'}>
			<div
				className={
					'relative min-h-20 min-w-20 max-w-20 sm:max-w-full sm:max-h-full sm:min-h-min'
				}
			>
				<Link className={'block pt-[55%] '} href={'/'}>
					<ImageLoader
						className={'rounded-top-2xl'}
						imageUrl={IMAGE_URL + props.images[0]}
					/>
				</Link>
			</div>
			<div className={'py-2.5 px-5'}>
				<Link
					href={'/'}
					className={
						'inline-block text-sm font-bold sm:font-normal sm:text-base text-primary sm:text-[#222222] sm:mb-2.5 line-clamp-2 sm:h-[48px]'
					}
				>
					{props.description.split('.')[0]}
				</Link>
				<div
					className={
						'hidden sm:block w-full border border-[#607698] my-2.5 opacity-30'
					}
				></div>
				<div className={'flex justify-between items-center'}>
					<span className={'text-xl font-bold text-[#EA5E20] capitalize'}>
						{priceFormatter(props.price)}
					</span>
					<div className={'flex gap-4 items-center text-secondary'}>
						<span className={'inline-flex items-center gap-1 text-base'}>
							<IcBed />
							<i className={'not-italic'}>{props.beds}</i>
						</span>
						<span className={'text-base'}>
							{props.features['Useable Build Space'].split(' ')[0]} м²
						</span>
					</div>
				</div>
			</div>
		</div>
	);
};
