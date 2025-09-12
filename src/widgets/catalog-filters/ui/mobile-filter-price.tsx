'use client'

import * as React from 'react'
import { DollarSign, ArrowUp, ArrowDown } from 'lucide-react'
import { PropertyCatalogFiltersProps } from '../model'
import { Button } from '@/src/shared/components/ui/button'

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

export const MobileFilterPrice = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      priceOrder,
      setPriceOrder,
      selectedProvince,
      selectedTown,
      selectedType,
      refValue,
      onApply,
    },
    ref
  ) => {
    const togglePriceOrder = () => {
      const newOrder: 'asc' | 'desc' = priceOrder === 'asc' ? 'desc' : 'asc'
      setPriceOrder(newOrder)
      onApply({
        province: selectedProvince,
        town: selectedTown,
        type: selectedType,
        order: newOrder,
        ref: refValue,
      })
    }

    return (
      <div ref={ref} className="flex items-center">
        <Button
          variant="menu"
          className="flex items-center gap-1"
          onClick={togglePriceOrder}
        >
          <DollarSign size={22} />
          {priceOrder === 'asc' ? <ArrowUp size={20} /> : <ArrowDown size={16} />}
        </Button>
      </div>
    )
  }
)

MobileFilterPrice.displayName = 'MobileFilterPrice'
