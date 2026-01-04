'use client';

import React from 'react';
import { motion, easeInOut } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Search, Home, ArrowLeft, Compass } from 'lucide-react';
import Link from 'next/link';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const float = {
  duration: 2,
  repeat: Infinity,
  repeatType: 'reverse' as const,
  ease: easeInOut,
};

export default function NotFoundPage() {
  const quickLinks = [
    { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'View your health overview' },
    { name: 'Add Meal', href: '/meals/add', icon: Search, description: 'Log your food intake' },
    { name: 'Meal History', href: '/meals', icon: Compass, description: 'Browse your meal history' },
  ];

  return (
    <div className="min-h-screen bg-background spotify-scrollbar flex items-center justify-center">
      <div className="spotify-container max-w-2xl">
        <motion.div className="text-center space-y-8" variants={staggerContainer} initial="hidden" animate="visible">
          {/* 404 Animation */}
          <motion.div variants={fadeIn} className="spotify-flex-center">
            <motion.div className="relative" animate={{ y: [-10, 10] }} transition={float}>
              <div className="text-9xl font-bold spotify-text-gradient opacity-20">404</div>
              <div className="absolute inset-0 spotify-flex-center">
                <Search className="w-16 h-16 text-primary" />
              </div>
            </motion.div>
          </motion.div>

          {/* Not Found Message */}
          <motion.div variants={fadeIn} className="space-y-4">
            <h1 className="spotify-text-hero text-4xl lg:text-5xl">Page not found</h1>
            <p className="spotify-text-body text-xl max-w-md mx-auto">
              Looks like you've wandered off the beaten path. Let's get you back on track with your health journey!
            </p>
          </motion.div>

          {/* Quick Navigation */}
          <motion.div variants={fadeIn}>
            <Card className="spotify-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Compass className="w-5 h-5 text-primary" />
                  Quick Navigation
                </CardTitle>
                <CardDescription>Jump to these popular sections</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {quickLinks.map((link, index) => (
                  <motion.div
                    key={link.name}
                    variants={fadeIn}
                    custom={index}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button variant="outline" asChild className="w-full justify-start h-auto p-4">
                      <Link href={link.href}>
                        <div className="flex items-center gap-3 w-full">
                          <div className="spotify-flex-center w-10 h-10 rounded-full bg-primary/10">
                            <link.icon className="w-5 h-5 text-primary" />
                          </div>
                          <div className="text-left flex-1">
                            <div className="font-semibold">{link.name}</div>
                            <div className="text-sm text-muted-foreground">{link.description}</div>
                          </div>
                        </div>
                      </Link>
                    </Button>
                  </motion.div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={fadeIn} className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="spotify-button flex items-center gap-2" size="lg">
                <Link href="/dashboard">
                  <Home className="w-5 h-5" />
                  Go to Dashboard
                </Link>
              </Button>

              <Button
                variant="outline"
                onClick={() => window.history.back()}
                size="lg"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-5 h-5" />
                Go Back
              </Button>
            </div>
          </motion.div>

          {/* Fun Stats */}
          <motion.div variants={fadeIn}>
            <Card className="spotify-card-compact">
              <CardContent className="p-6">
                <div className="text-center space-y-3">
                  <h3 className="font-semibold text-foreground">While you're here...</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-primary">2,000+</div>
                      <div className="spotify-text-small">Foods in database</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-primary">24/7</div>
                      <div className="spotify-text-small">Health tracking</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-2xl font-bold text-primary">100%</div>
                      <div className="spotify-text-small">Free to use</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
