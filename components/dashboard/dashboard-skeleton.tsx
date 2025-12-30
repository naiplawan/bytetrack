'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Skeleton for the header/greeting
export function DashboardHeaderSkeleton() {
  return (
    <div className="mb-12">
      <Skeleton className="h-12 w-80 mb-4" />
      <Skeleton className="h-6 w-64" />
    </div>
  );
}

// Skeleton for calorie overview card
export function CalorieOverviewSkeleton() {
  return (
    <div className="lg:col-span-2">
      <Card className="spotify-card border-primary/30">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Skeleton variant="circular" width={28} height={28} />
              <Skeleton className="h-7 w-40" />
            </div>
            <Skeleton variant="circular" width={16} height={16} />
          </div>
          <Skeleton className="h-5 w-72 mt-2" />
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="text-center">
            <Skeleton className="h-16 w-32 mx-auto mb-3" />
            <Skeleton className="h-5 w-36 mx-auto" />
          </div>
          <div>
            <Skeleton className="h-4 w-full rounded-full" />
            <div className="flex justify-between mt-3">
              <Skeleton className="h-4 w-8" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-border/30">
            {[1, 2, 3].map((i) => (
              <div key={i} className="text-center">
                <Skeleton className="h-9 w-16 mx-auto mb-1" />
                <Skeleton className="h-4 w-12 mx-auto" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Skeleton for quick stats
export function QuickStatsSkeleton() {
  return (
    <div className="space-y-6">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="spotify-card-compact">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-20" />
              </div>
              <Skeleton variant="circular" width={48} height={48} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Skeleton for recent meals
export function RecentMealsSkeleton() {
  return (
    <div className="lg:col-span-2">
      <Card className="spotify-card">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Skeleton variant="circular" width={20} height={20} />
              <Skeleton className="h-6 w-32" />
            </div>
            <Skeleton className="h-4 w-40" />
          </div>
          <Skeleton className="h-9 w-24 rounded-xl" />
        </CardHeader>
        <CardContent className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-4 w-40" />
              </div>
              <div className="text-right">
                <Skeleton className="h-5 w-16 ml-auto mb-1" />
                <Skeleton className="h-4 w-4 ml-auto" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

// Skeleton for quick actions
export function QuickActionsSkeleton() {
  return (
    <Card className="spotify-card">
      <CardHeader>
        <div className="flex items-center gap-2 mb-2">
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton className="h-6 w-28" />
        </div>
        <Skeleton className="h-4 w-48" />
      </CardHeader>
      <CardContent className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-12 w-full rounded-xl" />
        ))}
      </CardContent>
    </Card>
  );
}

// Full dashboard skeleton
export function DashboardSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-background spotify-scrollbar"
    >
      <div className="spotify-container spotify-section">
        <DashboardHeaderSkeleton />
        <div className="grid gap-8 lg:grid-cols-3">
          <CalorieOverviewSkeleton />
          <QuickStatsSkeleton />
          <RecentMealsSkeleton />
          <QuickActionsSkeleton />
        </div>
      </div>
    </motion.div>
  );
}
