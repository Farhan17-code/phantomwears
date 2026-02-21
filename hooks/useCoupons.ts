import { useState, useCallback, useEffect } from 'react';
import { supabase } from '../supabase';
import { Coupon } from '../types';

export const useCoupons = () => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCoupons = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const addCoupon = async (coupon: Omit<Coupon, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .insert([coupon])
        .select();

      if (error) throw error;
      setCoupons(prev => [data[0], ...prev]);
      return data[0];
    } catch (err: any) {
      setError(err.message);
      return null;
    }
  };

  const toggleCoupon = async (id: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ is_active: isActive })
        .eq('id', id);

      if (error) throw error;
      setCoupons(prev => prev.map(c => c.id === id ? { ...c, is_active: isActive } : c));
    } catch (err: any) {
      setError(err.message);
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setCoupons(prev => prev.filter(c => c.id !== id));
    } catch (err: any) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [fetchCoupons]);

  return { coupons, loading, error, addCoupon, toggleCoupon, deleteCoupon, refresh: fetchCoupons };
};
