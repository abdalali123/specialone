import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from '@/components/experience/LanguageSwitcher';
import { ExperiencePhases } from '@/components/experience/ExperiencePhases';
import { defaultConfig, ExperienceConfig } from '@/config/experience';
import { useAudioManager } from '@/hooks/useAudioManager';
import { useGyroscope } from '@/hooks/useGyroscope';

const Index = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<ExperienceConfig>(defaultConfig);
  const [language, setLanguage] = useState<'en' | 'ar' | 'ru'>('en');
  const [hasEnteredExperience, setHasEnteredExperience] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const audio = useAudioManager();
  const gyro = useGyroscope(true);
  
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
      className="relative min-h-screen overflow-hidden bg-[#0b0b0f] text-[#f5f7fa]"
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
          {/* Animated gradient blobs */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div
              className="absolute -left-24 -top-32 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_center,#00e6ff_0%,transparent_70%)] opacity-60"
              style={{
                transform: `translate3d(${gyro.x * 18}px, ${gyro.y * 10}px, 0)`,
              }}
            />
            <div
              className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-[radial-gradient(circle_at_center,#ff4ecd_0%,transparent_70%)] opacity-55"
              style={{
                transform: `translate3d(${gyro.x * -16}px, ${gyro.y * 8}px, 0)`,
              }}
            />
            <div
              className="absolute left-1/4 bottom-[-4rem] h-64 w-64 rounded-full bg-[radial-gradient(circle_at_center,#ffd166_0%,transparent_70%)] opacity-45"
              style={{
                transform: `translate3d(${gyro.x * 10}px, ${gyro.y * -6}px, 0)`,
              }}
            />
            {/* Soft noise overlay */}
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,#ffffff0f,transparent_60%)] mix-blend-screen opacity-70" />
          </div>

          {/* Floating confetti dots */}
          <div className="pointer-events-none absolute inset-0">
            {Array.from({ length: 26 }).map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-white/30"
                style={{
                  left: `${(i * 37) % 100}%`,
                  top: `${(i * 19) % 100}%`,
                  width: `${2 + (i % 4)}px`,
                  height: `${2 + (i % 4)}px`,
                  opacity: 0,
                  animation: `particle-float ${
                    14 + (i % 8)
                  }s ease-in-out ${(i % 7) * 0.7}s infinite`,
                }}
              />
            ))}
          </div>

          {/* Text stack */}
          <section
            id="main-content"
            className="relative z-10 flex w-full max-w-md flex-col items-center text-center gap-4"
          >
            <p className="tracking-[0.2em] text-xs uppercase opacity-80">
              HAPPY BIRTHDAY
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
              className="mt-4 inline-flex items-center justify-center rounded-xl px-8 py-3 text-sm font-medium tracking-[0.18em] uppercase bg-[linear-gradient(135deg,#00e6ff,#ff4ecd)] text-[#0b0b0f] shadow-[0_0_20px_rgba(0,230,255,0.35)] transition-transform transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#00e6ff] focus-visible:ring-offset-[#0b0b0f] active:scale-95"
              style={{
                transform: isTransitioning ? 'scale(0.98)' : undefined,
              }}
            >
              <span className="mr-2">🎉</span>
              <span>Start the celebration</span>
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
