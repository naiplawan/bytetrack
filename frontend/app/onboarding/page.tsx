'use client';

import { useState, useMemo } from 'react';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { toast } from 'sonner';
import {
  calculateBMR,
  calculateTDEE,
  calculateTargetCalories,
  calculateMacroTargets,
  calculateWaterIntake,
  type Gender,
} from '@/lib/calorie-calculator';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TranslationKeys } from '@/lib/translations';

interface OnboardingData {
  name?: string;
  email?: string;
  age?: number;
  gender?: Gender;
  height?: number;
  weight?: number;
  target_weight?: number;
  activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  goal?: 'lose_weight' | 'maintain_weight' | 'gain_weight';
}

const activityLevelMap: Record<string, string> = {
  sedentary: 'sedentary',
  lightly_active: 'light',
  moderately_active: 'moderate',
  very_active: 'very',
  extra_active: 'extreme',
};

const goalMap: Record<string, string> = {
  lose_weight: 'loseWeight',
  maintain_weight: 'maintainWeight',
  gain_weight: 'gainWeight',
};

const ACTIVITY_OPTIONS: Array<{ value: NonNullable<OnboardingData['activity_level']>; labelKey: TranslationKeys; descKey: TranslationKeys }> = [
  { value: 'sedentary', labelKey: 'ob_activitySedentary_i18n', descKey: 'ob_activitySedentaryDesc_i18n' },
  { value: 'lightly_active', labelKey: 'ob_activityLight_i18n', descKey: 'ob_activityLightDesc_i18n' },
  { value: 'moderately_active', labelKey: 'ob_activityModerate_i18n', descKey: 'ob_activityModerateDesc_i18n' },
  { value: 'very_active', labelKey: 'ob_activityVery_i18n', descKey: 'ob_activityVeryDesc_i18n' },
  { value: 'extra_active', labelKey: 'ob_activityExtra_i18n', descKey: 'ob_activityExtraDesc_i18n' },
];

const GOAL_OPTIONS: Array<{ value: NonNullable<OnboardingData['goal']>; labelKey: TranslationKeys; descKey: TranslationKeys }> = [
  { value: 'lose_weight', labelKey: 'ob_goalLose_i18n', descKey: 'ob_goalLoseDesc_i18n' },
  { value: 'maintain_weight', labelKey: 'ob_goalMaintain_i18n', descKey: 'ob_goalMaintainDesc_i18n' },
  { value: 'gain_weight', labelKey: 'ob_goalGain_i18n', descKey: 'ob_goalGainDesc_i18n' },
];

const TOTAL_STEPS = 6;

