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
  const [hasAnimated, setHasAnimated] = useState(false);
  const [activeGlitch, setActiveGlitch] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();
  
  useEffect(() => {
    if (isVisible && !hasAnimated) {
      timeoutRef.current = setTimeout(() => {
        setShouldRender(true);
        setHasAnimated(true);
        
        // Trigger completion callback after animation
        if (onComplete) {
          setTimeout(onComplete, 1000);
        }
      }, delay);
    }
    
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isVisible, delay, hasAnimated, onComplete]);
  
  // Trigger random glitch on glitch words
  useEffect(() => {
    if (!shouldRender || glitchWords.length === 0) return;
    
    const triggerGlitch = () => {
      const randomWord = glitchWords[Math.floor(Math.random() * glitchWords.length)];
      setActiveGlitch(randomWord);
      
      setTimeout(() => {
        setActiveGlitch(null);
      }, 150);
    };
    
    // Random glitch timing
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        triggerGlitch();
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [shouldRender, glitchWords]);
  
  if (!shouldRender) return null;
  
  // Process text to wrap glitch words
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
        'animate-fade-in-up text-center max-w-[90vw] md:max-w-[70vw] px-4',
        className
      )}
      style={{ opacity: 0 }}
      dangerouslySetInnerHTML={{ __html: processText() }}
      role="text"
      aria-live="polite"
    />
  );
};
