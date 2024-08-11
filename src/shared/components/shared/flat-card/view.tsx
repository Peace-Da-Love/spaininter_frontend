import { ImageLoader } from './ui/image-loader';
import { Link, priceFormatter } from '@/src/shared/utils';
import IcBed from '@/src/app/icons/ic_bed.svg';

export const FlatCard = () => {
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
						imageUrl={
							'https://www.spanishhomes.com/assets/content/properties/3125/photos/60b17cf9d792d_thumb.jpeg'
						}
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
					Villa/house Guardamar del Segura, Alicante
				</Link>
				<div
					className={
						'hidden sm:block w-full border border-[#607698] my-2.5 opacity-30'
					}
				></div>
				<div className={'flex justify-between items-center'}>
					<span className={'text-xl font-bold text-[#EA5E20] capitalize'}>
						{priceFormatter(100_000)}
					</span>
					<div className={'flex gap-4 items-center text-secondary'}>
						<span className={'inline-flex items-center gap-1 text-base'}>
							<IcBed />
							<i className={'not-italic'}>2</i>
						</span>
						<span className={'text-base'}>218 м²</span>
					</div>
				</div>
			</div>
		</div>
	);
};
