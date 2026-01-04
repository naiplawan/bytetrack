import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// Base Card Component with Apple/Spotify inspired design
const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    variant?: 'default' | 'glass' | 'elevated' | 'minimal' | 'interactive';
    animate?: boolean;
  }
>(({ className, variant = 'default', animate = true, children, ...props }, ref) => {
  const variants = {
    default: 'bg-card/80 backdrop-blur-xl border border-border/40 shadow-lg hover:shadow-xl',
    glass: 'bg-card/10 backdrop-blur-2xl border border-border/20 shadow-2xl',
    elevated: 'bg-card/90 backdrop-blur-xl border border-border/60 shadow-2xl hover:shadow-3xl',
    minimal: 'bg-card/40 backdrop-blur-md border border-border/20 hover:border-border/40',
    interactive:
      'bg-card/80 backdrop-blur-xl border border-border/40 shadow-lg hover:shadow-xl hover:scale-[1.01] cursor-pointer active:scale-[0.99]',
  };

  const CardComponent = (
    <div ref={ref} className={cn('rounded-2xl transition-all duration-300', variants[variant], className)} {...props}>
      {children}
    </div>
  );

  if (animate && variant === 'interactive') {
    return (
      <motion.div
        whileHover={{ scale: 1.01, y: -2 }}
        whileTap={{ scale: 0.99 }}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      >
        {CardComponent}
      </motion.div>
    );
  }

  return CardComponent;
});
Card.displayName = 'Card';

// Header with modern spacing and typography
const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    compact?: boolean;
  }
>(({ className, compact = false, ...props }, ref) => (
  <div ref={ref} className={cn('flex flex-col space-y-2', compact ? 'p-4' : 'p-6 pb-4', className)} {...props} />
));
CardHeader.displayName = 'CardHeader';

// Title with improved typography scale
const CardTitle = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    gradient?: boolean;
  }
>(({ className, size = 'md', gradient = false, ...props }, ref) => {
  const sizes = {
    sm: 'text-lg font-semibold',
    md: 'text-xl font-semibold',
    lg: 'text-2xl font-bold',
    xl: 'text-3xl font-bold',
  };

  return (
    <div
      ref={ref}
      className={cn(
        'leading-tight tracking-tight',
        sizes[size],
        gradient && 'bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent',
        className
      )}
      {...props}
    />
  );
});
CardTitle.displayName = 'CardTitle';

// Description with better readability
const CardDescription = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    size?: 'sm' | 'md' | 'lg';
  }
>(({ className, size = 'md', ...props }, ref) => {
  const sizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return <div ref={ref} className={cn('text-muted-foreground leading-relaxed', sizes[size], className)} {...props} />;
});
CardDescription.displayName = 'CardDescription';

// Content with flexible padding
const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    compact?: boolean;
    noPadding?: boolean;
  }
>(({ className, compact = false, noPadding = false, ...props }, ref) => (
  <div ref={ref} className={cn(noPadding ? '' : compact ? 'p-4 pt-0' : 'p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

// Footer with modern button placement
const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    compact?: boolean;
    justify?: 'start' | 'center' | 'end' | 'between';
  }
>(({ className, compact = false, justify = 'start', ...props }, ref) => {
  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
  };

  return (
    <div
      ref={ref}
      className={cn('flex items-center gap-3', compact ? 'p-4 pt-0' : 'p-6 pt-0', justifyClasses[justify], className)}
      {...props}
    />
  );
});
CardFooter.displayName = 'CardFooter';

// Stats Card - Perfect for dashboard metrics
const StatsCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string;
    value: string | number;
    change?: string;
    trend?: 'up' | 'down' | 'neutral';
    icon?: React.ReactNode;
  }
>(({ className, title, value, change, trend, icon, ...props }, ref) => (
  <Card ref={ref} variant="minimal" className={cn('group hover:shadow-lg', className)} {...props}>
    <CardContent compact>
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold text-foreground">{value}</p>
          {change && (
            <p
              className={cn(
                'text-xs font-medium',
                trend === 'up' && 'text-green-600',
                trend === 'down' && 'text-red-600',
                trend === 'neutral' && 'text-muted-foreground'
              )}
            >
              {change}
            </p>
          )}
        </div>
        {icon && (
          <div className="p-2 bg-primary/10 rounded-xl text-primary group-hover:bg-primary/20 transition-colors">
            {icon}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
));
StatsCard.displayName = 'StatsCard';

// Feature Card - For landing pages and showcases
const FeatureCard = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    title: string;
    description: string;
    icon?: React.ReactNode;
    action?: React.ReactNode;
  }
>(({ className, title, description, icon, action, ...props }, ref) => (
  <Card ref={ref} variant="interactive" className={className} {...props}>
    <CardHeader>
      {icon && (
        <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary mb-4">
          {icon}
        </div>
      )}
      <CardTitle size="lg">{title}</CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    {action && <CardFooter>{action}</CardFooter>}
  </Card>
));
FeatureCard.displayName = 'FeatureCard';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, StatsCard, FeatureCard };
