'use server';

import { apiClient } from '@/lib/api-client';

export async function getProfileAction() {
  try {
    const response = await apiClient.getProfile();

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to load profile');
    }

    return response.data;
  } catch (error) {
    console.error('Get profile error:', error);
    throw error;
  }
}

export async function completeOnboardingAction(profileData: any) {
  try {
    const response = await apiClient.completeOnboarding(profileData);

    if (!response.success) {
      throw new Error(response.message || 'Failed to complete onboarding');
    }

    return response.data;
  } catch (error) {
    console.error('Complete onboarding error:', error);
    throw error;
  }
}

export async function getOnboardingStatusAction() {
  try {
    const response = await apiClient.getOnboardingStatus();

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to get onboarding status');
    }

    return response.data;
  } catch (error) {
    console.error('Get onboarding status error:', error);
    throw error;
  }
}