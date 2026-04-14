'use client';

import { FC, useState, useEffect, useMemo, useRef } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import useAuth from '@/src/shared/stores/auth';
import { cn } from '@/src/shared/utils';
import { ChannelLink } from '@/src/shared/utils';
import { isTmaPath } from '@/src/shared/utils';
import { openTwitrisWebApp } from '@/src/shared/utils';
import { useCatalogMenuStore } from '../catalog-store';
import { Button } from '@/src/shared/components/ui';
import { EducationButton } from '@/src/features/education-button';
import { LocaleSwitcher } from '@/src/features/locale-switcher';
import { CitiesButton } from '@/src/features/cities-button';
import { ProfileButton } from '@/src/features/profile-button';
import IcNewspaper from '@/src/app/icons/ic_newspaper.svg';
import IcTwitris from '@/src/app/icons/ic_twitris.svg';

// filters
import { $fetchCP } from '@/src/app/client-api/model';
import { MobileFilterProvince } from '@/src/widgets/catalog-filters/ui/mobile-filter-province';
import { MobileFilterTown } from '@/src/widgets/catalog-filters/ui/mobile-filter-town';
import { MobileFilterType } from '@/src/widgets/catalog-filters/ui/mobile-filter-type';
import { MobileFilterPrice } from '@/src/widgets/catalog-filters/ui/mobile-filter-price';
import { MobileFilterRef } from '@/src/widgets/catalog-filters/ui/mobile-filter-ref';
import { PropertyCatalogFiltersProps, Place, TypeItem } from '@/src/widgets/catalog-filters/model';
import { SelectedFiltersDisplay } from '@/src/widgets/catalog-filters';

type Props = {
  className?: string;
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
}) => {
  const { toggle, isOpen } = useCatalogMenuStore();
  const [provinceList, setProvinceList] = useState<Place[]>([]);
  const [typesList, setTypesList] = useState<TypeItem[]>([]);
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
        const [placesRes, typesRes] = await Promise.all([
          $fetchCP('places'),
          $fetchCP('properties/types'),
        ]);
        if (!placesRes.ok || !typesRes.ok) throw new Error('Failed to load filter lists');
        setProvinceList(await placesRes.json());
        setTypesList(await typesRes.json());
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
    <>
      <Button 
        variant={'menu'} 
        className={cn(className)}
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
          className="fixed bottom-2.5 right-2.5 z-50 flex flex-col gap-2.5 md:fixed md:bottom-2.5 md:right-2.5 md:z-50"
          ref={menuRef}
          data-menu-content
          onClick={(e) => e.stopPropagation()}
        >
          
          <div className="flex flex-col gap-2.5 absolute bottom-20 right-0 md:absolute md:bottom-20 md:right-0">
            
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
              typesList={typesList}
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
            
            <CitiesButton />
          </div>
          
          <div className="flex flex-row items-end gap-2.5 absolute right-20 bottom-0 md:absolute md:right-20 md:bottom-0">
            <div className="flex flex-col gap-2.5">
              {isAuthorized && <ProfileButton />}
              <LocaleSwitcher />
            </div>
            <div className="flex flex-col gap-2.5">
              <Button
                variant="menu"
                onClick={() => openTwitrisWebApp(locale)}
              >
                <span className="flex size-full items-center justify-center">
                  <IcTwitris className="block h-8 w-8 shrink-0" />
                </span>
              </Button>
              <EducationButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
};
