'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown, Languages } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import { t, type Language } from '@/lib/translations';

export const LanguageToggle = () => {
  const { language: currentLang, setLanguage: setLang } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleLanguageChange = (lang: Language) => {
    setLang(lang);
    setIsOpen(false);
  };

  const languages = [
    { code: 'th' as Language, name: 'ไทย', flag: '🇹🇭', nameEn: 'Thai' },
    { code: 'en' as Language, name: 'English', flag: '🇺🇸', nameEn: 'English' },
  ];

  const currentLanguageData = languages.find((lang) => lang.code === currentLang) || languages[0];

  return (
    <div className="fixed left-4 bottom-4 sm:top-1/2 sm:bottom-auto sm:-translate-y-1/2 z-50">
      <motion.div
        className="relative"
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      >
        {/* Main Toggle Button */}
        <motion.button
          id="language-toggle-button"
          onClick={() => setIsOpen(!isOpen)}
          className="group flex items-center gap-2 sm:gap-3 bg-background/90 backdrop-blur-xl border border-border/50 rounded-full px-3 sm:px-4 py-2.5 sm:py-3 shadow-lg hover:shadow-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
          whileHover={{ scale: 1.05, x: 5 }}
          whileTap={{ scale: 0.95 }}
          aria-label={`Change language. Current language: ${currentLanguageData.nameEn}`}
          aria-expanded={isOpen}
          aria-haspopup="listbox"
        >
          <div className="flex items-center gap-2">
            <Languages className="w-4 h-4 text-primary" aria-hidden="true" />
            <span className="text-lg" aria-hidden="true">{currentLanguageData.flag}</span>
            <span className="text-sm font-medium text-foreground hidden sm:group-hover:block transition-all duration-200">
              {currentLanguageData.nameEn}
            </span>
          </div>
          <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          </motion.div>
        </motion.button>

        {/* Dropdown Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              className="absolute bottom-full sm:top-full sm:bottom-auto left-0 mb-2 sm:mb-0 sm:mt-2 w-48 bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl overflow-hidden"
              role="listbox"
              aria-orientation="vertical"
              aria-labelledby="language-toggle-button"
            >
              <div className="p-2">
                <div className="text-xs font-medium text-muted-foreground px-3 py-2 border-b border-border/30" role="none">
                  {t('language_toggle_i18n', currentLang)}
                </div>
                {languages.map((language) => (
                  <motion.button
                    key={language.code}
                    onClick={() => handleLanguageChange(language.code)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset ${
                      currentLang === language.code
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-accent/50 text-foreground'
                    }`}
                    whileHover={{ x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    role="option"
                    aria-selected={currentLang === language.code}
                    tabIndex={0}
                  >
                    <span className="text-lg" aria-hidden="true">{language.flag}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{language.name}</div>
                      <div className="text-xs text-muted-foreground">{language.nameEn}</div>
                    </div>
                    {currentLang === language.code && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="w-2 h-2 bg-primary rounded-full"
                        aria-hidden="true"
                      />
                    )}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </motion.div>
    </div>
  );
};

export default LanguageToggle;
