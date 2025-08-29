'use client';

import { FC } from 'react';
import { priceFormatter } from '@/src/shared/utils';
import { FeatureMiniCard } from '@/src/shared/components/shared/flat-feature-minicard';
import { MiniCardIcons } from '@/src/shared/components/shared/flat-feature-minicard';
import { MinicardLabels } from '@/src/shared/types';

type Props = {
  title_truncated: string;
  price: string | number | undefined;
  currency?: string;
  town?: string;
  description?: string;
  features?: Record<string, any>;
  beds?: number | string;
  baths?: number | string;
  onOpenModal: () => void;
  onCloseOverlay: () => void;
  minicardLabels: MinicardLabels
};

export const InfoCardOverlay: FC<Props> = ({
  title_truncated,
  price,
  currency,
  town,
  description,
  features,
  beds,
  baths,
  onOpenModal,
  onCloseOverlay,
  minicardLabels
}) => {
  const priceNum = Number(price);
  const safePrice = Number.isFinite(priceNum) ? priceNum : 0;

  const areaRaw = features?.['Useable Build Space'];
  const area = typeof areaRaw === 'string' ? areaRaw.split(' ')[0] : areaRaw;

  const bedroomsRaw = features?.['Double Bedrooms'];
  const bedrooms = bedroomsRaw ? (typeof bedroomsRaw === 'string' ? bedroomsRaw.split(' ')[0] : bedroomsRaw) : beds;

  return (
    <section
      className="fixed bottom-36 right-4 z-30 bg-white bg-opacity-70 rounded-xl shadow-lg p-6 w-[340px] max-w-[90vw] backdrop-blur-md transition-transform duration-200 hover:scale-105 hover:cursor-pointer"
      onClick={onOpenModal}
      style={{ pointerEvents: 'auto' }}
      role="button"
      aria-label="Open full property details"
    >
      <div className="mb-4">
        <h1 className="text-xl font-bold mb-2 text-gray-900 line-clamp-2">{title_truncated}</h1>
        <div className="text-lg font-semibold text-gray-800">
          {priceFormatter(safePrice)} {currency}
        </div>
        {town && <div className="text-gray-700">{town}</div>}
      </div>

      {description && (
        <div className="mb-4">
          <p className="text-sm text-gray-800 line-clamp-3" dangerouslySetInnerHTML={{ __html: description }} />
        </div>
      )}

      <div className="flex justify-between mb-4">
        {[
          { label: minicardLabels.area, value: `${area} м²`, icon: MiniCardIcons.area},
          { label: minicardLabels.bedrooms, value: `${bedrooms}`, icon: MiniCardIcons.bedrooms},
          { label: minicardLabels.baths, value: baths, icon: MiniCardIcons.baths},
          ].map(({ icon, label, value }) =>
              value ? (
                  <FeatureMiniCard
                  key={label}
                  icon={icon}
                  label={label}
                  value={value}
                  />
              ) : null)}
      </div>

      <button
        className="absolute top-2 right-2 p-1 rounded-full hover:bg-gray-200"
        onClick={(e) => {
          e.stopPropagation();
          onCloseOverlay();
        }}
        aria-label="Close"
      >
        <svg width="20" height="20" viewBox="0 0 20 20">
          <path d="M6 6l8 8M14 6l-8 8" stroke="#333" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </button>
    </section>
  );
};

export default InfoCardOverlay;
