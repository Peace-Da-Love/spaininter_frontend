'use client';

import { FC, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import Image from 'next/image';
import { Property } from '@/src/shared/types';
import { Logo } from '@/src/shared/components/shared/logo';
import { extractBeforeCR, priceFormatter } from '@/src/shared/utils';
import { MinicardLabels } from '@/src/shared/types';
import { FeatureMiniCard } from '@/src/shared/components/shared/flat-feature-minicard';
import { MiniCardIcons } from '@/src/shared/components/shared/flat-feature-minicard';
import { $fetchCP } from '@/src/app/client-api';

interface AdvPageProps {
  properties: Property[];
  locale: string;
  minicardLabels: MinicardLabels;
}

// Custom Info Card component for slides with absolute positioning
const SlideInfoCard: FC<{
  title_truncated: string;
  price: string | number | undefined;
  currency?: string;
  town?: string;
  description?: string;
  features?: Record<string, any>;
  beds?: number | string;
  baths?: number | string;
  onOpenModal: () => void;
  minicardLabels: MinicardLabels;
}> = ({
  title_truncated,
  price,
  currency,
  town,
  description,
  features,
  beds,
  baths,
  onOpenModal,
  minicardLabels
}) => {
  const [isHovered, setIsHovered] = useState(false);

  // Validation and fallback
  const safeTitle = title_truncated || '';
  const safePrice = Number(price) || 0;
  const safeCurrency = currency || '';
  const safeTown = town || '';
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
      className="absolute right-4 z-30 bg-white bg-opacity-70 rounded-xl shadow-lg p-6 w-[340px] max-w-[90vw] backdrop-blur-md transition-transform duration-200 hover:cursor-pointer"
      onClick={onOpenModal}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        pointerEvents: 'auto',
        bottom: '20px',
        transform,
        transformOrigin: 'center'
      }}
      role="button"
      aria-label="Open full property details"
    >
      <div className="mb-4">
        <h1 className="text-xl font-bold mb-2 text-gray-900 line-clamp-2">{safeTitle}</h1>
        <div className="text-lg font-semibold text-gray-800">
          {priceFormatter(finalPrice)} {safeCurrency}
        </div>
        {safeTown && <div className="text-gray-700">{safeTown}</div>}
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
    </section>
  );
};

