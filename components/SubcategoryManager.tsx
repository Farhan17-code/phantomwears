import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, Save, X, Layers, ChevronRight } from 'lucide-react';
import { useSubcategories } from '../hooks/useSubcategories';
import { useCategories } from '../hooks/useCategories';
import { Subcategory, Category } from '../types';

export const SubcategoryManager: React.FC = () => {
    const { fetchSubcategories, addSubcategory, updateSubcategory, deleteSubcategory } = useSubcategories();
    const { fetchCategories } = useCategories();
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [newSubName, setNewSubName] = useState('');
    const [newParentCat, setNewParentCat] = useState("Men's");
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');

    const loadData = async () => {
        setIsLoading(true);
        const [subData, catData] = await Promise.all([
          fetchSubcategories(),
          fetchCategories()
        ]);
        setSubcategories(subData);
        setCategories(catData);
        
        // If there's categories but parent is empty, set a sensible default
        if(catData.length > 0 && !newParentCat) {
          setNewParentCat(catData[0].name);
        }
        
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newSubName.trim()) return;

        setIsSaving(true);
        try {
            await addSubcategory({
                name: newSubName.trim(),
                parent_category: newParentCat
            });
            setNewSubName('');
            await loadData();
        } catch (error: any) {
            alert(`Failed to add lineage: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdate = async (id: string) => {
        if (!editName.trim()) return;
        setIsSaving(true);
        try {
            await updateSubcategory(id, { name: editName.trim() });
            setEditingId(null);
            await loadData();
        } catch (error: any) {
            alert(`Update failed: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Sever this lineage? Products may lose their sect.")) return;
        try {
            await deleteSubcategory(id);
            await loadData();
        } catch (error: any) {
            alert(`Deletion failed: ${error.message}`);
        }
    };

    const startEdit = (sub: Subcategory) => {
        setEditingId(sub.id);
        setEditName(sub.name);
    };

    return (
        <div className="space-y-12">
            {/* Entry Form */}
            <div className="bg-white/5 border border-white/10 p-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-white/20 via-transparent to-white/20" />
                <div className="flex items-center gap-3 mb-8">
                    <Layers size={16} className="text-zinc-500" />
                    <h3 className="text-xs font-cinzel tracking-[0.3em] text-white uppercase font-bold">Forge New Lineage (Subcategory)</h3>
                </div>
                
                <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                    <div className="md:col-span-5 space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">Parent Archive</label>
                        <select
                            value={newParentCat}
                            onChange={(e) => setNewParentCat(e.target.value)}
                            className="w-full bg-black/40 border border-white/5 p-3 text-[11px] text-white outline-none focus:border-white/20 transition-all font-light tracking-wider appearance-none"
                        >
                            {categories.length === 0 && <option value="">Loading Archives...</option>}
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="md:col-span-5 space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">Sect Name</label>
                        <input
                            type="text"
                            value={newSubName}
                            onChange={(e) => setNewSubName(e.target.value)}
                            className="w-full bg-black/40 border border-white/5 p-3 text-[11px] text-white outline-none focus:border-white/20 transition-all font-light tracking-wider"
                            placeholder="e.g. Shadow Tees, Void Knit..."
                        />
                    </div>
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            disabled={isSaving || !newSubName.trim()}
                            className="w-full py-3 bg-white text-black font-bold text-[9px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-50"
                        >
                            Forge
                        </button>
                    </div>
                </form>
            </div>

            {/* Display Lists per Category */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {categories.map(category => (
                    <div key={category.id} className="space-y-6">
                        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                            <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500">{category.name} Sects</span>
                        </div>
                        
                        <div className="space-y-3">
                            {isLoading ? (
                                <div className="py-8 text-center text-zinc-700 text-[8px] uppercase tracking-widest animate-pulse">Syncing...</div>
                            ) : subcategories.filter(s => s.parent_category === category.name).length === 0 ? (
                                <div className="py-8 text-center text-zinc-800 text-[8px] uppercase tracking-widest border border-dashed border-white/5 italic">Empty Lineage</div>
                            ) : (
                                subcategories.filter(s => s.parent_category === category.name).map((sub) => (
                                    <div key={sub.id} className="group/item flex items-center justify-between p-4 bg-white/2 border border-white/5 hover:border-white/20 transition-all">
                                        <div className="grow">
                                            {editingId === sub.id ? (
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="w-full bg-black/60 border-b border-white/20 p-1 text-[11px] text-white outline-none font-light tracking-wider"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleUpdate(sub.id);
                                                        if (e.key === 'Escape') setEditingId(null);
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <ChevronRight size={10} className="text-zinc-700 group-hover/item:text-white transition-colors" />
                                                    <span className="text-[11px] text-zinc-400 group-hover/item:text-white transition-colors uppercase tracking-widest">{sub.name}</span>
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity">
                                            {editingId === sub.id ? (
                                                <>
                                                    <button onClick={() => handleUpdate(sub.id)} className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded"><Save size={12} /></button>
                                                    <button onClick={() => setEditingId(null)} className="p-1.5 text-zinc-500 hover:bg-white/5 rounded"><X size={12} /></button>
                                                </>
                                            ) : (
                                                <>
                                                    <button onClick={() => startEdit(sub)} className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded"><Edit3 size={12} /></button>
                                                    <button onClick={() => handleDelete(sub.id)} className="p-1.5 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded"><Trash2 size={12} /></button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
