import { useState, useCallback } from 'react';
import { supabase } from '../supabase';
import { useAuth } from '../context/AuthContext';

export interface OrderItem {
    id: string;
    product_id: string;
    quantity: number;
    price_at_time: number;
    color: string;
    size: string;
    product?: {
        name: string;
        image_url: string;
    }
}

export interface Order {
    id: string;
    user_id: string;
    subtotal: number;
    tax_amount: number;
    discount_amount: number;
    shipping_amount: number;
    total: number;
    status: 'pending' | 'completed' | 'cancelled';
    created_at: string;
    order_items: OrderItem[];
}

export const useUserOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = useCallback(async () => {
        if (!user) return [];
        
        setLoading(true);
        setError(null);
        
        try {
            const { data, error: supabaseError } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items (
                        *,
                        product:products (
                            name,
                            image_url
                        )
                    )
                `)
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (supabaseError) throw supabaseError;
            
            setOrders(data || []);
            return data || [];
        } catch (err: any) {
            console.error('Error fetching user orders:', err);
            setError(err.message);
            return [];
        } finally {
            setLoading(false);
        }
    }, [user]);

    return {
        orders,
        loading,
        error,
        fetchOrders
    };
};
