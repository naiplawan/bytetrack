'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Flame as Fire } from 'lucide-react';
import { fadeIn } from './motion-variants';
import { t } from '@/lib/translations';
import { useLanguage } from '@/contexts/LanguageContext';

interface CalorieOverviewProps {
  calorieGoal: number;
  caloriesConsumed: number;
  macros?: {
    carbs: number;  // percentage
    protein: number;  // percentage
    fat: number;  // percentage
  };
}

export function CalorieOverview({
  calorieGoal,
  caloriesConsumed,
  macros = { carbs: 50, protein: 20, fat: 30 }
}: CalorieOverviewProps) {
  const { language } = useLanguage();
  const caloriesRemaining = Math.max(calorieGoal - caloriesConsumed, 0);
  const caloriesOver = caloriesConsumed > calorieGoal ? caloriesConsumed - calorieGoal : 0;
  const progressPercentage = (caloriesConsumed / calorieGoal) * 100;
  const isOverGoal = caloriesConsumed > calorieGoal;

  return (
    <motion.div variants={fadeIn} className="lg:col-span-2">
      <Card className="spotify-card-interactive border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5">
        <CardHeader className="pb-6">
          <CardTitle className="spotify-flex-between">
            <div className="spotify-flex-center gap-3">
              <Fire className="w-7 h-7 text-primary" aria-hidden="true" />
              <span className="spotify-text-heading">{t('calorieOverview_title_i18n', language)}</span>
            </div>
            <div
              className="w-4 h-4 bg-primary rounded-full animate-glow"
              aria-hidden="true"
            />
          </CardTitle>
          <CardDescription className="spotify-text-body">
            {t('calorieOverview_description_i18n', language)}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center" role="status" aria-live="polite">
            <motion.div
              className={`text-5xl sm:text-6xl font-bold mb-3 ${
                isOverGoal ? 'text-destructive' : 'spotify-text-gradient'
              }`}
              key={isOverGoal ? 'over' : 'remaining'}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
            >
              {isOverGoal ? caloriesOver : caloriesRemaining}
            </motion.div>
            <div className="spotify-text-small text-lg">
              {isOverGoal ? (
                <span className="text-destructive">{t('calorieOverview_overGoal_i18n', language)}</span>
              ) : (
                t('calorieOverview_remaining_i18n', language)
              )}
            </div>
            <span className="sr-only">
              {isOverGoal
                ? `You have consumed ${caloriesOver} calories over your goal of ${calorieGoal}`
                : `You have ${caloriesRemaining} calories remaining out of your goal of ${calorieGoal}`}
            </span>
          </div>

          <div className="relative">
            <div
              className="spotify-progress-bar h-4"
              role="progressbar"
              aria-valuenow={caloriesConsumed}
              aria-valuemin={0}
              aria-valuemax={calorieGoal}
              aria-label={`Calorie progress: ${caloriesConsumed} of ${calorieGoal} calories consumed`}
            >
              <motion.div
                className={`h-full rounded-full transition-all duration-500 ${
                  isOverGoal
                    ? 'bg-gradient-to-r from-destructive/80 to-destructive'
                    : 'spotify-progress-fill shadow-glow'
                }`}
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <div className="spotify-flex-between text-sm spotify-text-small mt-3">
              <span>0</span>
              <span className={`font-semibold ${isOverGoal ? 'text-destructive' : 'text-primary'}`}>
                {caloriesConsumed} {t('dashboard_consumed_i18n', language).toLowerCase()}
              </span>
              <span>{calorieGoal} {t('dashboard_goal_i18n', language).toLowerCase()}</span>
            </div>
          </div>

          <div
            className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 border-t border-border/30"
            role="list"
            aria-label={t('calorieOverview_macros_i18n', language)}
          >
            <div className="text-center" role="listitem">
              <div className="text-2xl sm:text-3xl font-bold text-chart-2 mb-1">{macros.carbs}%</div>
              <div className="spotify-text-small text-xs sm:text-sm">{t('dashboard_carbs_i18n', language)}</div>
            </div>
            <div className="text-center" role="listitem">
              <div className="text-2xl sm:text-3xl font-bold text-chart-3 mb-1">{macros.protein}%</div>
              <div className="spotify-text-small text-xs sm:text-sm">{t('dashboard_protein_i18n', language)}</div>
            </div>
            <div className="text-center" role="listitem">
              <div className="text-2xl sm:text-3xl font-bold text-chart-5 mb-1">{macros.fat}%</div>
              <div className="spotify-text-small text-xs sm:text-sm">{t('dashboard_fat_i18n', language)}</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
