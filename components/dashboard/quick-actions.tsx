'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, Target, Calendar, TrendingUp } from 'lucide-react';
import { fadeIn } from './motion-variants';
import { t } from '@/lib/translations';
import { useLanguage } from '@/contexts/LanguageContext';

interface QuickActionsProps {
  onViewAnalytics?: () => void;
  onUpdateGoals?: () => void;
  onMealPlanning?: () => void;
  onProgressReport?: () => void;
}

const ActionButton = React.memo<{
  icon: React.ElementType;
  label: string;
  onClick?: () => void;
}>(({ icon: Icon, label, onClick }) => (
  <motion.div whileHover={{ scale: 1.02, x: 4 }} whileTap={{ scale: 0.98 }}>
    <Button
      variant="outline"
      size="sm"
      className="w-full justify-start group transition-all duration-200 hover:border-primary/50 hover:bg-primary/5"
      onClick={onClick}
    >
      <Icon className="w-4 h-4 mr-2 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
      {label}
    </Button>
  </motion.div>
));
ActionButton.displayName = 'ActionButton';

export function QuickActions({ onViewAnalytics, onUpdateGoals, onMealPlanning, onProgressReport }: QuickActionsProps) {
  const { language } = useLanguage();

  const actions = [
    { icon: BarChart3, label: t('quickActions_viewAnalytics_i18n', language), onClick: onViewAnalytics },
    { icon: Target, label: t('quickActions_updateGoals_i18n', language), onClick: onUpdateGoals },
    { icon: Calendar, label: t('quickActions_mealPlanning_i18n', language), onClick: onMealPlanning },
    { icon: TrendingUp, label: t('quickActions_progressReport_i18n', language), onClick: onProgressReport },
  ];

  return (
    <motion.div variants={fadeIn}>
      <Card className="spotify-card">
        <CardHeader>
          <CardTitle>{t('quickActions_title_i18n', language)}</CardTitle>
          <CardDescription>{t('quickActions_description_i18n', language)}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {actions.map((action, index) => (
            <ActionButton
              key={index}
              icon={action.icon}
              label={action.label}
              onClick={action.onClick}
            />
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
