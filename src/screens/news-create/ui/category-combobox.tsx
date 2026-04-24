'use client';

import { forwardRef, useEffect, useMemo, useState } from 'react';
import { Input } from '@/src/shared/components/ui/input';
import { useTranslations } from 'next-intl';
import { cn } from '@/src/shared/utils';

type HashtagOption = {
	hashtag_id: number;
	hashtag_name: string;
	news_count: number;
};

type Props = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	'value' | 'onChange'
> & {
	value?: string[];
	onChange?: (value: string[]) => void;
	error?: boolean;
};

const CATEGORY_REGEX = /^[a-z0-9_]{2,50}$/;
const normalizeHashtag = (value: string) => value.trim().toLowerCase();

export const CategoryCombobox = forwardRef<HTMLInputElement, Props>(
	({ value = [], onChange, error, ...inputProps }, ref) => {
		const t = useTranslations('Pages.NewsCreate');
		const [inputValue, setInputValue] = useState('');
		const [options, setOptions] = useState<HashtagOption[]>([]);
		const [isOpen, setIsOpen] = useState(false);
		const [isLoading, setIsLoading] = useState(false);
		const [loadError, setLoadError] = useState(false);

		useEffect(() => {
			let active = true;
			const load = async () => {
				try {
					setIsLoading(true);
					setLoadError(false);
					const res = await fetch('/site-api/hashtags');
					if (!res.ok) throw new Error('load_failed');
					const data = await res.json();
					const raw = Array.isArray(data?.data?.hashtags)
						? data.data.hashtags
						: Array.isArray(data?.hashtags)
						? data.hashtags
						: [];
					const normalized = raw
						.map((item: Partial<HashtagOption>) => {
							if (!item?.hashtag_name) return null;

							return {
								hashtag_id: Number(item.hashtag_id ?? 0),
								hashtag_name: item.hashtag_name,
								news_count: Number(item.news_count ?? 0)
							};
						})
						.filter(Boolean) as HashtagOption[];
					if (active) setOptions(normalized);
				} catch {
					if (active) setLoadError(true);
				} finally {
					if (active) setIsLoading(false);
				}
			};

			load();
			return () => {
				active = false;
			};
		}, []);

		const selected = useMemo(() => new Set(value.map(normalizeHashtag)), [
			value
		]);

		const filteredOptions = useMemo(() => {
			const lowerInput = normalizeHashtag(inputValue);
			return options.filter(opt => {
				const name = normalizeHashtag(opt.hashtag_name);
				return (
					!selected.has(name) && (!lowerInput || name.startsWith(lowerInput))
				);
			});
		}, [inputValue, options, selected]);

		const normalizedInput = normalizeHashtag(inputValue);
		const canCreate =
			normalizedInput &&
			CATEGORY_REGEX.test(normalizedInput) &&
			!selected.has(normalizedInput) &&
			!options.some(
				opt => normalizeHashtag(opt.hashtag_name) === normalizedInput
			);

		const showInvalidHint =
			inputValue.length > 0 && !CATEGORY_REGEX.test(normalizedInput);

		const updateValue = (next: string[]) => {
			onChange?.(
				Array.from(new Set(next.map(normalizeHashtag).filter(Boolean)))
			);
		};

		const handleSelect = (option: HashtagOption | string) => {
			const nextLabel =
				typeof option === 'string' ? option : option.hashtag_name;
			updateValue([...value, nextLabel]);
			setInputValue('');
			setIsOpen(false);
		};

		const handleRemove = (name: string) => {
			updateValue(
				value.filter(item => normalizeHashtag(item) !== normalizeHashtag(name))
			);
		};

		return (
			<div className='relative'>
				{value.length > 0 && (
					<div className='mb-2 flex flex-wrap gap-2'>
						{value.map(tag => (
							<button
								key={tag}
								type='button'
								onClick={() => handleRemove(tag)}
								className='rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 hover:bg-slate-200'
							>
								{tag} ×
							</button>
						))}
					</div>
				)}

				<Input
					ref={ref}
					value={inputValue}
					placeholder={
						value.length ? 'Add another hashtag' : t('hashtagPlaceholder')
					}
					onChange={event => {
						setInputValue(event.target.value);
						setIsOpen(true);
					}}
					onKeyDown={event => {
						if (event.key === 'Enter' && canCreate) {
							event.preventDefault();
							handleSelect(normalizedInput);
						}
					}}
					onFocus={() => setIsOpen(true)}
					onBlur={() => {
						setTimeout(() => setIsOpen(false), 120);
						if (canCreate) handleSelect(normalizedInput);
					}}
					className={cn(error && 'border-red-500')}
					{...inputProps}
				/>

				{isOpen && (filteredOptions.length > 0 || canCreate) && (
					<div className='absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-md'>
						{filteredOptions.map(option => (
							<button
								key={option.hashtag_id}
								type='button'
								onMouseDown={() => handleSelect(option)}
								className='flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-slate-100'
							>
								<span>{option.hashtag_name}</span>
								<span className='text-xs text-slate-500'>
									{option.news_count}
								</span>
							</button>
						))}
						{canCreate && (
							<button
								type='button'
								onMouseDown={() => handleSelect(normalizedInput)}
								className='w-full px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100'
							>
								{t('hashtagCreateOption')}
							</button>
						)}
					</div>
				)}

				{isOpen &&
					filteredOptions.length === 0 &&
					!canCreate &&
					!showInvalidHint && (
						<div className='absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-md'>
							{t('hashtagNoOptions')}
						</div>
					)}

				{isLoading && (
					<div className='mt-1 text-xs text-slate-500'>
						{t('hashtagLoading')}
					</div>
				)}
				{loadError && (
					<div className='mt-1 text-xs text-red-500'>
						{t('hashtagLoadError')}
					</div>
				)}
				{showInvalidHint && (
					<div className='mt-1 text-xs text-red-500'>
						{t('hashtagInvalidHint')}
					</div>
				)}
				{!error && !loadError && !isLoading && !showInvalidHint && (
					<div className='mt-1 text-xs text-slate-500'>
						{t('hashtagHelper')}
					</div>
				)}
			</div>
		);
	}
);

CategoryCombobox.displayName = 'CategoryCombobox';
