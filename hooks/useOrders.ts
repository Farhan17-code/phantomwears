import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../supabase';
import { Order } from '../types';

export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(*, product:products(*))')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const stats = {
    totalRevenue: orders.reduce((sum, order) => sum + (order.status !== 'cancelled' ? Number(order.total) : 0), 0),
    totalOrders: orders.length,
    activeOrders: orders.filter(o => o.status === 'pending').length,
    totalItemsSold: orders.reduce((sum, order) => 
      sum + (order.status !== 'cancelled' ? (order.items?.reduce((iSum, item) => iSum + item.quantity, 0) || 0) : 0), 0
    )
  };

  return { orders, loading, error, stats, updateOrderStatus, refresh: fetchOrders };
};
