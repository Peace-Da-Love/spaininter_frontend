'use client';

import { FC, Fragment, useState } from 'react';
import { cn } from '@/src/shared/utils';
import Image from 'next/image';

type Props = {
	imageUrl: string;
	className?: string;
};

export const ImageLoader: FC<Props> = ({ imageUrl, className }) => {
	const [imageLoaded, setImageLoaded] = useState<boolean>(false);

	return (
		<Fragment>
			{!imageLoaded && (
				<div
					className={cn(
						'animate-pulse bg-slate-200 absolute z-10 inset-0 rounded-t-3xl',
						className
					)}
				/>
			)}
			<Image
				src={imageUrl}
				alt={`News image`}
				className={cn(
					`rounded-t-3xl object-cover w-full h-full absolute top-0 left-0`,
					imageLoaded ? 'opacity-100' : 'opacity-0',
					className
				)}
				onLoad={() => setImageLoaded(true)}
				loading={'lazy'}
				width={345}
				height={175}
				quality={100}
			/>
		</Fragment>
	);
};
