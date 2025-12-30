import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  icon?: React.ReactNode;
  description?: string;
  required?: boolean;
  isValid?: boolean;
  isValidating?: boolean;
  showSuccessState?: boolean;
}

export const FormInput = React.forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      icon,
      description,
      required,
      isValid,
      isValidating,
      showSuccessState = true,
      className,
      id,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [hasInteracted, setHasInteracted] = useState(false);

    const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;
    const errorId = `${inputId}-error`;
    const descriptionId = `${inputId}-description`;

    const handleFocus = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      props.onFocus?.(e);
    }, [props.onFocus]);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setHasInteracted(true);
      props.onBlur?.(e);
    }, [props.onBlur]);

    const showError = error && hasInteracted;
    const showSuccess = showSuccessState && isValid && hasInteracted && !error && !isValidating;

    return (
      <div className="space-y-2">
        <Label htmlFor={inputId} className="form-label flex items-center gap-1">
          {label}
          {required && (
            <span className="text-destructive" aria-hidden="true">*</span>
          )}
          {required && <span className="sr-only">(required)</span>}
        </Label>

        <div className="relative">
          {/* Left icon */}
          {icon && (
            <div
              className={cn(
                "absolute left-3 top-1/2 transform -translate-y-1/2 transition-colors duration-200",
                isFocused ? 'text-primary' : 'text-muted-foreground',
                showError && 'text-destructive'
              )}
              aria-hidden="true"
            >
              {icon}
            </div>
          )}

          <Input
            ref={ref}
            id={inputId}
            className={cn(
              'form-input transition-all duration-200',
              icon && 'pl-10',
              (isValidating || showSuccess) && 'pr-10',
              showError && 'border-destructive focus:border-destructive focus:ring-destructive/20',
              showSuccess && 'border-primary/50 focus:border-primary focus:ring-primary/20',
              className
            )}
            aria-invalid={showError ? 'true' : undefined}
            aria-describedby={cn(
              showError && errorId,
              description && descriptionId
            ) || undefined}
            aria-required={required}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...props}
          />

          {/* Right status indicator */}
          <AnimatePresence mode="wait">
            {isValidating && (
              <motion.div
                key="validating"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                aria-hidden="true"
              >
                <Loader2 className="w-4 h-4 text-muted-foreground animate-spin" />
              </motion.div>
            )}
            {showSuccess && !isValidating && (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="absolute right-3 top-1/2 transform -translate-y-1/2"
                aria-hidden="true"
              >
                <CheckCircle2 className="w-4 h-4 text-primary" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Description text */}
        <AnimatePresence mode="wait">
          {description && !showError && (
            <motion.p
              key="description"
              id={descriptionId}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="text-body-small text-muted-foreground"
            >
              {description}
            </motion.p>
          )}

          {/* Error message with animation */}
          {showError && (
            <motion.div
              key="error"
              id={errorId}
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              transition={{ duration: 0.2 }}
              className="form-error flex items-center gap-1.5"
              role="alert"
              aria-live="polite"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" aria-hidden="true" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';
