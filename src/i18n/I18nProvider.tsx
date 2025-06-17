'use client';

import { createContext, useContext, ReactNode } from 'react';
import en from './en.json';
import fr from './fr.json';

type Locale = 'en' | 'fr';

const messages = { en, fr } as const;

interface I18nContextValue {
  locale: Locale;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextValue>({
  locale: 'en',
  t: (key: string) => key,
});

export function I18nProvider({ locale = 'en', children }: { locale?: Locale; children: ReactNode }) {
  const t = (key: string) => {
    const dictionary = messages[locale] as Record<string, string>;
    return dictionary[key] ?? key;
  };
  return (
    <I18nContext.Provider value={{ locale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useTranslation() {
  return useContext(I18nContext);
}
