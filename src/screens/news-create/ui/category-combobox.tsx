"use client";

import { forwardRef, useEffect, useMemo, useState } from 'react';
import { Input } from '@/src/shared/components/ui/input';
import { useTranslations } from 'next-intl';
import { cn } from '@/src/shared/utils';

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
  const [options, setOptions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setInputValue(value ?? '');
  }, [value]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        setIsLoading(true);
        setLoadError(false);
        const res = await fetch('/site-api/categories');
        if (!res.ok) throw new Error('load_failed');
        const data = await res.json();
        const raw = Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.data?.categories)
            ? data.data.categories
            : Array.isArray(data?.categories)
              ? data.categories
              : [];
        const names = raw
          .map((item: { category_name?: string }) => item?.category_name)
          .filter(Boolean) as string[];
        if (active) setOptions(names);
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
    return options.filter(opt => opt.toLowerCase().startsWith(lowerInput));
  }, [inputValue, options]);

  const canCreate =
    inputValue &&
    CATEGORY_REGEX.test(inputValue) &&
    !options.some(opt => opt.toLowerCase() === inputValue.toLowerCase()) &&
    filteredOptions.length === 0;

  const showInvalidHint = inputValue.length > 0 && !CATEGORY_REGEX.test(inputValue);

  const handleSelect = (nextValue: string) => {
    setInputValue(nextValue);
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
              key={option}
              type="button"
              onMouseDown={() => handleSelect(option)}
              className="w-full px-3 py-2 text-left text-sm hover:bg-slate-100"
            >
              {option}
            </button>
          ))}
          {canCreate && (
            <button
              type="button"
              onMouseDown={() => handleSelect(inputValue)}
              className="w-full px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100"
            >
              {t('categoryCreateOption')}
            </button>
          )}
        </div>
      )}

      {isOpen && filteredOptions.length === 0 && !canCreate && !showInvalidHint && (
        <div className="absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-md">
          {t('categoryNoOptions')}
        </div>
      )}

      {isLoading && (
        <div className="mt-1 text-xs text-slate-500">
          {t('categoryLoading')}
        </div>
      )}
      {loadError && (
        <div className="mt-1 text-xs text-red-500">
          {t('categoryLoadError')}
        </div>
      )}
      {showInvalidHint && (
        <div className="mt-1 text-xs text-red-500">
          {t('categoryInvalidHint')}
        </div>
      )}
      {!error && !loadError && !isLoading && !showInvalidHint && (
        <div className="mt-1 text-xs text-slate-500">
          {t('categoryHelper')}
        </div>
      )}
    </div>
  );
  }
);

CategoryCombobox.displayName = 'CategoryCombobox';
