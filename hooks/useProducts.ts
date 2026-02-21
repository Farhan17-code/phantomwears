import { useCallback } from 'react';
import { Product } from '../types';
import { supabase } from '../supabase';

export const useProducts = () => {

    const fetchProducts = useCallback(async (options?: { page?: number; limit?: number; category?: string; subcategoryId?: string }): Promise<{ products: Product[], count: number | null }> => {
        try {
            let query = supabase
                .from('products')
                .select('*', { count: 'exact' });

            if (options?.category && options.category !== 'All') {
                query = query.eq('category', options.category);
            }
            if (options?.subcategoryId && options.subcategoryId !== 'All') {
                query = query.eq('subcategory_id', options.subcategoryId);
            }

            query = query.order('created_at', { ascending: false });

            if (options?.page !== undefined && options?.limit !== undefined) {
                const from = options.page * options.limit;
                const to = from + options.limit - 1;
                query = query.range(from, to);
            }

            const { data, error, count } = await query;

            if (error) throw error;
            return { products: data || [], count };
        } catch (error) {
            console.error('Fetch products error:', error);
            return { products: [], count: 0 };
        }
    }, []);

    const addProduct = useCallback(async (product: Omit<Product, 'id' | 'createdAt'>) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .insert([product])
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Add product error:', error);
            throw error;
        }
    }, []);

    const updateProduct = useCallback(async (id: string, product: Partial<Product>) => {
        try {
            const { data, error } = await supabase
                .from('products')
                .update(product)
                .eq('id', id)
                .select()
                .single();

            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Update product error:', error);
            throw error;
        }
    }, []);

    const deleteProduct = useCallback(async (id: string) => {
        try {
            const { error } = await supabase
                .from('products')
                .delete()
                .eq('id', id);

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Delete product error:', error);
            throw error;
        }
    }, []);

    const getProductById = useCallback(async (id: string): Promise<Product | null> => {
        try {
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('id', id)
                .single();

            if (error) return null;
            return data;
        } catch (error) {
            console.error('Get product error:', error);
            return null;
        }
    }, []);

    return { fetchProducts, addProduct, updateProduct, deleteProduct, getProductById };
};
