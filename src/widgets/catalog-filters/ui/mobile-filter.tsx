import { FC, useState } from 'react';
import { PropertyCatalogFiltersProps } from '../model';
import { MobileFilterProvinceTown } from './mobile-filter-province-town';
import { MobileFilterType } from './mobile-filter-type';
import { MobileFilterPrice } from './mobile-filter-price';
import { MobileFilterRef } from './mobile-filter-ref';
import { useMobileFilterStore } from '../store';

type Place = { name: string; count: number };
type Town = { name: string; count: number };
type TypeItem = { name: string; count: number };

interface Props extends PropertyCatalogFiltersProps {
  provinceList: Place[];
  typesList: TypeItem[];
  townsForSelected: Town[];
}

export const MobileFilter: FC<Props> = ({ ...props }) => {
  const { isOpen } = useMobileFilterStore(); // used in FlatCatalogButton
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  if (!isOpen) return null; // hidden by default

  return (
    <div className="md:hidden fixed bottom-64 right-1 flex flex-col items-center gap-2 items-end z-40">
      <MobileFilterProvinceTown {...props} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      <MobileFilterType {...props} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
      <MobileFilterPrice {...props} />
      <MobileFilterRef {...props} activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
    </div>
  );
};
