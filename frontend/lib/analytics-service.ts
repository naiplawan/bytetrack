// Analytics Service - Calculate real stats from meal data

import { getTotalCaloriesForDay, getMacrosForDay } from './meal-service';

export interface DailyStats {
  date: Date;
  dateLabel: string;
  calories: number;
  goal: number;
  protein: number;
  carbs: number;
  fat: number;
  hitGoal: boolean;
}

export interface WeeklyStats {
  avgCalories: number;
  avgProtein: number;
  avgCarbs: number;
  avgFat: number;
  daysHitGoal: number;
  totalDays: number;
  goalHitRate: number;
}

export interface WeightEntry {
  date: Date;
  weight: number;
}

export interface Insight {
  title: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
  value: string;
  color: string;
}

// Get daily stats for the past N days
export async function getDailyStats(days: number, calorieGoal: number = 2000): Promise<DailyStats[]> {
  const stats: DailyStats[] = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);

    const calories = await getTotalCaloriesForDay(date);
    const macros = await getMacrosForDay(date);

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dateLabel = i === 0 ? 'Today' : i === 1 ? 'Yesterday' : dayNames[date.getDay()];

    stats.push({
      date,
      dateLabel,
      calories,
      goal: calorieGoal,
      protein: macros.protein || 0,
      carbs: macros.carbs || 0,
      fat: macros.fat || 0,
      hitGoal: Math.abs(calories - calorieGoal) <= 100, // Within 100 calories
    });
  }

  return stats;
}

// Get weekly stats
export async function getWeeklyStats(weeks: number, calorieGoal: number = 2000): Promise<WeeklyStats[]> {
  const stats: WeeklyStats[] = [];
  const today = new Date();

  for (let i = weeks - 1; i >= 0; i--) {
    const weekStart = new Date(today);
    weekStart.setDate(weekStart.getDate() - (i * 7) - today.getDay());
    weekStart.setHours(0, 0, 0, 0);

    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbs = 0;
    let totalFat = 0;
    let daysHitGoal = 0;
    let totalDays = 0;

    for (let d = 0; d < 7; d++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + d);
      if (date > today) break;

      const dayCalories = await getTotalCaloriesForDay(date);
      const dayMacros = await getMacrosForDay(date);

      // Only count days with logged meals
      if (dayCalories > 0) {
        totalCalories += dayCalories;
        totalProtein += dayMacros.protein;
        totalCarbs += dayMacros.carbs;
        totalFat += dayMacros.fat;
        totalDays++;

        if (Math.abs(dayCalories - calorieGoal) <= 100) {
          daysHitGoal++;
        }
      }
    }

    stats.push({
      avgCalories: totalDays > 0 ? Math.round(totalCalories / totalDays) : 0,
      avgProtein: totalDays > 0 ? Math.round(totalProtein / totalDays) : 0,
      avgCarbs: totalDays > 0 ? Math.round(totalCarbs / totalDays) : 0,
      avgFat: totalDays > 0 ? Math.round(totalFat / totalDays) : 0,
      daysHitGoal,
      totalDays,
      goalHitRate: totalDays > 0 ? Math.round((daysHitGoal / totalDays) * 100) : 0,
    });
  }

  return stats;
}

// Calculate current streak (consecutive days with logged meals)
export async function getCurrentStreak(): Promise<number> {
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < 365; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const calories = await getTotalCaloriesForDay(date);
    if (calories > 0) {
      streak++;
    } else if (i > 0) {
      // Break streak if we miss a day (but allow today to be empty)
      break;
    }
  }

  return streak;
}

// Get weight entries from localStorage
export function getWeightEntries(): WeightEntry[] {
  try {
    const stored = localStorage.getItem('weightEntries');
    if (stored) {
      const entries = JSON.parse(stored);
      return entries.map((e: { date: string; weight: number }) => ({ ...e, date: new Date(e.date) }));
    }
  } catch (error) {
    console.error('Error loading weight entries:', error);
  }
  return [];
}

// Add weight entry
export function addWeightEntry(weight: number, date?: Date): void {
  const entries = getWeightEntries();
  entries.push({
    date: date || new Date(),
    weight,
  });
  entries.sort((a, b) => a.date.getTime() - b.date.getTime());
  localStorage.setItem('weightEntries', JSON.stringify(entries));
}

// Get latest weight
export function getLatestWeight(): number | null {
  const entries = getWeightEntries();
  if (entries.length === 0) return null;
  return entries[entries.length - 1].weight;
}

