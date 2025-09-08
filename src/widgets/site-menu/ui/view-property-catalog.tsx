'use client';

import { FC, useState, useEffect, useMemo } from 'react';
import { cn } from '@/src/shared/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuGroup,
} from '@radix-ui/react-dropdown-menu';
import { AlignJustify, X } from 'lucide-react';
import { useSiteMenuStore } from '../store';
import { Button } from '@/src/shared/components/ui';
import { EducationButton } from '@/src/features/education-button';
import { LocaleSwitcher } from '@/src/features/locale-switcher';
import { CitiesButton } from '@/src/features/cities-button';
import { FlatCatalogButton } from '@/src/features/flat-catalog-button';

// фильтры
import { $fetchCP } from '@/src/app/client-api/model';
import { MobileFilterProvinceTown } from '@/src/widgets/catalog-filters/ui/mobile-filter-province-town';
import { MobileFilterType } from '@/src/widgets/catalog-filters/ui/mobile-filter-type';
import { MobileFilterPrice } from '@/src/widgets/catalog-filters/ui/mobile-filter-price';
import { MobileFilterRef } from '@/src/widgets/catalog-filters/ui/mobile-filter-ref';
import { PropertyCatalogFiltersProps } from '@/src/widgets/catalog-filters/model';

type Props = {
  className?: string;
} & PropertyCatalogFiltersProps;

type Place = {
  _id: string | null;
  name: string;
  cities: { _id: string | null; name: string; count: number }[];
  count: number;
};

type TypeItem = { name: string; count: number };

export const SiteMenuPropertyCatalog: FC<Props> = ({
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
  onApply,
  setError,
}) => {
  const { toggle, isOpen } = useSiteMenuStore();

  const [provinceList, setProvinceList] = useState<Place[]>([]);
  const [typesList, setTypesList] = useState<TypeItem[]>([]);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  // Filter Data Load
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
    if (!selectedProvince) return [];
    const prov = provinceList.find((p) => p.name === selectedProvince);
    return prov?.cities || [];
  }, [provinceList, selectedProvince]);
  
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className={cn(className)} asChild>
        <Button variant={'menu'}>
          {isOpen ? <X size={32} /> : <AlignJustify size={32} />}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        side="right"
        className="flex flex-col gap-2.5 px-2.5 md:flex-row"
      >
        {/* Horizontal */}
        <DropdownMenuGroup className="flex flex-row gap-2.5 order-2 md:contents">
          <DropdownMenuItem asChild>
            <LocaleSwitcher />
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <EducationButton />
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Vertical */}
        <DropdownMenuGroup className="flex flex-col gap-2.5 translate-x-[calc(100%+0.625rem)] md:translate-x-0 md:flex-row order-1 md:contents">
          {/* --- фильтры --- */}
          <DropdownMenuItem asChild>
            <MobileFilterProvinceTown
              labels={labels}
              provinceList={provinceList}
              townsForSelected={townsForSelected}
              selectedProvince={selectedProvince}
              setSelectedProvince={setSelectedProvince}
              selectedTown={selectedTown}
              setSelectedTown={setSelectedTown}
              selectedType={selectedType}
              priceOrder={priceOrder}
              refValue={refValue}
              onApply={onApply}
            />
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <MobileFilterType
              labels={labels}
              typesList={typesList}
              selectedType={selectedType}
              setSelectedType={setSelectedType}
              selectedProvince={selectedProvince}
              selectedTown={selectedTown}
              priceOrder={priceOrder}
              refValue={refValue}
              onApply={onApply}
            />
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <MobileFilterPrice
              priceOrder={priceOrder}
              setPriceOrder={setPriceOrder}
              selectedProvince={selectedProvince}
              selectedTown={selectedTown}
              selectedType={selectedType}
              refValue={refValue}
              onApply={onApply}
            />
          </DropdownMenuItem>

          <DropdownMenuItem asChild>
            <MobileFilterRef
              labels={labels}
              refValue={refValue}
              setRefValue={setRefValue}
              setSelectedProvince={setSelectedProvince}
              setSelectedTown={setSelectedTown}
              setSelectedType={setSelectedType}
              setPriceOrder={setPriceOrder}
              onApply={onApply}
              activeFilter={activeFilter}
              setActiveFilter={setActiveFilter}
            />
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <CitiesButton />
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
