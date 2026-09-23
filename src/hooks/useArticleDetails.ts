import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Article } from './useHome';

export interface UseArticleDetailsReturn {
  article: Article | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useArticleDetails(id: string | number | undefined | null): UseArticleDetailsReturn {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticleDetails = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.get(`/articles/${id}`);
      console.log(`[useArticleDetails] API Response for ID ${id}:`, response.data);

      const resData = response.data as any;
      let articleData: Article | null = null;

      if (resData && typeof resData === 'object') {
        if (resData.data && typeof resData.data === 'object' && !Array.isArray(resData.data)) {
          articleData = resData.data;
        } else if (resData.article && typeof resData.article === 'object' && !Array.isArray(resData.article)) {
          articleData = resData.article;
        } else {
          articleData = resData;
        }
      }

      setArticle(articleData);
    } catch (err: any) {
      console.error(`[useArticleDetails] API Error for ID ${id}:`, err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        `Failed to fetch article details for ID ${id}`;
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchArticleDetails();
  }, [fetchArticleDetails]);

  return {
    article,
    loading,
    error,
    refetch: fetchArticleDetails,
  };
}

export default useArticleDetails;
