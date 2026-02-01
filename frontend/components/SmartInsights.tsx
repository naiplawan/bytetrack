'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, TrendingUp, AlertTriangle, Lightbulb, Award, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import {
  generateRecommendations,
  analyzeConsistency,
  predictWeightTrajectory,
  generateDailyTip,
  type Insight,
} from '@/lib/insights-engine';

const iconMap = {
  achievement: Award,
  warning: AlertTriangle,
  tip: Lightbulb,
  recommendation: TrendingUp,
  pattern: Sparkles,
};

export function SmartInsights({
  calorieGoal,
  userData,
}: {
  calorieGoal: number;
  userData?: any;
}) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const recommendations = await generateRecommendations(calorieGoal, userData);
        setInsights(recommendations.slice(0, 3)); // Show top 3
      } catch (error) {
        console.error('Error loading insights:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInsights();
  }, [calorieGoal, userData]);

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set([...prev, id]));
  };

  const visibleInsights = insights.filter((i) => !dismissed.has(i.id));

  if (isLoading || visibleInsights.length === 0) {
    return null;
  }

  return (
    <div className="card-brand p-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-brand/5 rounded-full blur-3xl" />
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-brand flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-text-primary">Smart Insights</h3>
              <p className="text-xs text-text-secondary">AI-powered recommendations</p>
            </div>
          </div>
        </div>

        <AnimatePresence mode="popLayout">
          {visibleInsights.map((insight) => {
            const Icon = iconMap[insight.type] || Sparkles;

            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, height: 0, y: -10 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className={`mb-3 last:mb-0 p-4 rounded-2xl border ${
                  insight.type === 'warning'
                    ? 'bg-amber-50 border-amber-200'
                    : insight.type === 'achievement'
                    ? 'bg-brand/10 border-brand/20'
                    : 'bg-white border-brand/10'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      insight.type === 'warning'
                        ? 'bg-amber-100 text-amber-600'
                        : insight.type === 'achievement'
                        ? 'bg-brand/20 text-brand'
                        : 'bg-brand/10 text-brand'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-text-primary">{insight.title}</p>
                    <p className="text-xs text-text-secondary mt-0.5">{insight.description}</p>
                    {insight.actionable && insight.action && (
                      <button
                        onClick={insight.action.callback}
                        className="mt-2 text-xs font-medium text-brand hover:text-brand/80 flex items-center gap-1"
                      >
                        {insight.action.label}
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleDismiss(insight.id)}
                    className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-black/5 flex items-center justify-center text-text-muted hover:text-text-primary transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

export function DailyTipCard() {
  const [tip, setTip] = useState<string>('');

  useEffect(() => {
    setTip(generateDailyTip());
  }, []);

  if (!tip) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-brand p-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-brand/5 to-brandLight/10" />
      <div className="relative z-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-brand flex items-center justify-center">
            <Lightbulb className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary">Daily Wellness Tip</h3>
            <p className="text-xs text-text-secondary">Boost your health journey</p>
          </div>
        </div>
        <p className="text-sm text-text-primary leading-relaxed">{tip}</p>
      </div>
    </motion.div>
  );
}

export function ConsistencyScore({ calorieGoal }: { calorieGoal: number }) {
  const [score, setScore] = useState<number>(0);
  const [report, setReport] = useState<any>(null);

  useEffect(() => {
    const loadConsistency = async () => {
      const consistencyReport = await analyzeConsistency(calorieGoal);
      setScore(consistencyReport.overallScore);
      setReport(consistencyReport);
    };
    loadConsistency();
  }, [calorieGoal]);

  const getScoreColor = () => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-brand';
    if (score >= 40) return 'text-amber-600';
    return 'text-gray-600';
  };

  const getScoreBg = () => {
    if (score >= 80) return 'bg-green-100';
    if (score >= 60) return 'bg-brand/10';
    if (score >= 40) return 'bg-amber-100';
    return 'bg-gray-100';
  };

  if (!report) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card-brand p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-brand flex items-center justify-center">
            <Award className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-text-primary">Consistency Score</h3>
            <p className="text-xs text-text-secondary">Based on your logging habits</p>
          </div>
        </div>
        <div className={`text-3xl font-bold ${getScoreColor()}`}>{score}</div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Current Streak</span>
          <span className="font-semibold text-text-primary">{report.mealLogging.streak} days</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Days Logged This Month</span>
          <span className="font-semibold text-text-primary">{report.mealLogging.daysThisMonth} days</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Goal Hit Rate</span>
          <span className="font-semibold text-text-primary">{report.calorieConsistency.percentage}%</span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-brand/5 rounded-xl">
        <p className="text-xs text-text-secondary">{report.recommendation}</p>
      </div>
    </motion.div>
  );
}
