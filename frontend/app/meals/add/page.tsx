'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Check, Camera, Search } from 'lucide-react';
import { toast } from 'sonner';

const recentFoods = [
  { name: 'Oatmeal with Berries', calories: 300, protein: 12, carbs: 45, fat: 8, emoji: '🥣' },
  { name: 'Grilled Chicken Salad', calories: 450, protein: 35, carbs: 20, fat: 25, emoji: '🥗' },
  { name: 'Greek Yogurt', calories: 150, protein: 15, carbs: 12, fat: 5, emoji: '🥛' },
  { name: 'Salmon with Vegetables', calories: 520, protein: 40, carbs: 18, fat: 30, emoji: '🐟' },
];

export default function AddFoodPage() {
  const [quantity, setQuantity] = useState(1);
  const [isCustom, setIsCustom] = useState(false);
  const [customFood, setCustomFood] = useState({
    name: '',
    calories: '',
    servingSize: '',
    protein: '',
    carbs: '',
    fat: '',
  });

  const selectedFood = {
    name: 'Grilled Chicken Breast',
    calories: 165,
    protein: 31,
    carbs: 0,
    fat: 3.6,
    emoji: '🍗',
  };

  const adjustQuantity = (delta: number) => {
    setQuantity(Math.max(0.5, Math.min(10, quantity + delta)));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-amber-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-lg border-b border-green-100">
        <div className="max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/meals">
            <button className="w-10 h-10 rounded-full bg-white border border-green-200 flex items-center justify-center hover:bg-green-50 transition-all">
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
          </Link>
          <h1 className="heading-font text-xl font-bold">Add Food</h1>
          <div className="flex gap-2">
            <button className="w-10 h-10 rounded-full bg-white border border-green-200 flex items-center justify-center hover:bg-green-50 transition-all">
              <Camera className="w-5 h-5 text-gray-600" />
            </button>
            <button className="w-10 h-10 rounded-full bg-white border border-green-200 flex items-center justify-center hover:bg-green-50 transition-all">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6 pb-32">
        {/* Toggle Buttons */}
        <div className="flex gap-2 p-1 bg-white rounded-2xl border border-green-100">
          <button
            onClick={() => setIsCustom(false)}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              !isCustom
                ? 'bg-primary text-white shadow-lg shadow-green-200'
                : 'text-gray-600 hover:bg-green-50'
            }`}
          >
            Search Food
          </button>
          <button
            onClick={() => setIsCustom(true)}
            className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all ${
              isCustom
                ? 'bg-primary text-white shadow-lg shadow-green-200'
                : 'text-gray-600 hover:bg-green-50'
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
              {/* Food Card */}
              <div className="wellness-card p-6">
                <div className="text-center mb-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-green-100 to-teal-100 flex items-center justify-center mx-auto mb-4">
                    <span className="text-5xl">{selectedFood.emoji}</span>
                  </div>
                  <h2 className="heading-font text-2xl font-bold text-gray-800">{selectedFood.name}</h2>
                  <p className="text-gray-500">Per 100g serving</p>
                </div>

                {/* Nutrition Info */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-amber-50 rounded-2xl border border-orange-100">
                    <p className="text-sm text-gray-500 mb-1">Calories</p>
                    <p className="text-2xl font-bold text-orange-600">
                      {Math.round(selectedFood.calories * quantity)}
                    </p>
                  </div>
                  <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
                    <p className="text-sm text-gray-500 mb-1">Serving</p>
                    <p className="text-2xl font-bold text-blue-600">{Math.round(100 * quantity)}g</p>
                  </div>
                </div>

                {/* Macros */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="text-center p-3 bg-teal-50 rounded-2xl border border-teal-100">
                    <p className="text-xs text-teal-700 font-medium mb-1">Protein</p>
                    <p className="text-lg font-bold text-teal-600">
                      {Math.round(selectedFood.protein * quantity)}g
                    </p>
                  </div>
                  <div className="text-center p-3 bg-orange-50 rounded-2xl border border-orange-100">
                    <p className="text-xs text-orange-700 font-medium mb-1">Carbs</p>
                    <p className="text-lg font-bold text-orange-600">
                      {Math.round(selectedFood.carbs * quantity)}g
                    </p>
                  </div>
                  <div className="text-center p-3 bg-amber-50 rounded-2xl border border-amber-100">
                    <p className="text-xs text-amber-700 font-medium mb-1">Fat</p>
                    <p className="text-lg font-bold text-amber-600">
                      {Math.round(selectedFood.fat * quantity)}g
                    </p>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-center gap-6">
                  <button
                    onClick={() => adjustQuantity(-0.5)}
                    className="w-12 h-12 rounded-full bg-white border-2 border-green-200 flex items-center justify-center hover:bg-green-50 hover:border-green-300 transition-all"
                  >
                    <Minus className="w-5 h-5 text-green-600" />
                  </button>
                  <div className="text-center min-w-[100px]">
                    <p className="text-4xl font-bold text-gray-800">{quantity}</p>
                    <p className="text-sm text-gray-500">servings</p>
                  </div>
                  <button
                    onClick={() => adjustQuantity(0.5)}
                    className="w-12 h-12 rounded-full bg-white border-2 border-green-200 flex items-center justify-center hover:bg-green-50 hover:border-green-300 transition-all"
                  >
                    <Plus className="w-5 h-5 text-green-600" />
                  </button>
                </div>
              </div>

              {/* Recent Foods */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h3 className="font-semibold text-gray-700 mb-4">Recent & Quick Add</h3>
                <div className="space-y-3">
                  {recentFoods.map((food, index) => (
                    <motion.div
                      key={food.name}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="food-card cursor-pointer"
                      onClick={() => toast.info(`Selected: ${food.name}`)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{food.emoji}</div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-800">{food.name}</p>
                          <p className="text-sm text-gray-500">{food.calories} kcal</p>
                        </div>
                        <button className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center hover:bg-green-200 transition-all">
                          <Plus className="w-5 h-5 text-green-600" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Quick Tags */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <h3 className="font-semibold text-gray-700 mb-4">Quick Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {['Proteins', 'Vegetables', 'Fruits', 'Grains', 'Dairy', 'Snacks'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toast.info(`Filtering by: ${tag}`)}
                      className="px-4 py-2 rounded-full bg-white border border-green-200 text-sm font-medium text-green-700 hover:bg-green-50 hover:border-green-300 transition-all"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="custom"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <div className="wellness-card p-6">
                <h2 className="heading-font text-xl font-bold text-gray-800 mb-6 text-center">
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
                      className="wellness-input"
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
                        className="wellness-input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Serving (g)</label>
                      <input
                        type="number"
                        placeholder="100"
                        value={customFood.servingSize}
                        onChange={(e) => setCustomFood({ ...customFood, servingSize: e.target.value })}
                        className="wellness-input"
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
                        className="wellness-input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Carbs (g)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={customFood.carbs}
                        onChange={(e) => setCustomFood({ ...customFood, carbs: e.target.value })}
                        className="wellness-input"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">Fat (g)</label>
                      <input
                        type="number"
                        placeholder="0"
                        value={customFood.fat}
                        onChange={(e) => setCustomFood({ ...customFood, fat: e.target.value })}
                        className="wellness-input"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-green-100 p-4 z-20">
        <div className="max-w-md mx-auto flex gap-3">
          <button
            onClick={() => toast.info('Saved to favorites!')}
            className="flex-1 py-4 px-6 rounded-2xl border-2 border-green-200 text-green-700 font-semibold hover:bg-green-50 transition-all"
          >
            Save as Favorite
          </button>
          <Link href="/meals" className="flex-1">
            <button className="btn-vitality w-full flex items-center justify-center gap-2">
              <Check className="w-5 h-5" />
              Add to Diary
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
