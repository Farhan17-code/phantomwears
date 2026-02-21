import React, { useState, useEffect, useCallback } from 'react';
import { useProducts } from '../hooks/useProducts';
import { useSubcategories } from '../hooks/useSubcategories';
import { useCategories } from '../hooks/useCategories';
import { Product, Subcategory, Category } from '../types';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

const ITEMS_PER_PAGE = 9;

const Products: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'All';
  const [activeCategory, setActiveCategory] = useState(categoryParam);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeSubcategory, setActiveSubcategory] = useState<string | 'All'>('All');
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState<number>(0);
  
  const { fetchProducts } = useProducts();
  const { fetchSubcategories } = useSubcategories();
  const { fetchCategories } = useCategories();

  const load = useCallback(async (isLoadMore = false) => {
    if (isLoadMore) {
        setIsRefreshing(true);
    } else {
        setIsLoading(true);
        setPage(0);
    }

    const currentPage = isLoadMore ? page + 1 : 0;
    
    const [pResult, s, cats] = await Promise.all([
      fetchProducts({ 
        page: currentPage, 
        limit: ITEMS_PER_PAGE,
        category: activeCategory,
        subcategoryId: activeSubcategory
      }),
      fetchSubcategories(),
      fetchCategories()
    ]);

    if (isLoadMore) {
        setAllProducts(prev => [...prev, ...pResult.products]);
        setPage(currentPage);
    } else {
        setAllProducts(pResult.products);
    }
    
    setTotalCount(pResult.count || 0);
    setSubcategories(s);
    if(cats.length > 0) setCategories(cats);
    setIsLoading(false);
    setIsRefreshing(false);
  }, [fetchProducts, fetchSubcategories, fetchCategories, activeCategory, activeSubcategory, page]);

  useEffect(() => {
    load();
  }, [activeCategory, activeSubcategory]); // Reload when filters change

  useEffect(() => {
    const categoryParam = searchParams.get('category') || 'All';
    const isValidCategory = categoryParam === 'All' || categories.some(cat => cat.name === categoryParam);
    if (categoryParam !== activeCategory && isValidCategory) {
      setActiveCategory(categoryParam);
      setActiveSubcategory('All');
    }
  }, [searchParams, categories]);

  useEffect(() => {
    loadSubcategoriesOnly();
  }, [fetchSubcategories]);

  const loadSubcategoriesOnly = async () => {
    const s = await fetchSubcategories();
    setSubcategories(s);
  };

  const activeSubs = subcategories.filter(s => s.parent_category === activeCategory);

  const hasMore = allProducts.length < totalCount;

  return (
    <div className="pt-32 pb-24 px-6 max-w-7xl mx-auto">
      <header className="mb-16">
        <h1 className="font-cinzel text-4xl md:text-5xl tracking-widest text-white mb-8">The Collection</h1>

        <div className="flex flex-nowrap md:flex-wrap gap-4 border-b border-zinc-800 pb-8 overflow-x-auto scrollbar-hide no-scrollbar whitespace-nowrap">
          <button
            onClick={() => {
              setActiveCategory('All');
              setActiveSubcategory('All');
              setSearchParams({});
            }}
            className={`text-[10px] uppercase tracking-[0.3em] px-6 py-3 transition-all shrink-0 ${activeCategory === 'All'
              ? 'text-black bg-white'
              : 'text-zinc-500 hover:text-white border border-white/5'
              }`}
          >
            All
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.name);
                setActiveSubcategory('All');
                setSearchParams({ category: cat.name });
              }}
              className={`text-[10px] uppercase tracking-[0.3em] px-6 py-3 transition-all shrink-0 ${activeCategory === cat.name
                ? 'text-black bg-white'
                : 'text-zinc-500 hover:text-white border border-white/5'
                }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <AnimatePresence>
          {activeCategory !== 'All' && activeSubs.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-nowrap md:flex-wrap gap-3 mt-6 pt-6 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-hide no-scrollbar"
            >
              <button
                onClick={() => setActiveSubcategory('All')}
                className={`text-[9px] uppercase tracking-widest px-4 py-1.5 transition-all rounded-full border shrink-0 ${activeSubcategory === 'All'
                  ? 'border-white text-white bg-white/5'
                  : 'border-white/10 text-zinc-600 hover:text-zinc-400'
                  }`}
              >
                All Sects
              </button>
              {activeSubs.map(sub => (
                <button
                  key={sub.id}
                  onClick={() => setActiveSubcategory(sub.id)}
                  className={`text-[9px] uppercase tracking-widest px-4 py-1.5 transition-all rounded-full border shrink-0 ${activeSubcategory === sub.id
                    ? 'border-white text-white bg-white/5 shadow-[0_0_10px_rgba(255,255,255,0.05)]'
                    : 'border-white/10 text-zinc-600 hover:text-zinc-400'
                    }`}
                >
                  {sub.name}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-x-3 gap-y-10 md:gap-x-8 md:gap-y-16">
        {isLoading ? (
          Array.from({ length: ITEMS_PER_PAGE }).map((_, i) => (
            <ProductSkeleton key={i} />
          ))
        ) : (
          allProducts.map(product => {
            const sub = subcategories.find(s => s.id === product.subcategory_id);
            return (
              <ProductCard 
                key={product.id} 
                product={product} 
                subcategoryName={sub?.name}
              />
            );
          })
        )}
      </div>

      {!isLoading && allProducts.length > 0 && hasMore && (
        <div className="mt-20 flex justify-center">
          <button
            onClick={() => load(true)}
            disabled={isRefreshing}
            className="px-12 py-4 border border-white/10 text-[10px] uppercase tracking-[0.4em] text-zinc-400 hover:text-white hover:border-white/40 transition-all disabled:opacity-50 group btn-haptic"
          >
            {isRefreshing ? (
              <span className="flex items-center gap-2">
                <div className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                Manifesting...
              </span>
            ) : (
              <span className="group-hover:tracking-[0.6em] transition-all duration-500">Manifest More</span>
            )}
          </button>
        </div>
      )}

      {!isLoading && allProducts.length === 0 && (
        <div className="text-center py-20 flex flex-col items-center gap-4">
          <p className="text-zinc-500 font-cinzel tracking-[0.2em] uppercase">No spirits found in this realm.</p>
          <button 
            onClick={() => {
              setActiveCategory('All');
              setActiveSubcategory('All');
            }}
            className="text-[10px] uppercase tracking-widest text-white border-b border-white/20 pb-1 hover:border-white transition-all"
          >
            Clear Calibration
          </button>
        </div>
      )}
    </div>
  );
};

export default Products;
