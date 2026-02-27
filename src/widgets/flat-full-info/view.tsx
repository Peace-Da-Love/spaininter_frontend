'use client';

import { FC,  useState, useRef, useEffect } from 'react';
import { MinicardLabels, Property } from '@/src/shared/types';
import 'swiper/css';
import 'swiper/css/navigation';
import { extractBeforeCR } from '@/src/shared/utils';
import { extractAfterCR } from '@/src/shared/utils';
import { FeatureMiniCard } from '@/src/shared/components/shared/flat-feature-minicard';
import { MiniCardIcons } from '@/src/shared/components/shared/flat-feature-minicard';
import { X } from 'lucide-react';
import { Button } from '@/src/shared/components/ui';


interface Props {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  locale: string;
  minicardLabels: MinicardLabels
}

export const FullInfoOverlay: FC<Props> = ({
    property,
    isOpen,
    onClose,
    locale,
    minicardLabels
    }) => {
    const [showFullDescription, setShowFullDescription] = useState(false);

    if (!isOpen) return null;

    // Validation and fallback
    const safeTitle = property?.title || '';
    const safeTown = property?.town || '';
    const safeLocation = property?.location || { latitude: '0', longitude: '0' };
    const safeLocale = locale || 'en';

    const title_truncated = extractBeforeCR(safeTitle);
    const description = extractAfterCR(safeTitle);
    
    
    const mapEmbedUrl = `https://www.google.com/maps?q=${safeLocation.latitude},${safeLocation.longitude}&hl=${safeLocale}&z=15&output=embed`;
    return (
        <>
            <div className="fixed inset-0 z-40 h-[100dvh] w-full overflow-auto">
                {/* Dark Background */}
                <div
                className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-0"
                onClick={onClose}
                />

                {/* Overlay Content */}
                <div className="relative z-10 bg-white shadow-xl w-full overflow-y-auto 
                    inset-0
                    sm:relative sm:inset-auto sm:rounded-xl sm:max-w-6xl sm:mx-auto sm:my-10">
                    {/* Close Button */}
                    <Button onClick={onClose}
                        variant="menu"
                        className="absolute top-5 right-2.5 z-20"
                        aria-label="Back to catalog"
                        >
                        <X />
                    </Button>
                    

                    <div className="p-6 sm:p-10 space-y-6 overflow-auto rounded-xl">
                        {/* Title and general info */}
                        <div>
                            <h1 className="sm:text-3xl text-2xl font-bold mb-2 mr-14 ">{title_truncated}</h1>
                            <div className="flex items-center space-x-4">
                                <span className="text-gray-600 text-lg">{safeTown}</span>
                            </div>
                        </div>
                        
                        {/* Minicard Row */}
                        <div className="flex gap-4 overflow-x-auto flex-nowrap -mx-2 px-2 sm:mx-0 sm:px-0">
                        {[
                            MiniCardIcons.area,
                            MiniCardIcons.bedrooms,
                            MiniCardIcons.baths,
                            MiniCardIcons.beach,
                            MiniCardIcons.pool,
                            MiniCardIcons.gym,
                            MiniCardIcons.parking
                        ].map((icon, idx) => (
                            <div
                            key={idx}
                            className="flex w-16 h-16 items-center justify-center rounded-xl border-2 border-black p-4"
                            >
                            <FeatureMiniCard icon={icon} label="" value={true} />
                            </div>
                        ))}
                        </div>


                        {/* Description */}
                        <div>
                            <div className="relative">
                                <div
                                    className={`transition-max-height duration-300 overflow-hidden ${showFullDescription ? 'max-h-none' : 'max-h-[180px]'}`}
                                >
                                    <p className="text-base">
                                        <span dangerouslySetInnerHTML={{ __html: description }} />
                                    </p>
                                </div>
                                {description && (
                                    <button
                                        className="mt-2 text-blue-600 hover:underline"
                                        onClick={() => setShowFullDescription((prev) => !prev)}
                                    >
                                        {showFullDescription ? minicardLabels.hide : minicardLabels.showMore}
                                    </button>
                                )}
                            </div>
                        </div>

                        {/* Video and Map */}
                        <div>
                                <iframe
                                src={mapEmbedUrl}
                                className="w-full h-64 md:h-96 rounded-xl"
                                loading="lazy"
                                />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};