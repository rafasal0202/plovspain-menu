import { useState, useEffect } from 'react';
import { Language, translations, TranslationKey } from '@/lib/translations';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('ru');

  // Load language from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('language') as Language | null;
    if (saved && (saved === 'ru' || saved === 'es')) {
      setLanguage(saved);
    }
  }, []);

  // Save language to localStorage when it changes
  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  const t = (key: TranslationKey): string => {
    return translations[language][key] || key;
  };

  return {
    language,
    changeLanguage,
    t,
  };
}
