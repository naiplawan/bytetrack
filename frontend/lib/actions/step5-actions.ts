'use server';

import { calculateBMR, calculateTDEE, calculateTargetCalories, calculateMacroTargets, calculateWaterIntake } from '@/lib/calorie-calculator';
import { getProfileAction, completeOnboardingAction } from '@/lib/actions/profile-actions';

export interface Step5Data {
  goal?: 'lose_weight' | 'maintain_weight' | 'gain_weight';
}

export interface ProfileData {
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  target_weight: number;
  activity_level: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  goal: 'lose_weight' | 'maintain_weight' | 'gain_weight';
  target_calories: number;
  protein_target: number;
  carb_target: number;
  fat_target: number;
  water_target: number;
}

export async function validateStep5(data: Step5Data): Promise<{ valid: boolean; errors?: { [key: string]: string } }> {
  const errors: { [key: string]: string } = {};

  if (!data.goal) {
    errors.goal = 'Goal is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
}

export async function saveStep5Data(goal: 'lose_weight' | 'maintain_weight' | 'gain_weight', cachedData: any) {
  const validation = await validateStep5({ goal });

  if (!validation.valid) {
    throw new Error('Validation failed');
  }

  // Get previous steps data
  const { age, gender, height, weight, target_weight, activity_level } = cachedData;

  if (!age || !gender || !height || !weight || !activity_level) {
    throw new Error('Missing required data from previous steps');
  }

  // Calculate nutrition targets
  const bmr = calculateBMR(age, gender, height, weight);
  const tdee = calculateTDEE(bmr, activity_level);
  const targetCalories = calculateTargetCalories(tdee, goal);
  const macroTargets = calculateMacroTargets(targetCalories, goal);
  const waterTarget = calculateWaterIntake(weight, activity_level);

  // Prepare profile data
  const profileData: ProfileData = {
    age,
    gender,
    height,
    weight,
    target_weight: target_weight || weight,
    activity_level,
    goal,
    target_calories: targetCalories,
    protein_target: macroTargets.protein,
    carb_target: macroTargets.carbs,
    fat_target: macroTargets.fat,
    water_target: waterTarget,
  };

  // Submit to backend
  await completeOnboardingAction(profileData);

  return { success: true, profileData };
}