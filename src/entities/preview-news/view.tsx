import { FC } from 'react';
import { NewsProps } from '@/src/shared/types';
import { cn, Link } from '@/src/shared/utils';
import { formatDateTime } from '@/src/shared/utils';

export const PreviewNews: FC<NewsProps> = ({
	imageUrl,
	link,
	date,
	category,
	title,
	className
}) => {
	return (
		<div
			className={cn(
				'is-imageBackgrounded w-full h-[320px] md:h-[540px] relative rounded-3xl overflow-hidden',
				className
			)}
		>
			<div
				style={{ backgroundImage: `url(${imageUrl})` }}
				className={
					'section-backgroundImage bg-cover bg-no-repeat bg-center w-full h-full bg-slate-200'
				}
			>
				<div
					className={
						'absolute left-[20px] right-[20px] bottom-[20px] md:left-[50px] md:right-[50px] md:bottom-[80px]'
					}
				>
					<span
						className={
							'capitalize inline-block backdrop-blur-xl bg-white/30 text-white py-1.5 px-2.5 text-[10px] md:text-sm font-medium rounded-[20px] mb-1.5'
						}
					>
						{category}
					</span>
					<h1
						className={
							'text-xl md:text-4xl font-bold text-white mb-1.5 backdrop-blur-xl bg-white/30 rounded-2xl p-2.5'
						}
					>
						{title}
					</h1>
					<span
						className={
							'inline-block text-white text-[10px] md:text-sm font-medium backdrop-blur-xl bg-white/30 rounded-2xl p-1.5'
						}
					>
						{formatDateTime(date)}
					</span>
				</div>
				<Link
					href={{
						pathname: '/news/[link]',
						params: { link }
					}}
					className={'absolute inset-0 left-0 top-0'}
				>
					<span className={'sr-only'}>{title}</span>
				</Link>
			</div>
		</div>
	);
};
