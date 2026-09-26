import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

export interface SubCategory2 {
  id: number;
  name: string;
  code?: string | null;
  icon?: string | null;
  image?: string | null;
  is_verified?: boolean;
  [key: string]: any;
}

export interface SubCategory1 {
  id: number;
  name: string;
  code?: string | null;
  icon?: string | null;
  image?: string | null;
  is_verified?: boolean;
  subcategories_2?: SubCategory2[];
  [key: string]: any;
}

export interface Category {
  id: number;
  name: string;
  code?: string | null;
  icon?: string | null;
  image?: string | null;
  is_verified?: boolean;
  subcategories_1?: SubCategory1[];
  [key: string]: any;
}

export interface UseCategoriesReturn {
  categories: Category[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function extractCategoriesArray(resData: any): Category[] {
  if (Array.isArray(resData)) {
    return resData;
  }
  if (resData && typeof resData === 'object') {
    if (Array.isArray(resData.data)) return resData.data;
    if (Array.isArray(resData.categories)) return resData.categories;
    if (Array.isArray(resData.result)) return resData.result;
    if (Array.isArray(resData.items)) return resData.items;
  }
  return [];
}

export function useCategories(): UseCategoriesReturn {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get('/categories/');
      console.log('[useCategories] Categories loaded successfully:', response.data?.length || 0, 'items');
      const parsed = extractCategoriesArray(response.data);
      setCategories(parsed);
    } catch (err: any) {
      console.error('[useCategories] API Error:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch categories.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return {
    categories,
    loading,
    error,
    refetch: fetchCategories,
  };
}

export default useCategories;
