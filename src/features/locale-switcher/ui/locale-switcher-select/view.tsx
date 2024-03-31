'use client';

import { ChangeEvent, ReactNode, useTransition, FC } from 'react';
import { useRouter, usePathname, cn } from '@/src/shared/utils';
import { useParams } from 'next/navigation';

type Props = {
	children: ReactNode;
	defaultValue: string;
	className?: string;
};

export const LocaleSwitcherSelect: FC<Props> = ({
	children,
	defaultValue,
	className
}) => {
	const router = useRouter();
	const [isPending, startTransition] = useTransition();
	const pathname = usePathname();
	const params = useParams();

	function onSelectChange(event: ChangeEvent<HTMLSelectElement>) {
		const nextLocale = event.target.value;
		console.log('nextLocale', nextLocale);
		console.log('pathname', pathname);
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
		<form className={cn('inline-block', className)}>
			<label htmlFor='locale-switcher-select' className={'sr-only'}>
				Select Lang
			</label>
			<select
				id='locale-switcher-select'
				className='bg-transparent text-primary text-sm font-medium uppercase text-sm block  p-0'
				defaultValue={defaultValue}
				disabled={isPending}
				onChange={onSelectChange}
			>
				{children}
			</select>
		</form>
	);
};
