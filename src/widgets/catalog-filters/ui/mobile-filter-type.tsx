'use client';

import { FC } from 'react';
import { Home } from 'lucide-react';
import { PropertyCatalogFiltersProps } from '../model';

interface Props extends Pick<
  PropertyCatalogFiltersProps,
  | 'labels'
  | 'selectedType'
  | 'setSelectedType'
  | 'selectedProvince'
  | 'selectedTown'
  | 'priceOrder'
  | 'refValue'
  | 'onApply'
> {
  typesList: { name: string; count: number }[];
  activeFilter: string | null;
  setActiveFilter: (v: string | null) => void;
}

export const MobileFilterType: FC<Props> = ({
  labels,
  typesList,
  selectedType,
  setSelectedType,
  selectedProvince,
  selectedTown,
  priceOrder,
  refValue,
  onApply,
  activeFilter,
  setActiveFilter,
}) => (
  <div className="relative flex items-center">
    <button
      onClick={() => setActiveFilter(activeFilter === 'type' ? null : 'type')}
      className="flex items-center size-[62px] bg-white border p-5 rounded-full shadow"
    >
      <Home size={20} />
    </button>
    {activeFilter === 'type' && (
      <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-white border rounded-2xl shadow p-3 w-52">
        <label className="block text-sm font-medium">{labels.type}</label>
        <select
          value={selectedType}
          onChange={(e) => {
            const type = e.target.value;
            setSelectedType(type);
            setActiveFilter(null);
            onApply({
              province: selectedProvince,
              town: selectedTown,
              type,
              order: priceOrder,
              ref: refValue,
            });
          }}
          className="w-full border rounded-md p-2"
        >
          <option value="">{labels.allTypes}</option>
          {typesList.map((t) => (
            <option key={t.name} value={t.name}>
              {t.name} ({t.count})
            </option>
          ))}
        </select>
      </div>
    )}
  </div>
);
