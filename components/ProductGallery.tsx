
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react';

interface ProductGalleryProps {
  images: string[];
  activeVariantIndex: number;
  scarcityStatus?: string;
}

const ProductGallery: React.FC<ProductGalleryProps> = ({ images, activeVariantIndex, scarcityStatus }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Sync active index when images change (e.g., color change)
  useEffect(() => {
    setActiveIndex(0);
  }, [images]);

  const nextImage = () => setActiveIndex((prev) => (prev + 1) % images.length);
  const prevImage = () => setActiveIndex((prev) => (prev - 1 + images.length) % images.length);

  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const newIndex = Math.round(scrollLeft / clientWidth);
      if (newIndex !== activeIndex && newIndex >= 0 && newIndex < images.length) {
        setActiveIndex(newIndex);
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Mobile Scroll View */}
      <div className="md:hidden relative aspect-3/4 bg-zinc-900 border border-white/5">
        <div 
            ref={scrollContainerRef}
            onScroll={handleScroll}
            className="flex w-full h-full overflow-x-auto snap-x snap-mandatory no-scrollbar"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
            {images.map((img, i) => (
                <div key={i} className="w-full h-full shrink-0 snap-center">
                    <img src={img} alt={`Product view ${i + 1}`} className="w-full h-full object-cover" />
                </div>
            ))}
        </div>

        {/* Mobile Scarcity Badge */}
        {scarcityStatus && (
          <div className="absolute top-4 right-4 z-10">
            <div className="px-3 py-1 bg-white text-black text-[8px] font-bold uppercase tracking-[0.2em] shadow-lg">
              {scarcityStatus}
            </div>
          </div>
        )}

        {/* Mobile Dots Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-2 bg-black/30 backdrop-blur-sm rounded-full border border-white/5">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-1 transition-all duration-300 rounded-full ${
                i === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Main Image Container */}
      <div className="hidden md:block relative aspect-3/4 bg-zinc-900 group overflow-hidden border border-white/5">
        <AnimatePresence mode="wait">
          <motion.img
            key={images[activeIndex] + activeIndex}
            src={images[activeIndex]}
            alt={`Product view ${activeIndex + 1}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="w-full h-full object-cover"
          />
        </AnimatePresence>

        {/* Scarcity Badge */}
        {scarcityStatus && (
          <div className="absolute top-6 right-6 z-10">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="px-4 py-1.5 bg-white text-black text-[9px] font-bold uppercase tracking-[0.3em] shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            >
              {scarcityStatus}
            </motion.div>
          </div>
        )}

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        <button className="absolute bottom-6 right-6 w-10 h-10 flex items-center justify-center bg-black/50 backdrop-blur-md border border-white/10 opacity-0 group-hover:opacity-100 transition-all hover:bg-white hover:text-black">
          <Maximize2 size={16} />
        </button>

        {/* Gallery Indicator Bar */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 px-3 py-2 bg-black/30 backdrop-blur-sm rounded-full border border-white/5">
          {images.map((_, i) => (
            <div
              key={i}
              className={`h-1 transition-all duration-300 rounded-full ${
                i === activeIndex ? 'w-6 bg-white' : 'w-1.5 bg-white/20'
              }`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails (Desktop Only) */}
      {images.length > 1 && (
        <div className="hidden md:grid grid-cols-5 gap-3">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative aspect-3/4 overflow-hidden border transition-all duration-300 ${
                i === activeIndex ? 'border-white ring-1 ring-white/20' : 'border-transparent opacity-60 hover:opacity-100'
              }`}
            >
              <img src={img} alt={`Thumbnail ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
