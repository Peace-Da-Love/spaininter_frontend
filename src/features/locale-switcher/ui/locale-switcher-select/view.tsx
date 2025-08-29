'use client';

import { ReactNode, useTransition, forwardRef } from 'react';
import { useRouter, usePathname, cn } from '@/src/shared/utils';
import { useParams } from 'next/navigation';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectTrigger
} from '@/src/shared/components/ui';

type Props = {
	className?: string;
	children: ReactNode;
	defaultValue?: string;
};

export const LocaleSwitcherSelect = forwardRef<HTMLButtonElement, Props>(
	({ className, children, defaultValue, ...props }, ref) => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const pathname = usePathname();
	const params = useParams();

	function onSelectChange(nextLocale: string) {
		startTransition(() => {
			router.replace(
				// @ts-expect-error -- TypeScript will validate that only known `params`
				// are used in combination with a given `pathname`. Since the two will
				// always match for the current route, we can skip runtime checks.
				{ pathname, params },
				{ locale: nextLocale }
			);
		});
	}

	return (
		<div className={cn('w-13', className)}>
			<Select
				disabled={isPending}
				onValueChange={onSelectChange}
				defaultValue={defaultValue}
			>
				<SelectTrigger
					ref={ref}
					className={
						'inline-flex items-center justify-center size-[72px] rounded-3xl backdrop-blur-xl bg-gray-300/40 border-0 text-xl font-bold uppercase'
					}
					{...props}
				>
					{defaultValue}
				</SelectTrigger>
				<SelectContent
					className={cn(
						'bg-transparent shadow-none border-none ',
						'flex justify-center items-center pr-14'
					)}
					position='popper'
				>
					<SelectGroup className='grid grid-cols-3 gap-6 pr-2 pb-2'>
						{children}
					</SelectGroup>
				</SelectContent>
			</Select>
		</div>
	);
});
LocaleSwitcherSelect.displayName = 'LocaleSwitcherSelect';