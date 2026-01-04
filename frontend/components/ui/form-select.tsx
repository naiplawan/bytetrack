import type React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronDown, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  disabled?: boolean;
}

interface FormSelectProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  error?: string;
  className?: string;
  variant?: 'default' | 'minimal' | 'glass' | 'premium';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const FormSelect: React.FC<FormSelectProps> = ({
  label,
  value,
  onValueChange,
  options,
  placeholder = 'Select an option...',
  error,
  className = '',
  variant = 'default',
  size = 'md',
  disabled = false,
}) => {
  const variantClasses = {
    default: 'modern-card border border-border/40 focus:border-primary/60',
    minimal: 'bg-transparent border-b border-border/60 focus:border-primary rounded-none',
    glass: 'spotify-glass border border-border/20 backdrop-blur-xl focus:border-primary/40',
    premium:
      'bg-gradient-to-r from-background/80 to-background/60 border border-primary/20 focus:border-primary shadow-glow',
  };

  const sizeClasses = {
    sm: 'h-9 text-sm',
    md: 'h-12 text-base',
    lg: 'h-14 text-lg',
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className={cn('space-y-3', className)}>
      {label && <Label className="text-display text-foreground font-semibold">{label}</Label>}

      <div className="relative">
        <Select value={value} onValueChange={onValueChange} disabled={disabled}>
          <SelectTrigger
            className={cn(
              'w-full transition-all duration-200 transform-gpu',
              'focus:outline-none focus:ring-2 focus:ring-primary/20',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'hover:scale-[1.01] focus:scale-[1.01]',
              variantClasses[variant],
              sizeClasses[size],
              error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
              variant === 'premium' && 'spotify-glow-hover'
            )}
          >
            <div className="flex items-center space-x-3 w-full">
              {selectedOption?.icon && <selectedOption.icon className="w-4 h-4 text-muted-foreground" />}
              <SelectValue placeholder={<span className="text-muted-foreground font-medium">{placeholder}</span>} />
            </div>
            <ChevronDown className="h-4 w-4 opacity-50 transition-transform duration-200 group-data-[state=open]:rotate-180" />
          </SelectTrigger>

          <SelectContent
            className={cn(
              'modern-card border shadow-lg backdrop-blur-xl',
              variant === 'glass' && 'spotify-glass',
              variant === 'premium' && 'bg-gradient-to-b from-background to-background/80 shadow-glow'
            )}
          >
            <AnimatePresence>
              {options.map((option, index) => {
                const Icon = option.icon;
                return (
                  <motion.div
                    key={option.value}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.2,
                      delay: index * 0.05,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    <SelectItem
                      value={option.value}
                      disabled={option.disabled}
                      className={cn(
                        'flex items-center space-x-3 cursor-pointer',
                        'hover:bg-primary/10 focus:bg-primary/10',
                        'transition-all duration-200 rounded-lg m-1',
                        'disabled:cursor-not-allowed disabled:opacity-50',
                        option.description && 'flex-col items-start space-x-0 space-y-1 p-3'
                      )}
                    >
                      <div className="flex items-center space-x-3 w-full">
                        {Icon && <Icon className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                        <div className="flex-1">
                          <div className="font-medium">{option.label}</div>
                          {option.description && (
                            <div className="text-sm text-muted-foreground mt-1">{option.description}</div>
                          )}
                        </div>
                      </div>
                    </SelectItem>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </SelectContent>
        </Select>

        {/* Hover Glow Effect */}
        {variant === 'premium' && (
          <div className="absolute inset-0 rounded-xl opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-primary/5 to-secondary/5" />
        )}
      </div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center space-x-2 text-sm text-destructive font-medium"
        >
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </motion.div>
      )}
    </div>
  );
};
