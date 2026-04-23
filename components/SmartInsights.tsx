'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, TrendingUp, AlertTriangle, Lightbulb, Award, ChevronRight } from 'lucide-react';
import {
  generateRecommendations,
  analyzeConsistency,
  generateDailyTip,
  type Insight,
  type UserDataInput,
} from '@/lib/insights-engine';

interface ConsistencyReportShape {
  mealLogging: { streak: number; daysThisMonth: number };
  calorieConsistency: { percentage: number };
  recommendation: string;
}

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
  userData?: UserDataInput;
}) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInsights = async () => {
      try {
        const recommendations = await generateRecommendations(calorieGoal, userData);
        setInsights(recommendations.slice(0, 3));
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
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h3 className="font-bold text-foreground">Smart Insights</h3>
              <p className="text-xs text-muted-foreground">Personalized recommendations</p>
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
                className="mb-3 last:mb-0 p-4 rounded-xl border border-border"
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-foreground">{insight.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{insight.description}</p>
                    {insight.actionable && insight.action && (
                      <button
                        onClick={insight.action.callback}
                        className="mt-2 text-xs font-medium text-primary hover:text-primary/80 flex items-center gap-1"
                      >
                        {insight.action.label}
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                  <button
                    onClick={() => handleDismiss(insight.id)}
                    className="flex-shrink-0 w-6 h-6 rounded-full hover:bg-muted flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
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
      className="card-brand p-6"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-primary" />
        </div>
        <div>
          <h3 className="font-bold text-foreground">Daily Tip</h3>
          <p className="text-xs text-muted-foreground">Quick wellness insight</p>
        </div>
      </div>
      <p className="text-sm text-foreground leading-relaxed">{tip}</p>
    </motion.div>
  );
}

export function ConsistencyScore({ calorieGoal }: { calorieGoal: number }) {
  const [score, setScore] = useState<number>(0);
  const [report, setReport] = useState<ConsistencyReportShape | null>(null);

  useEffect(() => {
    const loadConsistency = async () => {
      const consistencyReport = await analyzeConsistency(calorieGoal);
      setScore(consistencyReport.overallScore);
      setReport(consistencyReport);
    };
    loadConsistency();
  }, [calorieGoal]);

  const getScoreColor = () => {
    if (score >= 80) return 'text-emerald-600';
    if (score >= 60) return 'text-primary';
    if (score >= 40) return 'text-amber-600';
    return 'text-gray-600';
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
          <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Award className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Consistency Score</h3>
            <p className="text-xs text-muted-foreground">Based on your logging habits</p>
          </div>
        </div>
        <div className={`text-3xl font-bold ${getScoreColor()}`}>{score}</div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Current Streak</span>
          <span className="font-semibold text-foreground">{report.mealLogging.streak} days</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Days Logged This Month</span>
          <span className="font-semibold text-foreground">{report.mealLogging.daysThisMonth} days</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">Goal Hit Rate</span>
          <span className="font-semibold text-foreground">{report.calorieConsistency.percentage}%</span>
        </div>
      </div>

      <div className="mt-4 p-3 bg-muted rounded-lg">
        <p className="text-xs text-muted-foreground">{report.recommendation}</p>
      </div>
    </motion.div>
  );
}