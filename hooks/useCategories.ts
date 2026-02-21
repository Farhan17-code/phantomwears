import { useState, useCallback } from 'react';
import { supabase } from '../supabase';
import { Category } from '../types';

export const useCategories = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async (): Promise<Category[]> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true }); // Preserve insertion order for original ones

      if (sbError) throw sbError;
      return (data as Category[]) || [];
    } catch (err: any) {
      console.error('Error fetching categories:', err);
      setError(err.message || 'Error fetching categories');
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addCategory = async (categoryData: Omit<Category, 'id' | 'created_at'>): Promise<Category | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from('categories')
        .insert([categoryData])
        .select()
        .single();

      if (sbError) throw sbError;
      return data as Category;
    } catch (err: any) {
      console.error('Error adding category:', err);
      setError(err.message || 'Error adding category');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>): Promise<Category | null> => {
    setIsLoading(true);
    setError(null);
    try {
      const { data, error: sbError } = await supabase
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (sbError) throw sbError;
      return data as Category;
    } catch (err: any) {
      console.error('Error updating category:', err);
      setError(err.message || 'Error updating category');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      const { error: sbError } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (sbError) throw sbError;
      return true;
    } catch (err: any) {
      console.error('Error deleting category:', err);
      setError(err.message || 'Error deleting category');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    fetchCategories,
    addCategory,
    updateCategory,
    deleteCategory,
    isLoading,
    error,
  };
};
