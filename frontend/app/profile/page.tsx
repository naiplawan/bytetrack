'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { User, Ruler, Weight, Target, Flame, Droplets } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TranslationKeys } from '@/lib/translations';

export default function ProfilePage() {
  const { t } = useLanguage();
  const { user, profile } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    age: '',
    height: '',
    weight: '',
    target_weight: '',
    target_calories: '',
    water_target: '',
  });

  useEffect(() => {
    if (!profile) return;
    setForm({
      name: user?.name ?? '',
      email: user?.email ?? '',
      age: profile.age?.toString() ?? '',
      height: profile.height?.toString() ?? '',
      weight: profile.weight?.toString() ?? '',
      target_weight: profile.target_weight?.toString() ?? '',
      target_calories: profile.target_calories?.toString() ?? '',
      water_target: profile.water_target?.toString() ?? '',
    });
  }, [user, profile]);

  const save = () => {
    if (!profile || !user) return;
    const nextProfile = {
      ...profile,
      age: form.age ? parseInt(form.age) : profile.age,
      height: form.height ? parseInt(form.height) : profile.height,
      weight: form.weight ? parseInt(form.weight) : profile.weight,
      target_weight: form.target_weight ? parseInt(form.target_weight) : profile.target_weight,
      target_calories: form.target_calories ? parseInt(form.target_calories) : profile.target_calories,
      water_target: form.water_target ? parseInt(form.water_target) : profile.water_target,
      updated_at: new Date().toISOString(),
    };
    const nextUser = { ...user, name: form.name, email: form.email, updated_at: new Date().toISOString() };
    localStorage.setItem('mock_profile', JSON.stringify(nextProfile));
    localStorage.setItem('mock_user', JSON.stringify(nextUser));
    toast.success(t('profile_saveToast_i18n'));
  };

  if (!profile) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-10">
        <p className="text-sm text-muted-foreground">{t('profile_loading_i18n')}</p>
      </div>
    );
  }

  const goalLabel = profile.goal
    ? t(`goal_${toCamel(profile.goal)}_i18n` as TranslationKeys)
    : t('common_none_i18n');
  const activityLabel = profile.activity_level
    ? t(`activity_${toCamel(profile.activity_level)}_i18n` as TranslationKeys)
    : t('common_none_i18n');

  const kg = t('profile_kgUnit_i18n');
  const cm = t('profile_cmUnit_i18n');
  const kcal = t('profile_kcalUnit_i18n');
  const g = t('profile_gUnit_i18n');
  const ml = t('profile_mlUnit_i18n');
  const none = t('common_none_i18n');

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('profile_title_i18n')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('profile_subtitle_i18n')}</p>
      </div>

      <div className="card-brand p-6 flex items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
          <User className="w-8 h-8 text-muted-foreground" />
        </div>
        <div>
          <h2 className="text-xl font-semibold">{user?.name || t('profile_yourName_i18n')}</h2>
          <p className="text-sm text-muted-foreground">{user?.email || t('profile_emailPlaceholder_i18n')}</p>
          <p className="text-xs text-muted-foreground mt-1">
            {t('profile_goalLabel_i18n')}: {goalLabel} · {activityLabel}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatTile icon={Ruler} label={t('profile_heightLabel_i18n')} value={profile.height ? `${profile.height} ${cm}` : none} />
        <StatTile icon={Weight} label={t('profile_weightLabel_i18n')} value={profile.weight ? `${profile.weight} ${kg}` : none} />
        <StatTile icon={Target} label={t('profile_targetWeightLabel_i18n')} value={profile.target_weight ? `${profile.target_weight} ${kg}` : none} />
        <StatTile icon={Flame} label={t('profile_caloriesDay_i18n')} value={profile.target_calories ? `${profile.target_calories} ${kcal}` : none} />
      </div>

      <div className="card-brand p-6 space-y-4">
        <h3 className="text-lg font-semibold">{t('profile_dailyTargets_i18n')}</h3>
        <div className="space-y-3 text-sm">
          <Row label={t('profile_proteinLabel_i18n')} value={profile.protein_target ? `${profile.protein_target}${g}` : none} />
          <Row label={t('profile_carbsLabel_i18n')} value={profile.carb_target ? `${profile.carb_target}${g}` : none} />
          <Row label={t('profile_fatLabel_i18n')} value={profile.fat_target ? `${profile.fat_target}${g}` : none} />
          <Row label={t('profile_waterLabel_i18n')} value={profile.water_target ? `${profile.water_target} ${ml}` : none} icon={Droplets} />
        </div>
      </div>

      <div className="card-brand p-6 space-y-4">
        <h3 className="text-lg font-semibold">{t('profile_editSection_i18n')}</h3>
        <div className="grid grid-cols-2 gap-4">
          <Field label={t('profile_nameField_i18n')} name="name" value={form.name} onChange={v => setForm({ ...form, name: v })} />
          <Field label={t('profile_emailField_i18n')} name="email" value={form.email} onChange={v => setForm({ ...form, email: v })} />
          <Field label={t('profile_ageField_i18n')} name="age" type="number" value={form.age} onChange={v => setForm({ ...form, age: v })} />
          <Field label={t('profile_heightField_i18n')} name="height" type="number" value={form.height} onChange={v => setForm({ ...form, height: v })} />
          <Field label={t('profile_weightField_i18n')} name="weight" type="number" value={form.weight} onChange={v => setForm({ ...form, weight: v })} />
          <Field label={t('profile_targetWeightField_i18n')} name="target_weight" type="number" value={form.target_weight} onChange={v => setForm({ ...form, target_weight: v })} />
          <Field label={t('profile_caloriesField_i18n')} name="target_calories" type="number" value={form.target_calories} onChange={v => setForm({ ...form, target_calories: v })} />
          <Field label={t('profile_waterField_i18n')} name="water_target" type="number" value={form.water_target} onChange={v => setForm({ ...form, water_target: v })} />
        </div>
        <button onClick={save} className="btn-brand w-full justify-center">{t('profile_saveChanges_i18n')}</button>
      </div>
    </div>
  );
}

function toCamel(value: string): string {
  return value.replace(/_([a-z])/g, (_, c) => c.toUpperCase());
}

function StatTile({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="card-brand p-5">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}

function Row({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon?: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground flex items-center gap-2">
        {Icon ? <Icon className="w-4 h-4" /> : null}
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  type = 'text',
  onChange,
}: {
  label: string;
  name: string;
  value: string;
  type?: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input-brand"
      />
    </div>
  );
}
