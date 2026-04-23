import enDict from '../locales/en.json';
import thDict from '../locales/th.json';

export type Language = 'en' | 'th';

export const en = enDict;
export const th = thDict;

export type TranslationKeys = keyof typeof enDict;

const LANG_STORAGE_KEY = 'preferred-language';
let currentLanguage: Language = 'th';

export const setLanguage = (lang: Language): void => {
  currentLanguage = lang;
  if (typeof window !== 'undefined') {
    localStorage.setItem(LANG_STORAGE_KEY, lang);
  }
};

export const getLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(LANG_STORAGE_KEY);
    if (stored === 'en' || stored === 'th') return stored;
  }
  return currentLanguage;
};

export const getTranslations = (lang?: Language): Record<TranslationKeys, string> => {
  return (lang ?? getLanguage()) === 'en' ? enDict : thDict;
};

export const t = (key: TranslationKeys, lang?: Language): string => {
  return getTranslations(lang)[key];
};

// Legacy alias kept for any older imports.
export const thaiTranslations = thDict;
