import { FC } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { PropertyCatalogFiltersProps } from '../model';

interface Props {
  labels: PropertyCatalogFiltersProps['labels'];
  priceOrder: 'asc' | 'desc';
  setPriceOrder: (v: 'asc' | 'desc') => void;
  selectedProvince: string;
  selectedTown: string;
  selectedType: string;
  refValue: string;
}

export const FilterPrice: FC<Props> = ({
  labels,
  priceOrder,
  setPriceOrder,
}) => (
  <div className="min-w-[120px]">
    <label className="block text-sm font-medium mb-2">{labels.price}</label>
    <button
      onClick={() => {
        const newOrder = priceOrder === 'asc' ? 'desc' : 'asc';
        setPriceOrder(newOrder);
        ;
      }}
      className="px-3 py-2 rounded-md border flex items-center gap-2 bg-white hover:bg-gray-50"
    >
      {priceOrder === 'asc' ? (
        <>
          <ArrowUp size={16} />
          {labels.priceAsc}
        </>
      ) : (
        <>
          <ArrowDown size={16} />
          {labels.priceDesc}
        </>
      )}
    </button>
  </div>
);
