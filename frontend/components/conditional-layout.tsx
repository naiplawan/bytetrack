'use client';

import { usePathname } from 'next/navigation';
import { SpotifyLayout } from '@/components/spotify-layout';

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

const dashboardRoutes = [
  '/dashboard',
  '/meals',
  '/analytics',
  '/goals',
  '/calendar',
  '/workouts',
  '/profile',
  '/settings',
];

export const ConditionalLayout: React.FC<ConditionalLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  const isDashboardRoute = dashboardRoutes.some((route) => pathname.startsWith(route));

  if (isDashboardRoute) {
    return <SpotifyLayout currentPath={pathname}>{children}</SpotifyLayout>;
  }

  return <>{children}</>;
};