export default function OnboardingPage() {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({});

  const updateOnboardingData = (data: Partial<OnboardingData>) => {
    setOnboardingData(prev => ({ ...prev, ...data }));
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const calculations = useMemo(() => {
    const d = onboardingData;
    if (!d.weight || !d.height || !d.age || !d.gender || !d.activity_level || !d.goal) {
      return null;
    }
    const bmr = calculateBMR(d.weight, d.height, d.age, d.gender);
    const tdee = calculateTDEE(bmr, activityLevelMap[d.activity_level] || 'sedentary');
    const targetCal = calculateTargetCalories(tdee, goalMap[d.goal] || 'maintainWeight');
    const macros = calculateMacroTargets(targetCal, goalMap[d.goal] || 'maintainWeight');
    const water = calculateWaterIntake(d.weight, d.activity_level);
    return { bmr, tdee, targetCal, macros, water };
  }, [onboardingData]);

  const handleComplete = async () => {
    setIsSubmitting(true);
    await new Promise(resolve => setTimeout(resolve, 600));

    if (calculations) {
      const now = new Date().toISOString();
      const mockUser = {
        id: 'mock-user',
        email: onboardingData.email ?? 'mock@example.com',
        name: onboardingData.name,
        created_at: now,
        updated_at: now,
      };
      const mockProfile = {
        user_id: 'mock-user',
        age: onboardingData.age,
        gender: onboardingData.gender,
        height: onboardingData.height,
        weight: onboardingData.weight,
        target_weight: onboardingData.target_weight ?? onboardingData.weight,
        activity_level: onboardingData.activity_level,
        goal: onboardingData.goal,
        target_calories: calculations.targetCal,
        protein_target: calculations.macros.protein,
        carb_target: calculations.macros.carbs,
        fat_target: calculations.macros.fat,
        water_target: calculations.water,
        created_at: now,
        updated_at: now,
      };
      localStorage.setItem('mock_user', JSON.stringify(mockUser));
      localStorage.setItem('mock_profile', JSON.stringify(mockProfile));
    }

    setCompleted(true);
    toast.success(t('ob_profileCreatedToast_i18n'));
    setTimeout(() => {
      window.location.href = '/dashboard';
    }, 1500);
    setIsSubmitting(false);
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 mx-auto rounded-full bg-primary flex items-center justify-center">
            <Check className="w-6 h-6 text-primary-foreground" />
          </div>
          <h2 className="text-xl font-bold">{t('ob_settingUp_i18n')}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-6 py-16">
        <div className="flex items-center gap-2 mb-12">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div
              key={i}
              className={`h-1 flex-1 rounded-full transition-colors ${
                i < currentStep ? 'bg-foreground' : 'bg-border'
              }`}
            />
          ))}
        </div>

        <div className="min-h-[360px]">
          {currentStep === 1 && (
            <div className="space-y-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight mb-3">{t('ob_setupTitle_i18n')}</h1>
                <p className="text-muted-foreground">{t('ob_setupDesc_i18n')}</p>
              </div>
              <button onClick={() => setCurrentStep(2)} className="btn-brand">
                {t('ob_begin_i18n')}
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {currentStep === 2 && (
            <form
              className="space-y-6"
              action={async (formData: FormData) => {
                const data = {
                  name: formData.get('name') as string,
                  email: formData.get('email') as string,
                  age: parseInt(formData.get('age') as string),
                  gender: formData.get('gender') as Gender,
                };
                updateOnboardingData(data);
                setCurrentStep(3);
              }}
            >
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1">{t('ob_basicTitle_i18n')}</h2>
                <p className="text-sm text-muted-foreground">{t('ob_basicDesc_i18n')}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">{t('ob_name_i18n')}</label>
                  <input type="text" name="name" defaultValue={onboardingData.name || ''} className="input-brand" placeholder={t('ob_namePlaceholder_i18n')} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">{t('ob_email_i18n')}</label>
                  <input type="email" name="email" defaultValue={onboardingData.email || ''} className="input-brand" placeholder={t('ob_emailPlaceholder_i18n')} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5">{t('ob_age_i18n')}</label>
                    <input type="number" name="age" defaultValue={onboardingData.age || ''} min="13" max="120" className="input-brand" placeholder={t('ob_agePlaceholder_i18n')} required />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5">{t('ob_sex_i18n')}</label>
                    <select name="gender" defaultValue={onboardingData.gender || ''} className="input-brand" required>
                      <option value="">{t('ob_sexSelect_i18n')}</option>
                      <option value="male">{t('ob_sexMale_i18n')}</option>
                      <option value="female">{t('ob_sexFemale_i18n')}</option>
                      <option value="other">{t('ob_sexOther_i18n')}</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <button type="button" onClick={handlePrevious} className="btn-secondary">{t('ob_back_i18n')}</button>
                <button type="submit" disabled={isSubmitting} className="btn-brand">
                  {t('ob_next_i18n')} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {currentStep === 3 && (
            <form
              className="space-y-6"
              action={async (formData: FormData) => {
                const data = {
                  height: parseInt(formData.get('height') as string),
                  weight: parseInt(formData.get('weight') as string),
                  target_weight: formData.get('target_weight') ? parseInt(formData.get('target_weight') as string) : undefined,
                };
                updateOnboardingData(data);
                setCurrentStep(4);
              }}
            >
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1">{t('ob_bodyTitle_i18n')}</h2>
                <p className="text-sm text-muted-foreground">{t('ob_bodyDesc_i18n')}</p>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5">{t('ob_height_i18n')}</label>
                  <input type="number" name="height" defaultValue={onboardingData.height || ''} min="100" max="250" className="input-brand" placeholder={t('ob_heightPlaceholder_i18n')} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">{t('ob_weight_i18n')}</label>
                  <input type="number" name="weight" defaultValue={onboardingData.weight || ''} min="30" max="300" className="input-brand" placeholder={t('ob_weightPlaceholder_i18n')} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5">
                    {t('ob_targetWeight_i18n')}{' '}
                    <span className="text-muted-foreground font-normal">{t('ob_optional_i18n')}</span>
                  </label>
                  <input type="number" name="target_weight" defaultValue={onboardingData.target_weight || ''} min="30" max="300" className="input-brand" placeholder={t('ob_targetWeightPlaceholder_i18n')} />
                </div>
              </div>
              <div className="flex justify-between pt-4">
                <button type="button" onClick={handlePrevious} className="btn-secondary">{t('ob_back_i18n')}</button>
                <button type="submit" disabled={isSubmitting} className="btn-brand">
                  {t('ob_next_i18n')} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {currentStep === 4 && (
            <form
              className="space-y-6"
              action={async (formData: FormData) => {
                const data = {
                  activity_level: formData.get('activity_level') as OnboardingData['activity_level'],
                };
                updateOnboardingData(data);
                setCurrentStep(5);
              }}
            >
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1">{t('ob_activityTitle_i18n')}</h2>
                <p className="text-sm text-muted-foreground">{t('ob_activityDesc_i18n')}</p>
              </div>
              <div className="space-y-3">
                {ACTIVITY_OPTIONS.map(opt => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-3 p-4 rounded-lg border border-border cursor-pointer hover:border-foreground/30 transition-colors"
                  >
                    <input
                      type="radio"
                      name="activity_level"
                      value={opt.value}
                      defaultChecked={onboardingData.activity_level === opt.value}
                      className="accent-foreground"
                      required
                    />
                    <div>
                      <div className="text-sm font-medium">{t(opt.labelKey)}</div>
                      <div className="text-xs text-muted-foreground">{t(opt.descKey)}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex justify-between pt-4">
                <button type="button" onClick={handlePrevious} className="btn-secondary">{t('ob_back_i18n')}</button>
                <button type="submit" disabled={isSubmitting} className="btn-brand">
                  {t('ob_next_i18n')} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {currentStep === 5 && (
            <form
              className="space-y-6"
              action={async (formData: FormData) => {
                const data = {
                  goal: formData.get('goal') as OnboardingData['goal'],
                };
                updateOnboardingData(data);
                setCurrentStep(6);
              }}
            >
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1">{t('ob_goalTitle_i18n')}</h2>
                <p className="text-sm text-muted-foreground">{t('ob_goalDesc_i18n')}</p>
              </div>
              <div className="space-y-3">
                {GOAL_OPTIONS.map(opt => (
                  <label
                    key={opt.value}
                    className="flex items-center gap-3 p-4 rounded-lg border border-border cursor-pointer hover:border-foreground/30 transition-colors"
                  >
                    <input
                      type="radio"
                      name="goal"
                      value={opt.value}
                      defaultChecked={onboardingData.goal === opt.value}
                      className="accent-foreground"
                      required
                    />
                    <div>
                      <div className="text-sm font-medium">{t(opt.labelKey)}</div>
                      <div className="text-xs text-muted-foreground">{t(opt.descKey)}</div>
                    </div>
                  </label>
                ))}
              </div>
              <div className="flex justify-between pt-4">
                <button type="button" onClick={handlePrevious} className="btn-secondary">{t('ob_back_i18n')}</button>
                <button type="submit" disabled={isSubmitting} className="btn-brand">
                  {t('ob_review_i18n')} <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {currentStep === 6 && calculations && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1">{t('ob_reviewTitle_i18n')}</h2>
                <p className="text-sm text-muted-foreground">{t('ob_reviewDesc_i18n')}</p>
              </div>

              <div className="card-brand space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('ob_sectionPersonal_i18n')}
                </h3>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2 text-sm">
                  <div><span className="text-muted-foreground">{t('ob_nameLabel_i18n')}</span> {onboardingData.name}</div>
                  <div><span className="text-muted-foreground">{t('ob_ageLabel_i18n')}</span> {onboardingData.age}</div>
                  <div><span className="text-muted-foreground">{t('ob_heightLabel_i18n')}</span> {onboardingData.height} cm</div>
                  <div><span className="text-muted-foreground">{t('ob_weightLabel_i18n')}</span> {onboardingData.weight} kg</div>
                  {onboardingData.target_weight && (
                    <div><span className="text-muted-foreground">{t('ob_targetLabel_i18n')}</span> {onboardingData.target_weight} kg</div>
                  )}
                </div>
              </div>

              <div className="card-brand space-y-3">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  {t('ob_sectionTargets_i18n')}
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-2xl font-bold">{calculations.targetCal}</div>
                    <div className="text-xs text-muted-foreground">{t('ob_kcalPerDay_i18n')}</div>
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="text-2xl font-bold">{calculations.water}</div>
                    <div className="text-xs text-muted-foreground">{t('ob_mlWaterPerDay_i18n')}</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('ob_bmr_i18n')}</span>
                    <span className="font-medium">{calculations.bmr} {t('ob_kcalShort_i18n')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('ob_tdee_i18n')}</span>
                    <span className="font-medium">{calculations.tdee} {t('ob_kcalShort_i18n')}</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('ob_proteinLabel_i18n')}</span>
                    <span className="font-medium">
                      {calculations.macros.protein}g{' '}
                      <span className="text-muted-foreground font-normal">
                        ({Math.round(calculations.macros.protein * 4)} {t('ob_kcalShort_i18n')})
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('ob_carbsLabel_i18n')}</span>
                    <span className="font-medium">
                      {calculations.macros.carbs}g{' '}
                      <span className="text-muted-foreground font-normal">
                        ({Math.round(calculations.macros.carbs * 4)} {t('ob_kcalShort_i18n')})
                      </span>
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">{t('ob_fatLabel_i18n')}</span>
                    <span className="font-medium">
                      {calculations.macros.fat}g{' '}
                      <span className="text-muted-foreground font-normal">
                        ({Math.round(calculations.macros.fat * 9)} {t('ob_kcalShort_i18n')})
                      </span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <button type="button" onClick={handlePrevious} className="btn-secondary">
                  <ChevronLeft className="w-4 h-4" /> {t('common_edit_i18n')}
                </button>
                <button onClick={handleComplete} disabled={isSubmitting} className="btn-brand">
                  {isSubmitting ? t('ob_saving_i18n') : t('ob_confirmStart_i18n')}
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
