import React, { useState } from 'react';

import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useCart } from '../context/CartContext';

const ProductCard: React.FC<{ 
  product: Product; 
  subcategoryName?: string;
}> = ({ product, subcategoryName }) => {
  const { addToCart } = useCart();
  const [isHovered, setIsHovered] = useState(false);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);

    // Flying Bird Animation Logic
    const bird = document.createElement('div');
    bird.className = 'fixed pointer-events-none z-[100] transition-all duration-1000 ease-in-out';
    bird.innerHTML = `
      <svg viewBox="0 0 24 24" width="24" height="24" fill="white">
        <path d="M21 5l-1.4 1.4L18.2 5 13 10.2l-3.2-3.2L3 13.8l1.4 1.4L13 6.6l3.2 3.2L22.4 3.6 21 5zM3 17.2l1.4 1.4 6.8-6.8 3.2 3.2L21 8.8l-1.4-1.4-6.6 6.6-3.2-3.2L3 17.2z" />
      </svg>
    `;

    const rect = (e.target as HTMLElement).getBoundingClientRect();
    bird.style.left = `${rect.left}px`;
    bird.style.top = `${rect.top}px`;
    bird.style.opacity = '1';
    bird.style.transform = 'scale(1.5)';

    document.body.appendChild(bird);

    // Target position (header cart icon roughly)
    setTimeout(() => {
      bird.style.left = `${window.innerWidth - 80}px`;
      bird.style.top = `30px`;
      bird.style.opacity = '0';
      bird.style.transform = 'scale(0.1) rotate(45deg)';
    }, 50);

    setTimeout(() => {
      document.body.removeChild(bird);
    }, 1100);
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-3/4 overflow-hidden bg-zinc-900 border border-white/5 relative">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
            loading="lazy"
          />

          {/* Desktop Hover / Mobile Action */}
          <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 translate-y-0 md:translate-y-full md:group-hover:translate-y-0 transition-transform duration-300 flex flex-col gap-2 bg-linear-to-t from-black/80 to-transparent">
             <button
                onClick={handleAdd}
                className="w-full py-2 md:py-3 bg-white text-black text-[9px] md:text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors shadow-lg"
                type="button"
              >
                Add to Manifest
              </button>
          </div>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex justify-between items-start">
            <div className="min-w-0 grow">
              <h3 className="text-sm font-cinzel tracking-wider text-zinc-200 group-hover:text-white transition-colors truncate">{product.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <p className="text-[10px] text-zinc-600 uppercase tracking-widest">{product.category}</p>
                {subcategoryName && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-zinc-800" />
                    <p className="text-[10px] text-zinc-500 uppercase tracking-widest font-bold">{subcategoryName}</p>
                  </>
                )}
              </div>
            </div>
            <span className="text-sm font-light text-zinc-400 ml-4 shrink-0">৳ {product.price.toLocaleString()}</span>
          </div>

          {/* Color Swatches */}
          {product.variants && product.variants.length > 0 && (
            <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
              {product.variants.map((v, i) => (
                <div 
                  key={i} 
                  className="w-4 h-4 rounded-full border border-white/10 overflow-hidden shrink-0"
                  title={v.color_name}
                >
                  <img src={v.thumbnail_url} className="w-full h-full object-cover" alt={v.color_name} />
                </div>
              ))}
            </div>
          )}
        </div>
      </Link>
    </div>
  );
};


export default ProductCard;
