import { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

export interface ArticleAuthor {
  id?: number;
  full_name?: string;
  name?: string;
  image?: string | null;
  avatar?: string;
}

export interface ArticleCategory {
  id?: number;
  name?: string;
  title?: string;
  [key: string]: any;
}

export interface Article {
  _id?: string;
  id?: string | number;
  post_title?: string;
  title?: string | { rendered?: string; name?: string; [key: string]: any };
  subtitle?: string;
  description?: string;
  content?: string;
  category?: string | ArticleCategory;
  image?: string | null;
  imageUrl?: string;
  coverImage?: string;
  author?: string | ArticleAuthor;
  created_at?: string;
  createdAt?: string;
  publishedAt?: string;
  updated_at?: string | null;
  slug?: string;
  status?: string;
  is_sticky?: boolean;
  is_private?: boolean;
  allow_comments?: boolean;
  [key: string]: any;
}

export interface UseHomeReturn {
  breakingArticles: Article[];
  popularArticles: Article[];
  trendingArticles: Article[];
  latestArticles: Article[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

function extractArticlesArray(resData: any): Article[] {
  if (Array.isArray(resData)) {
    return resData;
  }
  if (resData && typeof resData === 'object') {
    if (Array.isArray(resData.data)) return resData.data;
    if (Array.isArray(resData.articles)) return resData.articles;
    if (Array.isArray(resData.result)) return resData.result;
    if (Array.isArray(resData.docs)) return resData.docs;
    if (Array.isArray(resData.items)) return resData.items;
  }
  return [];
}

export function useHome(): UseHomeReturn {
  const [breakingArticles, setBreakingArticles] = useState<Article[]>([]);
  const [popularArticles, setPopularArticles] = useState<Article[]>([]);
  const [trendingArticles, setTrendingArticles] = useState<Article[]>([]);
  const [latestArticles, setLatestArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHomeData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [breakingRes, popularRes, trendingRes, latestRes] = await Promise.all([
        axiosInstance.get('/articles/breaking').catch((err) => {
          console.error('[useHome] Breaking API Error:', err);
          return { data: [] };
        }),
        axiosInstance.get('/articles/popular').catch((err) => {
          console.error('[useHome] Popular API Error:', err);
          return { data: [] };
        }),
        axiosInstance.get('/articles/trending').catch((err) => {
          console.error('[useHome] Trending API Error:', err);
          return { data: [] };
        }),
        axiosInstance.get('/articles/latest').catch((err) => {
          console.error('[useHome] Latest API Error:', err);
          return { data: [] };
        }),
      ]);

      setBreakingArticles(extractArticlesArray(breakingRes.data));
      setPopularArticles(extractArticlesArray(popularRes.data));
      setTrendingArticles(extractArticlesArray(trendingRes.data));
      setLatestArticles(extractArticlesArray(latestRes.data));
    } catch (err: any) {
      console.error('[useHome] Fetch Error:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to fetch home articles.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  return {
    breakingArticles,
    popularArticles,
    trendingArticles,
    latestArticles,
    loading,
    error,
    refetch: fetchHomeData,
  };
}

export default useHome;
