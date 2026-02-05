import { useEffect, useState } from 'react';
import { useGyroscope } from '@/hooks/useGyroscope';
import { cn } from '@/lib/utils';

interface FloatingImage {
  id: number;
  src: string;
  x: number;
  y: number;
  size: number;
  rotation: number;
  delay: number;
  depth: number;
  driftX: number;
  driftY: number;
  floatDuration: number;
}

interface FloatingImagesProps {
  images: string[];
  isVisible: boolean;
  enableGyro: boolean;
}

export const FloatingImages = ({ images, isVisible, enableGyro }: FloatingImagesProps) => {
  const [floatingImages, setFloatingImages] = useState<FloatingImage[]>([]);
  const gyro = useGyroscope(enableGyro);
  
  useEffect(() => {
    if (!isVisible || images.length === 0) return;
    
    // Create floating image objects with unique drift patterns
    const newImages: FloatingImage[] = images.map((src, i) => ({
      id: i,
      src,
      x: 15 + Math.random() * 70,
      y: 15 + Math.random() * 60,
      size: 140 + Math.random() * 80,
      rotation: -12 + Math.random() * 24,
      delay: i * 0.8,
      depth: 0.4 + Math.random() * 0.6,
      driftX: -20 + Math.random() * 40,
      driftY: -15 + Math.random() * 30,
      floatDuration: 12 + Math.random() * 8,
    }));
    
    setFloatingImages(newImages);
  }, [images, isVisible]);
  
  if (!isVisible || floatingImages.length === 0) return null;
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      {floatingImages.map((img) => {
        // Parallax offset based on gyroscope/mouse
        const parallaxX = gyro.x * 40 * img.depth;
        const parallaxY = gyro.y * 25 * img.depth;
        
        return (
          <div
            key={img.id}
            className={cn(
              'absolute rounded-sm overflow-hidden',
              'shadow-2xl'
            )}
            style={{
              left: `${img.x}%`,
              top: `${img.y}%`,
              width: `${img.size}px`,
              height: `${img.size * 0.75}px`,
              transform: `
                translate(-50%, -50%)
                translate(${parallaxX}px, ${parallaxY}px)
                rotate(${img.rotation}deg)
              `,
              opacity: 0,
              animation: `
                floating-image-enter 2.5s cubic-bezier(0.4, 0, 0.2, 1) ${img.delay}s forwards,
                floating-drift ${img.floatDuration}s ease-in-out ${img.delay + 2}s infinite alternate
              `,
              boxShadow: `
                0 25px 50px -12px rgba(0, 0, 0, 0.5),
                0 0 80px rgba(246, 248, 250, 0.05)
              `,
              '--drift-x': `${img.driftX}px`,
              '--drift-y': `${img.driftY}px`,
            } as React.CSSProperties}
          >
            {/* Soft halo glow */}
            <div
              className="absolute -inset-8 -z-10"
              style={{
                background: `radial-gradient(
                  ellipse at center,
                  hsl(210 33% 97% / 0.08) 0%,
                  hsl(186 100% 50% / 0.03) 40%,
                  transparent 70%
                )`,
                filter: 'blur(30px)',
              }}
            />
            
            {/* Image container with subtle border */}
            <div 
              className="relative w-full h-full overflow-hidden rounded-sm"
              style={{
                border: '1px solid rgba(246, 248, 250, 0.1)',
              }}
            >
              <img
                src={img.src}
                alt=""
                className="w-full h-full object-cover"
                style={{
                  filter: `blur(${0.3 * (1 - img.depth)}px) saturate(1.1)`,
                }}
                loading="lazy"
              />
              
              {/* Overlay gradient for depth */}
              <div 
                className="absolute inset-0"
                style={{
                  background: `linear-gradient(
                    135deg,
                    transparent 0%,
                    rgba(0, 0, 0, 0.1) 100%
                  )`,
                }}
              />
            </div>
          </div>
        );
      })}
      
      {/* Ambient floating particles */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              background: 'hsl(210 33% 97% / 0.3)',
              opacity: 0,
              animation: `
                particle-float ${15 + Math.random() * 10}s ease-in-out ${Math.random() * 5}s infinite,
                fade-in 2s ${Math.random() * 3}s forwards
              `,
            }}
          />
        ))}
      </div>
    </div>
  );
};
