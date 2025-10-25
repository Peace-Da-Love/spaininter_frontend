'use client'

import * as React from 'react'
import { Globe  } from 'lucide-react'
import { PropertyCatalogFiltersProps } from '../model'
import { Button } from '@/src/shared/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/shared/components/ui/popover'

const EMPTY_VALUE = '__empty__'

type Props = Pick<
  PropertyCatalogFiltersProps,
  | 'labels'
  | 'selectedProvince'
  | 'setSelectedProvince'
  | 'setSelectedTown'
  | 'selectedType'
  | 'priceOrder'
  | 'refValue'
  | 'onApply'
> & {
  provinceList: { name: string; count: number }[]
  className?: string
}

export const MobileFilterProvince = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      labels,
      provinceList,
      selectedProvince,
      setSelectedProvince,
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
    const [hasSelected, setHasSelected] = React.useState(false)

    function handleProvinceChange(v: string) {
      const province = v === EMPTY_VALUE ? '' : v
      setSelectedProvince(province)
      setSelectedTown('')
      setHasSelected(true)
      onApply({
        province,
        town: '',
        type: selectedType,
        order: priceOrder,
        ref: refValue,
      })
      setOpen(false)
    }

    function handleTriggerClick() {
      setHasSelected(false)
      setOpen(true)
    }

    function handleOpenChange(open: boolean) {
      if (!open && !hasSelected) {
        // Если закрываем popover и ничего не выбрали, сбрасываем фильтры
        setSelectedProvince('')
        setSelectedTown('')
        onApply({
          province: '',
          town: '',
          type: selectedType,
          order: priceOrder,
          ref: refValue,
        })
      }
      setOpen(open)
    }

    return (
      <div ref={ref} className={className}>
        <Popover open={open} onOpenChange={handleOpenChange}>
          <PopoverTrigger asChild>
            <Button variant="menu" onClick={handleTriggerClick} className="relative">
              <Globe  size={25} />
              {selectedProvince && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-orange-400 rounded-full border-2 border-white" />
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            side="left"
            align="start"
            className="w-52 p-3 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-visible"
          >
            <div>
              <label className="block text-xs font-medium text-foreground/90 mb-2">
                {labels.province}
              </label>

              <div className="max-h-60 overflow-y-auto">
                {provinceList.map((p) => (
                  <button
                    key={p.name}
                    className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors"
                    onClick={() => handleProvinceChange(p.name)}
                  >
                    {p.name} ({p.count})
                  </button>
                ))}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    )
  }
)

MobileFilterProvince.displayName = 'MobileFilterProvince'


