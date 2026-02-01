'use server';

import { apiClient } from '@/lib/api-client';
import { redirect } from 'next/navigation';

export async function loginAction(prevState: any, formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
      return { error: 'Email and password are required' };
    }

    const response = await apiClient.login(email, password);

    if (!response.success || !response.data) {
      return { error: response.message || 'Login failed' };
    }

    // Redirect to dashboard after successful login
    redirect('/dashboard');
  } catch (error: any) {
    console.error('Login error:', error);
    return { error: error.message || 'Failed to login. Please check your credentials.' };
  }
}

export async function registerAction(prevState: any, formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;

    if (!email || !password) {
      return { error: 'Email and password are required' };
    }

    const response = await apiClient.register(email, password, name);

    if (!response.success || !response.data) {
      return { error: response.message || 'Registration failed' };
    }

    // Redirect to onboarding after successful registration
    redirect('/onboarding');
  } catch (error: any) {
    console.error('Registration error:', error);
    return { error: error.message || 'Failed to create account. Please try again.' };
  }
}

export async function logoutAction() {
  try {
    await apiClient.logout();
  } catch (error) {
    console.error('Logout error:', error);
    // Even if logout API fails, clear local state
  } finally {
    redirect('/');
  }
}

export async function updateProfileAction(prevState: any, formData: FormData) {
  try {
    const profileData = {
      age: formData.get('age') ? parseInt(formData.get('age') as string) : undefined,
      gender: formData.get('gender') as 'male' | 'female' | 'other' || undefined,
      height: formData.get('height') ? parseInt(formData.get('height') as string) : undefined,
      weight: formData.get('weight') ? parseInt(formData.get('weight') as string) : undefined,
      target_weight: formData.get('target_weight') ? parseInt(formData.get('target_weight') as string) : undefined,
      activity_level: formData.get('activity_level') as any || undefined,
      goal: formData.get('goal') as 'lose_weight' | 'maintain_weight' | 'gain_weight' || undefined,
    };

    const response = await apiClient.updateProfile(profileData);

    if (!response.success || !response.data) {
      return { error: response.message || 'Failed to update profile' };
    }

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Update profile error:', error);
    return { error: error.message || 'Failed to update profile' };
  }
}