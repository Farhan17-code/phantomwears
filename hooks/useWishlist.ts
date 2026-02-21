import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';
import { Product } from '../types';

export const useWishlist = () => {
  const { user, isAuthenticated } = useAuth();
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [wishlistProducts, setWishlistProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchWishlistIds = useCallback(async () => {
    if (!user || !isAuthenticated) return;
    
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select('product_id')
        .eq('user_id', user.id);

      if (error) throw error;
      setWishlistIds(data.map(item => item.product_id));
    } catch (err) {
      console.error('Error fetching wishlist IDs:', err);
    }
  }, [user, isAuthenticated]);

  const fetchWishlistProducts = useCallback(async () => {
    if (!user || !isAuthenticated) return;
    setLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('wishlist')
        .select(`
          product_id,
          products (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;
      
      const products = data
        .map(item => item.products)
        .filter(p => p !== null) as unknown as Product[];
        
      setWishlistProducts(products);
    } catch (err) {
      console.error('Error fetching wishlist products:', err);
    } finally {
      setLoading(false);
    }
  }, [user, isAuthenticated]);

  const toggleWishlist = useCallback(async (productId: string) => {
    if (!user || !isAuthenticated) return false;

    const isCurrentlyWishlisted = wishlistIds.includes(productId);

    try {
      if (isCurrentlyWishlisted) {
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', productId);

        if (error) throw error;
        setWishlistIds(prev => prev.filter(id => id !== productId));
        setWishlistProducts(prev => prev.filter(p => p.id !== productId));
      } else {
        const { error } = await supabase
          .from('wishlist')
          .insert({ user_id: user.id, product_id: productId });

        if (error) throw error;
        setWishlistIds(prev => [...prev, productId]);
      }
      return true;
    } catch (err) {
      console.error('Error toggling wishlist:', err);
      return false;
    }
  }, [user, isAuthenticated, wishlistIds]);

  const isWishlisted = useCallback((id: string) => wishlistIds.includes(id), [wishlistIds]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlistIds();
    } else {
      setWishlistIds([]);
      setWishlistProducts([]);
    }
  }, [isAuthenticated, fetchWishlistIds]);

  return {
    wishlistIds,
    wishlistProducts,
    loading,
    toggleWishlist,
    fetchWishlistProducts,
    isWishlisted
  };
};
