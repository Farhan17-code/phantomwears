import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit3, Save, X, BookOpen, ChevronRight, Upload, ImageIcon } from 'lucide-react';
import { useCategories } from '../hooks/useCategories';
import { useStorage } from '../hooks/useStorage';
import { Category } from '../types';

export const CategoryManager: React.FC = () => {
    const { fetchCategories, addCategory, updateCategory, deleteCategory } = useCategories();
    const { uploadImage, uploading } = useStorage();
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    
    const [newCategoryName, setNewCategoryName] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [showOnHome, setShowOnHome] = useState(false);
    
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [editImageFile, setEditImageFile] = useState<File | null>(null);
    const [editShowOnHome, setEditShowOnHome] = useState(false);

    const loadData = async () => {
        setIsLoading(true);
        const data = await fetchCategories();
        setCategories(data);
        setIsLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCategoryName.trim()) return;

        setIsSaving(true);
        try {
            let imageUrl = '';
            if (imageFile) {
                const uploadedUrl = await uploadImage(imageFile, `categories/${Date.now()}_${imageFile.name}`);
                if (uploadedUrl) imageUrl = uploadedUrl;
            }

            await addCategory({
                name: newCategoryName.trim(),
                image_url: imageUrl,
                show_on_home: showOnHome
            });
            setNewCategoryName('');
            setImageFile(null);
            setShowOnHome(false);
            await loadData();
        } catch (error: any) {
            alert(`Failed to add archive: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleUpdate = async (id: string, currentImageUrl?: string) => {
        if (!editName.trim()) return;
        setIsSaving(true);
        try {
            let finalImageUrl = currentImageUrl;
            if (editImageFile) {
                const uploadedUrl = await uploadImage(editImageFile, `categories/${Date.now()}_${editImageFile.name}`);
                if (uploadedUrl) finalImageUrl = uploadedUrl;
            }

            await updateCategory(id, { 
                name: editName.trim(),
                show_on_home: editShowOnHome,
                image_url: finalImageUrl
            });
            setEditingId(null);
            setEditImageFile(null);
            await loadData();
        } catch (error: any) {
            alert(`Update failed: ${error.message}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Sever this archive? Sub-sects and products may be affected.")) return;
        try {
            await deleteCategory(id);
            await loadData();
        } catch (error: any) {
            alert(`Deletion failed: ${error.message}`);
        }
    };

    const startEdit = (cat: Category) => {
        setEditingId(cat.id);
        setEditName(cat.name);
        setEditShowOnHome(cat.show_on_home || false);
        setEditImageFile(null);
    };

    return (
        <div className="space-y-12 mb-16">
            {/* Entry Form */}
            <div className="bg-white/5 border border-white/10 p-8 relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-white/20 via-transparent to-white/20" />
                <div className="flex items-center gap-3 mb-8">
                    <BookOpen size={16} className="text-zinc-500" />
                    <h3 className="text-xs font-cinzel tracking-[0.3em] text-white uppercase font-bold">Forge Primary Archive (Category)</h3>
                </div>
                
                <form onSubmit={handleAdd} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                        <div className="md:col-span-12 space-y-2">
                            <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">Archive Name</label>
                            <input
                                type="text"
                                value={newCategoryName}
                                onChange={(e) => setNewCategoryName(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 p-3 text-[11px] text-white outline-none focus:border-white/20 transition-all font-light tracking-wider"
                                placeholder="e.g. Outerwear, Accessories..."
                            />
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                        <div className="md:col-span-8 flex items-center gap-4 border border-white/5 p-3 bg-black/20">
                            <div className="w-12 h-12 border border-white/10 bg-zinc-900 shrink-0 relative overflow-hidden group/img">
                                {imageFile && (
                                    <img 
                                        src={URL.createObjectURL(imageFile)} 
                                        className="w-full h-full object-cover opacity-50 transition-opacity"
                                        alt="Preview"
                                    />
                                )}
                                <div className="absolute inset-0 flex items-center justify-center opacity-50">
                                    <ImageIcon size={12} />
                                </div>
                            </div>
                            <div className="grow">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
                                    }}
                                    className="hidden"
                                    id="cat-image"
                                />
                                <label 
                                    htmlFor="cat-image" 
                                    className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/10 text-[9px] uppercase tracking-widest text-zinc-400 hover:text-white hover:border-white/30 cursor-pointer transition-all"
                                >
                                    <Upload size={10} /> {imageFile ? 'Change Manifest' : 'Upload Manifest'}
                                </label>
                            </div>
                            <label className="flex items-center gap-2 cursor-pointer border-l border-white/10 pl-4 py-2">
                                <input 
                                    type="checkbox" 
                                    checked={showOnHome}
                                    onChange={(e) => setShowOnHome(e.target.checked)}
                                    className="accent-white w-3 h-3 bg-black border-white/20"
                                />
                                <span className="text-[9px] uppercase tracking-[0.2em] text-zinc-400">Show on Home</span>
                            </label>
                        </div>
                        <div className="md:col-span-4 h-full">
                            <button
                                type="submit"
                                disabled={isSaving || uploading || !newCategoryName.trim()}
                                className="w-full h-full py-3 bg-white text-black font-bold text-[9px] uppercase tracking-[0.2em] transition-all active:scale-[0.98] disabled:opacity-50 min-h-[48px]"
                            >
                                {uploading ? 'Transmitting...' : 'Forge'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>

            {/* Display List */}
            <div className="space-y-6">
                <div className="flex items-center gap-2 pb-2 border-b border-white/5">
                    <span className="text-[10px] uppercase tracking-[0.4em] text-zinc-500">Established Archives</span>
                </div>
                
                <div className="space-y-3">
                    {isLoading ? (
                        <div className="py-8 text-center text-zinc-700 text-[8px] uppercase tracking-widest animate-pulse">Syncing...</div>
                    ) : categories.length === 0 ? (
                        <div className="py-8 text-center text-zinc-800 text-[8px] uppercase tracking-widest border border-dashed border-white/5 italic">Empty Archives</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {categories.map((cat) => (
                                <div key={cat.id} className="group/item flex items-center justify-between p-4 bg-white/2 border border-white/5 hover:border-white/20 transition-all flex-col sm:flex-row gap-4">
                                    <div className="flex items-center gap-4 grow w-full">
                                        <div className="w-10 h-10 border border-white/5 bg-black/40 shrink-0 relative overflow-hidden flex items-center justify-center">
                                            {editingId === cat.id ? (
                                                <>
                                                    {(editImageFile || cat.image_url) && (
                                                        <img 
                                                            src={editImageFile ? URL.createObjectURL(editImageFile) : cat.image_url} 
                                                            className="w-full h-full object-cover opacity-50"
                                                            alt=""
                                                        />
                                                    )}
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => {
                                                            if (e.target.files && e.target.files[0]) setEditImageFile(e.target.files[0]);
                                                        }}
                                                        className="hidden"
                                                        id={`edit-img-${cat.id}`}
                                                    />
                                                    <label htmlFor={`edit-img-${cat.id}`} className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/60 opacity-0 hover:opacity-100 transition-opacity">
                                                        <Upload size={10} className="text-white" />
                                                    </label>
                                                </>
                                            ) : (
                                                cat.image_url ? (
                                                    <img src={cat.image_url} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <ImageIcon size={12} className="text-zinc-700" />
                                                )
                                            )}
                                        </div>
                                        
                                        <div className="grow space-y-1 overflow-hidden">
                                            {editingId === cat.id ? (
                                                <input
                                                    autoFocus
                                                    type="text"
                                                    value={editName}
                                                    onChange={(e) => setEditName(e.target.value)}
                                                    className="w-full bg-black/60 border-b border-white/20 p-1 text-[11px] text-white outline-none font-light tracking-wider"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') handleUpdate(cat.id, cat.image_url);
                                                        if (e.key === 'Escape') setEditingId(null);
                                                    }}
                                                />
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <ChevronRight size={10} className="text-zinc-700 group-hover/item:text-white transition-colors shrink-0" />
                                                    <span className="text-[11px] text-zinc-400 group-hover/item:text-white transition-colors uppercase tracking-widest truncate max-w-[120px]" title={cat.name}>{cat.name}</span>
                                                </div>
                                            )}
                                            
                                            {editingId === cat.id ? (
                                                <label className="flex items-center gap-2 cursor-pointer mt-2">
                                                    <input 
                                                        type="checkbox" 
                                                        checked={editShowOnHome}
                                                        onChange={(e) => setEditShowOnHome(e.target.checked)}
                                                        className="accent-white w-2.5 h-2.5 bg-black rounded-none border-white/20 shrink-0"
                                                    />
                                                    <span className="text-[8px] uppercase tracking-[0.2em] text-zinc-500 whitespace-nowrap">Show on Home</span>
                                                </label>
                                            ) : (
                                                cat.show_on_home && (
                                                    <span className="text-[7px] text-zinc-500 uppercase tracking-widest border border-zinc-800 px-1 py-0.5 inline-block">Home Page</span>
                                                )
                                            )}
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 opacity-0 group-hover/item:opacity-100 transition-opacity whitespace-nowrap">
                                        {editingId === cat.id ? (
                                            <>
                                                <button onClick={() => handleUpdate(cat.id, cat.image_url)} disabled={uploading} className="p-1.5 text-emerald-500 hover:bg-emerald-500/10 rounded disabled:opacity-50"><Save size={12} /></button>
                                                <button onClick={() => setEditingId(null)} className="p-1.5 text-zinc-500 hover:bg-white/5 rounded"><X size={12} /></button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => startEdit(cat)} className="p-1.5 text-zinc-500 hover:text-white hover:bg-white/5 rounded"><Edit3 size={12} /></button>
                                                <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 rounded"><Trash2 size={12} /></button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};