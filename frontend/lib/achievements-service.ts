// Achievements Service - Track and unlock achievements

import { getDailyStats, getCurrentStreak } from './analytics-service';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  category: 'streak' | 'goals' | 'logging' | 'social' | 'milestone';
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  unlockedAt?: Date;
  progress: number; // 0-100
  progressLabel: string;
  maxProgress: number;
}

export interface AchievementEvent {
  type: 'meal_logged' | 'goal_hit' | 'streak_day' | 'weight_logged' | 'plan_created';
  data?: any;
}

// Achievement definitions
const achievementDefinitions: Omit<Achievement, 'unlocked' | 'unlockedAt' | 'progress'>[] = [
  // Streak Achievements
  {
    id: 'first_meal',
    name: 'First Step',
    description: 'Log your first meal',
    icon: '🍽️',
    category: 'logging',
    rarity: 'common',
    progressLabel: 'Meals logged',
    maxProgress: 1,
  },
  {
    id: 'streak_3',
    name: 'Building Momentum',
    description: 'Log meals for 3 consecutive days',
    icon: '🌱',
    category: 'streak',
    rarity: 'common',
    progressLabel: 'Day streak',
    maxProgress: 3,
  },
  {
    id: 'streak_7',
    name: 'Week Warrior',
    description: 'Log meals for 7 consecutive days',
    icon: '🔥',
    category: 'streak',
    rarity: 'rare',
    progressLabel: 'Day streak',
    maxProgress: 7,
  },
  {
    id: 'streak_14',
    name: 'Two Week Triumph',
    description: 'Log meals for 14 consecutive days',
    icon: '⚡',
    category: 'streak',
    rarity: 'epic',
    progressLabel: 'Day streak',
    maxProgress: 14,
  },
  {
    id: 'streak_30',
    name: 'Monthly Master',
    description: 'Log meals for 30 consecutive days',
    icon: '👑',
    category: 'streak',
    rarity: 'legendary',
    progressLabel: 'Day streak',
    maxProgress: 30,
  },
  // Goal Achievements
  {
    id: 'goal_hit_1',
    name: 'On Target',
    description: 'Hit your calorie goal 1 day',
    icon: '🎯',
    category: 'goals',
    rarity: 'common',
    progressLabel: 'Days on target',
    maxProgress: 1,
  },
  {
    id: 'goal_hit_7',
    name: 'Perfect Week',
    description: 'Hit your calorie goal 7 days in a week',
    icon: '💯',
    category: 'goals',
    rarity: 'rare',
    progressLabel: 'Days on target',
    maxProgress: 7,
  },
  {
    id: 'goal_hit_30',
    name: 'Goal Crusher',
    description: 'Hit your calorie goal 30 times',
    icon: '🏆',
    category: 'goals',
    rarity: 'epic',
    progressLabel: 'Total days on target',
    maxProgress: 30,
  },
  // Logging Achievements
  {
    id: 'meals_10',
    name: 'Food Logger',
    description: 'Log 10 meals total',
    icon: '📝',
    category: 'logging',
    rarity: 'common',
    progressLabel: 'Meals logged',
    maxProgress: 10,
  },
  {
    id: 'meals_50',
    name: 'Dedicated Tracker',
    description: 'Log 50 meals total',
    icon: '📋',
    category: 'logging',
    rarity: 'rare',
    progressLabel: 'Meals logged',
    maxProgress: 50,
  },
  {
    id: 'meals_100',
    name: 'Century Club',
    description: 'Log 100 meals total',
    icon: '💎',
    category: 'logging',
    rarity: 'epic',
    progressLabel: 'Meals logged',
    maxProgress: 100,
  },
  // Milestone Achievements
  {
    id: 'first_weight',
    name: 'Weight Watcher',
    description: 'Log your weight for the first time',
    icon: '⚖️',
    category: 'milestone',
    rarity: 'common',
    progressLabel: 'Weight entries',
    maxProgress: 1,
  },
  {
    id: 'weight_5',
    name: 'Tracking Progress',
    description: 'Log your weight 5 times',
    icon: '📊',
    category: 'milestone',
    rarity: 'common',
    progressLabel: 'Weight entries',
    maxProgress: 5,
  },
];

// Get unlocked achievements from localStorage
function getUnlockedAchievements(): Set<string> {
  try {
    const stored = localStorage.getItem('unlockedAchievements');
    if (stored) {
      return new Set(JSON.parse(stored));
    }
  } catch (error) {
    console.error('Error loading achievements:', error);
  }
  return new Set();
}

// Save unlocked achievement
function unlockAchievement(id: string) {
  const unlocked = getUnlockedAchievements();
  if (!unlocked.has(id)) {
    unlocked.add(id);
    localStorage.setItem('unlockedAchievements', JSON.stringify([...unlocked]));

    // Store unlock timestamp
    const timestamps = JSON.parse(localStorage.getItem('achievementTimestamps') || '{}');
    timestamps[id] = new Date().toISOString();
    localStorage.setItem('achievementTimestamps', JSON.stringify(timestamps));

    return true; // Newly unlocked
  }
  return false; // Already unlocked
}

