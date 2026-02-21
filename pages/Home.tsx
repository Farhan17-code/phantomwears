import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { Product } from '../types';
import ProductCard from '../components/ProductCard';
import CollectionSection from '../components/CollectionSection';

const Home: React.FC = () => {
  const { fetchProducts } = useProducts();
  const [eliteProducts, setEliteProducts] = useState<Product[]>([]);

  useEffect(() => {
    const loadElite = async () => {
      const { products: allProducts } = await fetchProducts();
      const elite = allProducts.filter((p: Product) => p.category === 'Phantom Elite').slice(0, 6);
      setEliteProducts(elite);
    };
    loadElite();
  }, [fetchProducts]);

  return (
    <div className="relative pt-20">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative">
        <div className="z-10 animate-in fade-in zoom-in duration-1000">
          <h2 className="text-zinc-500 text-[10px] tracking-[0.6em] uppercase mb-6">Equinox '26 Manifest</h2>
          <h1 className="font-cinzel text-6xl md:text-9xl font-bold tracking-tighter mb-8 bg-gradient-to-b from-white via-zinc-400 to-zinc-800 bg-clip-text text-transparent">
            PHANTOM WEARS
          </h1>
          <p className="max-w-xl mx-auto text-zinc-500 text-xs md:text-sm tracking-[0.1em] leading-relaxed mb-12 font-light uppercase">
            Designed for the silent ones. Engineered to absorb light and attention.
          </p>
          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <Link to="/products" className="px-12 py-5 border border-white/10 hover:border-white text-white text-[10px] uppercase tracking-[0.4em] transition-all hover:bg-white hover:text-black">
              Access Collections
            </Link>
            <Link to="/story" className="px-12 py-5 bg-zinc-900/50 backdrop-blur-sm border border-transparent hover:border-zinc-700 text-zinc-500 text-[10px] uppercase tracking-[0.4em] hover:text-white transition-all">
              The Protocol
            </Link>
          </div>
        </div>

        {/* Background Atmosphere */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] md:w-[800px] md:h-[800px] bg-white/5 blur-[150px] rounded-full pointer-events-none -z-10 animate-pulse"></div>
      </section>

      {/* Collection Section */}
      <CollectionSection />

      {/* Featured Section */}
      <section className="py-32 px-6 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-baseline mb-16 gap-4">
          <div>
            <h2 className="font-cinzel text-4xl tracking-widest text-white">Elite Protocols</h2>
            <p className="text-zinc-600 text-[10px] uppercase tracking-[0.3em] mt-2 italic">Reserved for the Vanguard.</p>
          </div>
          <Link to="/products" className="text-zinc-500 hover:text-white text-[10px] uppercase tracking-[0.3em] border-b border-zinc-900 hover:border-white pb-2 transition-all">
            View All Spirits
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-12">
          {eliteProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Philosophy Section */}
      <section className="py-40 bg-[#030303] border-y border-white/5 text-center px-6 overflow-hidden relative">
        <div className="max-w-4xl mx-auto relative z-10">
          <h3 className="text-zinc-700 text-[10px] tracking-[0.8em] uppercase mb-12">The Silent Creed</h3>
          <p className="font-cinzel text-3xl md:text-5xl italic text-zinc-400 mb-10 leading-tight">
            "We do not seek to be remembered. We seek to be irreproachable."
          </p>
          <div className="w-20 h-px bg-zinc-800 mx-auto"></div>
        </div>
        <div className="absolute top-0 right-0 opacity-5 pointer-events-none">
          <svg width="400" height="400" viewBox="0 0 100 100" fill="white">
            <path d="M0 50 L50 0 L100 50 L50 100 Z" />
          </svg>
        </div>
      </section>
    </div>
  );
};

export default Home;
