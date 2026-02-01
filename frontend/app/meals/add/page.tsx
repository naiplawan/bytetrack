'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Check, Camera, Search, X, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { searchFoods, calculateCaloriesForServing, type FoodItem, getCategories } from '@/lib/food-api';
import { addMeal, type MealType } from '@/lib/meal-service';

const MEAL_TYPES: { value: MealType; label: string; emoji: string }[] = [
  { value: 'breakfast', label: 'Breakfast', emoji: '🌅' },
  { value: 'lunch', label: 'Lunch', emoji: '☀️' },
  { value: 'dinner', label: 'Dinner', emoji: '🌙' },
  { value: 'snack', label: 'Snack', emoji: '🍎' },
];

export default function AddFoodPage() {
  const router = useRouter();
  const [quantity, setQuantity] = useState(1);
  const [isCustom, setIsCustom] = useState(false);
  const [selectedFood, setSelectedFood] = useState<FoodItem | null>(null);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('lunch');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<FoodItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [recentFoods, setRecentFoods] = useState<FoodItem[]>([]);
  const [showRecent, setShowRecent] = useState(false);

  const [customFood, setCustomFood] = useState({
    name: '',
    calories: '',
    servingSize: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  // Load recent foods from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('recentFoods');
      if (stored) {
        setRecentFoods(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading recent foods:', error);
    }
  }, []);

  // Search foods
  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (searchQuery.trim().length >= 2 && !isCustom) {
        setIsSearching(true);
        try {
          const result = await searchFoods(searchQuery, {
            category: selectedCategory !== 'all' ? selectedCategory : undefined,
            includeApi: true,
            pageSize: 15,
          });
          setSearchResults(result.foods);
        } catch (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [searchQuery, selectedCategory, isCustom]);

  const adjustQuantity = (delta: number) => {
    setQuantity(Math.max(0.1, Math.min(10, quantity + delta)));
  };

  const handleSelectFood = (food: FoodItem) => {
    setSelectedFood(food);
    setSearchQuery('');
    setSearchResults([]);
    setShowRecent(false);
  };

  const handleSaveAsFavorite = () => {
    if (!selectedFood && !customFood.name) {
      toast.error('Please select or enter a food first');
      return;
    }

    try {
      const favorites = JSON.parse(localStorage.getItem('favoriteFoods') || '[]');
      const foodToSave = selectedFood || {
        id: `custom_${Date.now()}`,
        name: customFood.name,
        calories: parseInt(customFood.calories) || 0,
        protein: parseInt(customFood.protein) || 0,
        carbs: parseInt(customFood.carbs) || 0,
        fat: parseInt(customFood.fat) || 0,
      };

      if (!favorites.some((f: FoodItem) => f.id === foodToSave.id)) {
        favorites.push(foodToSave);
        localStorage.setItem('favoriteFoods', JSON.stringify(favorites));
        toast.success('Saved to favorites! ⭐');
      } else {
        toast.info('Already in favorites');
      }
    } catch (error) {
      toast.error('Failed to save favorite');
    }
  };

  const handleAddToDiary = () => {
    if (!selectedFood && !customFood.name) {
      toast.error('Please select or enter a food first');
      return;
    }

    try {
      let nutrition = {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      };

      let foodName = '';
      let grams = 100;

      if (selectedFood) {
        const calculated = calculateCaloriesForServing(selectedFood, quantity);
        nutrition = {
          calories: calculated.calories,
          protein: calculated.protein,
          carbs: calculated.carbs,
          fat: calculated.fat,
        };
        foodName = selectedFood.name;
        grams = calculated.servingSize;
      } else if (customFood.name) {
        nutrition = {
          calories: parseInt(customFood.calories) || 0,
          protein: parseInt(customFood.protein) || 0,
          carbs: parseInt(customFood.carbs) || 0,
          fat: parseInt(customFood.fat) || 0,
        };
        foodName = customFood.name;
        grams = parseInt(customFood.servingSize) || 100;
      }

      // Add meal using the service
      addMeal({
        name: foodName,
        calories: Math.round(nutrition.calories),
        grams: Math.round(grams * quantity),
        mealType: selectedMealType,
        date: new Date().toISOString(),
        protein: Math.round(nutrition.protein),
        carbs: Math.round(nutrition.carbs),
        fat: Math.round(nutrition.fat),
      });

      // Add to recent foods
      if (selectedFood) {
        const updatedRecent = [selectedFood, ...recentFoods.filter(f => f.id !== selectedFood.id)].slice(0, 10);
        localStorage.setItem('recentFoods', JSON.stringify(updatedRecent));
      }

      toast.success(`Added ${foodName} to ${MEAL_TYPES.find(m => m.value === selectedMealType)?.label}! 🎉`);
      router.push('/meals');
    } catch (error) {
      console.error('Error adding meal:', error);
      toast.error('Failed to add meal');
    }
  };

  const currentNutrition = selectedFood
    ? calculateCaloriesForServing(selectedFood, quantity)
    : customFood.name
    ? {
        calories: parseInt(customFood.calories) || 0,
        protein: parseInt(customFood.protein) || 0,
        carbs: parseInt(customFood.carbs) || 0,
        fat: parseInt(customFood.fat) || 0,
        servingSize: parseInt(customFood.servingSize) || 100,
        servingUnit: 'g',
      }
    : null;

  const categories = getCategories();

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-brand/10">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/meals">
            <button className="w-10 h-10 rounded-full bg-white border border-brand/10 flex items-center justify-center hover:bg-brand/10 transition-all">
              <ArrowLeft className="w-5 h-5 text-text-primary" />
            </button>
          </Link>
          <h1 className="font-heading text-xl font-bold">Add Food</h1>
          <div className="flex gap-2">
            <button
              onClick={() => toast.info('Barcode scanner coming soon!')}
              className="w-10 h-10 rounded-full bg-white border border-brand/10 flex items-center justify-center hover:bg-brand/10 transition-all"
            >
              <Camera className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6 pb-48">
        {/* Meal Type Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {MEAL_TYPES.map((type) => (
            <button
              key={type.value}
              onClick={() => setSelectedMealType(type.value)}
              className={`flex-shrink-0 px-4 py-2 rounded-full font-medium transition-all flex items-center gap-2 ${
                selectedMealType === type.value
                  ? 'bg-brand text-white shadow-lg shadow-brand'
                  : 'bg-white text-text-primary hover:bg-brand/10 border border-brand/10'
              }`}
            >
              <span>{type.emoji}</span>
              <span>{type.label}</span>
            </button>
          ))}
        </div>

        {/* Toggle Buttons */}
        <div className="flex gap-2 p-1 bg-white rounded-2xl border border-brand/10">
          <button
            onClick={() => setIsCustom(false)}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              !isCustom
                ? 'bg-brand text-white shadow-lg shadow-brand'
                : 'text-gray-600 hover:bg-brand/10'
            }`}
          >
            Search Food
          </button>
          <button
            onClick={() => setIsCustom(true)}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              isCustom
                ? 'bg-brand text-white shadow-lg shadow-brand'
                : 'text-gray-600 hover:bg-brand/10'
            }`}
          >
            Custom Entry
          </button>
        </div>

        <AnimatePresence mode="wait">
          {!isCustom ? (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="space-y-6"
            >
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
                <input
                  type="text"
                  placeholder="Search foods..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setShowRecent(true)}
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border border-brand/20 bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <X className="w-5 h-5 text-text-muted" />
                  </button>
                )}
              </div>

              {/* Category Filter */}
              {searchQuery && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`flex-shrink-0 px-3 py-2 rounded-xl font-medium transition-all text-sm ${
                        selectedCategory === cat.id
                          ? 'bg-brand text-white'
                          : 'bg-white text-text-primary hover:bg-brand/10 border border-brand/10'
                      }`}
                    >
                      {cat.icon} {cat.nameEn}
                    </button>
                  ))}
                </div>
              )}

              {/* Search Results */}
              {isSearching ? (
                <div className="text-center py-12">
                  <div className="w-12 h-12 border-4 border-brand/20 border-t-brand rounded-full animate-spin mx-auto mb-4" />
                  <p className="text-text-secondary">Searching...</p>
                </div>
              ) : searchResults.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-text-secondary">Found {searchResults.length} foods</p>
                  {searchResults.map((food) => (
                    <motion.button
                      key={food.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => handleSelectFood(food)}
                      className="w-full card-brand p-4 text-left"
                    >
                      <div className="flex items-center gap-4">
                        {food.emoji && (
                          <span className="text-3xl">{food.emoji}</span>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-text-primary truncate">{food.name}</p>
                          <p className="text-sm text-text-secondary truncate">{food.nameEn}</p>
                          <p className="text-sm text-brand font-medium">
                            {food.nutrition.calories} kcal / {food.nutrition.servingSize}{food.nutrition.servingUnit}
                          </p>
                        </div>
                        <Plus className="w-5 h-5 text-brand flex-shrink-0" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : searchQuery.trim().length >= 2 ? (
                <div className="text-center py-12">
                  <p className="text-text-secondary">No foods found. Try a different search or add custom food.</p>
                </div>
              ) : showRecent && recentFoods.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm text-text-secondary">Recent Foods</p>
                  {recentFoods.map((food) => (
                    <motion.button
                      key={food.id}
                      whileHover={{ scale: 1.01 }}
                      onClick={() => handleSelectFood(food)}
                      className="w-full card-brand p-4 text-left"
                    >
                      <div className="flex items-center gap-4">
                        {food.emoji && <span className="text-3xl">{food.emoji}</span>}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-text-primary truncate">{food.name}</p>
                          <p className="text-sm text-brand font-medium">
                            {food.nutrition.calories} kcal / {food.nutrition.servingSize}{food.nutrition.servingUnit}
                          </p>
                        </div>
                        <Clock className="w-5 h-5 text-text-muted flex-shrink-0" />
                      </div>
                    </motion.button>
                  ))}
                </div>
              ) : null}

              {/* Selected Food Display */}
              {selectedFood && currentNutrition && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-brand p-6"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-heading text-xl font-bold text-text-primary">{selectedFood.name}</h2>
                    <button
                      onClick={() => setSelectedFood(null)}
                      className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center hover:bg-brand/20"
                    >
                      <X className="w-4 h-4 text-brand" />
                    </button>
                  </div>

                  {/* Nutrition Info */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
                      <p className="text-sm text-gray-500 mb-1">Calories</p>
                      <p className="text-2xl font-bold text-orange-600">
                        {Math.round(currentNutrition.calories)}
                      </p>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                      <p className="text-sm text-gray-500 mb-1">Serving</p>
                      <p className="text-2xl font-bold text-blue-600">
                        {Math.round(currentNutrition.servingSize)}{currentNutrition.servingUnit}
                      </p>
                    </div>
                  </div>

                  {/* Macros */}
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    <div className="text-center p-3 bg-teal-50 rounded-2xl border border-teal-100">
                      <p className="text-xs text-teal-700 font-medium mb-1">Protein</p>
                      <p className="text-lg font-bold text-teal-600">{Math.round(currentNutrition.protein)}g</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-2xl border border-orange-100">
                      <p className="text-xs text-orange-700 font-medium mb-1">Carbs</p>
                      <p className="text-lg font-bold text-orange-600">{Math.round(currentNutrition.carbs)}g</p>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-2xl border border-amber-100">
                      <p className="text-xs text-amber-700 font-medium mb-1">Fat</p>
                      <p className="text-lg font-bold text-amber-600">{Math.round(currentNutrition.fat)}g</p>
                    </div>
                  </div>

                  {/* Quantity Selector */}
                  <div className="flex items-center justify-center gap-6">
                    <button
                      onClick={() => adjustQuantity(-0.25)}
                      className="w-12 h-12 rounded-full bg-white border-2 border-brand/10 flex items-center justify-center hover:bg-brand/10 hover:border-brand/20 transition-all"
                    >
                      <Minus className="w-5 h-5 text-brand" />
                    </button>
                    <div className="text-center min-w-[100px]">
                      <p className="text-4xl font-bold text-text-primary">{quantity}</p>
                      <p className="text-sm text-text-secondary">servings</p>
                    </div>
                    <button
                      onClick={() => adjustQuantity(0.25)}
                      className="w-12 h-12 rounded-full bg-white border-2 border-brand/10 flex items-center justify-center hover:bg-brand/10 hover:border-brand/20 transition-all"
                    >
                      <Plus className="w-5 h-5 text-brand" />
                    </button>
                  </div>
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="custom"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="card-brand p-6">
                <h2 className="font-heading text-xl font-bold text-gray-800 mb-6 text-center">
                  Custom Food Entry
                </h2>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Food Name</label>
                    <input
                      type="text"
                      placeholder="e.g., Homemade Smoothie"
                      value={customFood.name}
                      onChange={(e) => setCustomFood({ ...customFood, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-brand/20 bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Calories</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={customFood.calories}
                        onChange={(e) => setCustomFood({ ...customFood, calories: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-brand/20 bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Serving (g)</label>
                      <input
                        type="number"
                        placeholder="100"
                        value={customFood.servingSize}
                        onChange={(e) => setCustomFood({ ...customFood, servingSize: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-brand/20 bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Protein (g)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={customFood.protein}
                        onChange={(e) => setCustomFood({ ...customFood, protein: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-brand/20 bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Carbs (g)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={customFood.carbs}
                        onChange={(e) => setCustomFood({ ...customFood, carbs: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-brand/20 bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Fat (g)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={customFood.fat}
                        onChange={(e) => setCustomFood({ ...customFood, fat: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-brand/20 bg-white text-text-primary focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Custom Food Preview */}
              {customFood.name && currentNutrition && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-brand p-6"
                >
                  <h3 className="font-semibold text-text-primary mb-4">Preview</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 bg-teal-50 rounded-2xl border border-teal-100">
                      <p className="text-xs text-teal-700 font-medium mb-1">Protein</p>
                      <p className="text-lg font-bold text-teal-600">{customFood.protein || 0}g</p>
                    </div>
                    <div className="text-center p-3 bg-orange-50 rounded-2xl border border-orange-100">
                      <p className="text-xs text-orange-700 font-medium mb-1">Carbs</p>
                      <p className="text-lg font-bold text-orange-600">{customFood.carbs || 0}g</p>
                    </div>
                    <div className="text-center p-3 bg-amber-50 rounded-2xl border border-amber-100">
                      <p className="text-xs text-amber-700 font-medium mb-1">Fat</p>
                      <p className="text-lg font-bold text-amber-600">{customFood.fat || 0}g</p>
                    </div>
                  </div>
                  <div className="mt-4 text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
                    <p className="text-sm text-gray-500 mb-1">Total Calories</p>
                    <p className="text-2xl font-bold text-orange-600">{customFood.calories || 0} kcal</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-brand/10 p-4 z-20">
        <div className="max-w-md mx-auto flex gap-3">
          <button
            onClick={handleSaveAsFavorite}
            className="flex-1 py-4 px-4 rounded-2xl border-2 border-brand/10 text-brand font-semibold hover:bg-brand/10 transition-all text-sm"
          >
            Save as Favorite
          </button>
          <button
            onClick={handleAddToDiary}
            disabled={!selectedFood && !customFood.name}
            className="flex-1 btn-brand flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Check className="w-5 h-5" />
            Add to Diary
          </button>
        </div>
      </div>
    </div>
  );
}
