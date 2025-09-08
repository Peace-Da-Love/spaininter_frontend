'use client'

import * as React from 'react'
import { Home } from 'lucide-react'
import { PropertyCatalogFiltersProps } from '../model'
import { Button } from '@/src/shared/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/shared/components/ui/popover'
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectGroup,
  SelectItemList,
  SelectValue,
} from '@/src/shared/components/ui/select'

const EMPTY_VALUE = '__empty__'

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
  > {
  typesList: { name: string; count: number }[]
}

// forwardRef для корректной работы с DropdownMenuItem asChild
export const MobileFilterType = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      labels,
      typesList,
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
    function handleTypeChange(v: string) {
      const type = v === EMPTY_VALUE ? '' : v
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
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="menu">
              <Home size={20} />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            side="left"
            align="start"
            className="w-52 p-3 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-visible"
          >
            <div>
              <label className="block text-xs font-medium text-foreground/90 mb-2">
                {labels.type}
              </label>

              <Select
                value={selectedType || EMPTY_VALUE}
                onValueChange={handleTypeChange}
              >
                <SelectTrigger className="w-full inline-flex justify-between items-center px-3 py-2 rounded-md border bg-white text-sm">
                  <SelectValue placeholder={labels.allTypes} />
                </SelectTrigger>

                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectItemList value={EMPTY_VALUE}>
                      {labels.allTypes}
                    </SelectItemList>
                    {typesList.map((t) => (
                      <SelectItemList key={t.name} value={t.name}>
                        <div className="flex justify-between items-center">
                          <span className="truncate">{t.name}</span>
                          <span className="ml-2 text-xs text-foreground/60">
                            ({t.count})
                          </span>
                        </div>
                      </SelectItemList>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    )
  }
)

MobileFilterType.displayName = 'MobileFilterType'
