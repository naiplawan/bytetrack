// Mock meal-service backed by localStorage.
// Replaces the previous apiClient-based implementation so the UI runs without a backend.

import { z } from 'zod';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Meal {
  id: string;
  user_id: string;
  name: string;
  calories: number;
  grams: number;
  mealType: MealType;
  date: string; // ISO 8601 format
  protein?: number;
  carbs?: number;
  fat?: number;
  image?: string;
  created_at: string;
  updated_at: string;
}

export interface FoodItem {
  id: string | number;
  name: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  category?: string;
  brand?: string;
  image_url?: string;
}

export interface UserProfile {
  user_id: string;
  age?: number;
  gender?: 'male' | 'female' | 'other';
  height?: number;
  weight?: number;
  target_weight?: number;
  activity_level?: 'sedentary' | 'lightly_active' | 'moderately_active' | 'very_active' | 'extra_active';
  goal?: 'lose_weight' | 'maintain_weight' | 'gain_weight';
  target_calories?: number;
  protein_target?: number;
  carb_target?: number;
  fat_target?: number;
  water_target?: number;
  created_at: string;
  updated_at: string;
}

const mealSchema = z.object({
  name: z.string().min(1, 'Meal name is required'),
  calories: z.number().min(0, 'Calories must be positive'),
  grams: z.number().min(0, 'Weight must be positive'),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  date: z.string(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
  fat: z.number().optional(),
});

const MEALS_KEY = 'mock_meals';
const FAVORITES_KEY = 'mock_favorite_foods';
const CUSTOM_FOODS_KEY = 'mock_custom_foods';
const SEED_FLAG_KEY = 'mock_meals_seeded';
const MOCK_USER_ID = 'mock-user';

function uid(prefix = 'm'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}_${Date.now().toString(36)}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

function isBrowser(): boolean {
  return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
}

function readAllMeals(): Meal[] {
  if (!isBrowser()) return [];
  maybeSeed();
  try {
    const raw = localStorage.getItem(MEALS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Meal[]) : [];
  } catch {
    return [];
  }
}

function writeAllMeals(meals: Meal[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(MEALS_KEY, JSON.stringify(meals));
}

function sameLocalDay(iso: string, day: Date): boolean {
  const d = new Date(iso);
  return (
    d.getFullYear() === day.getFullYear() &&
    d.getMonth() === day.getMonth() &&
    d.getDate() === day.getDate()
  );
}

function maybeSeed(): void {
  if (!isBrowser()) return;
  if (localStorage.getItem(SEED_FLAG_KEY)) return;

  const today = new Date();
  const seeded: Meal[] = [];
  const templates: Array<Omit<Meal, 'id' | 'user_id' | 'date' | 'created_at' | 'updated_at'>> = [
    { name: 'Greek yogurt with berries', calories: 220, grams: 200, mealType: 'breakfast', protein: 18, carbs: 28, fat: 4 },
    { name: 'Oatmeal with banana', calories: 310, grams: 250, mealType: 'breakfast', protein: 10, carbs: 58, fat: 5 },
    { name: 'Grilled chicken salad', calories: 450, grams: 350, mealType: 'lunch', protein: 42, carbs: 20, fat: 22 },
    { name: 'Pad krapao moo', calories: 620, grams: 320, mealType: 'lunch', protein: 32, carbs: 65, fat: 24 },
    { name: 'Salmon with rice', calories: 580, grams: 330, mealType: 'dinner', protein: 38, carbs: 55, fat: 22 },
    { name: 'Tofu stir fry', calories: 420, grams: 300, mealType: 'dinner', protein: 24, carbs: 40, fat: 18 },
    { name: 'Apple & almonds', calories: 180, grams: 150, mealType: 'snack', protein: 5, carbs: 22, fat: 9 },
  ];

  // Seven days of meals, roughly 3 per day.
  for (let i = 6; i >= 0; i--) {
    const day = new Date(today);
    day.setDate(today.getDate() - i);

    const pickedTypes: MealType[] = ['breakfast', 'lunch', 'dinner'];
    if (i % 2 === 0) pickedTypes.push('snack');

    for (const type of pickedTypes) {
      const candidates = templates.filter(t => t.mealType === type);
      const picked = candidates[Math.floor(Math.random() * candidates.length)];
      if (!picked) continue;

      const slot = new Date(day);
      const hour = type === 'breakfast' ? 8 : type === 'lunch' ? 12 : type === 'dinner' ? 19 : 16;
      slot.setHours(hour, Math.floor(Math.random() * 50), 0, 0);

      seeded.push({
        ...picked,
        id: uid('m'),
        user_id: MOCK_USER_ID,
        date: slot.toISOString(),
        created_at: slot.toISOString(),
        updated_at: slot.toISOString(),
      });
    }
  }

  localStorage.setItem(MEALS_KEY, JSON.stringify(seeded));
  localStorage.setItem(SEED_FLAG_KEY, '1');
}

function readFoodList(key: string): FoodItem[] {
  if (!isBrowser()) return [];
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as FoodItem[]) : [];
  } catch {
    return [];
  }
}

