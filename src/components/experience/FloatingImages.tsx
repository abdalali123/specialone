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
    
    // Create floating image objects
    const newImages: FloatingImage[] = images.map((src, i) => ({
      id: i,
      src,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 70,
      size: 120 + Math.random() * 100,
      rotation: -15 + Math.random() * 30,
      delay: i * 0.5,
      depth: 0.5 + Math.random() * 0.5,
    }));
    
    setFloatingImages(newImages);
  }, [images, isVisible]);
  
  if (!isVisible || floatingImages.length === 0) return null;
  
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      {floatingImages.map((img) => {
        // Parallax offset based on gyroscope/mouse
        const parallaxX = gyro.x * 30 * img.depth;
        const parallaxY = gyro.y * 20 * img.depth;
        
        return (
          <div
            key={img.id}
            className={cn(
              'floating-image animate-float',
              'transition-transform duration-1000 ease-slow'
            )}
            style={{
              left: `${img.x}%`,
              top: `${img.y}%`,
              width: `${img.size}px`,
              height: `${img.size * 0.75}px`,
              transform: `
                translate(${parallaxX}px, ${parallaxY}px)
                rotate(${img.rotation}deg)
              `,
              animationDelay: `${img.delay}s`,
              opacity: 0,
              animation: `fade-in 2s ${img.delay}s forwards, float 10s ${img.delay + 2}s ease-in-out infinite`,
            }}
          >
            {/* Soft halo glow */}
            <div
              className="absolute inset-0 -z-10 rounded-sm"
              style={{
                background: `radial-gradient(
                  ellipse at center,
                  hsl(210 33% 97% / 0.1) 0%,
                  transparent 70%
                )`,
                transform: 'scale(1.5)',
                filter: 'blur(20px)',
              }}
            />
            
            <img
              src={img.src}
              alt=""
              className="w-full h-full object-cover"
              style={{
                filter: `blur(${0.5 * (1 - img.depth)}px)`,
              }}
              loading="lazy"
            />
          </div>
        );
      })}
    </div>
  );
};
