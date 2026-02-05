import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
interface Particle {
  id: number;
  x: number;
  size: number;
  color: string;
  delay: number;
  duration: number;
  rotation: number;
  drift: number;
}
interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
}
const CONFETTI_COLORS = ['hsl(186, 100%, 60%)',
// cyan
'hsl(330, 100%, 65%)',
// magenta  
'hsl(43, 80%, 60%)',
// gold
'hsl(270, 80%, 65%)',
// purple
'hsl(150, 70%, 55%)',
// green
'hsl(210, 90%, 70%)',
// blue
'hsl(350, 90%, 65%)' // coral
];
const NormalBirthday = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('You');
  const [confetti, setConfetti] = useState<Particle[]>([]);
  const [stars, setStars] = useState<Star[]>([]);
  const [showContent, setShowContent] = useState(false);
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
    const newConfetti: Particle[] = Array.from({
      length: 60
    }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 8 + Math.random() * 12,
      color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
      delay: Math.random() * 8,
      duration: 4 + Math.random() * 4,
      rotation: Math.random() * 360,
      drift: -30 + Math.random() * 60
    }));
    setConfetti(newConfetti);

    // Generate background stars
    const newStars: Star[] = Array.from({
      length: 40
    }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1 + Math.random() * 2,
      delay: Math.random() * 3
    }));
    setStars(newStars);

    // Trigger content animation
    setTimeout(() => setShowContent(true), 300);
  }, []);
  return <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-void-1">
      {/* Animated gradient background */}
      <div className="absolute inset-0" style={{
      background: `
            radial-gradient(ellipse at 30% 20%, hsl(270 60% 15% / 0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 70% 80%, hsl(330 60% 15% / 0.4) 0%, transparent 50%),
            radial-gradient(ellipse at 50% 50%, hsl(186 40% 8% / 0.6) 0%, transparent 70%),
            hsl(0 0% 0%)
          `
    }} />
      
      {/* Twinkling stars */}
      {stars.map(star => <div key={`star-${star.id}`} className="absolute rounded-full" style={{
      left: `${star.x}%`,
      top: `${star.y}%`,
      width: `${star.size}px`,
      height: `${star.size}px`,
      background: 'hsl(210 33% 97%)',
      animation: `star-twinkle 3s ease-in-out ${star.delay}s infinite`
    }} />)}
      
      {/* Confetti */}
      {confetti.map(c => <div key={c.id} className="absolute pointer-events-none" style={{
      left: `${c.x}%`,
      top: '-5%',
      width: `${c.size}px`,
      height: `${c.size}px`,
      backgroundColor: c.color,
      borderRadius: Math.random() > 0.5 ? '50%' : '2px',
      transform: `rotate(${c.rotation}deg)`,
      animation: `birthday-confetti-fall ${c.duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94) ${c.delay}s infinite`,
      '--drift': `${c.drift}px`,
      boxShadow: `0 0 10px ${c.color}`
    } as React.CSSProperties} />)}
      
      {/* Main content */}
      <div className={`relative z-10 text-center px-8 transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        {/* Floating cake emoji */}
        <div className="text-7xl md:text-9xl mb-8 inline-block" style={{
        animation: 'gentle-float 4s ease-in-out infinite',
        filter: 'drop-shadow(0 0 30px hsl(43 80% 50% / 0.5))'
      }}>
          🎂
        </div>
        
        {/* Title with glow */}
        <h1 className="text-4xl md:text-7xl font-light mb-6 tracking-wide" style={{
        color: 'hsl(210 33% 97%)',
        textShadow: `
              0 0 20px hsl(186 100% 50% / 0.3),
              0 0 40px hsl(330 100% 57% / 0.2),
              0 4px 30px rgba(0, 0, 0, 0.5)
            `,
        animation: 'text-glow 4s ease-in-out infinite alternate'
      }}>
          Happy Birthday
        </h1>
        
        {/* Name with emphasis */}
        <p className="text-3xl md:text-5xl font-extralight mb-10 tracking-widest" style={{
        color: 'hsl(43 60% 52%)',
        textShadow: '0 0 30px hsl(43 80% 50% / 0.4)',
        animation: 'fade-in-up 1s 0.5s both'
      }}>
          {name}
        </p>
        
        {/* Decorative emojis */}
        <div className="flex justify-center gap-4 text-3xl md:text-4xl mb-12" style={{
        animation: 'fade-in-up 1s 0.8s both'
      }}>
          {['🎈', '✨', '🎉', '💫', '🎊'].map((emoji, i) => {})}
        </div>
        
        {/* Message */}
        <p className="text-lg md:text-xl font-light mb-12 max-w-md mx-auto leading-relaxed" style={{
        color: 'hsl(210 33% 80%)',
        animation: 'fade-in-up 1s 1s both'
      }}>
          May this year bring you endless joy, beautiful moments, and everything your heart desires.
        </p>
        
        {/* Back button */}
        <button onClick={() => navigate('/')} className="group relative px-8 py-4 rounded-full font-light tracking-wide transition-all duration-500 hover:scale-105" style={{
        background: 'linear-gradient(135deg, hsl(186 100% 50% / 0.15), hsl(330 100% 57% / 0.15))',
        color: 'hsl(210 33% 90%)',
        border: '1px solid hsl(210 33% 97% / 0.2)',
        backdropFilter: 'blur(10px)',
        animation: 'fade-in-up 1s 1.2s both'
      }}>
          <span className="relative z-10">​</span>
          
        </button>
      </div>
      
      {/* Ambient glow orbs */}
      <div className="absolute w-64 h-64 rounded-full pointer-events-none" style={{
      left: '10%',
      top: '20%',
      background: 'radial-gradient(circle, hsl(186 100% 50% / 0.1) 0%, transparent 70%)',
      filter: 'blur(40px)',
      animation: 'orb-float 8s ease-in-out infinite'
    }} />
      <div className="absolute w-80 h-80 rounded-full pointer-events-none" style={{
      right: '5%',
      bottom: '15%',
      background: 'radial-gradient(circle, hsl(330 100% 57% / 0.1) 0%, transparent 70%)',
      filter: 'blur(50px)',
      animation: 'orb-float 10s ease-in-out 2s infinite reverse'
    }} />
      
      {/* Keyframes */}
      <style>{`
        @keyframes birthday-confetti-fall {
          0% {
            transform: translateY(-20px) translateX(0) rotate(0deg) scale(1);
            opacity: 1;
          }
          25% {
            transform: translateY(25vh) translateX(var(--drift)) rotate(180deg) scale(0.95);
          }
          50% {
            transform: translateY(50vh) translateX(calc(var(--drift) * -0.5)) rotate(360deg) scale(0.9);
          }
          75% {
            transform: translateY(75vh) translateX(var(--drift)) rotate(540deg) scale(0.85);
          }
          100% {
            transform: translateY(105vh) translateX(calc(var(--drift) * -1)) rotate(720deg) scale(0.8);
            opacity: 0;
          }
        }
        
        @keyframes gentle-float {
          0%, 100% { 
            transform: translateY(0) rotate(-3deg); 
          }
          50% { 
            transform: translateY(-15px) rotate(3deg); 
          }
        }
        
        @keyframes text-glow {
          0% {
            text-shadow: 
              0 0 20px hsl(186 100% 50% / 0.3),
              0 0 40px hsl(330 100% 57% / 0.2),
              0 4px 30px rgba(0, 0, 0, 0.5);
          }
          100% {
            text-shadow: 
              0 0 30px hsl(186 100% 50% / 0.5),
              0 0 60px hsl(330 100% 57% / 0.3),
              0 4px 30px rgba(0, 0, 0, 0.5);
          }
        }
        
        @keyframes emoji-bounce {
          0%, 100% { 
            transform: translateY(0) scale(1); 
          }
          50% { 
            transform: translateY(-8px) scale(1.1); 
          }
        }
        
        @keyframes star-twinkle {
          0%, 100% { 
            opacity: 0.3;
            transform: scale(1);
          }
          50% { 
            opacity: 1;
            transform: scale(1.3);
          }
        }
        
        @keyframes orb-float {
          0%, 100% { 
            transform: translate(0, 0) scale(1); 
          }
          33% { 
            transform: translate(20px, -30px) scale(1.1); 
          }
          66% { 
            transform: translate(-15px, 20px) scale(0.95); 
          }
        }
        
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>;
};
export default NormalBirthday;