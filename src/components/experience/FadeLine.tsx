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
  fadeOutMs = 380,
  fadeInMs = 520,
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
  }, [text, displayText, fadeOutMs]);

  return (
    <div
      role="text"
      aria-live="polite"
      className={cn(
        variantClass,
        `text-center max-w-[90vw] md:max-w-[70vw] px-4 transition-[opacity,transform] ease-[var(--ease-cinematic)] motion-reduce:transition-none motion-reduce:opacity-100`,
        appear ? `opacity-100 translate-y-0 [transition-duration:${fadeInMs}ms]` : `opacity-0 translate-y-1 [transition-duration:${fadeOutMs}ms]`,
        className,
      )}
    >
      {displayText}
    </div>
  );
};
