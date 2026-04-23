/**
 * ByteTrack Motion Variants
 *
 * Enhanced animation variants for Framer Motion based on the Vibrant & Block-based style.
 * Includes `prefers-reduced-motion` support and performance-optimized transitions.
 */

import { Variants, Transition } from 'framer-motion';
import { useState, useEffect } from 'react';
import { animation } from './design-tokens';

// ============================================
// BASE TRANSITION CONFIGS
// ============================================
export const transitions: Transition = {
  duration: parseFloat(animation.duration.normal),
  ease: [0.4, 0, 0.2, 1],
};

export const transitionsFast: Transition = {
  duration: parseFloat(animation.duration.fast),
  ease: [0, 0, 0.2, 1],
};

export const transitionsSlow: Transition = {
  duration: parseFloat(animation.duration.slow),
  ease: [0.4, 0, 0.2, 1],
};

// ============================================
// PACE TRANSITIONS
// ============================================
export function getTransition(respectReducedMotion = false): Transition {
  if (respectReducedMotion && typeof window !== 'undefined') {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      return { duration: 0 };
    }
  }
  return transitions;
}

// ============================================
// FADE ANIMATIONS
// ============================================
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: transitions,
  },
  exit: {
    opacity: 0,
    transition: { ...transitions, duration: parseFloat(animation.duration.fast) },
  },
};

export const fadeInUp: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: transitions,
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { ...transitions, duration: parseFloat(animation.duration.fast) },
  },
};

export const fadeInDown: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: transitions,
  },
  exit: {
    opacity: 0,
    y: 20,
    transition: { ...transitions, duration: parseFloat(animation.duration.fast) },
  },
};

// ============================================
// SLIDE ANIMATIONS
// ============================================
export const slideInLeft: Variants = {
  hidden: { x: 20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: transitions,
  },
  exit: {
    x: -20,
    opacity: 0,
    transition: { ...transitions, duration: parseFloat(animation.duration.fast) },
  },
};

export const slideInRight: Variants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: transitions,
  },
  exit: {
    x: 20,
    opacity: 0,
    transition: { ...transitions, duration: parseFloat(animation.duration.fast) },
  },
};

export const slideInUp: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: transitions,
  },
  exit: {
    y: -20,
    opacity: 0,
    transition: { ...transitions, duration: parseFloat(animation.duration.fast) },
  },
};

export const slideInDown: Variants = {
  hidden: { y: -20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: transitions,
  },
  exit: {
    y: 20,
    opacity: 0,
    transition: { ...transitions, duration: parseFloat(animation.duration.fast) },
  },
};

// Helper function for backward compatibility
export const slideIn = (
  direction: 'left' | 'right' | 'up' | 'down' = 'right'
): Variants => {
  switch (direction) {
    case 'left': return slideInLeft;
    case 'right': return slideInRight;
    case 'up': return slideInUp;
    case 'down': return slideInDown;
  }
};

// ============================================
// SCALE ANIMATIONS
// ============================================
export const scaleIn: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: transitionsFast,
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    transition: transitionsFast,
  },
};

export const scaleInBounce: Variants = {
  hidden: { scale: 0, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 20,
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: transitionsFast,
  },
};

// ============================================
// STAGGER ANIMATIONS
// ============================================
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0,
    },
  },
};

export const staggerContainerFast: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0,
    },
  },
};

export const staggerItem: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: transitions,
  },
};

// ============================================
// CARD ANIMATIONS
// ============================================
export const cardHover = {
  rest: {
    y: 0,
    transition: transitions,
  },
  hover: {
    y: -4,
    transition: transitions,
  },
};

export const cardPress = {
  tap: { scale: 0.98 },
};

// ============================================
// BUTTON ANIMATIONS
// ============================================
export const buttonHover = {
  rest: { scale: 1 },
  hover: { scale: 1.02 },
};

export const buttonTap = {
  tap: { scale: 0.97 },
};

// ============================================
// PROGRESS / LOADING ANIMATIONS
// ============================================
export const progressFill: Variants = {
  hidden: { width: '0%' },
  visible: (percentage: number) => ({
    width: `${percentage}%`,
    transition: {
      duration: parseFloat(animation.duration.progress),
      ease: 'easeOut',
    },
  }),
};

