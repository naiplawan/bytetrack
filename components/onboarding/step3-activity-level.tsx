import type React from 'react';
import { motion } from 'framer-motion';
import { UseFormReturn } from 'react-hook-form';
import { FormRadioGroup } from '@/components/ui/form-radio-group';
import { t } from '@/lib/translations';
import { useLanguage } from '@/contexts/LanguageContext';
import { fadeIn } from '@/lib/motion-variants';
import type { OnboardingFormData } from '@/lib/validations/onboarding';
import { UserX, Zap, Activity, Dumbbell, Mountain, Heart, Info } from 'lucide-react';

interface Step3Props {
  form: UseFormReturn<OnboardingFormData>;
}

export const Step3ActivityLevel: React.FC<Step3Props> = ({ form }) => {
  const { language } = useLanguage();
  const {
    setValue,
    watch,
    formState: { errors },
  } = form;

  const activityOptions = [
    {
      value: 'sedentary',
      label: t('activity_sedentary_i18n', language),
      description: t('activity_sedentary_desc_i18n', language),
      icon: UserX,
      badge: 'x1.2',
    },
    {
      value: 'light',
      label: t('activity_light_i18n', language),
      description: t('activity_light_desc_i18n', language),
      icon: Zap,
      badge: 'x1.375',
    },
    {
      value: 'moderate',
      label: t('activity_moderate_i18n', language),
      description: t('activity_moderate_desc_i18n', language),
      icon: Activity,
      badge: 'x1.55',
    },
    {
      value: 'very',
      label: t('activity_active_i18n', language),
      description: t('activity_active_desc_i18n', language),
      icon: Dumbbell,
      badge: 'x1.725',
    },
    {
      value: 'extreme',
      label: t('activity_extreme_i18n', language),
      description: t('activity_veryActive_desc_i18n', language),
      icon: Mountain,
      badge: 'x1.9',
    },
  ];

  return (
    <motion.div
      key="step3"
      className="max-w-3xl mx-auto space-y-8"
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary/20 to-accent/20 rounded-full mb-6">
          <Heart className="w-8 h-8 text-primary" />
        </div>
        <h3 className="spotify-text-heading mb-3">{t('step3_title_i18n', language)}</h3>
        <p className="spotify-text-body text-muted-foreground max-w-2xl mx-auto">
          {t('step3_description_i18n', language)}
        </p>
      </div>

      <div>
        <FormRadioGroup
          label=""
          value={watch('activityLevel')}
          onValueChange={(value) => {
            setValue('activityLevel', value as OnboardingFormData['activityLevel'], { shouldValidate: true });
          }}
          options={activityOptions}
          layout="vertical"
          variant="premium"
          size="lg"
          error={errors.activityLevel?.message}
        />
      </div>

      {/* Information Card */}
      <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/20">
        <div className="flex items-start gap-4">
          <div className="w-6 h-6 bg-primary/20 rounded-full flex items-center justify-center mt-1">
            <Info className="w-4 h-4 text-primary" />
          </div>
          <div>
            <p className="text-base font-medium text-foreground mb-2">{t('step3_infoTitle_i18n', language)}</p>
            <p className="text-sm text-muted-foreground mb-3">
              {t('step3_infoDescription_i18n', language)}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-muted rounded-full"></div>
                <span className="text-muted-foreground">{t('activity_sedentary_i18n', language)}: {t('activity_sedentary_desc_i18n', language)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary/60 rounded-full"></div>
                <span className="text-muted-foreground">{t('activity_light_i18n', language)}: {t('activity_light_desc_i18n', language)}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span className="text-muted-foreground">{t('activity_moderate_i18n', language)}: {t('activity_moderate_desc_i18n', language)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
