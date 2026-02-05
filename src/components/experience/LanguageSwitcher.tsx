import { cn } from '@/lib/utils';

interface LanguageSwitcherProps {
  currentLang: 'en' | 'ar' | 'ru';
  onLanguageChange: (lang: 'en' | 'ar' | 'ru') => void;
}

export const LanguageSwitcher = ({ currentLang, onLanguageChange }: LanguageSwitcherProps) => {
  const languages: Array<{ code: 'en' | 'ar' | 'ru'; label: string }> = [
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'ع' },
    { code: 'ru', label: 'RU' },
  ];
  
  return (
    <div className="lang-switcher" role="navigation" aria-label="Language selector">
      {languages.map((lang) => (
        <button
          key={lang.code}
          className={cn('lang-btn', currentLang === lang.code && 'active')}
          onClick={() => onLanguageChange(lang.code)}
          aria-label={`Switch to ${lang.code === 'ar' ? 'Arabic' : lang.code === 'ru' ? 'Russian' : 'English'}`}
          aria-current={currentLang === lang.code ? 'true' : undefined}
        >
          {lang.label}
        </button>
      ))}
    </div>
  );
};
