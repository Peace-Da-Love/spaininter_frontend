'use client'

import * as React from 'react'
import { useMemo } from 'react'
import { MapPin } from 'lucide-react'
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

type Props = Pick<
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
> & {
  provinceList: { name: string; count: number }[]
  townsForSelected: { name: string; count: number }[]
  className?: string
}

export const MobileFilterProvinceTown = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      labels,
      provinceList,
      townsForSelected,
      selectedProvince,
      setSelectedProvince,
      selectedTown,
      setSelectedTown,
      selectedType,
      priceOrder,
      refValue,
      onApply,
      className,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const hasProvince = useMemo(() => !!selectedProvince, [selectedProvince])

    function handleProvinceChange(v: string) {
      const province = v === EMPTY_VALUE ? '' : v
      setSelectedProvince(province)
      setSelectedTown('')
      onApply({
        province,
        town: '',
        type: selectedType,
        order: priceOrder,
        ref: refValue,
      })
      setOpen(true)
    }

    function handleTownChange(v: string) {
      const town = v === EMPTY_VALUE ? '' : v
      setSelectedTown(town)
      onApply({
        province: selectedProvince,
        town,
        type: selectedType,
        order: priceOrder,
        ref: refValue,
      })
      setOpen(false)
    }

    return (
      <div ref={ref} className={className}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="menu">
              <MapPin size={25} />
            </Button>
          </PopoverTrigger>

          <PopoverContent
            side="left"
            align="start"
            className="w-52 p-3 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-visible"
          >
            {/* Province selector */}
            <div className="mb-3">
              <label className="block text-xs font-medium text-foreground/90 mb-2">
                {labels.province}
              </label>

              <Select
                value={selectedProvince || EMPTY_VALUE}
                onValueChange={handleProvinceChange}
              >
                <SelectTrigger className="w-full inline-flex justify-between items-center px-3 py-2 rounded-md border bg-white text-sm">
                  <SelectValue placeholder={labels.allProvinces} />
                </SelectTrigger>

                <SelectContent position="popper">
                  <SelectGroup>
                    <SelectItemList value={EMPTY_VALUE}>{labels.allProvinces}</SelectItemList>
                    {provinceList.map((p) => (
                      <SelectItemList key={p.name} value={p.name}>
                        {p.name} ({p.count})
                      </SelectItemList>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            {/* Town selector */}
            {hasProvince && (
              <div>
                <label className="block text-xs font-medium text-foreground/90 mb-2">
                  {labels.town}
                </label>

                <Select value={selectedTown || EMPTY_VALUE} onValueChange={handleTownChange}>
                  <SelectTrigger className="w-full inline-flex justify-between items-center px-3 py-2 rounded-md border bg-white text-sm">
                    <SelectValue placeholder={labels.allTowns} />
                  </SelectTrigger>

                  <SelectContent 
                    position="popper" 
                    className="w-56 max-h-60 rounded-md shadow-lg bg-white border overflow-hidden"
                  >
                    <SelectGroup className="flex flex-col">
                      <SelectItemList value={EMPTY_VALUE}>
                        {labels.allTowns}
                      </SelectItemList>
                      {townsForSelected.map((t) => (
                        <SelectItemList key={t.name} value={t.name}>
                          <div className="flex justify-between items-center">
                            <span className="truncate">{t.name}</span>
                            <span className="ml-2 text-xs text-foreground/60">({t.count})</span>
                          </div>
                        </SelectItemList>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            )}
          </PopoverContent>
        </Popover>
      </div>
    )
  }
)

MobileFilterProvinceTown.displayName = 'MobileFilterProvinceTown'
