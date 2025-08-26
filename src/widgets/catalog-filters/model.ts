export type Place = {
  _id: string | null;
  name: string;
  cities: { _id: string | null; name: string; count: number }[];
  count: number;
};

export type TypeItem = {
  name: string;
  count: number;
};

export interface PropertyCatalogFiltersProps {
  labels: {
    province: string;
    allProvinces: string;
    town: string;
    allTowns: string;
    type: string;
    allTypes: string;
    price: string;
    priceAsc: string;
    priceDesc: string;
    ref: string;
    apply: string;
    reset: string;
  };
  selectedProvince: string;
  setSelectedProvince: (v: string) => void;
  selectedTown: string;
  setSelectedTown: (v: string) => void;
  selectedType: string;
  setSelectedType: (v: string) => void;
  priceOrder: 'asc' | 'desc';
  setPriceOrder: (v: 'asc' | 'desc') => void;
  refValue: string;
  setRefValue: (v: string) => void;
  onApply: (filtersOverride?: {
    province?: string;
    town?: string;
    type?: string;
    order?: 'asc' | 'desc';
    ref?: string;
  }) => void;
  onReset: () => void;
  setError: (msg: string | null) => void;
}
