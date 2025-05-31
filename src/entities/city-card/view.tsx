'use client';
import { FC, useEffect, useState } from 'react';
import { TTag } from '@/src/shared/types';
import Image from 'next/image';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { twMerge } from 'tailwind-merge';
import ExpandArrow from '@/src/app/icons/ic_expand_arrow.svg';
import Chat from '@/src/app/icons/ic_chat.svg';
import Link from 'next/link';
import { useScreen } from '@/src/shared/hooks';

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
	cardInfo: { imageUrl, links, title }
}) => {
	const [isLinksOpen, setIsLinksOpen] = useState<boolean>(false);
	const [downAnimation, setDownAnimation] = useState<boolean>(false);
	const screenSize = useScreen();

	useEffect(() => {
		if (isLinksOpen)
			setTimeout(() => {
				setDownAnimation(true);
			}, 1);
		else setDownAnimation(false);
	}, [isLinksOpen]);

	const Tag = tag || 'div';
	return (
		<>
			{screenSize > 950 ? (
				<Tag
					className={twMerge(
						`rounded-[25px_25px_25px_25px/35px_35px_35px_35px] overflow-hidden ${className}`
					)}
				>
					<div className='w-full relative '>
						<div className='flex items-center gap-x-[10px] absolute bottom-[16px] left-[20px]'>
							<Chat />
							<h3 className='text-white font-sans font-medium text-sm'>
								Форум/Чат
							</h3>
						</div>

						<Image
							src={imageUrl}
							alt={title}
							width={155}
							height={90}
							className='w-full h-auto max-h-[180px] object-cover'
						/>
					</div>
					<div className='bg-[#E9E9F0]'>
						<div className='pl-[21px] pb-[25px] pr-[15px] pt-[15px]'>
							<div
								className={`flex w-full justify-between items-center mb-[15px] $`}
							>
								<h2 className='font-sans text-xl text-[#192E51] font-bold'>
									{title}
								</h2>
							</div>
							<nav className='flex flex-wrap gap-y-[10px] gap-x-[7px]'>
								{links.map(({ link, text }) => {
									return (
										<Link
											key={link}
											href={link}
											className='text-xs font-sans text-center text-white bg-[#607698] p-[7px] rounded-[50px] hover:bg-[#7a96c0] duration-200 active:bg-[#7a96c0] min-w-[100px] flex-[1_1_calc(33.33%-7px)]'
										>
											{text}
										</Link>
									);
								})}
							</nav>
						</div>
					</div>
				</Tag>
			) : (
				<Tag
					className={twMerge(
						` ${
							isLinksOpen
								? 'rounded-[25px_25px_0_0/35px_35px_0_0] relative z-[2]'
								: 'rounded-[25px_25px_25px_25px/35px_35px_35px_35px]'
						} overflow-hidden ${className}`
					)}
				>
					<DropdownMenu.Root open={isLinksOpen} onOpenChange={setIsLinksOpen}>
						<DropdownMenu.Trigger className='w-full focus:outline-none'>
							<div className='w-full relative'>
								<Image
									src={imageUrl}
									alt={title}
									width={155}
									height={90}
									className='w-full h-auto max-h-[180px] object-cover'
								/>
							</div>
							<div
								className={`duration-100 ${
									isLinksOpen ? 'bg-[#d8d8df]' : 'bg-[#E9E9F0]'
								}`}
							>
								<div
									className={`p-[10px] ${
										isLinksOpen ? 'pb-[10px]' : 'pb-[15px]'
									} `}
								>
									<div className='flex w-full justify-between items-center'>
										<h2 className='font-sans text-xs'>{title}</h2>
										<div
											className={`duration-200 ${
												isLinksOpen ? '-rotate-180' : 'rotate-0'
											}`}
										>
											<ExpandArrow />
										</div>
									</div>
									<DropdownMenu.Content
										className={`w-[var(--radix-popper-anchor-width)] `}
									>
										<div
											className={`p-[10px] pb-[15px] pt-0 flex flex-wrap gap-y-[10px] w-full duration-200 ease-out bg-[#d8d8df] 
											 rounded-[0px_0px_25px_25px/0px_0px_35px_35px] mx-auto box-border`}
											style={{
												clipPath: downAnimation
													? 'polygon(0 0, 100% 0, 100% 100%, 0% 100%)'
													: 'polygon(0 0, 100% 0, 100% 0, 0 0)'
											}}
										>
											{links.map(({ link, text }) => {
												return (
													<Link
														key={link}
														href={link}
														className='text-xs block font-sans text-center text-white bg-[#607698] p-[7px] rounded-[50px] hover:bg-[#7a96c0] duration-200 active:bg-[#7a96c0] w-full focus:outline-none '
													>
														{text}
													</Link>
												);
											})}
										</div>
									</DropdownMenu.Content>
								</div>
							</div>
						</DropdownMenu.Trigger>
					</DropdownMenu.Root>
				</Tag>
			)}
		</>
	);
};

export { CityCard };
