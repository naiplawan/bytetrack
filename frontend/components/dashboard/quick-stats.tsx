'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { fadeIn } from './motion-variants';
import { Stat } from './types';

interface QuickStatsProps {
  stats: Stat[];
}

// Memoized stat card component to prevent unnecessary re-renders
const StatCard = React.memo<{ stat: Stat; index: number }>(({ stat, index }) => {
  const Icon = stat.icon;

  return (
    <motion.div
      variants={fadeIn}
      custom={index}
      role="listitem"
    >
      <Card
        className="spotify-card-compact spotify-hover-lift focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 focus-within:ring-offset-background"
        tabIndex={0}
        aria-label={`${stat.label}: ${stat.value} ${stat.unit}`}
      >
        <CardContent className="p-4 sm:p-6">
          <div className="spotify-flex-between">
            <div>
              <p className="spotify-text-small font-medium mb-2 text-xs sm:text-sm">{stat.label}</p>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                {stat.value}
                <span className="text-sm sm:text-base font-normal spotify-text-small ml-1 sm:ml-2">
                  {stat.unit}
                </span>
              </p>
            </div>
            <div
              className="spotify-flex-center w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-primary/10"
              aria-hidden="true"
            >
              <Icon className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});
StatCard.displayName = 'StatCard';

export function QuickStats({ stats }: QuickStatsProps) {
  return (
    <motion.div
      variants={fadeIn}
      className="space-y-4 sm:space-y-6"
      role="list"
      aria-label="Quick statistics"
    >
      {stats.map((stat, index) => (
        <StatCard key={stat.label} stat={stat} index={index} />
      ))}
    </motion.div>
  );
}
