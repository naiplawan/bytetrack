'use client';

import { useEffect, useMemo, useState } from 'react';
import { Dumbbell, Flame, Timer, Plus, Trash2 } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TranslationKeys } from '@/lib/translations';

type WorkoutType = 'cardio' | 'strength' | 'yoga' | 'cycling' | 'other';

interface Workout {
  id: string;
  name: string;
  type: WorkoutType;
  duration_min: number;
  calories: number;
  date: string;
  note?: string;
}

const STORAGE_KEY = 'mock_workouts';
const SEED_KEY = 'mock_workouts_seeded';

function uid(): string {
  return `w_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

function seedIfNeeded(): Workout[] {
  if (typeof localStorage === 'undefined') return [];
  if (localStorage.getItem(SEED_KEY)) {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? (JSON.parse(raw) as Workout[]) : [];
    } catch {
      return [];
    }
  }
  const today = new Date();
  const seeded: Workout[] = [
    { id: uid(), name: 'Morning run', type: 'cardio', duration_min: 35, calories: 340, date: new Date(today.getTime() - 1 * 86400000).toISOString(), note: '5km easy pace' },
    { id: uid(), name: 'Upper body', type: 'strength', duration_min: 45, calories: 280, date: new Date(today.getTime() - 2 * 86400000).toISOString() },
    { id: uid(), name: 'Yoga flow', type: 'yoga', duration_min: 30, calories: 120, date: new Date(today.getTime() - 3 * 86400000).toISOString() },
    { id: uid(), name: 'Cycling intervals', type: 'cycling', duration_min: 50, calories: 520, date: new Date(today.getTime() - 5 * 86400000).toISOString() },
    { id: uid(), name: 'Lower body', type: 'strength', duration_min: 40, calories: 260, date: new Date(today.getTime() - 6 * 86400000).toISOString() },
  ];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded));
  localStorage.setItem(SEED_KEY, '1');
  return seeded;
}

const TYPE_KEYS: Record<WorkoutType, TranslationKeys> = {
  cardio: 'workouts_type_cardio_i18n',
  strength: 'workouts_type_strength_i18n',
  yoga: 'workouts_type_yoga_i18n',
  cycling: 'workouts_type_cycling_i18n',
  other: 'workouts_type_other_i18n',
};

export default function WorkoutsPage() {
  const { t, language } = useLanguage();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setWorkouts(seedIfNeeded());
  }, []);

  const save = (next: Workout[]) => {
    setWorkouts(next);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const weekStats = useMemo(() => {
    const cutoff = Date.now() - 7 * 86400000;
    const recent = workouts.filter(w => new Date(w.date).getTime() >= cutoff);
    return {
      count: recent.length,
      calories: recent.reduce((s, w) => s + w.calories, 0),
      minutes: recent.reduce((s, w) => s + w.duration_min, 0),
    };
  }, [workouts]);

  const add = (formData: FormData) => {
    const workout: Workout = {
      id: uid(),
      name: (formData.get('name') as string) || t('workouts_defaultName_i18n'),
      type: (formData.get('type') as WorkoutType) || 'other',
      duration_min: parseInt(formData.get('duration') as string) || 30,
      calories: parseInt(formData.get('calories') as string) || 200,
      date: new Date().toISOString(),
      note: (formData.get('note') as string) || undefined,
    };
    save([workout, ...workouts]);
    setShowForm(false);
  };

  const remove = (id: string) => save(workouts.filter(w => w.id !== id));

  const locale = language === 'th' ? 'th-TH' : 'en-US';

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('workouts_title_i18n')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('workouts_subtitle_i18n')}</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="btn-brand">
          <Plus className="w-4 h-4" /> {showForm ? t('workouts_cancel_i18n') : t('workouts_log_i18n')}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <StatCard
          icon={Dumbbell}
          label={t('workouts_thisWeek_i18n')}
          value={`${weekStats.count}`}
          sub={t('workouts_thisWeekUnit_i18n')}
        />
        <StatCard
          icon={Timer}
          label={t('workouts_minutes_i18n')}
          value={`${weekStats.minutes}`}
          sub={t('workouts_lastSevenDays_i18n')}
        />
        <StatCard
          icon={Flame}
          label={t('workouts_burned_i18n')}
          value={`${weekStats.calories}`}
          sub={t('workouts_kcalUnit_i18n')}
        />
      </div>

      {showForm && (
        <form className="card-brand p-6 space-y-4" action={add}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('workouts_name_i18n')}</label>
              <input
                name="name"
                required
                placeholder={t('workouts_namePlaceholder_i18n')}
                className="input-brand"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('workouts_type_i18n')}</label>
              <select name="type" defaultValue="cardio" className="input-brand">
                {(['cardio', 'strength', 'yoga', 'cycling', 'other'] as WorkoutType[]).map(type => (
                  <option key={type} value={type}>{t(TYPE_KEYS[type])}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('workouts_duration_i18n')}</label>
              <input name="duration" type="number" min={1} defaultValue={30} className="input-brand" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">{t('workouts_calories_i18n')}</label>
              <input name="calories" type="number" min={0} defaultValue={200} className="input-brand" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">{t('workouts_note_i18n')}</label>
            <input name="note" className="input-brand" />
          </div>
          <button type="submit" className="btn-brand w-full justify-center">
            {t('workouts_save_i18n')}
          </button>
        </form>
      )}

      <div className="card-brand p-6">
        <h3 className="text-lg font-semibold mb-4">{t('workouts_recent_i18n')}</h3>
        {workouts.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('workouts_none_i18n')}</p>
        ) : (
          <ul className="divide-y divide-border">
            {workouts.map(w => (
              <li key={w.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{w.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {t(TYPE_KEYS[w.type])} · {w.duration_min} {t('workouts_minutes_i18n').toLowerCase()} · {new Date(w.date).toLocaleDateString(locale)}
                  </div>
                  {w.note && <div className="text-xs text-muted-foreground mt-1">{w.note}</div>}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium">{w.calories} {t('workouts_kcalUnit_i18n')}</span>
                  <button
                    onClick={() => remove(w.id)}
                    aria-label={t('workouts_delete_i18n')}
                    className="p-1 rounded-md hover:bg-muted text-muted-foreground"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  sub: string;
}) {
  return (
    <div className="card-brand p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{sub}</div>
    </div>
  );
}
