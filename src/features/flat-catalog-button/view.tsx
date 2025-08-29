'use client';

import { forwardRef } from 'react';
import { usePathname } from 'next/navigation';
import { Link } from '@/src/shared/utils';
import { Button } from '@/src/shared/components/ui';
import { useMobileFilterStore } from '@/src/widgets/catalog-filters/store';
import { Filter, FilterX } from 'lucide-react';
import HouseSearch from '@/src/app/icons/ic_house_search.svg';

export const FlatCatalogButton = forwardRef<HTMLButtonElement, {}>((props, ref) => {
  const pathname = usePathname();
  const { isOpen, setIsOpen } = useMobileFilterStore();

  const isCatalogPage = pathname?.endsWith('/property-catalog');

  if (isCatalogPage) {

    return (
      <Button
        variant="menu"
        className="md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <FilterX className="w-7 h-7"/> : <Filter className="w-7 h-7"/>}
      </Button>
    );
  }

  return (
    <Button variant="menu" asChild>
      <Link href={{ pathname: "/property-catalog" }}><HouseSearch className="w-9 h-9"/></Link>
    </Button>
  );
});
FlatCatalogButton.displayName = 'FlatCatalogButton';
