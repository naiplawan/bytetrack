import type React from 'react';
import { motion } from 'framer-motion';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/modern-input';
import { FormRadioGroup } from '@/components/ui/form-radio-group';
import { t } from '@/lib/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import { fadeIn } from '@/lib/motion-variants';
import type { OnboardingFormData } from '@/lib/validations/onboarding';
import { Calendar, User2, Users, Sparkles } from 'lucide-react';

interface Step1Props {
  form: UseFormReturn<OnboardingFormData>;
}

export const Step1BasicInfo: React.FC<Step1Props> = ({ form }) => {
  const { language } = useLanguage();
  const {
    register,
    setValue,
    watch,
    formState: { errors },
  } = form;

  const genderOptions = [
    {
      value: 'male',
      label: t('step1_male_i18n', language),
      icon: User2,
      description: t('step1_male_i18n', language),
    },
    {
      value: 'female',
      label: t('step1_female_i18n', language),
      icon: Users,
      description: t('step1_female_i18n', language),
    },
    {
      value: 'other',
      label: t('step1_other_i18n', language),
      icon: User2,
      description: t('step1_other_i18n', language),
    },
  ];

  return (
    <motion.div
      key="step1"
      className="max-w-lg mx-auto space-y-8"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mb-6">
          <Calendar className="w-8 h-8 text-primary" />
        </div>
        <h3 className="spotify-text-heading mb-3">{t('step1_title_i18n', language)}</h3>
        <p className="spotify-text-body text-muted-foreground">
          {t('step1_description_i18n', language)}
        </p>
      </div>

      <motion.div
        className="space-y-8"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
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
            label={t('step1_ageLabel_i18n', language)}
            type="number"
            placeholder={t('step1_agePlaceholder_i18n', language)}
            min="18"
            max="100"
            error={errors.age?.message}
            leftIcon={<Calendar className="w-4 h-4" />}
            variant="glass"
            inputSize="lg"
            helperText={t('step1_ageHelper_i18n', language)}
            {...register('age')}
          />
        </motion.div>

        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <div className="space-y-4">
            <label className="block text-sm font-medium text-foreground">{t('step1_genderLabel_i18n', language)}</label>
            <FormRadioGroup
              label=""
              value={watch('gender')}
              onValueChange={(value) => {
                setValue('gender', value as 'male' | 'female' | 'other', { shouldValidate: true });
              }}
              options={genderOptions}
              layout="grid"
              variant="card"
              error={errors.gender?.message}
              className="grid-cols-3 gap-3"
            />
            {errors.gender && <p className="text-sm text-destructive mt-2">{errors.gender.message}</p>}
          </div>
        </motion.div>
      </motion.div>

      <div className="mt-8 p-4 bg-primary/5 rounded-xl border border-primary/20">
        <div className="flex items-start gap-3">
          <div className="w-5 h-5 bg-primary/20 rounded-full flex items-center justify-center mt-0.5">
            <Sparkles className="w-3 h-3 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground mb-1">{t('step2_infoTitle_i18n', language)}</p>
            <p className="text-xs text-muted-foreground">
              {t('step1_genderHelper_i18n', language)}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
