'use client';

import React, { useState, useEffect } from 'react';
import { ArrowLeft, Target, Trophy, Check, Flame, Star, Lock, Droplets } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  getAllAchievements,
  getAchievementCount,
  trackEvent,
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
    <div className="card-brand p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-xl ${color} flex items-center justify-center`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{label}</h3>
            <p className="text-sm text-muted-foreground">Daily Target</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-foreground">
            {value}
            <span className="text-base font-normal text-muted-foreground ml-1">{unit}</span>
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
          className="w-full h-3 rounded-full appearance-none cursor-pointer"
          style={{
            background: `linear-gradient(to right, hsl(var(--primary)) 0%, hsl(var(--primary)) ${percentage}%, hsl(var(--muted)) ${percentage}%, hsl(var(--muted)) 100%)`,
          }}
        />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
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

  const getRarityBadge = () => {
    switch (rarity) {
      case 'legendary': return 'bg-amber-50 text-amber-700';
      case 'epic': return 'bg-purple-50 text-purple-700';
      case 'rare': return 'bg-blue-50 text-blue-700';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div
      className={`rounded-xl border p-5 transition-colors ${
        unlocked
          ? 'bg-card border-border'
          : 'bg-muted border-border opacity-70'
      }`}
    >
      {unlocked ? (
        <div className="absolute top-4 right-4">
          <Check className="w-5 h-5 text-primary" />
        </div>
      ) : (
        <div className="absolute top-4 right-4">
          <Lock className="w-4 h-4 text-muted-foreground" />
        </div>
      )}

      <div className="flex items-start gap-4">
        <div
          className={`text-4xl ${unlocked ? '' : 'grayscale opacity-40'}`}
        >
          {icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className={`font-semibold text-foreground`}>
              {title}
            </h3>
            {!unlocked && rarity !== 'common' && (
              <span className={`text-xs px-2 py-0.5 rounded-md ${getRarityBadge()}`}>
                {rarity}
              </span>
            )}
          </div>
          <p className={`text-sm ${unlocked ? 'text-muted-foreground' : 'text-muted-foreground'}`}>
            {description}
          </p>
          {!unlocked && maxProgress > 1 && (
            <div className="mt-3">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">Progress</span>
                <span className="font-medium text-foreground">{progress}/{maxProgress}</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MilestoneCard({
  title,
  target,
  current,
  unit,
}: {
  title: string;
  target: number;
  current: number;
  unit: string;
  color?: string;
  icon?: string;
}) {
  const progress = Math.min((current / target) * 100, 100);
  const achieved = progress >= 100;

  return (
    <div className="card-brand p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">{title}</h3>
        {achieved && (
          <Check className="w-5 h-5 text-primary" />
        )}
      </div>

      <div className="flex items-end gap-2 mb-4">
        <span className="text-4xl font-bold text-foreground">
          {current}
        </span>
        <span className="text-muted-foreground mb-1">/ {target} {unit}</span>
      </div>

      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-primary rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      <p className="text-sm text-muted-foreground mt-2">
        {achieved ? 'Goal achieved!' : `${Math.round(progress)}% complete`}
      </p>
    </div>
  );
}

export default function GoalsPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [achievements, setAchievements] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [achievementStats, setAchievementStats] = useState<any>(null);

  // Goal states
  const [calorieGoal, setCalorieGoal] = useState(2000);
  const [proteinGoal, setProteinGoal] = useState(120);
  const [carbsGoal, setCarbsGoal] = useState(200);
  const [fatGoal, setFatGoal] = useState(55);
  const [waterGoal, setWaterGoal] = useState(8);

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

  // Load data on mount
  useEffect(() => {
    loadData();
    // Check for new achievements on page load
    trackEvent({ type: 'meal_logged' });
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
      toast.success('Goals saved successfully!');
    } catch {
      toast.error('Failed to save goals');
    } finally {
      setTimeout(() => setIsSaving(false), 1000);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard">
              <button className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Your Goals</h1>
              <p className="text-sm text-muted-foreground">Set your nutrition targets</p>
            </div>
          </div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-32 skeleton rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background scrollbar-brand">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <button className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors">
                  <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                  Your Goals
                </h1>
                <p className="text-sm text-muted-foreground">Set your nutrition targets</p>
              </div>
            </div>

            <button
              onClick={handleSaveGoals}
              disabled={isSaving}
              className="btn-brand"
            >
              {isSaving ? (
                <>
                  <div className="spinner" />
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
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Target className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-foreground">Daily Nutrition Goals</h2>
              <p className="text-sm text-muted-foreground">Customize your daily targets</p>
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
              color="bg-primary/10 text-primary"
            />
            <GoalSlider
              label="Protein"
              value={proteinGoal}
              onChange={setProteinGoal}
              min={50}
              max={250}
              unit="g"
              icon={Trophy}
              color="bg-primary/10 text-primary"
            />
            <GoalSlider
              label="Carbohydrates"
              value={carbsGoal}
              onChange={setCarbsGoal}
              min={100}
              max={400}
              unit="g"
              icon={Target}
              color="bg-primary/10 text-primary"
            />
            <GoalSlider
              label="Fat"
              value={fatGoal}
              onChange={setFatGoal}
              min={20}
              max={150}
              unit="g"
              icon={Star}
              color="bg-primary/10 text-primary"
            />
            <GoalSlider
              label="Water"
              value={waterGoal}
              onChange={setWaterGoal}
              min={4}
              max={16}
              unit="glasses"
              icon={Droplets}
              color="bg-primary/10 text-primary"
            />
          </div>
        </section>

        {/* Milestones Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Your Milestones</h2>
                <p className="text-sm text-muted-foreground">Track your progress</p>
              </div>
            </div>
            {achievementStats && (
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{achievementStats.totalUnlocked}</p>
                <p className="text-sm text-muted-foreground">of {achievementStats.totalAchievements} unlocked</p>
              </div>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                title: 'Current Streak',
                target: 30,
                current: achievements.find(a => a.id === 'streak_30')?.progress || 0,
                unit: 'days',
              },
              {
                title: 'Meals Logged',
                target: 100,
                current: achievements.find(a => a.id === 'meals_100')?.progress || 0,
                unit: 'meals',
              },
              {
                title: 'Goals Hit',
                target: 30,
                current: achievements.find(a => a.id === 'goal_hit_30')?.progress || 0,
                unit: 'days',
              },
            ].map((milestone) => (
              <MilestoneCard key={milestone.title} {...milestone} />
            ))}
          </div>
        </section>

        {/* Achievements Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <Star className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Achievements</h2>
                <p className="text-sm text-muted-foreground">Unlock badges as you progress</p>
              </div>
            </div>
          </div>

          {/* Sort achievements: unlocked first, then by progress */}
          <div className="grid sm:grid-cols-2 gap-4">
            {[...achievements]
              .sort((a, b) => {
                if (a.unlocked !== b.unlocked) return a.unlocked ? -1 : 1;
                return b.progress - a.progress;
              })
              .slice(0, 6)
              .map((achievement) => (
                <AchievementCard
                  key={achievement.id}
                  icon={achievement.icon}
                  title={achievement.name}
                  description={achievement.description}
                  unlocked={achievement.unlocked}
                  progress={achievement.progress}
                  maxProgress={achievement.maxProgress}
                  rarity={achievement.rarity}
                />
              ))}
          </div>
        </section>
      </div>
    </div>
  );
}
