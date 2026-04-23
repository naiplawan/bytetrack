'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Moon, Globe, Database, LogOut, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';
import type { Language } from '@/lib/translations';

interface Prefs {
  theme: 'system' | 'light' | 'dark';
  language: Language;
  notifications: boolean;
  weeklyDigest: boolean;
  units: 'metric' | 'imperial';
}

const PREFS_KEY = 'mock_settings';

const DEFAULT_PREFS: Prefs = {
  theme: 'system',
  language: 'en',
  notifications: true,
  weeklyDigest: true,
  units: 'metric',
};

function loadPrefs(): Prefs {
  if (typeof localStorage === 'undefined') return DEFAULT_PREFS;
  try {
    const raw = localStorage.getItem(PREFS_KEY);
    return raw ? { ...DEFAULT_PREFS, ...JSON.parse(raw) } : DEFAULT_PREFS;
  } catch {
    return DEFAULT_PREFS;
  }
}

export default function SettingsPage() {
  const router = useRouter();
  const { t, language, setLanguage } = useLanguage();
  const [prefs, setPrefs] = useState<Prefs>(DEFAULT_PREFS);

  useEffect(() => {
    const loaded = loadPrefs();
    setPrefs({ ...loaded, language });
  }, [language]);

  const update = (partial: Partial<Prefs>) => {
    const next = { ...prefs, ...partial };
    setPrefs(next);
    localStorage.setItem(PREFS_KEY, JSON.stringify(next));
    if (partial.language && partial.language !== language) {
      setLanguage(partial.language);
    }
  };

  const resetMockData = () => {
    const keys = [
      'mock_meals',
      'mock_meals_seeded',
      'mock_workouts',
      'mock_workouts_seeded',
      'mock_favorite_foods',
      'mock_custom_foods',
      'weightEntries',
      'unlockedAchievements',
      'achievementTimestamps',
    ];
    keys.forEach(k => localStorage.removeItem(k));
    toast.success(t('settings_resetToast_i18n'));
  };

  const signOut = () => {
    localStorage.removeItem('mock_user');
    localStorage.removeItem('mock_profile');
    toast.success(t('settings_signedOutToast_i18n'));
    router.push('/onboarding');
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('settings_title_i18n')}</h1>
        <p className="text-sm text-muted-foreground mt-1">{t('settings_subtitle_i18n')}</p>
      </div>

      <Section title={t('settings_appearance_i18n')}>
        <SelectRow
          icon={Moon}
          label={t('settings_theme_i18n')}
          value={prefs.theme}
          onChange={v => update({ theme: v as Prefs['theme'] })}
          options={[
            { value: 'system', label: t('settings_themeSystem_i18n') },
            { value: 'light', label: t('settings_themeLight_i18n') },
            { value: 'dark', label: t('settings_themeDark_i18n') },
          ]}
        />
        <SelectRow
          icon={Globe}
          label={t('settings_language_i18n')}
          value={prefs.language}
          onChange={v => update({ language: v as Language })}
          options={[
            { value: 'en', label: t('settings_langEnglish_i18n') },
            { value: 'th', label: t('settings_langThai_i18n') },
          ]}
        />
        <SelectRow
          icon={Database}
          label={t('settings_units_i18n')}
          value={prefs.units}
          onChange={v => update({ units: v as Prefs['units'] })}
          options={[
            { value: 'metric', label: t('settings_unitsMetric_i18n') },
            { value: 'imperial', label: t('settings_unitsImperial_i18n') },
          ]}
        />
      </Section>

      <Section title={t('settings_notificationsSection_i18n')}>
        <ToggleRow
          icon={Bell}
          label={t('settings_mealReminders_i18n')}
          description={t('settings_mealRemindersDesc_i18n')}
          checked={prefs.notifications}
          onChange={v => update({ notifications: v })}
        />
        <ToggleRow
          icon={Bell}
          label={t('settings_weeklyDigest_i18n')}
          description={t('settings_weeklyDigestDesc_i18n')}
          checked={prefs.weeklyDigest}
          onChange={v => update({ weeklyDigest: v })}
        />
      </Section>

      <Section title={t('settings_dataSection_i18n')}>
        <ActionRow
          icon={Trash2}
          label={t('settings_resetData_i18n')}
          description={t('settings_resetDataDesc_i18n')}
          onClick={resetMockData}
        />
        <ActionRow
          icon={LogOut}
          label={t('settings_signOut_i18n')}
          description={t('settings_signOutDesc_i18n')}
          onClick={signOut}
          destructive
        />
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="card-brand p-6 space-y-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

function SelectRow({
  icon: Icon,
  label,
  value,
  onChange,
  options,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Icon className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="input-brand w-auto"
      >
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  label,
  description,
  checked,
  onChange,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-start gap-3">
        <Icon className="w-4 h-4 text-muted-foreground mt-0.5" />
        <div>
          <div className="text-sm font-medium">{label}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
      </div>
      <button
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        className={[
          'relative w-10 h-6 rounded-full transition-colors',
          checked ? 'bg-foreground' : 'bg-muted',
        ].join(' ')}
      >
        <span
          className={[
            'absolute top-0.5 w-5 h-5 rounded-full bg-background transition-transform',
            checked ? 'translate-x-4' : 'translate-x-0.5',
          ].join(' ')}
        />
      </button>
    </div>
  );
}

function ActionRow({
  icon: Icon,
  label,
  description,
  onClick,
  destructive,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  description: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-3 text-left hover:bg-muted/40 rounded-md px-2 -mx-2"
    >
      <div className="flex items-start gap-3">
        <Icon className={`w-4 h-4 mt-0.5 ${destructive ? 'text-red-500' : 'text-muted-foreground'}`} />
        <div>
          <div className={`text-sm font-medium ${destructive ? 'text-red-500' : ''}`}>{label}</div>
          <div className="text-xs text-muted-foreground">{description}</div>
        </div>
      </div>
    </button>
  );
}
