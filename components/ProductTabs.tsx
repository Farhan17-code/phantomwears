import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
}

interface ProductTabsProps {
  tabs: Tab[];
}

const ProductTabs: React.FC<ProductTabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <div className="space-y-8">
      <div className="flex border-b border-white/5 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative px-6 md:px-8 py-3 md:py-4 text-[10px] uppercase tracking-[0.4em] transition-colors whitespace-nowrap shrink-0 ${
              activeTab === tab.id ? 'text-white' : 'text-zinc-600 hover:text-zinc-400'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-px bg-white shadow-[0_0_10px_white]"
              />
            )}
          </button>
        ))}
      </div>

      <div className="relative min-h-[200px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="text-zinc-400 text-sm leading-relaxed font-light tracking-wide"
          >
            {tabs.find((t) => t.id === activeTab)?.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ProductTabs;
