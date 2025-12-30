'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Home, BarChart3, Target, Settings, User, Apple, Calendar, Zap } from 'lucide-react';

const navigationItems = [
  { href: '/dashboard', label: 'Home', icon: Home, badge: null, description: 'Go to dashboard' },
  { href: '/meals', label: 'Meals', icon: Apple, badge: null, description: 'View and log meals' },
  { href: '/analytics', label: 'Analytics', icon: BarChart3, badge: 'Pro', description: 'View detailed analytics' },
  { href: '/goals', label: 'Goals', icon: Target, badge: null, description: 'Set and track goals' },
  { href: '/calendar', label: 'Calendar', icon: Calendar, badge: null, description: 'View calendar' },
  { href: '/workouts', label: 'Workouts', icon: Zap, badge: 'New', description: 'Track workouts' },
];

const bottomItems = [
  { href: '/profile', label: 'Profile', icon: User, description: 'View your profile' },
  { href: '/settings', label: 'Settings', icon: Settings, description: 'App settings' },
];

interface SpotifyNavProps {
  className?: string;
  currentPath?: string;
  isMobile?: boolean;
  onNavigate?: () => void;
}

export const SpotifyNav: React.FC<SpotifyNavProps> = ({
  className,
  currentPath = '',
  isMobile = false,
  onNavigate,
}) => {
  const handleNavClick = () => {
    if (onNavigate) {
      onNavigate();
    }
  };

  return (
    <nav
      className={cn(
        isMobile ? '' : 'spotify-backdrop rounded-2xl p-6 h-fit',
        className
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="space-y-8">
        {/* Logo - Only show on desktop */}
        {!isMobile && (
          <div className="spotify-flex-center">
            <div className="spotify-flex-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary spotify-glow" aria-hidden="true" />
              <span className="font-bold text-xl spotify-text-gradient">CalorieDiary</span>
            </div>
          </div>
        )}

        {/* Main Navigation */}
        <div className="space-y-1" role="list">
          {navigationItems.map((item) => {
            const isActive = currentPath === item.href;
            const Icon = item.icon;

            return (
              <motion.div
                key={item.href}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                role="listitem"
              >
                <Link
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    'spotify-nav-item group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    isActive && 'spotify-nav-item-active'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={item.description}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <Badge
                      variant={item.badge === 'Pro' ? 'spotify-warning' : 'spotify-success'}
                      size="sm"
                      aria-label={`${item.badge} feature`}
                    >
                      {item.badge}
                    </Badge>
                  )}
                  {isActive && (
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-primary animate-glow"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="h-px bg-border/50" role="separator" aria-hidden="true" />

        {/* Bottom Navigation */}
        <div className="space-y-1" role="list">
          {bottomItems.map((item) => {
            const isActive = currentPath === item.href;
            const Icon = item.icon;

            return (
              <motion.div
                key={item.href}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                role="listitem"
              >
                <Link
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    'spotify-nav-item group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    isActive && 'spotify-nav-item-active'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                  aria-label={item.description}
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <div
                      className="w-1.5 h-1.5 rounded-full bg-primary animate-glow"
                      aria-hidden="true"
                    />
                  )}
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* User Section */}
        <div className="pt-4 border-t border-border/50">
          <Link
            href="/profile"
            onClick={handleNavClick}
            className="spotify-flex-center gap-3 p-3 rounded-xl bg-muted/20 hover:bg-muted/40 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            aria-label="View your profile - Alex Johnson, Free Plan"
          >
            <div
              className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-sm font-semibold"
              aria-hidden="true"
            >
              AJ
            </div>
            <div className="flex-1 text-left">
              <div className="font-medium text-sm text-foreground">Alex Johnson</div>
              <div className="spotify-text-small text-xs">Free Plan</div>
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
};
