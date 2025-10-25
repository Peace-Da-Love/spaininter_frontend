'use client'

import * as React from 'react'
import { Button } from '@/src/shared/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/src/shared/components/ui/popover'
import { Input } from '@/src/shared/components/ui/input'
import { PropertyCatalogFilterLabels } from '@/src/shared/types'

type Props = {
  labels: PropertyCatalogFilterLabels
  refValue: string
  setRefValue: (val: string) => void
  onApply: (filters?: {
    province?: string
    town?: string
    type?: string
    order?: 'asc' | 'desc'
    ref?: string
  }) => void
  loading?: boolean
  selectedProvince?: string
  selectedTown?: string
  selectedType?: string
  priceOrder?: 'asc' | 'desc'
}

export const MobileFilterRef = React.forwardRef<HTMLDivElement, Props>(
  (
    {
      labels,
      refValue,
      setRefValue,
      onApply,
      loading,
      selectedProvince,
      selectedTown,
      selectedType,
      priceOrder,
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false)
    const hasClearedOnOpen = React.useRef(false)

    // clean ref and apply search on the first open of the popover
    React.useEffect(() => {
      if (open && !hasClearedOnOpen.current) {
        hasClearedOnOpen.current = true
        setRefValue('')
        onApply({
          province: selectedProvince,
          town: selectedTown,
          type: selectedType,
          order: priceOrder,
          ref: '',
        })
      }
      if (!open) {
        hasClearedOnOpen.current = false
      }
    }, [open, setRefValue, onApply, selectedProvince, selectedTown, selectedType, priceOrder])

    const handleApply = () => {
      onApply({
        province: selectedProvince,
        town: selectedTown,
        type: selectedType,
        order: priceOrder,
        ref: refValue,
      })
    }

    return (
      <div ref={ref}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="menu" disabled={loading} className="relative">
              <span className="font-bold text-lg">ID</span>
              {refValue && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white" />
              )}
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
              autoFocus
            />
          </PopoverContent>
        </Popover>
      </div>
    )
  }
)

MobileFilterRef.displayName = 'MobileFilterRef'
