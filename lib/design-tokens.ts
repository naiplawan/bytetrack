/**
 * ByteTrack Design Tokens
 *
 * Centralized design system values based on the Vibrant & Block-based style.
 * Source: UI/UX Pro Max design intelligence.
 */

// ============================================
// COLOR PALETTE - Modern Gradient Theme
// ============================================
export const colors = {
  // Primary Colors - Purple Gradient Theme
  primary: {
    DEFAULT: '#8B5CF6', // Modern Purple
    light: '#A78BFA',
    dark: '#7C3AED',
    fg: '#FFFFFF', // Foreground text on primary
  },
  secondary: {
    DEFAULT: '#EC4899', // Modern Pink
    light: '#F472B6',
    dark: '#DB2777',
    fg: '#1E293B',
  },
  cta: {
    DEFAULT: '#06B6D4', // Cyan
    light: '#22D3EE',
    dark: '#0891B2',
    fg: '#FFFFFF',
  },

  // Neutral/Background Colors
  background: {
    DEFAULT: '#FAF5FF', // Light purple-tinged background
    dark: '#1E1B4B', // Dark mode background
    card: '#FFFFFF',
    'card-dark': '#160E38',
  },

  // Text Colors (High Contrast)
  text: {
    primary: '#1E293B', // Dark blue-gray for primary text
    secondary: '#475569', // Medium gray
    muted: '#94A3B8', // Light gray
    inverse: '#FFFFFF',
  },

  // Semantic Colors - Modern palette
  semantic: {
    success: '#10B981', // Emerald
    warning: '#F59E0B', // Amber
    error: '#EF4444', // Red
    info: '#3B82F6', // Blue
  },

  // Chart/Data Visualization Colors - Modern
  chart: {
    primary: '#8B5CF6', // Purple
    secondary: '#EC4899', // Pink
    tertiary: '#06B6D4', // Cyan
    quaternary: '#10B981', // Emerald
    quinary: '#F59E0B', // Amber
  },
} as const;

// ============================================
// TYPOGRAPHY
// ============================================
export const typography = {
  families: {
    heading: 'Lora, serif',
    body: 'Raleway, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, monospace',
  },

  weights: {
    light: 300,
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

  // Size scale (based on 1.250 major third scale)
  sizes: {
    xs: '0.75rem',      // 12px
    sm: '0.875rem',     // 14px
    base: '1rem',       // 16px
    lg: '1.125rem',     // 18px
    xl: '1.25rem',      // 20px
    '2xl': '1.5rem',    // 24px
    '3xl': '1.875rem',  // 30px
    '4xl': '2.25rem',   // 36px
    '5xl': '3rem',      // 48px
    '6xl': '3.75rem',   // 60px
    '7xl': '4.5rem',    // 72px
  },

  // Line heights
  lineHeights: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
} as const;

// ============================================
// SPACING (8px base unit)
// ============================================
export const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',   // 2px
  1: '0.25rem',      // 4px
  1.5: '0.375rem',   // 6px
  2: '0.5rem',       // 8px
  2.5: '0.625rem',   // 10px
  3: '0.75rem',      // 12px
  3.5: '0.875rem',   // 14px
  4: '1rem',         // 16px
  5: '1.25rem',      // 20px
  6: '1.5rem',       // 24px
  7: '1.75rem',      // 28px
  8: '2rem',         // 32px
  9: '2.25rem',      // 36px
  10: '2.5rem',      // 40px
  12: '3rem',        // 48px - Section gaps
  16: '4rem',        // 64px
  20: '5rem',        // 80px
  24: '6rem',        // 96px
  32: '8rem',        // 128px
} as const;

// ============================================
// BORDER RADIUS
// ============================================
export const radius = {
  none: '0',
  sm: '0.125rem',     // 2px
  DEFAULT: '0.25rem', // 4px
  md: '0.375rem',     // 6px
  lg: '0.5rem',       // 8px
  xl: '0.75rem',      // 12px
  '2xl': '1rem',      // 16px
  '3xl': '1.5rem',    // 24px - Card radius
  full: '9999px',
} as const;

// ============================================
// SHADOWS - Modern Gradient Theme
// ============================================
export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',

  // Colored gradient shadows for branding
  primary: '0 10px 40px rgba(139, 92, 246, 0.25), 0 0 0 1px rgba(139, 92, 246, 0.05) inset',
  primaryHover: '0 15px 50px rgba(139, 92, 246, 0.35), 0 0 0 1px rgba(139, 92, 246, 0.1) inset',
  glow: '0 0 60px rgba(139, 92, 246, 0.3), 0 0 100px rgba(236, 72, 153, 0.2)',
  card: '0 4px 20px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(139, 92, 246, 0.05) inset',
  cardHover: '0 20px 40px rgba(139, 92, 246, 0.12), 0 0 0 1px rgba(139, 92, 246, 0.1) inset',
} as const;

