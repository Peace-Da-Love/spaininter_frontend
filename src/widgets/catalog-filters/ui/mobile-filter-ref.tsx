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
}

export const MobileFilterRef = React.forwardRef<HTMLDivElement, Props>(
  ({ labels, refValue, setRefValue, onApply, loading }, ref) => {
    const [open, setOpen] = React.useState(false)

    const handleApply = () => {
      setOpen(false)
      onApply({ ref: refValue })
    }

    return (
      <div ref={ref}>
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button variant="menu" disabled={loading}>
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
