import { useEffect, useState, useRef } from 'react';
import { t } from '@/config/experience';

interface ChaosPhaseProps {
  language: 'en' | 'ar' | 'ru';
  isActive: boolean;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  rotation: number;
}

interface Balloon {
  id: number;
  x: number;
  size: number;
  driftX: number;
  duration: number;
  color: string;
  delay: number;
}

interface NeonStreak {
  id: number;
  y: number;
  delay: number;
  duration: number;
}

const CONFETTI_COLORS = [
  'hsl(186, 100%, 50%)', // cyan
  'hsl(330, 100%, 57%)', // magenta
  'hsl(43, 60%, 52%)',   // gold
  'hsl(210, 33%, 97%)',  // neon white
  'hsl(270, 100%, 60%)', // purple
  'hsl(150, 100%, 50%)', // green
];

const BALLOON_COLORS = [
  'hsl(186, 100%, 50%)',
  'hsl(330, 100%, 57%)',
  'hsl(43, 60%, 52%)',
];

export const ChaosPhase = ({ language, isActive }: ChaosPhaseProps) => {
  const [confetti, setConfetti] = useState<Particle[]>([]);
  const [balloons, setBalloons] = useState<Balloon[]>([]);
  const [streaks, setStreaks] = useState<NeonStreak[]>([]);
  const [dustParticles, setDustParticles] = useState<Particle[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Generate chaos elements
  useEffect(() => {
    if (!isActive) return;
    
    // Generate confetti
    const newConfetti: Particle[] = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      size: 6 + Math.random() * 8,
      delay: Math.random() * 2,
      duration: 2 + Math.random() * 2,
      rotation: Math.random() * 360,
    }));
    setConfetti(newConfetti);
    
    // Generate balloons
    const newBalloons: Balloon[] = Array.from({ length: 16 }, (_, i) => ({
      id: i,
      x: 5 + Math.random() * 90,
      size: 26 + Math.random() * 46,
      driftX: -40 + Math.random() * 80,
      duration: 8 + Math.random() * 8,
      color: BALLOON_COLORS[Math.floor(Math.random() * BALLOON_COLORS.length)],
      delay: Math.random() * 3,
    }));
    setBalloons(newBalloons);
    
    // Generate neon streaks
    const newStreaks: NeonStreak[] = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      y: 10 + Math.random() * 80,
      delay: i * 0.5,
      duration: 1 + Math.random(),
    }));
    setStreaks(newStreaks);
    
    // Generate dust particles
    const newDust: Particle[] = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      color: 'hsl(210, 33%, 97%)',
      size: 2 + Math.random() * 4,
      delay: Math.random() * 10,
      duration: 15 + Math.random() * 10,
      rotation: 0,
    }));
    setDustParticles(newDust);
  }, [isActive]);
  
  if (!isActive) return null;
  
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 overflow-hidden chaos-gradient z-10"
      aria-live="polite"
    >
      {/* Neon streaks */}
      {streaks.map((streak) => (
        <div
          key={`streak-${streak.id}`}
          className="neon-streak animate-neon-streak"
          style={{
            top: `${streak.y}%`,
            left: 0,
            width: '100%',
            animationDelay: `${streak.delay}s`,
            animationDuration: `${streak.duration}s`,
          }}
        />
      ))}
      
      {/* Confetti */}
      {confetti.map((particle) => (
        <div
          key={`confetti-${particle.id}`}
          className="confetti animate-confetti"
          style={{
            left: `${particle.x}%`,
            top: `-${particle.size}px`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: particle.color,
            transform: `rotate(${particle.rotation}deg)`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
          }}
        />
      ))}
      
      {/* Balloons */}
      {balloons.map((balloon) => (
        <div
          key={`balloon-${balloon.id}`}
          className="balloon animate-balloon"
          style={{
            left: `${balloon.x}%`,
            bottom: '-25%',
            width: `${balloon.size}px`,
            height: `${balloon.size * 1.25}px`,
            backgroundColor: balloon.color,
            animationDelay: `${balloon.delay}s`,
            animationDuration: `${balloon.duration}s`,
            '--drift-x': `${balloon.driftX}px`,
          }}
        />
      ))}
      
      {/* Dust layer */}
      <div className="dust-layer">
        {dustParticles.map((dust) => (
          <div
            key={`dust-${dust.id}`}
            className="dust-particle animate-dust"
            style={{
              left: `${dust.x}%`,
              top: `${dust.y}%`,
              width: `${dust.size}px`,
              height: `${dust.size}px`,
              animationDelay: `${dust.delay}s`,
              animationDuration: `${dust.duration}s`,
            }}
          />
        ))}
      </div>
      
      {/* Central text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none">
        <h1
          className="phase-text-large text-center animate-fade-in-up px-4"
          style={{
            textShadow: `
              0 0 20px hsl(186 100% 50% / 0.5),
              0 0 40px hsl(330 100% 57% / 0.3)
            `,
          }}
        >
          {t('chaos1', language)}
        </h1>
        <p
          className="phase-text text-center mt-4 animate-fade-in-up px-4"
          style={{
            animationDelay: '0.3s',
            opacity: 0,
          }}
        >
          {t('chaos2', language)}
        </p>
      </div>
      
      {/* Stay hint - tiny corner */}
      <div className="fixed bottom-4 right-4 z-30">
        <p className="hint-text animate-fade-in" style={{ animationDelay: '3s', opacity: 0 }}>
          {t('stayHint', language)}
        </p>
      </div>
    </div>
  );
};
