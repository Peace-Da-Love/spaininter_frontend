import { cn, formatDateTime, formatCategory } from '@/src/shared/utils';
import { ImageLoader } from './ui/image-loader';
import { FC } from 'react';
import { NewsProps } from '@/src/shared/types';
import { ChannelLink } from '@/src/shared/utils';
import { useLocale } from 'next-intl';

interface NewsCardProps extends NewsProps {
	variant?: 'horizontal' | 'vertical';
}

export const NewsCard: FC<NewsCardProps> = ({
	imageUrl,
	link,
	date,
	hashtagName,
	title,
	variant = 'vertical',
	className,
	hashtagLink,
	city
}) => {
	const locale = useLocale();
	const isHorizontal = variant === 'horizontal';

	const horizontal = (
		<div
			className={cn(
				'p-2.5 gap-2.5 flex bg-card rounded-3xl w-full max-w-3xl min-h-24 max-h-24',
				className
			)}
		>
			<div
				className={
					'relative min-h-20 min-w-20 max-w-20 sm:max-w-full sm:max-h-full sm:min-h-min'
				}
			>
				<ChannelLink
					locale={locale}
					className={'block pt-[55%] '}
					href={`/news/${encodeURIComponent(link)}`}
				>
					<ImageLoader className={'rounded-2xl'} imageUrl={imageUrl} />
				</ChannelLink>
			</div>
			<div className={'w-full flex flex-col justify-between'}>
				<div className={'flex items-center gap-2'}>
					<ChannelLink
						locale={locale}
						href={`/hashtag/${encodeURIComponent(hashtagLink)}/1`}
						className={
							'block text-secondary font-medium text-[10px] leading-3'
						}
					>
						{formatCategory(hashtagName)}
					</ChannelLink>
					<span
						className={
							'capitalize block text-secondary font-medium text-[10px] leading-3'
						}
					>
						{city}
					</span>
				</div>
				<ChannelLink
					locale={locale}
					className={'text-sm font-bold line-clamp-2'}
					href={`/news/${encodeURIComponent(link)}`}
					title={title}
				>
					{title}
				</ChannelLink>
				<span
					className={'block text-secondary font-medium text-[10px] leading-3'}
				>
					{formatDateTime(date, locale)}
				</span>
			</div>
		</div>
	);

	const vertical = (
		<div
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
				<ChannelLink
					locale={locale}
					className={'block pt-[55%] sm:relative sm:inset-0 sm:top-0 sm:left-0'}
					href={`/news/${encodeURIComponent(link)}`}
				>
					<ImageLoader
						imageUrl={imageUrl}
						className={'rounded-2xl sm:rounded-t-3xl sm:rounded-b-none'}
					/>
				</ChannelLink>
				<div
					className={
						'flex items-center gap-3 absolute bottom-[15px] left-[20px]'
					}
				>
					<ChannelLink
						locale={locale}
						href={`/hashtag/${encodeURIComponent(hashtagLink)}/1`}
						className={
							'hidden sm:inline-block backdrop-blur-xl bg-gray-300/40 text-white py-1.5 px-2.5 text-xs font-medium rounded-[20px] '
						}
					>
						{formatCategory(hashtagName)}
					</ChannelLink>
					<span
						className={
							'hidden sm:inline-block capitalize backdrop-blur-xl bg-gray-300/40 text-white py-1.5 px-2.5 text-xs font-medium rounded-[20px] '
						}
					>
						{city}
					</span>
				</div>
			</div>
			<div
				className={
					'sm:rounded-b-3xl bg-card sm:pt-2.5 sm:px-5 sm:pb-5 sm:h-full flex sm:block flex-col justify-between'
				}
			>
				<div className={'flex items-center gap-2'}>
					<ChannelLink
						locale={locale}
						href={`/hashtag/${encodeURIComponent(hashtagLink)}/1`}
						className={
							'block sm:hidden text-secondary font-medium text-[10px] leading-3'
						}
					>
						{formatCategory(hashtagName)}
					</ChannelLink>
					<span
						className={
							'capitalize block sm:hidden text-secondary font-medium text-[10px] leading-3'
						}
					>
						{city}
					</span>
				</div>
				<ChannelLink
					locale={locale}
					className={
						'inline-block text-sm font-bold sm:font-normal sm:text-base text-primary sm:text-[#222222] sm:mb-2.5 line-clamp-2 sm:h-[48px]'
					}
					href={`/news/${encodeURIComponent(link)}`}
					title={title}
				>
					{title}
				</ChannelLink>
				<div
					className={
						'hidden sm:block w-full border border-[#607698] mb-2.5 opacity-30'
					}
				></div>
				<span
					className={
						'text-[10px] leading-3 sm:text-base text-secondary font-medium'
					}
				>
					{formatDateTime(date, locale)}
				</span>
			</div>
		</div>
	);

	return <>{isHorizontal ? horizontal : vertical}</>;
};