// Calculate weight change
export function getWeightChange(): { current: number | null; change: number | null; period: string } {
  const entries = getWeightEntries();
  if (entries.length < 2) return { current: getLatestWeight(), change: null, period: 'No data' };

  const latest = entries[entries.length - 1];
  const oldest = entries[0];

  const daysDiff = Math.round((latest.date.getTime() - oldest.date.getTime()) / (1000 * 60 * 60 * 24));
  const weightChange = Math.round((latest.weight - oldest.weight) * 10) / 10;

  return {
    current: latest.weight,
    change: weightChange,
    period: daysDiff >= 30 ? `${Math.round(daysDiff / 7)} weeks` : `${daysDiff} days`,
  };
}

// Generate insights
export async function generateInsights(calorieGoal: number): Promise<Insight[]> {
  const insights: Insight[] = [];
  const streak = await getCurrentStreak();
  const weightData = getWeightChange();

  // Streak insight
  if (streak >= 7) {
    insights.push({
      title: 'Logging Streak!',
      description: `${streak} days in a row`,
      trend: 'up',
      value: `${streak} days`,
      color: 'text-brand bg-brand/10',
    });
  }

  // Weight insight
  if (weightData.change !== null && weightData.change !== 0) {
    const isLoss = weightData.change < 0;
    insights.push({
      title: isLoss ? 'Weight Progress' : 'Weight Progress',
      description: `${Math.abs(weightData.change)}kg ${isLoss ? 'lost' : 'gained'} over ${weightData.period}`,
      trend: isLoss ? 'down' : 'up',
      value: `${isLoss ? '-' : '+'}${Math.abs(weightData.change)}kg`,
      color: isLoss ? 'text-blue-600 bg-blue-100' : 'text-amber-600 bg-amber-100',
    });
  }

  // Goal hit rate insight
  const weeklyStats = await getWeeklyStats(1, calorieGoal);
  if (weeklyStats[0] && weeklyStats[0].totalDays > 0) {
    const hitRate = weeklyStats[0].goalHitRate;
    insights.push({
      title: hitRate >= 70 ? 'On Track!' : 'Keep Going',
      description: `Hit calorie goal ${weeklyStats[0].daysHitGoal}/${weeklyStats[0].totalDays} days this week`,
      trend: 'neutral',
      value: `${hitRate}%`,
      color: hitRate >= 70 ? 'text-brand bg-brand/10' : 'text-amber-600 bg-amber-100',
    });
  }

  return insights;
}

// Get meal frequency (what meals are logged most)
export function getMealFrequency(): { type: string; count: number; percentage: number }[] {
  try {
    const stored = localStorage.getItem('meals');
    if (!stored) return [];

    const meals = JSON.parse(stored);
    const typeCounts: Record<string, number> = {};

    meals.forEach((meal: { mealType?: string }) => {
      const type = meal.mealType || 'unknown';
      typeCounts[type] = (typeCounts[type] || 0) + 1;
    });

    const total = meals.length;
    return Object.entries(typeCounts)
      .map(([type, count]) => ({
        type,
        count: count as number,
        percentage: Math.round((count as number / total) * 100),
      }))
      .sort((a, b) => b.count - a.count);
  } catch (error) {
    console.error('Error calculating meal frequency:', error);
    return [];
  }
}

// Get average daily macros
export async function getAverageMacros(days: number = 7): Promise<{ protein: number; carbs: number; fat: number; calories: number }> {
  const stats = await getDailyStats(days);
  const validDays = stats.filter(s => s.calories > 0);

  if (validDays.length === 0) {
    return { protein: 0, carbs: 0, fat: 0, calories: 0 };
  }

  return {
    protein: Math.round(validDays.reduce((sum, s) => sum + s.protein, 0) / validDays.length),
    carbs: Math.round(validDays.reduce((sum, s) => sum + s.carbs, 0) / validDays.length),
    fat: Math.round(validDays.reduce((sum, s) => sum + s.fat, 0) / validDays.length),
    calories: Math.round(validDays.reduce((sum, s) => sum + s.calories, 0) / validDays.length),
  };
}

// Get best and worst days
export async function getBestAndWorstDays(days: number = 30): Promise<{ best: DailyStats | null; worst: DailyStats | null }> {
  const stats = (await getDailyStats(days)).filter(s => s.calories > 0);

  if (stats.length === 0) return { best: null, worst: null };

  const sorted = [...stats].sort((a, b) => {
    const aDiff = Math.abs(a.calories - a.goal);
    const bDiff = Math.abs(b.calories - b.goal);
    return aDiff - bDiff;
  });

  return {
    best: sorted[0],
    worst: sorted[sorted.length - 1],
  };
}
