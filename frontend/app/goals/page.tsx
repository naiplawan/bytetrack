'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Target, Trophy, Sparkles, Check, Flame, Star, Lock } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  getAllAchievements,
  getAchievementCount,
  getNextAchievements,
  trackEvent,
  getDashboardAchievements,
} from '@/lib/achievements-service';

function GoalSlider({
  label,
  value,
  onChange,
  min,
  max,
  unit,
  icon: Icon,
  color
}: {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  unit: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
}) {
  const percentage = ((value - min) / (max - min)) * 100;

  return (
    <div className="wellness-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-800">{label}</h3>
            <p className="text-sm text-gray-500">Daily Target</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-gray-800">
            {value}
            <span className="text-base font-normal text-gray-500 ml-1">{unit}</span>
          </p>
        </div>
      </div>

      <div className="relative">
        <input
          type="range"
          min={min}
          max={max}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-full h-3 rounded-full appearance-none cursor-pointer bg-gray-100"
          style={{
            background: `linear-gradient(to right, #22c55e 0%, #22c55e ${percentage}%, #e5e7eb ${percentage}%, #e5e7eb 100%)`,
          }}
        />
        <div className="flex justify-between mt-2 text-xs text-gray-400">
          <span>{min}</span>
          <span>{max}</span>
        </div>
      </div>
    </div>
  );
}

