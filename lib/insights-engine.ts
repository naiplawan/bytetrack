// Smart Insights Engine - AI-powered recommendations and analysis

import { getMealsByDate, getMacrosForDay } from './meal-service';
import { getDailyStats, getCurrentStreak, getWeightEntries } from './analytics-service';
import { searchLocalFoods, type FoodItem } from './food-api';

export interface Insight {
  id: string;
  type: 'achievement' | 'warning' | 'tip' | 'recommendation' | 'pattern';
  title: string;
  description: string;
  icon: string;
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
  action?: {
    label: string;
    callback: () => void;
  };
}

export interface MealPattern {
  type: string;
  consistency: number; // 0-100
  avgCalories: number;
  avgTime: string;
  recommendation: string;
}

export interface NutritionalGap {
  nutrient: string;
  current: number;
  target: number;
  gap: number;
  foods: FoodItem[];
}

// Analyze meal timing patterns
export async function analyzeMealPatterns(): Promise<MealPattern[]> {
  const patterns: MealPattern[] = [];
  const mealTypes = ['breakfast', 'lunch', 'dinner', 'snack'];

  const stats = await getDailyStats(14); // Last 14 days

  for (const type of mealTypes) {
    const typeMeals: { date: Date; calories: number }[] = [];

    for (const s of stats) {
      const meals = await getMealsByDate(s.date);
      if (meals.some((m) => m.mealType === type)) {
        const typeMeal = meals.find((m) => m.mealType === type);
        typeMeals.push({
          date: s.date,
          calories: typeMeal?.calories || 0,
        });
      }
    }

    if (typeMeals.length > 0) {
      const consistency = (typeMeals.length / 14) * 100;
      const avgCalories = Math.round(
        typeMeals.reduce((sum, m) => sum + m.calories, 0) / typeMeals.length
      );

      let recommendation = '';
      if (consistency < 50) {
        recommendation = `Try logging ${type} more consistently. Regular meals help maintain energy levels.`;
      } else if (avgCalories < 200 && type !== 'snack') {
        recommendation = `Consider adding more nutrients to your ${type}.`;
      } else if (avgCalories > 800 && type === 'dinner') {
        recommendation = `Large dinners may affect sleep. Consider eating earlier.`;
      } else {
        recommendation = `Great job on ${type} consistency!`;
      }

      patterns.push({
        type,
        consistency: Math.round(consistency),
        avgCalories,
        avgTime: 'varies',
        recommendation,
      });
    }
  }

  return patterns;
}

// Identify nutritional gaps
export async function identifyNutritionalGoals(
  proteinTarget: number,
  carbsTarget: number,
  fatTarget: number
): Promise<NutritionalGap[]> {
  const gaps: NutritionalGap[] = [];
  const macros = await getMacrosForDay(new Date());

  const targets = {
    Protein: { current: macros.protein, target: proteinTarget },
    Carbs: { current: macros.carbs, target: carbsTarget },
    Fat: { current: macros.fat, target: fatTarget },
  };

  // Get food suggestions for each nutrient
  const proteinFoods = searchLocalFoods('', '').filter(
    (f) => f.nutrition.protein > 20
  ).slice(0, 5);
  const carbFoods = searchLocalFoods('', '').filter(
    (f) => f.nutrition.carbs > 30
  ).slice(0, 5);
  const healthyFatFoods = searchLocalFoods('', '').filter(
    (f) => f.nutrition.fat > 10 && f.nutrition.calories < 400
  ).slice(0, 5);

  Object.entries(targets).forEach(([nutrient, data]) => {
    const gap = data.target - data.current;
    if (gap > 0) {
      let foods: FoodItem[] = [];
      if (nutrient === 'Protein') foods = proteinFoods;
      else if (nutrient === 'Carbs') foods = carbFoods;
      else foods = healthyFatFoods;

      gaps.push({
        nutrient,
        current: data.current,
        target: data.target,
        gap: Math.round(gap),
        foods,
      });
    }
  });

  return gaps;
}

export interface UserDataInput {
  macroTargets?: { protein?: number; carbs?: number; fat?: number };
  waterTarget?: number;
}

