import { FC } from 'react';
import { PropertyCatalogFiltersProps } from '../model';

interface Town {
  _id: string | null;
  name: string;
  count: number;
}

interface Props {
  labels: PropertyCatalogFiltersProps['labels'];
  townsForSelected: Town[];
  selectedTown: string;
  setSelectedTown: (v: string) => void;
  disabled: boolean;
}

export const FilterTown: FC<Props> = ({
  labels,
  townsForSelected,
  selectedTown,
  setSelectedTown,
  disabled,
}) => (
  <div className="flex-1 min-w-[180px]">
    <label className="block text-sm font-medium mb-2">{labels.town}</label>
    <select
      value={selectedTown}
      onChange={(e) => setSelectedTown(e.target.value)}
      className="w-full border rounded-md p-2"
      disabled={disabled}
    >
      <option value="">{labels.allTowns}</option>
      {townsForSelected.map((t) => (
        <option key={t.name} value={t.name}>
          {t.name} ({t.count})
        </option>
      ))}
    </select>
  </div>
);
