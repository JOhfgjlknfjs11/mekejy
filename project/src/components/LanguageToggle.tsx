import React from 'react';
import { Language } from '../hooks/useLanguage';

interface LanguageToggleProps {
  language: Language;
  onToggle: () => void;
}

export function LanguageToggle({ language, onToggle }: LanguageToggleProps) {
  return (
    <div className={`fixed top-4 z-50 ${language === 'ar' ? 'left-4' : 'right-4'}`}>
      <button
        onClick={onToggle}
        className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-3 py-2 rounded-lg hover:bg-white/20 transition-all duration-300 text-sm font-semibold"
      >
        {language === 'ar' ? 'ENG' : 'عربي'}
      </button>
    </div>
  );
}