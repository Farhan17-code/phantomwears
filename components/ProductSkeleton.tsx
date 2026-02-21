import React from 'react';

const ProductSkeleton: React.FC = () => {
    return (
        <div className="group relative animate-pulse">
            <div className="aspect-3/4 overflow-hidden bg-zinc-900/50 border border-white/5 relative animate-shimmer">
                <div className="w-full h-full bg-zinc-800/40" />
            </div>

            <div className="mt-4 space-y-3">
                <div className="flex justify-between items-start">
                    <div className="grow space-y-2">
                        <div className="h-4 bg-zinc-800/60 rounded w-3/4" />
                        <div className="flex items-center gap-2">
                            <div className="h-3 bg-zinc-800/40 rounded w-16" />
                            <span className="w-1 h-1 rounded-full bg-zinc-800" />
                            <div className="h-3 bg-zinc-800/40 rounded w-20" />
                        </div>
                    </div>
                    <div className="h-4 bg-zinc-800/60 rounded w-12 ml-4" />
                </div>
            </div>
        </div>
    );
};

export default ProductSkeleton;
