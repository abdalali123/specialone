import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from '@/components/experience/LanguageSwitcher';
import { ExperiencePhases } from '@/components/experience/ExperiencePhases';
import { defaultConfig, ExperienceConfig } from '@/config/experience';
import { useAudioManager } from '@/hooks/useAudioManager';

const Index = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<ExperienceConfig>(defaultConfig);
  const [language, setLanguage] = useState<'en' | 'ar' | 'ru'>('en');
  const [hasEnteredExperience, setHasEnteredExperience] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
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

  // Handle language change
  const handleLanguageChange = (lang: 'en' | 'ar' | 'ru') => {
    setLanguage(lang);
    setConfig(prev => ({ ...prev, language: lang }));
  };
  
  // Handle CTA click from the landing page
  const handleStart = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    // Start happy track directly on user gesture
    audio.playCelebration(config.audio.celebration);

    // Short transition, then hand off to Phase 1
    setTimeout(() => {
      audio.stopAll();
      setHasEnteredExperience(true);
    }, 1000);
  };
  
  // Handle exit to normal birthday
  const handleExit = () => {
    audio.stopAll();
    navigate('/normal-birthday');
  };
  
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-[#050509] text-[#f5f7fa]"
      role="main"
      aria-label="Birthday Landing Gateway"
    >
      {/* Language switcher */}
      <LanguageSwitcher
        currentLang={language}
        onLanguageChange={handleLanguageChange}
      />

      {/* Landing gateway */}
      {!hasEnteredExperience && (
        <div className="relative flex min-h-screen flex-col items-center justify-center px-6">
          {/* Torch-lit corridor background */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            {/* Left wall torch glow */}
            <div className="absolute inset-y-0 left-0 w-1/3 bg-[radial-gradient(circle_at_20%_50%,rgba(255,209,102,0.35),transparent_60%)] opacity-80" />
            {/* Right wall torch glow */}
            <div className="absolute inset-y-0 right-0 w-1/3 bg-[radial-gradient(circle_at_80%_50%,rgba(255,209,102,0.35),transparent_60%)] opacity-80" />
            {/* Floor fade */}
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-[radial-gradient(circle_at_50%_120%,rgba(0,0,0,0),rgba(0,0,0,0.9))]" />
            {/* Subtle vertical bands to suggest a space */}
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_0,transparent_4%,transparent_96%,rgba(255,255,255,0.03)_100%)]" />
          </div>

          {/* Text stack */}
          <section
            id="main-content"
            className="relative z-10 flex w-full max-w-md flex-col items-center text-center gap-4"
          >
            <p className="tracking-[0.2em] text-xs uppercase opacity-80">
              HAPPY BIRTHDAY, TO YOU
            </p>
            <h1 className="text-3xl sm:text-4xl font-normal tracking-[0.2em] uppercase text-[#f5f7fa]">
              {config.name || 'YOU'}
            </h1>
            <p className="text-sm font-light opacity-80">
              Today is yours.
            </p>

            {/* CTA */}
            <button
              type="button"
              onClick={handleStart}
              disabled={isTransitioning}
              className="mt-4 inline-flex items-center justify-center rounded-xl px-10 py-3 text-sm font-medium tracking-[0.18em] uppercase bg-black/90 text-white border border-white/30 shadow-[0_0_18px_rgba(0,0,0,0.9)] transition-transform duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-[#050509] active:scale-95"
              style={{
                transform: isTransitioning ? 'scale(0.98)' : undefined,
              }}
            >
              <span>Start</span>
            </button>
          </section>

          {/* Fade to black during transition */}
          {isTransitioning && (
            <div className="pointer-events-none absolute inset-0 bg-black/0 animate-[fade-out_1s_ease-in_forwards]" />
          )}
        </div>
      )}

      {/* Main experience (Phase 1 and onward) */}
      {hasEnteredExperience && (
        <ExperiencePhases
          config={config}
          language={language}
          isStarted={true}
          onExit={handleExit}
          audio={audio}
          initialPhase={1}
        />
      )}

      {/* Accessibility: Skip to content */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-2 focus:bg-background focus:text-foreground"
      >
        Skip to main content
      </a>
    </main>
  );
};

export default Index;
