// Thai Food API - Backward compatible wrapper for the new food-api service
// This file maintains backward compatibility with existing components

import {
  searchFoods as searchFoodsNew,
  searchLocalFoods,
  getLocalFoodById,
  getCategories as getCategoriesNew,
  getProductByBarcode,
  toLegacyFoodItem,
  type FoodItem as NewFoodItem,
  type FoodCategory as NewFoodCategory,
  type SearchResult,
} from './food-api';

// Legacy types for backward compatibility
export interface FoodItem {
  id: string;
  name: string;
  nameEn: string;
  category: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  servingSize?: number;
  emoji?: string;
}

export interface FoodCategory {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
}

// Convert new FoodItem to legacy format
function convertToLegacy(food: NewFoodItem): FoodItem {
  return toLegacyFoodItem(food);
}

// Search foods - combines local Thai foods with Open Food Facts API
export async function searchFoods(query: string, category?: string): Promise<FoodItem[]> {
  const result = await searchFoodsNew(query, {
    category,
    includeApi: true,
    pageSize: 20,
  });

  return result.foods.map(convertToLegacy);
}

// Get categories
export async function getCategories(): Promise<FoodCategory[]> {
  return getCategoriesNew();
}

// Get food by ID
export async function getFoodById(id: string): Promise<FoodItem | null> {
  const food = getLocalFoodById(id);
  return food ? convertToLegacy(food) : null;
}

// Get all Thai foods (local only)
export async function getThaiFood(): Promise<FoodItem[]> {
  const localFoods = searchLocalFoods('');
  return localFoods.map(convertToLegacy);
}

// Search local Thai foods only (no API call)
export async function searchLocalThaiFoods(query: string, category?: string): Promise<FoodItem[]> {
  const localFoods = searchLocalFoods(query, category);
  return localFoods.map(convertToLegacy);
}

// Scan barcode using Open Food Facts
export async function scanBarcode(barcode: string): Promise<FoodItem | null> {
  const food = await getProductByBarcode(barcode);
  return food ? convertToLegacy(food) : null;
}

// Advanced search with pagination
export async function searchFoodsAdvanced(
  query: string,
  options: {
    category?: string;
    includeApi?: boolean;
    page?: number;
    pageSize?: number;
  } = {}
): Promise<{
  foods: FoodItem[];
  total: number;
  page: number;
  hasMore: boolean;
}> {
  const result = await searchFoodsNew(query, options);

  return {
    foods: result.foods.map(convertToLegacy),
    total: result.total,
    page: result.page,
    hasMore: result.hasMore,
  };
}

// Re-export new types and functions for components that want to use the new API
export {
  searchFoodsNew as searchFoodsWithNutrition,
  getProductByBarcode,
  type NewFoodItem as FoodItemDetailed,
  type SearchResult,
};
