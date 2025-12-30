import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { LucideIcon } from '@/lib/types';

export interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: React.ReactNode;
  variant?: 'default' | 'glass' | 'minimal';
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  className,
  icon: Icon,
  title,
  description,
  action,
  variant = 'default',
}) => {
  const variantStyles = {
    default: 'bg-card/80 backdrop-blur-xl border border-border/20 shadow-lg',
    glass: 'bg-card/10 backdrop-blur-2xl border border-border/20 shadow-2xl',
    minimal: 'bg-transparent border-2 border-dashed border-border/40',
  };

  return (
    <motion.div
      className={cn(
        'rounded-2xl p-8 sm:p-12 text-center',
        variantStyles[variant],
        className
      )}
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      role="status"
      aria-label={title}
    >
      {Icon && (
        <motion.div
          className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          aria-hidden="true"
        >
          <Icon className="w-8 h-8 text-primary" />
        </motion.div>
      )}
      <motion.h3
        className="text-xl font-semibold text-foreground mb-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {title}
      </motion.h3>
      {description && (
        <motion.p
          className="text-muted-foreground mb-6 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {description}
        </motion.p>
      )}
      {action && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {action}
        </motion.div>
      )}
    </motion.div>
  );
};

EmptyState.displayName = 'EmptyState';

export { EmptyState };
