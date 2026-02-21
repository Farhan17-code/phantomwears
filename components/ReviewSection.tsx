
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Filter, MessageSquare, ThumbsUp, Camera } from 'lucide-react';
import { Review } from '../types';

interface ReviewSectionProps {
  productId: string;
  reviews: Review[];
  onMarkHelpful: (id: string) => void;
}

const ReviewSection: React.FC<ReviewSectionProps> = ({ productId, reviews, onMarkHelpful }) => {
  const [filter, setFilter] = useState<number | 'all'>('all');
  const [showAll, setShowAll] = useState(false);

  const filteredReviews = reviews.filter(r => filter === 'all' || r.rating === filter);
  const displayReviews = showAll ? filteredReviews : filteredReviews.slice(0, 5);

  const averageRating = reviews.length > 0 
    ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
    : 0;

  const fitAverage = reviews.length > 0
    ? reviews.reduce((acc, r) => acc + r.fit, 0) / reviews.length
    : 50;

  const getFitLabel = (value: number) => {
    if (value < 40) return "Runs Small";
    if (value > 60) return "Runs Large";
    return "Natural";
  };

  return (
    <div className="space-y-8 md:space-y-12">
      {/* Reviews Summary Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 py-6 md:py-10 border-y border-white/5">
        <div className="space-y-2 text-center md:text-left">
          <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-500">Average Rating</p>
          <div className="flex items-center justify-center md:justify-start gap-4">
            <span className="text-5xl font-cinzel font-bold">{averageRating.toFixed(1)}</span>
            <div className="space-y-1">
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className={i < Math.round(averageRating) ? "fill-white text-white" : "text-zinc-800"} />
                ))}
              </div>
              <p className="text-[9px] text-zinc-600 uppercase tracking-widest">{reviews.length} Reviews</p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <p className="text-[10px] tracking-[0.4em] uppercase text-zinc-500 text-center md:text-left">Actual Fit</p>
          <div className="space-y-2">
            <div className="relative h-1 bg-zinc-900 overflow-hidden">
              <motion.div 
                className="absolute top-0 bottom-0 bg-white"
                initial={{ width: 0 }}
                animate={{ width: `${fitAverage}%` }}
                transition={{ duration: 1 }}
              />
              <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-black/50 z-10" />
            </div>
            <div className="relative mt-2 h-3 uppercase tracking-wider text-zinc-600 text-[8px]">
              <span className="absolute left-0">Runs Tight</span>
              <span className="absolute left-1/2 -translate-x-1/2 text-white">Natural</span>
              <span className="absolute right-0">Runs Large</span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-center md:justify-end gap-3">
          <div className="flex -space-x-3 overflow-hidden">
            {reviews.filter(r => r.photo_url).slice(0, 4).map((r, i) => (
              <div key={i} className="w-10 h-10 border-2 border-black rounded-full overflow-hidden bg-zinc-900">
                <img src={r.photo_url} alt="Review" className="w-full h-full object-cover" />
              </div>
            ))}
            {reviews.filter(r => r.photo_url).length > 4 && (
              <div className="w-10 h-10 border-2 border-black rounded-full bg-zinc-800 flex items-center justify-center text-[10px] text-zinc-400">
                +{reviews.filter(r => r.photo_url).length - 4}
              </div>
            )}
          </div>
          <p className="text-[9px] uppercase tracking-widest text-zinc-500">Customer Gallery</p>
        </div>
      </div>

      {/* Filtering */}
      <div className="flex flex-wrap items-center gap-4 py-4 border-b border-white/5">
        <Filter size={14} className="text-zinc-500" />
        <span className="text-[10px] uppercase tracking-widest text-zinc-500 mr-2">Filter By:</span>
        <div className="flex flex-wrap gap-2">
          {['all', 5, 4, 3, 2, 1].map((val) => (
            <button
              key={val}
              onClick={() => setFilter(val as any)}
              className={`px-3 py-1.5 text-[9px] uppercase tracking-widest border transition-all ${
                filter === val ? 'bg-white text-black border-white' : 'bg-transparent text-zinc-500 border-zinc-800 hover:border-zinc-400'
              }`}
            >
              {val === 'all' ? 'All' : `${val} Stars`}
            </button>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-8">
        <AnimatePresence>
          {displayReviews.map((review, idx) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group py-6 md:py-8 border-b border-white/5 flex flex-col md:flex-row gap-6 md:gap-8"
            >
              {/* Reviewer Details */}
              <div className="w-full md:w-48 shrink-0 space-y-4">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold uppercase tracking-widest">{review.nickname}</p>
                  {review.is_verified && (
                    <p className="text-[8px] text-emerald-500 uppercase tracking-widest flex items-center gap-1">
                      <span className="w-1 h-1 bg-emerald-500 rounded-full" /> Verified Purchase
                    </p>
                  )}
                </div>
                
                <div className="space-y-2 text-[9px] text-zinc-500 uppercase tracking-widest font-mono">
                  {review.height && <p>Height: {review.height}</p>}
                  {review.weight && <p>Weight: {review.weight}</p>}
                  <p>Size: {review.size_ordered}</p>
                </div>
              </div>

              {/* Review Content */}
              <div className="grow space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={10} className={i < review.rating ? "fill-white text-white" : "text-zinc-800"} />
                    ))}
                  </div>
                  <span className="text-[9px] text-zinc-600 font-mono italic">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-cinzel font-bold tracking-widest uppercase">{review.title}</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed font-light">{review.content}</p>
                </div>

                {review.photo_url && (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    className="w-32 aspect-square rounded overflow-hidden border border-white/10 mt-4 h-full"
                  >
                    <img src={review.photo_url} alt="User upload" className="w-full h-full object-cover" />
                  </motion.div>
                )}

                <div className="pt-4 flex items-center justify-between">
                  <div className="flex items-center gap-6 text-[9px] uppercase tracking-widest text-zinc-500">
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-500">Alignment:</span>
                      <span className="text-white bg-zinc-900 px-2 py-0.5 border border-white/5">
                        {100 - Math.abs(review.fit - 50) * 2}% ({getFitLabel(review.fit)})
                      </span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => onMarkHelpful(review.id)}
                    className="flex items-center gap-2 text-[9px] uppercase tracking-widest text-zinc-600 hover:text-white transition-colors"
                  >
                    <ThumbsUp size={12} />
                    Helpful ({review.helpful_count})
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredReviews.length > 5 && (
          <div className="pt-8 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="px-8 py-3 bg-white text-black text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-zinc-200 transition-all font-mono"
            >
              {showAll ? 'Collapse Reviews' : 'See More Reviews'}
            </button>
          </div>
        )}

        {filteredReviews.length === 0 && (
          <div className="py-20 text-center border border-dashed border-white/5 rounded">
            <p className="text-zinc-600 text-[10px] uppercase tracking-[0.4em]">No reviews match your filter parameters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
