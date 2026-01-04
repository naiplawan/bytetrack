'use client';

import type React from 'react';
import { OnboardingForm } from '@/components/onboarding/onboarding-form';
import { t } from '@/lib/translations';
import { User, Ruler, Activity, Target } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: t('onboarding_basicInfo_i18n'),
    description: t('onboarding_getToKnowYou_i18n'),
    icon: User,
  },
  {
    id: 2,
    title: t('onboarding_bodyMeasurements_i18n'),
    description: t('onboarding_tellAboutBody_i18n'),
    icon: Ruler,
  },
  {
    id: 3,
    title: t('onboarding_activityLevel_i18n'),
    description: t('onboarding_howActive_i18n'),
    icon: Activity,
  },
  {
    id: 4,
    title: t('onboarding_yourGoal_i18n'),
    description: t('onboarding_whatAchieve_i18n'),
    icon: Target,
  },
];

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background/95 to-accent/5 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-accent/10 rounded-full blur-2xl opacity-30" />
        <div className="absolute top-3/4 left-1/2 w-32 h-32 bg-primary/5 rounded-full blur-xl opacity-50" />
      </div>

      <div className="relative z-10 w-full">
        <OnboardingForm steps={steps} />
      </div>
    </div>
  );
}
