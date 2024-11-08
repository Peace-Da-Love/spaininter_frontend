'use client';
import { FC, useState } from 'react';
import { TTag } from '@/src/shared/types';
import Image from 'next/image';
import * as Collapsible from '@radix-ui/react-collapsible';
import { twMerge } from 'tailwind-merge';
import ExpandArrow from '@/src/app/icons/ic_expand_arrow.svg';
import Link from 'next/link';

interface Props {
	tag?: TTag;
	className?: string;
	cardInfo: {
		id: number;
		imageUrl: string;
		title: string;
		links: {
			text: string;
			link: string;
		}[];
	};
}
const CityCard: FC<Props> = ({
	tag,
	className,
	cardInfo: { id, imageUrl, links, title }
}) => {
	const [isLinksOpen, setIsLinksOpen] = useState<boolean>(false);

	const Tag = tag || 'div';
	return (
		<Tag
			className={twMerge(
				`rounded-[25px_25px_25px_25px/35px_35px_35px_35px] overflow-hidden ${className}`
			)}
		>
			<Image
				src={imageUrl}
				alt={title}
				width={155}
				height={90}
				className='w-full h-auto max-h-[180px] object-cover'
			/>
			<div className='bg-[#E9E9F0]'>
				<Collapsible.Root
					open={isLinksOpen}
					onOpenChange={setIsLinksOpen}
					className=' p-[10px] pb-[15px]'
				>
					<Collapsible.Trigger
						className={`flex w-full justify-between items-center ${isLinksOpen &&
							'mb-[7px]'}`}
					>
						<h2 className='font-sans text-xs'>{title}</h2>
						<div
							className={`duration-200 ${
								isLinksOpen ? '-rotate-180' : 'rotate-0'
							}`}
						>
							<ExpandArrow />
						</div>
					</Collapsible.Trigger>
					<Collapsible.Content className='flex flex-wrap gap-y-[10px]'>
						{links.map(({ link, text }) => {
							return (
								<Link
									href={link}
									className='text-xs font-sans text-center text-white bg-[#607698] p-[7px] rounded-[50px] hover:bg-[#7a96c0] duration-200 active:bg-[#7a96c0] w-full '
								>
									{text}
								</Link>
							);
						})}
					</Collapsible.Content>
				</Collapsible.Root>
			</div>
		</Tag>
	);
};

export { CityCard };
