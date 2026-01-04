'use client';

import { useEffect } from 'react';
import { getLanguage } from '@/lib/translations';

export function LangProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Update document lang attribute when language changes
    const lang = getLanguage();
    document.documentElement.lang = lang;
  }, []);

  return <>{children}</>;
}
