'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, Plus, Coffee, Sun, Moon, Cookie, Search, Calendar, Trash2, UtensilsCrossed } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/modern-card';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/modern-input';
import { EmptyState } from '@/components/ui/empty-state';
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
import { searchFoods as searchFoodsApi, getThaiFood, type FoodItem } from '@/lib/thai-food-api';
import { fadeIn, slideUp, staggerContainer } from '@/lib/motion-variants';
import { t } from '@/lib/translations';
import { useLanguage } from '@/contexts/LanguageContext';

const buttonTap = {
  tap: { scale: 0.95 },
};

interface DiaryEntry {
  id: number;
  name: string;
  nameEn: string;
  calories: number;
  mealType: string;
  protein: number;
  carbs: number;
  fat: number;
  timestamp: Date;
}

export default function MealsPage() {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('recently');
  const [mealType, setMealType] = useState('lunch');
  const [searchQuery, setSearchQuery] = useState('');
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dailyStats, setDailyStats] = useState({
    consumed: 1425,
    goal: 2000,
    carbs: { consumed: 142, goal: 250 },
    protein: { consumed: 85, goal: 150 },
    fat: { consumed: 47, goal: 67 },
  });

  useEffect(() => {
    const loadFoodItems = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (searchQuery && searchQuery.length >= 2) {
          // Use API search for queries (combines local Thai food + Open Food Facts)
          const results = await searchFoodsApi(searchQuery);
          setFoodItems(results);
        } else {
          // Show local Thai foods by default
          const items = await getThaiFood();
          setFoodItems(items.slice(0, 15));
        }
      } catch (err) {
        console.error('Failed to load food items:', err);
        setError(t('meals_failedToLoad_i18n', language));
        toast.error(t('meals_failedToLoad_i18n', language));
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search to avoid too many API calls
    const timeoutId = setTimeout(loadFoodItems, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, activeTab, language]);

  const addFoodItem = (food: FoodItem) => {
    const newEntry: DiaryEntry = {
      id: Date.now(),
      name: food.name,
      nameEn: food.nameEn,
      calories: food.calories,
      mealType: mealType,
      protein: food.protein,
      carbs: food.carbs,
      fat: food.fat,
      timestamp: new Date(),
    };

    setDiaryEntries((prev) => [...prev, newEntry]);

    setDailyStats((prev) => ({
      ...prev,
      consumed: prev.consumed + food.calories,
      carbs: { ...prev.carbs, consumed: prev.carbs.consumed + food.carbs },
      protein: { ...prev.protein, consumed: prev.protein.consumed + food.protein },
      fat: { ...prev.fat, consumed: prev.fat.consumed + food.fat },
    }));

    const mealLabel = mealTypeLabels[mealType as keyof typeof mealTypeLabels];
    toast.success(`${t('meals_addedTo_i18n', language)} ${mealLabel}: ${food.name}`);
  };

  const removeEntry = (entryId: number) => {
    const entry = diaryEntries.find((e) => e.id === entryId);
    if (entry) {
      setDiaryEntries((prev) => prev.filter((e) => e.id !== entryId));
      setDailyStats((prev) => ({
        ...prev,
        consumed: prev.consumed - entry.calories,
        carbs: { ...prev.carbs, consumed: Math.max(0, prev.carbs.consumed - entry.carbs) },
        protein: { ...prev.protein, consumed: Math.max(0, prev.protein.consumed - entry.protein) },
        fat: { ...prev.fat, consumed: Math.max(0, prev.fat.consumed - entry.fat) },
      }));
      toast.success(t('meals_entryRemoved_i18n', language));
    }
  };

  const calorieProgress = (dailyStats.consumed / dailyStats.goal) * 100;
  const carbProgress = (dailyStats.carbs.consumed / dailyStats.carbs.goal) * 100;
  const proteinProgress = (dailyStats.protein.consumed / dailyStats.protein.goal) * 100;
  const fatProgress = (dailyStats.fat.consumed / dailyStats.fat.goal) * 100;

  const mealTypeIcons = {
    breakfast: Coffee,
    lunch: Sun,
    dinner: Moon,
    snack: Cookie,
  };

  const mealTypeLabels = {
    breakfast: t('meals_addToBreakfast_i18n', language).replace('Add to ', '').replace('เพิ่มใน', ''),
    lunch: t('meals_addToLunch_i18n', language).replace('Add to ', '').replace('เพิ่มใน', ''),
    dinner: t('meals_addToDinner_i18n', language).replace('Add to ', '').replace('เพิ่มใน', ''),
    snack: t('meals_addToSnack_i18n', language).replace('Add to ', '').replace('เพิ่มใน', ''),
  };

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-background via-background to-muted/10"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="max-w-md mx-auto p-6">
        {/* Header */}
        <motion.div className="flex items-center justify-between mb-8" variants={slideUp}>
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="apple-card-interactive">
              <ArrowLeft size={20} aria-hidden="true" />
              <span className="sr-only">Back to dashboard</span>
            </Button>
          </Link>
          <h1 className="spotify-text-heading">{t('meals_foodDiary_i18n', language)}</h1>
          <Button variant="ghost" size="icon" className="apple-card-interactive">
            <Calendar size={20} aria-hidden="true" />
            <span className="sr-only">View calendar</span>
          </Button>
        </motion.div>

        {/* Search Bar */}
        <motion.div variants={slideUp} className="mb-6">
          <Input
            placeholder={t('meals_searchPlaceholder_i18n', language)}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            leftIcon={<Search className="w-4 h-4" />}
            variant="glass"
            className="bg-background/50"
            aria-label="Search for foods"
          />
        </motion.div>

        {/* Daily Intake Card */}
        <motion.div variants={slideUp} className="mb-8">
          <Card variant="glass" className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="spotify-text-subheading">{t('meals_dailyGoal_i18n', language)}</h2>
              <span className="text-sm text-muted-foreground">{new Date().toLocaleDateString(language === 'th' ? 'th-TH' : 'en-US')}</span>
            </div>
            <div className="relative mb-4">
              <Progress value={calorieProgress} className="h-3 spotify-backdrop border border-border/20" />
              <motion.div
                className="absolute top-0 left-0 h-3 bg-gradient-to-r from-primary via-primary/80 to-primary/60 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(calorieProgress, 100)}%` }}
                transition={{ duration: 0.5 }}
              />
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-medium">{dailyStats.consumed} kcal</span>
              <span className="text-muted-foreground">{dailyStats.goal} kcal {t('meals_dailyGoal_i18n', language).toLowerCase()}</span>
            </div>
          </Card>
        </motion.div>

        {/* Macros */}
        <motion.div className="grid grid-cols-3 gap-4 mb-8" variants={staggerContainer}>
          <motion.div variants={slideUp}>
            <Card variant="minimal" className="p-4 text-center">
              <p className="spotify-text-small font-medium mb-2 text-orange-600">{t('dashboard_carbs_i18n', language)}</p>
              <div className="relative mb-2">
                <Progress value={carbProgress} className="h-2" />
              </div>
              <p className="spotify-text-small text-muted-foreground">
                {dailyStats.carbs.consumed}g/{dailyStats.carbs.goal}g
              </p>
            </Card>
          </motion.div>
          <motion.div variants={slideUp}>
            <Card variant="minimal" className="p-4 text-center">
              <p className="spotify-text-small font-medium mb-2 text-blue-600">{t('dashboard_protein_i18n', language)}</p>
              <div className="relative mb-2">
                <Progress value={proteinProgress} className="h-2" />
              </div>
              <p className="spotify-text-small text-muted-foreground">
                {dailyStats.protein.consumed}g/{dailyStats.protein.goal}g
              </p>
            </Card>
          </motion.div>
          <motion.div variants={slideUp}>
            <Card variant="minimal" className="p-4 text-center">
              <p className="spotify-text-small font-medium mb-2 text-green-600">{t('dashboard_fat_i18n', language)}</p>
              <div className="relative mb-2">
                <Progress value={fatProgress} className="h-2" />
              </div>
              <p className="spotify-text-small text-muted-foreground">
                {dailyStats.fat.consumed}g/{dailyStats.fat.goal}g
              </p>
            </Card>
          </motion.div>
        </motion.div>

        {/* Meal Types */}
        <motion.div className="grid grid-cols-4 gap-2 mb-8" variants={staggerContainer}>
          {Object.entries(mealTypeIcons).map(([type, Icon]) => (
            <motion.div key={type} variants={slideUp} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Button
                variant={mealType === type ? 'primary' : 'glass'}
                size="sm"
                className="w-full flex flex-col gap-1 h-16"
                onClick={() => setMealType(type)}
                aria-pressed={mealType === type}
              >
                <Icon className="w-4 h-4" aria-hidden="true" />
                <span className="text-xs">{mealTypeLabels[type as keyof typeof mealTypeLabels]}</span>
              </Button>
            </motion.div>
          ))}
        </motion.div>

        {/* Today's Meals Section */}
        <motion.div variants={slideUp} className="mb-8">
          <Card variant="glass" className="p-4">
            <h3 className="spotify-text-subheading mb-4">{t('meals_todayEntries_i18n', language)}</h3>
            <AnimatePresence mode="wait">
              {diaryEntries.length > 0 ? (
                <motion.div
                  key="entries"
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {diaryEntries.map((entry) => (
                    <motion.div
                      key={entry.id}
                      className="flex items-center justify-between p-3 bg-background/30 rounded-xl"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      layout
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-primary" aria-hidden="true" />
                        <div>
                          <p className="font-medium text-sm">{entry.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {entry.mealType} • {entry.calories} kcal
                          </p>
                        </div>
                      </div>
                      <ConfirmDialog>
                        <ConfirmDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                            aria-label={`Delete ${entry.name}`}
                          >
                            <Trash2 className="w-4 h-4" aria-hidden="true" />
                          </Button>
                        </ConfirmDialogTrigger>
                        <ConfirmDialogContent>
                          <ConfirmDialogHeader>
                            <ConfirmDialogTitle>{t('confirm_deleteTitle_i18n', language)}</ConfirmDialogTitle>
                            <ConfirmDialogDescription>
                              {t('confirm_deleteDescription_i18n', language)}
                            </ConfirmDialogDescription>
                          </ConfirmDialogHeader>
                          <ConfirmDialogFooter>
                            <ConfirmDialogCancel>{t('confirm_cancel_i18n', language)}</ConfirmDialogCancel>
                            <ConfirmDialogAction
                              onClick={() => removeEntry(entry.id)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              {t('confirm_delete_i18n', language)}
                            </ConfirmDialogAction>
                          </ConfirmDialogFooter>
                        </ConfirmDialogContent>
                      </ConfirmDialog>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <EmptyState
                    icon={UtensilsCrossed}
                    title={t('meals_noEntries_i18n', language)}
                    description={t('meals_addFirstMeal_i18n', language)}
                    variant="minimal"
                    className="py-8"
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>

        {/* Tabs */}
        <motion.div variants={slideUp} className="mb-6">
          <Tabs defaultValue="recently" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 bg-transparent">
              <TabsTrigger
                value="recently"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary bg-transparent"
              >
                {t('meals_recently_i18n', language)}
              </TabsTrigger>
              <TabsTrigger
                value="liked"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary bg-transparent"
              >
                {t('meals_favorites_i18n', language)}
              </TabsTrigger>
              <TabsTrigger
                value="popular"
                className="data-[state=active]:border-b-2 data-[state=active]:border-primary bg-transparent"
              >
                {t('meals_all_i18n', language)}
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        {/* Food List */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="space-y-3 mb-20"
            variants={staggerContainer}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
          >
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">{t('meals_loading_i18n', language)}</div>
            ) : error ? (
              <div className="text-center py-8 text-destructive">{error}</div>
            ) : foodItems.length === 0 ? (
              <EmptyState
                icon={Search}
                title={t('meals_noFoodFound_i18n', language)}
                description={t('meals_tryAdjustingSearch_i18n', language)}
                variant="minimal"
              />
            ) : (
              foodItems.map((food, index) => (
                <motion.div
                  key={food.id || index}
                  variants={slideUp}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                          <span className="text-lg" aria-hidden="true">{food.emoji || '🍽️'}</span>
                        </div>
                        <div>
                          <h3 className="font-medium text-sm">{food.name}</h3>
                          <p className="text-xs text-muted-foreground">{food.nameEn}</p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                            <span>{food.calories} kcal</span>
                            <span className="w-1 h-1 bg-muted-foreground rounded-full" aria-hidden="true" />
                            <span>{food.servingSize || 100}g</span>
                          </div>
                        </div>
                      </div>
                      <motion.div whileTap={buttonTap.tap}>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => addFoodItem(food)}
                          className="text-primary hover:text-primary/80 hover:bg-primary/10"
                          aria-label={`Add ${food.name} to ${mealType}`}
                        >
                          <Plus size={18} aria-hidden="true" />
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </AnimatePresence>

        {/* Add Custom Food Button */}
        <motion.div
          className="fixed bottom-6 right-6"
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5, type: 'spring', stiffness: 300, damping: 24 }}
          whileTap={buttonTap.tap}
          whileHover={{ scale: 1.05 }}
        >
          <Link href="/meals/add">
            <Button className="rounded-full w-14 h-14 bg-primary hover:bg-primary/80 shadow-lg" aria-label="Add custom food">
              <Plus size={24} aria-hidden="true" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
