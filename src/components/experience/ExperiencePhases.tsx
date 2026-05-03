import { useState, useEffect, useCallback, useMemo } from 'react';
import { ChaosPhase } from './ChaosPhase';
import { PhaseText } from './PhaseText';
import { FadeLine } from './FadeLine';
import { ChoiceButtons } from './ChoiceButtons';
import { t, getCurrentTime, ExperienceConfig } from '@/config/experience';
import { useAudioManager } from '@/hooks/useAudioManager';
import { saveLoveMessage } from '@/lib/loveApi';

type Phase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

/** Hold each love-letter line longer when the line is long (readable pace + phase timer stays in sync). */
function estimateLineReadMs(line: string): number {
  const s = line.trim();
  const base = 3600;
  const perChar = 42;
  const minHold = 4200;
  const maxHold = 20000;
  return Math.min(maxHold, Math.max(minHold, base + s.length * perChar));
}

interface ExperiencePhasesProps {
  config: ExperienceConfig;
  language: 'en' | 'ar' | 'ru';
  isStarted: boolean;
  onExit: () => void;
  audio: ReturnType<typeof useAudioManager>;
  initialPhase?: Phase;
}

export const ExperiencePhases = ({
  config,
  language,
  isStarted,
  onExit,
  audio,
  initialPhase = 0,
}: ExperiencePhasesProps) => {
  const [currentPhase, setCurrentPhase] = useState<Phase>(initialPhase);
  const [userChoice, setUserChoice] = useState<'yes' | 'no' | null>(null);
  const [showButtons, setShowButtons] = useState(false);
  const [isCutActive, setIsCutActive] = useState(false);
  const [noPressCount, setNoPressCount] = useState(0);
  const [isLoveAccepted, setIsLoveAccepted] = useState(false);
  const [burstSeed, setBurstSeed] = useState(0);
  const [showInputBox, setShowInputBox] = useState(false);
  const [loveText, setLoveText] = useState('');
  const [showLengthPrompt, setShowLengthPrompt] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showFinalLoveText, setShowFinalLoveText] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [phase7LineIndex, setPhase7LineIndex] = useState(0);
  const [finalLoveVisible, setFinalLoveVisible] = useState(false);
  const [heartParticles] = useState(() =>
    Array.from({ length: 28 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 16 + Math.random() * 14,
      duration: 6 + Math.random() * 6,
      delay: Math.random() * 4,
      drift: -20 + Math.random() * 40,
    })),
  );

  // Stop all audio when unmounting
  useEffect(() => {
    return () => audio.stopAll();
  }, [audio]);

  // Phase 0 - Chaos
  useEffect(() => {
    if (!isStarted || currentPhase !== 0) return;

    const timer = setTimeout(() => {
      audio.stopCelebration();
      setIsCutActive(true);

      setTimeout(() => {
        setIsCutActive(false);
        setCurrentPhase(1);
      }, config.timings.cut);
    }, config.timings.phase0);

    return () => clearTimeout(timer);
  }, [isStarted, currentPhase, config.timings, audio]);

  // Phase 1 - Show buttons
  useEffect(() => {
    if (currentPhase !== 1) return;

    const timer = setTimeout(() => setShowButtons(true), config.timings.btnDelay);
    return () => clearTimeout(timer);
  }, [currentPhase, config.timings.btnDelay]);

  const handleChoice = useCallback((choice: 'yes' | 'no') => {
    setUserChoice(choice);
    setShowButtons(false);
    setCurrentPhase(2);
  }, []);

  const finalLines = useMemo(
    () => t('finalParagraph', language) as string[],
    [language],
  );
  const phase7EndBufferMs = 12000;
  const phase7TotalReadMs = useMemo(
    () => finalLines.reduce((sum, line) => sum + estimateLineReadMs(line), 0),
    [finalLines],
  );

  const heartKeyframesCss = useMemo(
    () =>
      heartParticles
        .map((h) => {
          const drift = h.drift;
          return `@keyframes heart-rise-${h.id} {
  0% { transform: translate3d(-50%, 12vh, 0) scale(0.88); opacity: 0; }
  12% { opacity: 0.92; }
  100% { transform: translate3d(calc(-50% + ${drift}px), -130vh, 0) scale(1.12); opacity: 0; }
}`;
        })
        .join('\n'),
    [heartParticles],
  );

  // Auto-phase progression (2 → 8)
  useEffect(() => {
    if (currentPhase < 2 || currentPhase > 8) return;

    const phaseDurations: Record<number, number> = {
      2: 8200,
      3: 11500,
      4: 9200,
      5: 7800,
      6: 9800,
      7: Math.max(90000, phase7TotalReadMs + phase7EndBufferMs),
      8: 11000,
    };

    const timer = setTimeout(() => {
      setCurrentPhase((prev) => (prev < 8 ? (prev + 1) as Phase : 9));
    }, phaseDurations[currentPhase] || 6000);

    return () => clearTimeout(timer);
  }, [currentPhase, finalLines.length, phase7TotalReadMs, phase7EndBufferMs]);

  const replacements = { name: config.name, time: getCurrentTime() };
  const showLoveBackground = currentPhase >= 7;
  const mergedYes = noPressCount >= 4;
  const yesScale = Math.min(1 + noPressCount * 0.22, 2.2);
  const mergedYesScale = Math.min(1.7 + Math.max(0, noPressCount - 4) * 0.18, 3);

  useEffect(() => {
    if (!showInputBox || !loveText.trim()) {
      setShowLengthPrompt(false);
      return;
    }

    const timer = setTimeout(() => setShowLengthPrompt(true), 1000);
    return () => clearTimeout(timer);
  }, [loveText, showInputBox]);

  useEffect(() => {
    if (currentPhase !== 7) {
      setPhase7LineIndex(0);
      return;
    }

    let lineIndex = 0;
    let timeoutId: ReturnType<typeof setTimeout>;

    const advance = () => {
      const line = finalLines[lineIndex] ?? '';
      const delay = estimateLineReadMs(line);
      timeoutId = window.setTimeout(() => {
        if (lineIndex >= finalLines.length - 1) return;
        lineIndex += 1;
        setPhase7LineIndex(lineIndex);
        advance();
      }, delay);
    };

    setPhase7LineIndex(0);
    advance();

    return () => window.clearTimeout(timeoutId);
  }, [currentPhase, finalLines]);

  const handleNoPress = () => {
    setNoPressCount((prev) => prev + 1);
  };

  const handleYesPress = () => {
    setIsLoveAccepted(true);
    setBurstSeed((prev) => prev + 1);
    setTimeout(() => setShowInputBox(true), 1100);
  };

  const handleSubmitLoveText = async () => {
    const trimmed = loveText.trim();
    if (!trimmed) return;
    setSubmitError('');
    setIsSubmitting(true);

    try {
      await saveLoveMessage(trimmed);
      localStorage.setItem('love-message', trimmed);
      setTimeout(() => setShowFinalLoveText(true), 1200);
    } catch (error) {
      setIsSubmitting(false);
      setSubmitError('Could not save online right now. Please try again.');
    }
  };

  useEffect(() => {
    if (!showFinalLoveText) {
      setFinalLoveVisible(false);
      return;
    }

    requestAnimationFrame(() => {
      requestAnimationFrame(() => setFinalLoveVisible(true));
    });
  }, [showFinalLoveText]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-black text-white">
      {showLoveBackground && (
        <>
          <div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
            {heartParticles.map((heart) => (
              <span
                key={`heart-${heart.id}`}
                className="absolute inline-block text-rose-400/90 [backface-visibility:hidden]"
                style={{
                  left: `${heart.left}%`,
                  bottom: '-6vh',
                  fontSize: `${heart.size}px`,
                  animationName: `heart-rise-${heart.id}`,
                  animationDuration: `${heart.duration}s`,
                  animationTimingFunction: 'cubic-bezier(0.24, 0.92, 0.32, 0.96)',
                  animationDelay: `${heart.delay}s`,
                  animationIterationCount: 'infinite',
                  animationFillMode: 'both',
                  textShadow:
                    '0 0 20px rgba(251,113,133,0.85), 0 0 38px rgba(168,85,247,0.38), 0 0 2px rgba(255,255,255,0.25)',
                  willChange: 'transform, opacity',
                }}
              >
                ❤
              </span>
            ))}
          </div>
          <div
            className="pointer-events-none absolute inset-0 z-[2] animate-[enchant-vignette_12s_ease-in-out_infinite] motion-reduce:animate-none motion-reduce:opacity-[0.5]"
            style={{
              background:
                'radial-gradient(ellipse 85% 70% at 50% 45%, transparent 35%, rgba(20,10,34,0.55) 100%)',
              mixBlendMode: 'multiply',
            }}
          />
        </>
      )}

      {/* Phase 0 */}
      {currentPhase === 0 && !isCutActive && <ChaosPhase language={language} isActive={true} />}
      {isCutActive && <div className="fixed inset-0 bg-black" aria-hidden="true" />}

      {/* Phase 1 */}
      {currentPhase === 1 && (
        <div className="flex flex-col items-center justify-center px-4">
          <PhaseText text={t('coreQuestion', language)} isVisible={true} variant="large" />
          <ChoiceButtons
            choice1Text={t('choice1', language)}
            choice2Text={t('choice2', language)}
            reassuranceText={t('reassurance', language)}
            exitText={t('exitText', language)}
            isVisible={showButtons}
            onChoice={handleChoice}
            onExit={onExit}
          />
        </div>
      )}

      {/* Phase 2 → 8 */}
      {currentPhase >= 2 && currentPhase <= 8 && (
        <div className="relative z-10 flex flex-col items-center justify-center gap-8 px-4 text-center max-w-2xl [text-shadow:0_0_24px_rgba(255,255,255,0.06)]">
          {currentPhase === 2 && userChoice && (
            <>
              <PhaseText
                text={userChoice === 'yes' ? t('mirror1Yes', language) : t('mirror1No', language)}
                isVisible
                variant="default"
              />
              <PhaseText
                text={userChoice === 'yes' ? t('mirror2Yes', language) : t('mirror2No', language)}
                isVisible
                variant="small"
                delay={2500}
              />
            </>
          )}

          {currentPhase === 3 && (
            <>
              <PhaseText text={t('timeAwareness', language, replacements)} isVisible variant="default" />
              <PhaseText text={t('time1', language)} isVisible variant="small" delay={2000} glitchWords={['time', 'время', 'وقت']} />
              <PhaseText text={t('time2', language)} isVisible variant="small" delay={4000} glitchWords={['choice', 'выбор', 'خيار']} />
              <PhaseText text={t('time3', language)} isVisible variant="small" delay={6000} />
            </>
          )}

          {currentPhase === 4 && (
            <>
              <PhaseText text={t('childhood1', language)} isVisible variant="default" />
              <PhaseText text={t('childhood2', language)} isVisible variant="small" delay={3000} />
            </>
          )}

          {currentPhase === 5 && <PhaseText text={t('reinterpret', language)} isVisible variant="large" />}

          {currentPhase === 6 && (
            <>
              <PhaseText text={t('author1', language)} isVisible variant="default" />
              <PhaseText text={t('author2', language)} isVisible variant="small" delay={2500} />
              <PhaseText text={t('author3', language)} isVisible variant="small" delay={4500} />
            </>
          )}

          {currentPhase === 7 && (
            <div className="flex min-h-[30vh] flex-col items-center justify-center text-center max-w-2xl">
              <FadeLine
                key={language}
                text={finalLines[phase7LineIndex] || ''}
                variantClass="phase-text drop-shadow-[0_0_30px_rgba(251,113,133,0.12)]"
                fadeOutMs={720}
                fadeInMs={980}
              />
            </div>
          )}


          {currentPhase === 8 && (
            <>
              <PhaseText text={t('final1', language)} isVisible variant="large" />
              <PhaseText text={t('final2', language, replacements)} isVisible variant="large" delay={1500} />
            </>
          )}
        </div>
      )}

      {/* Phase 9 - Final interactive love scene */}
      {currentPhase === 9 && (
        <>
          <div
            className="fixed inset-0 z-10 flex flex-col items-center justify-center px-6 transition-colors duration-700"
            style={{
              background: isLoveAccepted ? 'radial-gradient(circle at 50% 40%, rgba(147,51,234,0.35), rgba(0,0,0,0.92) 70%)' : 'transparent',
            }}
          >
            {!showFinalLoveText && (
              <h2
                className={`text-center text-4xl font-extrabold uppercase tracking-[0.2em] text-red-500 transition-all duration-700 ease-[var(--ease-cinematic)] sm:text-6xl ${isSubmitting ? 'pointer-events-none opacity-0 blur-sm' : 'opacity-100'}`}
                style={{ textShadow: '0 0 22px rgba(239,68,68,0.9)' }}
              >
                i love you, for ever
              </h2>
            )}

            {!showFinalLoveText && (
              <div
                className={`mt-8 flex w-full max-w-lg flex-col items-center gap-4 transition-all duration-700 ease-[var(--ease-cinematic)] ${isSubmitting ? 'pointer-events-none opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}`}
              >
                <div
                  className={`flex w-full flex-col items-center gap-4 transition-all duration-700 ease-[var(--ease-cinematic)] ${
                    isLoveAccepted ? 'pointer-events-none max-h-0 opacity-0' : 'max-h-40 opacity-100'
                  } overflow-hidden`}
                >
                  <p className="text-lg text-white/90 transition-opacity duration-700 sm:text-xl">do you love me?</p>

                  <div className="flex items-center justify-center gap-3">
                    {!mergedYes && (
                      <>
                        <button
                          type="button"
                          onClick={handleYesPress}
                          className="rounded-xl bg-rose-500 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-500"
                          style={{ transform: `scale(${yesScale})`, transformOrigin: 'center' }}
                        >
                          yes
                        </button>
                        <button
                          type="button"
                          onClick={handleYesPress}
                          className="rounded-xl bg-fuchsia-500 px-5 py-3 text-sm font-bold uppercase tracking-wider text-white shadow-lg transition-all duration-500"
                          style={{ transform: `scale(${yesScale})`, transformOrigin: 'center' }}
                        >
                          yes
                        </button>
                      </>
                    )}

                    {mergedYes && (
                      <button
                        type="button"
                        onClick={handleYesPress}
                        className="rounded-2xl bg-gradient-to-r from-rose-500 to-fuchsia-600 px-16 py-6 text-2xl font-extrabold uppercase tracking-[0.2em] text-white shadow-[0_0_30px_rgba(244,63,94,0.9)] transition-all duration-500"
                        style={{ transform: `scale(${mergedYesScale})` }}
                      >
                        yessss
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={handleNoPress}
                      className="rounded-xl border border-white/50 bg-black/40 px-4 py-2 text-sm uppercase tracking-wider text-white transition-opacity duration-500"
                    >
                      no
                    </button>
                  </div>
                </div>

                <div
                  className={`flex max-w-2xl flex-col items-center gap-5 text-center transition-all duration-700 ease-[var(--ease-cinematic)] ${
                    isLoveAccepted ? 'translate-y-0 opacity-100' : 'pointer-events-none max-h-0 translate-y-2 opacity-0'
                  } overflow-hidden`}
                >
                  <p className="animate-[float-note_4s_ease-in-out_infinite] text-lg text-purple-200 sm:text-2xl">
                    i wanted it to be dark red but purple is ur lovely one 😢
                  </p>

                  {showInputBox && !showFinalLoveText && (
                    <div className="w-full max-w-md rounded-xl border border-purple-200/40 bg-purple-900/20 p-4 transition-all duration-700 ease-[var(--ease-cinematic)]">
                      <input
                        type="text"
                        value={loveText}
                        onChange={(e) => {
                          setLoveText(e.target.value);
                          setShowLengthPrompt(false);
                        }}
                        placeholder="a lovely text?"
                        className="w-full rounded-md border border-purple-300/40 bg-black/30 px-4 py-3 text-white outline-none transition-opacity duration-500 placeholder:text-purple-200/70"
                      />
                      <p
                        className={`mt-3 text-sm text-purple-100 transition-all duration-500 ${
                          showLengthPrompt ? 'opacity-100' : 'pointer-events-none max-h-0 opacity-0'
                        } overflow-hidden`}
                      >
                        {loveText.length} character only? 😭
                      </p>
                      <button
                        type="button"
                        onClick={handleSubmitLoveText}
                        disabled={!loveText.trim() || isSubmitting}
                        className="mt-4 w-full rounded-md bg-purple-500 px-4 py-2 font-semibold text-white transition-opacity duration-500 disabled:opacity-50"
                      >
                        {isSubmitting ? 'saving...' : 'submit'}
                      </button>
                      {submitError && <p className="mt-2 text-sm text-rose-200">{submitError}</p>}
                    </div>
                  )}
                </div>
              </div>
            )}

            {showFinalLoveText && (
              <p
                className={`text-center text-5xl font-extrabold text-rose-200 transition-all duration-1000 ease-[var(--ease-cinematic)] sm:text-7xl ${
                  finalLoveVisible ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'
                }`}
              >
                Love you &lt;3
              </p>
            )}
          </div>

          <div key={burstSeed} className="pointer-events-none fixed inset-0 z-20">
            {isLoveAccepted &&
              Array.from({ length: 28 }).map((_, i) => (
                <span
                  key={`burst-${i}`}
                  className="absolute left-1/2 top-1/2 text-2xl"
                  style={{
                    transform: 'translate(-50%, -50%)',
                    ['--x' as string]: `${-220 + (i % 7) * 70}`,
                    ['--y' as string]: `${-260 + (i % 5) * 80}`,
                    animation: `love-burst 1s ease-out ${i * 0.03}s forwards`,
                  } as React.CSSProperties}
                >
                  {i % 2 === 0 ? '💖' : '💜'}
                </span>
              ))}
          </div>
        </>
      )}

      <style>{`
        ${heartKeyframesCss}
        @keyframes enchant-vignette {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50% { opacity: 0.72; transform: scale(1.02); }
        }
        @keyframes love-burst {
          0% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(0.6);
          }
          100% {
            opacity: 0;
            transform: translate(calc(-50% + (var(--x, 0) * 1px)), calc(-50% + (var(--y, -150) * 1px))) scale(1.5);
          }
        }
        @keyframes float-note {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
      `}</style>
    </div>
  );
};
