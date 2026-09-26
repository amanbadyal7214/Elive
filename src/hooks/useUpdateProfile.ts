import { useCallback, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { setStorageItem } from '../utils/storage';
import { User } from './useAuth';

export interface UpdateProfilePayload {
  full_name?: string;
  gender?: string;
  mobile?: string;
  description?: string;
  image?: any;
}

export interface UpdateProfileResponse {
  success: boolean;
  message: string;
  data?: User;
  user?: User;
  [key: string]: any;
}

export interface UseUpdateProfileReturn {
  loading: boolean;
  error: string | null;
  success: boolean;
  updateProfile: (payload: UpdateProfilePayload) => Promise<User>;
  clearState: () => void;
}

export function useUpdateProfile(): UseUpdateProfileReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const clearState = useCallback(() => {
    setLoading(false);
    setError(null);
    setSuccess(false);
  }, []);

  const updateProfile = useCallback(
    async (payload: UpdateProfilePayload): Promise<User> => {
      setLoading(true);
      setError(null);
      setSuccess(false);

      try {
        const formData = new FormData();
        if (payload.full_name != null) formData.append('full_name', payload.full_name);
        if (payload.gender != null) formData.append('gender', payload.gender);
        if (payload.mobile != null) formData.append('mobile', payload.mobile);
        if (payload.description != null) formData.append('description', payload.description);

        if (payload.image) {
          if (typeof payload.image === 'object' && payload.image.uri) {
            formData.append('image', {
              uri: payload.image.uri,
              name: payload.image.name || 'profile.jpg',
              type: payload.image.type || 'image/jpeg',
            } as any);
          } else if (typeof payload.image === 'string') {
            formData.append('image', payload.image);
          }
        }

        console.log('[useUpdateProfile] Sending PUT /auth/profile:', {
          full_name: payload.full_name,
          gender: payload.gender,
          mobile: payload.mobile,
          description: payload.description,
        });

        const response = await axiosInstance.put<UpdateProfileResponse>('/auth/profile', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        console.log('[useUpdateProfile] Profile updated successfully:', response.data);

        const updatedUser = response.data.data || response.data.user || (payload as any);
        if (updatedUser) {
          await setStorageItem('user', JSON.stringify(updatedUser));
        }

        setSuccess(true);
        return updatedUser;
      } catch (err: any) {
        console.error('[useUpdateProfile] API Error:', err);
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          'Failed to update profile. Please try again.';
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
    updateProfile,
    clearState,
  };
}

export default useUpdateProfile;
