'use client';

import { FC, useState } from 'react';
import Link from 'next/link';
import { FlatCard } from '@/src/entities/flat-card';
import { Property } from '@/src/shared/types';
import { LoadFlats } from '@/src/features/load-flats';
import { PropertyCatalogFilters } from '@/src/widgets/catalog-filters';
import { PropertyCatalogFilterLabels } from '@/src/shared/types';
import { $fetchCP } from '@/src/app/client-api/model';
import { SiteMenuPropertyCatalog } from '@/src/widgets/site-menu/ui/view-property-catalog';

type Props = {
  data: Property[];
  locale: string;
  title: string;
  filterLabels: PropertyCatalogFilterLabels;
  loadMore: string;
  loading: string;
};

export const PropertyCatalogPage: FC<Props> = ({
  data: initialData,
  locale,
  title,
  filterLabels,
  loadMore,
  loading,
}) => {
  const [selectedProvince, setSelectedProvince] = useState('');
  const [selectedTown, setSelectedTown] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [priceOrder, setPriceOrder] = useState<'asc' | 'desc'>('asc');
  const [refValue, setRefValue] = useState('');
  const [data, setData] = useState<Property[]>(initialData || []);
  const [error, setError] = useState<string | null>(null);

  const fetchProperties = async (filtersOverride?: {
    province?: string;
    town?: string;
    type?: string;
    order?: 'asc' | 'desc';
    ref?: string;
  }) => {
    try {
      setError(null);

      const params = new URLSearchParams();
      const province = filtersOverride?.province ?? selectedProvince;
      const town = filtersOverride?.town ?? selectedTown;
      const type = filtersOverride?.type ?? selectedType;
      const order = filtersOverride?.order ?? priceOrder;
      const ref = filtersOverride?.ref ?? refValue;

      params.set('order', order === 'desc' ? '-price' : 'price');
      if (province) params.set('province', province);
      if (town) params.set('town', town);
      if (type) params.set('type', type);
      if (ref) params.set('ref', ref);

      const qs = params.toString();
      const url = `properties${qs ? `?${qs}` : ''}`;

      const res = await $fetchCP(url, {
        headers: {
          'Accept-Language': locale,
        },
      });
      if (!res.ok) throw new Error(`Request error (${res.status})`);
      const json = (await res.json()) as Property[];
      setData(json || []);
    } catch (err) {
      console.error(err);
      setError('Failed to load filter objects.');
      setData([]);
    }
  };

  const onReset = () => {
    setSelectedProvince('');
    setSelectedTown('');
    setSelectedType('');
    setPriceOrder('asc');
    setRefValue('');
    setData(initialData || []);
    setError(null);
  };


  return (
    <section className="mt-24">
      <h1 className="text-2xl font-bold mb-4">{title}</h1>

      {/* Desktop Filters */}
      <PropertyCatalogFilters
        selectedProvince={selectedProvince}
        setSelectedProvince={setSelectedProvince}
        selectedTown={selectedTown}
        setSelectedTown={setSelectedTown}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        priceOrder={priceOrder}
        setPriceOrder={setPriceOrder}
        refValue={refValue}
        setRefValue={setRefValue}
        onApply={(override) => fetchProperties(override)}
        onReset={onReset}
        setError={setError}
        labels={filterLabels}
      />

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 auto-rows-fr gap-2.5 sm:gap-5">
        {data.map((item) => (
          <Link
            key={item._id}
            href={`/${locale}/property-catalog/flat/${item._id}`}
            className="block"
          >
            <FlatCard
              images={item.images}
              title={item.title}
              price={item.price}
              beds={item.beds}
              features={item.features}
            />
          </Link>
        ))}
      </div>

      <LoadFlats
        locale={locale}
        filters={{
          province: selectedProvince,
          town: selectedTown,
          type: selectedType,
          order: priceOrder,
          ref: refValue,
        }}
        currentCount={data.length}
        loadMore={loadMore}
        loading={loading}
      />

      <SiteMenuPropertyCatalog
        className="fixed bottom-2.5 right-2.5 z-50 md:hidden"
        labels={filterLabels}
        selectedProvince={selectedProvince}
        setSelectedProvince={setSelectedProvince}
        selectedTown={selectedTown}
        setSelectedTown={setSelectedTown}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        priceOrder={priceOrder}
        setPriceOrder={setPriceOrder}
        refValue={refValue}
        setRefValue={setRefValue}
        onApply={(override) => fetchProperties(override)}
        setError={setError}
        onReset={onReset}
      />
    </section>
  );
};

export default PropertyCatalogPage;
