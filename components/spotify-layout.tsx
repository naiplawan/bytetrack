'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SpotifyNav } from '@/components/spotify-nav';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface SpotifyLayoutProps {
  children: React.ReactNode;
  currentPath?: string;
}

export const SpotifyLayout: React.FC<SpotifyLayoutProps> = ({ children, currentPath }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Handle responsive detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [currentPath]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <div className="min-h-screen bg-background spotify-scrollbar">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-background/95 backdrop-blur-xl border-b border-border/20 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary spotify-glow" aria-hidden="true" />
            <span className="font-bold text-xl spotify-text-gradient">CalorieDiary</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6" aria-hidden="true" />
            ) : (
              <Menu className="w-6 h-6" aria-hidden="true" />
            )}
          </Button>
        </div>
      </header>

      {/* Mobile Navigation Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="lg:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-hidden="true"
            />

            {/* Slide-in Navigation */}
            <motion.aside
              id="mobile-navigation"
              className="lg:hidden fixed top-0 left-0 z-50 w-80 h-full bg-background border-r border-border/20 shadow-2xl"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              role="dialog"
              aria-modal="true"
              aria-label="Navigation menu"
            >
              <div className="p-4">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-primary spotify-glow" aria-hidden="true" />
                    <span className="font-bold text-xl spotify-text-gradient">CalorieDiary</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon-sm"
                    onClick={() => setIsMobileMenuOpen(false)}
                    aria-label="Close navigation menu"
                  >
                    <X className="w-5 h-5" aria-hidden="true" />
                  </Button>
                </div>
                <SpotifyNav currentPath={currentPath} isMobile onNavigate={() => setIsMobileMenuOpen(false)} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex gap-6 p-4 lg:p-6 pt-20 lg:pt-6">
        {/* Desktop Sidebar Navigation */}
        <aside className="hidden lg:block w-80 flex-shrink-0" aria-label="Main navigation">
          <div className="sticky top-6">
            <SpotifyNav currentPath={currentPath} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0" role="main">
          <div className="spotify-backdrop rounded-2xl p-4 sm:p-6 lg:p-8 min-h-[calc(100vh-6rem)] lg:min-h-[calc(100vh-3rem)]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};
