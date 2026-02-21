import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Upload, Image as ImageIcon, X, ChevronDown, ChevronUp, Save, LayoutGrid, Database } from 'lucide-react';
import { useStorage } from '../hooks/useStorage';
import { useProducts } from '../hooks/useProducts';
import { useSubcategories } from '../hooks/useSubcategories';
import { useCategories } from '../hooks/useCategories';
import { Product, ProductVariant, Subcategory, Category } from '../types';

interface ProductFormProps {
    onSuccess: () => void;
    initialProduct?: Product | null;
    onCancel?: () => void;
}

interface VariantState extends ProductVariant {
    thumbnailFile?: File | null;
    imageFiles?: File[];
}

const ProductForm: React.FC<ProductFormProps> = ({ onSuccess, initialProduct, onCancel }) => {
    const { uploadImage, uploading, progress, error: uploadError } = useStorage();
    const { addProduct, updateProduct } = useProducts();
    const { fetchSubcategories } = useSubcategories();
    const { fetchCategories } = useCategories();
    const [isLoading, setIsLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [variants, setVariants] = useState<VariantState[]>([]);
    const [activeVariantIndex, setActiveVariantIndex] = useState<number | null>(null);
    const [subcategories, setSubcategories] = useState<Subcategory[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);

    const isEditMode = !!initialProduct;

    // Standard specs keys matching constants.ts
    const SPEC_LABELS = ['MATERIAL', 'FEATURES', 'FIT', 'DESIGN', 'COLOR'];
    const [specs, setSpecs] = useState<Record<string, string>>(() => {
        if (initialProduct?.specs) {
            const initialSpecs: Record<string, string> = SPEC_LABELS.reduce((acc, label) => ({ ...acc, [label]: '' }), {});
            initialProduct.specs.forEach(s => {
                initialSpecs[s.label] = s.value;
            });
            return initialSpecs;
        }
        return SPEC_LABELS.reduce((acc, label) => ({ ...acc, [label]: '' }), {});
    });

    const [formData, setFormData] = useState({
        name: initialProduct?.name || '',
        price: initialProduct?.price.toString() || '',
        description: initialProduct?.description || '',
        category: initialProduct?.category || '',
        sizes: initialProduct?.sizes?.join(', ') || 'XS, S, M, L, XL',
        material: initialProduct?.material || '',
        care: initialProduct?.care || '',
        origin: initialProduct?.origin || '',
        size_and_fit: initialProduct?.size_and_fit || '',
        subcategory_id: initialProduct?.subcategory_id || '',
        scarcity_status: initialProduct?.scarcity_status || '',
    });

    // Reset form when initialProduct changes
    useEffect(() => {
        if (initialProduct) {
            setFormData({
                name: initialProduct.name,
                price: initialProduct.price.toString(),
                description: initialProduct.description,
                category: initialProduct.category,
                sizes: initialProduct.sizes?.join(', ') || 'XS, S, M, L, XL',
                material: initialProduct.material || '',
                care: initialProduct.care || '',
                origin: initialProduct.origin || '',
                size_and_fit: initialProduct.size_and_fit || '',
                subcategory_id: initialProduct.subcategory_id || '',
                scarcity_status: initialProduct.scarcity_status || '',
            });
            const newSpecs: Record<string, string> = SPEC_LABELS.reduce((acc, label) => ({ ...acc, [label]: '' }), {});
            initialProduct.specs?.forEach(s => {
                newSpecs[s.label] = s.value;
            });
            setSpecs(newSpecs);
            setVariants(initialProduct.variants || []);
        } else {
            setFormData({
                name: '',
                price: '',
                description: '',
                category: categories.length > 0 ? categories[0].name : '',
                sizes: 'XS, S, M, L, XL',
                material: '',
                care: '',
                origin: '',
                size_and_fit: '',
                subcategory_id: '',
                scarcity_status: '',
            });
            setSpecs(SPEC_LABELS.reduce((acc, label) => ({ ...acc, [label]: '' }), {}));
            setVariants([]);
        }
        setImageFile(null);
        setActiveVariantIndex(null);
    }, [initialProduct]);

    useEffect(() => {
        const loadSubsAndCats = async () => {
            const [subData, catData] = await Promise.all([
                fetchSubcategories(),
                fetchCategories()
            ]);
            setSubcategories(subData);
            setCategories(catData);
            
            // if we have no initial product and no category selected yet, default to first category
            if (!initialProduct && !formData.category && catData.length > 0) {
                 setFormData(prev => ({ ...prev, category: catData[0].name }));
            }
        };
        loadSubsAndCats();
    }, [fetchSubcategories, fetchCategories, initialProduct]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSpecChange = (label: string, value: string) => {
        setSpecs(prev => ({ ...prev, [label]: value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    // Variant Handlers
    const addVariant = () => {
        const newVariant: VariantState = {
            color_name: '',
            thumbnail_url: '',
            images: [],
            thumbnailFile: null,
            imageFiles: []
        };
        setVariants([...variants, newVariant]);
        setActiveVariantIndex(variants.length);
    };

    const removeVariant = (index: number) => {
        setVariants(variants.filter((_, i) => i !== index));
        if (activeVariantIndex === index) setActiveVariantIndex(null);
    };

    const updateVariantColor = (index: number, color: string) => {
        const newVariants = [...variants];
        newVariants[index].color_name = color;
        setVariants(newVariants);
    };

    const handleVariantThumbnailChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const newVariants = [...variants];
            newVariants[index].thumbnailFile = e.target.files[0];
            setVariants(newVariants);
        }
    };

    const handleVariantGalleryChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const newVariants = [...variants];
            const files = Array.from(e.target.files);
            newVariants[index].imageFiles = [...(newVariants[index].imageFiles || []), ...files];
            setVariants(newVariants);
        }
    };

    const removeVariantImage = (vIndex: number, imgIndex: number, isExisting: boolean) => {
        const newVariants = [...variants];
        if (isExisting) {
            newVariants[vIndex].images = newVariants[vIndex].images.filter((_, i) => i !== imgIndex);
        } else {
            newVariants[vIndex].imageFiles = newVariants[vIndex].imageFiles?.filter((_, i) => i !== imgIndex);
        }
        setVariants(newVariants);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            let finalImageUrl = initialProduct?.image_url || '';

            // 1. Upload Base Image if changed
            if (imageFile) {
                const url = await uploadImage(imageFile, `${Date.now()}_main_${imageFile.name}`);
                if (url) finalImageUrl = url;
            }

            // 2. Process Variants
            const processedVariants: ProductVariant[] = [];
            for (const v of variants) {
                let vThumbnailUrl = v.thumbnail_url;
                const vImages = [...v.images];

                // Upload variant thumbnail if new
                if (v.thumbnailFile) {
                    const url = await uploadImage(v.thumbnailFile, `variants/${Date.now()}_thumb_${v.thumbnailFile.name}`);
                    if (url) vThumbnailUrl = url;
                }

                // Upload variant gallery images if new
                if (v.imageFiles) {
                    for (const f of v.imageFiles) {
                        const url = await uploadImage(f, `variants/${Date.now()}_gallery_${f.name}`);
                        if (url) vImages.push(url);
                    }
                }

                processedVariants.push({
                    color_name: v.color_name,
                    thumbnail_url: vThumbnailUrl,
                    images: vImages
                });
            }

            // 3. Assemble Final Data
            const specsArray = Object.entries(specs)
                .filter(([_, value]) => value.trim() !== '')
                .map(([label, value]) => ({ label, value }));

            const finalProductData = {
                ...formData,
                price: parseFloat(formData.price),
                sizes: formData.sizes.split(',').map(s => s.trim()).filter(s => s !== ''),
                image_url: finalImageUrl,
                variants: processedVariants,
                specs: specsArray,
                subcategory_id: formData.subcategory_id || null,
                scarcity_status: formData.scarcity_status || null
            };

            if (isEditMode && initialProduct) {
                await updateProduct(initialProduct.id, finalProductData as any);
                alert("Archive updated successfully.");
            } else {
                await addProduct(finalProductData as any);
                alert("Spirit manifested in archive.");
            }

            onSuccess();
        } catch (err: any) {
            alert(`Manifestation failed: ${err.message || 'Unknown error'}`);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto bg-white/5 border border-white/10 p-8 space-y-8 relative overflow-hidden group/form">
            <div className="absolute top-0 left-0 w-1 h-full bg-linear-to-b from-white/20 via-transparent to-white/20" />
            
            <div className="flex justify-between items-center mb-4">
                <div className="space-y-1">
                    <h2 className="text-xl font-cinzel text-white tracking-widest uppercase">
                        {isEditMode ? 'Modify Manifest' : 'Manifest New Spirit'}
                    </h2>
                    <p className="text-[9px] text-zinc-500 uppercase tracking-widest pl-1 font-mono">
                        {isEditMode ? `ID: ${initialProduct.id.split('-')[0]}` : 'Status: New Entry'}
                    </p>
                </div>
                {isEditMode && (
                    <button 
                        type="button" 
                        onClick={onCancel}
                        className="text-zinc-500 hover:text-white text-[9px] uppercase tracking-[0.3em] transition-colors flex items-center gap-2"
                    >
                        <X size={12} /> Abort
                    </button>
                )}
            </div>

            <div className="space-y-6">
                {/* Core Meta */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Product Name (Codename)</label>
                        <input
                            required
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full bg-black/40 border border-white/5 p-3 text-[11px] text-white outline-none focus:border-white/20 transition-all font-light tracking-wider"
                            placeholder="Enter product title..."
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Price (Sacrifice)</label>
                        <input
                            required
                            type="number"
                            name="price"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            className="w-full bg-black/40 border border-white/5 p-3 text-[11px] text-white outline-none focus:border-white/20 transition-all font-light tracking-wider"
                            placeholder="0.00"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">Category</label>
                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full bg-black/40 border border-white/5 p-3 text-[11px] text-white outline-none focus:border-white/20 transition-all font-light tracking-wider appearance-none"
                        >
                            {categories.length === 0 && <option value="">Loading Archives...</option>}
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Sub-Archive (Sect)</label>
                        <select
                            name="subcategory_id"
                            value={formData.subcategory_id}
                            onChange={handleChange}
                            className="w-full bg-black/40 border border-white/5 p-3 text-[11px] text-white outline-none focus:border-white/20 transition-all font-light tracking-wider appearance-none"
                        >
                            <option value="">None / General</option>
                            {subcategories
                                .filter(s => s.parent_category === formData.category)
                                .map(sub => (
                                    <option key={sub.id} value={sub.id}>{sub.name}</option>
                                ))
                            }
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Available Sizes (Dimensions)</label>
                        <input
                            required
                            type="text"
                            name="sizes"
                            value={formData.sizes}
                            onChange={handleChange}
                            className="w-full bg-black/40 border border-white/5 p-3 text-[11px] text-white outline-none focus:border-white/20 transition-all font-light tracking-wider"
                            placeholder="XS, S, M, L, XL"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Scarcity Status (Badge)</label>
                        <input
                            type="text"
                            name="scarcity_status"
                            value={formData.scarcity_status}
                            onChange={handleChange}
                            className="w-full bg-black/40 border border-white/5 p-3 text-[11px] text-white outline-none focus:border-white/20 transition-all font-light tracking-wider"
                            placeholder="e.g. LIMITED EDITION, LOW STOCK"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-500 font-bold">Description (Narrative)</label>
                    <textarea
                        required
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full bg-black/40 border border-white/5 p-3 text-[11px] text-white outline-none focus:border-white/20 transition-all font-light tracking-wider resize-none"
                        placeholder="Define the spirit's essence..."
                    />
                </div>

                {/* Base Image */}
                <div className="space-y-2 p-4 border border-white/5 bg-black/20">
                    <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-300 block mb-2 font-bold">Base Product Image</label>
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 border border-white/10 bg-zinc-900 shrink-0 relative overflow-hidden group/img">
                            {(imageFile || (isEditMode && initialProduct?.image_url)) && (
                                <img 
                                    src={imageFile ? URL.createObjectURL(imageFile) : initialProduct?.image_url} 
                                    className="w-full h-full object-cover opacity-50 group-hover/img:opacity-100 transition-opacity"
                                    alt="Preview"
                                />
                            )}
                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/img:opacity-100 transition-opacity bg-black/40">
                                <ImageIcon size={16} />
                            </div>
                        </div>
                        <div className="grow">
                            <input
                                required={!isEditMode}
                                type="file"
                                accept="image/*"
                                onChange={handleFileChange}
                                className="hidden"
                                id="base-image"
                            />
                            <label 
                                htmlFor="base-image" 
                                className="inline-flex items-center gap-2 px-4 py-2 border border-white/10 text-[9px] uppercase tracking-widest text-zinc-400 hover:text-white hover:border-white/30 cursor-pointer transition-all"
                            >
                                <Upload size={12} /> {imageFile ? 'Switch Visual' : 'Upload Manifest'}
                            </label>
                            {imageFile && <p className="text-[8px] text-zinc-500 mt-1 uppercase tracking-tighter truncate">{imageFile.name}</p>}
                        </div>
                    </div>
                </div>

                {/* Variants Section */}
                <div className="space-y-6 pt-6 border-t border-white/5">
                        <div className="flex items-center gap-2">
                            <LayoutGrid size={14} className="text-zinc-600" />
                            <h3 className="text-xs font-cinzel tracking-widest text-white uppercase">Color Variants (Spectrum)</h3>
                        </div>
                        <button
                            type="button"
                            onClick={addVariant}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/10 text-[9px] uppercase tracking-widest text-white transition-all rounded-sm"
                        >
                            <Plus size={12} /> Add New Color
                        </button>

                    <div className="space-y-4">
                        {variants.length === 0 ? (
                            <p className="text-[10px] text-zinc-600 italic uppercase tracking-widest text-center py-4 border border-white/5 border-dashed">No spectrum variants defined.</p>
                        ) : (
                            variants.map((variant, vIdx) => (
                                <div key={vIdx} className="border border-white/5 bg-black/20 overflow-hidden">
                                    <div 
                                        className="p-4 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors"
                                        onClick={() => setActiveVariantIndex(activeVariantIndex === vIdx ? null : vIdx)}
                                    >
                                        <div className="flex items-center gap-4">
                                            <div className="w-8 h-8 rounded-full border border-white/10 bg-zinc-900 overflow-hidden">
                                                {(variant.thumbnailFile || variant.thumbnail_url) && (
                                                    <img 
                                                        src={variant.thumbnailFile ? URL.createObjectURL(variant.thumbnailFile) : variant.thumbnail_url || '/placeholder-spirit.jpg'} 
                                                        className="w-full h-full object-cover" 
                                                        alt={variant.color_name}
                                                    />
                                                )}
                                            </div>
                                            <span className="text-[10px] uppercase tracking-widest text-zinc-400">
                                                {variant.color_name || 'UNDEFINED SPECTRUM'}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <button 
                                                type="button" 
                                                onClick={(e) => { e.stopPropagation(); removeVariant(vIdx); }}
                                                className="p-1.5 text-zinc-600 hover:text-red-500 transition-colors"
                                            >
                                                <Trash2 size={12} />
                                            </button>
                                            {activeVariantIndex === vIdx ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                                        </div>
                                    </div>

                                    <AnimatePresence>
                                        {activeVariantIndex === vIdx && (
                                            <motion.div 
                                                initial={{ height: 0 }}
                                                animate={{ height: 'auto' }}
                                                exit={{ height: 0 }}
                                                className="overflow-hidden bg-white/2 border-t border-white/5"
                                            >
                                                <div className="p-6 space-y-6">
                                                    <div className="space-y-2">
                                                        <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">Color Designation</label>
                                                        <input
                                                            type="text"
                                                            value={variant.color_name}
                                                            onChange={(e) => updateVariantColor(vIdx, e.target.value)}
                                                            className="w-full bg-black/40 border border-white/5 p-3 text-[10px] text-white outline-none focus:border-white/20 transition-all tracking-wider"
                                                            placeholder="e.g. Shadow Black, Crimson Void..."
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                                        <div className="space-y-3">
                                                            <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">Thumbnail Manifest</label>
                                                            <div className="flex items-center gap-4">
                                                                <div className="w-12 h-12 border border-white/10 bg-zinc-900 shrink-0 overflow-hidden">
                                                                    {(variant.thumbnailFile || variant.thumbnail_url) && (
                                                                        <img 
                                                                            src={variant.thumbnailFile ? URL.createObjectURL(variant.thumbnailFile) : variant.thumbnail_url} 
                                                                            className="w-full h-full object-cover" 
                                                                            alt=""
                                                                        />
                                                                    )}
                                                                </div>
                                                                <input
                                                                    type="file"
                                                                    accept="image/*"
                                                                    id={`thumb-${vIdx}`}
                                                                    className="hidden"
                                                                    onChange={(e) => handleVariantThumbnailChange(vIdx, e)}
                                                                    onClick={(e) => (e.target as HTMLInputElement).value = ''}
                                                                />
                                                                <label 
                                                                    htmlFor={`thumb-${vIdx}`}
                                                                    className="px-4 py-2 bg-white/5 border border-white/20 text-[9px] uppercase tracking-widest text-white hover:bg-white/10 cursor-pointer transition-colors font-bold"
                                                                >
                                                                    {variant.thumbnailFile || variant.thumbnail_url ? 'Change Image' : 'Upload Color'}
                                                                </label>
                                                            </div>
                                                        </div>

                                                        <div className="space-y-3">
                                                            <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-600">Gallery Manifests ({[...(variant.imageFiles || []), ...variant.images].length})</label>
                                                            <input
                                                                type="file"
                                                                accept="image/*"
                                                                multiple
                                                                id={`gallery-${vIdx}`}
                                                                className="hidden"
                                                                onChange={(e) => handleVariantGalleryChange(vIdx, e)}
                                                                onClick={(e) => (e.target as HTMLInputElement).value = ''}
                                                            />
                                                            <label 
                                                                htmlFor={`gallery-${vIdx}`}
                                                                className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/10 text-[9px] uppercase tracking-widest text-white hover:bg-zinc-800 cursor-pointer transition-colors"
                                                            >
                                                                <Plus size={10} /> Add Gallery Images
                                                            </label>
                                                        </div>
                                                    </div>

                                                    <div className="flex flex-wrap gap-2 pt-2">
                                                        {variant.images.map((img, i) => (
                                                            <div key={i} className="relative w-16 h-16 group/img">
                                                                <img src={img} className="w-full h-full object-cover grayscale opacity-40 group-hover/img:opacity-100 transition-all" alt="" />
                                                                <button 
                                                                    type="button" 
                                                                    onClick={() => removeVariantImage(vIdx, i, true)}
                                                                    className="absolute -top-1 -right-1 p-1 bg-red-900 text-white rounded-full opacity-0 group-hover/img:opacity-100 transition-all"
                                                                >
                                                                    <X size={8} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                        {variant.imageFiles?.map((file, i) => (
                                                            <div key={i} className="relative w-16 h-16 group/img">
                                                                <img src={URL.createObjectURL(file)} className="w-full h-full object-cover opacity-60 group-hover/img:opacity-100 transition-all" alt="" />
                                                                <button 
                                                                    type="button" 
                                                                    onClick={() => removeVariantImage(vIdx, i, false)}
                                                                    className="absolute -top-1 -right-1 p-1 bg-white text-black rounded-full opacity-0 group-hover/img:opacity-100 transition-all"
                                                                >
                                                                    <X size={8} />
                                                                </button>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Technical Specs */}
                <div className="space-y-6 pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2">
                        <Database size={14} className="text-zinc-600" />
                        <h3 className="text-xs font-cinzel tracking-widest text-white uppercase">Product Specifications (Metadata)</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {SPEC_LABELS.map(label => (
                            <div key={label} className="space-y-1">
                                <label className="text-[8px] uppercase tracking-[0.2em] text-zinc-700">{label}</label>
                                <input
                                    type="text"
                                    value={specs[label]}
                                    onChange={(e) => handleSpecChange(label, e.target.value)}
                                    className="w-full bg-black/20 border border-white/5 p-2.5 text-[10px] text-zinc-400 outline-none focus:border-white/10 transition-all"
                                    placeholder={`Specify ${label.toLowerCase()}...`}
                                />
                            </div>
                        ))}
                    </div>
                </div>

                {/* Detail Data */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-white/5">
                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">Material Composition</label>
                        <input
                            type="text"
                            name="material"
                            value={formData.material}
                            onChange={handleChange}
                            className="w-full bg-black/40 border border-white/5 p-3 text-[11px] text-white outline-none focus:border-white/20"
                            placeholder="e.g. 100% Synthetic Membrane"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">Care Protocol</label>
                        <input
                            type="text"
                            name="care"
                            value={formData.care}
                            onChange={handleChange}
                            className="w-full bg-black/40 border border-white/5 p-3 text-[11px] text-white outline-none focus:border-white/20"
                            placeholder="e.g. Professional Exorcism Only"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">Origin Source</label>
                        <input
                            type="text"
                            name="origin"
                            value={formData.origin}
                            onChange={handleChange}
                            className="w-full bg-black/40 border border-white/5 p-3 text-[11px] text-white outline-none focus:border-white/20"
                            placeholder="e.g. Imported / Ghost Fabricated"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.3em] text-zinc-500">Fit Definition</label>
                        <input
                            type="text"
                            name="size_and_fit"
                            value={formData.size_and_fit}
                            onChange={handleChange}
                            className="w-full bg-black/40 border border-white/5 p-3 text-[11px] text-white outline-none focus:border-white/20"
                            placeholder="e.g. Oversized Fit / Standard"
                        />
                    </div>
                </div>

                {uploadError && (
                    <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] uppercase tracking-widest text-center animate-pulse">
                        Neural Interference Detected: {uploadError}
                    </div>
                )}

                <div className="pt-8">
                    <button
                        type="submit"
                        disabled={isLoading || uploading}
                        className="w-full group relative py-6 bg-white text-black font-bold text-[10px] uppercase tracking-[0.8em] transition-all active:scale-[0.98] disabled:opacity-50 overflow-hidden"
                    >
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            {uploading ? <Upload className="animate-bounce" size={14} /> : <Save size={14} />}
                            {uploading ? `TRANSMITTING DATA [${Math.round(progress)}%]` : isLoading ? 'CALCULATING MANIFEST...' : isEditMode ? 'UPDATE ARCHIVE' : 'FINALIZE MANIFEST'}
                        </span>
                        <div className="absolute inset-0 bg-zinc-200 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                    </button>
                    <p className="text-center text-[7px] text-zinc-700 uppercase tracking-[0.5em] mt-4 font-mono">Ensure all neural connections are stable before finalization.</p>
                </div>
            </div>
        </form>
    );
};

export default ProductForm;
