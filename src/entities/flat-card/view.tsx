'use client';

import { FC } from 'react';
import { ImageLoader } from './ui/image-loader';
import { priceFormatter, tonPriceFormatter } from '@/src/shared/utils';
import IcBed from '@/src/app/icons/ic_bed.svg';
import IcTon from '@/src/app/icons/ic-ton.svg';
import { Property } from '@/src/shared/types';

type FlatCardProps = Pick<
  Property,
  'title' | 'price' | 'beds' | 'features' | 'images' | 'price_ton'
>;

export const FlatCard: FC<FlatCardProps> = (props) => {
  const relativePath = props.images?.[0] || '';
  const photoUrl = relativePath
    ? `https://prop.spaininter.com${relativePath}`
    : '';

  const title = props.title?.includes('&#13')
    ? props.title.split('&#13')[0]
    : props.title || '';

  return (
    <div className="bg-card rounded-3xl w-full max-w-3xl">
      {/* MOBILE */}
      <div className="flex sm:hidden">
        {/* Image */}
        <div className="relative w-[120px] h-[100px] flex-shrink-0">
          <ImageLoader
            className="rounded-l-3xl object-cover"
            imageUrl={photoUrl}
            alt={title}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-between py-2.5 px-3 flex-1">
          <div className="inline-block text-sm font-bold text-primary line-clamp-2">
            {title}
          </div>
          <div className="flex justify-between items-center mt-2">
              <span className="text-lg font-bold text-[#EA5E20] capitalize">
                {props.price_ton ? (
                  <span className="inline-flex items-center gap-2">
                    <span>{tonPriceFormatter(props.price_ton)}</span>
                    <IcTon className="w-4 h-4" aria-label="TON" role="img" />
                  </span>
                ) : (
                  priceFormatter(props.price)
                )}
              </span>
            <div className="flex gap-3 items-center text-secondary text-sm">
              <span className="inline-flex items-center gap-1">
                <IcBed />
                <i className="not-italic">{props.beds}</i>
              </span>
              <span>
                {props.features['Useable Build Space']?.split(' ')[0]} м²
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* DESKTOP */}
      <div className="hidden sm:block">
        {/* Image */}
        <div className="relative w-full">
          <div className="block pt-[55%]">
            <ImageLoader
              className="rounded-t-3xl object-cover"
              imageUrl={photoUrl}
              alt={title}
            />
          </div>
        </div>
        {/* Content */}
        <div className="py-2.5 px-5">
          <div className="inline-block text-base text-[#222222] mb-2.5 line-clamp-2 h-[48px]">
            {title}
          </div>
          <div className="w-full border border-[#607698] my-2.5 opacity-30"></div>
          <div className="flex justify-between items-center">
            <span className="text-xl font-bold text-[#EA5E20] capitalize">
              {props.price_ton ? (
                <span className="inline-flex items-center gap-2">
                  <span>{tonPriceFormatter(props.price_ton)}</span>
                  <IcTon className="w-4 h-4" aria-label="TON" role="img" />
                </span>
              ) : (
                priceFormatter(props.price)
              )}
            </span>
            <div className="flex gap-4 items-center text-secondary">
              <span className="inline-flex items-center gap-1 text-base">
                <IcBed />
                <i className="not-italic">{props.beds}</i>
              </span>
              <span className="text-base">
                {props.features['Useable Build Space']?.split(' ')[0]} м²
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
