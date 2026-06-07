"use client";

import { forwardRef, useEffect, useMemo, useState } from 'react';
import { Input } from '@/src/shared/components/ui/input';
import { useTranslations } from 'next-intl';
import { cn } from '@/src/shared/utils';

type CityDto = {
  name?: string;
};

type Props = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange'
> & {
  value?: string;
  onChange?: (value: string) => void;
  error?: boolean;
};

export const CityCombobox = forwardRef<HTMLInputElement, Props>(
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
      const normalized = inputValue.trim();
      if (normalized.length < 3) {
        setOptions([]);
        setLoadError(false);
        return;
      }

      let active = true;
      const timeout = setTimeout(async () => {
        try {
          setIsLoading(true);
          setLoadError(false);
          const qs = new URLSearchParams({
            page: '1',
            limit: '50',
            search: normalized
          });
          const res = await fetch(`/site-api/cities?${qs.toString()}`);
          if (!res.ok) throw new Error('load_failed');
          const data = await res.json();
          const rows: CityDto[] = data?.data?.rows ?? data?.rows ?? [];
          const names = rows
            .map(item => item?.name?.trim())
            .filter(Boolean) as string[];

          if (active) {
            setOptions(names);
          }
        } catch {
          if (active) setLoadError(true);
        } finally {
          if (active) setIsLoading(false);
        }
      }, 250);

      return () => {
        active = false;
        clearTimeout(timeout);
      };
    }, [inputValue]);

    const filteredOptions = useMemo(() => {
      if (!inputValue) return options;
      const lowerInput = inputValue.toLowerCase();
      return options.filter(opt => opt.toLowerCase().startsWith(lowerInput));
    }, [inputValue, options]);

    const hasExactMatch = filteredOptions.some(
      opt => opt.toLowerCase() === inputValue.toLowerCase()
    );
    const canCreate = inputValue.trim().length >= 2 && !hasExactMatch;

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
          placeholder={t('cityPlaceholder')}
          onChange={event => {
            setInputValue(event.target.value);
          }}
          onKeyDown={event => {
            if (event.key === 'Enter' && inputValue.trim().length >= 2) {
              event.preventDefault();
              onChange?.(inputValue.trim());
              setIsOpen(false);
            }
          }}
          onFocus={() => setIsOpen(true)}
          onBlur={() => {
            setTimeout(() => setIsOpen(false), 120);
            if (inputValue.trim()) {
              onChange?.(inputValue.trim());
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
                onMouseDown={() => handleSelect(inputValue.trim())}
                className="w-full px-3 py-2 text-left text-sm text-slate-600 hover:bg-slate-100"
              >
                {t('cityCreateOption')}
              </button>
            )}
          </div>
        )}

        {isOpen && filteredOptions.length === 0 && !canCreate && inputValue.trim().length >= 3 && (
          <div className="absolute z-20 mt-1 w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm text-slate-500 shadow-md">
            {t('cityNoOptions')}
          </div>
        )}

        {isLoading && (
          <div className="mt-1 text-xs text-slate-500">
            {t('cityLoading')}
          </div>
        )}
        {loadError && (
          <div className="mt-1 text-xs text-red-500">
            {t('cityLoadError')}
          </div>
        )}
        {!error && !isLoading && !loadError && (
          <div className="mt-1 text-xs text-slate-500">
            {t('cityHelper')}
          </div>
        )}
      </div>
    );
  }
);

CityCombobox.displayName = 'CityCombobox';

