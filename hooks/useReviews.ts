import { useState, useCallback } from 'react';
import { Review } from '../types';
import { supabase } from '../supabase';

export const useReviews = (productId: string) => {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchReviews = useCallback(async () => {
        if (!productId) return;
        setIsLoading(true);
        setError(null);
        try {
            const { data, error: err } = await supabase
                .from('reviews')
                .select('*')
                .eq('product_id', productId)
                .order('created_at', { ascending: false });

            if (err) throw err;
            setReviews(data || []);
        } catch (err: any) {
            console.error('Fetch reviews error:', err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [productId]);

    const submitReview = useCallback(async (reviewData: Omit<Review, 'id' | 'created_at' | 'helpful_count' | 'is_verified'>) => {
        setIsLoading(true);
        setError(null);
        try {
            const { data, error: err } = await supabase
                .from('reviews')
                .insert([{
                    ...reviewData,
                    product_id: productId,
                    is_verified: true,
                    helpful_count: 0
                }])
                .select()
                .single();

            if (err) throw err;
            setReviews(prev => [data, ...prev]);
            return data;
        } catch (err: any) {
            console.error('Submit review error:', err);
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, [productId]);

    const markHelpful = useCallback(async (reviewId: string) => {
        try {
            // Optimistic update
            setReviews(prev => prev.map(r => 
                r.id === reviewId ? { ...r, helpful_count: r.helpful_count + 1 } : r
            ));

            const { data: current, error: getError } = await supabase
                .from('reviews')
                .select('helpful_count')
                .eq('id', reviewId)
                .single();

            if (getError) throw getError;

            const { error: patchError } = await supabase
                .from('reviews')
                .update({ helpful_count: (current?.helpful_count || 0) + 1 })
                .eq('id', reviewId);

            if (patchError) throw patchError;
        } catch (err) {
            console.error('Mark helpful error:', err);
            // Revert could be implemented here if needed
        }
    }, []);

    return { reviews, isLoading, error, fetchReviews, submitReview, markHelpful };
};
