'use client';

import type React from 'react';
import { motion } from 'framer-motion';
import { UseFormReturn } from 'react-hook-form';
import { FormRadioGroup } from '@/components/ui/form-radio-group';
import { t } from '@/lib/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import { fadeIn } from '@/lib/motion-variants';
import type { OnboardingFormData } from '@/lib/validations/onboarding';
import { TrendingDown, Minus, TrendingUp, Target, Lightbulb, Star } from 'lucide-react';

interface Step4Props {
  form: UseFormReturn<OnboardingFormData>;
}

export const Step4Goals: React.FC<Step4Props> = ({ form }) => {
  const { language } = useLanguage();
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;

  const goalOptions = [
    {
      value: 'lose',
      label: t('step4_loseWeight_i18n', language),
      description: t('step4_loseWeightDesc_i18n', language),
      icon: TrendingDown,
      badge: t('step4_popular_i18n', language),
    },
    {
      value: 'maintain',
      label: t('step4_maintainWeight_i18n', language),
      description: t('step4_maintainWeightDesc_i18n', language),
      icon: Minus,
    },
    {
      value: 'gain',
      label: t('step4_gainWeight_i18n', language),
      description: t('step4_gainWeightDesc_i18n', language),
      icon: TrendingUp,
    },
  ];

  const selectedGoal = watch('goal');

  const getGoalExplanation = (goal: string) => {
    switch (goal) {
      case 'lose':
        return {
          title: t('step4_loseStrategyTitle_i18n', language),
          description: t('step4_loseStrategyDesc_i18n', language),
          tips: [
            t('step4_loseTip1_i18n', language),
            t('step4_loseTip2_i18n', language),
            t('step4_loseTip3_i18n', language),
            t('step4_loseTip4_i18n', language),
          ],
        };
      case 'maintain':
        return {
          title: t('step4_maintainStrategyTitle_i18n', language),
          description: t('step4_maintainStrategyDesc_i18n', language),
          tips: [
            t('step4_maintainTip1_i18n', language),
            t('step4_maintainTip2_i18n', language),
            t('step4_maintainTip3_i18n', language),
            t('step4_maintainTip4_i18n', language),
          ],
        };
      case 'gain':
        return {
          title: t('step4_gainStrategyTitle_i18n', language),
          description: t('step4_gainStrategyDesc_i18n', language),
          tips: [
            t('step4_gainTip1_i18n', language),
            t('step4_gainTip2_i18n', language),
            t('step4_gainTip3_i18n', language),
            t('step4_gainTip4_i18n', language),
          ],
        };
      default:
        return null;
    }
  };

  const goalInfo = selectedGoal ? getGoalExplanation(selectedGoal) : null;

  return (
    <motion.div
      key="step4"
      className="max-w-3xl mx-auto space-y-8"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mb-6">
          <Target className="w-8 h-8 text-primary" />
        </div>
        <h3 className="spotify-text-heading mb-3">{t('step4_title_i18n', language)}</h3>
        <p className="spotify-text-body text-muted-foreground max-w-2xl mx-auto">
          {t('step4_description_i18n', language)}
        </p>
      </div>

      <div>
        <FormRadioGroup
          label=""
          value={watch('goal')}
          onValueChange={(value) => {
            setValue('goal', value as OnboardingFormData['goal'], { shouldValidate: true });
          }}
          options={goalOptions}
          layout="vertical"
          variant="premium"
          error={errors.goal?.message}
          className="space-y-4"
        />
      </div>

      {/* Dynamic Goal Explanation */}
      {goalInfo && (
        <div className="mt-8 p-6 bg-gradient-to-br from-primary/5 via-background to-accent/5 rounded-xl border border-primary/20">
          <div className="flex items-start gap-4">
            <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-1">
              <Lightbulb className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <h4 className="text-base font-semibold text-foreground mb-2 flex items-center gap-2">
                {goalInfo.title}
                <Star className="w-4 h-4 text-accent" />
              </h4>
              <p className="text-sm text-muted-foreground mb-4">{goalInfo.description}</p>
              <div>
                <p className="text-sm font-medium text-foreground mb-2">{t('step4_keyStrategies_i18n', language)}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {goalInfo.tips.map((tip, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs text-muted-foreground"
                    >
                      <div className="w-1.5 h-1.5 bg-primary/60 rounded-full"></div>
                      <span>{tip}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Tip */}
      <div className="mt-6 p-4 bg-accent/5 rounded-xl border border-accent/20">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center mt-0.5">
            <Star className="w-3 h-3 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">{t('step4_tipTitle_i18n', language)}</p>
            <p className="text-xs text-muted-foreground">
              {t('step4_tipDescription_i18n', language)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