// Generate personalized recommendations
export async function generateRecommendations(
  calorieGoal: number,
  userData?: UserDataInput
): Promise<Insight[]> {
  const insights: Insight[] = [];
  const dailyStats = await getDailyStats(1, calorieGoal);
  const todayStats = dailyStats[0];
  const streak = await getCurrentStreak();
  const weeklyStats = await getDailyStats(7, calorieGoal);
  const avgWeeklyCalories = Math.round(
    weeklyStats.reduce((sum, s) => sum + s.calories, 0) / 7
  );

  // Streak insights
  if (streak >= 7) {
    insights.push({
      id: 'streak-' + streak,
      type: 'achievement',
      title: `${streak}-Day Streak!`,
      description: `You've logged meals for ${streak} days straight. Keep it up!`,
      icon: '🔥',
      priority: 'high',
      actionable: false,
    });
  } else if (streak >= 3) {
    insights.push({
      id: 'streak-' + streak,
      type: 'achievement',
      title: 'Building Momentum',
      description: `${streak} days logged! You're forming a healthy habit.`,
      icon: '⭐',
      priority: 'medium',
      actionable: false,
    });
  }

  // Calorie insights
  if (todayStats.calories === 0) {
    insights.push({
      id: 'no-logs-today',
      type: 'warning',
      title: 'No Meals Logged Today',
      description: 'Start tracking to stay on top of your goals!',
      icon: '📝',
      priority: 'high',
      actionable: true,
      action: {
        label: 'Log Now',
        callback: () => {
          window.location.href = '/meals/add';
        },
      },
    });
  } else if (todayStats.calories > calorieGoal + 300) {
    insights.push({
      id: 'over-calories',
      type: 'warning',
      title: 'Over Daily Goal',
      description: `You've exceeded your goal by ${todayStats.calories - calorieGoal} kcal.`,
      icon: '⚠️',
      priority: 'medium',
      actionable: true,
      action: {
        label: 'View Details',
        callback: () => {
          window.location.href = '/analytics';
        },
      },
    });
  } else if (todayStats.calories < calorieGoal - 500 && todayStats.calories > 0) {
    insights.push({
      id: 'under-calories',
      type: 'tip',
      title: 'Fuel Your Body',
      description: `You have ${calorieGoal - todayStats.calories} kcal remaining. Don't underfuel!`,
      icon: '💡',
      priority: 'medium',
      actionable: true,
      action: {
        label: 'Add Meal',
        callback: () => {
          window.location.href = '/meals/add';
        },
      },
    });
  }

  // Protein insights
  const proteinTarget = userData?.macroTargets?.protein || 120;
  if (todayStats.protein < proteinTarget * 0.5 && todayStats.calories > 0) {
    insights.push({
      id: 'low-protein',
      type: 'recommendation',
      title: 'Boost Your Protein',
      description: `You're at ${Math.round((todayStats.protein / proteinTarget) * 100)}% of your protein goal.`,
      icon: '🥩',
      priority: 'medium',
      actionable: true,
      action: {
        label: 'View High-Protein Foods',
        callback: () => {
          window.location.href = '/meals/add';
        },
      },
    });
  }

  // Water intake insight
  const waterTarget = userData?.waterTarget || 8;
  const dailyStatsStorage = JSON.parse(localStorage.getItem('dailyStats') || '{}');
  const currentWater = dailyStatsStorage.water || 0;

  if (currentWater < waterTarget * 0.5) {
    insights.push({
      id: 'low-water',
      type: 'tip',
      title: 'Stay Hydrated',
      description: `You've had ${currentWater}/${waterTarget} glasses. Water boosts metabolism!`,
      icon: '💧',
      priority: 'low',
      actionable: false,
    });
  }

  // Weekly average insight
  if (avgWeeklyCalories > calorieGoal + 200) {
    insights.push({
      id: 'weekly-over',
      type: 'warning',
      title: 'Weekly Average High',
      description: `Your 7-day average is ${avgWeeklyCalories} kcal. Try portion control.`,
      icon: '📊',
      priority: 'medium',
      actionable: false,
    });
  } else if (avgWeeklyCalories < calorieGoal - 300 && avgWeeklyCalories > 0) {
    insights.push({
      id: 'weekly-under',
      type: 'tip',
      title: 'Weekly Average Low',
      description: `Your 7-day average is ${avgWeeklyCalories} kcal. Ensure you're eating enough.`,
      icon: '📊',
      priority: 'low',
      actionable: false,
    });
  }

  return insights.sort((a, b) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });
}

// Predict weight trajectory
export interface WeightPrediction {
  currentWeight: number | null;
  weeklyChange: number | null;
  monthlyPrediction: number | null;
  timeToGoal: number | null;
  recommendation: string;
}

