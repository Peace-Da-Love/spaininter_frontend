'use client';

import { FC } from 'react';
import { DollarSign, ArrowUp, ArrowDown } from 'lucide-react';
import { PropertyCatalogFiltersProps } from '../model';

interface Props extends Pick<
  PropertyCatalogFiltersProps,
  | 'priceOrder'
  | 'setPriceOrder'
  | 'selectedProvince'
  | 'selectedTown'
  | 'selectedType'
  | 'refValue'
  | 'onApply'
> {}

export const MobileFilterPrice: FC<Props> = ({
  priceOrder,
  setPriceOrder,
  selectedProvince,
  selectedTown,
  selectedType,
  refValue,
  onApply,
}) => (
  <div className="relative flex items-center">
    <button
      onClick={() => {
        const newOrder = priceOrder === 'asc' ? 'desc' : 'asc';
        setPriceOrder(newOrder);
        onApply({
          province: selectedProvince,
          town: selectedTown,
          type: selectedType,
          order: newOrder,
          ref: refValue,
        });
      }}
      className="bg-white border p-5 rounded-full shadow flex items-center gap-1"
    >
      <DollarSign size={20} />
      {priceOrder === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
    </button>
  </div>
);
