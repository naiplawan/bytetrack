import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 transform-gpu [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        // Primary Actions
        primary:
          'bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl shadow-lg hover:shadow-primary/25 hover:scale-[1.02] active:scale-[0.98]',

        // Secondary Actions
        secondary:
          'bg-secondary/80 text-secondary-foreground hover:bg-secondary rounded-xl hover:scale-[1.02] active:scale-[0.98]',

        // Destructive Actions
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 rounded-xl shadow-lg hover:shadow-destructive/25 hover:scale-[1.02] active:scale-[0.98]',

        // Outlined Buttons
        outline:
          'border-2 border-border bg-transparent text-foreground hover:border-primary hover:text-primary hover:bg-primary/5 rounded-xl hover:scale-[1.02] active:scale-[0.98]',

        // Ghost Buttons
        ghost: 'bg-transparent text-foreground hover:bg-accent/10 rounded-xl hover:scale-[1.02] active:scale-[0.98]',

        // Link Style
        link: 'text-primary underline-offset-4 hover:underline p-0 h-auto',

        // Spotify-inspired
        spotify:
          'bg-[#1db954] text-white hover:bg-[#1ed760] rounded-full font-semibold shadow-lg hover:shadow-[#1db954]/25 hover:scale-[1.05] active:scale-[0.95]',

        // Apple-inspired
        apple:
          'bg-gradient-to-b from-blue-500 to-blue-600 text-white hover:from-blue-400 hover:to-blue-500 rounded-xl shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]',

        // Glass Effect
        glass:
          'bg-white/10 backdrop-blur-xl border border-white/20 text-foreground hover:bg-white/20 rounded-xl shadow-lg hover:scale-[1.02] active:scale-[0.98]',
      },
      size: {
        sm: 'h-9 px-3 text-sm rounded-lg',
        default: 'h-11 px-6 text-sm',
        lg: 'h-12 px-8 text-base',
        xl: 'h-14 px-10 text-lg',
        icon: 'h-11 w-11',
        'icon-sm': 'h-9 w-9',
        'icon-lg': 'h-12 w-12',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  loadingText?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, isLoading = false, loadingText, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';

    if (asChild) {
      return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props}>{children}</Comp>;
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || isLoading}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            <span>{loadingText || 'Loading...'}</span>
          </>
        ) : (
          children
        )}
      </Comp>
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
