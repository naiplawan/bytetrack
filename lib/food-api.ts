// Food API Service - Combines Open Food Facts with local Thai food database

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize: number;
  servingUnit: string;
}

export interface FoodItem {
  id: string;
  name: string;
  nameEn: string;
  brand?: string;
  category: string;
  nutrition: NutritionInfo;
  image?: string;
  barcode?: string;
  source: 'local' | 'openfoodfacts' | 'usda';
  emoji?: string;
}

export interface SearchResult {
  foods: FoodItem[];
  total: number;
  page: number;
  hasMore: boolean;
}

// ============================================
// Open Food Facts API Integration
// ============================================

interface OpenFoodFactsProduct {
  code: string;
  product_name: string;
  product_name_en?: string;
  brands?: string;
  categories?: string;
  image_url?: string;
  nutriments?: {
    'energy-kcal_100g'?: number;
    'energy-kcal_serving'?: number;
    proteins_100g?: number;
    proteins_serving?: number;
    carbohydrates_100g?: number;
    carbohydrates_serving?: number;
    fat_100g?: number;
    fat_serving?: number;
    fiber_100g?: number;
    sugars_100g?: number;
    sodium_100g?: number;
  };
  serving_size?: string;
  serving_quantity?: number;
}

interface OpenFoodFactsResponse {
  count: number;
  page: number;
  page_size: number;
  products: OpenFoodFactsProduct[];
}

function parseServingSize(servingSize?: string): { size: number; unit: string } {
  if (!servingSize) return { size: 100, unit: 'g' };

  const match = servingSize.match(/(\d+(?:\.\d+)?)\s*(g|ml|oz|cup|tbsp|tsp)?/i);
  if (match) {
    return {
      size: parseFloat(match[1]),
      unit: match[2]?.toLowerCase() || 'g',
    };
  }
  return { size: 100, unit: 'g' };
}

function mapOpenFoodFactsProduct(product: OpenFoodFactsProduct): FoodItem | null {
  if (!product.product_name && !product.product_name_en) return null;

  const nutriments = product.nutriments || {};
  const serving = parseServingSize(product.serving_size);

  return {
    id: `off_${product.code}`,
    name: product.product_name || product.product_name_en || 'Unknown',
    nameEn: product.product_name_en || product.product_name || 'Unknown',
    brand: product.brands,
    category: product.categories?.split(',')[0]?.trim() || 'other',
    nutrition: {
      calories: Math.round(nutriments['energy-kcal_100g'] || 0),
      protein: Math.round((nutriments.proteins_100g || 0) * 10) / 10,
      carbs: Math.round((nutriments.carbohydrates_100g || 0) * 10) / 10,
      fat: Math.round((nutriments.fat_100g || 0) * 10) / 10,
      fiber: nutriments.fiber_100g ? Math.round(nutriments.fiber_100g * 10) / 10 : undefined,
      sugar: nutriments.sugars_100g ? Math.round(nutriments.sugars_100g * 10) / 10 : undefined,
      sodium: nutriments.sodium_100g ? Math.round(nutriments.sodium_100g) : undefined,
      servingSize: serving.size,
      servingUnit: serving.unit,
    },
    image: product.image_url,
    barcode: product.code,
    source: 'openfoodfacts',
  };
}

export async function searchOpenFoodFacts(
  query: string,
  page: number = 1,
  pageSize: number = 20
): Promise<SearchResult> {
  try {
    const url = new URL('https://world.openfoodfacts.org/cgi/search.pl');
    url.searchParams.set('search_terms', query);
    url.searchParams.set('search_simple', '1');
    url.searchParams.set('action', 'process');
    url.searchParams.set('json', '1');
    url.searchParams.set('page', page.toString());
    url.searchParams.set('page_size', pageSize.toString());
    url.searchParams.set('fields', 'code,product_name,product_name_en,brands,categories,image_url,nutriments,serving_size,serving_quantity');

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'ByteTrack/1.0 (https://bytetrack.app)',
      },
    });

    if (!response.ok) {
      throw new Error(`Open Food Facts API error: ${response.status}`);
    }

    const data: OpenFoodFactsResponse = await response.json();

    const foods = data.products
      .map(mapOpenFoodFactsProduct)
      .filter((food): food is FoodItem => food !== null);

    return {
      foods,
      total: data.count,
      page: data.page,
      hasMore: data.page * data.page_size < data.count,
    };
  } catch (error) {
    console.error('Open Food Facts search error:', error);
    return { foods: [], total: 0, page: 1, hasMore: false };
  }
}

