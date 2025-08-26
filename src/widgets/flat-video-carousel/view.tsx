'use client';

import { FC } from 'react';
import { VideoSwiper } from '@/src/shared/components/shared/video-swiper';

interface VideoCarouselProps {
  videos: string[];
  onClose: () => void;
}

export const VideoCarousel: FC<VideoCarouselProps> = ({ videos, onClose }) => (
  <div
    className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
    onClick={onClose}
  >
    <div
      className="relative w-full max-w-6xl mx-4 bg-white rounded-xl overflow-hidden aspect-[16/9]"
      onClick={(e) => e.stopPropagation()}
    >
      {/* CLOSE BUTTON */}
      <button
        className="absolute top-4 right-4 p-2 size-[36px] bg-white/50 rounded-full hover:bg-white/80 z-40"
        onClick={onClose}
        aria-label="Close videos"
      >
        ✕
      </button>

      <VideoSwiper videos={videos} />
    </div>
  </div>
);

export default VideoCarousel;
