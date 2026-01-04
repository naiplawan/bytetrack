'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, Minus, Check, Camera, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/modern-card';
import { Input } from '@/components/ui/modern-input';
import { Badge } from '@/components/ui/badge';
import { fadeIn, slideUp, staggerContainer } from '@/lib/motion-variants';
import { t } from '@/lib/translations';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AddFoodPage() {
  const { language } = useLanguage();
  const [quantity, setQuantity] = useState(1);
  const [customFood, setCustomFood] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    servingSize: '',
  });
  const [isCustom, setIsCustom] = useState(false);

  const adjustQuantity = (delta: number) => {
    setQuantity(Math.max(0.1, quantity + delta));
  };

  const selectedFood = {
    name: 'ข้าวผัดกุ้ง',
    nameEn: 'Fried Rice with Shrimp',
    calories: 350,
    protein: 18,
    carbs: 45,
    fat: 12,
    servingSize: 250,
    emoji: '🍤',
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
          <Link href="/meals">
            <Button variant="ghost" size="icon" className="apple-card-interactive">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <h1 className="spotify-text-heading">{t('meals_addFood_i18n', language)}</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" className="apple-card-interactive">
              <Camera size={20} />
            </Button>
            <Button variant="ghost" size="icon" className="apple-card-interactive">
              <Search size={20} />
            </Button>
          </div>
        </motion.div>

        {/* Toggle Custom/Search */}
        <motion.div variants={slideUp} className="mb-8">
          <div className="flex gap-2 p-1 bg-muted/40 rounded-lg">
            <Button
              variant={!isCustom ? 'primary' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => setIsCustom(false)}
            >
              {t('meals_searchFoods_i18n', language)}
            </Button>
            <Button
              variant={isCustom ? 'primary' : 'ghost'}
              size="sm"
              className="flex-1"
              onClick={() => setIsCustom(true)}
            >
              {t('meals_customEntry_i18n', language)}
            </Button>
          </div>
        </motion.div>

        {!isCustom ? (
          /* Selected Food */
          <motion.div variants={staggerContainer} className="space-y-6">
            <motion.div variants={slideUp}>
              <Card variant="glass" className="p-6">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-3xl">{selectedFood.emoji}</span>
                  </div>
                  <h2 className="spotify-text-heading mb-2">{selectedFood.name}</h2>
                  <p className="text-muted-foreground">{selectedFood.nameEn}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-background/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">{t('meals_calories_i18n', language)}</p>
                    <p className="text-lg font-semibold text-primary">{Math.round(selectedFood.calories * quantity)}</p>
                  </div>
                  <div className="text-center p-3 bg-background/30 rounded-lg">
                    <p className="text-sm text-muted-foreground">{t('meals_serving_i18n', language)}</p>
                    <p className="text-lg font-semibold">{Math.round(selectedFood.servingSize * quantity)}g</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  <div className="text-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                    <p className="text-xs text-orange-600 font-medium">{t('dashboard_carbs_i18n', language)}</p>
                    <p className="text-sm font-semibold">{Math.round(selectedFood.carbs * quantity)}g</p>
                  </div>
                  <div className="text-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                    <p className="text-xs text-blue-600 font-medium">{t('dashboard_protein_i18n', language)}</p>
                    <p className="text-sm font-semibold">{Math.round(selectedFood.protein * quantity)}g</p>
                  </div>
                  <div className="text-center p-3 bg-green-500/10 rounded-lg border border-green-500/20">
                    <p className="text-xs text-green-600 font-medium">{t('dashboard_fat_i18n', language)}</p>
                    <p className="text-sm font-semibold">{Math.round(selectedFood.fat * quantity)}g</p>
                  </div>
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center justify-center gap-4 mb-6">
                  <Button variant="outline" size="icon" onClick={() => adjustQuantity(-0.5)} className="rounded-full">
                    <Minus size={16} />
                  </Button>
                  <div className="text-center min-w-[80px]">
                    <p className="text-2xl font-bold">{quantity}</p>
                    <p className="text-xs text-muted-foreground">{t('meals_servings_i18n', language)}</p>
                  </div>
                  <Button variant="outline" size="icon" onClick={() => adjustQuantity(0.5)} className="rounded-full">
                    <Plus size={16} />
                  </Button>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        ) : (
          /* Custom Food Entry */
          <motion.div variants={staggerContainer} className="space-y-6">
            <motion.div variants={slideUp}>
              <Card variant="glass" className="p-6">
                <h2 className="spotify-text-heading mb-6 text-center">{t('meals_customFoodEntry_i18n', language)}</h2>

                <div className="space-y-4">
                  <Input
                    label={t('meals_foodName_i18n', language)}
                    placeholder={t('meals_enterFoodName_i18n', language)}
                    value={customFood.name}
                    onChange={(e) => setCustomFood((prev) => ({ ...prev, name: e.target.value }))}
                    variant="glass"
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label={t('meals_calories_i18n', language)}
                      type="number"
                      placeholder="0"
                      value={customFood.calories}
                      onChange={(e) => setCustomFood((prev) => ({ ...prev, calories: e.target.value }))}
                      variant="glass"
                    />
                    <Input
                      label={`${t('meals_servingSize_i18n', language)} (g)`}
                      type="number"
                      placeholder="100"
                      value={customFood.servingSize}
                      onChange={(e) => setCustomFood((prev) => ({ ...prev, servingSize: e.target.value }))}
                      variant="glass"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <Input
                      label={`${t('dashboard_carbs_i18n', language)} (g)`}
                      type="number"
                      placeholder="0"
                      value={customFood.carbs}
                      onChange={(e) => setCustomFood((prev) => ({ ...prev, carbs: e.target.value }))}
                      variant="glass"
                    />
                    <Input
                      label={`${t('dashboard_protein_i18n', language)} (g)`}
                      type="number"
                      placeholder="0"
                      value={customFood.protein}
                      onChange={(e) => setCustomFood((prev) => ({ ...prev, protein: e.target.value }))}
                      variant="glass"
                    />
                    <Input
                      label={`${t('dashboard_fat_i18n', language)} (g)`}
                      type="number"
                      placeholder="0"
                      value={customFood.fat}
                      onChange={(e) => setCustomFood((prev) => ({ ...prev, fat: e.target.value }))}
                      variant="glass"
                    />
                  </div>
                </div>
              </Card>
            </motion.div>
          </motion.div>
        )}

        {/* Quick Add Suggestions */}
        <motion.div variants={slideUp} className="mt-8">
          <h3 className="spotify-text-subheading mb-4">{t('meals_recentQuickAdd_i18n', language)}</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'rice', en: 'Rice', th: 'ข้าว' },
              { key: 'chicken', en: 'Chicken', th: 'ไก่' },
              { key: 'vegetables', en: 'Vegetables', th: 'ผัก' },
              { key: 'egg', en: 'Egg', th: 'ไข่' },
              { key: 'milk', en: 'Milk', th: 'นม' },
            ].map((item) => (
              <Badge key={item.key} variant="outline" className="px-3 py-1 cursor-pointer hover:bg-primary/10">
                {language === 'th' ? item.th : item.en}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="fixed bottom-6 left-6 right-6 max-w-md mx-auto space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex gap-3">
            <Button variant="outline" size="lg" className="flex-1">
              {t('meals_saveAsFavorite_i18n', language)}
            </Button>
            <Link href="/meals" className="flex-1">
              <Button size="lg" className="w-full bg-primary hover:bg-primary/80">
                <Check className="w-4 h-4 mr-2" />
                {t('meals_addToDiary_i18n', language)}
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
