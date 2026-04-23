'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, TrendingDown, Target, Award, X } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';
import {
  getDailyStats,
  getWeeklyStats,
  generateInsights,
  getWeightEntries,
  getAverageMacros,
  addWeightEntry,
  type DailyStats,
  type WeeklyStats,
  type WeightEntry,
} from '@/lib/analytics-service';

interface DisplayInsight {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
  value: string;
  color: string;
}

const chartColors = {
  primary: 'hsl(171, 84%, 23%)',
  secondary: 'hsl(220, 70%, 50%)',
  accent: 'hsl(24, 95%, 53%)',
  chart4: 'hsl(142, 71%, 45%)',
  chart5: 'hsl(40, 90%, 50%)',
};

function InsightCard({
  icon: Icon,
  title,
  description,
  trend,
  value,
  color,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
  value: string;
  color: string;
}) {
  const getTrendStyle = () => {
    switch (trend) {
      case 'up':
        return 'text-primary bg-primary/10';
      case 'down':
        return 'text-secondary bg-secondary/10';
      default:
        return 'text-accent bg-accent/10';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up':
        return '↑';
      case 'down':
        return '↓';
      default:
        return '→';
    }
  };

  return (
    <div className="card-brand p-6">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={`px-3 py-1 rounded-lg text-xs font-semibold ${getTrendStyle()}`}>
          {getTrendIcon()} {value}
        </span>
      </div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function WeeklyBarChart({ data, goal }: { data: Array<{ day: string; calories: number }>; goal: number }) {
  const chartData = data.map((d) => ({ ...d, goal }));

  return (
    <div className="card-brand">
      <h3 className="text-xl font-bold mb-6">Weekly Calorie Intake</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
          />
          <Bar dataKey="calories" fill={chartColors.primary} radius={[6, 6, 0, 0]} />
          <Bar dataKey="goal" fill="hsl(var(--muted))" radius={[6, 6, 0, 0]} opacity={0.5} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function WeightProgressChart({
  weightEntries,
  onAddWeight,
}: {
  weightEntries: Array<{ date: Date; weight: number }>;
  onAddWeight: (weight: number) => void;
}) {
  const [weightInput, setWeightInput] = useState('');
  const [showWeightForm, setShowWeightForm] = useState(false);

  const data = weightEntries.slice(-10).map((entry, index) => ({
    date:
      index === weightEntries.slice(-10).length - 1
        ? 'Now'
        : `Week ${weightEntries.length - weightEntries.slice(-10).length + index}`,
    weight: entry.weight,
  }));

  const latestWeight = data.length > 0 ? data[data.length - 1].weight : 0;

  const handleSubmit = () => {
    const parsed = parseFloat(weightInput);
    if (!isNaN(parsed) && parsed > 0) {
      onAddWeight(parsed);
      setWeightInput('');
      setShowWeightForm(false);
    } else {
      toast.error('Please enter a valid weight.');
    }
  };

  return (
    <div className="card-brand">
      <h3 className="text-xl font-bold mb-6">Weight Progress</h3>
      {data.length > 1 ? (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <YAxis
                domain={['dataMin - 2', 'dataMax + 2']}
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke={chartColors.secondary}
                strokeWidth={2}
                dot={{ fill: chartColors.secondary, strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center p-4 bg-primary/10 rounded-xl">
              <p className="text-sm text-muted-foreground mb-1">Current</p>
              <p className="text-2xl font-bold text-primary">{latestWeight} kg</p>
            </div>
            <div className="text-center p-4 bg-accent/10 rounded-xl">
              <p className="text-sm text-muted-foreground mb-1">Entries</p>
              <p className="text-2xl font-bold text-accent">{weightEntries.length}</p>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">Log your weight to track progress</p>
          {showWeightForm ? (
            <div className="flex flex-col items-center gap-3 max-w-xs mx-auto">
              <div className="flex items-center gap-2 w-full">
                <input
                  type="number"
                  step="0.1"
                  min="0"
                  value={weightInput}
                  onChange={(e) => setWeightInput(e.target.value)}
                  placeholder="Weight in kg"
                  className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSubmit();
                  }}
                />
                <button onClick={() => setShowWeightForm(false)} className="p-2 text-muted-foreground hover:text-foreground">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <button onClick={handleSubmit} className="btn-brand w-full">
                Save Weight
              </button>
            </div>
          ) : (
            <button onClick={() => setShowWeightForm(true)} className="btn-brand">
              Log Weight
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function MacroDistribution({ macros }: { macros: { protein: number; carbs: number; fat: number } }) {
  const data = [
    { name: 'Protein', value: macros.protein, color: chartColors.primary },
    { name: 'Carbs', value: macros.carbs, color: chartColors.secondary },
    { name: 'Fat', value: macros.fat, color: chartColors.accent },
  ];

  const total = data.reduce((sum, d) => sum + d.value, 0);

  return (
    <div className="card-brand">
      <h3 className="text-xl font-bold mb-6">Avg. Macro Distribution (7 days)</h3>
      {total > 0 ? (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={70}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-6 space-y-3">
            {data.map((macro) => (
              <div key={macro.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: macro.color }} />
                  <span className="text-sm font-medium">{macro.name}</span>
                </div>
                <span className="font-semibold">{macro.value}g</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Log meals to see macro distribution</p>
        </div>
      )}
    </div>
  );
}

function WeeklySummary({
  weeklyStats,
}: {
  weeklyStats: WeeklyStats[];
}) {
  return (
    <div className="card-brand">
      <h3 className="text-xl font-bold mb-6">Monthly Summary</h3>
      {weeklyStats.length > 0 && weeklyStats.some((w) => w.avgCalories > 0) ? (
        <div className="space-y-5">
          {weeklyStats.map((week, index) =>
            week.avgCalories > 0 ? (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Week {index + 1}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-muted-foreground">Avg: {week.avgCalories} kcal</span>
                    {week.goalHitRate >= 0.5 && <span className="text-chart4 font-semibold">&#10003;</span>}
                  </div>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${Math.min((week.avgCalories / 2000) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ) : null,
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Log meals to see weekly summaries</p>
        </div>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<Record<string, unknown> | null>(null);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStats[]>([]);

  const [insights, setInsights] = useState<DisplayInsight[]>([]);
  const [weightEntries, setWeightEntries] = useState<WeightEntry[]>([]);
  const [avgMacros, setAvgMacros] = useState({ protein: 0, carbs: 0, fat: 0 });

  const loadData = useCallback(async () => {
    try {
      const storedUser = localStorage.getItem('userData');
      const parsedUser = storedUser ? JSON.parse(storedUser) : {};
      setUserData(parsedUser);

      const calorieGoal = parsedUser.targetCalories || 2000;

      const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
      const daily = await getDailyStats(days, calorieGoal);
      const weekly = await getWeeklyStats(4, calorieGoal);
      const generatedInsights = await generateInsights(calorieGoal);
      const weights = await getWeightEntries();
      const macros = await getAverageMacros(7);

      setDailyStats(daily);
      setWeeklyStats(weekly);
      setInsights(
        generatedInsights.map((insight) => ({
          icon: insight.trend === 'up' ? TrendingDown : insight.trend === 'down' ? Target : Award,
          ...insight,
        })),
      );
      setWeightEntries(weights);
      setAvgMacros(macros);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setIsLoading(false);
    }
  }, [timeRange]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleAddWeight = async (weight: number) => {
    await addWeightEntry(weight);
    toast.success(`Weight logged: ${weight} kg`);
    loadData();
  };

  const calorieGoal = (userData?.targetCalories as number) || 2000;

  const weeklyData = dailyStats.slice(-7).map((s) => ({
    day: s.dateLabel,
    calories: s.calories,
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard">
              <button className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center">
                <ArrowLeft className="w-5 h-5 text-foreground" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
              <p className="text-sm text-muted-foreground">Track your wellness journey</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-muted animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const displayInsights =
    insights.length > 0
      ? insights
      : [
          {
            icon: TrendingDown,
            title: 'Getting Started',
            description: 'Log meals to see progress',
            trend: 'neutral' as const,
            value: '0 days',
            color: 'text-accent bg-accent/10',
          },
          {
            icon: Target,
            title: 'Set Your Goal',
            description: 'Complete onboarding to personalize',
            trend: 'neutral' as const,
            value: '-',
            color: 'text-secondary bg-secondary/10',
          },
          {
            icon: Award,
            title: 'First Meal',
            description: 'Log your first meal to begin tracking',
            trend: 'neutral' as const,
            value: 'Start',
            color: 'text-primary bg-primary/10',
          },
        ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 border-b border-border bg-background">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <button className="w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center hover:bg-muted transition-colors">
                  <ArrowLeft className="w-5 h-5 text-foreground" />
                </button>
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Your Progress</h1>
                <p className="text-sm text-muted-foreground">Track your wellness journey</p>
              </div>
            </div>

            {/* Time Range Selector */}
            <div className="flex gap-1 border border-border rounded-xl p-1">
              {(['week', 'month', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors ${
                    timeRange === range
                      ? 'bg-foreground text-background'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {range}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Insights */}
        <div className="grid md:grid-cols-3 gap-6">
          {displayInsights.map((insight) => (
            <InsightCard key={insight.title} {...insight} />
          ))}
        </div>

        {/* Charts */}
        <WeeklyBarChart data={weeklyData} goal={calorieGoal} />

        <div className="grid lg:grid-cols-2 gap-6">
          <MacroDistribution macros={avgMacros} />
          <WeightProgressChart weightEntries={weightEntries} onAddWeight={handleAddWeight} />
        </div>

        <WeeklySummary weeklyStats={weeklyStats} />
      </div>
    </div>
  );
}
