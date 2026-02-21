import { useCallback } from 'react';
import { supabase } from '../supabase';
import { Subcategory } from '../types';

export const useSubcategories = () => {
    const fetchSubcategories = useCallback(async () => {
        const { data, error } = await supabase
            .from('subcategories')
            .select('*')
            .order('name', { ascending: true });
        
        if (error) {
            console.error('Error fetching subcategories:', error);
            return [];
        }
        return data as Subcategory[];
    }, []);

    const addSubcategory = useCallback(async (subcategory: Omit<Subcategory, 'id' | 'created_at'>) => {
        const { data, error } = await supabase
            .from('subcategories')
            .insert([subcategory])
            .select()
            .single();

        if (error) throw error;
        return data as Subcategory;
    }, []);

    const updateSubcategory = useCallback(async (id: string, updates: Partial<Subcategory>) => {
        const { data, error } = await supabase
            .from('subcategories')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as Subcategory;
    }, []);

    const deleteSubcategory = useCallback(async (id: string) => {
        const { error } = await supabase
            .from('subcategories')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }, []);

    return {
        fetchSubcategories,
        addSubcategory,
        updateSubcategory,
        deleteSubcategory
    };
};
