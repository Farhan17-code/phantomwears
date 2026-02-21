import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useWishlist } from '../hooks/useWishlist';
import ProductCard from '../components/ProductCard';
import { Heart, Ghost, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Loading from '../components/Loading';

const Wishlist: React.FC = () => {
  const { wishlistProducts, loading, fetchWishlistProducts } = useWishlist();
  const navigate = useNavigate();

  useEffect(() => {
    fetchWishlistProducts();
  }, []);

  if (loading) return <Loading />;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-32 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-20 space-y-4">
          <nav className="flex items-center gap-2 text-[9px] uppercase tracking-[0.4em] text-zinc-600 mb-8">
            <span className="hover:text-white cursor-pointer" onClick={() => navigate('/')}>Home</span>
            <ChevronRight size={10} />
            <span className="text-zinc-400">Neural Curation</span>
          </nav>
          
          <div className="flex items-end gap-6 border-b border-white/5 pb-10">
            <div className="p-4 bg-white/5 border border-white/10 rounded-full">
              <Heart size={24} className="text-white fill-white animate-pulse" />
            </div>
            <div>
              <p className="text-[10px] tracking-[0.6em] uppercase text-zinc-500 mb-2">Manifest Sanctuary</p>
              <h1 className="text-4xl md:text-5xl font-cinzel font-bold tracking-[0.2em]">NEURAL CURATION</h1>
            </div>
          </div>
        </header>

        {wishlistProducts.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-40 text-center space-y-8"
          >
            <div className="relative">
              <Ghost size={80} className="text-zinc-800 animate-bounce" />
              <div className="absolute inset-0 bg-white/5 blur-3xl rounded-full" />
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-cinzel tracking-widest text-zinc-400">THE VOID IS EMPTY</h2>
              <p className="text-[10px] uppercase tracking-[0.3em] text-zinc-600 max-w-xs mx-auto">No manifestations have been archived in your neural network yet.</p>
            </div>
            <button 
              onClick={() => navigate('/products')}
              className="px-12 py-4 bg-white text-black text-[10px] uppercase tracking-[0.5em] font-bold hover:bg-zinc-200 transition-all active:scale-95"
            >
              Begin Manifestation
            </button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-16">
            {wishlistProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
