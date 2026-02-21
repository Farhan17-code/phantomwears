import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, LogOut, Package, Database, Shield, LayoutGrid, List } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { useSubcategories } from '../hooks/useSubcategories';
import { Product, Subcategory } from '../types';
import ProductForm from '../components/ProductForm';
import { CouponManager } from '../components/CouponManager';
import { CategoryManager } from '../components/CategoryManager';
import { SalesAnalytics } from '../components/SalesAnalytics';
import { TrendingUp, Tag, Layers, BookOpen } from 'lucide-react';
import { SubcategoryManager } from '../components/SubcategoryManager';

const AdminDashboard: React.FC = () => {
    const { user, logout } = useAuth();
    const { fetchProducts, deleteProduct } = useProducts();
    const { fetchSubcategories } = useSubcategories();
    const [products, setProducts] = useState<Product[]>([]);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
    const [activeTab, setActiveTab] = useState<'manifests' | 'archives' | 'rituals' | 'ciphers' | 'lineage'>('manifests');

    const loadData = async () => {
        setIsLoading(true);
        const [prodData, subData] = await Promise.all([
            fetchProducts(),
            fetchSubcategories()
        ]);
        setProducts(prodData.products);
        setSubcategories(subData);
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleDelete = async (id: string) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await deleteProduct(id);
                if (editingProduct?.id === id) setEditingProduct(null);
                await loadData();
            } catch (error: any) {
                console.error("ADMIN: Delete failed with error:", error);
                alert(`Delete failed: ${error.message || "Unknown error"}`);
            }
        }
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleFormSuccess = () => {
        setEditingProduct(null);
        loadData();
    };

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 pb-40 px-6 sm:px-10 lg:px-16">
            <div className="max-w-[1600px] mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="space-y-2"
                    >
                        <div className="flex items-center gap-3 text-zinc-500 mb-2">
                            <Shield size={14} className="text-zinc-500" />
                            <span className="text-[10px] uppercase tracking-[0.5em]">Command Center // Established</span>
                        </div>
                        <h1 className="font-cinzel text-5xl font-bold tracking-widest text-transparent bg-clip-text bg-linear-to-r from-white via-zinc-400 to-zinc-600">
                            ADMIN ARCHIVE
                        </h1>
                        <p className="text-zinc-500 text-xs italic tracking-widest pl-1 font-light uppercase">Welcome, Operative {user?.name}</p>
                    </motion.div>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="flex items-center gap-1 bg-white/5 p-1 border border-white/5 flex-wrap">
                            {[
                                { id: 'manifests', label: 'Manifests', icon: Database },
                                { id: 'archives', label: 'Archives', icon: BookOpen },
                                { id: 'lineage', label: 'Lineage', icon: Layers },
                                { id: 'rituals', label: 'Rituals', icon: TrendingUp },
                                { id: 'ciphers', label: 'Ciphers', icon: Tag },
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`px-6 py-3 text-[10px] uppercase tracking-[0.2em] transition-all flex items-center gap-2 ${
                                        activeTab === tab.id 
                                        ? 'bg-white text-black font-bold' 
                                        : 'text-zinc-500 hover:text-white hover:bg-white/5'
                                    }`}
                                >
                                    <tab.icon size={12} />
                                    {tab.label}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={logout}
                            className="flex items-center gap-2 px-6 py-3 border border-zinc-800 hover:border-white/20 hover:bg-white/5 transition-all text-[10px] uppercase tracking-[0.3em] text-zinc-400 hover:text-white"
                        >
                            <LogOut size={12} /> Terminate Session
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'manifests' && (
                        <motion.div 
                            key="manifests"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="grid grid-cols-1 xl:grid-cols-12 gap-16 items-start"
                        >
                            {/* Left: Product Form (5/12 cols) */}
                            <div className="xl:col-span-5 sticky top-32">
                                <ProductForm 
                                    onSuccess={handleFormSuccess} 
                                    initialProduct={editingProduct} 
                                    onCancel={() => setEditingProduct(null)}
                                />
                            </div>

                            {/* Right: Product List (7/12 cols) */}
                            <div className="xl:col-span-7 space-y-10">
                                <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pb-6 border-b border-white/5">
                                    <div className="flex items-center gap-6">
                                        <div className="flex items-center gap-2">
                                            <Database size={16} className="text-zinc-600" />
                                            <h2 className="text-xl font-cinzel tracking-widest text-white">MANIFESTED SPIRITS</h2>
                                        </div>
                                        <div className="px-3 py-1 bg-white/5 border border-white/10 text-[9px] uppercase tracking-widest text-zinc-400 rounded-full">
                                            {products.length} Units
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg border border-white/10">
                                        <button 
                                            onClick={() => setViewMode('list')}
                                            className={`p-2 rounded transition-all ${viewMode === 'list' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                                        >
                                            <List size={16} />
                                        </button>
                                        <button 
                                            onClick={() => setViewMode('grid')}
                                            className={`p-2 rounded transition-all ${viewMode === 'grid' ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300'}`}
                                        >
                                            <LayoutGrid size={16} />
                                        </button>
                                    </div>
                                </div>

                                {isLoading ? (
                                    <div className="h-64 flex flex-col items-center justify-center space-y-4">
                                        <div className="w-12 h-12 border-2 border-white/10 border-t-white rounded-full animate-spin" />
                                        <p className="text-[10px] uppercase tracking-[0.4em] text-zinc-600 animate-pulse">Syncing Archive...</p>
                                    </div>
                                ) : (
                                    <div className={viewMode === 'grid' ? "grid grid-cols-1 sm:grid-cols-2 gap-6" : "space-y-4"}>
                                        {products.map((product, idx) => (
                                            <motion.div
                                                key={product.id}
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                                className={`group relative overflow-hidden bg-white/5 border border-white/10 p-4 transition-all hover:border-white/30 hover:bg-white/[0.07] ${viewMode === 'list' ? 'flex items-center gap-8' : 'flex flex-col gap-6'}`}
                                            >
                                                <div className={`${viewMode === 'list' ? 'w-24 h-24' : 'w-full aspect-video'} bg-zinc-900 overflow-hidden shrink-0 border border-white/5`}>
                                                    <img 
                                                        src={product.image_url} 
                                                        alt={product.name} 
                                                        className="w-full h-full object-cover grayscale opacity-50 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                                                    />
                                                </div>

                                                <div className="flex-grow min-w-0 space-y-2">
                                                    <div className="flex items-center gap-2 text-zinc-500 text-[8px] uppercase tracking-widest">
                                                        <span>{product.category}</span>
                                                        {product.subcategory_id && (
                                                            <>
                                                                <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                                                                <span className="text-zinc-300">
                                                                    {subcategories.find(s => s.id === product.subcategory_id)?.name || 'Sect'}
                                                                </span>
                                                            </>
                                                        )}
                                                        <span className="w-1 h-1 bg-zinc-800 rounded-full" />
                                                        <span>ID: {product.id.split('-')[0]}</span>
                                                    </div>
                                                    <h3 className="text-sm font-cinzel font-bold text-white tracking-widest truncate uppercase">
                                                        {product.name}
                                                    </h3>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-xs text-zinc-400 tracking-wider">৳ {product.price.toLocaleString()}</span>
                                                        <div className="flex items-center gap-1.5">
                                                            <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                                                            <span className="text-[9px] text-zinc-500 uppercase tracking-widest">In Void</span>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(product)}
                                                        className="p-3 bg-white/5 border border-white/5 hover:border-white/20 hover:bg-white/10 text-white transition-all rounded-sm"
                                                        title="Edit Spirit"
                                                    >
                                                        <Edit3 size={14} />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(product.id)}
                                                        className="p-3 bg-red-500/5 border border-red-500/10 hover:border-red-500/40 hover:bg-red-500/20 text-red-400 transition-all rounded-sm"
                                                        title="Exorcise"
                                                    >
                                                        <Trash2 size={14} />
                                                    </button>
                                                </div>

                                                <div className="absolute top-0 right-0 p-2 opacity-0 group-hover:opacity-10 transition-opacity">
                                                    <Package size={40} className="text-white" />
                                                </div>
                                            </motion.div>
                                        ))}

                                        {products.length === 0 && (
                                            <div className="col-span-full py-20 text-center border-2 border-dashed border-white/5">
                                                <p className="text-zinc-600 text-[10px] uppercase tracking-[0.5em]">The Archive Is Currently Empty</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    {activeTab === 'rituals' && (
                        <motion.div
                            key="rituals"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <SalesAnalytics />
                        </motion.div>
                    )}

                    {activeTab === 'archives' && (
                        <motion.div
                            key="archives"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <CategoryManager />
                        </motion.div>
                    )}

                    {activeTab === 'lineage' && (
                        <motion.div
                            key="lineage"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <SubcategoryManager />
                        </motion.div>
                    )}

                    {activeTab === 'ciphers' && (
                        <motion.div
                            key="ciphers"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <CouponManager />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default AdminDashboard;