// Note: Shimmer animation is defined in globals.css as @keyframes shimmer
// Use the CSS animation with .skeleton class for loading states

// ============================================
// CELEBRATION ANIMATIONS
// ============================================
export const celebratePop: Variants = {
  hidden: { scale: 0, rotate: -180 },
  visible: {
    scale: [0, 1.2, 1],
    rotate: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      stiffness: 200,
      damping: 15,
    },
  },
  exit: {
    scale: 0,
    opacity: 0,
    transition: transitionsFast,
  },
};

export const confettiDrop = {
  animate: {
    y: [0, 100],
    rotate: [0, 360],
    opacity: [1, 0],
  },
  transition: {
    duration: parseFloat(animation.duration.extended),
    ease: 'easeIn',
  },
};

// ============================================
// PAGE TRANSITIONS
// ============================================
export const pageTransition: Variants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: parseFloat(animation.duration.normal),
      ease: [0, 0, 0.2, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    transition: {
      duration: parseFloat(animation.duration.fast),
    },
  },
};

// ============================================
// MODAL ANIMATIONS
// ============================================
export const modalOverlay: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: parseFloat(animation.duration.normal) },
  },
  exit: {
    opacity: 0,
    transition: { duration: parseFloat(animation.duration.fast) },
  },
};

export const modalContent: Variants = {
  hidden: {
    scale: 0.95,
    opacity: 0,
    y: 10,
  },
  visible: {
    scale: 1,
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 300,
      damping: 30,
    },
  },
  exit: {
    scale: 0.95,
    opacity: 0,
    y: 10,
    transition: { duration: parseFloat(animation.duration.fast) },
  },
};

// ============================================
// ONBOARDING STEP TRANSITIONS
// ============================================
export const stepForward: Variants = {
  enter: {
    x: '100%',
    opacity: 0,
  },
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: {
    x: '-100%',
    opacity: 0,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
};

export const stepBackward: Variants = {
  enter: {
    x: '-100%',
    opacity: 0,
  },
  center: {
    x: 0,
    opacity: 1,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
  exit: {
    x: '100%',
    opacity: 0,
    transition: {
      x: { type: 'spring', stiffness: 300, damping: 30 },
      opacity: { duration: 0.2 },
    },
  },
};

// ============================================
// LIST ANIMATIONS
// ============================================
export const listItem: Variants = {
  hidden: {
    opacity: 0,
    x: -10,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: transitions,
  },
};

export const listContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

// ============================================
// FLOATING DECORATIONS
// ============================================
export const floatUp = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

export const floatRotate = {
  animate: {
    rotate: [0, 360],
    transition: {
      duration: 20,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

export const pulseSoft = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [1, 0.8, 1],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// ============================================
// GEOMETRIC SHAPE ANIMATIONS (NEW)
// ============================================
export const geometricShape = {
  // Rotating polygon
  rotate: {
    animate: {
      rotate: [0, 360],
      transition: {
        duration: 30,
        repeat: Infinity,
        ease: 'linear',
      },
    },
  },

  // Breathing scale
  breathe: {
    animate: {
      scale: [1, 1.1, 1],
      transition: {
        duration: 3,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  // Color shift (requires CSS custom property)
  colorShift: {
    animate: {
      backgroundColor: ['#DC2626', '#F87171', '#DC2626'],
      transition: {
        duration: 5,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },

  // Polygon morph
  morph: {
    animate: {
      borderRadius: [
        '60% 40% 30% 70% / 60% 30% 70% 40%',
        '30% 60% 70% 40% / 50% 60% 30% 60%',
        '60% 40% 30% 70% / 60% 30% 70% 40%',
      ],
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: 'easeInOut',
      },
    },
  },
};

// ============================================
// HOOK: Reduced Motion
// ============================================
export function useReducedMotion() {
  if (typeof window === 'undefined') return false;

  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReduced(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mediaQuery.addEventListener('change', listener);

    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  return prefersReduced;
}

// ============================================
// UTILITY: Get Safe Animation
// ============================================
export function getSafeAnimation(
  variants: Variants,
  respectReducedMotion = true
): Variants {
  if (!respectReducedMotion || typeof window === 'undefined') {
    return variants;
  }

  // Return a no-op variant if reduced motion is preferred
  return {
    hidden: {},
    visible: {},
    exit: {},
  };
}

// React hooks imported at the top of the file