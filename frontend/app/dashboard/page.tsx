'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import {
  TrendingUp,
  Droplets,
  Activity,
  Moon,
  Apple,
  Plus,
  Target,
  Trophy,
  Calendar,
  ChevronRight,
  Flame,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

// Dashboard Components
function CalorieRing({ goal, consumed, size = 180 }: { goal: number; consumed: number; size?: number }) {
  const circumference = 2 * Math.PI * 80;
  const progress = Math.min(consumed / goal, 1);
  const offset = circumference - progress * circumference;
  const percentage = Math.round((consumed / goal) * 100);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg className="progress-ring" width={size} height={size}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={80}
            fill="none"
            stroke="#f1f5f9"
            strokeWidth={16}
          />
          <circle
            className="progress-ring-circle"
            cx={size / 2}
            cy={size / 2}
            r={80}
            fill="none"
            stroke="url(#gradient)"
            strokeWidth={16}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#14b8a6" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-gray-800">{consumed}</span>
          <span className="text-sm text-gray-500">of {goal} kcal</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-2xl font-bold text-gradient-vitality">{percentage}%</p>
        <p className="text-sm text-gray-500">Daily Goal</p>
      </div>
    </div>
  );
}

function MacroBar({ label, current, goal, color, icon: Icon }: {
  label: string;
  current: number;
  goal: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">{label}</span>
        </div>
        <span className="text-sm text-gray-600">
          <span className="font-semibold">{current}</span> / {goal}g
        </span>
      </div>
      <div className="macro-bar">
        <motion.div
          className={`macro-bar-fill ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  unit,
  color,
  gradient
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  unit: string;
  color: string;
  gradient: string;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`stat-card ${gradient} bg-white rounded-3xl p-6`}
    >
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-4`}>
        <Icon className="w-7 h-7" />
      </div>
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-800">
        {value}
        <span className="text-base font-normal text-gray-500 ml-1">{unit}</span>
      </p>
    </motion.div>
  );
}

function MealCard({ name, time, calories, items, image }: {
  name: string;
  time: string;
  calories: number;
  items: string;
  image?: string;
}) {
  const getBadgeClass = () => {
    switch (name.toLowerCase()) {
      case 'breakfast': return 'meal-breakfast';
      case 'lunch': return 'meal-lunch';
      case 'dinner': return 'meal-dinner';
      default: return 'meal-snack';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="food-card cursor-pointer"
    >
      <div className="flex items-start gap-4">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-16 h-16 rounded-xl object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center flex-shrink-0">
            <Apple className="w-8 h-8 text-green-600" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <span className={`meal-badge ${getBadgeClass()} text-xs`}>
              {name}
            </span>
            <span className="text-xs text-gray-400">{time}</span>
          </div>
          <p className="font-semibold text-gray-800 truncate mb-1">{items}</p>
          <p className="text-sm text-gray-500">{calories} kcal</p>
        </div>
      </div>
    </motion.div>
  );
}

function QuickActionButton({
  icon: Icon,
  label,
  onClick,
  color
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  color: string;
}) {
  return (
    <motion.button
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="quick-action"
    >
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-7 h-7" />
      </div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
    </motion.button>
  );
}

function StreakBadge({ days }: { days: number }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-100 to-orange-100"
    >
      <Flame className="w-5 h-5 text-orange-600 streak-flame" />
      <span className="font-bold text-orange-700">{days} Day Streak!</span>
    </motion.div>
  );
}

