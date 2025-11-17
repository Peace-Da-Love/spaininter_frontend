'use client';

import { FC, useState } from 'react';
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
  refCode?: string;
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
  minicardLabels,
  refCode
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Validation and fallback
  const safeTitle = title_truncated || '';
  const safePrice = Number(price) || 0;
  const safeCurrency = currency || '';
  const safeTown = town || '';
  const safeRef = refCode || '';
  const safeDescription = description || '';
  const safeFeatures = features || {};
  const safeBeds = beds || 0;
  const safeBaths = baths || 0;

  const priceNum = Number(safePrice);
  const finalPrice = Number.isFinite(priceNum) ? priceNum : 0;

  const areaRaw = safeFeatures?.['Useable Build Space'];
  const area = typeof areaRaw === 'string' ? areaRaw.split(' ')[0] : areaRaw;

  const bedroomsRaw = safeFeatures?.['Double Bedrooms'];
  const bedrooms = bedroomsRaw ? (typeof bedroomsRaw === 'string' ? bedroomsRaw.split(' ')[0] : bedroomsRaw) : safeBeds;

  const hoverScale = isHovered ? 1.05 : 1;
  const transform = `scale(calc(min(1, calc((100vh - 92px - 92px) / 200px)) * ${hoverScale}))`;

  return (
    <section
      className="fixed right-4 z-30 bg-white bg-opacity-70 rounded-xl shadow-lg p-6 w-[340px] max-w-[90vw] backdrop-blur-md transition-transform duration-200 hover:cursor-pointer"
      onClick={onOpenModal}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        pointerEvents: 'auto',
        bottom: 'max(92px, min(120px, calc(100vh - 92px - 200px)))',
        transform,
        transformOrigin: 'center'
      }}
      role="button"
      aria-label="Open full property details"
    >
      <div className="mb-4">
        <h1 className="text-xl font-bold mb-2 text-gray-900 line-clamp-2">{safeTitle}</h1>
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <div className="text-lg font-semibold text-gray-800 truncate">
              {priceFormatter(finalPrice)} {safeCurrency}
            </div>
            {safeTown && 
              <div className="text-m md:text-l text-gray-900 font-semibold truncate mt-0.5">{safeTown}</div>
            }
          </div>
          {safeRef && (
            <div className="text-xs md:text-sm text-gray-600 truncate mt-0.5">{safeRef}</div>
          )}
        </div>
      </div>

      {safeDescription && (
        <div className="mb-4">
          <p className="text-sm text-gray-800 line-clamp-3" dangerouslySetInnerHTML={{ __html: safeDescription }} />
        </div>
      )}

      <div className="flex justify-between mb-4">
        {[
          { label: minicardLabels.area, value: `${area} м²`, icon: MiniCardIcons.area},
          { label: minicardLabels.bedrooms, value: `${bedrooms}`, icon: MiniCardIcons.bedrooms},
          { label: minicardLabels.baths, value: safeBaths, icon: MiniCardIcons.baths},
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
