'use client';

import { FC, useState, useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import Image from 'next/image';
import { Property } from '@/src/shared/types';
import { Navigation } from 'swiper/modules';
import { extractBeforeCR } from '@/src/shared/utils';
import Link from 'next/link';
import { FullInfoOverlay } from '@/src/widgets/flat-full-info';
import { InfoCardOverlay } from '@/src/widgets/flat-info-card';
import { MinicardLabels } from '@/src/shared/types';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/src/shared/components/ui';
import IcInfo from '@/src/app/icons/ic_info.svg';

interface PropertyDetailsPageProps {
  property: Property;
  locale: string;
  minicardLabels: MinicardLabels;
  backUrl: string;
}

export const FlatPage: FC<PropertyDetailsPageProps> = ({
  property,
  locale,
  minicardLabels,
  backUrl,
}) => {
  const { title, description, price, currency, town, features, images, beds, baths } =
    property;
  const title_truncated = extractBeforeCR(title);
  const photoUrls = images.map((imgPath) => `https://prop.spaininter.com${imgPath}`);
  const [showOverlay, setShowOverlay] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const prevRef = useRef<HTMLButtonElement>(null);
  const nextRef = useRef<HTMLButtonElement>(null);
  const swiperRef = useRef<any>(null);

  useEffect(() => {
    if (swiperRef.current && prevRef.current && nextRef.current) {
      swiperRef.current.params.navigation.prevEl = prevRef.current;
      swiperRef.current.params.navigation.nextEl = nextRef.current;
      swiperRef.current.navigation.init();
      swiperRef.current.navigation.update();
    }
  }, []);

  return (
    <>
      {/* Back button */}
      <Link href={backUrl}>
        <Button
          variant="menu"
          className="absolute top-5 right-2.5 z-20"
          aria-label="Back to catalog"
        >
          <X />
        </Button>
      </Link>
      
      {/* Full-screen carousel */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        {photoUrls.length > 0 && (
          <Swiper
            modules={[Navigation]}
            spaceBetween={0}
            slidesPerView={1}
            onBeforeInit={(swiper) => {
              swiperRef.current = swiper;
            }}
            className="w-full h-full"
          >
            {photoUrls.map((src, idx) => (
              <SwiperSlide key={idx} className="relative w-full h-full">
                <Image
                  src={src}
                  alt={`${title_truncated} image ${idx + 1}`}
                  fill
                  className="object-cover"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* Overlay controls row */}
      <div className="absolute bottom-2.5 right-2.5 justify-end z-20 flex items-center gap-2 w-[calc(100%-110px)] max-w-[calc(100%-110px)]">
        {/* Prev/Next */}
        <Button ref={prevRef} variant="menu" asChild={false}>
          <ChevronLeft />
        </Button>
        <Button ref={nextRef} variant="menu" asChild={false}>
          <ChevronRight />
        </Button>

        {/* Info control */}
        <Button
          variant="menu"
          onClick={() => setShowOverlay((prev) => !prev)}
          aria-label="Show property info"
        >
          <IcInfo className="size-[32px]" />
        </Button>
      </div>

      {/* Info Card Overlay */}
      {showOverlay && (
        <InfoCardOverlay
          title_truncated={title_truncated}
          price={price}
          currency={currency}
          town={town}
          description={description}
          features={features}
          beds={beds}
          baths={baths}
          onOpenModal={() => {
            setShowOverlay(false);
            setShowModal(true);
          }}
          onCloseOverlay={() => {
            setShowOverlay(false);
          }}
          minicardLabels={minicardLabels}
        />
      )}

      {/* Property Details */}
      {showModal && (
        <FullInfoOverlay
          property={property}
          locale={locale}
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setShowOverlay(true);
          }}
          minicardLabels={minicardLabels}
        />
      )}
    </>
  );
};
