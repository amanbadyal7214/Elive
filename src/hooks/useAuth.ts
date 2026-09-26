import { useCallback, useState } from 'react';
import axiosInstance from '../api/axiosInstance';
import { getStorageItem, removeStorageItem, setStorageItem } from '../utils/storage';

export interface User {
  id: number | string;
  full_name: string;
  email: string;
  mobile?: string;
  gender?: string;
  image?: string | null;
  is_verified?: boolean;
  is_admin?: boolean;
  status?: string;
  [key: string]: any;
}

export interface RegisterPayload {
  full_name: string;
  email: string;
  password?: string;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  email: string;
  verification_required: boolean;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface AuthSuccessResponse {
  success: boolean;
  message: string;
  token: string;
  user: User;
  [key: string]: any;
}

export interface ResendOtpPayload {
  email: string;
}

export interface ResendOtpResponse {
  success: boolean;
  message: string;
}

export interface LoginPayload {
  email: string;
  password?: string;
}

export interface UseAuthReturn {
  loading: boolean;
  error: string | null;
  register: (payload: RegisterPayload) => Promise<RegisterResponse>;
  verifyOtp: (payload: VerifyOtpPayload) => Promise<AuthSuccessResponse>;
  resendVerification: (payload: ResendOtpPayload) => Promise<ResendOtpResponse>;
  login: (payload: LoginPayload) => Promise<AuthSuccessResponse>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Helper to save login/verify response in SecureStore
export async function saveAuthResponse(data: AuthSuccessResponse): Promise<void> {
  try {
    if (data.token) {
      await setStorageItem('token', data.token);
    }
    if (data.user) {
      await setStorageItem('user', JSON.stringify(data.user));
    }
    await setStorageItem('auth_data', JSON.stringify(data));
    console.log('[useAuth] Successfully saved auth data to SecureStore');
  } catch (error) {
    console.error('[useAuth] Error saving auth data to SecureStore:', error);
  }
}

// Helper to clear auth from SecureStore
export async function clearAuthData(): Promise<void> {
  await removeStorageItem('token');
  await removeStorageItem('user');
  await removeStorageItem('auth_data');
  console.log('[useAuth] Cleared auth data from SecureStore');
}

export function useAuth(): UseAuthReturn {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // 1. Register User (POST /api/auth/register)
  const register = useCallback(async (payload: RegisterPayload): Promise<RegisterResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post<RegisterResponse>('/auth/register', payload);
      console.log('[useAuth] Register Response:', response.data);
      return response.data;
    } catch (err: any) {
      console.error('[useAuth] Register Error:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Registration failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // 2. Verify OTP (POST /api/auth/verify-otp)
  const verifyOtp = useCallback(async (payload: VerifyOtpPayload): Promise<AuthSuccessResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post<AuthSuccessResponse>('/auth/verify-otp', payload);
      console.log('[useAuth] Verify OTP Response:', response.data);

      if (response.data && response.data.token) {
        await saveAuthResponse(response.data);
      }

      return response.data;
    } catch (err: any) {
      console.error('[useAuth] Verify OTP Error:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'OTP verification failed. Please try again.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // 3. Resend Verification OTP (POST /api/auth/send-verification)
  const resendVerification = useCallback(async (payload: ResendOtpPayload): Promise<ResendOtpResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post<ResendOtpResponse>('/auth/send-verification', payload);
      console.log('[useAuth] Resend Verification Response:', response.data);
      return response.data;
    } catch (err: any) {
      console.error('[useAuth] Resend Verification Error:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Failed to resend verification code.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // 4. Login (POST /api/auth/login) - Saves response data to SecureStore
  const login = useCallback(async (payload: LoginPayload): Promise<AuthSuccessResponse> => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosInstance.post<AuthSuccessResponse>('/auth/login', payload);
      console.log('[useAuth] Login Response:', response.data);

      // Save token, user, and response data into SecureStore
      if (response.data) {
        await saveAuthResponse(response.data);
      }

      return response.data;
    } catch (err: any) {
      console.error('[useAuth] Login Error:', err);
      const errorMessage =
        err.response?.data?.message ||
        err.message ||
        'Login failed. Please check your credentials.';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  // 5. Logout
  const logout = useCallback(async (): Promise<void> => {
    setLoading(true);
    try {
      await clearAuthData();
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    register,
    verifyOtp,
    resendVerification,
    login,
    logout,
    clearError,
  };
}

export default useAuth;
