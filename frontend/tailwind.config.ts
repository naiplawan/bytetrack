import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    '*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        // NEW: Vibrant & Block-based typography
        sans: ['Raleway', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Lora', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },

      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.2' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1' }],
      },

      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },

      backdropBlur: {
        xs: '2px',
      },

      // Color palette - CSS custom properties are the single source of truth
      // See: app/globals.css for actual color values
      colors: {
        // Brand colors - Modern Purple Gradient Theme
        brand: {
          DEFAULT: 'hsl(var(--primary))', // #8B5CF6 - Modern Purple
          light: 'hsl(var(--primary) / 85%)',
          dark: 'hsl(var(--primary) / 70%)',
          fg: '#FFFFFF',
        },

        brandLight: {
          DEFAULT: 'hsl(var(--secondary))', // #EC4899 - Modern Pink
          light: 'hsl(var(--secondary) / 85%)',
          dark: 'hsl(var(--secondary))',
        },

        cta: {
          DEFAULT: '#06B6D4', // Cyan
          light: '#22D3EE',
          dark: '#0891B2',
        },

        // Background colors
        bgBrand: {
          DEFAULT: 'hsl(var(--background))',
          dark: '#1E1B4B',
          card: '#FFFFFF',
          'card-dark': '#160E38',
        },

        // Text colors
        text: {
          primary: '#1E293B',
          secondary: '#475569',
          muted: '#94A3B8',
          inverse: '#FFFFFF',
        },

        // Semantic colors - Updated modern palette
        success: '#10B981', // Emerald
        warning: '#F59E0B', // Amber
        error: '#EF4444', // Red
        info: '#3B82F6', // Blue

        // Meal type colors - Updated
        meal: {
          breakfast: '#FBBF24', // Amber
          lunch: '#34D399', // Emerald
          dinner: '#A78BFA', // Purple
          snack: '#60A5FA', // Blue
        },

        // Chart colors - Modern palette
        chart: {
          '1': 'hsl(var(--chart-1))', // Purple
          '2': 'hsl(var(--chart-2))', // Pink
          '3': 'hsl(var(--chart-3))', // Cyan
          '4': 'hsl(var(--chart-4))', // Emerald
          '5': 'hsl(var(--chart-5))', // Amber
        },

        // Shadcn/ui colors - reference CSS custom properties
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
      },

      borderRadius: {
        none: '0',
        sm: '0.125rem',
        DEFAULT: '0.25rem',
        md: 'calc(var(--radius) - 2px)',
        lg: 'var(--radius)',
        xl: '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
        full: '9999px',
      },

      boxShadow: {
        // Modern gradient shadows
        brand: '0 10px 40px rgba(139, 92, 246, 0.25), 0 0 0 1px rgba(139, 92, 246, 0.05) inset',
        'brand-hover': '0 15px 50px rgba(139, 92, 246, 0.35), 0 0 0 1px rgba(139, 92, 246, 0.1) inset',
        'brand-glow': '0 0 60px rgba(139, 92, 246, 0.3), 0 0 100px rgba(236, 72, 153, 0.2)',
        card: '0 4px 20px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(139, 92, 246, 0.05) inset',
        'card-hover': '0 20px 40px rgba(139, 92, 246, 0.12), 0 0 0 1px rgba(139, 92, 246, 0.1) inset',
        'gradient-mesh': '0 8px 32px rgba(139, 92, 246, 0.15)',
      },

      keyframes: {
        // NEW: Geometric animations
        'float-up': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'rotate-slow': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'morph-shape': {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
        'celebrate-pop': {
          '0%': { transform: 'scale(0) rotate(-180deg)', opacity: '0' },
          '50%': { transform: 'scale(1.2) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'scale(1) rotate(0deg)', opacity: '1' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },

      animation: {
        'float-up': 'float-up 4s ease-in-out infinite',
        'rotate-slow': 'rotate-slow 30s linear infinite',
        'morph-shape': 'morph-shape 8s ease-in-out infinite',
        'celebrate-pop': 'celebrate-pop 0.5s ease-out forwards',
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
