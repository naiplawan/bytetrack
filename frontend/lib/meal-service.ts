import { apiClient, initializeAuth } from './api-client';
import { z } from 'zod';

// Initialize auth when module is imported (only on client side)
if (typeof window !== 'undefined') {
  initializeAuth();
}

// Type definitions (matching backend models)
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

// Zod schema for validation (client-side)
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

const foodItemSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string(),
  calories: z.number().optional(),
  protein: z.number().optional(),
  carbs: z.number().optional(),
  fat: z.number().optional(),
});

// Cache for offline support
class MealCache {
  private static instance: MealCache;
  private cache: Map<string, { data: Meal[]; timestamp: number; ttl: number }> = new Map();

  static getInstance(): MealCache {
    if (!MealCache.instance) {
      MealCache.instance = new MealCache();
    }
    return MealCache.instance;
  }

  private getCacheKey(date?: string): string {
    return date ? `meals_${date}` : 'all_meals';
  }

  set(data: Meal[], date?: string) {
    const key = this.getCacheKey(date);
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: 5 * 60 * 1000, // 5 minutes cache
    });
  }

  get(date?: string): Meal[] | null {
    const key = this.getCacheKey(date);
    const cached = this.cache.get(key);

    if (!cached) return null;

    // Check if cache is expired
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.cache.delete(key);
      return null;
    }

    return cached.data;
  }

  clear() {
    this.cache.clear();
  }

  clearForDate(date?: string) {
    const key = this.getCacheKey(date);
    this.cache.delete(key);
  }
}

const mealCache = MealCache.getInstance();

