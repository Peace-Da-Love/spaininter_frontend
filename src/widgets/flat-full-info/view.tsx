'use client';

import { FC,  useState, useRef } from 'react';
import { MinicardLabels, Property } from '@/src/shared/types';
import 'swiper/css';
import 'swiper/css/navigation';
import { extractBeforeCR } from '@/src/shared/utils';
import { extractAfterCR } from '@/src/shared/utils';
import { FeatureMiniCard } from '@/src/shared/components/shared/flat-feature-minicard';
import { MiniCardIcons } from '@/src/shared/components/shared/flat-feature-minicard';

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

    const {
        title,
        town,
        features,
        baths,
        pool,
        location
    } = property;

    const title_truncated = extractBeforeCR(title);
    const description = extractAfterCR(title);
    
    const videos = [
        'https://www.youtube.com/embed/Ux3eXyXCMrY',
        'https://www.youtube.com/embed/kHXH7fDmpyA',
        'https://www.youtube.com/embed/imPheZ3aNgo',
    ];
    
    const mapEmbedUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}&hl=${locale}&z=15&output=embed`;
    return (
        <>
        {/* Dark Background */}
        <div
            className="fixed inset-0 bg-black bg-opacity-40 backdrop-blur-sm z-40 flex items-center justify-center"
            onClick={onClose}
            />

            {/* Overlay Content */}
            <div className="fixed z-50 bg-white bg-opacity-80 shadow-xl overflow-hidden backdrop-blur-md
                w-full h-full inset-0
                sm:relative sm:inset-auto sm:rounded-xl sm:max-w-6xl sm:h-auto sm:mx-auto sm:my-10">
                {/* Close Button */}
                <div onClick={onClose}>
                    <button
                        className="absolute top-4 right-4 bg-white size-[36px] bg-opacity-50 p-2 rounded-full hover:bg-opacity-75"
                        aria-label="Close"
                    >
                        ✕
                    </button>
                </div>

                <div className="p-6 sm:p-10 space-y-6 overflow-auto h-full sm:h-auto rounded-xl">
                    {/* Title and general info */}
                    <div>
                        <h1 className="text-3xl font-bold mb-2">{title_truncated}</h1>
                        <div className="flex items-center space-x-4">
                            <span className="text-gray-600 text-lg">{town}</span>
                        </div>
                    </div>
                    
                    {/* Minicard Row */}
                    <div className="flex gap-4 overflow-x-auto flex-nowrap -mx-2 px-2 sm:mx-0 sm:px-0">
                        {[
                        { label: minicardLabels.area, value: `${features['Useable Build Space'].split(' ')[0]} м²`, icon: MiniCardIcons.area},
                        { label: minicardLabels.bedrooms, value: `${features['Double Bedrooms'].split(' ')[0]}`, icon: MiniCardIcons.bedrooms},
                        { label: minicardLabels.baths, value: baths, icon: MiniCardIcons.baths},
                        { label: minicardLabels.beach, value: `${features['Beach'].split(' ')[0]} м²`, icon: MiniCardIcons.beach},
                        { label: minicardLabels.pool, value: pool, icon: MiniCardIcons.pool},
                        { label: minicardLabels.gym, value: features['Gym'], icon: MiniCardIcons.gym},
                        { label: minicardLabels.parking, value: features['Parking - Space'], icon: MiniCardIcons.parking}
                        ].map(({ icon, label, value }) =>
                            value ? (
                                <div key={label} className="flex w-28 flex-col items-center rounded-xl border-2 border-black p-4 text-center">
                                    <FeatureMiniCard
                                    icon={icon}
                                    label={label}
                                    value={value}
                                    />
                                </div>
                            ) : null)}
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
        </>
    );
    };