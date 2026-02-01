'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
  Minus,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getMealsByDate, getTotalCaloriesForDay, getMacrosForDay } from '@/lib/meal-service';
import { BrandCard, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { EmptyState } from '@/components/ui/empty-state';
import { SmartInsights, DailyTipCard } from '@/components/SmartInsights';

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
            stroke="hsl(var(--muted))"
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
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--secondary))" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold text-foreground">{consumed}</span>
          <span className="text-sm text-muted-foreground">of {goal} kcal</span>
        </div>
      </div>
      <div className="mt-4 text-center">
        <p className="text-2xl font-bold text-primary">{percentage}%</p>
        <p className="text-sm text-muted-foreground">Daily Goal</p>
      </div>
    </div>
  );
}

function MacroBar({
  label,
  current,
  goal,
  color,
  icon: Icon
}: {
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
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{label}</span>
        </div>
        <span className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{current}</span> / {goal}g
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
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
      className={`${gradient} bg-card rounded-3xl p-6 border border-border/50 shadow-sm`}
    >
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-4`}>
        <Icon className="w-7 h-7" />
      </div>
      <p className="text-sm text-muted-foreground mb-1">{label}</p>
      <p className="text-2xl font-bold text-foreground">
        {value}
        <span className="text-base font-normal text-muted-foreground ml-1">{unit}</span>
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
  const getBadgeVariant = (): "default" | "secondary" | "outline" | "destructive" => {
    switch (name.toLowerCase()) {
      case 'breakfast': return 'default';
      case 'lunch': return 'secondary';
      case 'dinner': return 'outline';
      default: return 'destructive';
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="food-card bg-card rounded-2xl p-4 border border-border/50 cursor-pointer hover:shadow-md transition-all"
    >
      <div className="flex items-start gap-4">
        {image ? (
          <Image
            src={image}
            alt={name}
            width={64}
            height={64}
            className="rounded-xl object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Apple className="w-8 h-8 text-primary" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <Badge variant={getBadgeVariant()}>{name}</Badge>
            <span className="text-xs text-muted-foreground">{time}</span>
          </div>
          <p className="font-semibold text-foreground truncate mb-1">{items}</p>
          <p className="text-sm text-muted-foreground">{calories} kcal</p>
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
      className="quick-action bg-card rounded-3xl p-6 border border-border/50 hover:border-border transition-all"
    >
      <div className={`w-14 h-14 rounded-2xl ${color} flex items-center justify-center mb-3`}>
        <Icon className="w-7 h-7" />
      </div>
      <span className="text-sm font-medium">{label}</span>
    </motion.button>
  );
}

function StreakBadge({ days }: { days: number }) {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 200 }}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20"
    >
      <Flame className="w-5 h-5 text-primary streak-flame" />
      <span className="font-bold text-primary">{days} Day Streak!</span>
    </motion.div>
  );
}

const animation = {
  duration: {
    progress: '800ms',
  }
};

export default function DashboardPage() {
  const router = useRouter();
  const { profile, isLoading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    isLoading: true,
    meals: [] as any[],
    waterIntake: 0,
    activeMinutes: 0,
  });
  const [todayMeals, setTodayMeals] = useState<any[]>([]);
  const [waterIntake, setWaterIntake] = useState(0);
  const [activeMinutes, setActiveMinutes] = useState(0);
  const [showActivityDialog, setShowActivityDialog] = useState(false);

  // Load dashboard data
  useEffect(() => {
    const loadData = async () => {
      if (!profile) return;

      try {
        setDashboardData(prev => ({ ...prev, isLoading: true }));

        // Load today's meals
        const today = new Date();
        const meals = await getMealsByDate(today);
        setDashboardData(prev => ({ ...prev, meals }));

        // Load daily stats from localStorage
        const dailyStats = JSON.parse(localStorage.getItem('dailyStats') || '{"water": 0, "activeMinutes": 0}');
        setDashboardData(prev => ({
          ...prev,
          waterIntake: dailyStats.water || 0,
          activeMinutes: dailyStats.activeMinutes || 0,
        }));

      } catch (error) {
        console.error('Error loading dashboard data:', error);
        toast.error('Failed to load your data. Please try refreshing.');
      } finally {
        setDashboardData(prev => ({ ...prev, isLoading: false }));
      }
    };

    if (profile) {
      loadData();
    }
  }, [profile]);

  // Calculate real daily stats from profile
  const calorieGoal = profile?.target_calories || 2000;
  const caloriesConsumed = dashboardData.meals.reduce((sum, meal) => sum + meal.calories, 0);
  const caloriesRemaining = calorieGoal - caloriesConsumed;

  const macros = profile || { protein_target: 120, carb_target: 200, fat_target: 55 };
  const macrosConsumed = dashboardData.meals.reduce(
    (acc, meal) => ({
      protein: acc.protein + (meal.protein || 0),
      carbs: acc.carbs + (meal.carbs || 0),
      fat: acc.fat + (meal.fat || 0),
    }),
    { protein: 0, carbs: 0, fat: 0 }
  );

  const waterGoal = profile?.water_target || 8;

  // Update water intake
  const updateWaterIntake = (delta: number) => {
    const newAmount = Math.max(0, Math.min(20, dashboardData.waterIntake + delta));
    setDashboardData(prev => ({ ...prev, waterIntake: newAmount }));

    const dailyStats = JSON.parse(localStorage.getItem('dailyStats') || '{}');
    dailyStats.water = newAmount;
    localStorage.setItem('dailyStats', JSON.stringify(dailyStats));

    if (delta > 0 && newAmount === waterGoal) {
      toast.success('Water goal reached! 💧');
    }
  };

  // Add activity
  const addActivity = (minutes: number) => {
    const newMinutes = dashboardData.activeMinutes + minutes;
    setDashboardData(prev => ({ ...prev, activeMinutes: newMinutes }));

    const dailyStats = JSON.parse(localStorage.getItem('dailyStats') || '{}');
    dailyStats.activeMinutes = newMinutes;
    localStorage.setItem('dailyStats', JSON.stringify(dailyStats));

    toast.success(`Added ${minutes} minutes of activity! 💪`);
    setShowActivityDialog(false);
  };

  // Check authentication
  if (authLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Redirect to onboarding if not authenticated
  if (!profile) {
    router.push('/onboarding');
    return null;
  }

  if (dashboardData.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero p-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-64 rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Format today's meals for display
  const mealTypeOrder: Record<string, number> = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 };
  const sortedMeals = [...dashboardData.meals].sort((a, b) => mealTypeOrder[a.mealType] - mealTypeOrder[b.mealType]);

  const displayMeals = sortedMeals.length > 0 ? sortedMeals.map(meal => ({
    name: meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1),
    time: new Date(meal.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    calories: meal.calories,
    items: meal.name,
  })) : [
    { name: 'Breakfast', time: '8:30 AM', calories: 0, items: 'Not logged yet' },
    { name: 'Lunch', time: '12:30 PM', calories: 0, items: 'Not logged yet' },
    { name: 'Dinner', time: '7:00 PM', calories: 0, items: 'Not logged yet' },
  ];

  const stats = [
    { label: 'Calories', value: caloriesConsumed.toString(), unit: 'kcal', icon: TrendingUp, color: 'text-primary bg-primary/10', gradient: 'stat-card-green' },
    { label: 'Water', value: dashboardData.waterIntake.toString(), unit: `/${waterGoal} glasses`, icon: Droplets, color: 'text-blue-600 bg-blue-100', gradient: 'stat-card-blue' },
    { label: 'Active', value: activeMinutes.toString(), unit: 'min', icon: Activity, color: 'text-warning bg-warning/10', gradient: 'stat-card-orange' },
    { label: 'Sleep', value: '7.2', unit: 'hours', icon: Moon, color: 'text-purple-600 bg-purple-100', gradient: 'stat-card-purple' },
  ];

  const quickActions = [
    { icon: Plus, label: 'Add Meal', onClick: () => router.push('/meals/add'), color: 'bg-primary/10 text-primary' },
    { icon: Target, label: 'Update Goals', onClick: () => router.push('/goals'), color: 'text-blue-600 bg-blue-100' },
    { icon: Trophy, label: 'Achievements', onClick: () => router.push('/goals'), color: 'text-warning bg-warning/10' },
    { icon: Calendar, label: 'Meal Plan', onClick: () => router.push('/meals/plan'), color: 'text-purple-600 bg-purple-100' },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero scrollbar-brand">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!
              </p>
              <h1 className="font-heading text-2xl sm:text-3xl font-bold text-foreground">
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
          >
            <BrandCard>
              <CardHeader>
                <CardTitle className="text-center">Daily Nutrition</CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center">
                <CalorieRing goal={calorieGoal} consumed={caloriesConsumed} />
                <div className="mt-6 pt-6 border-t border-border/50 text-center w-full">
                  <p className="text-sm text-muted-foreground mb-1">Remaining</p>
                  <p className="text-2xl font-bold text-primary">{caloriesRemaining} kcal</p>
                </div>
              </CardContent>
            </BrandCard>
          </motion.div>

          {/* Macros */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <BrandCard>
              <CardHeader>
                <CardTitle>Macros Today</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <MacroBar
                    label="Protein"
                    current={macrosConsumed.protein || 0}
                    goal={macros.protein_target || 0}
                    color="bg-green-500"
                    icon={TrendingUp}
                  />
                  <MacroBar
                    label="Carbs"
                    current={macrosConsumed.carbs || 0}
                    goal={macros.carb_target || 0}
                    color="bg-teal-500"
                    icon={Apple}
                  />
                  <MacroBar
                    label="Fat"
                    current={macrosConsumed.fat || 0}
                    goal={macros.fat_target || 0}
                    color="bg-orange-500"
                    icon={Droplets}
                  />
                </div>
              </CardContent>
            </BrandCard>
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

          {/* Water & Activity Quick Logger */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
          >
            <BrandCard>
              <CardHeader>
                <CardTitle>Quick Log</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {/* Water Logger */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-2xl border border-blue-200 dark:border-blue-800">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Droplets className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                        <div>
                          <p className="font-semibold">Water Intake</p>
                          <p className="text-sm text-muted-foreground">{dashboardData.waterIntake} / {waterGoal} glasses</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-center gap-4">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateWaterIntake(-1)}
                        className="h-10 w-10 rounded-full border-blue-200 hover:bg-blue-100"
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(waterGoal, 12) }).map((_, i) => (
                          <motion.span
                            key={i}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className={`text-2xl ${i < dashboardData.waterIntake ? '' : 'grayscale opacity-30'}`}
                          >
                            💧
                          </motion.span>
                        ))}
                      </div>
                      <Button
                        size="icon"
                        onClick={() => updateWaterIntake(1)}
                        className="h-10 w-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Activity Logger */}
                  <div className="p-4 bg-warning/10 dark:bg-warning/20 rounded-2xl border border-warning/20">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Activity className="w-5 h-5 text-warning" />
                        <div>
                          <p className="font-semibold">Activity Today</p>
                          <p className="text-sm text-muted-foreground">{dashboardData.activeMinutes} minutes logged</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowActivityDialog(true)}
                        className="text-primary hover:text-primary/80"
                      >
                        + Add
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </BrandCard>
          </motion.div>

          {/* Recent Meals */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <BrandCard>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Today&apos;s Meals</CardTitle>
                  <Link
                    href="/meals"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 font-medium text-sm"
                  >
                    Add Meal
                    <Plus className="w-4 h-4" />
                  </Link>
                </div>
              </CardHeader>
              <CardContent>
                {displayMeals.length > 0 ? (
                  <div className="grid sm:grid-cols-2 gap-4">
                    {displayMeals.map((meal, index) => (
                      <motion.div
                        key={`${meal.name}-${index}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                      >
                        <MealCard {...meal} />
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <EmptyState
                    icon={Apple}
                    title="No meals logged yet today"
                    description="Start tracking your nutrition by adding your first meal"
                    action={
                      <Link href="/meals/add">
                        <Button variant="brand" size="lg">
                          Add Your First Meal
                        </Button>
                      </Link>
                    }
                  />
                )}
              </CardContent>
            </BrandCard>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <BrandCard>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <TooltipProvider>
                  <div className="grid grid-cols-2 gap-4">
                    {quickActions.map((action, _index) => (
                      <Tooltip key={action.label}>
                        <TooltipTrigger asChild>
                          <div>
                            <QuickActionButton {...action} />
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{action.label}</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </div>
                </TooltipProvider>
              </CardContent>
            </BrandCard>
          </motion.div>

          {/* Activity Dialog */}
          <Dialog open={showActivityDialog} onOpenChange={setShowActivityDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Activity</DialogTitle>
                <DialogDescription>
                  Select the duration of your activity or enter a custom amount
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-2">
                  {[15, 30, 45, 60].map((mins) => (
                    <Button
                      key={mins}
                      variant="outline"
                      onClick={() => addActivity(mins)}
                      className="hover:bg-warning/10"
                    >
                      {mins}m
                    </Button>
                  ))}
                </div>
                <div className="grid grid-cols-4 gap-2">
                  {[90, 120].map((mins) => (
                    <Button
                      key={mins}
                      variant="outline"
                      onClick={() => addActivity(mins)}
                      className="hover:bg-warning/10"
                    >
                      {mins}m
                    </Button>
                  ))}
                  <Button
                    variant="outline"
                    onClick={() => {
                      const mins = prompt('Enter minutes:');
                      if (mins && !isNaN(parseInt(mins))) addActivity(parseInt(mins));
                    }}
                    className="hover:bg-warning/10"
                  >
                    Custom
                  </Button>
                </div>
              </div>
              <DialogFooter>
                <Button variant="ghost" onClick={() => setShowActivityDialog(false)}>
                  Cancel
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Second Row - Smart Insights & Daily Tip */}
        <div className="grid lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="lg:col-span-2"
          >
            <SmartInsights calorieGoal={calorieGoal} userData={profile} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55 }}
          >
            <DailyTipCard />
          </motion.div>
        </div>

        {/* Motivational Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="rounded-3xl bg-gradient-to-r from-primary to-secondary p-8 text-white relative overflow-hidden shadow-brand"
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
                <h3 className="font-heading text-2xl font-bold mb-1">
                  You&apos;re doing great!
                </h3>
                <p className="text-white/90">
                  You&apos;ve logged meals for 14 days straight. Keep it up!
                </p>
              </div>
            </div>
            <Link
              href="/analytics"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-primary font-semibold hover:bg-gray-50 transition-all"
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
