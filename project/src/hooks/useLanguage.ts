import { useState, useCallback } from 'react';

export type Language = 'ar' | 'en';

export function useLanguage() {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = useCallback(() => {
    setLanguage(prev => prev === 'en' ? 'ar' : 'en');
  }, []);

  const setToArabic = useCallback(() => {
    setLanguage('ar');
  }, []);

  const setToEnglish = useCallback(() => {
    setLanguage('en');
  }, []);

  return {
    language,
    toggleLanguage,
    setToArabic,
    setToEnglish,
    isArabic: language === 'ar',
    isEnglish: language === 'en'
  };
}