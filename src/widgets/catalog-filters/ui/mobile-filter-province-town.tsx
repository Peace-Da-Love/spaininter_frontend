'use client';

import { FC } from 'react';
import { MapPin } from 'lucide-react';
import { PropertyCatalogFiltersProps } from '../model';

interface Props extends Pick<
  PropertyCatalogFiltersProps,
  | 'labels'
  | 'selectedProvince'
  | 'setSelectedProvince'
  | 'selectedTown'
  | 'setSelectedTown'
  | 'selectedType'
  | 'priceOrder'
  | 'refValue'
  | 'onApply'
> {
  provinceList: { name: string; count: number }[];
  townsForSelected: { name: string; count: number }[];
  activeFilter: string | null;
  setActiveFilter: (v: string | null) => void;
}

export const MobileFilterProvinceTown: FC<Props> = ({
  labels,
  provinceList,
  selectedProvince,
  setSelectedProvince,
  selectedTown,
  setSelectedTown,
  townsForSelected,
  selectedType,
  priceOrder,
  refValue,
  onApply,
  activeFilter,
  setActiveFilter,
}) => (
  <div className="relative flex items-center">
    <button
      onClick={() => setActiveFilter(activeFilter === 'place' ? null : 'place')}
      className="flex items-center size-[62px] bg-white border p-5 rounded-full shadow"
    >
      <MapPin size={20} />
    </button>
    {activeFilter === 'place' && (
      <div className="absolute right-20 top-1/2 -translate-y-1/2 bg-white border rounded-2xl shadow p-3 w-60 space-y-3">
        {/* Province */}
        <label className="block text-sm font-medium">{labels.province}</label>
        <select
          value={selectedProvince}
          onChange={(e) => {
            const province = e.target.value;
            setSelectedProvince(province);
            setSelectedTown('');
            onApply({
              province,
              town: '',
              type: selectedType,
              order: priceOrder,
              ref: refValue,
            });
          }}
          className="w-full border rounded-md p-2"
        >
          <option value="">{labels.allProvinces}</option>
          {provinceList.map((p) => (
            <option key={p.name} value={p.name}>
              {p.name} ({p.count})
            </option>
          ))}
        </select>

        {/* Town */}
        {selectedProvince && (
          <>
            <label className="block text-sm font-medium">{labels.town}</label>
            <select
              value={selectedTown}
              onChange={(e) => {
                const town = e.target.value;
                setSelectedTown(town);
                setActiveFilter(null);
                onApply({
                  province: selectedProvince,
                  town,
                  type: selectedType,
                  order: priceOrder,
                  ref: refValue,
                });
              }}
              className="w-full border rounded-md p-2"
            >
              <option value="">{labels.allTowns}</option>
              {townsForSelected.map((t) => (
                <option key={t.name} value={t.name}>
                  {t.name} ({t.count})
                </option>
              ))}
            </select>
          </>
        )}
      </div>
    )}
  </div>
);
