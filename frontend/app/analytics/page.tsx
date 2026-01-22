'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, TrendingDown, Target, Award, Download, Flame } from 'lucide-react';
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

const chartColors = {
  primary: '#22c55e',
  secondary: '#14b8a6',
  accent: '#f97316',
  purple: '#a855f7',
  blue: '#0ea5e9',
};

const weeklyData = [
  { day: 'Mon', calories: 1850, goal: 2000 },
  { day: 'Tue', calories: 2100, goal: 2000 },
  { day: 'Wed', calories: 1920, goal: 2000 },
  { day: 'Thu', calories: 1750, goal: 2000 },
  { day: 'Fri', calories: 2200, goal: 2000 },
  { day: 'Sat', calories: 2400, goal: 2000 },
  { day: 'Sun', calories: 1450, goal: 2000 },
];

const weightData = [
  { date: 'Week 1', weight: 71.2 },
  { date: 'Week 2', weight: 70.8 },
  { date: 'Week 3', weight: 70.5 },
  { date: 'Week 4', weight: 70.2 },
  { date: 'Now', weight: 69.6 },
];

const macroData = [
  { name: 'Protein', value: 125, color: chartColors.primary },
  { name: 'Carbs', value: 200, color: chartColors.secondary },
  { name: 'Fat', value: 55, color: chartColors.accent },
];

const monthlyData = [
  { week: 'Week 1', avgCalories: 1950, avgWeight: 70.5, hitGoal: true },
  { week: 'Week 2', avgCalories: 1880, avgWeight: 70.2, hitGoal: true },
  { week: 'Week 3', avgCalories: 1920, avgWeight: 70.0, hitGoal: true },
  { week: 'Week 4', avgCalories: 1850, avgWeight: 69.6, hitGoal: true },
];

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
      case 'up': return 'text-green-600 bg-green-100';
      case 'down': return 'text-blue-600 bg-blue-100';
      default: return 'text-amber-600 bg-amber-100';
    }
  };

  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return '📈';
      case 'down': return '📉';
      default: return '➡️';
    }
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="wellness-card p-6"
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
      <p className="text-sm text-gray-500">{description}</p>
    </motion.div>
  );
}

function WeeklyBarChart() {
  return (
    <div className="chart-card">
      <h3 className="heading-font text-xl font-bold mb-6">Weekly Calorie Intake</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={weeklyData}>
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

function WeightProgressChart() {
  return (
    <div className="chart-card">
      <h3 className="heading-font text-xl font-bold mb-6">Weight Progress</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={weightData}>
          <XAxis
            dataKey="date"
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#6b7280', fontSize: 12 }}
          />
          <YAxis
            domain={['dataMin - 1', 'dataMax + 1']}
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
        <div className="text-center p-4 bg-green-50 rounded-2xl">
          <p className="text-sm text-gray-500 mb-1">Current</p>
          <p className="text-2xl font-bold text-green-600">69.6 kg</p>
        </div>
        <div className="text-center p-4 bg-amber-50 rounded-2xl">
          <p className="text-sm text-gray-500 mb-1">Goal</p>
          <p className="text-2xl font-bold text-amber-600">68.0 kg</p>
        </div>
      </div>
    </div>
  );
}

function MacroDistribution() {
  return (
    <div className="chart-card">
      <h3 className="heading-font text-xl font-bold mb-6">Macro Distribution</h3>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={macroData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
            labelLine={false}
          >
            {macroData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-6 space-y-3">
        {macroData.map((macro) => (
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
    </div>
  );
}

function WeeklySummary() {
  return (
    <div className="chart-card">
      <h3 className="heading-font text-xl font-bold mb-6">Monthly Summary</h3>
      <div className="space-y-5">
        {monthlyData.map((week) => (
          <div key={week.week} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-semibold">{week.week}</span>
              <div className="flex items-center gap-4 text-sm">
                <span className="text-gray-500">Avg: {week.avgCalories} kcal</span>
                <span className="font-semibold">{week.avgWeight} kg</span>
                {week.hitGoal && (
                  <span className="text-green-600">✓</span>
                )}
              </div>
            </div>
            <div className="weekly-bar">
              <div
                className="weekly-fill"
                style={{ width: `${(week.avgCalories / 2000) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('week');
  const [isLoading, setIsLoading] = useState(true);

  const insights = [
    {
      icon: TrendingDown,
      title: 'Great Progress!',
      description: "You've lost 1.6 kg this month",
      trend: 'down' as const,
      value: '-1.6 kg',
      color: 'text-blue-600 bg-blue-100',
    },
    {
      icon: Target,
      title: 'On Track',
      description: 'Hit calorie goal 5 of 7 days',
      trend: 'neutral' as const,
      value: '71%',
      color: 'text-amber-600 bg-amber-100',
    },
    {
      icon: Award,
      title: 'New Streak!',
      description: '14-day logging streak',
      trend: 'up' as const,
      value: '14 days',
      color: 'text-green-600 bg-green-100',
    },
  ];

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, [timeRange]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-amber-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Link href="/dashboard">
              <button className="w-10 h-10 rounded-full bg-white border border-green-200 flex items-center justify-center">
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
            </Link>
            <div>
              <h1 className="text-2xl font-bold">Analytics</h1>
              <p className="text-sm text-gray-500">Track your wellness journey</p>
            </div>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 wellness-skeleton rounded-3xl" />
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/dashboard">
                <button className="w-10 h-10 rounded-full bg-white border border-green-200 flex items-center justify-center hover:bg-green-50 transition-all">
                  <ArrowLeft className="w-5 h-5 text-gray-600" />
                </button>
              </Link>
              <div>
                <h1 className="heading-font text-2xl sm:text-3xl font-bold text-gray-800">
                  Your Progress
                </h1>
                <p className="text-sm text-gray-500">Track your wellness journey</p>
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
                      ? 'bg-primary text-white shadow-lg shadow-green-200'
                      : 'bg-white text-gray-600 hover:bg-green-50 border border-green-200'
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
          {insights.map((insight, index) => (
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
          <WeeklyBarChart />
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <MacroDistribution />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <WeightProgressChart />
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <WeeklySummary />
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
            className="flex items-center gap-3 px-8 py-4 rounded-full bg-white border-2 border-green-200 text-green-700 font-semibold hover:bg-green-50 hover:border-green-300 transition-all"
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
          className="rounded-3xl bg-gradient-to-r from-green-500 via-teal-500 to-cyan-500 p-8 text-white relative overflow-hidden"
        >
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1200&q=80"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative z-10 text-center">
            <div className="inline-flex items-center gap-2 mb-4">
              <Flame className="w-6 h-6 streak-flame" />
              <span className="text-lg font-semibold">Amazing Progress!</span>
            </div>
            <h2 className="heading-font text-3xl sm:text-4xl font-bold mb-3">
              You're Crushing Your Goals! 🏆
            </h2>
            <p className="text-green-100 text-lg max-w-2xl mx-auto">
              Your dedication is inspiring! You've maintained a 14-day streak and are just 1.6kg from your goal weight.
              Keep pushing forward!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
