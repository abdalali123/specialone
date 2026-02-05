import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { defaultConfig } from '@/config/experience';

interface Confetti {
  id: number;
  x: number;
  color: string;
  delay: number;
  duration: number;
}

const COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
];

const NormalBirthday = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('You');
  const [confetti, setConfetti] = useState<Confetti[]>([]);
  
  useEffect(() => {
    // Load name from config
    try {
      const savedConfig = localStorage.getItem('birthday-config');
      if (savedConfig) {
        const parsed = JSON.parse(savedConfig);
        if (parsed.name) {
          setName(parsed.name);
        }
      }
    } catch (e) {
      console.log('No saved config');
    }
    
    // Generate confetti
    const newConfetti: Confetti[] = Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      delay: Math.random() * 5,
      duration: 3 + Math.random() * 3,
    }));
    setConfetti(newConfetti);
  }, []);
  
  return (
    <div
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      {/* Confetti */}
      {confetti.map((c) => (
        <div
          key={c.id}
          className="absolute pointer-events-none"
          style={{
            left: `${c.x}%`,
            top: '-20px',
            width: '10px',
            height: '10px',
            backgroundColor: c.color,
            borderRadius: '2px',
            animation: `confetti-fall ${c.duration}s linear ${c.delay}s infinite`,
          }}
        />
      ))}
      
      {/* Content */}
      <div className="relative z-10 text-center px-8">
        <div
          className="text-6xl md:text-8xl mb-8"
          style={{ animation: 'bounce 1s ease infinite' }}
        >
          🎂
        </div>
        
        <h1
          className="text-4xl md:text-6xl font-bold mb-4"
          style={{
            color: 'white',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          Happy Birthday!
        </h1>
        
        <p
          className="text-2xl md:text-3xl font-light mb-8"
          style={{ color: 'rgba(255,255,255,0.9)' }}
        >
          {name}
        </p>
        
        <div className="flex gap-4 text-4xl mb-12">
          🎈🎉🎊🎁🎈
        </div>
        
        <p
          className="text-lg mb-8"
          style={{ color: 'rgba(255,255,255,0.8)' }}
        >
          Wishing you a wonderful year ahead filled with joy and happiness!
        </p>
        
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 rounded-full font-medium transition-all duration-300 hover:scale-105"
          style={{
            background: 'rgba(255,255,255,0.2)',
            color: 'white',
            border: '2px solid rgba(255,255,255,0.4)',
            backdropFilter: 'blur(10px)',
          }}
        >
          ← Back to Experience
        </button>
      </div>
      
      {/* Keyframes */}
      <style>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-20px) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default NormalBirthday;
