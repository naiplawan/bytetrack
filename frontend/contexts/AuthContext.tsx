'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { toast } from 'sonner';
import { apiClient } from '@/lib/api-client';

interface User {
  id: string;
  email: string;
  name?: string;
  created_at: string;
  updated_at: string;
}

interface UserProfile {
  user_id: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  target_weight?: number;
  activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  goal?: 'lose_weight' | 'maintain_weight' | 'gain_weight';
  target_calories?: number;
  protein_target?: number;
  carb_target?: number;
  fat_target?: number;
  water_target?: number;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on app load
  useEffect(() => {
    const initializeAuth = async () => {
      setIsLoading(true);

      try {
        // Check for access token
        const accessToken = localStorage.getItem('access_token');
        const refreshToken = localStorage.getItem('refresh_token');

        if (accessToken && refreshToken) {
          // Set the token in the API client
          apiClient.setAuth(accessToken, refreshToken);

          try {
            // Try to get user profile
            const profileResponse = await apiClient.getProfile();
            if (profileResponse.success && profileResponse.data) {
              setProfile(profileResponse.data);

              // Try to get basic user info from token payload
              // In a real app, you'd have a /api/v1/user/me endpoint
              // For now, we'll create a minimal user object from profile
              setUser({
                id: profileResponse.data.user_id,
                email: '', // This would come from the token or another endpoint
                name: profileResponse.data.target_weight ?
                  `${profileResponse.data.gender === 'male' ? 'Mr.' : profileResponse.data.gender === 'female' ? 'Ms.' : ''} User` :
                  undefined,
                created_at: profileResponse.data.created_at,
                updated_at: profileResponse.data.updated_at,
              });
            }
          } catch (error) {
            console.error('Failed to load profile:', error);
            // If token is invalid, clear it
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.login(email, password);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Login failed');
      }

      const { user: userData } = response.data;
      setUser(userData);

      // Try to load profile after login
      await refreshProfile();

      toast.success('Welcome back!');
    } catch (error: any) {
      console.error('Login error:', error);
      toast.error(error.message || 'Failed to login. Please check your credentials.');
      throw error;
    }
  };

  const register = async (email: string, password: string, name?: string) => {
    try {
      const response = await apiClient.register(email, password, name);

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Registration failed');
      }

      const userData = response.data;
      setUser(userData);

      toast.success('Account created successfully! Please complete your profile.');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Failed to create account. Please try again.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error('Logout error:', error);
      // Even if logout API fails, clear local state
    } finally {
      setUser(null);
      setProfile(null);
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      toast.success('You have been logged out');
    }
  };

  const refreshProfile = async () => {
    try {
      const response = await apiClient.getProfile();

      if (response.success && response.data) {
        setProfile(response.data);

        // Update user object with name from profile
        setUser(prev => prev ? {
          ...prev,
          name: response.data?.target_weight ?
            `${response.data.gender === 'male' ? 'Mr.' : response.data.gender === 'female' ? 'Ms.' : ''} ${response.data.weight}kg Goal` :
            undefined,
        } : null);
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
      // Don't throw here as it's not critical
    }
  };

  const updateProfile = async (profileData: Partial<UserProfile>) => {
    try {
      const response = await apiClient.updateProfile(profileData);

      if (response.success && response.data) {
        setProfile(response.data);
        toast.success('Profile updated successfully!');
      } else {
        throw new Error(response.message || 'Failed to update profile');
      }
    } catch (error: any) {
      console.error('Update profile error:', error);
      toast.error(error.message || 'Failed to update profile');
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    profile,
    isLoading,
    isAuthenticated: !!user && !!profile,
    login,
    register,
    logout,
    refreshProfile,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Hook for protecting routes
export function useProtectedRoute(): { isLoading: boolean; isAuthenticated: boolean; profile: UserProfile | null } {
  const { isAuthenticated, profile, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      // Redirect to login page
      window.location.href = '/onboarding';
    }
  }, [isAuthenticated, isLoading]);

  return { isLoading, isAuthenticated, profile };
}