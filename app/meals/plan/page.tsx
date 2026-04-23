'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Plus,
  Coffee,
  Sun,
  Moon,
  Cookie,
  Trash2,
  Copy,
  UtensilsCrossed,
} from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar } from '@/components/ui/calendar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  ConfirmDialog,
  ConfirmDialogTrigger,
  ConfirmDialogContent,
  ConfirmDialogHeader,
  ConfirmDialogTitle,
  ConfirmDialogDescription,
  ConfirmDialogFooter,
  ConfirmDialogCancel,
  ConfirmDialogAction,
} from '@/components/ui/confirm-dialog';
import { fadeIn, fadeInUp, staggerContainer } from '@/lib/motion-variants';
import { searchFoods as searchFoodsApi, getThaiFood, type FoodItem } from '@/lib/thai-food-api';
import { t } from '@/lib/translations';
import { useLanguage } from '@/contexts/LanguageContext';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

interface PlannedMeal {
  id: number;
  date: string;
  mealType: MealType;
  food: FoodItem;
}

const mealTypeIcons = {
  breakfast: Coffee,
  lunch: Sun,
  dinner: Moon,
  snack: Cookie,
};

const mealTypeColors = {
  breakfast: 'bg-orange-500/10 text-orange-600',
  lunch: 'bg-yellow-500/10 text-yellow-600',
  dinner: 'bg-indigo-500/10 text-indigo-600',
  snack: 'bg-pink-500/10 text-pink-600',
};

