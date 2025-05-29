'use client';
import { FC, useState } from 'react';
import { TTag } from '@/src/shared/types';
import * as Dialog from '@radix-ui/react-dialog';
import { twMerge } from 'tailwind-merge';
import Chat from '@/src/app/icons/ic_chat.svg';
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
	cardInfo: { imageUrl, title, links }
}) => {
	const [isModalOpen, setIsModalOpen] = useState(false);

	const Tag = tag || 'div';

	return (
		<Tag
			className={twMerge(
				'w-[250px] h-[300px] rounded-[15px] overflow-hidden shadow-lg bg-white border border-gray-200 hover:shadow-xl transition-shadow duration-300'
			)}
		>
			<div className='relative w-full h-[200px]'>
				<img
					src={imageUrl}
					alt={title}
					className='w-full h-full object-cover'
				/>
				<div className='absolute bottom-2 left-2 bg-black bg-opacity-60 text-white text-sm px-2 py-1 rounded'>
					{title}
				</div>
			</div>
			<div className='p-3 flex flex-col items-center gap-2'>
				<Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
					<Dialog.Trigger asChild>
						<button className='flex items-center gap-2 bg-[#607698] text-white text-sm rounded-full px-4 py-2 hover:bg-[#7a96c0] transition-colors duration-200'>
							<Chat />
							<span>Форум/Чат</span>
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
				<span className='text-sm text-[#192E51] font-bold text-center'>
					{title}
				</span>
				<button
					disabled
					className='bg-[#607698] text-white text-sm rounded-full px-4 py-2 opacity-50 cursor-not-allowed'
				>
					Маркет
				</button>
			</div>
		</Tag>
	);
};

export { CityCard };
