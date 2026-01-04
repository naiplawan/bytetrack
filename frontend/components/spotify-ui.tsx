import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SpotifyLoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SpotifyLoader: React.FC<SpotifyLoaderProps> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const dotSizes = {
    sm: 'w-1 h-1',
    md: 'w-2 h-2',
    lg: 'w-3 h-3',
  };

  return (
    <div className={cn('spotify-flex-center', sizeClasses[size], className)}>
      <div className="spotify-flex-center gap-1">
        {[0, 1, 2].map((index) => (
          <motion.div
            key={index}
            className={cn('bg-primary rounded-full', dotSizes[size])}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
    </div>
  );
};

interface SpotifySkeletonProps {
  className?: string;
  count?: number;
}

export const SpotifySkeleton: React.FC<SpotifySkeletonProps> = ({ className, count = 1 }) => {
  return (
    <div className={cn('space-y-4', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="spotify-card-compact animate-pulse">
          <div className="spotify-flex-between">
            <div className="flex-1 space-y-3">
              <div className="h-4 bg-muted rounded-lg w-3/4" />
              <div className="h-3 bg-muted/70 rounded-lg w-1/2" />
            </div>
            <div className="w-12 h-12 bg-muted rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
};

interface SpotifyPlaceholderProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: React.ReactNode;
  className?: string;
}

export const SpotifyPlaceholder: React.FC<SpotifyPlaceholderProps> = ({
  title = 'Nothing here yet',
  description = 'Start by adding some content',
  icon,
  action,
  className,
}) => {
  return (
    <div className={cn('spotify-flex-center flex-col text-center py-16', className)}>
      {icon && <div className="mb-6 opacity-50">{icon}</div>}
      <h3 className="spotify-text-heading mb-2">{title}</h3>
      <p className="spotify-text-body mb-6 max-w-md">{description}</p>
      {action && action}
    </div>
  );
};
