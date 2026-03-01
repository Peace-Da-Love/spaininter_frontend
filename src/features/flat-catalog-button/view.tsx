'use client';

import { forwardRef } from 'react';
import { usePathname } from 'next/navigation';
import { ChannelLink } from '@/src/shared/utils';
import { Button } from '@/src/shared/components/ui';
import { useMobileFilterStore } from '@/src/widgets/catalog-filters/store';
import { Filter, FilterX } from 'lucide-react';
import HouseSearch from '@/src/app/icons/ic_house_search.svg';

export const FlatCatalogButton = forwardRef<HTMLButtonElement, {}>((props, ref) => {
  const pathname = usePathname();
  const locale = pathname.split('/').filter(Boolean)[0] || 'en';
  const { isOpen, setIsOpen } = useMobileFilterStore();

  const isPropertyCatalogPage = /\/property-catalog(\b|\/.*)$/.test(pathname)

  if (isPropertyCatalogPage) {

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
      <ChannelLink locale={locale} href='/'><HouseSearch className="w-9 h-9"/></ChannelLink>
    </Button>
  );
});
FlatCatalogButton.displayName = 'FlatCatalogButton';
