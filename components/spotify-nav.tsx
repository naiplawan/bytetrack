'use client';

import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Home, BarChart3, Target, Settings, User, Apple, Calendar, Zap } from 'lucide-react';

const navigationItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/meals', label: 'Meals', icon: Apple },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/goals', label: 'Goals', icon: Target },
  { href: '/calendar', label: 'Calendar', icon: Calendar },
];

const bottomItems = [
  { href: '/workouts', label: 'Workouts', icon: Zap },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/settings', label: 'Settings', icon: Settings },
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
    onNavigate?.();
  };

  return (
    <nav
      className={cn(
        isMobile ? '' : 'rounded-xl border border-border p-4 bg-card',
        className
      )}
      role="navigation"
      aria-label="Main navigation"
    >
      <div className="space-y-6">
        {!isMobile && (
          <div className="px-3 pb-4 border-b border-border">
            <span className="text-base font-bold tracking-tight">ByteTrack</span>
          </div>
        )}

        <div className="space-y-0.5" role="list">
          {navigationItems.map((item) => {
            const isActive = currentPath === item.href;
            const Icon = item.icon;

            return (
              <div key={item.href} role="listitem">
                <Link
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    isActive
                      ? 'bg-foreground text-background font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </div>
            );
          })}
        </div>

        <div className="h-px bg-border" role="separator" aria-hidden="true" />

        <div className="space-y-0.5" role="list">
          {bottomItems.map((item) => {
            const isActive = currentPath === item.href;
            const Icon = item.icon;

            return (
              <div key={item.href} role="listitem">
                <Link
                  href={item.href}
                  onClick={handleNavClick}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
                    isActive
                      ? 'bg-foreground text-background font-medium'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  <span>{item.label}</span>
                </Link>
              </div>
            );
          })}
        </div>

        {!isMobile && (
          <div className="pt-4 border-t border-border">
            <Link
              href="/profile"
              onClick={handleNavClick}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              aria-label="View your profile"
            >
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-foreground">
                ?
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-foreground truncate">Set up profile</div>
              </div>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};
