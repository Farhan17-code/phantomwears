
import React from 'react';
import { motion } from 'framer-motion';

const NeuromapLoading: React.FC = () => {
  return (
    <div className="fixed inset-0 bg-[#050505] z-100 flex flex-col items-center justify-center p-6 text-white overflow-hidden">
      {/* Background Neural Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)',
          backgroundSize: '40px 40px'
        }}></div>
      </div>

      {/* Central Animated Core */}
      <div className="relative w-32 h-32 mb-12">
        <motion.div
          className="absolute inset-0 border border-white/20 rounded-full"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute inset-4 border border-white/40 rounded-full shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
            opacity: [0.6, 0.3, 0.6]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute inset-[35.5%] w-[29%] h-[29%] bg-white rounded-full shadow-[0_0_50px_rgba(255,255,255,0.5)]"
          animate={{
            scale: [0.8, 1.2, 0.8],
            boxShadow: [
              '0 0 20px rgba(255,255,255,0.3)',
              '0 0 60px rgba(255,255,255,0.8)',
              '0 0 20px rgba(255,255,255,0.3)'
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      </div>

      {/* Loading Text */}
      <div className="relative">
        <motion.p
          className="font-cinzel text-[10px] tracking-[0.8em] uppercase text-zinc-500 mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          INITIALIZING MANIFEST
        </motion.p>
        <div className="flex justify-center gap-1">
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              className="w-8 h-px bg-zinc-800 relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-white shadow-[0_0_10px_white]"
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeInOut"
                }}
              />
            </motion.div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default NeuromapLoading;