export const AdvPage: FC<AdvPageProps> = ({ properties, locale, minicardLabels }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [currentX, setCurrentX] = useState(0);
  const [isAutoPlayPaused, setIsAutoPlayPaused] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const autoPlayTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  // All properties state - starts with server-loaded properties, expands as more pages load
  const [allProperties, setAllProperties] = useState<Property[]>(properties);
  const [currentPage, setCurrentPage] = useState(2); // Start from page 2 since page 1 is loaded on server
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMorePages, setHasMorePages] = useState(true);

  // Filter properties that have images
  const propertiesWithImages = useMemo(() => 
    allProperties.filter((prop) => prop.images && prop.images.length > 0),
    [allProperties]
  );

  // No need to reset index - it's already initialized to 0
  // Server props don't change after initial load, and we don't want to reset
  // when adding client-side properties to avoid jumping back to start

  // Gradually load more pages in the background
  const loadNextPage = useCallback(async () => {
    if (!hasMorePages || isLoadingMore) return;
    
    setIsLoadingMore(true);
    try {
      const qs = new URLSearchParams();
      qs.set('page', String(currentPage));
      
      const url = `properties?${qs.toString()}`;
      const response = await $fetchCP(url, {
        headers: {
          'Accept-Language': locale,
        },
      });

      if (!response.ok) {
        setHasMorePages(false);
        return;
      }

      const data = (await response.json()) as Property[];
      
      if (!data || data.length === 0) {
        setHasMorePages(false);
        return;
      }
      
      // Filter out duplicates by _id before adding
      setAllProperties(prev => {
        const existingIds = new Set(prev.map(p => p._id));
        const newProperties = data.filter(p => !existingIds.has(p._id));
        return [...prev, ...newProperties];
      });
      
      // If we got less than 12 items, we've reached the end
      if (data.length < 12) {
        setHasMorePages(false);
      } else {
        setCurrentPage(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error loading next page:', error);
      setHasMorePages(false);
    } finally {
      setIsLoadingMore(false);
    }
  }, [currentPage, hasMorePages, isLoadingMore, locale]);

  // Start loading next pages progressively after initial render
  useEffect(() => {
    if (!hasMorePages || isLoadingMore) return;
    
    // Load pages progressively: first page after 1 second, then every 2 seconds
    const loadPagesProgressively = async () => {
      let pageToLoad = 2;
      while (hasMorePages && pageToLoad <= 10) { // Load up to 10 pages initially
        await new Promise(resolve => setTimeout(resolve, pageToLoad === 2 ? 1000 : 2000));
        if (!hasMorePages || isLoadingMore) break;
        
        try {
          const qs = new URLSearchParams();
          qs.set('page', String(pageToLoad));
          
          const url = `properties?${qs.toString()}`;
          const response = await $fetchCP(url, {
            headers: {
              'Accept-Language': locale,
            },
          });

          if (!response.ok) {
            setHasMorePages(false);
            break;
          }

          const data = (await response.json()) as Property[];
          
          if (!data || data.length === 0) {
            setHasMorePages(false);
            break;
          }
          
          // Filter out duplicates by _id before adding
          setAllProperties(prev => {
            const existingIds = new Set(prev.map(p => p._id));
            const newProperties = data.filter(p => !existingIds.has(p._id));
            return [...prev, ...newProperties];
          });
          
          // If we got less than 12 items, we've reached the end
          if (data.length < 12) {
            setHasMorePages(false);
            break;
          }
          
          pageToLoad++;
          setCurrentPage(pageToLoad);
        } catch (error) {
          console.error('Error loading page:', error);
          setHasMorePages(false);
          break;
        }
      }
    };

    loadPagesProgressively();
  }, []); // Only run once on mount

  // Continue loading more pages as user approaches the end
  useEffect(() => {
    if (!hasMorePages || isLoadingMore) return;
    
    // Load next page when we're getting close to the end
    // Trigger when we're within 15 items of the end
    const remainingItems = propertiesWithImages.length - currentIndex;
    if (remainingItems <= 15) {
      loadNextPage();
    }
  }, [currentIndex, propertiesWithImages.length, hasMorePages, isLoadingMore, loadNextPage]);

  // Preload images for next slides (client-side only)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const preloadCount = 3; // Preload next 3 slides
    for (let i = 1; i <= preloadCount; i++) {
      const nextIndex = (currentIndex + i) % propertiesWithImages.length;
      const prevIndex = (currentIndex - i + propertiesWithImages.length) % propertiesWithImages.length;
      
      const nextProperty = propertiesWithImages[nextIndex];
      const prevProperty = propertiesWithImages[prevIndex];
      
      if (nextProperty?.images?.[0]) {
        const img = document.createElement('img');
        img.src = `https://prop.spaininter.com${nextProperty.images[0]}`;
      }
      
      if (prevProperty?.images?.[0]) {
        const img = document.createElement('img');
        img.src = `https://prop.spaininter.com${prevProperty.images[0]}`;
      }
    }
  }, [currentIndex, propertiesWithImages]);

  // Auto-scroll every 5 seconds (infinite loop) - paused when user interacts
  useEffect(() => {
    if (propertiesWithImages.length === 0 || isAutoPlayPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % propertiesWithImages.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [propertiesWithImages.length, isAutoPlayPaused]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (autoPlayTimeoutRef.current) {
        clearTimeout(autoPlayTimeoutRef.current);
      }
    };
  }, []);

  // Resume autoplay after user interaction stops
  const pauseAutoPlay = () => {
    setIsAutoPlayPaused(true);
    if (autoPlayTimeoutRef.current) {
      clearTimeout(autoPlayTimeoutRef.current);
    }
    autoPlayTimeoutRef.current = setTimeout(() => {
      setIsAutoPlayPaused(false);
    }, 7000); // Resume after 7 seconds of no interaction
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % propertiesWithImages.length);
    pauseAutoPlay();
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + propertiesWithImages.length) % propertiesWithImages.length);
    pauseAutoPlay();
  };

  // Touch/Mouse handlers for swiping
  const handleStart = (clientX: number, target: EventTarget | null): boolean => {
    // Don't start dragging if clicking on interactive elements
    const targetElement = target as HTMLElement;
    if (targetElement?.closest('button, a, [role="button"]')) {
      return false;
    }
    
    setIsDragging(true);
    setStartX(clientX);
    setCurrentX(clientX);
    pauseAutoPlay();
    return true;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging) return;
    setCurrentX(clientX);
  };

  const handleEnd = () => {
    if (!isDragging) return;
    
    const diff = startX - currentX;
    const threshold = 50; // Minimum swipe distance

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        // Swiped left - go to next
        goToNext();
      } else {
        // Swiped right - go to previous
        goToPrev();
      }
    }

    setIsDragging(false);
    setStartX(0);
    setCurrentX(0);
  };

  // Touch event handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    handleStart(e.touches[0].clientX, e.target);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    e.preventDefault(); // Prevent scrolling
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    // Check if it was a click (not a swipe)
    if (!isDragging || Math.abs(startX - currentX) < 10) {
      setIsDragging(false);
      setStartX(0);
      setCurrentX(0);
      return;
    }
    handleEnd();
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (handleStart(e.clientX, e.target)) {
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    if (!isDragging) return;
    // Check if it was a click (not a drag)
    if (Math.abs(startX - currentX) < 10) {
      setIsDragging(false);
      setStartX(0);
      setCurrentX(0);
      return;
    }
    handleEnd();
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      handleEnd();
    }
  };

  if (propertiesWithImages.length === 0) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black">
        <div className="text-white">No properties available</div>
      </div>
    );
  }

  const handleOpenModal = (property: Property) => {
    // Navigate to property detail page with return URL
    const slug = property.slug || property._id;
    const fromPath = `/${locale}/adv`;
    const encodedFrom = encodeURIComponent(fromPath);
    window.location.href = `/${locale}/property-catalog/flat/${slug}?from=${encodedFrom}`;
  };

  const handleCloseOverlay = () => {
    // Just close overlay - nothing to do
  };

  // Calculate transform for horizontal slide
  // Invert the direction: when dragging left (startX > currentX), we want to show next slide (more negative)
  const dragOffset = isDragging ? ((currentX - startX) / (containerRef.current?.offsetWidth || 1)) * 100 : 0;
  const translateX = `calc(-${currentIndex * 100}% + ${dragOffset}%)`;

  // Optimize rendering: only render visible slide and adjacent ones for better performance
  // Increased window to preload images before they're shown
  const renderWindow = 5; // Render current ± 5 slides for better preloading
  const visibleIndices = useMemo(() => {
    const indices = new Set<number>();
    for (let i = Math.max(0, currentIndex - renderWindow); i <= Math.min(propertiesWithImages.length - 1, currentIndex + renderWindow); i++) {
      indices.add(i);
    }
    return indices;
  }, [currentIndex, propertiesWithImages.length, renderWindow]);

  return (
    <div 
      className="fixed inset-0 z-0 overflow-hidden bg-black"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ userSelect: 'none', cursor: isDragging ? 'grabbing' : 'grab' }}
    >
      {/* Logo in upper left corner */}
      <div className="absolute top-5 left-5 z-30">
        <Logo />
      </div>

      {/* Horizontal scrolling container for images */}
      <div
        ref={containerRef}
        className="flex h-full transition-transform duration-1000 ease-in-out"
        style={{ 
          transform: `translateX(${translateX})`,
          transition: isDragging ? 'none' : 'transform 0.5s ease-out'
        }}
      >
        {propertiesWithImages.map((property, index) => {
          // Only render visible slides for performance
          if (!visibleIndices.has(index)) {
            return (
              <div
                key={`${property._id}-${index}`}
                className="relative flex-shrink-0 w-full h-full"
                aria-hidden="true"
              />
            );
          }

          const relativePath = property.images?.[0] || '';
          const photoUrl = relativePath
            ? `https://prop.spaininter.com${relativePath}`
            : '';
          const title_truncated = extractBeforeCR(property.title || '');

          return (
            <div
              key={`${property._id}-${index}`}
              className="relative flex-shrink-0 w-full h-full"
            >
              {/* Full-screen image */}
              {photoUrl && (
                <div className="relative w-full h-full">
                  <Image
                    src={photoUrl}
                    alt={title_truncated || 'Property'}
                    fill
                    className="object-cover"
                    {...(index === 0 || index === currentIndex || Math.abs(index - currentIndex) <= 2
                      ? { priority: true }
                      : { loading: 'lazy' }
                    )}
                  />
                </div>
              )}

              {/* Info Card Overlay - attached to each slide */}
              <SlideInfoCard
                title_truncated={title_truncated}
                price={property.price}
                currency={property.currency}
                town={property.town}
                description={property.description}
                features={property.features}
                beds={property.beds}
                baths={property.baths}
                onOpenModal={() => handleOpenModal(property)}
                minicardLabels={minicardLabels}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};

