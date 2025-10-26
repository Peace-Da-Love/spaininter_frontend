'use client'

import { FC } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/src/shared/components/ui/button'
import { cn } from '@/src/shared/utils'

interface SelectedFiltersDisplayProps {
  selectedProvince: string
  selectedTown: string
  selectedType: string
  refValue: string
  labels: {
    province: string
    town: string
    type: string
    ref: string
  }
  onClearFilter: (filterType: 'province' | 'town' | 'type' | 'ref') => void
  className?: string
}

export const SelectedFiltersDisplay: FC<SelectedFiltersDisplayProps> = ({
  selectedProvince,
  selectedTown,
  selectedType,
  refValue,
  labels,
  onClearFilter,
  className,
}) => {
  const hasAnyFilter = selectedProvince || selectedTown || selectedType || refValue

  if (!hasAnyFilter) {
    return null
  }

  return (
    <div className={cn('flex flex-wrap gap-2 mb-4', className)}>
      {selectedProvince && (
        <div className="flex items-center gap-1 bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full text-sm">
          <span className="font-medium">{labels.province}:</span>
          <span>{selectedProvince}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1 ml-1 hover:bg-orange-100"
            onClick={() => onClearFilter('province')}
          >
            <X size={14} />
          </Button>
        </div>
      )}

      {selectedTown && (
        <div className="flex items-center gap-1 bg-cyan-50 text-cyan-700 px-3 py-1.5 rounded-full text-sm">
          <span className="font-medium">{labels.town}:</span>
          <span>{selectedTown}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1 ml-1 hover:bg-cyan-100"
            onClick={() => onClearFilter('town')}
          >
            <X size={14} />
          </Button>
        </div>
      )}

      {selectedType && (
        <div className="flex items-center gap-1 bg-yellow-50 text-yellow-700 px-3 py-1.5 rounded-full text-sm">
          <span className="font-medium">{labels.type}:</span>
          <span>{selectedType}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1 ml-1 hover:bg-yellow-100"
            onClick={() => onClearFilter('type')}
          >
            <X size={14} />
          </Button>
        </div>
      )}

      {refValue && (
        <div className="flex items-center gap-1 bg-red-50 text-red-700 px-3 py-1.5 rounded-full text-sm">
          <span className="font-medium">{labels.ref}:</span>
          <span>{refValue}</span>
          <Button
            variant="ghost"
            size="sm"
            className="h-auto p-1 ml-1 hover:bg-red-100"
            onClick={() => onClearFilter('ref')}
          >
            <X size={14} />
          </Button>
        </div>
      )}
    </div>
  )
}
