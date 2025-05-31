'use client';
import { FC, useEffect, useRef, useState } from 'react';
import { TTag } from '@/src/shared/types';
import Image from 'next/image';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import * as Dialog from '@radix-ui/react-dialog';
import { twMerge } from 'tailwind-merge';
import ExpandArrow from '@/src/app/icons/ic_expand_arrow.svg';
import Chat from '@/src/app/icons/ic_chat.svg';
import { useScreen } from '@/src/shared/hooks';
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
	cardInfo: { imageUrl, links, title }
}) => {
	const [isLinksOpen, setIsLinksOpen] = useState<boolean>(false);
	const [downAnimation, setDownAnimation] = useState<boolean>(false);
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
	const screenSize = useScreen();
	const cardRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (isLinksOpen) {
			setTimeout(() => {
				setDownAnimation(true);
			}, 1);
		} else {
			setDownAnimation(false);
		}

		// Обработчик клика вне меню
		const handleClickOutside = (e: MouseEvent) => {
			if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
				setIsLinksOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isLinksOpen]);

	const Tag = tag || 'div';

	const handleOpenModal = (e: React.MouseEvent) => {
		e.stopPropagation();
		setIsModalOpen(true);
		setIsLinksOpen(false);
	};

	return (
		<>
			{screenSize > 950 ? (
				<Tag
					className={twMerge(
						`rounded-[25px_25px_25px_25px/35px_35px_35px_35px] overflow-hidden h-[332px] ${className}`
					)}
				>
					<div className='w-full h-[180px] relative'>
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
							className='w-full h-full object-cover'
						/>
					</div>
					<div className='bg-[#E9E9F0]'>
						<div className='pl-[21px] pb-[25px] pr-[15px] pt-[15px]'>
							<div className='flex w-full justify-between items-center mb-[15px]'>
								<p className='font-sans text-xl text-[#192E51] font-bold overflow-hidden whitespace-nowrap text-ellipsis'>
									{title}
								</p>
							</div>
							<nav className='flex flex-wrap gap-y-[10px] gap-x-[7px]'>
								<Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
									<Dialog.Trigger asChild>
										<button className='text-xs font-sans text-center text-white bg-[#607698] p-[7px] rounded-[50px] hover:bg-[#7a96c0] duration-200 active:bg-[#7a96c0] min-w-[100px] flex-[1_1_calc(33.33%-7px)] flex items-center gap-2 justify-center'>
											Чат/форум
										</button>
									</Dialog.Trigger>
									<Dialog.Portal>
										<Dialog.Overlay className='fixed inset-0 bg-black/50' />
										<Dialog.Content className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-[15px] p-6 w-[90vw] max-w-[350px] max-h-[70vh] overflow-y-auto'>
											<Dialog.Title className='font-semibold text-lg text-[#192E51] mb-4'>
												{title}
											</Dialog.Title>
											<nav className='space-y-3'>
												{links.map(({ link, text }) => (
													<div key={link} className='flex flex-col'>
														<a
															href={link}
															className='text-sm text-[#607698] hover:text-[#7a96c0] underline'
															target='_blank'
															rel='noopener noreferrer'
														>
															{text}
														</a>
														<span className='text-xs text-gray-500 break-all'>
															{link}
														</span>
													</div>
												))}
											</nav>
											<Dialog.Close asChild>
												<button
													className='absolute top-2 right-2 text-[#192E51] font-sans text-sm hover:text-gray-700'
													aria-label='Закрыть'
												>
													Закрыть
												</button>
											</Dialog.Close>
										</Dialog.Content>
									</Dialog.Portal>
								</Dialog.Root>
								<button className='text-xs font-sans text-center text-white bg-[#607698] p-[7px] rounded-[50px] hover:bg-[#7a96c0] duration-200 active:bg-[#7a96c0] min-w-[100px] flex-[1_1_calc(33.33%-7px)]'>
									маркет
								</button>
								<button className='text-xs font-sans text-center text-white bg-[#607698] p-[7px] rounded-[50px] hover:bg-[#7a96c0] duration-200 active:bg-[#7a96c0] min-w-[100px] flex-[1_1_calc(33.33%-7px)]'>
									{title}
								</button>
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
						} overflow-hidden h-[171px] ${className}`
					)}
					onClick={() => setIsLinksOpen(!isLinksOpen)}
				>
					<DropdownMenu.Root open={isLinksOpen} onOpenChange={setIsLinksOpen}>
						<DropdownMenu.Trigger className='w-full focus:outline-none'>
							<div className='w-full h-[130px] relative'>
								<Image
									src={imageUrl}
									alt={title}
									width={155}
									height={180}
									className='w-full h-full max-h-[180px] object-cover'
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
									}`}
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
										onInteractOutside={e => {
											// Предотвращаем закрытие при клике внутри контента
											if (
												e.target instanceof HTMLElement &&
												e.target.closest('button')
											) {
												e.preventDefault();
											}
										}}
										onEscapeKeyDown={e => {
											// Разрешаем закрытие по клавише Escape
											setIsLinksOpen(false);
										}}
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
											<Dialog.Root
												open={isModalOpen}
												onOpenChange={setIsModalOpen}
											>
												<Dialog.Trigger asChild>
													<button
														onClick={handleOpenModal}
														className='text-xs block font-sans text-center text-white bg-[#607698] p-[7px] rounded-[50px] hover:bg-[#7a96c0] duration-200 active:bg-[#7a96c0] w-full focus:outline-none flex items-center gap-2 justify-center '
													>
														Чат/форум
													</button>
												</Dialog.Trigger>
												<Dialog.Portal>
													<Dialog.Overlay className='fixed inset-0 bg-black/50' />
													<Dialog.Content className='fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-[15px] p-6 w-[90vw] max-w-[350px] max-h-[70vh] overflow-y-auto'>
														<Dialog.Title className='font-semibold text-lg text-[#192E51] mb-4'>
															{title}
														</Dialog.Title>
														<nav className='space-y-3'>
															{links.map(({ link, text }) => (
																<div key={link} className='flex flex-col'>
																	<Link
																		href={link}
																		className='text-sm text-[#607698] hover:text-[#7a96c0] underline'
																		target='_blank'
																		rel='noopener noreferrer'
																	>
																		{text}
																	</Link>
																	<span className='text-xs text-gray-500 break-all'>
																		{link}
																	</span>
																</div>
															))}
														</nav>
														<Dialog.Close asChild>
															<button
																className='absolute top-2 right-2 text-[#192E51] font-sans text-sm hover:text-gray-700'
																aria-label='Закрыть'
															>
																Закрыть
															</button>
														</Dialog.Close>
													</Dialog.Content>
												</Dialog.Portal>
											</Dialog.Root>
											{/* <button
												onClick={handleOpenModal}
												className='text-xs block font-sans text-center text-white bg-[#607698] p-[7px] rounded-[50px] hover:bg-[#7a96c0] duration-200 active:bg-[#7a96c0] w-full focus:outline-none flex items-center gap-2 justify-center '
											>
												Чат/форум
											</button> */}
											<button className='text-xs block font-sans text-center text-white bg-[#607698] p-[7px] rounded-[50px] hover:bg-[#7a96c0] duration-200 active:bg-[#7a96c0] w-full focus:outline-none'>
												Маркет
											</button>
											<button className='text-xs block font-sans text-center text-white bg-[#607698] p-[7px] rounded-[50px] hover:bg-[#7a96c0] duration-200 active:bg-[#7a96c0] w-full focus:outline-none'>
												{title}
											</button>
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
