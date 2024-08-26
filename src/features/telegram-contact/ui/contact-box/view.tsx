import React, { forwardRef } from 'react';
import Image from 'next/image';
import { Button } from '@/src/shared/components/ui';
import Link from 'next/link';

type Props = {};

export const ContactBox = forwardRef<HTMLDivElement, Props>((props, ref) => {
	return (
		<div
			ref={ref}
			className={
				'backdrop-blur-sm bg-white/30 p-5 min-w-60 max-w-60 rounded-2xl text-center flex flex-col justify-center items-center mb-2.5'
			}
		>
			<h5 className={'text-xl font-bold mb-2'}>Contact</h5>
			<p className={'mb-4'}>
				Point your camera at the <br /> QR code
			</p>
			<div className={'mb-2'}>
				<Image
					src={'/images/contact-tg.svg'}
					alt={'QR-code'}
					width={150}
					height={150}
					className={'rounded-2xl'}
				/>
			</div>
			<p className={'mb-4'}>Or follow the link</p>
			<Button
				className={'bg-cornflower-blue h-12 text-white w-full rounded-xl'}
				asChild
			>
				<Link href='https://t.me/SpainDios' target='_blank'>
					Message us
				</Link>
			</Button>
		</div>
	);
});

ContactBox.displayName = 'ContactBox';
