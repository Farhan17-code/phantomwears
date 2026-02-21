import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronRight, Clock, CheckCircle2, XCircle, ShoppingBag, ExternalLink } from 'lucide-react';
import { useUserOrders } from '../hooks/useUserOrders';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const OrderHistory: React.FC = () => {
    const { user } = useAuth();
    const { orders, loading, fetchOrders } = useUserOrders();

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed': return 'text-emerald-400 bg-emerald-400/10 border-emerald-500/20';
            case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-500/20';
            default: return 'text-amber-400 bg-amber-400/10 border-amber-500/20';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed': return <CheckCircle2 size={12} />;
            case 'cancelled': return <XCircle size={12} />;
            default: return <Clock size={12} />;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#050505] pt-40 px-6 flex flex-col items-center justify-center space-y-4">
                <div className="w-12 h-12 border-2 border-white/5 border-t-white rounded-full animate-spin" />
                <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-500 animate-pulse">Consulting the Archive...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-40 px-6 sm:px-10 lg:px-16 overflow-hidden relative">
            {/* Background Decor */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
                <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-0 right-0 w-[30%] h-[30%] bg-purple-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-4xl mx-auto relative z-10">
                {/* Header */}
                <div className="mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6"
                    >
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 text-zinc-500">
                                <ShoppingBag size={14} />
                                <span className="text-[10px] uppercase tracking-[0.5em]">Cosmic Manifests // Order History</span>
                            </div>
                            <h1 className="font-cinzel text-4xl sm:text-5xl font-bold tracking-widest text-transparent bg-clip-text bg-linear-to-r from-white via-zinc-400 to-zinc-600">
                                YOUR ECHOES
                            </h1>
                            <p className="text-zinc-500 text-xs italic tracking-widest font-light uppercase">Trace your successful extractions</p>
                        </div>

                        <div className="px-5 py-2 bg-white/5 border border-white/10 text-[9px] uppercase tracking-[0.3em] text-zinc-400 rounded-full backdrop-blur-sm">
                            {orders.length} Manifested Orders
                        </div>
                    </motion.div>
                </div>

                {/* Orders List */}
                <div className="space-y-8">
                    {orders.length > 0 ? (
                        orders.map((order, idx) => (
                            <motion.div
                                key={order.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: idx * 0.1 }}
                                className="group bg-white/5 border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-500 hover:bg-white/[0.07]"
                            >
                                {/* Order Top Bar */}
                                <div className="p-4 sm:p-6 border-b border-white/5 flex flex-wrap justify-between items-center gap-4 bg-white/2 backdrop-blur-sm">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white/5 border border-white/5 rounded-sm">
                                            <Package size={20} className="text-white" />
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Manifest ID</p>
                                            <p className="text-xs font-mono text-white">#{order.id.split('-')[0].toUpperCase()}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-4 sm:gap-8">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Date</p>
                                            <p className="text-xs text-zinc-300">{new Date(order.created_at).toLocaleDateString('en-GB')}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-widest text-zinc-500 mb-1">Magnitude</p>
                                            <p className="text-xs text-white font-bold">৳ {order.total.toLocaleString()}</p>
                                        </div>
                                        <div className={`flex items-center gap-2 px-3 py-1.5 border rounded-full text-[9px] uppercase tracking-widest font-bold ${getStatusColor(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            {order.status}
                                        </div>
                                    </div>
                                </div>

                                {/* Items Area */}
                                <div className="p-4 sm:p-6 space-y-4">
                                    {order.order_items.map((item) => (
                                        <div key={item.id} className="flex items-center gap-6 group/item">
                                            <div className="w-16 h-16 bg-zinc-900 border border-white/5 overflow-hidden shrink-0 relative">
                                                <img 
                                                    src={item.product?.image_url} 
                                                    alt={item.product?.name} 
                                                    className="w-full h-full object-cover grayscale opacity-50 group-hover/item:grayscale-0 group-hover/item:opacity-100 transition-all duration-700"
                                                />
                                                <div className="absolute top-0 right-0 p-1 bg-black/80 text-[8px] font-bold text-white px-1.5">
                                                    x{item.quantity}
                                                </div>
                                            </div>
                                            <div className="grow min-w-0">
                                                <h4 className="text-sm font-cinzel font-bold text-white tracking-widest uppercase truncate mb-1">
                                                    {item.product?.name}
                                                </h4>
                                                <div className="flex items-center gap-3 text-[10px] uppercase tracking-widest text-zinc-500">
                                                    <span>{item.color}</span>
                                                    <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                                                    <span>{item.size}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-white tracking-wider">৳ {item.price_at_time.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Footer Action */}
                                <div className="px-6 py-3 bg-black/20 border-t border-white/5 flex justify-end">
                                    <button className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-[9px] uppercase tracking-widest group/link">
                                        View Details <ExternalLink size={10} className="group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                                    </button>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-32 text-center bg-white/2 border border-dashed border-white/10 backdrop-blur-sm"
                        >
                            <div className="w-20 h-20 mx-auto mb-6 bg-white/5 border border-white/10 rounded-full flex items-center justify-center">
                                <ShoppingBag className="text-zinc-700" size={32} />
                            </div>
                            <h3 className="text-zinc-400 font-cinzel tracking-[0.4em] mb-4 uppercase">No Extractions Found</h3>
                            <p className="text-zinc-600 text-[10px] uppercase tracking-widest mb-8">Your cosmic history is currently unwritten</p>
                            <Link 
                                to="/products"
                                className="inline-block px-10 py-4 bg-white text-black text-[10px] uppercase tracking-[0.4em] font-bold hover:bg-zinc-200 transition-all"
                            >
                                Manifest Something
                            </Link>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;
