
import React from 'react';
import { BRAND_STORY } from '../constants';

const Story: React.FC = () => {
  return (
    <div className="pt-32 pb-24 px-6 max-w-4xl mx-auto min-h-screen">
      <div className="animate-in fade-in slide-in-from-bottom-10 duration-1000">
        <h2 className="text-zinc-500 text-xs tracking-[0.4em] uppercase mb-4">The Manifest</h2>
        <h1 className="font-cinzel text-5xl md:text-7xl text-white mb-12">Beyond The Veil</h1>
        
        <div className="space-y-12 text-zinc-400 text-lg md:text-xl leading-relaxed font-light">
          <p>
            Phantom Wears was established in the quiet of midnight. It started as a rejection of the loud, 
            the neon, and the disposable. We sought to create garments that absorbed light rather than reflected it.
          </p>
          
          <div className="aspect-video bg-zinc-900 border border-white/5 overflow-hidden">
             <img src="https://picsum.photos/seed/story/1200/800" alt="Process" className="w-full h-full object-cover grayscale opacity-50" />
          </div>

          <p>
            {BRAND_STORY}
          </p>

          <p>
            Our materials are sourced from across the globe, focusing on technical performance and 
            sustainable silhouettes. Each piece is limited, numbered, and infused with the silence 
            of the void.
          </p>
        </div>

        <div className="mt-20 pt-10 border-t border-zinc-900">
          <h3 className="font-cinzel text-xl text-zinc-300 mb-4">Values</h3>
          <ul className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <li className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-zinc-600">01. Silence</span>
              <p className="text-sm text-zinc-500">Design that speaks without shouting.</p>
            </li>
            <li className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-zinc-600">02. Persistence</span>
              <p className="text-sm text-zinc-500">Built for the long walk through the shadows.</p>
            </li>
            <li className="space-y-2">
              <span className="text-xs uppercase tracking-widest text-zinc-600">03. Mystery</span>
              <p className="text-sm text-zinc-500">Leaving room for the unseen.</p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Story;
