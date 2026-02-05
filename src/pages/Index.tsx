import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from '@/components/experience/LanguageSwitcher';
import { TapOverlay } from '@/components/experience/TapOverlay';
import { ExperiencePhases } from '@/components/experience/ExperiencePhases';
import { defaultConfig, ExperienceConfig } from '@/config/experience';

const Index = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<ExperienceConfig>(defaultConfig);
  const [language, setLanguage] = useState<'en' | 'ar' | 'ru'>('en');
  const [isStarted, setIsStarted] = useState(false);
  const [showTapOverlay, setShowTapOverlay] = useState(true);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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
  
  // Handle tap to start
  const handleStart = () => {
    setShowTapOverlay(false);
    setIsStarted(true);

    // Try to start the celebration music when the user taps to begin
    if (audioRef.current) {
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          // Autoplay might be blocked by the browser; ignore errors
        });
      }
    }
  };
  
  // Handle exit to normal birthday
  const handleExit = () => {
    // Stop the music when leaving the experience
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    navigate('/normal-birthday');
  };
  
  return (
    <main
      className="relative min-h-screen overflow-hidden flex items-center justify-center bg-gradient-to-br from-pink-500 via-yellow-400 to-purple-700 text-white"
      role="main"
      aria-label="Vibrant Happy Birthday Experience"
    >
      {/* Background celebration layers */}
      <div className="pointer-events-none absolute inset-0 opacity-60 mix-blend-screen">
        <div className="absolute -left-32 -top-32 h-72 w-72 rounded-full bg-cyan-400 blur-3xl animate-pulse" />
        <div className="absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-fuchsia-500 blur-3xl animate-[pulse_7s_ease-in-out_infinite]" />
        <div className="absolute left-1/4 bottom-0 h-64 w-64 rounded-full bg-amber-300 blur-3xl animate-[pulse_5s_ease-in-out_infinite]" />
      </div>

      {/* Confetti dots */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.4),_transparent_60%),_radial-gradient(circle_at_bottom,_rgba(255,255,255,0.3),_transparent_55%)] opacity-70" />
      </div>

      {/* Celebration music (file should be placed at public/audio/celebration.mp3) */}
      <audio
        ref={audioRef}
        src={config.audio.celebration || "/audio/celebration.mp3"}
        loop
      />

      {/* Centered birthday hero content */}
      {!isStarted && (
        <section
          id="main-content"
          className="relative z-10 flex flex-col items-center gap-4 px-6 text-center max-w-xl"
        >
          <p className="text-sm tracking-[0.2em] uppercase opacity-90">
            🎉 Birthday Portal 🎉
          </p>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold drop-shadow-[0_0_20px_rgba(0,0,0,0.6)] leading-tight">
            Happy Birthday{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 via-white to-pink-100">
              {config.name || "You"}!
            </span>
          </h1>
          <p className="text-base sm:text-lg opacity-90 max-w-md">
            Turn your sound on, tap to begin, and step into a loud, colorful birthday experience made just for you.
          </p>
          <p className="text-xs uppercase tracking-[0.25em] opacity-80">
            Tap anywhere to start the show
          </p>
        </section>
      )}
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