export default function DashboardPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<{
    targetCalories?: number;
    macroTargets?: { carbs: number; protein: number; fat: number };
  } | null>(null);

  useEffect(() => {
    const loadUserData = () => {
      try {
        const stored = localStorage.getItem('userData');
        if (stored) {
          setUserData(JSON.parse(stored));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
        toast.error('Failed to load your data. Please try refreshing.');
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-amber-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-64 wellness-skeleton rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const calorieGoal = userData?.targetCalories || 2000;
  const caloriesConsumed = 1450;
  const caloriesRemaining = calorieGoal - caloriesConsumed;

  const macros = userData?.macroTargets || { protein: 120, carbs: 200, fat: 55 };
  const macrosConsumed = { protein: 85, carbs: 150, fat: 35 };

  const stats = [
    { label: 'Calories', value: caloriesConsumed.toString(), unit: 'kcal', icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-100', gradient: 'stat-card-green' },
    { label: 'Water', value: '6', unit: 'glasses', icon: Droplets, color: 'text-blue-600', bg: 'bg-blue-100', gradient: 'stat-card-blue' },
    { label: 'Active', value: '45', unit: 'min', icon: Activity, color: 'text-orange-600', bg: 'bg-orange-100', gradient: 'stat-card-orange' },
    { label: 'Sleep', value: '7.2', unit: 'hours', icon: Moon, color: 'text-purple-600', bg: 'bg-purple-100', gradient: 'stat-card-purple' },
  ];

  const recentMeals = [
    { name: 'Breakfast', time: '8:30 AM', calories: 450, items: 'Oatmeal with berries', image: 'https://images.unsplash.com/photo-1517673400267-0251440c45dc?w=200&q=80' },
    { name: 'Lunch', time: '12:30 PM', calories: 650, items: 'Grilled chicken salad', image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&q=80' },
    { name: 'Snack', time: '3:15 PM', calories: 200, items: 'Greek yogurt' },
    { name: 'Dinner', time: '7:00 PM', calories: 150, items: 'Currently logging...' },
  ];

  const quickActions = [
    { icon: Plus, label: 'Add Meal', onClick: () => router.push('/meals/add'), color: 'bg-green-100 text-green-600' },
    { icon: Target, label: 'Update Goals', onClick: () => router.push('/goals'), color: 'bg-blue-100 text-blue-600' },
    { icon: Trophy, label: 'Achievements', onClick: () => toast.info('Loading achievements...'), color: 'bg-amber-100 text-amber-600' },
    { icon: Calendar, label: 'Meal Plan', onClick: () => router.push('/meals/plan'), color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-amber-50 wellness-scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-green-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}! 🌱</p>
              <h1 className="heading-font text-2xl sm:text-3xl font-bold text-gray-800">
                Your Wellness Dashboard
              </h1>
            </div>
            <StreakBadge days={14} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Calorie Overview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="wellness-card p-8"
          >
            <h2 className="heading-font text-xl font-bold text-gray-800 mb-6 text-center">
              Daily Nutrition
            </h2>
            <CalorieRing goal={calorieGoal} consumed={caloriesConsumed} />
            <div className="mt-6 pt-6 border-t border-green-100 text-center">
              <p className="text-sm text-gray-500 mb-1">Remaining</p>
              <p className="text-2xl font-bold text-gradient-vitality">{caloriesRemaining} kcal</p>
            </div>
          </motion.div>

          {/* Macros */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="wellness-card p-8"
          >
            <h2 className="heading-font text-xl font-bold text-gray-800 mb-6">
              Macros Today
            </h2>
            <div className="space-y-6">
              <MacroBar
                label="Protein"
                current={macrosConsumed.protein}
                goal={macros.protein}
                color="macro-protein"
                icon={TrendingUp}
              />
              <MacroBar
                label="Carbs"
                current={macrosConsumed.carbs}
                goal={macros.carbs}
                color="macro-carbs"
                icon={Apple}
              />
              <MacroBar
                label="Fat"
                current={macrosConsumed.fat}
                goal={macros.fat}
                color="macro-fat"
                icon={Droplets}
              />
            </div>
          </motion.div>

          {/* Quick Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-4"
          >
            {stats.map((stat, _index) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </motion.div>

          {/* Recent Meals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="wellness-card p-6 lg:col-span-2"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="heading-font text-xl font-bold text-gray-800">
                Today's Meals
              </h2>
              <Link
                href="/meals/add"
                className="flex items-center gap-2 text-green-600 hover:text-green-700 font-medium text-sm"
              >
                Add Meal
                <Plus className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {recentMeals.map((meal, index) => (
                <motion.div
                  key={meal.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  <MealCard {...meal} />
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="wellness-card p-6"
          >
            <h2 className="heading-font text-xl font-bold text-gray-800 mb-6">
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 gap-4">
              {quickActions.map((action, _index) => (
                <QuickActionButton key={action.label} {...action} />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Motivational Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 rounded-3xl bg-gradient-to-r from-green-500 to-teal-500 p-8 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
              <path d="M0,50 Q25,30 50,50 T100,50 V100 H0 Z" fill="white" />
            </svg>
          </div>
          <div className="relative z-10 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
                <Sparkles className="w-8 h-8" />
              </div>
              <div>
                <h3 className="heading-font text-2xl font-bold mb-1">
                  You're doing great! 🎉
                </h3>
                <p className="text-green-100">
                  You've logged meals for 14 days straight. Keep it up!
                </p>
              </div>
            </div>
            <Link
              href="/analytics"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-white text-green-600 font-semibold hover:bg-green-50 transition-all"
            >
              View Progress
              <ChevronRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