export default function MealPlanPage() {
  const router = useRouter();
  const { language } = useLanguage();
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [plannedMeals, setPlannedMeals] = useState<PlannedMeal[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedMealType, setSelectedMealType] = useState<MealType>('breakfast');
  const [searchQuery, setSearchQuery] = useState('');
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load meal plans from localStorage
  useEffect(() => {
    const loadMealPlans = () => {
      try {
        const stored = localStorage.getItem('mealPlans');
        if (stored) {
          setPlannedMeals(JSON.parse(stored));
        } else {
          // Default meal plans for demo
          const today = new Date();
          const defaultPlans: PlannedMeal[] = [
            {
              id: 1,
              date: formatDate(today),
              mealType: 'breakfast',
              food: {
                id: 'food-1',
                name: language === 'th' ? 'โจ๊กข้าวโอ๊ต' : 'Oatmeal Porridge',
                nameEn: 'Oatmeal Porridge',
                category: language === 'th' ? 'อาหารเช้า' : 'Breakfast',
                calories: 300,
                protein: 12,
                carbs: 45,
                fat: 8,
                servingSize: 100,
                emoji: '🥣',
              },
            },
            {
              id: 2,
              date: formatDate(today),
              mealType: 'lunch',
              food: {
                id: 'food-2',
                name: language === 'th' ? 'สลัดอกไก่' : 'Chicken Salad',
                nameEn: 'Chicken Salad',
                category: language === 'th' ? 'อาหารมังสวิรัติ' : 'Salads',
                calories: 450,
                protein: 35,
                carbs: 20,
                fat: 25,
                servingSize: 100,
                emoji: '🥗',
              },
            },
          ];
          setPlannedMeals(defaultPlans);
          localStorage.setItem('mealPlans', JSON.stringify(defaultPlans));
        }
      } catch (error) {
        console.error('Error loading meal plans:', error);
      }
    };

    loadMealPlans();
  }, [language]);

  // Search for foods
  useEffect(() => {
    const loadFoodItems = async () => {
      if (searchQuery && searchQuery.length >= 2) {
        setIsLoading(true);
        try {
          const results = await searchFoodsApi(searchQuery);
          setFoodItems(results);
        } catch (error) {
          console.error('Failed to load food items:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        const items = await getThaiFood();
        setFoodItems(items.slice(0, 10));
      }
    };

    loadFoodItems();
  }, [searchQuery]);

  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0];
  };

  const getMealsForDate = (date: Date): PlannedMeal[] => {
    const dateStr = formatDate(date);
    return plannedMeals.filter((meal) => meal.date === dateStr);
  };

  const getTotalCaloriesForDate = (date: Date): number => {
    const meals = getMealsForDate(date);
    return meals.reduce((sum, meal) => sum + meal.food.calories, 0);
  };

  const hasMealsOnDate = (date: Date): boolean => {
    return getMealsForDate(date).length > 0;
  };

  const handleAddMeal = (food: FoodItem) => {
    const newMeal: PlannedMeal = {
      id: Date.now(),
      date: formatDate(selectedDate),
      mealType: selectedMealType,
      food,
    };

    const updatedPlans = [...plannedMeals, newMeal];
    setPlannedMeals(updatedPlans);
    localStorage.setItem('mealPlans', JSON.stringify(updatedPlans));

    const mealLabel = mealTypeLabels[selectedMealType];
    toast.success(
      language === 'th'
        ? `เพิ่ม ${food.name} ลงใน ${mealLabel}`
        : `Added ${food.name} to ${mealLabel}`
    );

    setSearchQuery('');
  };

  const handleDeleteMeal = (mealId: number) => {
    const updatedPlans = plannedMeals.filter((meal) => meal.id !== mealId);
    setPlannedMeals(updatedPlans);
    localStorage.setItem('mealPlans', JSON.stringify(updatedPlans));
    toast.success(language === 'th' ? 'ลบมื้ออาหารแล้ว' : 'Meal removed');
  };

  const handleCopyDay = () => {
    const currentMeals = getMealsForDate(selectedDate);
    if (currentMeals.length === 0) {
      toast.error(
        language === 'th'
          ? 'ไม่มีมื้ออาหารให้คัดลอก'
          : 'No meals to copy'
      );
      return;
    }

    const nextDay = new Date(selectedDate);
    nextDay.setDate(nextDay.getDate() + 1);

    const newMeals: PlannedMeal[] = currentMeals.map((meal) => ({
      ...meal,
      id: Date.now() + Math.random(),
      date: formatDate(nextDay),
    }));

    const updatedPlans = [...plannedMeals, ...newMeals];
    setPlannedMeals(updatedPlans);
    localStorage.setItem('mealPlans', JSON.stringify(updatedPlans));

    const locale = language === 'th' ? 'th-TH' : 'en-US';
    toast.success(
      language === 'th'
        ? `คัดลอกมื้ออาหารไปยัง ${nextDay.toLocaleDateString(locale)}`
        : `Copied meals to ${nextDay.toLocaleDateString(locale)}`
    );
  };

  const mealTypeLabels: Record<MealType, string> = {
    breakfast: language === 'th' ? 'อาหารเช้า' : 'Breakfast',
    lunch: language === 'th' ? 'อาหารกลางวัน' : 'Lunch',
    dinner: language === 'th' ? 'อาหารเย็น' : 'Dinner',
    snack: language === 'th' ? 'ของว่าง' : 'Snack',
  };

  const mealsForSelectedDate = getMealsForDate(selectedDate);
  const totalCalories = getTotalCaloriesForDate(selectedDate);

  return (
    <motion.div
      className="min-h-screen bg-background p-6 lg:p-8"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div className="flex items-center gap-4 mb-8" variants={fadeInUp}>
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard')}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{t('mealPlan_title_i18n', language)}</h1>
            <p className="text-muted-foreground text-sm">
              {t('mealPlan_description_i18n', language)}
            </p>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <motion.div className="lg:col-span-1" variants={fadeInUp}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">
                    {currentMonth.toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', {
                      month: 'long',
                      year: 'numeric',
                    })}
                  </CardTitle>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newMonth = new Date(currentMonth);
                        newMonth.setMonth(newMonth.getMonth() - 1);
                        setCurrentMonth(newMonth);
                      }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newMonth = new Date(currentMonth);
                        newMonth.setMonth(newMonth.getMonth() + 1);
                        setCurrentMonth(newMonth);
                      }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(date) => date && setSelectedDate(date)}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  className="rounded-md border"
                  modifiers={{
                    hasMeals: (date) => hasMealsOnDate(date),
                  }}
                  modifiersStyles={{
                    hasMeals: {
                      backgroundColor: 'hsl(var(--primary) / 0.1)',
                      fontWeight: 'bold',
                    },
                  }}
                />
                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <div className="w-3 h-3 rounded bg-primary/20" />
                  <span>{language === 'th' ? 'มีแผนอาหาร' : 'Has meal plan'}</span>
                </div>
              </CardContent>
            </Card>

            {/* Daily Summary */}
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">
                  {language === 'th' ? 'สรุปวันนี้' : 'Today\'s Summary'}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-3xl font-bold text-primary">{totalCalories}</p>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('dashboard_kcal_i18n', language)}
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((type) => {
                      const Icon = mealTypeIcons[type];
                      const count = mealsForSelectedDate.filter((m) => m.mealType === type).length;
                      return (
                        <div
                          key={type}
                          className={`text-center p-2 rounded-lg ${
                            count > 0 ? mealTypeColors[type] : 'bg-muted/50'
                          }`}
                        >
                          <Icon className="w-4 h-4 mx-auto mb-1" />
                          <p className="text-xs">{count}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Meal Details */}
          <motion.div className="lg:col-span-2 space-y-4" variants={staggerContainer}>
            {/* Date Header */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">
                      {selectedDate.toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {mealsForSelectedDate.length} {language === 'th' ? 'มื้ออาหาร' : 'meals planned'}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyDay}>
                      <Copy className="w-4 h-4 mr-2" />
                      {language === 'th' ? 'คัดลอก' : 'Copy'}
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          {language === 'th' ? 'เพิ่มมื้ออาหาร' : 'Add Meal'}
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md">
                        <DialogHeader>
                          <DialogTitle>
                            {language === 'th' ? 'เพิ่มมื้ออาหาร' : 'Add Meal to Plan'}
                          </DialogTitle>
                          <DialogDescription>
                            {language === 'th'
                              ? 'เลือกมื้ออาหารและอาหารที่ต้องการเพิ่ม'
                              : 'Select meal type and food to add'}
                          </DialogDescription>
                        </DialogHeader>

                        <div className="space-y-4 py-4">
                          {/* Meal Type Selection */}
                          <div>
                            <label className="text-sm font-medium mb-2 block">
                              {language === 'th' ? 'เลือกมื้ออาหาร' : 'Meal Type'}
                            </label>
                            <Tabs value={selectedMealType} onValueChange={(v) => setSelectedMealType(v as MealType)}>
                              <TabsList className="grid grid-cols-4 w-full">
                                {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((type) => {
                                  const Icon = mealTypeIcons[type];
                                  return (
                                    <TabsTrigger key={type} value={type} className="flex flex-col gap-1 py-2">
                                      <Icon className="w-4 h-4" />
                                      <span className="text-xs">{mealTypeLabels[type]}</span>
                                    </TabsTrigger>
                                  );
                                })}
                              </TabsList>
                            </Tabs>
                          </div>

                          {/* Food Search */}
                          <div>
                            <label className="text-sm font-medium mb-2 block">
                              {language === 'th' ? 'ค้นหาอาหาร' : 'Search Food'}
                            </label>
                            <input
                              type="text"
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              placeholder={language === 'th' ? 'ค้นหาอาหาร...' : 'Search foods...'}
                              className="w-full px-3 py-2 border rounded-md bg-background"
                            />
                          </div>

                          {/* Food List */}
                          <div className="max-h-64 overflow-y-auto space-y-2">
                            {isLoading ? (
                              <div className="text-center py-4 text-muted-foreground">
                                {language === 'th' ? 'กำลังโหลด...' : 'Loading...'}
                              </div>
                            ) : foodItems.length === 0 ? (
                              <div className="text-center py-4 text-muted-foreground">
                                {language === 'th' ? 'ไม่พบอาหาร' : 'No foods found'}
                              </div>
                            ) : (
                              foodItems.map((food) => (
                                <div
                                  key={food.id}
                                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                                  onClick={() => {
                                    handleAddMeal(food);
                                    setIsAddDialogOpen(false);
                                  }}
                                >
                                  <div className="flex items-center gap-3">
                                    <span className="text-2xl">{food.emoji || '🍽️'}</span>
                                    <div>
                                      <p className="font-medium text-sm">{food.name}</p>
                                      <p className="text-xs text-muted-foreground">{food.calories} kcal</p>
                                    </div>
                                  </div>
                                  <Plus className="w-4 h-4 text-primary" />
                                </div>
                              ))
                            )}
                          </div>
                        </div>

                        <DialogFooter>
                          <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                            {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meals List */}
            <AnimatePresence mode="wait">
              {mealsForSelectedDate.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Card>
                    <CardContent className="p-12 text-center">
                      <UtensilsCrossed className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
                      <h3 className="text-lg font-semibold mb-2">
                        {language === 'th' ? 'ยังไม่มีแผนอาหาร' : 'No meals planned'}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {language === 'th'
                          ? 'เริ่มวางแผนมื้ออาหารของคุณ'
                          : 'Start planning your meals for this day'}
                      </p>
                      <Button onClick={() => setIsAddDialogOpen(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        {language === 'th' ? 'เพิ่มมื้ออาหาร' : 'Add First Meal'}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  key="meals"
                  className="space-y-4"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0 }}
                >
                  {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map((mealType) => {
                    const meals = mealsForSelectedDate.filter((m) => m.mealType === mealType);
                    if (meals.length === 0) return null;

                    const Icon = mealTypeIcons[mealType];

                    return (
                      <motion.div key={mealType} variants={fadeInUp}>
                        <Card>
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-2">
                              <div className={`p-2 rounded-lg ${mealTypeColors[mealType]}`}>
                                <Icon className="w-4 h-4" />
                              </div>
                              <CardTitle className="text-lg">{mealTypeLabels[mealType]}</CardTitle>
                              <Badge variant="secondary" className="ml-auto">
                                {meals.reduce((sum, m) => sum + m.food.calories, 0)} {t('dashboard_kcal_i18n', language)}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-2">
                            {meals.map((meal) => (
                              <div
                                key={meal.id}
                                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                              >
                                <div className="flex items-center gap-3">
                                  <span className="text-xl">{meal.food.emoji || '🍽️'}</span>
                                  <div>
                                    <p className="font-medium text-sm">{meal.food.name}</p>
                                    <p className="text-xs text-muted-foreground">
                                      {meal.food.calories} kcal
                                      {' • '}
                                      {language === 'th' ? 'โปรตีน' : 'Protein'}: {meal.food.protein}g
                                      {' • '}
                                      {t('dashboard_carbs_i18n', language)}: {meal.food.carbs}g
                                      {' • '}
                                      {t('dashboard_fat_i18n', language)}: {meal.food.fat}g
                                    </p>
                                  </div>
                                </div>
                                <ConfirmDialog>
                                  <ConfirmDialogTrigger asChild>
                                    <Button variant="ghost" size="icon">
                                      <Trash2 className="w-4 h-4 text-destructive" />
                                    </Button>
                                  </ConfirmDialogTrigger>
                                  <ConfirmDialogContent>
                                    <ConfirmDialogHeader>
                                      <ConfirmDialogTitle>
                                        {language === 'th' ? 'ลบมื้ออาหาร' : 'Remove Meal'}
                                      </ConfirmDialogTitle>
                                      <ConfirmDialogDescription>
                                        {language === 'th'
                                          ? 'คุณแน่ใจหรือไม่ที่จะลบมื้ออาหารนี้?'
                                          : 'Are you sure you want to remove this meal?'}
                                      </ConfirmDialogDescription>
                                    </ConfirmDialogHeader>
                                    <ConfirmDialogFooter>
                                      <ConfirmDialogCancel>
                                        {language === 'th' ? 'ยกเลิก' : 'Cancel'}
                                      </ConfirmDialogCancel>
                                      <ConfirmDialogAction
                                        onClick={() => handleDeleteMeal(meal.id)}
                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                      >
                                        {language === 'th' ? 'ลบ' : 'Remove'}
                                      </ConfirmDialogAction>
                                    </ConfirmDialogFooter>
                                  </ConfirmDialogContent>
                                </ConfirmDialog>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </motion.div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
