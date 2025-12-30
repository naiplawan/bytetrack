'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { Apple, ChevronRight, Plus, UtensilsCrossed } from 'lucide-react';
import { fadeIn } from './motion-variants';
import { Meal } from './types';
import { t } from '@/lib/translations';
import { useLanguage } from '@/contexts/LanguageContext';

interface RecentMealsProps {
  meals: Meal[];
  onAddMeal?: () => void;
  onMealClick?: (meal: Meal) => void;
  isLoading?: boolean;
}

// Memoized meal item component to prevent unnecessary re-renders
const MealItem = React.memo<{ meal: Meal; index: number; onClick?: () => void }>(({ meal, index, onClick }) => {
  const handleClick = () => {
    onClick?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <motion.div
      className="flex items-center justify-between p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer group"
      whileHover={{ scale: 1.01 }}
      whileTap={{ scale: 0.99 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      role="button"
      tabIndex={0}
      aria-label={`${meal.name} at ${meal.time}, ${meal.calories} calories, ${meal.items}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-foreground">{meal.name}</h4>
          <span className="text-sm text-muted-foreground">{meal.time}</span>
        </div>
        <p className="text-sm text-muted-foreground">{meal.items}</p>
      </div>
      <div className="text-right flex items-center gap-2">
        <div className="font-semibold text-primary">{meal.calories} cal</div>
        <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
      </div>
    </motion.div>
  );
});
MealItem.displayName = 'MealItem';

export const RecentMeals = React.memo<RecentMealsProps>(({ meals, onAddMeal, onMealClick, isLoading }) => {
  const { language } = useLanguage();
  const router = useRouter();
  const hasMeals = meals && meals.length > 0;

  const handleMealClick = (meal: Meal) => {
    if (onMealClick) {
      onMealClick(meal);
    } else {
      // Default behavior: navigate to meal details
      router.push(`/meals?highlight=${encodeURIComponent(meal.name)}`);
    }
  };

  return (
    <motion.div variants={fadeIn} className="lg:col-span-2">
      <Card className="spotify-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Apple className="w-5 h-5 text-primary" aria-hidden="true" />
              <span>{t('recentMeals_title_i18n', language)}</span>
            </CardTitle>
            <CardDescription>{t('recentMeals_description_i18n', language)}</CardDescription>
          </div>
          <Button
            size="sm"
            variant="spotify"
            onClick={onAddMeal}
            isLoading={isLoading}
            aria-label={t('recentMeals_addMeal_i18n', language)}
          >
            <Plus className="w-4 h-4 mr-1" aria-hidden="true" />
            {t('recentMeals_addMeal_i18n', language)}
          </Button>
        </CardHeader>
        <CardContent>
          {hasMeals ? (
            <div className="space-y-3" role="list" aria-label={t('recentMeals_title_i18n', language)}>
              {meals.map((meal, index) => (
                <MealItem
                  key={`${meal.name}-${meal.time}`}
                  meal={meal}
                  index={index}
                  onClick={() => handleMealClick(meal)}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={UtensilsCrossed}
              title={t('recentMeals_noMeals_i18n', language)}
              description={t('recentMeals_noMealsDescription_i18n', language)}
              variant="minimal"
              action={
                <Button variant="primary" size="sm" onClick={onAddMeal}>
                  <Plus className="w-4 h-4 mr-1" aria-hidden="true" />
                  {t('recentMeals_logFirstMeal_i18n', language)}
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
});
RecentMeals.displayName = 'RecentMeals';
