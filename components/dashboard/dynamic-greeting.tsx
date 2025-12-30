'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { t } from '@/lib/translations';
import { useLanguage } from '@/contexts/LanguageContext';

type GreetingPeriod = 'morning' | 'afternoon' | 'evening';

const getGreeting = (): GreetingPeriod => {
  const hour = new Date().getHours();
  if (hour < 12) return 'morning';
  if (hour < 17) return 'afternoon';
  return 'evening';
};

const getGreetingEmoji = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return '👋';
  if (hour < 17) return '☀️';
  return '🌙';
};

interface DynamicGreetingProps {
  userName?: string;
}

export function DynamicGreeting({ userName }: DynamicGreetingProps) {
  const { language } = useLanguage();
  const [greeting, setGreeting] = useState<GreetingPeriod>(() => getGreeting());
  const [emoji, setEmoji] = useState(() => getGreetingEmoji());

  useEffect(() => {
    const updateGreeting = () => {
      setGreeting(getGreeting());
      setEmoji(getGreetingEmoji());
    };

    // Update greeting every minute
    const interval = setInterval(updateGreeting, 60000);

    return () => clearInterval(interval);
  }, []);

  const greetingKeys = {
    morning: 'greeting_morning_i18n',
    afternoon: 'greeting_afternoon_i18n',
    evening: 'greeting_evening_i18n',
  } as const;

  const greetingText = t(greetingKeys[greeting], language);

  return (
    <motion.div
      className="mb-12"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <h1 className="spotify-text-hero text-4xl lg:text-5xl mb-4">
        {greetingText}! {emoji}
      </h1>
      <p className="spotify-text-body text-xl">
        {t('greeting_subtitle_i18n', language)}
      </p>
    </motion.div>
  );
}
