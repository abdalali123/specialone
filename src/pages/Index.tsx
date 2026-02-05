import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from '@/components/experience/LanguageSwitcher';
import { TapOverlay } from '@/components/experience/TapOverlay';
import { ExperiencePhases } from '@/components/experience/ExperiencePhases';
import { defaultConfig, ExperienceConfig } from '@/config/experience';
import { useAudioManager } from '@/hooks/useAudioManager';

const Index = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<ExperienceConfig>(defaultConfig);
  const [language, setLanguage] = useState<'en' | 'ar' | 'ru'>('en');
  const [isStarted, setIsStarted] = useState(false);
  const [showTapOverlay, setShowTapOverlay] = useState(true);
  const audio = useAudioManager();
  
  // Update document direction for RTL languages
  useEffect(() => {
    document.body.dir = language === 'ar' ? 'rtl' : 'ltr';
    
    // Update font family
    if (language === 'ar') {
      document.body.style.fontFamily = 'var(--font-ar)';
    } else {
      document.body.style.fontFamily = 'var(--font-en)';
    }
  }, [language]);
  
  // Load config from localStorage if available
  useEffect(() => {
    try {
      const savedConfig = localStorage.getItem('birthday-config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        setConfig({ ...defaultConfig, ...parsed });
        if (parsed.language) {
          setLanguage(parsed.language);
        }
      }
    } catch (e) {
      console.log('No saved config found');
    }
  }, []);

  // Preload audio when config changes
  useEffect(() => {
    audio.preloadAudio(config.audio);
  }, [audio, config.audio]);
  
  // Handle language change
  const handleLanguageChange = (lang: 'en' | 'ar' | 'ru') => {
    setLanguage(lang);
    setConfig(prev => ({ ...prev, language: lang }));
  };
  
  // Handle tap to start
  const handleStart = () => {
    setShowTapOverlay(false);
    setIsStarted(true);

    // IMPORTANT: Start audio directly on the user gesture (tap/click),
    // otherwise many browsers will block autoplay.
    audio.playCelebration(config.audio.celebration);
  };
  
  // Handle exit to normal birthday
  const handleExit = () => {
    audio.stopAll();
    navigate('/normal-birthday');
  };
  
  return (
    <main
      className="relative min-h-screen overflow-hidden"
      style={{ background: 'hsl(0 0% 0%)' }}
      role="main"
      aria-label="Black Mature Birthday Experience"
    >
      {/* Language switcher - always visible */}
      <LanguageSwitcher
        currentLang={language}
        onLanguageChange={handleLanguageChange}
      />
      
      {/* Tap to begin overlay */}
      <TapOverlay
        isVisible={showTapOverlay}
        language={language}
        onTap={handleStart}
      />
      
      {/* Main experience phases */}
      {isStarted && (
        <ExperiencePhases
          config={config}
          language={language}
          isStarted={isStarted}
          onExit={handleExit}
          audio={audio}
        />
      )}
      
      {/* Accessibility: Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-2 focus:bg-background focus:text-foreground"
      >
        Skip to main content
      </a>
      
      {/* High contrast toggle for accessibility */}
      <button
        className="fixed bottom-4 left-4 z-50 hint-text opacity-30 hover:opacity-60 transition-opacity"
        onClick={() => {
          document.documentElement.classList.toggle('high-contrast');
        }}
        aria-label="Toggle high contrast mode"
      >
        ◐
      </button>
    </main>
  );
};

export default Index;
