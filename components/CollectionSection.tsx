import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCategories } from '../hooks/useCategories';
import { Category } from '../types';

const CollectionSection: React.FC = () => {
  const { fetchCategories } = useCategories();
  const [collections, setCollections] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      const data = await fetchCategories();
      const homeCategories = data.filter(c => c.show_on_home);
      setCollections(homeCategories);
      setIsLoading(false);
    };
    loadData();
  }, [fetchCategories]);

  // Fallback image if a category has no image
  const fallbackImage = "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1000&auto=format&fit=crop";

  return (
    <section className="py-24 px-6 bg-[#030303]">
      <div className="max-w-7xl mx-auto">
        <div className="mb-20 text-center">
          <h2 className="text-zinc-600 text-[10px] tracking-[0.8em] uppercase mb-4">Discovery Protocol</h2>
          <h3 className="font-cinzel text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">ARCHIVE COLLECTIONS</h3>
          <div className="w-24 h-px bg-zinc-800 mx-auto"></div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
             <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center text-zinc-600 text-[10px] uppercase tracking-widest py-20">
             No visible archives.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            {collections.map((collection) => (
              <Link 
                key={collection.id} 
                to={`/products?category=${encodeURIComponent(collection.name)}`}
                className="group relative overflow-hidden aspect-[4/5] border border-white/5 transition-all duration-700"
              >
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent z-10 opacity-90 group-hover:opacity-40 transition-opacity duration-700"></div>
                
                {/* Image */}
                <div className="absolute inset-0 bg-zinc-900 group-hover:scale-110 transition-transform duration-[2000ms] ease-out">
                  <img 
                    src={collection.image_url || fallbackImage} 
                    alt={collection.name}
                    className="w-full h-full object-cover grayscale brightness-50 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
                  />
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center z-20 p-8 text-center opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                    <p className="text-zinc-400 text-[10px] tracking-[0.5em] uppercase mb-3">Archive Sect</p>
                    <h4 className="font-cinzel text-2xl text-white tracking-widest">{collection.name}</h4>
                    <div className="mt-6 px-8 py-3 border border-white/20 text-white text-[9px] uppercase tracking-[0.3em] font-light bg-black/50 backdrop-blur-sm hover:bg-white hover:text-black transition-colors">
                      Explore
                    </div>
                </div>

                {/* Static Label (Lower version) */}
                <div className="absolute bottom-10 left-0 right-0 text-center z-20 group-hover:opacity-0 transition-opacity duration-500">
                    <h4 className="font-cinzel text-lg text-white tracking-widest uppercase">{collection.name}</h4>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default CollectionSection;
