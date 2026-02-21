import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Tag, Percent, DollarSign, Calendar, X, Check, AlertCircle } from 'lucide-react';
import { useCoupons } from '../hooks/useCoupons';
import { Coupon } from '../types';

export const CouponManager: React.FC = () => {
    const { coupons, loading, error, addCoupon, toggleCoupon, deleteCoupon } = useCoupons();
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState<Omit<Coupon, 'id' | 'created_at'>>({
        code: '',
        discount_type: 'percentage',
        value: 0,
        is_active: true,
        expires_at: null
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const success = await addCoupon(formData);
        if (success) {
            setIsAdding(false);
            setFormData({
                code: '',
                discount_type: 'percentage',
                value: 0,
                is_active: true,
                expires_at: null
            });
        }
    };

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-cinzel font-bold tracking-widest text-white">CIPHER REPOSITORY</h2>
                    <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mt-1">Active Discount Protocols</p>
                </div>
                <button 
                    onClick={() => setIsAdding(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                >
                    <Plus size={14} /> Forge New Cipher
                </button>
            </div>

            {error && (
                <div className="p-4 bg-red-900/20 border border-red-500/50 flex items-center gap-3 text-red-400 text-xs">
                    <AlertCircle size={14} /> {error}
                </div>
            )}

            <AnimatePresence>
                {isAdding && (
                    <motion.div 
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="p-6 bg-zinc-900/50 border border-white/5 backdrop-blur-xl"
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">Cipher Code</label>
                                    <input
                                        required
                                        type="text"
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        className="w-full bg-black/40 border border-white/10 p-3 text-xs text-white outline-none focus:border-white/30 transition-all tracking-widest"
                                        placeholder="PHANTOM20"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">Protocol Type</label>
                                    <div className="flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, discount_type: 'percentage' })}
                                            className={`flex-1 py-3 border text-[10px] uppercase tracking-widest transition-all ${
                                                formData.discount_type === 'percentage' 
                                                ? 'bg-white text-black border-white' 
                                                : 'bg-transparent text-zinc-500 border-white/10 hover:border-white/30'
                                            }`}
                                        >
                                            <Percent size={12} className="inline mr-2" /> Percentage
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, discount_type: 'fixed' })}
                                            className={`flex-1 py-3 border text-[10px] uppercase tracking-widest transition-all ${
                                                formData.discount_type === 'fixed' 
                                                ? 'bg-white text-black border-white' 
                                                : 'bg-transparent text-zinc-500 border-white/10 hover:border-white/30'
                                            }`}
                                        >
                                            <DollarSign size={12} className="inline mr-2" /> Fixed Magnitude
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">Magnitude Value</label>
                                    <input
                                        required
                                        type="number"
                                        value={formData.value}
                                        onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) })}
                                        className="w-full bg-black/40 border border-white/10 p-3 text-xs text-white outline-none focus:border-white/30 transition-all"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">Expiration Manifest (Optional)</label>
                                    <input
                                        type="date"
                                        onChange={(e) => setFormData({ ...formData, expires_at: e.target.value || null })}
                                        className="w-full bg-black/40 border border-white/10 p-3 text-xs text-white outline-none focus:border-white/30 transition-all"
                                    />
                                </div>
                            </div>
                            <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                                <button
                                    type="button"
                                    onClick={() => setIsAdding(false)}
                                    className="px-6 py-2 border border-white/10 text-[10px] uppercase tracking-widest text-zinc-500 hover:text-white transition-colors"
                                >
                                    Abort Forge
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-white text-black text-[10px] font-bold uppercase tracking-widest hover:bg-zinc-200 transition-colors"
                                >
                                    Complete Forge
                                </button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    [1,2,3].map(i => (
                        <div key={i} className="h-32 bg-zinc-900/30 border border-white/5 animate-pulse" />
                    ))
                ) : coupons.map((coupon) => (
                    <motion.div
                        layout
                        key={coupon.id}
                        className={`group relative p-6 border transition-all ${
                            coupon.is_active 
                            ? 'bg-zinc-900/40 border-white/10 hover:border-white/30' 
                            : 'bg-black/40 border-white/5 opacity-60'
                        }`}
                    >
                        <div className="flex justify-between items-start mb-4">
                            <div className="bg-white/5 p-2 border border-white/10">
                                <Tag size={16} className="text-zinc-400" />
                            </div>
                            <div className="flex gap-2">
                                <button 
                                    onClick={() => toggleCoupon(coupon.id, !coupon.is_active)}
                                    className={`p-2 border transition-all ${
                                        coupon.is_active 
                                        ? 'border-green-500/30 text-green-500 hover:bg-green-500/10' 
                                        : 'border-white/10 text-zinc-500 hover:bg-white/5'
                                    }`}
                                >
                                    {coupon.is_active ? <Check size={14} /> : <X size={14} />}
                                </button>
                                <button 
                                    onClick={() => deleteCoupon(coupon.id)}
                                    className="p-2 border border-white/10 text-zinc-500 hover:border-red-500/50 hover:text-red-500 hover:bg-red-500/10 transition-all"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>

                        <h3 className="text-lg font-bold tracking-widest text-white mb-1">{coupon.code}</h3>
                        <div className="flex items-center gap-3 text-zinc-500 text-[10px] uppercase tracking-widest">
                            <span className="flex items-center gap-1 text-white">
                                {coupon.discount_type === 'percentage' ? (
                                    <><Percent size={10} /> {coupon.value}% OFF</>
                                ) : (
                                    <><DollarSign size={10} /> ৳{coupon.value} OFF</>
                                )}
                            </span>
                            {coupon.expires_at && (
                                <span className="flex items-center gap-1 border-l border-white/10 pl-3">
                                    <Calendar size={10} /> Exp: {new Date(coupon.expires_at).toLocaleDateString()}
                                </span>
                            )}
                        </div>

                        {!coupon.is_active && (
                            <div className="absolute top-2 right-14 px-2 py-0.5 border border-red-500/30 text-red-500 text-[8px] uppercase tracking-[0.3em] bg-red-500/5">
                                Burned
                            </div>
                        )}
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
