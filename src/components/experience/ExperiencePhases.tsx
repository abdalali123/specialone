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
  const [textSequence, setTextSequence] = useState(0);
  const [isCutActive, setIsCutActive] = useState(false);

  // Stop all audio when this experience unmounts
  useEffect(() => {
    return () => {
      audio.stopAll();
    };
  }, [audio]);
  
  // Phase 0 - Chaos
  useEffect(() => {
    if (!isStarted || currentPhase !== 0) return;
    
    // After phase0 duration, trigger the cut
    const timer = setTimeout(() => {
      // HARD CUT - immediate stop
      audio.stopCelebration();
      setIsCutActive(true);
      
      // After silence, move to phase 1
      setTimeout(() => {
        setIsCutActive(false);
        setCurrentPhase(1);
      }, config.timings.cut);
    }, config.timings.phase0);
    
    return () => clearTimeout(timer);
  }, [isStarted, currentPhase, config.timings, audio]);

  // Phase 1 - Start calm ambient/piano as soon as we enter
  useEffect(() => {
    if (!isStarted || currentPhase !== 1) return;
    audio.playAmbient(config.audio.ambient);
  }, [isStarted, currentPhase, audio, config.audio.ambient]);
  
  // Phase 1 - Show buttons after delay
  useEffect(() => {
    if (currentPhase !== 1) return;
    
    const timer = setTimeout(() => {
      setShowButtons(true);
    }, config.timings.btnDelay);
    
    return () => clearTimeout(timer);
  }, [currentPhase, config.timings.btnDelay]);
  
  // Handle user choice
  const handleChoice = useCallback((choice: 'yes' | 'no') => {
    setUserChoice(choice);
    setShowButtons(false);
    setCurrentPhase(2);
  }, [audio, config.audio.ambient]);
  
  // Phase progression
  useEffect(() => {
    if (currentPhase < 2 || currentPhase >= 9) return;
    
    // Auto-progress through phases with text sequences
    const progressPhase = () => {
      if (currentPhase < 8) {
        setCurrentPhase((prev) => (prev + 1) as Phase);
        setTextSequence(0);
      } else if (currentPhase === 8) {
        // Final phase - show images
        setCurrentPhase(9);
      }
    };
    
    // Different timing per phase
    const phaseDurations: Record<number, number> = {
      2: 6000,
      3: 10000,
      4: 7000,
      5: 6000,
      6: 8000,
      7: 18000,
      8: 8000,
    };
    
    const timer = setTimeout(progressPhase, phaseDurations[currentPhase] || 6000);
    
    return () => clearTimeout(timer);
  }, [currentPhase]);
  
  // Phase 5 - Reinterpret - bring back celebration distant
  useEffect(() => {
    if (currentPhase === 5) {
      audio.playCelebrationDistant();
    }
  }, [currentPhase, audio]);
  
  // Get replacement values
  const replacements = {
    name: config.name,
    time: getCurrentTime(),
  };
  
  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden bg-black text-white"
      style={isCutActive ? { background: 'hsl(0 0% 0%)' } : undefined}
    >
      {/* Phase 0 - Chaos */}
      {currentPhase === 0 && !isCutActive && (
        <ChaosPhase language={language} isActive={true} />
      )}
      
      {/* Cut - Pure black, silence */}
      {isCutActive && <div className="fixed inset-0 bg-black" aria-hidden="true" />}
      
      {/* Phase 1 - Core Question */}
      {currentPhase === 1 && (
        <div className="flex flex-col items-center justify-center px-4">
          <PhaseText
            text={t('coreQuestion', language)}
            isVisible={true}
            variant="large"
          />
          
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
      
      {/* Phase 2 - Emotional Path */}
      {currentPhase === 2 && userChoice && (
        <div className="flex flex-col items-center justify-center gap-8 px-4">
          <PhaseText
            text={userChoice === 'yes' ? t('mirror1Yes', language) : t('mirror1No', language)}
            isVisible={true}
            variant="default"
          />
          <PhaseText
            text={userChoice === 'yes' ? t('mirror2Yes', language) : t('mirror2No', language)}
            isVisible={true}
            variant="small"
            delay={2500}
          />
        </div>
      )}
      
      {/* Phase 3 - Time Awareness */}
      {currentPhase === 3 && (
        <div className="flex flex-col items-center justify-center gap-6 px-4">
          <PhaseText
            text={t('timeAwareness', language, replacements)}
            isVisible={true}
            variant="default"
          />
          <PhaseText
            text={t('time1', language)}
            isVisible={true}
            variant="small"
            delay={2000}
            glitchWords={['time', 'время', 'وقت']}
          />
          <PhaseText
            text={t('time2', language)}
            isVisible={true}
            variant="small"
            delay={4000}
            glitchWords={['choice', 'выбор', 'خيار']}
          />
          <PhaseText
            text={t('time3', language)}
            isVisible={true}
            variant="small"
            delay={6000}
          />
        </div>
      )}
      
      {/* Phase 4 - Childhood */}
      {currentPhase === 4 && (
        <div className="flex flex-col items-center justify-center gap-8 px-4">
          <PhaseText
            text={t('childhood1', language)}
            isVisible={true}
            variant="default"
          />
          <PhaseText
            text={t('childhood2', language)}
            isVisible={true}
            variant="small"
            delay={3000}
          />
        </div>
      )}
      
      {/* Phase 5 - Reinterpret */}
      {currentPhase === 5 && (
        <div className="flex flex-col items-center justify-center px-4">
          <PhaseText
            text={t('reinterpret', language)}
            isVisible={true}
            variant="large"
          />
        </div>
      )}
      
      {/* Phase 6 - Author Presence */}
      {currentPhase === 6 && (
        <div className="flex flex-col items-center justify-center gap-6 px-4">
          <PhaseText
            text={t('author1', language)}
            isVisible={true}
            variant="default"
          />
          <PhaseText
            text={t('author2', language)}
            isVisible={true}
            variant="small"
            delay={2500}
          />
          <PhaseText
            text={t('author3', language)}
            isVisible={true}
            variant="small"
            delay={4500}
          />
        </div>
      )}
      
      {/* Phase 7 - Personal message */}
      {currentPhase === 7 && (
        <div className="flex flex-col items-center justify-center gap-6 px-6 max-w-2xl text-center">
          <PhaseText
            text={`And I want you to know this:<br/><br/>
I’m genuinely happy you exist.<br/>
Proud of who you are becoming,<br/>
even on days you doubt it.<br/><br/>
You matter more than you think.<br/>
And I don’t just celebrate your birthday—<br/>
I celebrate you.<br/>
I hope you stay.<br/>
Not just here… but in my life.`}
            isVisible={true}
            variant="default"
          />
        </div>
      )}
      
      {/* Phase 8 - Final */}
      {currentPhase === 8 && (
        <div className="flex flex-col items-center justify-center gap-4 px-4">
          <PhaseText
            text={t('final1', language)}
            isVisible={true}
            variant="large"
          />
          <PhaseText
            text={t('final2', language, replacements)}
            isVisible={true}
            variant="large"
            delay={1500}
          />
        </div>
      )}
      
      {/* Phase 9 - Floating Images Finale */}
      {currentPhase === 9 && (
        <>
          <FloatingImages
            images={config.images}
            isVisible={true}
            enableGyro={config.enableGyro}
          />
          
          <div className="fixed bottom-20 left-0 right-0 flex justify-center px-4 z-20">
            <PhaseText
              text={t('aftertaste', language)}
              isVisible={true}
              variant="small"
              delay={2000}
            />
          </div>
        </>
      )}
    </div>
  );
};