function writeFoodList(key: string, items: FoodItem[]): void {
  if (!isBrowser()) return;
  localStorage.setItem(key, JSON.stringify(items));
}

// --- Public API ---

export async function getMealsByDate(date: Date): Promise<Meal[]> {
  const all = readAllMeals();
  return all.filter(m => sameLocalDay(m.date, date));
}

export async function getMealsByType(type: string): Promise<Meal[]> {
  const today = new Date();
  const meals = await getMealsByDate(today);
  return meals.filter(m => m.mealType === type);
}

export async function getTodayMeals(): Promise<Meal[]> {
  return getMealsByDate(new Date());
}

export async function addMeal(
  mealData: Omit<Meal, 'id' | 'user_id' | 'created_at' | 'updated_at'>,
): Promise<Meal> {
  const validated = mealSchema.parse(mealData);
  const now = nowIso();
  const meal: Meal = {
    ...mealData,
    ...validated,
    id: uid('m'),
    user_id: MOCK_USER_ID,
    created_at: now,
    updated_at: now,
  };
  const all = readAllMeals();
  all.push(meal);
  writeAllMeals(all);
  return meal;
}

export async function updateMeal(id: string, mealData: Partial<Meal>): Promise<Meal> {
  const all = readAllMeals();
  const idx = all.findIndex(m => m.id === id);
  if (idx === -1) throw new Error('Meal not found');
  const updated: Meal = { ...all[idx], ...mealData, updated_at: nowIso() };
  all[idx] = updated;
  writeAllMeals(all);
  return updated;
}

export async function deleteMeal(id: string): Promise<boolean> {
  const all = readAllMeals();
  const next = all.filter(m => m.id !== id);
  writeAllMeals(next);
  return next.length !== all.length;
}

export async function getMealById(id: string): Promise<Meal | null> {
  return readAllMeals().find(m => m.id === id) ?? null;
}

export async function getTotalCaloriesForDay(date: Date): Promise<number> {
  const meals = await getMealsByDate(date);
  return meals.reduce((sum, m) => sum + m.calories, 0);
}

export async function getMacrosForDay(
  date: Date,
): Promise<{ protein: number; carbs: number; fat: number }> {
  const meals = await getMealsByDate(date);
  return meals.reduce(
    (acc, m) => ({
      protein: acc.protein + (m.protein ?? 0),
      carbs: acc.carbs + (m.carbs ?? 0),
      fat: acc.fat + (m.fat ?? 0),
    }),
    { protein: 0, carbs: 0, fat: 0 },
  );
}

export async function getFavoriteFoods(): Promise<FoodItem[]> {
  return readFoodList(FAVORITES_KEY);
}

export async function addFavoriteFood(food: FoodItem): Promise<void> {
  const list = readFoodList(FAVORITES_KEY);
  if (!list.some(f => f.id === food.id)) {
    list.push(food);
    writeFoodList(FAVORITES_KEY, list);
  }
}

export async function removeFavoriteFood(foodId: string | number): Promise<void> {
  const list = readFoodList(FAVORITES_KEY).filter(f => f.id !== foodId);
  writeFoodList(FAVORITES_KEY, list);
}

export async function getCustomFoods(): Promise<FoodItem[]> {
  return readFoodList(CUSTOM_FOODS_KEY);
}

export async function addCustomFood(food: Omit<FoodItem, 'id'>): Promise<FoodItem | null> {
  const created: FoodItem = { ...food, id: uid('f') };
  const list = readFoodList(CUSTOM_FOODS_KEY);
  list.push(created);
  writeFoodList(CUSTOM_FOODS_KEY, list);
  return created;
}

export async function searchFoods(
  query: string,
  page = 1,
  pageSize = 20,
): Promise<{ items: FoodItem[]; total: number; hasMore: boolean }> {
  const all = [...readFoodList(CUSTOM_FOODS_KEY), ...readFoodList(FAVORITES_KEY)];
  const q = query.trim().toLowerCase();
  const filtered = q ? all.filter(f => f.name.toLowerCase().includes(q)) : all;
  const start = (page - 1) * pageSize;
  const slice = filtered.slice(start, start + pageSize);
  return { items: slice, total: filtered.length, hasMore: start + slice.length < filtered.length };
}

export async function getThaiFoods(_page = 1, pageSize = 20): Promise<FoodItem[]> {
  return readFoodList(CUSTOM_FOODS_KEY).slice(0, pageSize);
}

export async function cacheThaiFoods(_foods: FoodItem[]): Promise<void> {
  // No-op in mock mode.
}

export function clearMealCache(): void {
  if (!isBrowser()) return;
  localStorage.removeItem(MEALS_KEY);
  localStorage.removeItem(SEED_FLAG_KEY);
}

export async function getUserProfile(): Promise<UserProfile> {
  if (!isBrowser()) throw new Error('Profile unavailable');
  const raw = localStorage.getItem('mock_profile');
  if (!raw) throw new Error('Profile unavailable');
  return JSON.parse(raw) as UserProfile;
}

export async function updateUserProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
  const current = await getUserProfile();
  const next: UserProfile = { ...current, ...profile, updated_at: nowIso() };
  localStorage.setItem('mock_profile', JSON.stringify(next));
  return next;
}
