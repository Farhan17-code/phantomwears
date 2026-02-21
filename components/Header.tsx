
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import { ShoppingBag, History, LogOut, ChevronDown, User, ShieldCheck, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';



const Header: React.FC<{ soundOn: boolean; setSoundOn: (v: boolean) => void }> = ({ soundOn, setSoundOn }) => {
  const { totalItems, openCart } = useCart();
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const location = useLocation();
  const [isAccountOpen, setIsAccountOpen] = React.useState(false);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Collections', path: '/products' },
    { name: 'The Story', path: '/story' },
  ];

  if (isAdmin) {
    navItems.push({ name: 'Admin', path: '/admin' });
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-black/50 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center justify-between gap-2 md:gap-0">
        <Link to="/" className="flex items-center gap-2 md:gap-3 group shrink-0">
          <div className="w-8 h-8 md:w-10 md:h-10 flex items-center justify-center relative">
            <svg viewBox="0 0 100 100" className="w-full h-full text-white fill-current animate-pulse group-hover:rotate-180 transition-transform duration-1000">
              <path d="M50 15L15 50L50 85L85 50L50 15ZM50 25L75 50L50 75L25 50L50 25Z" />
              <circle cx="50" cy="50" r="8" className="animate-ping opacity-50" />
              <circle cx="50" cy="50" r="4" />
            </svg>
          </div>
          <span className="font-cinzel text-xs md:text-xl tracking-[0.15em] md:tracking-[0.3em] font-bold whitespace-nowrap">PHANTOM</span>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-[10px] uppercase tracking-[0.3em] transition-all hover:text-white hover:tracking-[0.4em] ${location.pathname === item.path ? 'text-white font-bold border-b border-white pb-1' : 'text-zinc-500'
                }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 md:gap-6 shrink-0">
          {isAuthenticated ? (
            <div className="relative">
              <button
                onClick={() => setIsAccountOpen(!isAccountOpen)}
                className="flex items-center gap-3 px-3 py-2 hover:bg-white/5 transition-all text-zinc-400 hover:text-white group border border-transparent hover:border-white/10"
              >
                <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
                  <User size={14} />
                </div>
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium hidden lg:block">
                  {user?.name?.split(' ')[0] || 'Operative'}
                </span>
                <ChevronDown 
                  size={12} 
                  className={`transition-transform duration-300 ${isAccountOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              <AnimatePresence>
                {isAccountOpen && (
                  <>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="fixed inset-0 z-[-1]"
                      onClick={() => setIsAccountOpen(false)}
                    />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                      className="absolute right-0 mt-2 w-64 bg-[#0a0a0a] border border-white/10 shadow-2xl backdrop-blur-xl p-2 z-50"
                    >
                      <div className="px-4 py-3 border-b border-white/5 mb-2">
                        <p className="text-[8px] uppercase tracking-[0.3em] text-zinc-500 mb-1">User Manifest</p>
                        <p className="text-[10px] text-white font-bold tracking-tight truncate">{user?.email}</p>
                        {isAdmin && (
                          <div className="flex items-center gap-1.5 mt-2 text-emerald-400">
                            <ShieldCheck size={10} />
                            <span className="text-[8px] uppercase tracking-[0.2em]">Authorized Admin</span>
                          </div>
                        )}
                      </div>

                      <div className="space-y-1">
                        <Link
                          to="/orders"
                          onClick={() => setIsAccountOpen(false)}
                          className={`flex items-center gap-3 w-full px-4 py-3 text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-white/5 ${
                            location.pathname === '/orders' ? 'text-white bg-white/5' : 'text-zinc-400'
                          }`}
                        >
                          <History size={14} /> My Manifests
                        </Link>

                        <Link
                          to="/wishlist"
                          onClick={() => setIsAccountOpen(false)}
                          className={`flex items-center gap-3 w-full px-4 py-3 text-[10px] uppercase tracking-[0.2em] transition-all hover:bg-white/5 ${
                            location.pathname === '/wishlist' ? 'text-white bg-white/5' : 'text-zinc-400'
                          }`}
                        >
                          <Heart size={14} /> Neural Curation
                        </Link>

                        {isAdmin && (
                          <Link
                            to="/admin"
                            onClick={() => setIsAccountOpen(false)}
                            className="flex items-center gap-3 w-full px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-zinc-400 hover:text-white transition-all hover:bg-white/5"
                          >
                            <ShieldCheck size={14} /> Admin Archive
                          </Link>
                        )}

                        <div className="pt-2 mt-2 border-t border-white/5">
                          <button
                            onClick={() => {
                              logout();
                              setIsAccountOpen(false);
                            }}
                            className="flex items-center gap-3 w-full px-4 py-3 text-[10px] uppercase tracking-[0.2em] text-red-400 hover:text-red-500 transition-all hover:bg-red-500/5"
                          >
                            <LogOut size={14} /> Terminate Session
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link
              to="/signup"
              className="px-3 md:px-6 py-1.5 md:py-2 bg-white text-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] md:tracking-[0.3em] hover:bg-zinc-200 transition-all duration-300 font-bold whitespace-nowrap shrink-0"
            >
              Sign Up
            </Link>
          )}

          <div className="h-6 w-px bg-white/10 hidden sm:block" />

          <button onClick={openCart} className="relative group p-1">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-400 group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 bg-white text-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
