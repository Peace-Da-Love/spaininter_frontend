
'use client';

import { FC, useEffect, useMemo, useState } from 'react';
import { PropertyCatalogFiltersProps } from './model';
import { DesktopFilter } from './ui/desktop-filter';
import { MobileFilter } from './ui/mobile-filter';

type Place = {
  _id: string | null;
  name: string;
  cities: { _id: string | null; name: string; count: number }[];
  count: number;
};

type TypeItem = { name: string; count: number };

export const PropertyCatalogFilters: FC<PropertyCatalogFiltersProps> = (props) => {
  const { setError, selectedProvince } = props;
  
  const [provinceList, setProvinceList] = useState<Place[]>([]);
  const [typesList, setTypesList] = useState<TypeItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadFilters() {
      setLoading(true);
      try {
        const [placesRes, typesRes] = await Promise.all([
          fetch('https://prop.spaininter.com/api/places'),
          fetch('https://prop.spaininter.com/api/properties/types'),
        ]);
        if (!placesRes.ok || !typesRes.ok) throw new Error('Failed to load filter lists');
        setProvinceList(await placesRes.json());
        setTypesList(await typesRes.json());
      } catch (err) {
        console.error(err);
        setError('Failed to load filter lists');
      } finally {
        setLoading(false);
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
    <>
      <DesktopFilter
        {...props}
        provinceList={provinceList}
        typesList={typesList}
        loading={loading}
      />
      <MobileFilter
        {...props}
        provinceList={provinceList}
        typesList={typesList}
        townsForSelected={townsForSelected}
      />
    </>
  );
};
