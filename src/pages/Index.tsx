import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from '@/components/experience/LanguageSwitcher';
import { ExperiencePhases } from '@/components/experience/ExperiencePhases';
import { defaultConfig, ExperienceConfig } from '@/config/experience';
import { useAudioManager } from '@/hooks/useAudioManager';

// Background music tracks served from Vite `public` root
const MUSIC_TRACKS = [
  "/music/CountingStars.mp3",
  "/music/goldenhour.mp3",
  "/music/LoveStory.mp3",
  "/music/Skyfall.mp3",
];

const Index = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<ExperienceConfig>(defaultConfig);
  const [language, setLanguage] = useState<'en' | 'ar' | 'ru'>('en');
  const [hasEnteredExperience, setHasEnteredExperience] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [landingTrack, setLandingTrack] = useState<string | undefined>(undefined);
  const landingAudioRef = useRef<HTMLAudioElement | null>(null);
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

  // Pick a random landing music track on each page load
  useEffect(() => {
    if (MUSIC_TRACKS.length > 0) {
      const random = MUSIC_TRACKS[Math.floor(Math.random() * MUSIC_TRACKS.length)];
      setLandingTrack(random);
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

    // Request fullscreen on user gesture (supported browsers only)
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {
        // Ignore failures (e.g. if browser blocks it)
      });
    }

    // Start happy track directly on user gesture (plays for whole visit)
    if (landingAudioRef.current) {
      // lower volume to about 40%
      landingAudioRef.current.volume = 0.4;
      const playPromise = landingAudioRef.current.play();
      if (playPromise && playPromise.catch) {
        playPromise.catch(() => {
          // ignore autoplay errors
        });
      }
    }

    // Short visual transition, then hand off to Phase 1
    setTimeout(() => {
      setHasEnteredExperience(true);
    }, 1000);
  };
  
  // Handle exit to normal birthday
  const handleExit = () => {
    if (landingAudioRef.current) {
      landingAudioRef.current.pause();
      landingAudioRef.current.currentTime = 0;
    }
    audio.stopAll();
    navigate('/normal-birthday');
  };
  
  return (
    <main
      className="relative min-h-screen overflow-hidden bg-black text-white"
      role="main"
      aria-label="Birthday Landing Gateway"
    >
      {/* Global hidden audio for background music (persists across phases) */}
      {landingTrack && (
        <audio ref={landingAudioRef} src={landingTrack} loop />
      )}
      {/* Language switcher */}
      <LanguageSwitcher
        currentLang={language}
        onLanguageChange={handleLanguageChange}
      />

      {/* Landing gateway */}
      {!hasEnteredExperience && (
        <div className="relative flex min-h-screen flex-col items-center justify-center px-6">
          {/* Background celebration video */}
          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <video
              className="h-full w-full object-cover"
              src="video/birthday-cake-intro.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
            {/* Dark overlay so text stays readable */}
            <div className="absolute inset-0 bg-black/60" />
          </div>

          {/* Text and CTA overlay */}
          <section
            id="main-content"
            className="relative z-10 flex w-full max-w-md flex-col items-center text-center gap-4"
          >
            <p className="tracking-[0.2em] text-xs uppercase opacity-80">
              HAPPY BIRTHDAY, TO YOU
            </p>
            <h1 className="text-3xl sm:text-4xl font-normal tracking-[0.2em] uppercase text-white">
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
              className="mt-6 inline-flex items-center justify-center rounded-xl px-10 py-3 text-sm font-medium tracking-[0.18em] uppercase bg-black text-white border border-white/40 shadow-[0_0_14px_rgba(255,255,255,0.18)] transition-transform duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-black active:scale-95"
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
