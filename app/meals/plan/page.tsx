'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, ArrowLeft, Construction } from 'lucide-react';
import { t } from '@/lib/translations';
import { useLanguage } from '@/contexts/LanguageContext';

export default function MealPlanPage() {
  const router = useRouter();
  const { language } = useLanguage();

  return (
    <div className="min-h-screen bg-background p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/dashboard')}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{t('mealPlan_title_i18n', language)}</h1>
            <p className="text-muted-foreground text-sm">
              {t('mealPlan_description_i18n', language)}
            </p>
          </div>
        </div>

        {/* Coming Soon Card */}
        <Card>
          <CardHeader className="text-center pb-4">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mx-auto mb-4">
              <Calendar className="w-8 h-8 text-primary" />
            </div>
            <div className="inline-flex items-center gap-2 bg-amber-500/10 px-3 py-1 rounded-full mx-auto mb-2">
              <Construction className="w-4 h-4 text-amber-500" />
              <span className="text-sm font-medium text-amber-500">
                {t('comingSoon_title_i18n', language)}
              </span>
            </div>
            <CardTitle>{t('mealPlan_title_i18n', language)}</CardTitle>
            <CardDescription>
              {t('comingSoon_description_i18n', language)}
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-6">
              {t('mealPlan_description_i18n', language)}
            </p>
            <Button
              variant="primary"
              onClick={() => router.push('/dashboard')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              {t('comingSoon_backToDashboard_i18n', language)}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
