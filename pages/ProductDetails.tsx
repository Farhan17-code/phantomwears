import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingBag, ChevronRight, Share2, Heart, ShieldCheck, Truck, RefreshCcw, Star, Check, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../hooks/useProducts';
import { useSubcategories } from '../hooks/useSubcategories';
import { useReviews } from '../hooks/useReviews';
import { useWishlist } from '../hooks/useWishlist';
import { Product, ProductVariant, Subcategory } from '../types';
import Breadcrumbs from '../components/Breadcrumbs';
import NeuromapLoading from '../components/NeuromapLoading';
import ProductGallery from '../components/ProductGallery';
import ProductTabs from '../components/ProductTabs';
import ReviewSection from '../components/ReviewSection';
import ReviewForm from '../components/ReviewForm';

const ProductDetails: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { getProductById } = useProducts();
    const { fetchSubcategories } = useSubcategories();
    const { isAuthenticated, user } = useAuth();
    const { toggleWishlist, isWishlisted } = useWishlist();
    const [product, setProduct] = useState<Product | null>(null);
    const [subcategoryName, setSubcategoryName] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
    const [selectedSize, setSelectedSize] = useState<string>('');
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [copying, setCopying] = useState(false);

    const { reviews, fetchReviews, submitReview, markHelpful } = useReviews(id || '');

    const averageRating = reviews.length > 0 
        ? reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length 
        : 0;

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href);
            setCopying(true);
            setTimeout(() => setCopying(false), 2000);
        } catch (err) {
            console.error('Failed to copy link:', err);
        }
    };

    useEffect(() => {
        const loadProduct = async () => {
            if (!id) return;
            setIsLoading(true);
            const found = await getProductById(id);
            if (found) {
                setProduct(found);
                
                // Fetch subcategory name
                if (found.subcategory_id) {
                    const subs: Subcategory[] = await fetchSubcategories();
                    const sub = subs.find(s => s.id === found.subcategory_id);
                    if (sub) setSubcategoryName(sub.name);
                }

                if (found.variants && found.variants.length > 0) {
                    setSelectedVariant(found.variants[0]);
                }
                if (found.sizes && found.sizes.length > 0) {
                    setSelectedSize(found.sizes[Math.floor(found.sizes.length / 2)]);
                }
                fetchReviews();
            } else {
                navigate('/products');
            }
            // Artificial delay to show Neuromap animation
            setTimeout(() => setIsLoading(false), 1500);
        };
        loadProduct();
    }, [id, navigate, getProductById, fetchReviews, fetchSubcategories]);

    if (isLoading) return <NeuromapLoading />;
    if (!product) return null;

    const handleAddToCart = () => {
        if (!selectedSize) {
            alert('Please select a size');
            return;
        }
        setIsAddingToCart(true);
        
        addToCart({
            ...product,
            selectedSize,
            selectedColor: selectedVariant?.color_name || 'Original'
        });
        
        setTimeout(() => setIsAddingToCart(false), 1000);
    };

    const specs = [
        { label: 'MATERIAL', value: product.material || 'Premium Technical Synthetic' },
        { label: 'ORIGIN', value: product.origin || 'Imported' },
        { label: 'CARE', value: product.care || 'Professional Clean Only' },
        { label: 'FIT', value: product.size_and_fit || 'Standard Fit' },
    ];

    // Filter out standard specs from product.specs to avoid duplicates
    const additionalSpecs = (product.specs || []).filter(
        s => !specs.some(std => std.label.toUpperCase() === s.label.toUpperCase())
    );

    const tabs = [
        {
            id: 'description',
            label: 'Description',
            content: (
                <div className="space-y-4">
                    <p>{product.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                        <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/5">
                            <ShieldCheck className="text-zinc-500 shrink-0" size={18} />
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-white mb-1">Authenticity Guaranteed</p>
                                <p className="text-[10px] text-zinc-500">Every piece is codified and tracked via our neural manifest.</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-4 bg-white/5 border border-white/5">
                            <Truck className="text-zinc-500 shrink-0" size={18} />
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-white mb-1">Stealth Shipping</p>
                                <p className="text-[10px] text-zinc-500">Global delivery within 3-5 standard temporal cycles.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        },
        {
            id: 'specs',
            label: 'Specifications',
            content: (
                <div className="grid grid-cols-1 gap-2">
                    {[...specs, ...additionalSpecs].map((spec, i) => (
                        <div key={i} className="flex justify-between py-3 border-b border-white/5 group/spec">
                            <span className="text-[9px] uppercase tracking-[0.3em] text-zinc-600 group-hover/spec:text-zinc-400 transition-colors">{spec.label}</span>
                            <span className="text-[10px] uppercase tracking-wider text-white text-right max-w-[250px]">{spec.value}</span>
                        </div>
                    ))}
                </div>
            )
        },
        {
            id: 'shipping',
            label: 'Returns',
            content: (
                <div className="space-y-4">
                    <p>PHANTOM WEARS operates on a policy of absolute precision. However, if your garment fails to align with your neural signature, we offer easy returns.</p>
                    <div className="flex items-center gap-2 p-4 bg-white/5 border border-white/5">
                        <RefreshCcw className="text-zinc-500" size={16} />
                        <span className="text-[10px] uppercase tracking-widest">30-Day Temporal Exchange Window</span>
                    </div>
                </div>
            )
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white pt-32 md:pt-40 pb-16 md:pb-32 px-4 md:px-6 w-full overflow-x-hidden">
            <div className="max-w-7xl mx-auto">
            <Breadcrumbs 
                items={[
                    { label: 'Collections', path: '/products' },
                    { label: product.category, path: `/products?category=${product.category}` },
                    { label: product.name }
                ]}
            />


                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 items-start">
                    {/* Left: Product Gallery */}
                    <div className="w-full">
                        <ProductGallery 
                            images={selectedVariant ? selectedVariant.images : [product.image_url]} 
                            activeVariantIndex={product.variants?.indexOf(selectedVariant!) || 0}
                            scarcityStatus={product.scarcity_status}
                        />
                    </div>

                    {/* Right: Product Interaction */}
                    <div className="w-full space-y-4 md:space-y-6 lg:space-y-8">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                            className="space-y-4 md:space-y-6"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                                <h1 className="text-2xl md:text-4xl lg:text-5xl font-cinzel font-bold tracking-[0.15em] md:tracking-[0.2em] lg:tracking-widest text-transparent bg-clip-text bg-linear-to-r from-white via-zinc-400 to-zinc-600 leading-tight">
                                    {product.name.toUpperCase()}
                                </h1>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={handleShare}
                                        className="p-2 border border-white/10 hover:border-white/40 transition-colors relative group"
                                        title="Copy Manifest Link"
                                    >
                                        <Share2 size={16} className={copying ? "text-emerald-400" : "text-zinc-400"} />
                                        {copying && (
                                            <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 bg-white text-black text-[8px] uppercase tracking-widest whitespace-nowrap">
                                                Link Cached
                                            </span>
                                        )}
                                    </button>
                                    <button 
                                        onClick={() => toggleWishlist(product.id)}
                                        className={`p-2 border transition-all ${
                                            isWishlisted(product.id) 
                                                ? 'border-white bg-white/5 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]' 
                                                : 'border-white/10 hover:border-white/40 text-zinc-400'
                                        }`}
                                        title={isWishlisted(product.id) ? "Remove from Neural Curation" : "Save to Neural Curation"}
                                    >
                                        <Heart 
                                            size={16} 
                                            className={isWishlisted(product.id) ? "fill-white" : ""} 
                                        />
                                    </button>
                                </div>
                            </div>
                            
                            <div className="flex flex-wrap items-center gap-x-6 gap-y-4 pt-4 border-t border-white/5">
                                <span className="text-2xl md:text-3xl font-light tracking-widest text-zinc-300">৳ {product.price.toLocaleString()}</span>
                                
                                <div className="flex items-center gap-4">
                                    <div className="h-4 w-px bg-zinc-800" />
                                    <div className="flex flex-col">
                                        <span className="text-[9px] text-zinc-600 uppercase tracking-widest leading-tight">{product.category}</span>
                                        {subcategoryName && (
                                            <span className="text-[9px] text-zinc-400 uppercase tracking-widest font-bold leading-tight">{subcategoryName}</span>
                                        )}
                                    </div>
                                    <div className="h-4 w-px bg-zinc-800" />
                                    <div className="flex items-center gap-2">
                                        <div className="flex gap-0.5">
                                            {[...Array(5)].map((_, i) => (
                                                <Star 
                                                    key={i} 
                                                    size={10} 
                                                    className={i < Math.round(averageRating) ? "fill-white text-white" : "text-zinc-800"} 
                                                />
                                            ))}
                                        </div>
                                        <span className="text-[9px] text-zinc-500 uppercase tracking-widest mt-0.5">({reviews.length})</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Variant Selection */}
                        {product.variants && product.variants.length > 0 && (
                            <div className="space-y-4 pt-2">
                                <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                    <h3 className="text-[10px] uppercase tracking-[0.4em] text-zinc-500">Select Spectrum</h3>
                                    <span className="text-[10px] uppercase tracking-widest text-white">{selectedVariant?.color_name}</span>
                                </div>
                                <div className="flex gap-3">
                                    {product.variants.map((variant, i) => (
                                        <button
                                            key={i}
                                            onClick={() => setSelectedVariant(variant)}
                                            className={`relative w-8 h-8 border-2 transition-all p-0.5 group/variant ${
                                                selectedVariant?.color_name === variant.color_name 
                                                    ? 'border-white' 
                                                    : 'border-transparent hover:border-white/30'
                                            }`}
                                        >
                                            <img src={variant.thumbnail_url} alt={variant.color_name} className="w-full h-full object-cover transition-transform duration-300 group-hover/variant:scale-110" />
                                            {selectedVariant?.color_name === variant.color_name && (
                                                <div className="absolute -top-1 -right-1 w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]" />
                                            )}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Size Selection */}
                        <div className="space-y-4 pt-2">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <h3 className="text-[10px] uppercase tracking-[0.4em] text-zinc-500">Dimensions</h3>
                                <button className="text-[9px] uppercase tracking-widest text-zinc-500 hover:text-white underline">Calibration Guide</button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(product.sizes || ['XS', 'S', 'M', 'L', 'XL']).map(size => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`min-w-[44px] h-10 flex items-center justify-center text-[10px] border transition-all duration-300 px-3 ${
                                            selectedSize === size
                                                ? 'bg-white text-black border-white'
                                                : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-400'
                                        }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Primary Action */}
                        <div className="space-y-4 pt-4 md:pt-6">
                            <button
                                onClick={handleAddToCart}
                                disabled={isAddingToCart}
                                className="w-full py-5 md:py-7 bg-white text-black font-bold text-[11px] uppercase tracking-[0.4em] md:tracking-[0.8em] transition-all relative overflow-hidden group shadow-[0_0_50px_rgba(255,255,255,0.05)] btn-haptic"
                            >
                                <span className={`flex items-center justify-center gap-3 transition-transform duration-500 ${isAddingToCart ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'}`}>
                                    <ShoppingBag size={14} /> Add to Manifest
                                </span>
                                <span className={`absolute inset-0 flex items-center justify-center gap-3 transition-transform duration-500 ${isAddingToCart ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}>
                                    Processing...
                                </span>
                                <div className="absolute inset-0 bg-zinc-200 -translate-x-full group-hover:translate-x-full transition-all duration-1000 ease-in-out opacity-20 pointer-events-none"></div>
                            </button>
                            
                        </div>

                        {/* Content Tabs */}
                        <div className="pt-4 md:pt-8">
                            <ProductTabs tabs={tabs} />
                        </div>
                    </div>
                </div>

                {/* Reviews Section */}
                <div className="mt-16 md:mt-40 space-y-10 md:space-y-20">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 border-b border-white/5 pb-6">
                        <div className="space-y-1">
                            <p className="text-[9px] md:text-[10px] tracking-[0.4em] md:tracking-[0.6em] uppercase text-zinc-500">VOICES FROM THE VOID</p>
                            <h2 className="text-2xl md:text-4xl font-cinzel font-bold tracking-widest">USER MANIFESTS</h2>
                        </div>
                        <button 
                            onClick={() => setShowReviewForm(!showReviewForm)}
                            className="px-8 py-3 bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all"
                        >
                            {showReviewForm ? 'Abort Review' : 'Codify Your Experience'}
                        </button>
                    </div>

                    <AnimatePresence>
                        {showReviewForm && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="overflow-hidden"
                            >
                                <ReviewForm 
                                    productId={id!} 
                                    onSuccess={() => {
                                        setShowReviewForm(false);
                                        fetchReviews();
                                    }}
                                    onSubmit={submitReview}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <ReviewSection 
                        productId={id!} 
                        reviews={reviews} 
                        onMarkHelpful={markHelpful}
                    />
                </div>
            </div>
        </div>
    );
};

export default ProductDetails;
