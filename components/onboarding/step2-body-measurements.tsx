'use client';

import type React from 'react';
import { motion } from 'framer-motion';
import type { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/modern-input';
import { t } from '@/lib/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import { fadeIn } from '@/lib/motion-variants';
import type { OnboardingFormData } from '@/lib/validations/onboarding';
import { Scale, Target, Calculator, Info } from 'lucide-react';

interface Step2Props {
  form: UseFormReturn<OnboardingFormData>;
}

export const Step2BodyMeasurements: React.FC<Step2Props> = ({ form }) => {
  const { language } = useLanguage();
  const {
    register,
    formState: { errors },
  } = form;

  return (
    <motion.div
      key="step2"
      className="max-w-lg mx-auto space-y-8"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mb-6">
          <Calculator className="w-8 h-8 text-primary" />
        </div>
        <h3 className="spotify-text-heading mb-3">{t('step2_title_i18n', language)}</h3>
        <p className="spotify-text-body text-muted-foreground max-w-lg mx-auto">
          {t('step2_description_i18n', language)}
        </p>
      </div>

      <motion.div
        className="space-y-8"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.15,
            },
          },
        }}
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Input
            label={t('step2_heightLabel_i18n', language)}
            type="number"
            placeholder={t('step2_heightPlaceholder_i18n', language)}
            min="100"
            max="250"
            step="0.1"
            error={errors.height?.message}
            variant="glass"
            inputSize="lg"
            helperText={t('step2_heightHelper_i18n', language)}
            {...register('height')}
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Input
            label={t('step2_weightLabel_i18n', language)}
            type="number"
            placeholder={t('step2_weightPlaceholder_i18n', language)}
            min="30"
            max="300"
            step="0.1"
            error={errors.weight?.message}
            leftIcon={<Scale className="w-4 h-4" />}
            variant="glass"
            inputSize="lg"
            helperText={t('step2_weightHelper_i18n', language)}
            {...register('weight')}
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Input
            label={t('step2_goalWeightLabel_i18n', language)}
            type="number"
            placeholder={t('step2_goalWeightPlaceholder_i18n', language)}
            min="30"
            max="300"
            step="0.1"
            error={errors.goalWeight?.message}
            leftIcon={<Target className="w-4 h-4" />}
            variant="glass"
            inputSize="lg"
            helperText={t('step2_goalWeightHelper_i18n', language)}
            {...register('goalWeight')}
          />
        </motion.div>
      </motion.div>

      {/* Information Cards */}
      <div className="space-y-4">
        <div className="p-4 bg-primary/5 rounded-xl border border-primary/20">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
              <Info className="w-3 h-3 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">{t('step2_infoTitle_i18n', language)}</p>
              <p className="text-xs text-muted-foreground">
                {t('step2_infoDescription_i18n', language)}
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 bg-accent/5 rounded-xl border border-accent/20">
          <div className="flex items-start gap-3">
            <div className="w-5 h-5 bg-accent/20 rounded-full flex items-center justify-center mt-0.5">
              <Target className="w-3 h-3 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground mb-1">{t('step2_tipTitle_i18n', language)}</p>
              <p className="text-xs text-muted-foreground">
                {t('step2_tipDescription_i18n', language)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
