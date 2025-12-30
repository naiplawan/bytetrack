'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { DynamicGreeting } from '@/components/dashboard/dynamic-greeting';
import { CalorieOverview } from '@/components/dashboard/calorie-overview';
import { QuickStats } from '@/components/dashboard/quick-stats';
import { RecentMeals } from '@/components/dashboard/recent-meals';
import { QuickActions } from '@/components/dashboard/quick-actions';
import { DashboardSkeleton } from '@/components/dashboard/dashboard-skeleton';
import { staggerContainer } from '@/components/dashboard/motion-variants';
import type { Stat, Meal } from '@/components/dashboard/types';
import { Droplets, Activity, Clock, Flame as Fire } from 'lucide-react';
import { t } from '@/lib/translations';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Page() {
  const router = useRouter();
  const { language } = useLanguage();
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<{
    targetCalories?: number;
    macroTargets?: { carbs: number; protein: number; fat: number };
  } | null>(null);

  // Load user data from localStorage
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

  // Data state
  const calorieGoal = userData?.targetCalories || 2000;
  const caloriesConsumed = 1450;

  const stats: Stat[] = [
    { label: t('stats_caloriesToday_i18n', language), value: `${caloriesConsumed}`, unit: t('dashboard_kcal_i18n', language), icon: Fire, color: 'text-primary' },
    { label: t('stats_waterIntake_i18n', language), value: '6', unit: t('stats_glasses_i18n', language), icon: Droplets, color: 'text-blue-500' },
    { label: t('stats_activeMinutes_i18n', language), value: '45', unit: t('stats_min_i18n', language), icon: Activity, color: 'text-orange-500' },
    { label: t('stats_sleep_i18n', language), value: '7.2', unit: t('stats_hours_i18n', language), icon: Clock, color: 'text-purple-500' },
  ];

  const recentMeals: Meal[] = [
    { name: 'Breakfast', time: '8:30 AM', calories: 450, items: 'Oatmeal with berries' },
    { name: 'Lunch', time: '12:30 PM', calories: 650, items: 'Grilled chicken salad' },
    { name: 'Snack', time: '3:15 PM', calories: 200, items: 'Greek yogurt' },
    { name: 'Dinner', time: '7:00 PM', calories: 150, items: 'Currently logging...' },
  ];

  // Event handlers with toast feedback
  const handleAddMeal = () => {
    router.push('/meals/add');
    toast.info('Opening meal logger...');
  };

  const handleViewAnalytics = () => {
    router.push('/analytics');
    toast.info('Loading analytics...');
  };

  const handleUpdateGoals = () => {
    router.push('/goals');
    toast.info('Opening goal settings...');
  };

  const handleMealPlanning = () => {
    router.push('/meals/plan');
    toast.info('Opening meal planner...');
  };

  const handleProgressReport = () => {
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: 'Generating your progress report...',
        success: 'Progress report ready!',
        error: 'Failed to generate report',
      }
    );
  };

  // Show skeleton while loading
  if (isLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background spotify-scrollbar">
      <div className="spotify-container spotify-section">
        <DynamicGreeting />

        <motion.div
          className="grid gap-8 lg:grid-cols-3"
          variants={staggerContainer}
          initial="hidden"
          animate="visible"
        >
          <CalorieOverview
            calorieGoal={calorieGoal}
            caloriesConsumed={caloriesConsumed}
            macros={userData?.macroTargets}
          />

          <QuickStats stats={stats} />

          <RecentMeals meals={recentMeals} onAddMeal={handleAddMeal} />

          <QuickActions
            onViewAnalytics={handleViewAnalytics}
            onUpdateGoals={handleUpdateGoals}
            onMealPlanning={handleMealPlanning}
            onProgressReport={handleProgressReport}
          />
        </motion.div>
      </div>
    </div>
  );
}
