import { FC } from 'react';
import { TypeItem } from '../model';
import { PropertyCatalogFiltersProps } from '../model';

interface Props {
  labels: PropertyCatalogFiltersProps['labels'];
  typesList: TypeItem[];
  selectedType: string;
  setSelectedType: (v: string) => void;
  loading: boolean;
}

export const FilterType: FC<Props> = ({
  labels,
  typesList,
  selectedType,
  setSelectedType,
  loading,
}) => (
  <div className="min-w-[160px]">
    <label className="block text-sm font-medium mb-2">{labels.type}</label>
    <select
      value={selectedType}
      onChange={(e) => setSelectedType(e.target.value)}
      className="w-full border rounded-md p-2"
      disabled={loading}
    >
      <option value="">{labels.allTypes}</option>
      {typesList.map((t) => (
        <option key={t.name} value={t.name}>
          {t.name} ({t.count})
        </option>
      ))}
    </select>
  </div>
);