// ============================================
// ANIMATION
// ============================================
export const animation = {
  // Durations
  duration: {
    instant: '100ms',
    fast: '150ms',
    normal: '200ms',
    slow: '300ms',
    slower: '500ms',
    progress: '800ms',    // For progress bars
    long: '1500ms',        // For long animations
    extended: '2000ms',    // For celebration effects
    transition: '200ms',   // For page transitions
  },

  // Easing functions
  easing: {
    DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
    in: 'cubic-bezier(0.4, 0, 1, 1)',
    out: 'cubic-bezier(0, 0, 0.2, 1)',
    bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },

  // Transitions
  transition: {
    DEFAULT: 'all 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    colors: 'background-color 200ms cubic-bezier(0.4, 0, 0.2, 1), border-color 200ms cubic-bezier(0.4, 0, 0.2, 1)',
    transform: 'transform 200ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
} as const;

// ============================================
// Z-INDEX SCALE
// ============================================
export const zIndex = {
  base: 0,
  dropdown: 10,
  sticky: 20,
  fixed: 30,
  modalBackdrop: 40,
  modal: 50,
  popover: 60,
  tooltip: 70,
} as const;

// ============================================
// BREAKPOINTS
// ============================================
export const breakpoints = {
  xs: '375px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const;

// ============================================
// COMPONENT SPECIFIC TOKENS
// ============================================
export const components = {
  // Button
  button: {
    height: {
      sm: '2.25rem',   // 36px
      md: '2.75rem',   // 44px - Min touch target
      lg: '3rem',      // 48px
      xl: '3.5rem',    // 56px
    },
    padding: {
      sm: '0.5rem 1rem',
      md: '0.75rem 1.5rem',
      lg: '1rem 2rem',
    },
  },

  // Card
  card: {
    padding: {
      sm: '1rem',
      md: '1.5rem',
      lg: '2rem',
    },
  },

  // Input
  input: {
    height: {
      sm: '2.5rem',
      md: '3rem',
      lg: '3.5rem',
    },
    padding: '0.75rem 1rem',
  },

  // Progress Ring
  progressRing: {
    size: {
      sm: 120,
      md: 180,
      lg: 240,
    },
    strokeWidth: 16,
  },
} as const;

// ============================================
// MEAL TYPE COLORS - Modern Palette
// ============================================
export const mealTypes = {
  breakfast: {
    color: '#F59E0B', // Amber
    bg: '#FEF3C7',
    gradient: 'from-amber-400 to-orange-400',
    label: 'Breakfast',
  },
  lunch: {
    color: '#10B981', // Emerald
    bg: '#D1FAE5',
    gradient: 'from-emerald-400 to-teal-400',
    label: 'Lunch',
  },
  dinner: {
    color: '#8B5CF6', // Purple
    bg: '#EDE9FE',
    gradient: 'from-violet-400 to-purple-400',
    label: 'Dinner',
  },
  snack: {
    color: '#06B6D4', // Cyan
    bg: '#CFFAFE',
    gradient: 'from-cyan-400 to-blue-400',
    label: 'Snack',
  },
} as const;

// ============================================
// GOAL TYPE COLORS - Modern Gradient Theme
// ============================================
export const goalTypes = {
  lose: {
    color: '#06B6D4', // Cyan
    gradient: 'from-cyan-400 to-blue-500',
    icon: 'TrendingDown',
  },
  maintain: {
    color: '#10B981', // Emerald
    gradient: 'from-emerald-400 to-teal-400',
    icon: 'Minus',
  },
  gain: {
    color: '#F59E0B', // Amber
    gradient: 'from-amber-400 to-orange-400',
    icon: 'TrendingUp',
  },
  health: {
    color: '#8B5CF6', // Purple
    gradient: 'from-violet-400 to-purple-500',
    icon: 'Apple',
  },
  energy: {
    color: '#EC4899', // Pink
    gradient: 'from-pink-400 to-rose-400',
    icon: 'Zap',
  },
} as const;

// ============================================
// TYPE EXPORTS
// ============================================
export type Color = typeof colors;
export type Typography = typeof typography;
export type Spacing = typeof spacing;
export type Radius = typeof radius;
export type Shadow = typeof shadows;
export type Animation = typeof animation;
export type ZIndex = typeof zIndex;
export type Breakpoint = typeof breakpoints;
export type Components = typeof components;

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Get meal type configuration
 */
export function getMealType(type: keyof typeof mealTypes) {
  return mealTypes[type] || mealTypes.snack;
}

/**
 * Get goal type configuration
 */
export function getGoalType(type: keyof typeof goalTypes) {
  return goalTypes[type] || goalTypes.health;
}

/**
 * Check if color meets WCAG AA contrast ratio (4.5:1)
 */
export function meetsContrast(foreground: string, background: string): boolean {
  // Simplified contrast check - full implementation would use a contrast library
  const fgLum = getLuminance(foreground);
  const bgLum = getLuminance(background);
  const contrast = (Math.max(fgLum, bgLum) + 0.05) / (Math.min(fgLum, bgLum) + 0.05);
  return contrast >= 4.5;
}

function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;

  const [r, g, b] = rgb.map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });

  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : null;
}
