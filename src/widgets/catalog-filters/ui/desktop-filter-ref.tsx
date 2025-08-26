import { FC } from 'react';
import { PropertyCatalogFiltersProps } from '../model';

interface Props {
  labels: PropertyCatalogFiltersProps['labels'];
  refValue: string;
  setRefValue: (v: string) => void;
  onApply: () => void;
  loading: boolean;
}

export const FilterRef: FC<Props> = ({
  labels,
  refValue,
  setRefValue,
  onApply,
  loading,
}) => (
  <div className="min-w-[160px]">
    <label className="block text-sm font-medium mb-2">{labels.ref}</label>
    <input
      value={refValue}
      onChange={(e) => {
        setRefValue(e.target.value);
        onApply();
      }}
      className="w-full border rounded-md p-2"
      placeholder="NXXXX"
      disabled={loading}
    />
  </div>
);
