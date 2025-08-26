'use client';

import { FC, ReactNode } from 'react';

export interface MiniCardProps {
  icon: ReactNode;
  label: string;
  value?: string | number | boolean;
}

export const FeatureMiniCard: FC<MiniCardProps> = ({ icon, label, value }) => {
  if (!value) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="flex-shrink-0">
        {icon}
      </div>
      <span className="mt-2 text-sm break-words text-gray-700">{label}</span>
      <span className="text-gray-900 font-medium">{value}</span>
    </div>
  );
};