export function predictWeightTrajectory(
  currentWeight?: number,
  goalWeight?: number,
  dailyCalorieAvg?: number,
  tdee?: number
): WeightPrediction {
  const entries = getWeightEntries();
  const latestWeight = entries.length > 0
    ? entries[entries.length - 1].weight
    : currentWeight || null;

  if (!latestWeight || !tdee) {
    return {
      currentWeight: latestWeight,
      weeklyChange: null,
      monthlyPrediction: null,
      timeToGoal: null,
      recommendation: 'Log your weight and complete onboarding for predictions.',
    };
  }

  const calorieDeficit = tdee - (dailyCalorieAvg || tdee);
  const weeklyWeightChange = (calorieDeficit * 7) / 7700; // ~7700 cal per kg

  const monthlyPrediction = latestWeight + (weeklyWeightChange * 4);

  let timeToGoal = null;
  if (goalWeight && goalWeight !== latestWeight) {
    const totalWeightChange = Math.abs(goalWeight - latestWeight);
    const weeklyChangeAbs = Math.abs(weeklyWeightChange);
    if (weeklyChangeAbs > 0) {
      timeToGoal = Math.ceil(totalWeightChange / weeklyChangeAbs);
    }
  }

  let recommendation = '';
  if (weeklyWeightChange < -0.5) {
    recommendation = `You're losing weight faster than recommended. Consider increasing calories slightly.`;
  } else if (weeklyWeightChange > 0.5) {
    recommendation = `You're gaining weight. If this isn't your goal, try reducing calories slightly.`;
  } else if (Math.abs(weeklyWeightChange) < 0.1) {
    recommendation = `You're maintaining weight well. Great job staying consistent!`;
  } else {
    recommendation = `You're on track for healthy weight change. Keep it up!`;
  }

  return {
    currentWeight: latestWeight,
    weeklyChange: Math.round(weeklyWeightChange * 10) / 10,
    monthlyPrediction: Math.round(monthlyPrediction * 10) / 10,
    timeToGoal,
    recommendation,
  };
}

// Get meal suggestions based on time and goals
export function getMealSuggestions(
  mealType: string,
  remainingCalories: number,
  proteinRemaining: number
): FoodItem[] {
  const allFoods = searchLocalFoods('', '');

  // Filter foods that fit within remaining calories
  const suitableFoods = allFoods.filter(
    (f) => f.nutrition.calories <= remainingCalories
  );

  // Prioritize high-protein foods if protein is low
  const proteinRatio = proteinRemaining / 100; // Normalize
  let suggestions = suitableFoods;

  if (proteinRatio > 0.3) {
    // Need more protein
    suggestions = suitableFoods
      .filter((f) => f.nutrition.protein > 15)
      .sort((a, b) => b.nutrition.protein - a.nutrition.protein);
  } else {
    // Balanced suggestions
    suggestions = suitableFoods.sort((a, b) => b.nutrition.calories - a.nutrition.calories);
  }

  return suggestions.slice(0, 10);
}

// Analyze eating consistency
export interface ConsistencyReport {
  overallScore: number; // 0-100
  mealLogging: {
    streak: number;
    bestStreak: number;
    daysThisMonth: number;
  };
  calorieConsistency: {
    daysWithinGoal: number;
    percentage: number;
  };
  recommendation: string;
}

export async function analyzeConsistency(calorieGoal: number): Promise<ConsistencyReport> {
  const streak = await getCurrentStreak();
  const stats = await getDailyStats(30, calorieGoal);

  const daysLogged = stats.filter((s) => s.calories > 0).length;
  const daysWithinGoal = stats.filter((s) => Math.abs(s.calories - calorieGoal) <= 200).length;

  const overallScore = Math.round(
    (streak * 5) + // Up to 35 points for streak
    (daysLogged * 2) + // Up to 60 points for logging
    (daysWithinGoal * 0.5) // Up to 15 points for hitting goals
  );

  let recommendation = '';
  if (overallScore >= 80) {
    recommendation = "Excellent consistency! You're building lasting habits.";
  } else if (overallScore >= 60) {
    recommendation = "Good progress! Try logging meals every day to improve your score.";
  } else if (overallScore >= 40) {
    recommendation = "You're on the right track. Focus on daily logging for better insights.";
  } else {
    recommendation = "Start small! Try logging at least one meal daily to build the habit.";
  }

  return {
    overallScore: Math.min(100, overallScore),
    mealLogging: {
      streak,
      bestStreak: streak, // TODO: Track actual best streak
      daysThisMonth: daysLogged,
    },
    calorieConsistency: {
      daysWithinGoal,
      percentage: daysLogged > 0 ? Math.round((daysWithinGoal / daysLogged) * 100) : 0,
    },
    recommendation,
  };
}

// Generate daily tip
export function generateDailyTip(): string {
  const tips = [
    "Drink a glass of water before meals to help with portion control.",
    "Aim for at least 20g of protein at breakfast to feel full longer.",
    "Try to eat a rainbow of colors in your meals for diverse nutrients.",
    "Sleep 7-9 hours tonight - it helps regulate hunger hormones.",
    "Take a 10-minute walk after meals to aid digestion.",
    "Plan tomorrow's meals today to avoid unhealthy choices.",
    "Try using smaller plates to naturally reduce portion sizes.",
    "Eat slowly - it takes 20 minutes for your brain to register fullness.",
    "Keep healthy snacks visible and tempting treats out of sight.",
    "Meal prep on weekends saves time and helps with consistency.",
  ];

  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return tips[dayOfYear % tips.length];
}