// Error handling
class ApiError extends Error {
  constructor(
    message: string,
    public code?: string,
    public status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Handle API errors
async function handleApiCall<T>(apiCall: () => Promise<T>): Promise<T> {
  try {
    return await apiCall();
  } catch (error: any) {
    if (error.message?.includes('Failed to fetch')) {
      throw new ApiError('Network error. Please check your connection.', 'NETWORK_ERROR', 0);
    }
    if (error.message?.includes('401')) {
      throw new ApiError('Session expired. Please login again.', 'UNAUTHORIZED', 401);
    }
    if (error.message?.includes('403')) {
      throw new ApiError('Access denied.', 'FORBIDDEN', 403);
    }
    if (error.message?.includes('404')) {
      throw new ApiError('Resource not found.', 'NOT_FOUND', 404);
    }
    if (error.message?.includes('429')) {
      throw new ApiError('Too many requests. Please try again later.', 'RATE_LIMITED', 429);
    }
    if (error.message?.includes('500')) {
      throw new ApiError('Server error. Please try again later.', 'SERVER_ERROR', 500);
    }
    throw new ApiError(error.message || 'An unexpected error occurred', 'UNKNOWN_ERROR');
  }
}

// Load meals from cache or API
async function loadMeals(date?: Date): Promise<Meal[]> {
  const dateString = date ? date.toISOString().split('T')[0] : undefined;

  // Try to get from cache first
  const cached = mealCache.get(dateString);
  if (cached) {
    return cached;
  }

  // Fetch from API
  return handleApiCall(async () => {
    const response = await apiClient.getMeals(1, 100, dateString);

    if (!response.success || !response.data) {
      throw new ApiError('Failed to load meals');
    }

    // Transform meal_type to mealType for consistency
    const meals: Meal[] = response.data.map((meal: any) => ({
      ...meal,
      mealType: meal.meal_type,
    }));

    // Store in cache
    mealCache.set(meals, dateString);

    return meals;
  });
}

// Get meals by date
export async function getMealsByDate(date: Date): Promise<Meal[]> {
  return loadMeals(date);
}

// Get meals by type
export async function getMealsByType(type: string): Promise<Meal[]> {
  const today = new Date();
  const meals = await loadMeals(today);
  return meals.filter((meal) => meal.mealType === type);
}

// Get today's meals (with fallback to cache if offline)
export async function getTodayMeals(): Promise<Meal[]> {
  const today = new Date();
  return getMealsByDate(today);
}

// Add a new meal
export async function addMeal(mealData: Omit<Meal, 'id' | 'user_id' | 'created_at' | 'updated_at'>): Promise<Meal> {
  // Validate data
  const validated = mealSchema.parse(mealData);

  return handleApiCall(async () => {
    // Transform mealType to meal_type for API
    const apiMealData = {
      ...validated,
      meal_type: validated.mealType,
    };

    const response = await apiClient.createMeal(apiMealData);

    if (!response.success || !response.data) {
      throw new ApiError('Failed to create meal');
    }

    // Transform response data back to mealType format
    const meal: Meal = {
      ...response.data,
      mealType: (response.data as any).meal_type || validated.mealType,
    };

    // Clear cache for the date
    mealCache.clearForDate(mealData.date.split('T')[0]);

    return meal;
  });
}

// Update a meal
export async function updateMeal(id: string, mealData: Partial<Meal>): Promise<Meal> {
  // Validate data
  if (mealData.name) mealData.name = mealSchema.parse({ ...mealData, calories: mealData.calories || 0, grams: mealData.grams || 0, mealType: mealData.mealType || 'breakfast' }).name;

  return handleApiCall(async () => {
    // Transform mealType to meal_type for API, excluding undefined values
    const apiMealData: any = {};
    for (const [key, value] of Object.entries(mealData)) {
      if (key === 'mealType') {
        apiMealData.meal_type = value;
      } else if (value !== undefined) {
        apiMealData[key] = value;
      }
    }

    const response = await apiClient.updateMeal(id, apiMealData);

    if (!response.success || !response.data) {
      throw new ApiError('Failed to update meal');
    }

    // Transform response data back to mealType format
    const meal: Meal = {
      ...response.data,
      mealType: (response.data as any).meal_type || mealData.mealType || 'breakfast',
    };

    // Clear cache for the date
    const mealDate = meal.date.split('T')[0];
    mealCache.clearForDate(mealDate);

    return meal;
  });
}

// Delete a meal
export async function deleteMeal(id: string): Promise<boolean> {
  return handleApiCall(async () => {
    const response = await apiClient.deleteMeal(id);

    if (!response.success) {
      throw new ApiError(response.message || 'Failed to delete meal', response.error_code);
    }

    // Clear cache for the date
    const meal = await getMealById(id); // Get meal to know its date
    if (meal) {
      const mealDate = meal.date.split('T')[0];
      mealCache.clearForDate(mealDate);
    }

    return true;
  });
}

// Get meal by ID
export async function getMealById(id: string): Promise<Meal | null> {
  try {
    const response = await apiClient.getMealById(id);

    if (response.success && response.data) {
      // Transform meal_type to mealType
      return {
        ...response.data,
        mealType: (response.data as any).meal_type,
      };
    }

    return null;
  } catch (error) {
    // If offline, try to get from cache
    const allMeals = await loadMeals();
    return allMeals.find(meal => meal.id === id) || null;
  }
}

// Get total calories for a day
export async function getTotalCaloriesForDay(date: Date): Promise<number> {
  const meals = await getMealsByDate(date);
  return meals.reduce((total, meal) => total + meal.calories, 0);
}

// Get macros for a day
export async function getMacrosForDay(date: Date): Promise<{ protein: number; carbs: number; fat: number }> {
  const meals = await getMealsByDate(date);

  return meals.reduce(
    (macros, meal) => ({
      protein: macros.protein + (meal.protein || 0),
      carbs: macros.carbs + (meal.carbs || 0),
      fat: macros.fat + (meal.fat || 0),
    }),
    { protein: 0, carbs: 0, fat: 0 },
  );
}

// Get favorite foods
export async function getFavoriteFoods(): Promise<FoodItem[]> {
  try {
    return handleApiCall(async () => {
      const response = await apiClient.getFavorites();

      if (!response.success || !response.data) {
        throw new ApiError(response.message || 'Failed to load favorite foods', response.error_code);
      }

      return response.data;
    });
  } catch (error) {
    // Fallback to localStorage if API fails (offline support)
    try {
      const storedData = localStorage.getItem("favoriteFoods");
      if (storedData) {
        const parsed = JSON.parse(storedData) as unknown[];
        const result = z.array(foodItemSchema).safeParse(parsed);
        return result.success ? result.data : [];
      }
    } catch (localStorageError) {
      console.error('Error loading favorite foods from cache:', localStorageError);
    }
    return [];
  }
}

// Add a food to favorites
export async function addFavoriteFood(food: FoodItem): Promise<void> {
  return handleApiCall(async () => {
    const response = await apiClient.addFavorite(food);

    if (!response.success) {
      throw new ApiError(response.message || 'Failed to add favorite food', response.error_code);
    }
  });
}

// Remove a food from favorites
export async function removeFavoriteFood(foodId: string | number): Promise<void> {
  return handleApiCall(async () => {
    const response = await apiClient.removeFavorite(foodId);

    if (!response.success) {
      throw new ApiError(response.message || 'Failed to remove favorite food', response.error_code);
    }
  });
}

// Get custom foods
export async function getCustomFoods(): Promise<FoodItem[]> {
  try {
    return handleApiCall(async () => {
      const response = await apiClient.getCustomFoods();

      if (!response.success || !response.data) {
        throw new ApiError(response.message || 'Failed to load custom foods', response.error_code);
      }

      return response.data;
    });
  } catch (error) {
    // Fallback to localStorage if API fails (offline support)
    try {
      const storedData = localStorage.getItem("customFoods");
      if (storedData) {
        const parsed = JSON.parse(storedData) as unknown[];
        const result = z.array(foodItemSchema).safeParse(parsed);
        return result.success ? result.data : [];
      }
    } catch (localStorageError) {
      console.error('Error loading custom foods from cache:', localStorageError);
    }
    return [];
  }
}

// Add a custom food
export async function addCustomFood(food: Omit<FoodItem, 'id'>): Promise<FoodItem | null> {
  return handleApiCall(async () => {
    const response = await apiClient.createCustomFood(food);

    if (!response.success || !response.data) {
      throw new ApiError(response.message || 'Failed to create custom food', response.error_code);
    }

    return response.data;
  });
}

// Search foods
export async function searchFoods(query: string, page = 1, pageSize = 20): Promise<{ items: FoodItem[]; total: number; hasMore: boolean }> {
  try {
    const response = await apiClient.searchFoods(query, page, pageSize);

    if (!response.success || !response.data) {
      throw new ApiError('Failed to search foods');
    }

    return {
      items: response.data,
      total: response.total,
      hasMore: response.has_more,
    };
  } catch (error) {
    // Fallback to cached Thai foods if API fails
    try {
      const thaiResponse = await apiClient.getThaiFoods(1, 50);
      if (thaiResponse.success && thaiResponse.data) {
        const filtered = thaiResponse.data.filter(food =>
          food.name.toLowerCase().includes(query.toLowerCase())
        );
        return {
          items: filtered.slice(0, pageSize),
          total: filtered.length,
          hasMore: false,
        };
      }
    } catch (fallbackError) {
      console.error('Fallback search also failed:', fallbackError);
    }

    throw error;
  }
}

// Get Thai foods
export async function getThaiFoods(page = 1, pageSize = 20): Promise<FoodItem[]> {
  try {
    const response = await apiClient.getThaiFoods(page, pageSize);

    if (!response.success || !response.data) {
      throw new ApiError('Failed to load Thai foods');
    }

    return response.data;
  } catch (error) {
    // Fallback to localStorage if API fails
    const cached = localStorage.getItem('thaiFoodCache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        return Array.isArray(parsed) ? parsed.slice(0, pageSize) : [];
      } catch (parseError) {
        console.error('Error parsing Thai food cache:', parseError);
      }
    }
    throw error;
  }
}

// Cache Thai foods for offline use
export async function cacheThaiFoods(foods: FoodItem[]): Promise<void> {
  try {
    localStorage.setItem('thaiFoodCache', JSON.stringify(foods));
  } catch (error) {
    console.error('Error caching Thai foods:', error);
  }
}

// Clear all caches
export function clearMealCache(): void {
  mealCache.clear();
  localStorage.removeItem('thaiFoodCache');
}

// Get user profile
export async function getUserProfile(): Promise<any> {
  return handleApiCall(async () => {
    const response = await apiClient.getProfile();

    if (!response.success || !response.data) {
      throw new ApiError(response.message || 'Failed to load profile', response.error_code);
    }

    return response.data;
  });
}

// Update user profile
export async function updateUserProfile(profile: Partial<any>): Promise<any> {
  return handleApiCall(async () => {
    const response = await apiClient.updateProfile(profile);

    if (!response.success || !response.data) {
      throw new ApiError(response.message || 'Failed to update profile', response.error_code);
    }

    return response.data;
  });
}