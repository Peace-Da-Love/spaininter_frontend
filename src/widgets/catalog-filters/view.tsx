'use client';

import { FC, useEffect, useMemo, useState } from 'react';
import { PropertyCatalogFiltersProps } from './model';
import { DesktopFilter } from './ui/desktop-filter';
import { $fetchCP } from '@/src/app/client-api/model';

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
          $fetchCP('places'),
          $fetchCP('properties/types'),
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

  return (
    <>
      <DesktopFilter
        {...props}
        provinceList={provinceList}
        typesList={typesList}
        loading={loading}
      />
    </>
  );
};
