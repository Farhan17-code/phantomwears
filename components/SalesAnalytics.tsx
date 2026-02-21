import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, ShoppingBag, Clock, DollarSign, Package, User, ChevronRight } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';

export const SalesAnalytics: React.FC = () => {
    const { orders, stats, loading, updateOrderStatus } = useOrders();

    const formatCurrency = (val: number) => `৳${Number(val).toLocaleString()}`;

    return (
        <div className="space-y-12">
            <div>
                <h2 className="text-2xl font-cinzel font-bold tracking-widest text-white">RITUAL ANALYSIS</h2>
                <p className="text-zinc-500 text-[10px] uppercase tracking-[0.3em] mt-1">Global Financial Extraction Manifest</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                    { label: 'Total Extraction', value: formatCurrency(stats.totalRevenue), icon: TrendingUp, color: 'text-zinc-100' },
                    { label: 'Item Flow', value: stats.totalItemsSold, icon: ShoppingBag, color: 'text-zinc-100' },
                    { label: 'Manifest Count', value: stats.totalOrders, icon: Package, color: 'text-zinc-100' },
                    { label: 'Pending Rituals', value: stats.activeOrders, icon: Clock, color: 'text-zinc-100' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="p-6 bg-zinc-900/30 border border-white/5 relative overflow-hidden group"
                    >
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <stat.icon size={48} />
                        </div>
                        <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 mb-2 block">{stat.label}</label>
                        <div className={`text-2xl font-bold tracking-widest ${stat.color}`}>{stat.value}</div>
                    </motion.div>
                ))}
            </div>

            {/* Orders Table-like View */}
            <div className="space-y-6">
                <div className="flex justify-between items-end">
                    <h3 className="text-[10px] uppercase tracking-[0.5em] text-zinc-400">Recent Extraction Manifests</h3>
                    <div className="h-px bg-white/10 grow mx-8 mb-1.5" />
                </div>

                <div className="space-y-4">
                    {loading ? (
                        [1,2,3].map(i => <div key={i} className="h-20 bg-zinc-900/30 border border-white/5 animate-pulse" />)
                    ) : orders.map((order) => (
                        <div key={order.id} className="group p-4 bg-zinc-900/20 border border-white/5 hover:border-white/20 transition-all">
                            <div className="flex flex-wrap items-center justify-between gap-6">
                                <div className="flex items-center gap-6">
                                    <div className="w-10 h-10 border border-white/10 bg-zinc-900 flex items-center justify-center text-zinc-500">
                                        <Package size={16} />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-bold text-white tracking-widest uppercase truncate max-w-[120px]">
                                            Order #{order.id.slice(0, 8)}
                                        </div>
                                        <div className="text-[9px] text-zinc-500 uppercase mt-1">
                                            {new Date(order.created_at).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-12">
                                    <div className="hidden md:block">
                                        <label className="text-[8px] uppercase tracking-[0.2em] text-zinc-600 mb-1 block">Magnitude</label>
                                        <div className="text-xs font-bold text-white tracking-widest">{formatCurrency(order.total)}</div>
                                    </div>

                                    <div>
                                        <label className="text-[8px] uppercase tracking-[0.2em] text-zinc-600 mb-1 block">Status</label>
                                        <select 
                                            value={order.status}
                                            onChange={(e) => updateOrderStatus(order.id, e.target.value as any)}
                                            className={`bg-transparent text-[10px] uppercase tracking-widest font-bold border-none outline-none cursor-pointer ${
                                                order.status === 'completed' ? 'text-green-500' : 
                                                order.status === 'cancelled' ? 'text-red-500' : 'text-zinc-100'
                                            }`}
                                        >
                                            <option value="pending" className="bg-zinc-900">Pending</option>
                                            <option value="completed" className="bg-zinc-900">Completed</option>
                                            <option value="cancelled" className="bg-zinc-900">Cancelled</option>
                                        </select>
                                    </div>

                                    <button className="p-2 text-zinc-600 hover:text-white transition-colors">
                                        <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
