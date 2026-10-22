'use client';

import { FC, useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import useAuth from '@/src/shared/stores/auth';
import {
  cn,
  getNextPropertyCurrency,
  PropertyDisplayCurrency,
  PROPERTY_CURRENCY_SYMBOLS
} from '@/src/shared/utils';
import { ChannelLink } from '@/src/shared/utils';
import { isTmaPath } from '@/src/shared/utils';
import { openTwitrisWebApp } from '@/src/shared/utils';
import { useCatalogMenuStore } from '../catalog-store';
import { Button } from '@/src/shared/components/ui';
import { LocaleSwitcher } from '@/src/features/locale-switcher';
import { CitiesButton } from '@/src/features/cities-button';
import { ProfileButton } from '@/src/features/profile-button';
import IcNewspaper from '@/src/app/icons/ic_newspaper.svg';
import IcTon from '@/src/app/icons/ic-ton.svg';
import { KeyRound } from 'lucide-react';

// filters
import { $fetchCP } from '@/src/app/client-api/model';
import { MobileFilterProvince } from '@/src/widgets/catalog-filters/ui/mobile-filter-province';
import { MobileFilterTown } from '@/src/widgets/catalog-filters/ui/mobile-filter-town';
import { MobileFilterType } from '@/src/widgets/catalog-filters/ui/mobile-filter-type';
import { MobileFilterPrice } from '@/src/widgets/catalog-filters/ui/mobile-filter-price';
import { MobileFilterRef } from '@/src/widgets/catalog-filters/ui/mobile-filter-ref';
import { PropertyCatalogFiltersProps, Place } from '@/src/widgets/catalog-filters/model';
import { SelectedFiltersDisplay } from '@/src/widgets/catalog-filters';

type Props = {
  className?: string;
  displayCurrency: PropertyDisplayCurrency;
  onCurrencyChange: (currency: PropertyDisplayCurrency) => void;
} & PropertyCatalogFiltersProps;

export const SiteMenuPropertyCatalogMobile: FC<Props> = ({
  className,
  labels,
  selectedProvince,
  setSelectedProvince,
  selectedTown,
  setSelectedTown,
  selectedType,
  setSelectedType,
  priceOrder,
  setPriceOrder,
  refValue,
  setRefValue,
  setError,
  displayCurrency,
  onCurrencyChange,
}) => {
  const { toggle, isOpen } = useCatalogMenuStore();
  const [provinceList, setProvinceList] = useState<Place[]>([]);
  const menuRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const accessToken = useAuth(state => state.accessToken);
  const hasHydrated = useAuth(state => state.hasHydrated);
  const locale = pathname.split('/')[1] || 'en';
  const isAuthorized = hasHydrated && Boolean(accessToken);
  const channelBase = isTmaPath(pathname) ? `/${locale}/tma` : `/${locale}`;
  
  // Extract province and town from URL for immediate rendering
  const parts = pathname.split('/').filter(Boolean);
  const pcIndex = parts.indexOf('property-catalog');
  const urlProvince = pcIndex !== -1 && parts.length > pcIndex + 1 ? decodeURIComponent(parts[pcIndex + 1]) : '';
  const urlTown = pcIndex !== -1 && parts.length > pcIndex + 2 ? decodeURIComponent(parts[pcIndex + 2]) : '';
  const nextDisplayCurrency = getNextPropertyCurrency(displayCurrency);
  
  // open/close menu based on presence of filters in URL
  useEffect(() => {
    const parts = pathname.split('/').filter(Boolean);
    const pcIndex = parts.indexOf('property-catalog');
    const hasPathFilters = pcIndex !== -1 && parts.length > pcIndex + 1; // province/town present
    const hasQueryFilters = Boolean(
      searchParams.get('type') || searchParams.get('order') || searchParams.get('ref')
    );
    toggle(hasPathFilters || hasQueryFilters);
  }, [pathname, searchParams, toggle]);

  useEffect(() => {
    async function loadFilters() {
      try {
        const placesRes = await $fetchCP('places');
        if (!placesRes.ok) throw new Error('Failed to load filter lists');
        setProvinceList(await placesRes.json());
      } catch (err) {
        console.error(err);
        setError?.('Failed to load filter lists');
      }
    }
    loadFilters();
  }, [setError]);

  const townsForSelected = useMemo(() => {
    const provinceToUse = selectedProvince || urlProvince;
    if (!provinceToUse) return [];
    const prov = provinceList.find((p) => p.name === provinceToUse);
    return prov?.cities || [];
  }, [provinceList, selectedProvince, urlProvince]);

  const handleApply = (filters?: {
  province?: string;
  town?: string;
  type?: string;
  order?: 'asc' | 'desc';
  ref?: string;
  }) => {
    const province = filters?.province ?? selectedProvince;
    const town = filters?.town ?? selectedTown;
    const type = filters?.type ?? selectedType;
    const order = filters?.order ?? priceOrder;
    const ref = filters?.ref ?? refValue;

    let targetUrl = `${channelBase}/property-catalog`;
    if (province && town) {
      targetUrl += `/${encodeURIComponent(province)}/${encodeURIComponent(town)}`;
    } else if (province) {
      targetUrl += `/${encodeURIComponent(province)}`;
    }

    const query = new URLSearchParams();
    if (type) query.set('type', type);
    if (order) query.set('order', order);
    if (ref) query.set('ref', ref);

    const finalUrl = query.toString() ? `${targetUrl}?${query.toString()}` : targetUrl;

    router.push(finalUrl);
  };

  const handleReset = () => {
    router.push(`${channelBase}/property-catalog`);
  };

  // close the menu when clicking outside its area
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      const isMenuButton = target.closest('[data-menu-button]');
      const isMenuContent = target.closest('[data-menu-content]');
      const isRadixElement = target.closest(
        '[data-radix-popper-content-wrapper], [data-radix-select-content], [data-radix-select-item], [data-radix-select-trigger]'
      );

      // if the click is not on the menu and not on the Radix elements — close the menu
      if (!isMenuButton && !isMenuContent && !isRadixElement) {
        toggle(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, toggle]);



  return (
    <div
      className={cn(
        'fixed bottom-2.5 right-2.5 z-50 flex flex-col items-end gap-2.5',
        className
      )}
      data-menu-button
    >
      <CitiesButton />

      <Button 
        variant={'menu'} 
        type="button"
        onClick={() => toggle()}
        data-menu-button
      >
        <span className="relative size-10">
          <span
            className={cn(
              'absolute inset-0 m-auto size-10 rounded-full bg-current transition-transform duration-300 ease-out',
              isOpen ? 'scale-0' : 'scale-100'
            )}
          />
          <span
            className={cn(
              'absolute left-1/2 top-1/2 h-1 w-10 -translate-x-1/2 -translate-y-1/2 rounded bg-current transition-transform duration-300 ease-out',
              isOpen ? 'rotate-45 scale-100' : 'rotate-45 scale-0'
            )}
          />
          <span
            className={cn(
              'absolute left-1/2 top-1/2 h-1 w-10 -translate-x-1/2 -translate-y-1/2 rounded bg-current transition-transform duration-300 ease-out',
              isOpen ? '-rotate-45 scale-100' : '-rotate-45 scale-0'
            )}
          />
        </span>
      </Button>

      {isOpen && (
        <div 
          className="absolute bottom-0 right-0 z-50 flex flex-col gap-2.5"
          ref={menuRef}
          data-menu-content
          onClick={(e) => e.stopPropagation()}
        >
          
          <div className="flex flex-col gap-2.5 absolute bottom-[164px] right-0">
            
            <MobileFilterPrice
              priceOrder={priceOrder}
              setPriceOrder={setPriceOrder}
              selectedProvince={selectedProvince}
              selectedTown={selectedTown}
              selectedType={selectedType}
              refValue={refValue}
              onApply={handleApply}
            />

            <MobileFilterRef
              labels={labels}
              refValue={refValue}
              setRefValue={setRefValue}
              selectedProvince={selectedProvince}
              selectedTown={selectedTown}
              selectedType={selectedType}
              priceOrder={priceOrder}
              onApply={handleApply}
            />

            <MobileFilterProvince
              labels={labels}
              provinceList={provinceList}
              selectedProvince={selectedProvince}
              setSelectedProvince={setSelectedProvince}
              setSelectedTown={setSelectedTown}
              selectedType={selectedType}
              priceOrder={priceOrder}
              refValue={refValue}
              onApply={handleApply}
            />
            {(!!selectedProvince || !!urlProvince) && (
              <MobileFilterTown
                labels={labels}
                townsForSelected={townsForSelected}
                selectedProvince={selectedProvince}
                selectedTown={selectedTown}
                setSelectedTown={setSelectedTown}
                selectedType={selectedType}
                priceOrder={priceOrder}
                refValue={refValue}
                onApply={handleApply}
              />
            )}

            <MobileFilterType
              labels={labels}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedProvince={selectedProvince}
              selectedTown={selectedTown}
              priceOrder={priceOrder}
              refValue={refValue}
              onApply={handleApply}
            />

            <ChannelLink locale={locale} href='/news'>
              <Button variant="menu">
                <IcNewspaper/>
              </Button>
            </ChannelLink>
          </div>
          
          <div className="flex flex-row items-end gap-2.5 absolute right-20 bottom-0">
            <div className="flex flex-col gap-2.5">
              <Button
                variant="menu"
                type="button"
                onClick={() => onCurrencyChange(nextDisplayCurrency)}
                aria-label="Change property currency"
                title="Change property currency"
              >
                <span className="flex size-full items-center justify-center text-2xl font-bold text-primary">
                  {nextDisplayCurrency === 'TON' ? (
                    <IcTon className="h-8 w-8" aria-label="TON" role="img" />
                  ) : (
                    PROPERTY_CURRENCY_SYMBOLS[nextDisplayCurrency]
                  )}
                </span>
              </Button>
              <LocaleSwitcher />
            </div>
            <div className="flex flex-col gap-2.5">
              {isAuthorized ? (
                <ProfileButton />
              ) : (
                <Button
                  variant="menu"
                  type="button"
                  onClick={() => openTwitrisWebApp(locale)}
                >
                  <span className="flex size-full items-center justify-center">
                    <KeyRound className="block h-8 w-8 shrink-0" />
                  </span>
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
