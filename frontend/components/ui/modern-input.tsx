import * as React from 'react';
import { cn } from '@/lib/utils';
import { Eye, EyeOff, AlertCircle, Check } from 'lucide-react';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'default' | 'minimal' | 'glass' | 'filled';
  inputSize?: 'sm' | 'md' | 'lg' | 'xl';
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  animate?: boolean;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant = 'default',
      inputSize = 'md',
      type = 'text',
      label,
      error,
      success,
      helperText,
      leftIcon,
      rightIcon,
      animate = true,
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(!!props.value || !!props.defaultValue);

    const variants = {
      default:
        'bg-input/50 border border-border/40 focus:border-primary/60 focus:bg-input/80 focus:ring-2 focus:ring-primary/20',
      minimal: 'bg-transparent border-b border-border/60 focus:border-primary rounded-none focus:bg-accent/5',
      glass: 'bg-background/10 backdrop-blur-xl border border-border/20 focus:border-primary/40 focus:bg-background/20',
      filled: 'bg-muted/40 border border-transparent focus:border-primary focus:bg-muted/60',
    };

    const sizes = {
      sm: 'h-9 px-3 text-sm',
      md: 'h-12 px-4 text-base',
      lg: 'h-14 px-6 text-lg',
      xl: 'h-16 px-8 text-xl',
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    const isPassword = type === 'password';
    const actualType = isPassword && showPassword ? 'text' : type;

    const inputElement = (
      <div className="relative">
        {/* Label */}
        {label && (
          <label
            className={cn(
              'absolute left-4 transition-all duration-200 pointer-events-none',
              'text-muted-foreground',
              isFocused || hasValue
                ? variant === 'minimal'
                  ? '-top-6 text-xs font-medium'
                  : '-top-6 text-xs font-medium bg-background px-2 -ml-2'
                : inputSize === 'sm'
                ? 'top-2 text-sm'
                : inputSize === 'lg'
                ? 'top-4 text-lg'
                : inputSize === 'xl'
                ? 'top-5 text-xl'
                : 'top-3 text-base'
            )}
          >
            {label}
          </label>
        )}

        {/* Input Container */}
        <div className="relative">
          {/* Left Icon */}
          {leftIcon && (
            <div
              className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground',
                inputSize === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
              )}
            >
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            type={actualType}
            className={cn(
              'w-full rounded-xl font-medium placeholder:text-muted-foreground',
              'transition-all duration-200 backdrop-blur-sm',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'focus:outline-none',
              variants[variant],
              sizes[inputSize],
              leftIcon && (inputSize === 'sm' ? 'pl-9' : 'pl-12'),
              (rightIcon || isPassword || error || success) && (inputSize === 'sm' ? 'pr-9' : 'pr-12'),
              error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
              success && 'border-green-500 focus:border-green-500 focus:ring-green-500/20',
              className
            )}
            ref={ref}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            onChange={handleInputChange}
            {...props}
          />

          {/* Right Content */}
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
            {success && <Check className={cn('text-green-500', inputSize === 'sm' ? 'w-4 h-4' : 'w-5 h-5')} />}

            {error && <AlertCircle className={cn('text-destructive', inputSize === 'sm' ? 'w-4 h-4' : 'w-5 h-5')} />}

            {isPassword && (
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className={cn(
                  'text-muted-foreground hover:text-foreground transition-colors',
                  inputSize === 'sm' ? 'w-4 h-4' : 'w-5 h-5'
                )}
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            )}

            {rightIcon && !isPassword && !error && !success && (
              <div className={cn('text-muted-foreground', inputSize === 'sm' ? 'w-4 h-4' : 'w-5 h-5')}>{rightIcon}</div>
            )}
          </div>
        </div>

        {/* Helper Text / Error Message */}
        {(error || helperText) && (
          <div className={cn('mt-2 text-sm font-medium', error ? 'text-destructive' : 'text-muted-foreground')}>
            {error || helperText}
          </div>
        )}
      </div>
    );

    // animations removed; always render static input
    return inputElement;
  }
);

Input.displayName = 'Input';

// Textarea component with similar styling
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  variant?: 'default' | 'minimal' | 'glass' | 'filled';
  label?: string;
  error?: string;
  success?: boolean;
  helperText?: string;
  resize?: boolean;
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, variant = 'default', label, error, success, helperText, resize = true, ...props }, ref) => {
    const [isFocused, setIsFocused] = React.useState(false);
    const [hasValue, setHasValue] = React.useState(!!props.value || !!props.defaultValue);

    const variants = {
      default:
        'bg-input/50 border border-border/40 focus:border-primary/60 focus:bg-input/80 focus:ring-2 focus:ring-primary/20',
      minimal: 'bg-transparent border-b border-border/60 focus:border-primary rounded-none focus:bg-accent/5',
      glass: 'bg-background/10 backdrop-blur-xl border border-border/20 focus:border-primary/40 focus:bg-background/20',
      filled: 'bg-muted/40 border border-transparent focus:border-primary focus:bg-muted/60',
    };

    const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setHasValue(!!e.target.value);
      props.onChange?.(e);
    };

    return (
      <div className="relative">
        {/* Label */}
        {label && (
          <label
            className={cn(
              'absolute left-4 transition-all duration-200 pointer-events-none z-10',
              'text-muted-foreground',
              isFocused || hasValue
                ? variant === 'minimal'
                  ? '-top-6 text-xs font-medium'
                  : '-top-6 text-xs font-medium bg-background px-2 -ml-2'
                : 'top-3 text-base'
            )}
          >
            {label}
          </label>
        )}

        {/* Textarea */}
        <textarea
          className={cn(
            'w-full min-h-[100px] rounded-xl p-4 font-medium placeholder:text-muted-foreground',
            'transition-all duration-200 backdrop-blur-sm',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'focus:outline-none',
            !resize && 'resize-none',
            variants[variant],
            error && 'border-destructive focus:border-destructive focus:ring-destructive/20',
            success && 'border-green-500 focus:border-green-500 focus:ring-green-500/20',
            className
          )}
          ref={ref}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          onChange={handleTextareaChange}
          {...props}
        />

        {/* Helper Text / Error Message */}
        {(error || helperText) && (
          <div className={cn('mt-2 text-sm font-medium', error ? 'text-destructive' : 'text-muted-foreground')}>
            {error || helperText}
          </div>
        )}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';

export { Input, Textarea };
