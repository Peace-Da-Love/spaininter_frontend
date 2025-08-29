'use client';

import { FC } from 'react';
import { PropertyCatalogFiltersProps } from '../model';

interface Props extends Pick<
  PropertyCatalogFiltersProps,
  | 'labels'
  | 'refValue'
  | 'setRefValue'
  | 'setSelectedProvince'
  | 'setSelectedTown'
  | 'setSelectedType'
  | 'setPriceOrder'
  | 'onApply'
> {
  activeFilter: string | null;
  setActiveFilter: (v: string | null) => void;
}

export const MobileFilterRef: FC<Props> = ({
  labels,
  refValue,
  setRefValue,
  setSelectedProvince,
  setSelectedTown,
  setSelectedType,
  setPriceOrder,
  onApply,
  activeFilter,
  setActiveFilter,
}) => (
  <div className="relative flex items-center">
    <button
      onClick={() => setActiveFilter(activeFilter === 'ref' ? null : 'ref')}
      className="flex items-center size-[62px] bg-white border p-5 rounded-full shadow"
    >
      <span className="font-semibold text-lg">ID</span>
    </button>
    {activeFilter === 'ref' && (
      <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-white border rounded-2xl shadow p-3 w-56">
        <label className="block text-sm font-medium">{labels.ref}</label>
        <input
          value={refValue}
          onChange={(e) => setRefValue(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              setSelectedProvince('');
              setSelectedTown('');
              setSelectedType('');
              setPriceOrder('asc');
              setActiveFilter(null);
              onApply();
            }
          }}
          placeholder="NXXXX"
          className="w-full border rounded-md p-2"
        />
      </div>
    )}
  </div>
);
