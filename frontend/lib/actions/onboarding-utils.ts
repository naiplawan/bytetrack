'use server';

import { Step2Data } from './onboarding-actions';

// Cache for onboarding data in server storage
// In a real app, this would use a database or proper caching solution
const onboardingCache = new Map<string, any>();

export async function cacheOnboardingData(step: number, data: any) {
  const cacheKey = `onboarding_step_${step}`;
  onboardingCache.set(cacheKey, data);
  return { success: true };
}

export async function getCachedOnboardingData(step: number) {
  const cacheKey = `onboarding_step_${step}`;
  return onboardingCache.get(cacheKey);
}

export async function getAllCachedData() {
  const result: any = {};
  for (const [key, value] of onboardingCache) {
    const stepMatch = key.match(/onboarding_step_(\d+)/);
    if (stepMatch) {
      result[stepMatch[1]] = value;
    }
  }
  return result;
}

export async function clearCachedData() {
  onboardingCache.clear();
  return { success: true };
}