function AchievementCard({
  icon,
  title,
  description,
  unlocked,
  progress,
  maxProgress,
  rarity
}: {
  icon: string;
  title: string;
  description: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  rarity: string;
}) {
  const progressPercent = Math.min((progress / maxProgress) * 100, 100);

  const getRarityColor = () => {
    switch (rarity) {
      case 'legendary': return 'from-amber-400 to-orange-500';
      case 'epic': return 'from-purple-400 to-pink-500';
      case 'rare': return 'from-blue-400 to-cyan-500';
      default: return 'from-gray-400 to-gray-500';
    }
  };

  const getRarityBorder = () => {
    switch (rarity) {
      case 'legendary': return 'border-amber-300';
      case 'epic': return 'border-purple-300';
      case 'rare': return 'border-blue-300';
      default: return 'border-gray-300';
    }
  };

  return (
    <motion.div
      whileHover={unlocked ? { scale: 1.02 } : {}}
      className={`relative overflow-hidden rounded-3xl p-6 border-2 transition-all ${
        unlocked
          ? `bg-gradient-to-br ${getRarityColor()} bg-opacity-10 ${getRarityBorder()}`
          : 'bg-gray-50 border-gray-200 opacity-70'
      }`}
    >
      {unlocked ? (
        <div className="absolute top-4 right-4">
          <Check className="w-6 h-6 text-amber-600" />
        </div>
      ) : (
        <div className="absolute top-4 right-4">
          <Lock className="w-5 h-5 text-gray-400" />
        </div>
      )}

      <div className="flex items-start gap-4">
        <div
          className={`text-5xl ${unlocked ? '' : 'grayscale opacity-40'}`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-bold text-lg ${unlocked ? 'text-gray-800' : 'text-gray-500'}`}>
              {title}
            </h3>
            {!unlocked && rarity !== 'common' && (
              <span className={`text-xs px-2 py-0.5 rounded-full ${
                rarity === 'legendary' ? 'bg-amber-100 text-amber-700' :
                rarity === 'epic' ? 'bg-purple-100 text-purple-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {rarity}
              </span>
            )}
          </div>
          <p className={`text-sm ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
            {description}
          </p>
          {!unlocked && maxProgress > 1 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">Progress</span>
                <span className="font-medium text-gray-700">{progress}/{maxProgress}</span>
              </div>
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progressPercent}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function MilestoneCard({
  title,
  target,
  current,
  unit,
  color
}: {
  title: string;
  target: number;
  current: number;
  unit: string;
  color: string;
}) {
  const progress = Math.min((current / target) * 100, 100);
  const achieved = progress >= 100;

  return (
    <div className={`wellness-card p-6 ${achieved ? 'goal-celebrate' : ''}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-800">{title}</h3>
        {achieved && (
          <span className="text-2xl">🎉</span>
        )}
      </div>

      <div className="flex items-end gap-2 mb-4">
        <span className={`text-4xl font-bold ${achieved ? 'text-gradient-vitality' : 'text-gray-800'}`}>
          {current}
        </span>
        <span className="text-gray-500 mb-1">/ {target} {unit}</span>
      </div>

      <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${color}`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, delay: 0.2 }}
        />
      </div>

      <p className="text-sm text-gray-500 mt-2">
        {achieved ? 'Goal achieved!' : `${Math.round(progress)}% complete`}
      </p>
    </div>
  );
}

export default function GoalsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [achievements, setAchievements] = useState<any[]>([]);
  const [achievementStats, setAchievementStats] = useState<any>(null);

  // Goal states
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [proteinGoal, setProteinGoal] = useState(120);
  const [carbsGoal, setCarbsGoal] = useState(200);
  const [fatGoal, setFatGoal] = useState(55);
  const [waterGoal, setWaterGoal] = useState(8);

  // Load data on mount
  useEffect(() => {
    loadData();
    // Check for new achievements on page load
    trackEvent({ type: 'meal_logged' });
  }, []);

  const loadData = async () => {
    try {
      // Load user data for goals
      const stored = localStorage.getItem('userData');
      if (stored) {
        const data = JSON.parse(stored);
        if (data.targetCalories) setCalorieGoal(data.targetCalories);
        if (data.macroTargets) {
          if (data.macroTargets.protein) setProteinGoal(data.macroTargets.protein);
          if (data.macroTargets.carbs) setCarbsGoal(data.macroTargets.carbs);
          if (data.macroTargets.fat) setFatGoal(data.macroTargets.fat);
        }
        if (data.waterTarget) setWaterGoal(data.waterTarget);
      }

      // Load achievements
      const allAchievements = await getAllAchievements();
      const stats = await getAchievementCount();

      setAchievements(allAchievements);
      setAchievementStats(stats);
    } catch (error) {
      console.error('Error loading goals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = localStorage.getItem('userData');
        if (stored) {
          const data = JSON.parse(stored);
          if (data.targetCalories) setCalorieGoal(data.targetCalories);
          if (data.macroTargets) {
            if (data.macroTargets.protein) setProteinGoal(data.macroTargets.protein);
            if (data.macroTargets.carbs) setCarbsGoal(data.macroTargets.carbs);
            if (data.macroTargets.fat) setFatGoal(data.macroTargets.fat);
          }
        }
      } catch (error) {
        console.error('Error loading goals:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const handleSaveGoals = () => {
    setIsSaving(true);

    const userData = {
      targetCalories: calorieGoal,
      macroTargets: {
        protein: proteinGoal,
        carbs: carbsGoal,
        fat: fatGoal,
      },
    };

    try {
      localStorage.setItem('userData', JSON.stringify(userData));
      toast.success('Goals saved successfully! 🎯');
    } catch {
      toast.error('Failed to save goals');
    } finally {
      setTimeout(() => setIsSaving(false), 1000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-amber-50 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard">
              <button className="w-10 h-10 rounded-full bg-white border border-green-200 flex items-center justify-center">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Your Goals</h1>
              <p className="text-sm text-gray-500">Set your wellness targets</p>
            </div>
          </div>
          <div className="space-y-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-32 wellness-skeleton rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-amber-50 wellness-scrollbar">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-green-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <button className="w-10 h-10 rounded-full bg-white border border-green-200 flex items-center justify-center hover:bg-green-50 transition-all">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              </Link>
              <div>
                <h1 className="heading-font text-2xl sm:text-3xl font-bold text-gray-800">
                  Your Goals
                </h1>
                <p className="text-sm text-gray-500">Set your wellness targets 🎯</p>
              </div>
            </div>

            <button
              onClick={handleSaveGoals}
              disabled={isSaving}
              className="btn-vitality flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Sparkles className="w-5 h-5 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-5 h-5" />
                  Save Goals
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Daily Goals Section */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-green-100 flex items-center justify-center">
              <Target className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h2 className="heading-font text-2xl font-bold">Daily Nutrition Goals</h2>
              <p className="text-sm text-gray-500">Customize your daily targets</p>
            </div>
          </div>

          <div className="space-y-4">
            <GoalSlider
              label="Calories"
              value={calorieGoal}
              onChange={setCalorieGoal}
              min={1200}
              max={4000}
              unit="kcal"
              icon={Flame}
              color="bg-orange-100 text-orange-600"
            />
            <GoalSlider
              label="Protein"
              value={proteinGoal}
              onChange={setProteinGoal}
              min={50}
              max={250}
              unit="g"
              icon={Sparkles}
              color="bg-green-100 text-green-600"
            />
            <GoalSlider
              label="Carbohydrates"
              value={carbsGoal}
              onChange={setCarbsGoal}
              min={100}
              max={400}
              unit="g"
              icon={Target}
              color="bg-teal-100 text-teal-600"
            />
            <GoalSlider
              label="Fat"
              value={fatGoal}
              onChange={setFatGoal}
              min={20}
              max={150}
              unit="g"
              icon={Trophy}
              color="bg-amber-100 text-amber-600"
            />
            <GoalSlider
              label="Water"
              value={waterGoal}
              onChange={setWaterGoal}
              min={4}
              max={16}
              unit="glasses"
              icon={() => <span className="text-2xl">💧</span>}
              color="bg-blue-100 text-blue-600"
            />
          </div>
        </section>

        {/* Milestones Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-amber-600" />
              </div>
              <div>
                <h2 className="heading-font text-2xl font-bold">Your Milestones</h2>
                <p className="text-sm text-gray-500">Track your progress</p>
              </div>
            </div>
            {achievementStats && (
              <div className="text-right">
                <p className="text-2xl font-bold text-brand">{achievementStats.totalUnlocked}</p>
                <p className="text-sm text-gray-500">of {achievementStats.totalAchievements} unlocked</p>
              </div>
            )}
          </div>

          {/* Real milestones from achievement progress */}
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: 'Current Streak',
                target: 30,
                current: achievements.find(a => a.id === 'streak_30')?.progress || 0,
                unit: 'days',
                color: 'bg-gradient-to-r from-orange-500 to-amber-400',
                icon: '🔥',
              },
              {
                title: 'Meals Logged',
                target: 100,
                current: achievements.find(a => a.id === 'meals_100')?.progress || 0,
                unit: 'meals',
                color: 'bg-gradient-to-r from-blue-500 to-cyan-400',
                icon: '📝',
              },
              {
                title: 'Goals Hit',
                target: 30,
                current: achievements.find(a => a.id === 'goal_hit_30')?.progress || 0,
                unit: 'days',
                color: 'bg-gradient-to-r from-green-500 to-teal-400',
                icon: '🎯',
              },
            ].map((milestone, index) => (
              <motion.div
                key={milestone.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <MilestoneCard {...milestone} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Achievements Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-purple-100 flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h2 className="heading-font text-2xl font-bold">Achievements</h2>
                <p className="text-sm text-gray-500">Unlock badges as you progress</p>
              </div>
            </div>
          </div>

          {/* Sort achievements: unlocked first, then by progress */}
          {[...achievements]
            .sort((a, b) => {
              if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
              return b.progress - a.progress;
            })
            .slice(0, 6) // Show top 6
            .map((achievement, index) => (
              <motion.div
                key={achievement.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="sm:col-span-2 grid sm:grid-cols-2"
              >
                <AchievementCard
                  icon={achievement.icon}
                  title={achievement.name}
                  description={achievement.description}
                  unlocked={achievement.unlocked}
                  progress={achievement.progress}
                  maxProgress={achievement.maxProgress}
                  rarity={achievement.rarity}
                />
              </motion.div>
            ))}
        </section>

        {/* Motivational Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-3xl bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 p-8 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200&q=80"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-white/20">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Remember</span>
            </div>
            <h2 className="heading-font text-3xl font-bold mb-3">
              Every Step Counts! 🌟
            </h2>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              Setting goals is the first step. Achieving them is a journey of consistency.
              You've already unlocked 4 achievements - keep pushing!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
