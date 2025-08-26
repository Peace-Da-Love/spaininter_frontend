'use client';

import { FC, useMemo } from 'react';
import { PropertyCatalogFiltersProps } from '../model';
import { Place, TypeItem } from '../model';
import { FilterProvince } from './desktop-filter-province';
import { FilterTown } from './desktop-filter-town';
import { FilterType } from './desktop-filter-type';
import { FilterPrice } from './desktop-filter-price';
import { FilterRef } from './desktop-filter-ref';
import { FilterActions } from './desktop-filter-actions';

interface DesktopFilterProps extends PropertyCatalogFiltersProps {
  provinceList: Place[];
  typesList: TypeItem[];
  loading: boolean;
}

export const DesktopFilter: FC<DesktopFilterProps> = ({
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
  onReset,
  provinceList,
  typesList,
  loading,
}) => {
  const townsForSelected = useMemo(() => {
    if (!selectedProvince) return [];
    const prov = provinceList.find((p) => p.name === selectedProvince);
    return prov?.cities || [];
  }, [provinceList, selectedProvince]);

  return (
    <div className="hidden md:flex bg-white/60 backdrop-blur-sm border border-gray-200 rounded-xl p-4 mb-6 gap-3 items-start flex-wrap">
      <FilterProvince
        labels={labels}
        provinceList={provinceList}
        selectedProvince={selectedProvince}
        setSelectedProvince={setSelectedProvince}
        setSelectedTown={setSelectedTown}
        loading={loading}
      />
      <FilterTown
        labels={labels}
        townsForSelected={townsForSelected}
        selectedTown={selectedTown}
        setSelectedTown={setSelectedTown}
        disabled={!selectedProvince || loading}
      />
      <FilterType
        labels={labels}
        typesList={typesList}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        loading={loading}
      />
      <FilterPrice
        labels={labels}
        priceOrder={priceOrder}
        setPriceOrder={setPriceOrder}
        onApply={onApply}
        selectedProvince={selectedProvince}
        selectedTown={selectedTown}
        selectedType={selectedType}
        refValue={refValue}
      />
      <FilterRef
        labels={labels}
        refValue={refValue}
        setRefValue={setRefValue}
        onApply={onApply}
        loading={loading}
      />
      <FilterActions
        labels={labels}
        onApply={onApply}
        onReset={onReset}
        loading={loading}
        selectedProvince={selectedProvince}
        selectedTown={selectedTown}
        selectedType={selectedType}
        refValue={refValue}
        priceOrder={priceOrder}
      />
    </div>
  );
};
