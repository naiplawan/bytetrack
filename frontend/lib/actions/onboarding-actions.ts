'use server';

import { calculateBMR, calculateTDEE, calculateTargetCalories, calculateMacroTargets, calculateWaterIntake } from '@/lib/calorie-calculator';

export interface Step2Data {
  name?: string;
  email?: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
}

export async function validateStep2(data: Step2Data): Promise<{ valid: boolean; errors?: { [key: string]: string } }> {
  const errors: { [key: string]: string } = {};

  if (!data.name?.trim()) {
    errors.name = 'Name is required';
  }

  if (!data.email?.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  if (!data.age || data.age < 1 || data.age > 120) {
    errors.age = 'Please enter a valid age (1-120)';
  }

  if (!data.gender) {
    errors.gender = 'Gender is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
}

export async function saveStep2Data(data: Step2Data) {
  // In a real app, this would save to a database or cache
  // For now, we'll just validate and return success
  const validation = await validateStep2(data);

  if (!validation.valid) {
    throw new Error('Validation failed');
  }

  return { success: true, data };
}