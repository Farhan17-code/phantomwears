import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const CartDrawer: React.FC = () => {
    const { cart, isCartOpen, closeCart, updateQuantity, removeFromCart, totalPrice } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const drawerRef = useRef<HTMLDivElement>(null);

    // Close on escape key
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') closeCart();
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [closeCart]);

    useEffect(() => {
        if (isCartOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isCartOpen]);

    const handleCheckout = () => {
        closeCart();
        if (isAuthenticated) {
            navigate('/checkout');
        } else {
            navigate('/signup');
        }
    };

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-500 ${isCartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={closeCart}
            />

            {/* Drawer */}
            <div
                ref={drawerRef}
                className={`fixed top-0 right-0 h-full w-full sm:w-[500px] bg-[#050505] border-l border-white/5 z-[70] transform transition-transform duration-500 ease-out flex flex-col ${isCartOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                {/* Header */}
                <div className="p-8 pb-4 flex items-center justify-between">
                    <h2 className="font-cinzel text-2xl tracking-[0.2em] text-white">YOUR VAULT</h2>
                    <button
                        onClick={closeCart}
                        className="p-2 text-zinc-500 hover:text-white transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-grow overflow-y-auto px-8 py-4 custom-scrollbar">
                    {cart.length === 0 ? (
                        <div className="h-full flex flex-col items-center justify-center space-y-4 opacity-40">
                            <p className="font-cinzel text-sm tracking-[0.3em]">THE VOID IS EMPTY</p>
                            <button
                                onClick={() => { closeCart(); navigate('/products'); }}
                                className="text-[10px] uppercase tracking-widest border-b border-white pb-1"
                            >
                                Seek Spirits
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {cart.map((item) => (
                                <div key={item.cartItemId} className="flex gap-6 group">
                                    <div className="w-24 h-32 bg-zinc-900 border border-white/5 overflow-hidden flex-shrink-0">
                                        <img src={item.image_url} alt={item.name} className="w-full h-full object-cover grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500" />
                                    </div>
                                    <div className="flex-grow flex flex-col justify-between py-1">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="font-cinzel text-sm tracking-widest text-white mb-1">{item.name.toUpperCase()}</h3>
                                                <div className="flex gap-2 items-center mb-1">
                                                    <p className="text-[9px] text-zinc-600 uppercase tracking-widest">{item.category}</p>
                                                    <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
                                                    <p className="text-[9px] text-zinc-400 uppercase tracking-widest">{item.selectedColor}</p>
                                                    <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
                                                    <p className="text-[9px] text-white uppercase tracking-widest">{item.selectedSize}</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeFromCart(item.cartItemId)}
                                                className="text-zinc-700 hover:text-red-900 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            </button>
                                        </div>
                                        <div className="flex justify-between items-end">
                                            <div className="flex items-center border border-zinc-800 bg-black/50 overflow-hidden">
                                                <button
                                                    onClick={() => updateQuantity(item.cartItemId, -1)}
                                                    className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all"
                                                >-</button>
                                                <span className="w-8 text-center text-[10px] font-bold tracking-widest">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.cartItemId, 1)}
                                                    className="w-8 h-8 flex items-center justify-center text-zinc-500 hover:text-white hover:bg-zinc-900 transition-all"
                                                >+</button>
                                            </div>
                                            <span className="text-zinc-400 text-xs tracking-widest">${(item.price * item.quantity).toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-8 border-t border-zinc-900 bg-black/40 space-y-6">
                    <div className="flex justify-between items-end">
                        <span className="text-[10px] uppercase tracking-[0.3em] text-zinc-600">Total Commitment</span>
                        <span className="font-cinzel text-xl text-white tracking-widest">${totalPrice.toFixed(2)}</span>
                    </div>

                    <button
                        onClick={handleCheckout}
                        disabled={cart.length === 0}
                        className="w-full py-5 bg-white text-black font-bold text-[10px] uppercase tracking-[0.5em] hover:bg-zinc-200 transition-all disabled:opacity-20 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                        <span className="relative z-10">{isAuthenticated ? 'PROCEED TO RITUAL' : 'INITIATE ACCESS'}</span>
                        <div className="absolute inset-0 bg-zinc-300 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                    </button>

                    <div className="text-center">
                        <p className="text-[8px] uppercase tracking-[0.4em] text-zinc-700">
                            Secure Transfer via Shadow Protocol
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default CartDrawer;
