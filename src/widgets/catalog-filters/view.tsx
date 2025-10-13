'use client';

import { FC, useEffect, useState } from 'react';
import { useRouter, useParams, useSearchParams } from 'next/navigation';
import { PropertyCatalogFiltersProps, Place, TypeItem } from './model';
import { DesktopFilter } from './ui/desktop-filter';
import { $fetchCP } from '@/src/app/client-api/model';

export const PropertyCatalogFilters: FC<PropertyCatalogFiltersProps> = (props) => {
  const {
    setError,
    setSelectedProvince,
    setSelectedTown,
    setSelectedType,
    setPriceOrder,
    setRefValue,
    onReset,
  } = props;

  const router = useRouter();
  const params = useParams(); // { locale, province?, town? }
  const searchParams = useSearchParams();

  const [provinceList, setProvinceList] = useState<Place[]>([]);
  const [typesList, setTypesList] = useState<TypeItem[]>([]);
  const [loading, setLoading] = useState(false);

  // load filter lists and set initial filter values from URL
  useEffect(() => {
    async function loadFilters() {
      setLoading(true);
      try {
        const [placesRes, typesRes] = await Promise.all([
          $fetchCP('places'),
          $fetchCP('properties/types'),
        ]);
        if (!placesRes.ok || !typesRes.ok) throw new Error('Failed to load filter lists');

        const places = await placesRes.json();
        setProvinceList(places);
        setTypesList(await typesRes.json());

        if (params.province) {
          setSelectedProvince(decodeURIComponent(params.province as string));
        }
        if (params.town) {
          setSelectedTown(decodeURIComponent(params.town as string));
        }
        if (searchParams.get('type')) {
          setSelectedType(searchParams.get('type') as string);
        }
        if (searchParams.get('order')) {
          setPriceOrder(searchParams.get('order') as 'asc' | 'desc');
        }
        if (searchParams.get('ref')) {
          setRefValue(searchParams.get('ref') as string);
        }
      } catch (err) {
        console.error(err);
        setError('Failed to load filter lists');
      } finally {
        setLoading(false);
      }
    }
    loadFilters();
  }, [params, searchParams, setError, setSelectedProvince, setSelectedTown, setSelectedType, setPriceOrder, setRefValue]);

  const handleApply = (filters?: {
    province?: string;
    town?: string;
    type?: string;
    order?: 'asc' | 'desc';
    ref?: string;
    }) => {
    const locale = params.locale as string;

    let targetUrl = `/${locale}/property-catalog`;
    if (filters?.province) {
      targetUrl += `/${encodeURIComponent(filters.province)}`;
      if (filters?.town) {
        targetUrl += `/${encodeURIComponent(filters.town)}`;
      }
    }

    const query = new URLSearchParams();
    if (filters?.type) query.set('type', filters.type);
    if (filters?.order) query.set('order', filters.order);
    if (filters?.ref) query.set('ref', filters.ref);

    const finalUrl = query.toString() ? `${targetUrl}?${query.toString()}` : targetUrl;
    router.push(finalUrl);
  };

  const handleReset = () => {
    const locale = params.locale as string;
    router.push(`/${locale}`);
    onReset?.();
  };

  return (
    <>
    <DesktopFilter
      {...props}
      provinceList={provinceList}
      typesList={typesList}
      loading={loading}
      onApply={handleApply}
      onReset={handleReset}
    />
    </>
  );
};
