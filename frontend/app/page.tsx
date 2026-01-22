'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Apple,
  TrendingUp,
  Heart,
  Award,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Activity,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: Apple,
    title: 'Smart Nutrition Tracking',
    description: 'Log meals instantly with AI-powered food recognition and detailed nutritional analysis',
    color: 'text-green-600',
    bg: 'bg-green-50',
  },
  {
    icon: TrendingUp,
    title: 'Progress Analytics',
    description: 'Visualize your wellness journey with beautiful charts and actionable insights',
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    icon: Heart,
    title: 'Holistic Health',
    description: 'Track calories, macros, water, sleep, and activity all in one place',
    color: 'text-rose-600',
    bg: 'bg-rose-50',
  },
  {
    icon: Award,
    title: 'Achievement System',
    description: 'Stay motivated with badges, streaks, and celebratory milestones',
    color: 'text-amber-600',
    bg: 'bg-amber-50',
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
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-amber-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Floating Decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-20 left-10 w-32 h-32 bg-green-200/30 rounded-full blur-3xl"
            animate={{ y: [0, -30, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute top-40 right-20 w-40 h-40 bg-teal-200/30 rounded-full blur-3xl"
            animate={{ y: [0, 30, 0], scale: [1, 1.15, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className="absolute bottom-20 left-1/3 w-36 h-36 bg-amber-200/30 rounded-full blur-3xl"
            animate={{ y: [0, -20, 0], scale: [1, 1.1, 1] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 text-green-700 text-sm font-medium"
              >
                <Sparkles className="w-4 h-4" />
                Your Wellness Journey Starts Here
              </motion.div>

              <h1 className="heading-font text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight">
                Nourish Your Body,
                <span className="text-gradient-vitality"> Fuel Your Life</span>
              </h1>

              <p className="text-xl text-gray-600 leading-relaxed max-w-xl">
                Track meals, monitor macros, and achieve your health goals with the most
                beautiful and intuitive nutrition app designed for healthy living enthusiasts.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/onboarding">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn-vitality flex items-center justify-center gap-3 text-lg"
                  >
                    Start Your Journey
                    <ArrowRight className="w-5 h-5" />
                  </motion.button>
                </Link>
                <Link href="/dashboard">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-8 py-4 rounded-full border-2 border-green-300 text-green-700 font-semibold hover:bg-green-50 transition-all"
                  >
                    View Demo
                  </motion.button>
                </Link>
              </div>

              <div className="flex items-center gap-6 pt-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className="w-10 h-10 rounded-full bg-gradient-to-br from-green-400 to-teal-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                    >
                      {i === 1 ? 'JD' : i === 2 ? 'SK' : i === 3 ? 'MP' : 'A'}
                    </motion.div>
                  ))}
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Join 50,000+ users</p>
                  <p className="text-sm text-gray-500">living healthier every day</p>
                </div>
              </div>
            </motion.div>

            {/* Right - Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80"
                  alt="Fresh healthy salad bowl with colorful vegetables"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/30 to-transparent" />
              </div>

              {/* Floating Stats Cards */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-4 shadow-xl border border-green-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center">
                    <Activity className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">2,450</p>
                    <p className="text-sm text-gray-500">Calories Tracked</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-xl border border-amber-100"
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-amber-100 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-800">14 Day</p>
                    <p className="text-sm text-gray-500">Streak! 🔥</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="heading-font text-4xl sm:text-5xl font-bold mb-6">
              Everything You Need to
              <span className="text-gradient-vitality"> Thrive</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed with love for health enthusiasts like you
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
              >
                <div className="wellness-card p-6 h-full">
                  <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-4`}>
                    <feature.icon className={`w-7 h-7 ${feature.color}`} />
                  </div>
                  <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 wellness-bg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <img
                src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80"
                alt="Person doing yoga outdoors"
                className="rounded-3xl shadow-2xl w-full h-[500px] object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <h2 className="heading-font text-4xl sm:text-5xl font-bold">
                Why Healthy Lovers
                <span className="text-gradient-vitality"> Choose Us</span>
              </h2>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur-sm"
                  >
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <p className="text-gray-700">{benefit}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="wellness-card p-12 lg:p-16"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-6">
              <Heart className="w-10 h-10 text-green-600 heartbeat" />
            </div>

            <h2 className="heading-font text-4xl sm:text-5xl font-bold mb-6">
              Start Your Wellness Journey Today
            </h2>

            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of health enthusiasts who have transformed their relationship with food.
              Your path to a healthier you is just one click away.
            </p>

            <Link href="/onboarding">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-vitality text-lg"
              >
                Get Started Free
                <Sparkles className="w-5 h-5 ml-2" />
              </motion.button>
            </Link>

            <p className="text-sm text-gray-500 mt-6">
              No credit card required • Free forever plan available
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-green-600 to-teal-600 text-white">
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
                <p className="text-4xl sm:text-5xl font-bold mb-2">{stat.value}</p>
                <p className="text-green-100">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
