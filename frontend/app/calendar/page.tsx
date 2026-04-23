'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { getMealsByDate, type Meal } from '@/lib/meal-service';
import { useLanguage } from '@/contexts/LanguageContext';
import type { TranslationKeys } from '@/lib/translations';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function startOfMonth(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), 1);
}

function daysInMonth(d: Date): number {
  return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function CalendarPage() {
  const { t, language } = useLanguage();
  const [cursor, setCursor] = useState(() => new Date());
  const [selected, setSelected] = useState<Date>(() => new Date());
  const [selectedMeals, setSelectedMeals] = useState<Meal[]>([]);
  const [daysWithMeals, setDaysWithMeals] = useState<Set<string>>(new Set());

  const locale = language === 'th' ? 'th-TH' : 'en-US';

  const monthLabel = useMemo(
    () => cursor.toLocaleDateString(locale, { month: 'long', year: 'numeric' }),
    [cursor, locale],
  );

  const grid = useMemo(() => {
    const first = startOfMonth(cursor);
    const total = daysInMonth(cursor);
    const leadingBlanks = first.getDay();
    const cells: (Date | null)[] = Array.from({ length: leadingBlanks }, () => null);
    for (let day = 1; day <= total; day++) {
      cells.push(new Date(cursor.getFullYear(), cursor.getMonth(), day));
    }
    while (cells.length % 7 !== 0) cells.push(null);
    return cells;
  }, [cursor]);

  useEffect(() => {
    (async () => {
      const meals = await getMealsByDate(selected);
      setSelectedMeals(meals);
    })();
  }, [selected]);

  useEffect(() => {
    (async () => {
      const keys = new Set<string>();
      await Promise.all(
        grid
          .filter((d): d is Date => d !== null)
          .map(async d => {
            const meals = await getMealsByDate(d);
            if (meals.length > 0) keys.add(d.toDateString());
          }),
      );
      setDaysWithMeals(keys);
    })();
  }, [grid]);

  const totalCalories = selectedMeals.reduce((sum, m) => sum + m.calories, 0);

  const mealTypeLabel = (type: Meal['mealType']) =>
    t(`mealType_${type}_i18n` as TranslationKeys);

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('calendar_title_i18n')}</h1>
          <p className="text-sm text-muted-foreground mt-1">{t('calendar_subtitle_i18n')}</p>
        </div>
        <Link href="/meals/add" className="btn-brand">
          <Plus className="w-4 h-4" /> {t('calendar_logMeal_i18n')}
        </Link>
      </div>

      <div className="card-brand p-6">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="p-2 rounded-md hover:bg-muted"
            aria-label={t('calendar_prevMonth_i18n')}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <h2 className="text-lg font-semibold">{monthLabel}</h2>
          <button
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            className="p-2 rounded-md hover:bg-muted"
            aria-label={t('calendar_nextMonth_i18n')}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground mb-2">
          {DAY_LABELS.map(d => (
            <div key={d} className="py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {grid.map((cell, idx) => {
            if (!cell) return <div key={idx} className="h-12" />;
            const isSelected = sameDay(cell, selected);
            const isToday = sameDay(cell, new Date());
            const hasMeals = daysWithMeals.has(cell.toDateString());
            return (
              <button
                key={idx}
                onClick={() => setSelected(cell)}
                className={[
                  'h-12 rounded-md text-sm flex flex-col items-center justify-center transition-colors',
                  isSelected
                    ? 'bg-foreground text-background'
                    : isToday
                      ? 'bg-muted font-semibold'
                      : 'hover:bg-muted',
                ].join(' ')}
              >
                <span>{cell.getDate()}</span>
                {hasMeals && !isSelected && (
                  <span className="w-1 h-1 rounded-full bg-foreground mt-0.5" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="card-brand p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {selected.toLocaleDateString(locale, { weekday: 'long', month: 'long', day: 'numeric' })}
          </h3>
          <span className="text-sm text-muted-foreground">
            {totalCalories} {t('calendar_kcalShort_i18n')}
          </span>
        </div>

        {selectedMeals.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t('calendar_noMeals_i18n')}</p>
        ) : (
          <ul className="divide-y divide-border">
            {selectedMeals.map(meal => (
              <li key={meal.id} className="py-3 flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{meal.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {mealTypeLabel(meal.mealType)} · {meal.grams}g
                  </div>
                </div>
                <div className="text-sm font-medium">
                  {meal.calories} {t('calendar_kcalShort_i18n')}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
