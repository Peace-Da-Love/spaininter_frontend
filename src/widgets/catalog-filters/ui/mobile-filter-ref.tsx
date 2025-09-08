'use client'

import * as React from 'react'
import { PropertyCatalogFiltersProps } from '../model'
import { Button } from '@/src/shared/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/shared/components/ui/popover'
import { Input } from '@/src/shared/components/ui/input'

interface Props extends Pick<
  PropertyCatalogFiltersProps,
  | 'labels'
  | 'refValue'
  | 'setRefValue'
  | 'setSelectedProvince'
  | 'setSelectedTown'
  | 'setSelectedType'
  | 'setPriceOrder'
  | 'onApply'
> {
  activeFilter: string | null
  setActiveFilter: (v: string | null) => void
}

// Используем forwardRef, чтобы DropdownMenuItem мог пробросить ref
export const MobileFilterRef = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      labels,
      refValue,
      setRefValue,
      setSelectedProvince,
      setSelectedTown,
      setSelectedType,
      setPriceOrder,
      onApply,
      activeFilter,
      setActiveFilter,
    },
    ref
  ) => {
    const open = activeFilter === 'ref'

    const handleApply = () => {
      setSelectedProvince('')
      setSelectedTown('')
      setSelectedType('')
      setPriceOrder('asc')
      setActiveFilter(null)
      onApply()
    }

    return (
      <div ref={ref}>
        <Popover open={open} onOpenChange={(o) => setActiveFilter(o ? 'ref' : null)}>
          <PopoverTrigger asChild>
            <Button variant="menu">
              <span className="font-semibold text-lg">ID</span>
            </Button>
          </PopoverTrigger>

          <PopoverContent
            side="left"
            align="start"
            className="w-56 p-3 bg-white rounded-2xl shadow-lg border border-gray-100"
          >
            <label className="block text-xs font-medium text-foreground/90 mb-2">
              {labels.ref}
            </label>
            <Input
              value={refValue}
              onChange={(e) => setRefValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleApply()
              }}
              placeholder="NXXXX"
              className="w-full"
            />
          </PopoverContent>
        </Popover>
      </div>
    )
  }
)

MobileFilterRef.displayName = 'MobileFilterRef'
