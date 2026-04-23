import { LucideIcon } from 'lucide-react';

export interface Stat {
  label: string;
  value: string;
  unit: string;
  icon: LucideIcon;
  color: string;
}

export interface Meal {
  name: string;
  time: string;
  calories: number;
  items: string;
}

export interface CalorieData {
  goal: number;
  consumed: number;
  remaining: number;
  progressPercentage: number;
}

export interface MacroData {
  carbs: number;
  protein: number;
  fat: number;
}
