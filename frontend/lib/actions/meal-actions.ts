'use server';

import { apiClient } from '@/lib/api-client';
import { revalidatePath } from 'next/cache';

export async function getMealsAction(date?: string) {
  try {
    const response = await apiClient.getMeals(1, 100, date);

    if (!response.success || !response.data) {
      throw new Error('Failed to load meals');
    }

    return response.data;
  } catch (error) {
    console.error('Get meals error:', error);
    throw error;
  }
}

export async function getDailyStatsAction(date: string) {
  try {
    const response = await apiClient.getDailyStats(date);

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to load daily stats');
    }

    return response.data;
  } catch (error) {
    console.error('Get daily stats error:', error);
    throw error;
  }
}

export async function addMealAction(prevState: any, formData: FormData) {
  try {
    const mealData = {
      name: formData.get('name') as string,
      calories: parseInt(formData.get('calories') as string) || 0,
      grams: parseInt(formData.get('grams') as string) || 0,
      meal_type: formData.get('mealType') as 'breakfast' | 'lunch' | 'dinner' | 'snack',
      date: new Date().toISOString(),
      protein: parseInt(formData.get('protein') as string) || 0,
      carbs: parseInt(formData.get('carbs') as string) || 0,
      fat: parseInt(formData.get('fat') as string) || 0,
    };

    const response = await apiClient.createMeal(mealData);

    if (!response.success || !response.data) {
      return { error: response.message || 'Failed to create meal' };
    }

    // Revalidate the meals page
    revalidatePath('/meals');
    revalidatePath('/dashboard');

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Add meal error:', error);
    return { error: error.message || 'Failed to create meal' };
  }
}

export async function updateMealAction(prevState: any, formData: FormData) {
  try {
    const id = formData.get('id') as string;
    const mealData = {
      name: formData.get('name') as string,
      calories: parseInt(formData.get('calories') as string) || 0,
      grams: parseInt(formData.get('grams') as string) || 0,
      meal_type: formData.get('mealType') as 'breakfast' | 'lunch' | 'dinner' | 'snack',
      protein: parseInt(formData.get('protein') as string) || 0,
      carbs: parseInt(formData.get('carbs') as string) || 0,
      fat: parseInt(formData.get('fat') as string) || 0,
    };

    const response = await apiClient.updateMeal(id, mealData);

    if (!response.success || !response.data) {
      return { error: response.message || 'Failed to update meal' };
    }

    // Revalidate relevant pages
    revalidatePath('/meals');
    revalidatePath('/dashboard');

    return { success: true, data: response.data };
  } catch (error: any) {
    console.error('Update meal error:', error);
    return { error: error.message || 'Failed to update meal' };
  }
}

export async function deleteMealAction(id: string) {
  try {
    const response = await apiClient.deleteMeal(id);

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete meal');
    }

    // Revalidate relevant pages
    revalidatePath('/meals');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (error) {
    console.error('Delete meal error:', error);
    throw error;
  }
}

export async function getFavoriteFoodsAction() {
  try {
    const response = await apiClient.getFavorites();

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to load favorite foods');
    }

    return response.data;
  } catch (error) {
    console.error('Get favorite foods error:', error);
    throw error;
  }
}

export async function addFavoriteFoodAction(food: any) {
  try {
    const response = await apiClient.addFavorite(food);

    if (!response.success) {
      throw new Error(response.message || 'Failed to add favorite food');
    }

    return response.data;
  } catch (error) {
    console.error('Add favorite food error:', error);
    throw error;
  }
}

export async function removeFavoriteFoodAction(id: string | number) {
  try {
    const response = await apiClient.removeFavorite(id);

    if (!response.success) {
      throw new Error(response.message || 'Failed to remove favorite food');
    }

    return response.data;
  } catch (error) {
    console.error('Remove favorite food error:', error);
    throw error;
  }
}

export async function getCustomFoodsAction() {
  try {
    const response = await apiClient.getCustomFoods();

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to load custom foods');
    }

    return response.data;
  } catch (error) {
    console.error('Get custom foods error:', error);
    throw error;
  }
}

export async function createCustomFoodAction(food: any) {
  try {
    const response = await apiClient.createCustomFood(food);

    if (!response.success || !response.data) {
      throw new Error(response.message || 'Failed to create custom food');
    }

    return response.data;
  } catch (error) {
    console.error('Create custom food error:', error);
    throw error;
  }
}

export async function deleteCustomFoodAction(id: string | number) {
  try {
    const response = await apiClient.deleteCustomFood(id);

    if (!response.success) {
      throw new Error(response.message || 'Failed to delete custom food');
    }

    return response.data;
  } catch (error) {
    console.error('Delete custom food error:', error);
    throw error;
  }
}

export async function searchFoodsAction(query: string) {
  try {
    const response = await apiClient.searchFoods(query, 1, 20);

    if (!response.success || !response.data) {
      throw new Error('Failed to search foods');
    }

    return response.data;
  } catch (error) {
    console.error('Search foods error:', error);
    throw error;
  }
}

export async function getThaiFoodsAction() {
  try {
    const response = await apiClient.getThaiFoods(1, 50);

    if (!response.success || !response.data) {
      throw new Error('Failed to load Thai foods');
    }

    return response.data;
  } catch (error) {
    console.error('Get Thai foods error:', error);
    throw error;
  }
}