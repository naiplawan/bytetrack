// Simplified animation variants for Framer Motion
import { Variants } from 'framer-motion';

// Simple fade - no movement
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

// Subtle slide up - minimal movement
export const slideUp: Variants = {
  hidden: { y: 8, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.2 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15 },
  },
};

// Subtle slide in
export const slideIn = (direction: 'left' | 'right' | 'up' | 'down'): Variants => {
  return {
    hidden: {
      x: direction === 'left' ? -8 : direction === 'right' ? 8 : 0,
      y: direction === 'up' ? 8 : direction === 'down' ? -8 : 0,
      opacity: 0,
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      transition: { duration: 0.2 },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.15 },
    },
  };
};

// Faster stagger for lists
export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0,
    },
  },
};

// Subtle scale
export const scaleIn: Variants = {
  hidden: { scale: 0.98, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.15 },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.1 },
  },
};

// Minimal button tap - very subtle
export const buttonTap = {
  tap: { scale: 0.98 },
};