export async function getProductByBarcode(barcode: string): Promise<FoodItem | null> {
  try {
    const response = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${barcode}.json`,
      {
        headers: {
          'User-Agent': 'ByteTrack/1.0 (https://bytetrack.app)',
        },
      }
    );

    if (!response.ok) return null;

    const data = await response.json();
    if (data.status !== 1) return null;

    return mapOpenFoodFactsProduct(data.product);
  } catch (error) {
    console.error('Barcode lookup error:', error);
    return null;
  }
}

// ============================================
// Local Thai Food Database
// ============================================

const thaiFoods: FoodItem[] = [
  {
    id: 'th_1',
    name: 'ข้าวผัดกุ้ง',
    nameEn: 'Fried Rice with Shrimp',
    category: 'rice',
    nutrition: { calories: 350, protein: 18, carbs: 45, fat: 12, fiber: 2, servingSize: 250, servingUnit: 'g' },
    source: 'local',
    emoji: '🍤',
  },
  {
    id: 'th_2',
    name: 'ผัดไทย',
    nameEn: 'Pad Thai',
    category: 'noodles',
    nutrition: { calories: 400, protein: 15, carbs: 55, fat: 14, fiber: 3, servingSize: 300, servingUnit: 'g' },
    source: 'local',
    emoji: '🍜',
  },
  {
    id: 'th_3',
    name: 'แกงเขียวหวานไก่',
    nameEn: 'Green Curry with Chicken',
    category: 'curry',
    nutrition: { calories: 280, protein: 25, carbs: 8, fat: 18, fiber: 2, servingSize: 200, servingUnit: 'g' },
    source: 'local',
    emoji: '🍛',
  },
  {
    id: 'th_4',
    name: 'ต้มยำกุ้ง',
    nameEn: 'Tom Yum Goong',
    category: 'soup',
    nutrition: { calories: 120, protein: 15, carbs: 8, fat: 3, fiber: 1, servingSize: 250, servingUnit: 'g' },
    source: 'local',
    emoji: '🍲',
  },
  {
    id: 'th_5',
    name: 'ข้าวมันไก่',
    nameEn: 'Hainanese Chicken Rice',
    category: 'rice',
    nutrition: { calories: 480, protein: 28, carbs: 55, fat: 16, fiber: 1, servingSize: 350, servingUnit: 'g' },
    source: 'local',
    emoji: '🍗',
  },
  {
    id: 'th_6',
    name: 'ส้มตำ',
    nameEn: 'Papaya Salad',
    category: 'salad',
    nutrition: { calories: 150, protein: 3, carbs: 30, fat: 2, fiber: 8, servingSize: 200, servingUnit: 'g' },
    source: 'local',
    emoji: '🥗',
  },
  {
    id: 'th_7',
    name: 'ไก่ย่าง',
    nameEn: 'Grilled Chicken',
    category: 'grilled',
    nutrition: { calories: 250, protein: 35, carbs: 0, fat: 12, fiber: 0, servingSize: 150, servingUnit: 'g' },
    source: 'local',
    emoji: '🍖',
  },
  {
    id: 'th_8',
    name: 'ผัดกะเพราหมูสับ',
    nameEn: 'Stir-fried Basil with Minced Pork',
    category: 'stir-fry',
    nutrition: { calories: 320, protein: 20, carbs: 15, fat: 22, fiber: 2, servingSize: 200, servingUnit: 'g' },
    source: 'local',
    emoji: '🥘',
  },
  {
    id: 'th_9',
    name: 'มะม่วงข้าวเหนียว',
    nameEn: 'Mango Sticky Rice',
    category: 'dessert',
    nutrition: { calories: 380, protein: 6, carbs: 70, fat: 12, fiber: 3, servingSize: 180, servingUnit: 'g' },
    source: 'local',
    emoji: '🥭',
  },
  {
    id: 'th_10',
    name: 'ข้าวต้มหมู',
    nameEn: 'Rice Porridge with Pork',
    category: 'soup',
    nutrition: { calories: 200, protein: 15, carbs: 25, fat: 5, fiber: 1, servingSize: 300, servingUnit: 'g' },
    source: 'local',
    emoji: '🍲',
  },
  {
    id: 'th_11',
    name: 'ลาบหมู',
    nameEn: 'Spicy Minced Pork Salad',
    category: 'salad',
    nutrition: { calories: 180, protein: 22, carbs: 5, fat: 9, fiber: 2, servingSize: 150, servingUnit: 'g' },
    source: 'local',
    emoji: '🥗',
  },
  {
    id: 'th_12',
    name: 'ก๋วยเตี๋ยวน้ำใส',
    nameEn: 'Clear Noodle Soup',
    category: 'noodles',
    nutrition: { calories: 280, protein: 18, carbs: 35, fat: 8, fiber: 2, servingSize: 400, servingUnit: 'g' },
    source: 'local',
    emoji: '🍜',
  },
  {
    id: 'th_13',
    name: 'แกงมัสมั่นไก่',
    nameEn: 'Massaman Curry with Chicken',
    category: 'curry',
    nutrition: { calories: 350, protein: 22, carbs: 20, fat: 22, fiber: 3, servingSize: 250, servingUnit: 'g' },
    source: 'local',
    emoji: '🍛',
  },
  {
    id: 'th_14',
    name: 'ข้าวขาหมู',
    nameEn: 'Braised Pork Leg on Rice',
    category: 'rice',
    nutrition: { calories: 550, protein: 30, carbs: 50, fat: 25, fiber: 1, servingSize: 350, servingUnit: 'g' },
    source: 'local',
    emoji: '🍖',
  },
  {
    id: 'th_15',
    name: 'ยำวุ้นเส้น',
    nameEn: 'Glass Noodle Salad',
    category: 'salad',
    nutrition: { calories: 220, protein: 12, carbs: 30, fat: 6, fiber: 2, servingSize: 200, servingUnit: 'g' },
    source: 'local',
    emoji: '🥗',
  },
  {
    id: 'th_16',
    name: 'ต้มข่าไก่',
    nameEn: 'Chicken in Coconut Soup',
    category: 'soup',
    nutrition: { calories: 250, protein: 18, carbs: 8, fat: 18, fiber: 1, servingSize: 250, servingUnit: 'g' },
    source: 'local',
    emoji: '🍲',
  },
  {
    id: 'th_17',
    name: 'ผัดซีอิ๊ว',
    nameEn: 'Stir-fried Noodles with Soy Sauce',
    category: 'noodles',
    nutrition: { calories: 380, protein: 15, carbs: 50, fat: 14, fiber: 2, servingSize: 300, servingUnit: 'g' },
    source: 'local',
    emoji: '🍜',
  },
  {
    id: 'th_18',
    name: 'หมูสะเต๊ะ',
    nameEn: 'Pork Satay',
    category: 'grilled',
    nutrition: { calories: 300, protein: 25, carbs: 12, fat: 18, fiber: 1, servingSize: 150, servingUnit: 'g' },
    source: 'local',
    emoji: '🍢',
  },
  {
    id: 'th_19',
    name: 'ข้าวเหนียวหมูปิ้ง',
    nameEn: 'Sticky Rice with Grilled Pork',
    category: 'grilled',
    nutrition: { calories: 420, protein: 22, carbs: 45, fat: 18, fiber: 2, servingSize: 250, servingUnit: 'g' },
    source: 'local',
    emoji: '🍖',
  },
  {
    id: 'th_20',
    name: 'ไข่เจียว',
    nameEn: 'Thai Omelette',
    category: 'stir-fry',
    nutrition: { calories: 280, protein: 14, carbs: 2, fat: 24, fiber: 0, servingSize: 120, servingUnit: 'g' },
    source: 'local',
    emoji: '🍳',
  },
];

export function searchLocalFoods(query: string, category?: string): FoodItem[] {
  let results = thaiFoods;

  if (category && category !== 'all') {
    results = results.filter((food) => food.category === category);
  }

  if (query) {
    const lowerQuery = query.toLowerCase();
    results = results.filter(
      (food) =>
        food.name.toLowerCase().includes(lowerQuery) ||
        food.nameEn.toLowerCase().includes(lowerQuery)
    );
  }

  return results;
}

export function getLocalFoodById(id: string): FoodItem | null {
  return thaiFoods.find((food) => food.id === id) || null;
}

// ============================================
// Combined Search (Local + API)
// ============================================

export async function searchFoods(
  query: string,
  options: {
    category?: string;
    includeApi?: boolean;
    page?: number;
    pageSize?: number;
  } = {}
): Promise<SearchResult> {
  const { category, includeApi = true, page = 1, pageSize = 20 } = options;

  // Always search local Thai foods first
  const localResults = searchLocalFoods(query, category);

  // If we have enough local results or API is disabled, return local only
  if (!includeApi || localResults.length >= pageSize) {
    const startIndex = (page - 1) * pageSize;
    const paginatedResults = localResults.slice(startIndex, startIndex + pageSize);

    return {
      foods: paginatedResults,
      total: localResults.length,
      page,
      hasMore: startIndex + pageSize < localResults.length,
    };
  }

  // Search Open Food Facts API for additional results
  const apiResults = await searchOpenFoodFacts(query, page, pageSize - localResults.length);

  // Combine results: local first, then API results
  const combinedFoods = page === 1
    ? [...localResults, ...apiResults.foods]
    : apiResults.foods;

  return {
    foods: combinedFoods,
    total: localResults.length + apiResults.total,
    page,
    hasMore: apiResults.hasMore,
  };
}

// ============================================
// Categories
// ============================================

export interface FoodCategory {
  id: string;
  name: string;
  nameEn: string;
  icon: string;
}

export const foodCategories: FoodCategory[] = [
  { id: 'all', name: 'ทั้งหมด', nameEn: 'All', icon: '🍽️' },
  { id: 'rice', name: 'ข้าว', nameEn: 'Rice & Grains', icon: '🍚' },
  { id: 'noodles', name: 'เส้น', nameEn: 'Noodles', icon: '🍜' },
  { id: 'curry', name: 'แกง', nameEn: 'Curry', icon: '🍛' },
  { id: 'stir-fry', name: 'ผัด', nameEn: 'Stir-fry', icon: '🥘' },
  { id: 'soup', name: 'ต้ม', nameEn: 'Soup', icon: '🍲' },
  { id: 'salad', name: 'ยำ', nameEn: 'Salad', icon: '🥗' },
  { id: 'grilled', name: 'ย่าง', nameEn: 'Grilled', icon: '🍖' },
  { id: 'dessert', name: 'ของหวาน', nameEn: 'Dessert', icon: '🍮' },
];

export function getCategories(): FoodCategory[] {
  return foodCategories;
}

// ============================================
// Utility Functions
// ============================================

export function calculateCaloriesForServing(
  food: FoodItem,
  servings: number
): NutritionInfo {
  const multiplier = servings;
  return {
    calories: Math.round(food.nutrition.calories * multiplier),
    protein: Math.round(food.nutrition.protein * multiplier * 10) / 10,
    carbs: Math.round(food.nutrition.carbs * multiplier * 10) / 10,
    fat: Math.round(food.nutrition.fat * multiplier * 10) / 10,
    fiber: food.nutrition.fiber ? Math.round(food.nutrition.fiber * multiplier * 10) / 10 : undefined,
    sugar: food.nutrition.sugar ? Math.round(food.nutrition.sugar * multiplier * 10) / 10 : undefined,
    sodium: food.nutrition.sodium ? Math.round(food.nutrition.sodium * multiplier) : undefined,
    servingSize: Math.round(food.nutrition.servingSize * multiplier),
    servingUnit: food.nutrition.servingUnit,
  };
}

// Legacy compatibility - map to old FoodItem format
export function toLegacyFoodItem(food: FoodItem): {
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
} {
  return {
    id: food.id,
    name: food.name,
    nameEn: food.nameEn,
    category: food.category,
    calories: food.nutrition.calories,
    protein: food.nutrition.protein,
    carbs: food.nutrition.carbs,
    fat: food.nutrition.fat,
    fiber: food.nutrition.fiber,
    sugar: food.nutrition.sugar,
    servingSize: food.nutrition.servingSize,
    emoji: food.emoji,
  };
}
