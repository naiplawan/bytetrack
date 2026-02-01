'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import {
  Apple,
  TrendingUp,
  Heart,
  Award,
  Sparkles,
  ArrowRight,
  Check,
  Activity,
  Zap,
} from 'lucide-react';
import { fadeInUp, staggerContainer, geometricShape } from '@/lib/motion-variants';
import { useReducedMotion } from '@/lib/motion-variants';

const features = [
  {
    icon: Apple,
    title: 'Smart Nutrition Tracking',
    description: 'Log meals instantly with AI-powered food recognition and detailed nutritional analysis',
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'Visualize your wellness journey with beautiful charts and actionable insights',
  },
  {
    icon: Heart,
    title: 'Holistic Health',
    description: 'Track calories, macros, water, sleep, and activity all in one place',
  },
  {
    icon: Award,
    title: 'Achievement System',
    description: 'Stay motivated with badges, streaks, and celebratory milestones',
  },
];

const benefits = [
  '500,000+ food database with Thai & International cuisine',
  'Personalized macro goals based on your fitness objectives',
  'Weekly meal planning with smart suggestions',
  'Connect with friends and share your progress',
  'Dark mode support for late-night logging',
];

export default function Home() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <div className="min-h-screen bg-gradient-hero">
      {/* Skip Link for Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>
      {/* ============================================
          HERO SECTION - Vibrant & Block-based
          ============================================ */}
      <section id="main-content" className="relative overflow-hidden min-h-screen flex items-center">
        {/* Geometric Decorations */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Rotating Triangle */}
          <motion.div
            className="absolute top-20 right-20 w-64 h-64"
            style={{
              clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
              background: 'linear-gradient(135deg, #DC2626, #F87171)',
              opacity: 0.15,
            }}
            animate={prefersReducedMotion ? undefined : { rotate: 360 }}
            transition={prefersReducedMotion ? undefined : { duration: 30, repeat: Infinity, ease: 'linear' }}
          />

          {/* Morphing Blob */}
          <motion.div
            className="absolute top-1/2 left-10 w-48 h-48"
            style={{
              background: 'linear-gradient(135deg, #F87171, #F59E0B)',
              opacity: 0.15,
            }}
            animate={prefersReducedMotion ? undefined : {
              borderRadius: [
                '60% 40% 30% 70% / 60% 30% 70% 40%',
                '30% 60% 70% 40% / 50% 60% 30% 60%',
                '60% 40% 30% 70% / 60% 30% 70% 40%',
              ],
            }}
            transition={prefersReducedMotion ? undefined : { duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />

          {/* Floating Circle */}
          <motion.div
            className="absolute bottom-20 right-1/3 w-32 h-32 rounded-full"
            style={{
              background: 'linear-gradient(135deg, #16A34A, #22C55E)',
              opacity: 0.15,
            }}
            animate={prefersReducedMotion ? undefined : { y: [0, -20, 0] }}
            transition={prefersReducedMotion ? undefined : { duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial="hidden"
              animate="visible"
              variants={staggerContainer}
              className="space-y-8"
            >
              <motion.div variants={fadeInUp} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand/10 text-brand text-sm font-semibold">
                <Sparkles className="w-4 h-4" />
                Your Wellness Journey Starts Here
              </motion.div>

              <motion.h1
                variants={fadeInUp}
                className="font-heading text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight text-text-primary"
              >
                Nourish Your Body,
                <span className="text-gradient-brand"> Fuel Your Life</span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl text-text-secondary leading-relaxed max-w-xl"
              >
                Track meals, monitor macros, and achieve your health goals with the most
                beautiful and intuitive nutrition app designed for healthy living enthusiasts.
              </motion.p>

              <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                <Link href="/onboarding">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-brand text-lg cursor-pointer"
                  >
                    Start Your Journey
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </motion.button>
                </Link>
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn-secondary text-lg cursor-pointer"
                  >
                    View Demo
                  </motion.button>
                </Link>
              </motion.div>

              <motion.div variants={fadeInUp} className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-brand to-secondary border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    >
                      {i === 1 ? 'JD' : i === 2 ? 'SK' : i === 3 ? 'MP' : 'A'}
                    </motion.div>
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-text-primary">Join 50,000+ users</p>
                  <p className="text-sm text-text-secondary">living healthier every day</p>
                </div>
              </motion.div>
            </motion.div>

            {/* Right - Hero Image with Geometric Frame */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              {/* Geometric Frame */}
              <div className="relative z-10">
                <div
                  className="absolute -inset-4 bg-gradient-brand rounded-3xl opacity-20"
                  style={{ clipPath: 'polygon(10% 0, 100% 0, 90% 100%, 0% 100%)' }}
                />
                <Image
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80"
                  alt="Fresh healthy salad bowl with colorful vegetables"
                  width={800}
                  height={500}
                  className="relative z-10 w-full h-[500px] object-cover rounded-3xl shadow-2xl"
                  priority
                />
              </div>

              {/* Floating Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border-2 border-brand/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-brand/10 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-brand" />
                  </div>
                  <div>
                    <p className="font-bold text-text-primary">2,450</p>
                    <p className="text-sm text-text-secondary">Calories Tracked</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border-2 border-warning/20"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-warning/10 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-warning" />
                  </div>
                  <div>
                    <p className="font-bold text-text-primary">14 Day</p>
                    <p className="text-sm text-text-secondary">Streak!</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          FEATURES SECTION - Block-based Grid
          ============================================ */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
            className="text-center mb-16"
          >
            <motion.h2
              variants={fadeInUp}
              className="font-heading text-4xl sm:text-5xl font-bold mb-6 text-text-primary"
            >
              Everything You Need to
              <span className="text-gradient-brand"> Thrive</span>
            </motion.h2>
            <motion.p
              variants={fadeInUp}
              className="text-xl text-text-secondary max-w-2xl mx-auto"
            >
              Powerful features designed with love for health enthusiasts like you
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-0">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="card-brand cursor-pointer border-t-0 border-l-0"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand/10 flex items-center justify-center mb-4">
                  <feature.icon className="w-7 h-7 text-brand" />
                </div>
                <h3 className="font-heading font-bold text-xl mb-2">{feature.title}</h3>
                <p className="text-text-secondary">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================
          BENEFITS SECTION
          ============================================ */}
      <section className="py-24 bg-gradient-hero">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <Image
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"
                alt="Person doing yoga outdoors"
                width={800}
                height={500}
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="font-heading text-4xl sm:text-5xl font-bold text-text-primary">
                Why Health Lovers
                <span className="text-gradient-brand"> Choose Us</span>
              </h2>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-sm cursor-pointer hover:shadow-lg transition-shadow"
                  >
                    <div className="w-6 h-6 rounded-full bg-cta flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-4 h-4 text-white" />
                    </div>
                    <p className="text-text-primary">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ============================================
          CTA SECTION - Bold Block Style
          ============================================ */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="card-brand p-12 lg:p-16 border-0 bg-gradient-brand text-white"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 mb-6">
              <Heart className="w-10 h-10" />
            </div>

            <h2 className="font-heading text-4xl sm:text-5xl font-bold mb-6">
              Start Your Wellness Journey Today
            </h2>

            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of health enthusiasts who have transformed their relationship with food.
              Your path to a healthier you is just one click away.
            </p>

            <Link href="/onboarding">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-white text-brand font-semibold text-lg cursor-pointer hover:bg-gray-50 transition-colors"
              >
                Get Started Free
                <Sparkles className="w-5 h-5" />
              </motion.button>
            </Link>

            <p className="text-sm text-white/70 mt-6">
              No credit card required • Free forever plan available
            </p>
          </motion.div>
        </div>
      </section>

      {/* ============================================
          STATS SECTION - Bold Numbers
          ============================================ */}
      <section className="py-16 bg-gradient-brand text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            {[
              { value: '50K+', label: 'Active Users' },
              { value: '5M+', label: 'Meals Logged' },
              { value: '500K', label: 'Food Database' },
              { value: '4.9★', label: 'App Rating' },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <p className="text-5xl sm:text-6xl font-bold font-heading mb-2">{stat.value}</p>
                <p className="text-white/80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
