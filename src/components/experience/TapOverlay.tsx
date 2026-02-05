import { t } from '@/config/experience';

interface TapOverlayProps {
  isVisible: boolean;
  language: 'en' | 'ar' | 'ru';
  onTap: () => void;
}

export const TapOverlay = ({ isVisible, language, onTap }: TapOverlayProps) => {
  if (!isVisible) return null;
  
  return (
    <div
      className="tap-overlay"
      onClick={onTap}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onTap();
        }
      }}
      role="button"
      tabIndex={0}
      aria-label="Tap to begin experience"
    >
      <div className="tap-overlay-text">
        <p className="tracking-widest uppercase text-sm">
          {t('tapToContinue', language)}
        </p>
        <div
          className="mt-4 w-px h-8 mx-auto"
          style={{
            background: 'linear-gradient(to bottom, transparent, hsl(210 33% 97% / 0.3), transparent)',
          }}
        />
      </div>
    </div>
  );
};
