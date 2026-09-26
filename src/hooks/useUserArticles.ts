import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { Article } from './useHome';

export interface UseUserArticlesReturn {
  articles: Article[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  page: number;
  hasMore: boolean;
  refetch: () => Promise<void>;
  loadMore: () => Promise<void>;
}

function extractArticlesArray(resData: any): { articles: Article[]; hasMore: boolean } {
  let list: Article[] = [];
  let hasNext = false;

  if (Array.isArray(resData)) {
    list = resData;
  } else if (resData && typeof resData === 'object') {
    if (Array.isArray(resData.data)) list = resData.data;
    else if (Array.isArray(resData.articles)) list = resData.articles;
    else if (Array.isArray(resData.results)) list = resData.results;
    else if (Array.isArray(resData.items)) list = resData.items;

    if (typeof resData.next === 'string' && resData.next !== null) hasNext = true;
    if (typeof resData.has_more === 'boolean') hasNext = resData.has_more;
    if (typeof resData.hasNextPage === 'boolean') hasNext = resData.hasNextPage;
  }

  return { articles: list, hasMore: hasNext || list.length >= 10 };
}

export function useUserArticles(userId?: string | number | null): UseUserArticlesReturn {
  const [articles, setArticles] = useState<Article[]>([]);
  const [page, setPage] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const fetchArticles = useCallback(
    async (targetPage: number = 1, append: boolean = false) => {
      if (!userId) {
        setArticles([]);
        setLoading(false);
        setLoadingMore(false);
        return;
      }

      if (targetPage === 1) setLoading(true);
      else setLoadingMore(true);
      setError(null);

      try {
        console.log(`[useUserArticles] Fetching articles for user ${userId}, page ${targetPage}`);

        const response = await axiosInstance.get(`/articles/user/${userId}`, {
          params: { page: targetPage },
        });

        if (typeof response.data === 'string' && response.data.includes('<!doctype html>')) {
          throw new Error('Server internal error (HTTP 500)');
        }

        console.log(`[useUserArticles] User articles loaded successfully`);
        const { articles: newArticles, hasMore: more } = extractArticlesArray(response.data);

        setArticles((prev) => (append ? [...prev, ...newArticles] : newArticles));
        setHasMore(more);
      } catch (err: any) {
        console.warn(`[useUserArticles] API Error handled gracefully:`, err.message);
        const errorMessage =
          typeof err.response?.data === 'string' && err.response?.data.includes('<!doctype html>')
            ? 'Backend Server Error (500).'
            : err.response?.data?.message || err.message || 'Failed to fetch user articles';
        setError(errorMessage);
        if (!append) {
          setArticles([]);
        }
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    },
    [userId]
  );

  useEffect(() => {
    setPage(1);
    fetchArticles(1, false);
  }, [userId, fetchArticles]);

  const refetch = useCallback(async () => {
    setPage(1);
    await fetchArticles(1, false);
  }, [fetchArticles]);

  const loadMore = useCallback(async () => {
    if (loading || loadingMore || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    await fetchArticles(nextPage, true);
  }, [loading, loadingMore, hasMore, page, fetchArticles]);

  return {
    articles,
    loading,
    loadingMore,
    error,
    page,
    hasMore,
    refetch,
    loadMore,
  };
}
