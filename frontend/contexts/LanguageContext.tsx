'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language, getLanguage, setLanguage as setLang } from '@/lib/translations';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('th');
  const [, setTick] = useState(0);

  // Force re-render when language changes
  useEffect(() => {
    setLanguageState(getLanguage());
  }, []);

  const setLanguage = (lang: Language) => {
    setLang(lang);
    setLanguageState(lang);
    // Force re-render to update all translated text
    setTick((prev) => prev + 1);
  };

  // Simple translation function that works with current language
  const t = (key: string): string => {
    // This will be replaced by proper t() function usage
    return key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Re-export t function for convenience
export { t as translate } from '@/lib/translations';
