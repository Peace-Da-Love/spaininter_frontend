"use client";

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
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
};

const CATEGORY_REGEX = /^[a-z0-9_]{2,50}$/;

export const CategoryCombobox = forwardRef<HTMLInputElement, Props>(
  ({ value, onChange, error, ...inputProps }, ref) => {
  const t = useTranslations('Pages.NewsCreate');
  const [inputValue, setInputValue] = useState(value ?? '');
  const [options, setOptions] = useState<HashtagOption[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    if (!value) {
      setInputValue('');
      return;
    }

    const matchedOption = /^\d+$/.test(value)
      ? options.find(option => String(option.hashtag_id) === value)
      : options.find(option => option.hashtag_name === value);

    setInputValue(matchedOption?.hashtag_name ?? value);
  }, [options, value]);

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
              news_count: Number(item.news_count ?? 0),
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

  const filteredOptions = useMemo(() => {
    if (!inputValue) return options;
    const lowerInput = inputValue.toLowerCase();
    return options.filter(opt => opt.hashtag_name.toLowerCase().startsWith(lowerInput));
  }, [inputValue, options]);

  const canCreate =
    inputValue &&
    CATEGORY_REGEX.test(inputValue) &&
    !options.some(opt => opt.hashtag_name.toLowerCase() === inputValue.toLowerCase()) &&
    filteredOptions.length === 0;

  const showInvalidHint = inputValue.length > 0 && !CATEGORY_REGEX.test(inputValue);

  const handleSelect = (option: HashtagOption | string) => {
    const nextValue =
      typeof option === 'string' ? option : String(option.hashtag_id);
    const nextLabel =
      typeof option === 'string' ? option : option.hashtag_name;

    setInputValue(nextLabel);
    onChange?.(nextValue);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <Input
        ref={ref}
        value={inputValue}
        placeholder={t('hashtagPlaceholder')}
        onChange={event => {
          const next = event.target.value;
          setInputValue(next);
        }}
        onKeyDown={event => {
          if (event.key === 'Enter' && inputValue && CATEGORY_REGEX.test(inputValue)) {
            onChange?.(inputValue);
            setIsOpen(false);
          }
        }}
        onFocus={() => setIsOpen(true)}
        onBlur={() => {
          setTimeout(() => setIsOpen(false), 120);
          if (inputValue && CATEGORY_REGEX.test(inputValue)) {
            onChange?.(inputValue);
          }
        }}
        className={cn(error && 'border-red-500')}
        {...inputProps}
      />

      {isOpen && (filteredOptions.length > 0 || canCreate) && (
        <div className="absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white shadow-md">
          {filteredOptions.map(option => (
            <button
              key={option.hashtag_id}
              type="button"
              onMouseDown={() => handleSelect(option)}
              className="flex w-full items-center justify-between gap-3 px-3 py-2 text-left text-sm hover:bg-slate-100"
            >
              <span>{option.hashtag_name}</span>
              <span className="text-xs text-slate-500">{option.news_count}</span>
            </button>
          ))}
          {canCreate && (
            <button
              type="button"
              onMouseDown={() => handleSelect(inputValue)}
              className="w-full px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100"
            >
              {t('hashtagCreateOption')}
            </button>
          )}
        </div>
      )}

      {isOpen && filteredOptions.length === 0 && !canCreate && !showInvalidHint && (
        <div className="absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-md">
          {t('hashtagNoOptions')}
        </div>
      )}

      {isLoading && (
        <div className="mt-1 text-xs text-slate-500">
          {t('hashtagLoading')}
        </div>
      )}
      {loadError && (
        <div className="mt-1 text-xs text-red-500">
          {t('hashtagLoadError')}
        </div>
      )}
      {showInvalidHint && (
        <div className="mt-1 text-xs text-red-500">
          {t('hashtagInvalidHint')}
        </div>
      )}
      {!error && !loadError && !isLoading && !showInvalidHint && (
        <div className="mt-1 text-xs text-slate-500">
          {t('hashtagHelper')}
        </div>
      )}
    </div>
  );
  }
);

CategoryCombobox.displayName = 'CategoryCombobox';
