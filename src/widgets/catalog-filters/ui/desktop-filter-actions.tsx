import { FC } from 'react';
import { PropertyCatalogFiltersProps } from '../model';

interface Props {
  labels: PropertyCatalogFiltersProps['labels'];
  onApply: PropertyCatalogFiltersProps['onApply'];
  onReset: PropertyCatalogFiltersProps['onReset'];
  loading: boolean;
  selectedProvince: string;
  selectedTown: string;
  selectedType: string;
  priceOrder: 'asc' | 'desc';
  refValue: string;
}

export const FilterActions: FC<Props> = ({ labels,
  loading,
  selectedProvince,
  selectedTown,
  selectedType,
  priceOrder,
  refValue,
  onApply,
  onReset, }) => (
  <div className="flex flex-col mt-auto">
    <div className="flex items-center justify-end gap-2 ml-auto">
      <button
        onClick={() =>
          onApply({
            province: selectedProvince,
            town: selectedTown,
            type: selectedType,
            order: priceOrder,
            ref: refValue,
          })
        }
        className="px-4 py-2 bg-orange-500 text-white rounded-md shadow-sm hover:bg-orange-600"
        disabled={loading}
      >
        {labels.apply}
      </button>

      <button
        onClick={onReset}
        className="px-3 py-2 border rounded-md text-sm"
        disabled={loading}
      >
        {labels.reset}
      </button>
    </div>
  </div>
);
