import { useState, useEffect, useCallback } from 'react';
import { ChaosPhase } from './ChaosPhase';
import { PhaseText } from './PhaseText';
import { ChoiceButtons } from './ChoiceButtons';
import { FloatingImages } from './FloatingImages';
import { t, getCurrentTime, ExperienceConfig } from '@/config/experience';
import { useAudioManager } from '@/hooks/useAudioManager';

type Phase = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

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
  const [paragraphStep, setParagraphStep] = useState(0);

  // Stop all audio on unmount
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

  // Auto-phase progression (2 → 8)
  useEffect(() => {
    if (currentPhase < 2 || currentPhase > 8) return;

    const phaseDurations: Record<number, number> = {
      2: 6000,
      3: 10000,
      4: 7000,
      5: 6000,
      6: 8000,
      7: 2000, // phase 7 handled by paragraph timing
      8: 8000,
    };

    const timer = setTimeout(() => {
      setCurrentPhase((prev) => (prev < 8 ? (prev + 1) as Phase : 9));
    }, phaseDurations[currentPhase] || 6000);

    return () => clearTimeout(timer);
  }, [currentPhase]);

  const replacements = { name: config.name, time: getCurrentTime() };

  // Phase 7 paragraph line-by-line
  const paragraphLines: string[] = t('finalParagraph', language);
  useEffect(() => {
    if (currentPhase !== 7) return;
    setParagraphStep(0);

    const interval = setInterval(() => {
      setParagraphStep((prev) => {
        if (prev < paragraphLines.length) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 3000); // each line stays 3s
    return () => clearInterval(interval);
  }, [currentPhase, paragraphLines]);

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-black text-white">
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

      {/* Phase 2 → 6 */}
      {currentPhase >= 2 && currentPhase <= 6 && (
        <div className="flex flex-col items-center justify-center gap-6 px-4 text-center max-w-2xl">
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
              <PhaseText text={t('time1', language)} isVisible variant="small" delay={2000} />
              <PhaseText text={t('time2', language)} isVisible variant="small" delay={4000} />
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
        </div>
      )}

      {/* Phase 7 - Final paragraph line by line */}
      {currentPhase === 7 && (
        <div className="flex flex-col items-center justify-center px-4 text-center max-w-2xl gap-2">
          {paragraphLines.slice(0, paragraphStep).map((line, i) => (
            <PhaseText key={i} text={line} isVisible variant="default" />
          ))}
        </div>
      )}

      {/* Phase 8 */}
      {currentPhase === 8 && (
        <div className="flex flex-col items-center justify-center px-4 text-center max-w-2xl gap-2">
          <PhaseText text={t('final1', language)} isVisible variant="large" />
          <PhaseText text={t('final2', language, replacements)} isVisible variant="large" delay={1500} />
        </div>
      )}

      {/* Phase 9 - Floating Images */}
      {currentPhase === 9 && (
        <>
          <FloatingImages images={config.images} isVisible enableGyro={config.enableGyro} />
          <div className="fixed bottom-20 left-0 right-0 flex justify-center px-4 z-20">
            <PhaseText text={t('aftertaste', language)} isVisible variant="small" delay={2000} />
          </div>
        </>
      )}
    </div>
  );
};
