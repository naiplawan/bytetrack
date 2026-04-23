'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { toast } from 'sonner';
import {
  TrendingUp,
  Droplets,
  Apple,
  Plus,
  Minus,
  HelpCircle,
} from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getMealsByDate, type Meal } from '@/lib/meal-service';
import { BrandCard, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EmptyState } from '@/components/ui/empty-state';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

// --- Dashboard Components ---

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
            stroke="hsl(var(--primary))"
            strokeWidth={16}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
          />
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
  icon: Icon,
  help,
}: {
  label: string;
  current: number;
  goal: number;
  color: string;
  icon: React.ComponentType<{ className?: string }>;
  help?: string;
}) {
  const percentage = Math.min((current / goal) * 100, 100);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-muted-foreground" />
          <span className="text-sm font-medium">{label}</span>
          {help && (
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  type="button"
                  aria-label={`About ${label}`}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <HelpCircle className="w-3.5 h-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-xs text-xs leading-relaxed">
                {help}
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <span className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{current}</span> / {goal}g
        </span>
      </div>
      <Progress value={percentage} className="h-2" />
    </div>
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
    <div className="bg-card rounded-xl p-4 border border-border cursor-pointer">
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
    </div>
  );
}

// --- Main Page ---

export default function DashboardPage() {
  const router = useRouter();
  const { profile, isLoading: authLoading } = useAuth();
  const [dashboardData, setDashboardData] = useState({
    isLoading: true,
    meals: [] as Meal[],
    waterIntake: 0,
    activeMinutes: 0,
  });
  const [showActivityDialog, setShowActivityDialog] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');
  const [customError, setCustomError] = useState('');

  // Redirect to onboarding if not authenticated
  useEffect(() => {
    if (!authLoading && !profile) {
      router.push('/onboarding');
    }
  }, [authLoading, profile, router]);

  // Load dashboard data
  useEffect(() => {
    const loadData = async () => {
      if (!profile) return;

      try {
        setDashboardData(prev => ({ ...prev, isLoading: true }));

        const today = new Date();
        const meals = await getMealsByDate(today);
        setDashboardData(prev => ({ ...prev, meals }));

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
      toast.success('Water goal reached!');
    }
  };

  // Add activity
  const addActivity = (minutes: number) => {
    const newMinutes = dashboardData.activeMinutes + minutes;
    setDashboardData(prev => ({ ...prev, activeMinutes: newMinutes }));

    const dailyStats = JSON.parse(localStorage.getItem('dailyStats') || '{}');
    dailyStats.activeMinutes = newMinutes;
    localStorage.setItem('dailyStats', JSON.stringify(dailyStats));

    toast.success(`Added ${minutes} minutes of activity!`);
    setShowActivityDialog(false);
    setCustomMinutes('');
    setCustomError('');
  };

  const submitCustomActivity = () => {
    const trimmed = customMinutes.trim();
    const parsed = Number.parseInt(trimmed, 10);
    if (!trimmed || Number.isNaN(parsed) || parsed <= 0) {
      setCustomError('Enter a positive number of minutes');
      return;
    }
    if (parsed > 1440) {
      setCustomError('That is more than a day — check the value');
      return;
    }
    addActivity(parsed);
  };

  // Auth loading state
  if (authLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto">
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  // Data loading state
  if (dashboardData.isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-3xl mx-auto">
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-64 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Format today's meals for display
  const mealTypeOrder: Record<string, number> = { breakfast: 0, lunch: 1, dinner: 2, snack: 3 };
  const sortedMeals = [...dashboardData.meals].sort((a, b) => mealTypeOrder[a.mealType] - mealTypeOrder[b.mealType]);

  const displayMeals = sortedMeals.map(meal => ({
    name: meal.mealType.charAt(0).toUpperCase() + meal.mealType.slice(1),
    time: new Date(meal.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    calories: meal.calories,
    items: meal.name,
  }));

  return (
    <TooltipProvider delayDuration={200}>
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background border-b border-border">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}!
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
                Dashboard
              </h1>
            </div>
            <Link href="/meals/add">
              <Button variant="brand" size="default">
                <Plus className="w-4 h-4" />
                Add Meal
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* Tier 1: Calorie Ring (dominant) */}
        <BrandCard>
          <CardHeader>
            <div className="flex items-center justify-center gap-2">
              <CardTitle className="text-center">Daily Nutrition</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label="About daily calorie goal"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs text-xs leading-relaxed">
                  Your daily calorie goal is calculated from your profile — age, sex,
                  weight, height, and activity level — using the Mifflin-St Jeor
                  equation, then adjusted for your goal (lose, maintain, gain).
                  Update it anytime from Goals.
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent className="flex flex-col items-center">
            <CalorieRing goal={calorieGoal} consumed={caloriesConsumed} />
            <div className="mt-6 pt-6 border-t border-border text-center w-full">
              <p className="text-sm text-muted-foreground mb-1">Remaining</p>
              <p className="text-2xl font-bold text-primary">{caloriesRemaining} kcal</p>
            </div>
          </CardContent>
        </BrandCard>

        {/* Tier 2: Macro Bars */}
        <BrandCard>
          <CardHeader>
            <div className="flex items-center gap-2">
              <CardTitle>Macros Today</CardTitle>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    type="button"
                    aria-label="About macros"
                    className="text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <HelpCircle className="w-4 h-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="bottom" className="max-w-xs text-xs leading-relaxed">
                  Macros are the three nutrients your body uses for energy:
                  protein, carbs, and fat. Each gram of protein and carbs is
                  4 kcal; fat is 9 kcal. Daily targets are derived from your
                  calorie goal and split based on your selected plan.
                </TooltipContent>
              </Tooltip>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <MacroBar
                label="Protein"
                current={macrosConsumed.protein || 0}
                goal={macros.protein_target || 0}
                color="bg-green-500"
                icon={TrendingUp}
                help="Protein supports muscle repair and satiety. 4 kcal per gram."
              />
              <MacroBar
                label="Carbs"
                current={macrosConsumed.carbs || 0}
                goal={macros.carb_target || 0}
                color="bg-teal-500"
                icon={Apple}
                help="Carbs are your primary energy source. 4 kcal per gram."
              />
              <MacroBar
                label="Fat"
                current={macrosConsumed.fat || 0}
                goal={macros.fat_target || 0}
                color="bg-orange-500"
                icon={Droplets}
                help="Fat supports hormone production and vitamin absorption. 9 kcal per gram."
              />
            </div>
          </CardContent>
        </BrandCard>

        {/* Tier 2: Water Logger */}
        <BrandCard>
          <CardHeader>
            <CardTitle>Water Intake</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateWaterIntake(-1)}
                className="h-10 w-10 rounded-full"
              >
                <Minus className="h-4 w-4" />
              </Button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: Math.min(waterGoal, 12) }).map((_, i) => (
                  <span
                    key={i}
                    className={`inline-block w-5 h-5 rounded-full ${
                      i < dashboardData.waterIntake
                        ? 'bg-primary'
                        : 'bg-muted border border-border'
                    }`}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                size="icon"
                onClick={() => updateWaterIntake(1)}
                className="h-10 w-10 rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-3">
              {dashboardData.waterIntake} / {waterGoal} glasses
            </p>
          </CardContent>
        </BrandCard>

        {/* Tier 2: Today's Meals */}
        <BrandCard>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Today&apos;s Meals</CardTitle>
              <Link
                href="/meals"
                className="inline-flex items-center gap-1 text-primary hover:text-primary/80 font-medium text-sm"
              >
                View all
                <Plus className="w-3 h-3" />
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {displayMeals.length > 0 ? (
              <div className="grid sm:grid-cols-2 gap-4">
                {displayMeals.map((meal, index) => (
                  <MealCard key={`${meal.name}-${index}`} {...meal} />
                ))}
              </div>
            ) : (
              <EmptyState
                icon={Apple}
                title="No meals logged yet today"
                description="Start tracking your nutrition by adding your first meal"
                action={
                  <Link href="/meals/add">
                    <Button variant="brand" size="default">
                      Add Your First Meal
                    </Button>
                  </Link>
                }
              />
            )}
          </CardContent>
        </BrandCard>

        {/* Tier 3: Stats Row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">Calories</p>
            <p className="text-xl font-bold text-foreground">
              {caloriesConsumed}
              <span className="text-sm font-normal text-muted-foreground ml-1">kcal</span>
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">Water</p>
            <p className="text-xl font-bold text-foreground">
              {dashboardData.waterIntake}
              <span className="text-sm font-normal text-muted-foreground ml-1">/ {waterGoal}</span>
            </p>
          </div>
          <div className="bg-card rounded-xl border border-border p-4">
            <p className="text-sm text-muted-foreground mb-1">Active</p>
            <p className="text-xl font-bold text-foreground">
              {dashboardData.activeMinutes}
              <span className="text-sm font-normal text-muted-foreground ml-1">min</span>
            </p>
          </div>
        </div>

        {/* Tier 3: Quick Actions (text links) */}
        <div className="flex items-center gap-6 text-sm">
          <Link href="/meals/add" className="text-primary hover:text-primary/80 font-medium">
            Add Meal
          </Link>
          <Link href="/goals" className="text-primary hover:text-primary/80 font-medium">
            Update Goals
          </Link>
          <Link href="/meals/plan" className="text-primary hover:text-primary/80 font-medium">
            Meal Plan
          </Link>
          <button
            onClick={() => setShowActivityDialog(true)}
            className="text-primary hover:text-primary/80 font-medium"
          >
            Log Activity
          </button>
          <Link href="/analytics" className="text-primary hover:text-primary/80 font-medium">
            View Progress
          </Link>
        </div>

        {/* Activity Dialog */}
        <Dialog
          open={showActivityDialog}
          onOpenChange={(open) => {
            setShowActivityDialog(open);
            if (!open) {
              setCustomMinutes('');
              setCustomError('');
            }
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Activity</DialogTitle>
              <DialogDescription>
                Select the duration of your activity or enter a custom amount
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-2">
                {[15, 30, 45, 60, 90, 120].map((mins) => (
                  <Button
                    key={mins}
                    variant="outline"
                    onClick={() => addActivity(mins)}
                  >
                    {mins}m
                  </Button>
                ))}
              </div>
              <div className="space-y-2">
                <Label htmlFor="custom-minutes" className="text-sm">
                  Custom duration
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="custom-minutes"
                    type="number"
                    inputMode="numeric"
                    min={1}
                    max={1440}
                    placeholder="Minutes"
                    value={customMinutes}
                    onChange={(e) => {
                      setCustomMinutes(e.target.value);
                      if (customError) setCustomError('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        submitCustomActivity();
                      }
                    }}
                    aria-invalid={customError ? true : undefined}
                    aria-describedby={customError ? 'custom-minutes-error' : undefined}
                  />
                  <Button
                    variant="brand"
                    onClick={submitCustomActivity}
                    disabled={!customMinutes.trim()}
                  >
                    Add
                  </Button>
                </div>
                {customError && (
                  <p id="custom-minutes-error" className="text-sm text-destructive">
                    {customError}
                  </p>
                )}
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
    </div>
    </TooltipProvider>
  );
}
