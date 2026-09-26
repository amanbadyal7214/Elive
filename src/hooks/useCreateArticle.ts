import { useCallback, useState } from 'react';
import axiosInstance from '../api/axiosInstance';

export interface CreateArticlePayload {
  post_title: string;
  content: string;
  category_id: number | string;
  subcategory_1_id?: number | string | null;
  subcategory_2_id?: number | string | null;
  status?: 'Draft' | 'Published' | string;
  image?: any;
  video?: any;
  token?: string;
}

export interface CreateArticleResponse {
  success?: boolean;
  message?: string;
  data?: any;
  article?: any;
  [key: string]: any;
}

export interface UseCreateArticleReturn {
  loading: boolean;
  error: string | null;
  success: boolean;
  createArticle: (payload: CreateArticlePayload) => Promise<CreateArticleResponse>;
  resetState: () => void;
}

export function useCreateArticle(): UseCreateArticleReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const resetState = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  const createArticle = useCallback(
    async (payload: CreateArticlePayload): Promise<CreateArticleResponse> => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const formData = new FormData();
        formData.append('post_title', payload.post_title);
        formData.append('content', payload.content);
        formData.append('category_id', String(payload.category_id));

        if (payload.subcategory_1_id != null) {
          formData.append('subcategory_1_id', String(payload.subcategory_1_id));
        }
        if (payload.subcategory_2_id != null) {
          formData.append('subcategory_2_id', String(payload.subcategory_2_id));
        }

        formData.append('status', payload.status || 'Draft');

        if (payload.image) {
          if (typeof payload.image === 'object' && payload.image.uri) {
            formData.append('image', {
              uri: payload.image.uri,
              name: payload.image.name || 'article.jpg',
              type: payload.image.type || 'image/jpeg',
            } as any);
          } else if (typeof payload.image === 'string') {
            formData.append('image', payload.image);
          }
        }

        if (payload.video) {
          if (typeof payload.video === 'object' && payload.video.uri) {
            formData.append('video', {
              uri: payload.video.uri,
              name: payload.video.name || 'article.mp4',
              type: payload.video.type || 'video/mp4',
            } as any);
          } else if (typeof payload.video === 'string') {
            formData.append('video', payload.video);
          }
        }

        const headers: Record<string, string> = {
          'Content-Type': 'multipart/form-data',
        };

        if (payload.token) {
          headers['Authorization'] = `Bearer ${payload.token}`;
        }

        console.log('[useCreateArticle] Submitting article payload:', {
          post_title: payload.post_title,
          category_id: payload.category_id,
          subcategory_1_id: payload.subcategory_1_id,
          subcategory_2_id: payload.subcategory_2_id,
          status: payload.status,
        });

        const response = await axiosInstance.post<CreateArticleResponse>('/articles/', formData, {
          headers,
        });

        console.log('[useCreateArticle] Article created successfully:', response.data);
        setSuccess(true);
        return response.data;
      } catch (err: any) {
        console.error('[useCreateArticle] API Error:', err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Failed to create article. Please check required fields and try again.';
        setError(errorMessage);
        throw new Error(errorMessage);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  return {
    loading,
    error,
    success,
    createArticle,
    resetState,
  };
}

export default useCreateArticle;
