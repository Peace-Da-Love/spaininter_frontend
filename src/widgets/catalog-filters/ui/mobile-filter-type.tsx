'use client'

import * as React from 'react'
import { Building, Building2, Home } from 'lucide-react'
import { PropertyCatalogFiltersProps } from '../model'
import { Button } from '@/src/shared/components/ui/button'
import {
  getNextPropertyTypeGroup,
  propertyTypeGroupFromQuery,
  propertyTypeGroupToQuery,
  PropertyTypeGroup,
} from '@/src/shared/utils'

interface Props
  extends Pick<
    PropertyCatalogFiltersProps,
    | 'labels'
    | 'selectedType'
    | 'setSelectedType'
    | 'selectedProvince'
    | 'selectedTown'
    | 'priceOrder'
    | 'refValue'
    | 'onApply'
  > {}

const GROUP_ICONS: Record<PropertyTypeGroup, typeof Building2> = {
  '': Building2,
  houses: Home,
  flats: Building,
}

export const MobileFilterType = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      labels,
      selectedType,
      setSelectedType,
      selectedProvince,
      selectedTown,
      priceOrder,
      refValue,
      onApply,
    },
    ref
  ) => {
    const currentGroup = propertyTypeGroupFromQuery(selectedType)
    const Icon = GROUP_ICONS[currentGroup]
    const groupLabel = currentGroup ? labels[currentGroup] : labels.allTypes

    function handleClick() {
      const nextGroup = getNextPropertyTypeGroup(currentGroup)
      const type = propertyTypeGroupToQuery(nextGroup)

      setSelectedType(type)
      onApply({
        province: selectedProvince,
        town: selectedTown,
        type,
        order: priceOrder,
        ref: refValue,
      })
    }

    return (
      <div ref={ref}>
        <Button
          variant="menu"
          type="button"
          onClick={handleClick}
          className="relative"
          aria-label={`${labels.type}: ${groupLabel}`}
          title={`${labels.type}: ${groupLabel}`}
        >
          <Icon size={25} />
          {currentGroup && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-white" />
          )}
        </Button>
      </div>
    )
  }
)

MobileFilterType.displayName = 'MobileFilterType'
