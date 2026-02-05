import { useState } from 'react';
import { cn } from '@/lib/utils';

interface ChoiceButtonsProps {
  choice1Text: string;
  choice2Text: string;
  reassuranceText: string;
  exitText: string;
  isVisible: boolean;
  onChoice: (choice: 'yes' | 'no') => void;
  onExit: () => void;
}

export const ChoiceButtons = ({
  choice1Text,
  choice2Text,
  reassuranceText,
  exitText,
  isVisible,
  onChoice,
  onExit,
}: ChoiceButtonsProps) => {
  const [hoveredButton, setHoveredButton] = useState<'yes' | 'no' | null>(null);
  
  if (!isVisible) return null;
  
  return (
    <div className="flex flex-col items-center gap-8 mt-12 animate-fade-in" style={{ animationDelay: '0.5s', opacity: 0 }}>
      {/* Choice buttons */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
        <button
          className={cn(
            'btn-neon min-w-[180px] transition-all duration-500',
            hoveredButton === 'yes' && 'scale-105'
          )}
          onClick={() => onChoice('yes')}
          onMouseEnter={() => setHoveredButton('yes')}
          onMouseLeave={() => setHoveredButton(null)}
          onFocus={() => setHoveredButton('yes')}
          onBlur={() => setHoveredButton(null)}
          aria-label={choice1Text}
        >
          {choice1Text}
        </button>
        
        <button
          className={cn(
            'btn-neon min-w-[180px] transition-all duration-500',
            hoveredButton === 'no' && 'scale-105'
          )}
          onClick={() => onChoice('no')}
          onMouseEnter={() => setHoveredButton('no')}
          onMouseLeave={() => setHoveredButton(null)}
          onFocus={() => setHoveredButton('no')}
          onBlur={() => setHoveredButton(null)}
          aria-label={choice2Text}
        >
          {choice2Text}
        </button>
      </div>
      
      {/* Reassurance */}
      <p
        className="phase-text-small animate-fade-in"
        style={{ animationDelay: '1s', opacity: 0 }}
      >
        {reassuranceText}
      </p>
      
      {/* Exit button - respectful, subtle */}
      <button
        className="btn-exit mt-8 animate-fade-in"
        style={{ animationDelay: '2s', opacity: 0 }}
        onClick={onExit}
        aria-label={exitText}
      >
        {exitText}
      </button>
    </div>
  );
};
