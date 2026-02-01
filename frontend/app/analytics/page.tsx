'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingDown, Target, Award, Download, Flame, Edit } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';
import Image from 'next/image';
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
  getCurrentStreak,
  generateInsights,
  getWeightEntries,
  getAverageMacros,
  addWeightEntry,
} from '@/lib/analytics-service';

const chartColors = {
  primary: '#DC2626',
  secondary: '#F87171',
  accent: '#F59E0B',
  purple: '#8B5CF6',
  blue: '#3B82F6',
};

function InsightCard({
  icon: Icon,
  title,
  description,
  trend,
  value,
  color
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  trend: 'up' | 'down' | 'neutral';
  value: string;
  color: string;
}) {
  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'text-brand bg-brand/10';
      case 'down': return 'text-blue-600 bg-blue-100';
      default: return 'text-amber-600 bg-amber-100';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '↑';
      case 'down': return '↓';
      default: return '→';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="card-brand p-6"
    >
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTrendColor()}`}>
          {getTrendIcon()} {value}
        </span>
      </div>
      <h3 className="font-bold text-lg mb-1">{title}</h3>
      <p className="text-sm text-text-secondary">{description}</p>
    </motion.div>
  );
}

function WeeklyBarChart({ data, goal }: { data: Array<{ day: string; calories: number }>; goal: number }) {
  const chartData = data.map(d => ({ ...d, goal }));

  return (
    <div className="card-brand">
      <h3 className="font-heading text-xl font-bold mb-6">Weekly Calorie Intake</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={chartData}>
          <XAxis
            dataKey="day"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'white',
              border: 'none',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            }}
          />
          <Bar dataKey="calories" fill={chartColors.primary} radius={[8, 8, 0, 0]} />
          <Bar dataKey="goal" fill="#e2e8f0" radius={[8, 8, 0, 0]} opacity={0.5} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

function WeightProgressChart({ weightEntries }: { weightEntries: Array<{ date: Date; weight: number }> }) {
  const data = weightEntries.slice(-10).map((entry, index) => ({
    date: index === weightEntries.slice(-10).length - 1 ? 'Now' : `Week ${weightEntries.length - weightEntries.slice(-10).length + index}`,
    weight: entry.weight,
  }));

  const latestWeight = data.length > 0 ? data[data.length - 1].weight : 0;

  return (
    <div className="card-brand">
      <h3 className="font-heading text-xl font-bold mb-6">Weight Progress</h3>
      {data.length > 1 ? (
        <>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={data}>
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <YAxis
                domain={['dataMin - 2', 'dataMax + 2']}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6b7280', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              />
              <Line
                type="monotone"
                dataKey="weight"
                stroke={chartColors.secondary}
                strokeWidth={3}
                dot={{ fill: chartColors.secondary, strokeWidth: 2, r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center p-4 bg-brand/10 rounded-2xl">
              <p className="text-sm text-text-secondary mb-1">Current</p>
              <p className="text-2xl font-bold text-brand">{latestWeight} kg</p>
            </div>
            <div className="text-center p-4 bg-amber-50 rounded-2xl">
              <p className="text-sm text-text-secondary mb-1">Entries</p>
              <p className="text-2xl font-bold text-amber-600">{weightEntries.length}</p>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-text-secondary mb-4">Log your weight to track progress</p>
          <button
            onClick={() => {
              const weight = prompt('Enter your weight (kg):');
              if (weight && !isNaN(parseFloat(weight))) {
                addWeightEntry(parseFloat(weight));
                window.location.reload();
              }
            }}
            className="btn-brand"
          >
            Log Weight
          </button>
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
      <h3 className="font-heading text-xl font-bold mb-6">Avg. Macro Distribution (7 days)</h3>
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
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: macro.color }}
                  />
                  <span className="text-sm font-medium">{macro.name}</span>
                </div>
                <span className="font-semibold">{macro.value}g</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-text-secondary">Log meals to see macro distribution</p>
        </div>
      )}
    </div>
  );
}

function WeeklySummary({ weeklyStats }: { weeklyStats: Array<{ avgCalories: number; avgWeight: number; hitGoal: boolean }> }) {
  return (
    <div className="card-brand">
      <h3 className="font-heading text-xl font-bold mb-6">Monthly Summary</h3>
      {weeklyStats.length > 0 && weeklyStats.some(w => w.avgCalories > 0) ? (
        <div className="space-y-5">
          {weeklyStats.map((week, index) => (
            week.avgCalories > 0 ? (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">Week {index + 1}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="text-text-secondary">Avg: {week.avgCalories} kcal</span>
                    {week.hitGoal && <span className="text-brand">✓</span>}
                  </div>
                </div>
                <div className="macro-bar">
                  <div
                    className="macro-bar-fill"
                    style={{ width: `${Math.min((week.avgCalories / 2000) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ) : null
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-text-secondary">Log meals to see weekly summaries</p>
        </div>
      )}
    </div>
  );
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);
  const [dailyStats, setDailyStats] = useState<any[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<any[]>([]);
  const [streak, setStreak] = useState(0);
  const [insights, setInsights] = useState<any[]>([]);
  const [weightEntries, setWeightEntries] = useState<any[]>([]);
  const [avgMacros, setAvgMacros] = useState({ protein: 0, carbs: 0, fat: 0 });

  useEffect(() => {
    const loadData = async () => {
      try {
        // Load user data
        const storedUser = localStorage.getItem('userData');
        const parsedUser = storedUser ? JSON.parse(storedUser) : {};
        setUserData(parsedUser);

        const calorieGoal = parsedUser.targetCalories || 2000;

        // Load analytics data
        const days = timeRange === 'week' ? 7 : timeRange === 'month' ? 30 : 90;
        const daily = await getDailyStats(days, calorieGoal);
        const weekly = await getWeeklyStats(4, calorieGoal);
        const currentStreak = await getCurrentStreak();
        const generatedInsights = await generateInsights(calorieGoal);
        const weights = await getWeightEntries();
        const macros = await getAverageMacros(7);

        setDailyStats(daily);
        setWeeklyStats(weekly);
        setStreak(currentStreak);
        setInsights(generatedInsights);
        setWeightEntries(weights);
        setAvgMacros(macros);
      } catch (error) {
        console.error('Error loading analytics:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [timeRange]);

  const calorieGoal = userData?.targetCalories || 2000;

  const weeklyData = dailyStats.slice(-7).map(s => ({
    day: s.dateLabel,
    calories: s.calories,
  }));

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-hero p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard">
              <button className="w-10 h-10 rounded-full bg-white border border-brand/10 flex items-center justify-center">
                <ArrowLeft className="w-5 h-5 text-text-primary" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Analytics</h1>
              <p className="text-sm text-text-secondary">Track your wellness journey</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 skeleton rounded-3xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Generate default insights if none exist
  const displayInsights = insights.length > 0 ? insights : [
    {
      icon: TrendingDown,
      title: 'Getting Started',
      description: 'Log meals to see progress',
      trend: 'neutral' as const,
      value: '0 days',
      color: 'text-amber-600 bg-amber-100',
    },
    {
      icon: Target,
      title: 'Set Your Goal',
      description: 'Complete onboarding to personalize',
      trend: 'neutral' as const,
      value: '-',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      icon: Award,
      title: 'First Meal',
      description: 'Log your first meal to begin tracking',
      trend: 'neutral' as const,
      value: 'Start',
      color: 'text-brand bg-brand/10',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-hero scrollbar-brand">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-brand/10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <button className="w-10 h-10 rounded-full bg-white border border-brand/10 flex items-center justify-center hover:bg-brand/10 transition-all">
                  <ArrowLeft className="w-5 h-5 text-text-primary" />
                </button>
              </Link>
              <div>
                <h1 className="font-heading text-2xl sm:text-3xl font-bold text-text-primary">
                  Your Progress
                </h1>
                <p className="text-sm text-text-secondary">Track your wellness journey</p>
              </div>
            </div>

            {/* Time Range Selector */}
            <div className="flex gap-2">
              {(['week', 'month', 'year'] as const).map((range) => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-xl font-medium capitalize transition-all ${
                    timeRange === range
                      ? 'bg-brand text-white shadow-lg shadow-brand'
                      : 'bg-white text-text-primary hover:bg-brand/10 border border-brand/10'
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid md:grid-cols-3 gap-6"
        >
          {displayInsights.map((insight, index) => (
            <motion.div
              key={insight.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <InsightCard {...insight} />
            </motion.div>
          ))}
        </motion.div>

        {/* Charts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <WeeklyBarChart data={weeklyData} goal={calorieGoal} />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <MacroDistribution macros={avgMacros} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <WeightProgressChart weightEntries={weightEntries} />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <WeeklySummary weeklyStats={weeklyStats} />
        </motion.div>

        {/* Export Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="flex justify-center"
        >
          <button
            onClick={() => toast.info('Exporting your data...')}
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-white border-2 border-brand/10 text-brand font-semibold hover:bg-brand/10 hover:border-brand/20 transition-all cursor-pointer"
          >
            <Download className="w-5 h-5" />
            Export Report
          </button>
        </motion.div>

        {/* Motivational Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="rounded-3xl bg-gradient-brand p-8 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20">
            <Image
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80"
              alt=""
              width={1200}
              height={400}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <Flame className="w-6 h-6 streak-flame" />
              <span className="text-lg font-semibold">{streak > 0 ? `${streak} Day Streak!` : 'Start Your Journey'}</span>
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-bold mb-3">
              {streak > 0 ? "You're Crushing Your Goals!" : 'Every Journey Begins with a Single Step'}
            </h2>
            <p className="text-white/80 text-lg max-w-2xl mx-auto">
              {streak > 0
                ? `Your dedication is inspiring! You've logged meals for ${streak} day${streak > 1 ? 's' : ''}. Keep pushing forward!`
                : 'Start logging your meals today to see your progress and unlock achievements.'
              }
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
