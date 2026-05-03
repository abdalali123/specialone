import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface FadeLineProps {
  text: string;
  variantClass: string;
  fadeOutMs?: number;
  fadeInMs?: number;
  className?: string;
}

/**
 * Shows one line at a time: fades out → swaps text → fades in.
 */
export const FadeLine = ({
  text,
  variantClass,
  fadeOutMs = 640,
  fadeInMs = 920,
  className,
}: FadeLineProps) => {
  const [displayText, setDisplayText] = useState(text);
  const [appear, setAppear] = useState(true);

  useEffect(() => {
    if (text === displayText) return;

    setAppear(false);
    const outTimer = window.setTimeout(() => {
      setDisplayText(text);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setAppear(true));
      });
    }, fadeOutMs);

    return () => window.clearTimeout(outTimer);
  }, [text, displayText, fadeOutMs, fadeInMs]);

  return (
    <div
      role="text"
      aria-live="polite"
      className={cn(
        variantClass,
        'text-center max-w-[90vw] md:max-w-[70vw] px-4 transition-[opacity,transform] [transition-timing-function:cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-[opacity,transform] motion-reduce:duration-700',
        appear ? `opacity-100 translate-y-0 [transition-duration:${fadeInMs}ms]` : `opacity-0 translate-y-1.5 [transition-duration:${fadeOutMs}ms]`,
        className,
      )}
    >
      {displayText}
    </div>
  );
};
