import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import i18n from '../i18n/config';

type Language = 'en' | 'id' | 'jw';

interface LanguageContextType {
  language: Language;
  changeLanguage: (lang: Language) => void;
  languages: { code: Language; name: string; label: string }[];
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<Language>((i18n.language as Language) || 'id');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng') as Language;
    if (savedLanguage && ['en', 'id', 'jw'].includes(savedLanguage)) {
      setLanguage(savedLanguage);
    }
  }, []);

  const changeLanguage = (lang: Language) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
  };

  const languages = [
    { code: 'en' as Language, name: 'English', label: 'English' },
    { code: 'id' as Language, name: 'Bahasa Indonesia', label: 'Indonesia' },
    { code: 'jw' as Language, name: 'Basa Jawa', label: 'Jawa' }
  ];

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, languages }}>
      {children}
    </LanguageContext.Provider>
  );
};
