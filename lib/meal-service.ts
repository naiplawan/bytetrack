import { z } from 'zod';

// Type definitions
export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export interface Meal {
  id: number;
  name: string;
  calories: number;
  grams: number;
  mealType: MealType;
  date: Date;
  image?: string;
  carbs: number;
  protein: number;
  fat: number;
}

export interface FoodItem {
  id: number | string;
  name: string;
  calories?: number;
  carbs?: number;
  protein?: number;
  fat?: number;
  [key: string]: unknown;
}

// Zod schema for validation
const mealSchema = z.object({
  id: z.number(),
  name: z.string(),
  calories: z.number(),
  grams: z.number(),
  mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
  date: z.date(),
  image: z.string().optional(),
  carbs: z.number(),
  protein: z.number(),
  fat: z.number(),
});

const foodItemSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string(),
  calories: z.number().optional(),
  carbs: z.number().optional(),
  protein: z.number().optional(),
  fat: z.number().optional(),
});

// Mock data for meals
const mockMeals: Meal[] = [
  {
    id: 1,
    name: "Grilled Chicken Salad",
    calories: 294,
    grams: 150,
    mealType: "lunch",
    date: new Date(),
    image: "/placeholder.svg?height=64&width=64",
    carbs: 10,
    protein: 35,
    fat: 12,
  },
  {
    id: 2,
    name: "Chicken With Salad",
    calories: 120,
    grams: 50,
    mealType: "lunch",
    date: new Date(),
    image: "/placeholder.svg?height=64&width=64",
    carbs: 5,
    protein: 15,
    fat: 4,
  },
  {
    id: 3,
    name: "Egg And Corot",
    calories: 150,
    grams: 90,
    mealType: "breakfast",
    date: new Date(),
    image: "/placeholder.svg?height=64&width=64",
    carbs: 8,
    protein: 12,
    fat: 8,
  },
  {
    id: 4,
    name: "Green Vegetable",
    calories: 70,
    grams: 70,
    mealType: "dinner",
    date: new Date(),
    image: "/placeholder.svg?height=64&width=64",
    carbs: 12,
    protein: 3,
    fat: 1,
  },
];

// In a real app, this would be stored in a database
let meals = [...mockMeals];

// Get meals by date
export function getMealsByDate(date: Date) {
  const dateString = date.toDateString()
  return meals.filter((meal) => meal.date.toDateString() === dateString)
}

// Get meals by type
export function getMealsByType(type: string) {
  return meals.filter((meal) => meal.mealType === type)
}

// Add a new meal
export function addMeal(meal: Omit<Meal, 'id' | 'date'>): Meal {
  const newMeal: Meal = {
    ...meal,
    id: meals.length + 1,
    date: new Date(),
  };

  meals.push(newMeal);

  // Store in localStorage for persistence
  try {
    const storedData = localStorage.getItem("meals");
    const storedMeals = storedData ? JSON.parse(storedData) as unknown[] : [];
    localStorage.setItem("meals", JSON.stringify([...storedMeals, newMeal]));
  } catch (error) {
    console.error("Error storing meal in localStorage:", error);
  }

  return newMeal;
}

// Delete a meal
export function deleteMeal(id: number): boolean {
  meals = meals.filter((meal) => meal.id !== id);

  // Update localStorage
  try {
    const storedData = localStorage.getItem("meals");
    if (storedData) {
      const storedMeals = JSON.parse(storedData) as Meal[];
      localStorage.setItem("meals", JSON.stringify(storedMeals.filter((meal) => meal.id !== id)));
    }
  } catch (error) {
    console.error("Error updating localStorage:", error);
  }

  return true;
}

// Get total calories for a day
export function getTotalCaloriesForDay(date: Date) {
  const dayMeals = getMealsByDate(date)
  return dayMeals.reduce((total, meal) => total + meal.calories, 0)
}

// Get macros for a day
export function getMacrosForDay(date: Date) {
  const dayMeals = getMealsByDate(date)

  return dayMeals.reduce(
    (macros, meal) => {
      return {
        carbs: macros.carbs + (meal.carbs || 0),
        protein: macros.protein + (meal.protein || 0),
        fat: macros.fat + (meal.fat || 0),
      }
    },
    { carbs: 0, protein: 0, fat: 0 },
  )
}

// Get favorite foods
export function getFavoriteFoods(): FoodItem[] {
  try {
    const storedData = localStorage.getItem("favoriteFoods");
    if (!storedData) return [];

    const parsed = JSON.parse(storedData) as unknown[];
    const result = z.array(foodItemSchema).safeParse(parsed);
    return result.success ? result.data : [];
  } catch (error) {
    console.error("Error getting favorite foods:", error);
    return [];
  }
}

// Add a food to favorites
export function addFavoriteFood(food: FoodItem): void {
  try {
    const favorites = getFavoriteFoods();
    if (!favorites.some((f) => f.id === food.id)) {
      localStorage.setItem("favoriteFoods", JSON.stringify([...favorites, food]));
    }
  } catch (error) {
    console.error("Error adding favorite food:", error);
  }
}

// Remove a food from favorites
export function removeFavoriteFood(foodId: number | string): void {
  try {
    const favorites = getFavoriteFoods();
    localStorage.setItem("favoriteFoods", JSON.stringify(favorites.filter((f) => f.id !== foodId)));
  } catch (error) {
    console.error("Error removing favorite food:", error);
  }
}

// Get custom foods
export function getCustomFoods(): FoodItem[] {
  try {
    const storedData = localStorage.getItem("customFoods");
    if (!storedData) return [];

    const parsed = JSON.parse(storedData) as unknown[];
    const result = z.array(foodItemSchema).safeParse(parsed);
    return result.success ? result.data : [];
  } catch (error) {
    console.error("Error getting custom foods:", error);
    return [];
  }
}

// Add a custom food
export function addCustomFood(food: FoodItem): FoodItem | null {
  try {
    const customFoods = getCustomFoods();
    const newFood: FoodItem = {
      ...food,
      id: food.id || Date.now(), // Use timestamp as ID if not provided
    };
    localStorage.setItem("customFoods", JSON.stringify([...customFoods, newFood]));
    return newFood;
  } catch (error) {
    console.error("Error adding custom food:", error);
    return null;
  }
}
