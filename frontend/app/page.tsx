'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { fadeIn, slideUp, staggerContainer } from '@/lib/motion-variants';
import { Card, FeatureCard, StatsCard } from '@/components/ui/modern-card';
import { t } from '@/lib/translations';
import {
  ChevronRight,
  PlayCircle,
  TrendingUp,
  Target,
  Calendar,
  BarChart3,
  Apple,
  Zap,
  Heart,
  Award,
  Sparkles,
} from 'lucide-react';

const features = [
  {
    key: 'smartNutrition',
    icon: Apple,
    titleKey: 'features_smartNutrition_title_i18n' as const,
    descriptionKey: 'features_smartNutrition_desc_i18n' as const,
  },
  {
    key: 'achievementSystem',
    icon: Award,
    titleKey: 'features_achievementSystem_title_i18n' as const,
    descriptionKey: 'features_achievementSystem_desc_i18n' as const,
  },
  {
    key: 'wellnessIntegration',
    icon: Heart,
    titleKey: 'features_wellnessIntegration_title_i18n' as const,
    descriptionKey: 'features_wellnessIntegration_desc_i18n' as const,
  },
  {
    key: 'activityTracking',
    icon: Zap,
    titleKey: 'features_activityTracking_title_i18n' as const,
    descriptionKey: 'features_activityTracking_desc_i18n' as const,
  },
];

const stats = [
  { labelKey: 'stats_dailyActiveUsers_i18n' as const, value: '10K+', icon: TrendingUp },
  { labelKey: 'stats_weeklyGoalsAchieved_i18n' as const, value: '50K+', icon: BarChart3 },
  { labelKey: 'stats_totalMealsLogged_i18n' as const, value: '25K+', icon: Target },
  { labelKey: 'stats_userSatisfaction_i18n' as const, value: '98%', icon: Calendar },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/10">
      {/* Hero Section */}
      <section className="relative overflow-hidden spotify-section">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        <div className="spotify-container relative">
          <motion.div
            className="max-w-5xl mx-auto text-center"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={fadeIn} className="mb-12">
              <h1 className="spotify-text-hero mb-8">{t('hero_title_i18n')}</h1>
              <p className="spotify-text-body text-xl max-w-3xl mx-auto">{t('hero_subtitle_i18n')}</p>
            </motion.div>

            <motion.div variants={slideUp} className="flex flex-col sm:flex-row gap-6 justify-center mb-20">
              <Link href="/onboarding">
                <Button variant="primary" size="xl" className="spotify-hover-lift">
                  <PlayCircle className="w-6 h-6 mr-3" />
                  {t('hero_tryNow_i18n')}
                  <Sparkles className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="glass" size="xl" className="spotify-hover-lift">
                  <BarChart3 className="w-6 h-6 mr-3" />
                  View Dashboard
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="spotify-section border-y border-border/30">
        <div className="spotify-container">
          <motion.div
            className="spotify-grid"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {stats.map((stat, index) => (
              <motion.div key={stat.labelKey} variants={fadeIn} custom={index}>
                <StatsCard
                  title={t(stat.labelKey)}
                  value={stat.value}
                  icon={<stat.icon className="w-5 h-5" />}
                  className="text-center"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <h2 className="spotify-text-hero mb-6">{t('features_sectionTitle_i18n')}</h2>
            <p className="spotify-text-body text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('features_sectionDescription_i18n')}
            </p>
          </motion.div>

          <motion.div
            className="spotify-grid max-w-6xl mx-auto"
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.key}
                variants={fadeIn}
                custom={index}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                <FeatureCard
                  title={t(feature.titleKey)}
                  description={t(feature.descriptionKey)}
                  icon={<feature.icon className="w-6 h-6" />}
                  className="h-full"
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
        <div className="container mx-auto px-6">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            variants={fadeIn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Card variant="glass" className="border-primary/20 bg-card/50 backdrop-blur-sm p-12">
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="spotify-text-hero">{t('cta_title_i18n')}</h2>
                  <p className="spotify-text-body text-lg text-muted-foreground">{t('cta_description_i18n')}</p>
                </div>

                <div className="pt-4">
                  <Link href="/onboarding">
                    <Button variant="primary" size="xl" className="spotify-glow w-full sm:w-auto">
                      <Zap className="w-5 h-5 mr-2" />
                      {t('cta_getStartedFree_i18n')}
                      <ChevronRight className="w-5 h-5 ml-2" />
                    </Button>
                  </Link>
                  <p className="text-sm text-muted-foreground mt-4">{t('cta_noCreditCard_i18n')}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Background Decorations */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-10 w-48 h-48 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-3/4 left-1/3 w-24 h-24 bg-primary/3 rounded-full blur-2xl" />
      </div>
    </div>
  );
}
