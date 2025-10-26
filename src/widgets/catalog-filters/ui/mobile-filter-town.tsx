'use client'

import * as React from 'react'
import { LandPlot, Search } from 'lucide-react'
import { PropertyCatalogFiltersProps } from '../model'
import { Button } from '@/src/shared/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/src/shared/components/ui/popover'
import { Input } from '@/src/shared/components/ui/input'

const EMPTY_VALUE = '__empty__'

type Props = Pick<
  PropertyCatalogFiltersProps,
  | 'labels'
  | 'selectedProvince'
  | 'selectedTown'
  | 'setSelectedTown'
  | 'selectedType'
  | 'priceOrder'
  | 'refValue'
  | 'onApply'
> & {
  townsForSelected: { name: string; count: number }[]
  className?: string
}

export const MobileFilterTown = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      labels,
      selectedProvince,
      townsForSelected,
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
    const [hasSelected, setHasSelected] = React.useState(false)
    const [searchTerm, setSearchTerm] = React.useState('')

    // filter the towns by the entered string
    const filteredTowns = React.useMemo(() => {
      const term = searchTerm.toLowerCase().trim()
      if (!term) return townsForSelected
      return townsForSelected.filter((t) =>
        t.name.toLowerCase().includes(term)
      )
    }, [townsForSelected, searchTerm])

    function handleTownChange(v: string) {
      const town = v === EMPTY_VALUE ? '' : v
      setSelectedTown(town)
      setHasSelected(true)
      onApply({
        province: selectedProvince,
        town,
        type: selectedType,
        order: priceOrder,
        ref: refValue,
      })
      setOpen(false)
      setSearchTerm('') // reset the search after selection
    }

    function handleTriggerClick() {
      setHasSelected(false)
      setOpen(true)
      setSearchTerm('')
    }

    function handleOpenChange(open: boolean) {
      if (!open && !hasSelected) {
        // If we close the popover and nothing is selected, reset the town filter
        setSelectedTown('')
        onApply({
          province: selectedProvince,
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
              <LandPlot size={25} />
              {selectedTown && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-cyan-500 rounded-full border-2 border-white" />
              )}
            </Button>
          </PopoverTrigger>

          <PopoverContent
            side="left"
            align="start"
            className="w-60 p-3 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-visible"
          >
            <div>
              <label className="block text-xs font-medium text-foreground/90 mb-2">
                {labels.town}
              </label>

              {/* 🔍 Search field */}
              <div className="relative mb-3">
                <Search className="absolute left-2 top-2.5 size-4 text-foreground/50" />
                <Input
                  type="text"
                  placeholder={'Search town...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 h-8 text-sm"
                />
              </div>

              {/* 📋 List of towns */}
              <div className="max-h-60 overflow-y-auto">
                {filteredTowns.length > 0 ? (
                  filteredTowns.map((t) => (
                    <button
                      key={t.name}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 rounded-md transition-colors"
                      onClick={() => handleTownChange(t.name)}
                    >
                      <div className="flex justify-between items-center">
                        <span className="truncate">{t.name}</span>
                        <span className="ml-2 text-xs text-foreground/60">
                          ({t.count})
                        </span>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="text-sm text-foreground/60 px-3 py-2">
                    {'No towns found'}
                  </div>
                )}
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    )
  }
)

MobileFilterTown.displayName = 'MobileFilterTown'
