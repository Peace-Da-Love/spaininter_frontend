import { cn, formatDateTime } from '@/src/shared/utils';
import { ImageLoader } from './ui/image-loader';
import { FC } from 'react';
import { NewsProps } from '@/src/shared/types';
import { Link } from '@/src/shared/utils';
import { useLocale } from 'next-intl';

interface NewsCardProps extends NewsProps {
	variant?: 'horizontal' | 'vertical';
}

export const NewsCard: FC<NewsCardProps> = ({
	imageUrl,
	link,
	date,
	category,
	title,
	variant = 'vertical',
	className
}) => {
	const locale = useLocale();
	const isHorizontal = variant === 'horizontal';

	const horizontal = (
		<article
			className={cn(
				'p-2.5 gap-2.5 flex bg-card rounded-3xl w-full max-w-md min-h-24 max-h-24',
				className
			)}
		>
			<div
				className={
					'relative min-h-20 min-w-20 max-w-20 sm:max-w-full sm:max-h-full sm:min-h-min'
				}
			>
				<Link
					className={'block pt-[55%] '}
					href={{
						pathname: '/news/[link]',
						params: { link }
					}}
				>
					<ImageLoader className={'rounded-2xl'} imageUrl={imageUrl} />
				</Link>
			</div>
			<div className={'w-full flex flex-col justify-between'}>
				<span
					className={
						'capitalize block text-secondary font-medium text-[10px] leading-3'
					}
				>
					{category}
				</span>
				<Link
					className={'text-sm font-bold line-clamp-2'}
					href={{
						pathname: '/news/[link]',
						params: { link }
					}}
					title={title}
				>
					{title}
				</Link>
				<span
					className={
						'block text-secondary font-medium text-[10px] leading-3 capitalize'
					}
				>
					{formatDateTime(date, locale)}
				</span>
			</div>
		</article>
	);

	const vertical = (
		<article
			className={cn(
				'p-2.5 sm:p-0 flex gap-2.5 sm:gap-0 flex-row sm:flex-col bg-card rounded-3xl w-full sm:bg-transparent min-h-24 max-h-24 sm:min-h-full sm:max-h-full',
				className
			)}
		>
			<div
				className={
					'relative min-h-20 min-w-20 max-w-20 sm:max-w-full sm:max-h-full sm:min-h-min'
				}
			>
				<Link
					className={'block pt-[55%] sm:relative sm:inset-0 sm:top-0 sm:left-0'}
					href={{
						pathname: '/news/[link]',
						params: { link }
					}}
				>
					<ImageLoader
						imageUrl={imageUrl}
						className={'rounded-2xl sm:rounded-t-3xl sm:rounded-b-none'}
					/>
					<span
						className={
							'hidden sm:inline-block capitalize absolute backdrop-blur-xl bg-gray/30 text-white py-1.5 px-2.5 text-xs font-medium rounded-[20px] bottom-[15px] left-[20px]'
						}
					>
						{category}
					</span>
				</Link>
			</div>
			<div
				className={
					'sm:rounded-b-3xl bg-card sm:pt-2.5 sm:px-5 sm:pb-5 sm:h-full flex sm:block flex-col justify-between'
				}
			>
				<span
					className={
						'capitalize block sm:hidden text-secondary font-medium text-[10px] leading-3'
					}
				>
					{category}
				</span>
				<Link
					className={
						'inline-block text-sm font-bold sm:font-normal sm:text-base text-primary sm:text-[#222222] sm:mb-2.5 line-clamp-2 sm:h-[48px]'
					}
					href={{
						pathname: '/news/[link]',
						params: { link }
					}}
					title={title}
				>
					{title}
				</Link>
				<div
					className={
						'hidden sm:block w-full border border-[#607698] mb-2.5 opacity-30'
					}
				></div>
				<span
					className={
						'text-[10px] leading-3 sm:text-base text-secondary font-medium capitalize'
					}
				>
					{formatDateTime(date, locale)}
				</span>
			</div>
		</article>
	);

	return <>{isHorizontal ? horizontal : vertical}</>;
};
