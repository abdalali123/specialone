import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { LanguageSwitcher } from '@/components/experience/LanguageSwitcher';
import { ExperiencePhases } from '@/components/experience/ExperiencePhases';
import { defaultConfig, ExperienceConfig } from '@/config/experience';
import { useAudioManager } from '@/hooks/useAudioManager';

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
  const [landingTrack, setLandingTrack] = useState<string>();
  const landingAudioRef = useRef<HTMLAudioElement | null>(null);
  const audio = useAudioManager();

  // RTL support and font
  useEffect(() => {
    document.body.dir = language === 'ar' ? 'rtl' : 'ltr';
    document.body.style.fontFamily = language === 'ar' ? 'var(--font-ar)' : 'var(--font-en)';
  }, [language]);

  // Load saved config
  useEffect(() => {
    try {
      const saved = localStorage.getItem('birthday-config');
      if (saved) {
        const parsed = JSON.parse(saved);
        setConfig({ ...defaultConfig, ...parsed });
        if (parsed.language) setLanguage(parsed.language);
      }
    } catch {}
  }, []);

  // Pick random music
  useEffect(() => {
    if (MUSIC_TRACKS.length > 0) {
      const random = MUSIC_TRACKS[Math.floor(Math.random() * MUSIC_TRACKS.length)];
      setLandingTrack(random);
    }
  }, []);

  const handleLanguageChange = (lang: 'en' | 'ar' | 'ru') => {
    setLanguage(lang);
    setConfig(prev => ({ ...prev, language: lang }));
  };

  const handleStart = () => {
    if (isTransitioning) return;
    setIsTransitioning(true);

    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

    if (landingAudioRef.current) {
      landingAudioRef.current.load(); // ensure it's loaded
      landingAudioRef.current.play().catch(err => console.warn("Audio play failed:", err));
    }

    setTimeout(() => setHasEnteredExperience(true), 500);
  };

  const handleExit = () => {
    if (landingAudioRef.current) {
      landingAudioRef.current.pause();
      landingAudioRef.current.currentTime = 0;
    }
    audio.stopAll();
    navigate('/normal-birthday');
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white" role="main" aria-label="Birthday Landing Gateway">

      <LanguageSwitcher currentLang={language} onLanguageChange={handleLanguageChange} />

      {/* Landing */}
      {!hasEnteredExperience && (
        <div className="relative flex min-h-screen flex-col items-center justify-center px-6">
          {landingTrack && (
            <audio ref={landingAudioRef} src={landingTrack} loop preload="auto" />
          )}

          <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <video className="h-full w-full object-cover" src="/video/birthday-cake-intro.mp4" autoPlay loop muted playsInline />
            <div className="absolute inset-0 bg-black/60" />
          </div>

          <section id="main-content" className="relative z-10 flex w-full max-w-md flex-col items-center text-center gap-4">
            <p className="tracking-[0.2em] text-xs uppercase opacity-80">HAPPY BIRTHDAY, TO YOU</p>
            <h1 className="text-3xl sm:text-4xl font-normal tracking-[0.2em] uppercase text-white">{config.name || 'YOU'}</h1>
            <p className="text-sm font-light opacity-80">Today is yours.</p>

            <button
              type="button"
              onClick={handleStart}
              disabled={isTransitioning}
              className="mt-6 inline-flex items-center justify-center rounded-xl px-10 py-3 text-sm font-medium tracking-[0.18em] uppercase bg-black text-white border border-white/40 shadow-[0_0_14px_rgba(255,255,255,0.18)] transition-transform duration-150 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-white focus-visible:ring-offset-black active:scale-95"
            >
              Start
            </button>
          </section>

          {isTransitioning && (
            <div className="pointer-events-none absolute inset-0 bg-black/0 animate-[fade-out_1s_ease-in_forwards]" />
          )}
        </div>
      )}

      {/* Experience */}
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

      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:p-2 focus:bg-background focus:text-foreground">Skip to main content</a>
    </main>
  );
};

export default Index;
