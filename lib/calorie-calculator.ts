// Comprehensive calorie and nutrition calculator

export type Gender = 'male' | 'female' | 'other';

// Calculate Basal Metabolic Rate (BMR) using the Mifflin-St Jeor Equation
export function calculateBMR(
  weight: number, // in kg
  height: number, // in cm
  age: number,
  gender: Gender
): number {
  if (gender === 'male') {
    return Math.round(10 * weight + 6.25 * height - 5 * age + 5);
  } else {
    return Math.round(10 * weight + 6.25 * height - 5 * age - 161);
  }
}

// Calculate Total Daily Energy Expenditure (TDEE)
export function calculateTDEE(bmr: number, activityLevel: string): number {
  const activityFactors: Record<string, number> = {
    sedentary: 1.2, // Little or no exercise
    light: 1.375, // Light exercise/sports 1-3 days/week
    moderate: 1.55, // Moderate exercise/sports 3-5 days/week
    very: 1.725, // Hard exercise/sports 6-7 days a week
    extreme: 1.9, // Very hard exercise/sports & physical job
  };

  return Math.round(bmr * (activityFactors[activityLevel] || 1.2));
}

// Calculate target calories based on goal
export function calculateTargetCalories(tdee: number, goal: string): number {
  switch (goal) {
    case 'loseWeight':
      return Math.round(tdee - 500); // 500 calorie deficit for ~1 lb/week loss
    case 'gainWeight':
      return Math.round(tdee + 500); // 500 calorie surplus for ~1 lb/week gain
    case 'maintainWeight':
    default:
      return tdee;
  }
}

// Calculate macronutrient targets
export interface MacroTargets {
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  proteinCalories: number;
  carbsCalories: number;
  fatCalories: number;
}

export function calculateMacroTargets(targetCalories: number, goal: string = 'maintainWeight'): MacroTargets {
  let proteinPercent: number;
  let carbsPercent: number;
  let fatPercent: number;

  switch (goal) {
    case 'loseWeight':
      proteinPercent = 0.3; // Higher protein for muscle preservation
      carbsPercent = 0.4;
      fatPercent = 0.3;
      break;
    case 'gainWeight':
      proteinPercent = 0.25;
      carbsPercent = 0.5;
      fatPercent = 0.25;
      break;
    case 'maintainWeight':
    default:
      proteinPercent = 0.25;
      carbsPercent = 0.45;
      fatPercent = 0.3;
      break;
  }

  const proteinCalories = Math.round(targetCalories * proteinPercent);
  const carbsCalories = Math.round(targetCalories * carbsPercent);
  const fatCalories = Math.round(targetCalories * fatPercent);

  return {
    protein: Math.round(proteinCalories / 4), // 4 calories per gram
    carbs: Math.round(carbsCalories / 4), // 4 calories per gram
    fat: Math.round(fatCalories / 9), // 9 calories per gram
    proteinCalories,
    carbsCalories,
    fatCalories,
  };
}

// Calculate ideal weight range based on BMI
export function calculateIdealWeightRange(height: number): { min: number; max: number } {
  const heightInMeters = height / 100;
  const minBMI = 18.5;
  const maxBMI = 24.9;

  return {
    min: Math.round(minBMI * heightInMeters * heightInMeters),
    max: Math.round(maxBMI * heightInMeters * heightInMeters),
  };
}

// Calculate BMI
export function calculateBMI(weight: number, height: number): number {
  const heightInMeters = height / 100;
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
}

// Get BMI category
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal weight';
  if (bmi < 30) return 'Overweight';
  return 'Obese';
}

// Calculate water intake recommendation (liters)
export function calculateWaterIntake(weight: number, activityLevel: string): number {
  const baseWater = weight * 0.033; // 33ml per kg of body weight

  const activityMultiplier: Record<string, number> = {
    sedentary: 1.0,
    light: 1.1,
    moderate: 1.2,
    very: 1.3,
    extreme: 1.4,
  };

  return Math.round(baseWater * (activityMultiplier[activityLevel] || 1.0) * 10) / 10;
}

// Calculate calories burned from exercise
export function calculateCaloriesBurned(
  weight: number,
  activityType: string,
  duration: number // in minutes
): number {
  // MET (Metabolic Equivalent of Task) values for different activities
  const metValues: Record<string, number> = {
    walking: 3.5,
    jogging: 7.0,
    running: 10.0,
    cycling: 8.0,
    swimming: 8.0,
    yoga: 3.0,
    strength: 6.0,
    dancing: 5.0,
    hiking: 6.0,
    basketball: 8.0,
    tennis: 7.0,
    soccer: 10.0,
  };

  const met = metValues[activityType] || 4.0;
  const caloriesPerMinute = (met * weight * 3.5) / 200;

  return Math.round(caloriesPerMinute * duration);
}

// Calculate estimated weight loss/gain timeline
export function calculateWeightChangeTimeline(
  currentWeight: number,
  targetWeight: number,
  weeklyDeficitOrSurplus: number // calories per week
): { weeks: number; months: number; safeRate: boolean } {
  const weightDifference = Math.abs(targetWeight - currentWeight);
  const caloriesPerKg = 7700; // approximately 7,700 calories per kg of body weight
  const totalCaloriesNeeded = weightDifference * caloriesPerKg;
  const weeks = Math.ceil(totalCaloriesNeeded / Math.abs(weeklyDeficitOrSurplus));
  const months = Math.round((weeks / 4.33) * 10) / 10;

  // Safe rate is 0.5-1 kg per week
  const weeklyWeightChange = Math.abs(weeklyDeficitOrSurplus) / caloriesPerKg;
  const safeRate = weeklyWeightChange >= 0.25 && weeklyWeightChange <= 1.0;

  return { weeks, months, safeRate };
}