// Calculate achievement progress
async function calculateProgress(achievement: Omit<Achievement, 'unlocked' | 'unlockedAt' | 'progress'>): Promise<number> {
  const stats = await getDailyStats(30, 2000); // Last 30 days

  switch (achievement.id) {
    // Streak achievements
    case 'streak_3':
    case 'streak_7':
    case 'streak_14':
    case 'streak_30': {
      const streak = await getCurrentStreak();
      return Math.min(streak, achievement.maxProgress);
    }

    // Goal hit achievements
    case 'goal_hit_1':
    case 'goal_hit_7':
    case 'goal_hit_30': {
      const daysOnTarget = stats.filter((s) => s.hitGoal).length;
      return Math.min(daysOnTarget, achievement.maxProgress);
    }

    // Logging achievements
    case 'first_meal':
    case 'meals_10':
    case 'meals_50':
    case 'meals_100': {
      const totalMeals = stats.reduce((sum, s) => sum + (s.calories > 0 ? 1 : 0), 0);
      return Math.min(totalMeals, achievement.maxProgress);
    }

    // Weight achievements
    case 'first_weight':
    case 'weight_5': {
      try {
        const weightEntries = JSON.parse(localStorage.getItem('weightEntries') || '[]');
        return Math.min(weightEntries.length, achievement.maxProgress);
      } catch {
        return 0;
      }
    }

    default:
      return 0;
  }
}

// Get all achievements with current state
export async function getAllAchievements(): Promise<Achievement[]> {
  const unlocked = getUnlockedAchievements();
  const timestamps = JSON.parse(localStorage.getItem('achievementTimestamps') || '{}');

  const achievements = await Promise.all(
    achievementDefinitions.map(async (def) => {
      const isUnlocked = unlocked.has(def.id);
      const progress = await calculateProgress(def);

      return {
        ...def,
        unlocked: isUnlocked,
        unlockedAt: isUnlocked && timestamps[def.id] ? new Date(timestamps[def.id]) : undefined,
        progress,
        progressLabel: `${progress}/${def.maxProgress} ${def.progressLabel}`,
      };
    })
  );

  return achievements;
}

// Track event and check for new unlocks
export async function trackEvent(event: AchievementEvent): Promise<Achievement[]> {
  const newUnlocks: Achievement[] = [];

  // Get all achievements
  const achievements = await getAllAchievements();

  // Check each achievement
  for (const achievement of achievements) {
    // Skip if already unlocked
    if (achievement.unlocked) continue;

    // Check if progress meets requirement
    if (achievement.progress >= achievement.maxProgress) {
      const newlyUnlocked = unlockAchievement(achievement.id);
      if (newlyUnlocked) {
        newUnlocks.push({ ...achievement, unlocked: true, unlockedAt: new Date() });
      }
    }
  }

  return newUnlocks;
}

// Get achievement count by rarity
export async function getAchievementCount() {
  const achievements = await getAllAchievements();
  return {
    total: achievements.length,
    unlocked: achievements.filter((a) => a.unlocked).length,
    byRarity: {
      common: achievements.filter((a) => a.rarity === 'common' && a.unlocked).length,
      rare: achievements.filter((a) => a.rarity === 'rare' && a.unlocked).length,
      epic: achievements.filter((a) => a.rarity === 'epic' && a.unlocked).length,
      legendary: achievements.filter((a) => a.rarity === 'legendary' && a.unlocked).length,
    },
    byCategory: {
      streak: achievements.filter((a) => a.category === 'streak' && a.unlocked).length,
      goals: achievements.filter((a) => a.category === 'goals' && a.unlocked).length,
      logging: achievements.filter((a) => a.category === 'logging' && a.unlocked).length,
      milestone: achievements.filter((a) => a.category === 'milestone' && a.unlocked).length,
    },
  };
}

// Get next achievement to unlock
export async function getNextAchievements(limit: number = 3): Promise<Achievement[]> {
  const achievements = await getAllAchievements();

  const filteredAndSorted = achievements
    .filter((a) => !a.unlocked)
    .sort((a, b) => {
      // Sort by progress (descending), then by rarity (ascending)
      const progressDiff = b.progress - a.progress;
      if (progressDiff !== 0) return progressDiff;

      const rarityOrder = { common: 0, rare: 1, epic: 2, legendary: 3 };
      return rarityOrder[a.rarity] - rarityOrder[b.rarity];
    });

  return filteredAndSorted.slice(0, limit);
}

// Show achievement notification
export function showAchievementNotification(achievement: Achievement) {
  // This will be called from components to show a toast
  const rarityColors = {
    common: 'from-gray-500 to-gray-600',
    rare: 'from-blue-500 to-cyan-500',
    epic: 'from-purple-500 to-pink-500',
    legendary: 'from-amber-500 to-orange-500',
  };

  return {
    title: `Achievement Unlocked!`,
    message: achievement.name,
    icon: achievement.icon,
    color: rarityColors[achievement.rarity],
  };
}

// Get achievement progress for dashboard display
export async function getDashboardAchievements(): Promise<{
  totalUnlocked: number;
  totalAchievements: number;
  nextUp: Achievement | null;
  recentUnlocks: Achievement[];
}> {
  const achievements = await getAllAchievements();
  const unlocked = achievements.filter((a) => a.unlocked);
  const timestamps = JSON.parse(localStorage.getItem('achievementTimestamps') || '{}');

  // Get recent unlocks (last 7 days)
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recentUnlocks = unlocked
    .filter((a) => a.unlockedAt && a.unlockedAt.getTime() > sevenDaysAgo)
    .sort((a, b) => (b.unlockedAt?.getTime() || 0) - (a.unlockedAt?.getTime() || 0))
    .slice(0, 5);

  // Get next achievement (closest to completion)
  const nextUp = (await getNextAchievements(1))[0] || null;

  return {
    totalUnlocked: unlocked.length,
    totalAchievements: achievements.length,
    nextUp,
    recentUnlocks,
  };
}

// Reset all achievements (for testing)
export function resetAchievements() {
  localStorage.removeItem('unlockedAchievements');
  localStorage.removeItem('achievementTimestamps');
}
