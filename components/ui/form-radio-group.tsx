import type React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CheckCircle2, Circle } from 'lucide-react';

interface Option {
  value: string;
  label: string;
  description?: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: string;
}

interface FormRadioGroupProps {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  error?: string;
  layout?: 'horizontal' | 'vertical' | 'grid';
  className?: string;
  variant?: 'default' | 'card' | 'minimal' | 'premium';
  size?: 'sm' | 'md' | 'lg';
}

export const FormRadioGroup: React.FC<FormRadioGroupProps> = ({
  label,
  value,
  onValueChange,
  options,
  error,
  layout = 'vertical',
  className = '',
  variant = 'card',
  size = 'md',
}) => {
  const layoutClasses = {
    horizontal: 'flex flex-wrap gap-4',
    vertical: 'space-y-3',
    grid: 'grid grid-cols-1 sm:grid-cols-2 gap-4',
  };

  const sizeClasses = {
    sm: 'p-4 text-sm',
    md: 'p-6 text-base',
    lg: 'p-8 text-lg',
  };

  const variantClasses = {
    default: 'border-2 rounded-xl',
    card: 'modern-card border-2',
    minimal: 'border-b-2 border-transparent pb-4',
    premium: 'spotify-glass border-2 backdrop-blur-xl',
  };

  return (
    <div className="space-y-6">
      {label && <Label className="text-display text-foreground font-semibold">{label}</Label>}

      <RadioGroup value={value} onValueChange={onValueChange} className={`${layoutClasses[layout]} ${className}`}>
        <AnimatePresence>
          {options.map((option, index) => {
            const isSelected = value === option.value;
            const Icon = option.icon;

            return (
              <motion.div
                key={option.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className={`
                  relative group cursor-pointer transition-all duration-300
                  ${variantClasses[variant]}
                  ${sizeClasses[size]}
                  ${
                    isSelected
                      ? 'border-primary bg-primary/10 shadow-glow transform scale-[1.02]'
                      : 'border-border/20 hover:border-primary/30 hover:bg-muted/30 hover:transform hover:scale-[1.01]'
                  }
                  ${variant === 'premium' && isSelected ? 'spotify-glow' : ''}
                `}
                whileHover={{
                  scale: isSelected ? 1.02 : 1.01,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-start space-x-4">
                  <RadioGroupItem
                    value={option.value}
                    id={option.value}
                    className="absolute inset-0 w-full h-full cursor-pointer opacity-0 z-10"
                  />

                  {/* Custom Radio Indicator */}
                  <div className="flex-shrink-0 mt-1">
                    {isSelected ? (
                      <CheckCircle2 className="w-6 h-6 text-primary animate-in zoom-in duration-200" />
                    ) : (
                      <Circle className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        {Icon && (
                          <Icon
                            className={`w-5 h-5 transition-colors duration-200 ${
                              isSelected ? 'text-primary' : 'text-muted-foreground'
                            }`}
                          />
                        )}
                        <Label
                          htmlFor={option.value}
                          className={`font-semibold cursor-pointer transition-colors duration-200 ${
                            isSelected ? 'text-primary' : 'text-foreground group-hover:text-primary'
                          }`}
                        >
                          {option.label}
                        </Label>
                      </div>

                      {option.badge && (
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-full transition-colors duration-200 ${
                            isSelected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
                          }`}
                        >
                          {option.badge}
                        </span>
                      )}
                    </div>

                    {option.description && (
                      <p
                        className={`mt-2 text-sm leading-relaxed transition-colors duration-200 ${
                          isSelected ? 'text-foreground/80' : 'text-muted-foreground group-hover:text-foreground/70'
                        }`}
                      >
                        {option.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Selection Indicator */}
                {isSelected && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="absolute top-4 right-4"
                  >
                    <div className="w-2 h-2 bg-primary rounded-full shadow-glow animate-pulse" />
                  </motion.div>
                )}

                {/* Hover Glow Effect */}
                <div
                  className={`
                  absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                  transition-opacity duration-300 pointer-events-none
                  ${variant === 'premium' ? 'bg-gradient-to-r from-primary/5 to-secondary/5' : ''}
                `}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </RadioGroup>

      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-sm text-destructive font-medium flex items-center space-x-2"
        >
          <Circle className="w-4 h-4 fill-destructive" />
          <span>{error}</span>
        </motion.p>
      )}
    </div>
  );
};
