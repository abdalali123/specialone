import { useEffect, useState, useRef } from 'react';
import { cn } from '@/lib/utils';

interface PhaseTextProps {
  text: string;
  isVisible: boolean;
  variant?: 'default' | 'large' | 'small';
  delay?: number;
  glitchWords?: string[];
  className?: string;
  onComplete?: () => void;
}

export const PhaseText = ({
  text,
  isVisible,
  variant = 'default',
  delay = 0,
  glitchWords = [],
  className,
  onComplete,
}: PhaseTextProps) => {
  const [shouldRender, setShouldRender] = useState(false);
  const [entered, setEntered] = useState(false);
  const [activeGlitch, setActiveGlitch] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  const skipTextCrossfadeRef = useRef(true);

  useEffect(() => {
    if (!isVisible) {
      setShouldRender(false);
      setEntered(false);
      skipTextCrossfadeRef.current = true;
      return;
    }

    let completeTimer: ReturnType<typeof setTimeout> | undefined;

    timeoutRef.current = setTimeout(() => {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setEntered(true));
      });
      if (onComplete) {
        completeTimer = setTimeout(onComplete, 1000);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (completeTimer) {
        clearTimeout(completeTimer);
      }
    };
  }, [isVisible, delay, onComplete]);

  /** When text changes mid-phase, softly crossfade (skip first reveal) */
  useEffect(() => {
    if (!shouldRender) return;
    if (skipTextCrossfadeRef.current) {
      skipTextCrossfadeRef.current = false;
      return;
    }

    setEntered(false);
    const t = setTimeout(() => {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setEntered(true));
      });
    }, 680);
    return () => clearTimeout(t);
  }, [text, shouldRender]);

  // Trigger random glitch on glitch words
  useEffect(() => {
    if (!entered || glitchWords.length === 0) return;

    const triggerGlitch = () => {
      const randomWord = glitchWords[Math.floor(Math.random() * glitchWords.length)];
      setActiveGlitch(randomWord);

      setTimeout(() => {
        setActiveGlitch(null);
      }, 150);
    };

    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        triggerGlitch();
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [entered, glitchWords]);

  if (!shouldRender) return null;

  const processText = () => {
    if (glitchWords.length === 0) return text;

    let processedText = text;
    glitchWords.forEach((word) => {
      const isActive = activeGlitch === word;
      processedText = processedText.replace(
        new RegExp(`\\b${word}\\b`, 'gi'),
        `<span class="glitch ${isActive ? 'active' : ''}" data-text="${word}">${word}</span>`
      );
    });

    return processedText;
  };

  const variantClass = {
    default: 'phase-text',
    large: 'phase-text-large',
    small: 'phase-text-small',
  }[variant];

  return (
    <div
      className={cn(
        variantClass,
        'text-center max-w-[90vw] md:max-w-[70vw] px-4 transition-[opacity,transform,filter] duration-[1100ms] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:duration-500',
        entered ? 'opacity-100 translate-y-0 blur-0' : 'opacity-0 translate-y-3 blur-[2px]',
        className
      )}
      dangerouslySetInnerHTML={{ __html: processText() }}
      role="text"
      aria-live="polite"
    />
  );
};
