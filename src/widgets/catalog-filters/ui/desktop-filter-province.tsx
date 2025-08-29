import { FC } from 'react';
import { Place } from '../model';
import { PropertyCatalogFiltersProps } from '../model';

interface Props {
  labels: PropertyCatalogFiltersProps['labels'];
  provinceList: Place[];
  selectedProvince: string;
  setSelectedProvince: (v: string) => void;
  setSelectedTown: (v: string) => void;
  loading: boolean;
}

export const FilterProvince: FC<Props> = ({
  labels,
  provinceList,
  selectedProvince,
  setSelectedProvince,
  setSelectedTown,
  loading,
}) => (
  <div className="flex-1 min-w-[140px]">
    <label className="block text-sm font-medium mb-2">{labels.province}</label>
    <select
      value={selectedProvince}
      onChange={(e) => {
        setSelectedProvince(e.target.value);
        setSelectedTown('');
      }}
      className="w-full border rounded-md p-2"
      disabled={loading}
    >
      <option value="">{labels.allProvinces}</option>
      {provinceList.map((p) => (
        <option key={p.name} value={p.name}>
          {p.name} ({p.count})
        </option>
      ))}
    </select>
  </div>
);
