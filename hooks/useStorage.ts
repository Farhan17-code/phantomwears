import { useState } from 'react';
import { supabase } from '../supabase';

export const useStorage = () => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const uploadImage = async (file: File, path: string): Promise<string | null> => {
        setUploading(true);
        setError(null);
        setProgress(0);

        try {
            // Check if file already exists or create unique path
            const { data, error: uploadError } = await supabase.storage
                .from('products')
                .upload(path, file, {
                    cacheControl: '3600',
                    upsert: true
                });

            if (uploadError) throw uploadError;

            // Get public URL
            const { data: { publicUrl } } = supabase.storage
                .from('products')
                .getPublicUrl(data.path);

            setUploading(false);
            setProgress(100);
            return publicUrl;
        } catch (err: any) {
            console.error('Upload failed:', err);
            setError(err.message || 'Upload failed');
            setUploading(false);
            return null;
        }
    };

    const deleteImage = async (url: string): Promise<boolean> => {
        setError(null);
        try {
            // Extract path from URL
            // URL format: https://[project].supabase.co/storage/v1/object/public/products/[filename]
            const parts = url.split('/products/');
            if (parts.length < 2) return false;
            const path = parts[1];

            const { error: deleteError } = await supabase.storage
                .from('products')
                .remove([path]);

            if (deleteError) throw deleteError;
            return true;
        } catch (err: any) {
            console.error('Delete failed:', err);
            setError(err.message || 'Delete failed');
            return false;
        }
    };

    return { uploadImage, deleteImage, uploading, progress, error };
};