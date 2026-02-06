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
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const gyro = useGyroscope(enableGyro);

  useEffect(() => {
    if (!isVisible || images.length === 0) return;

    const newImages: FloatingImage[] = images.map((src, i) => ({
      id: i,
      src,
      x: 5 + Math.random() * 90, // ensures images stay inside viewport
      y: 5 + Math.random() * 85,
      size: 100 + Math.random() * 120, // 100–220px
      rotation: -20 + Math.random() * 40,
      delay: i * 0.5,
      depth: 0.3 + Math.random() * 0.7,
      driftX: -25 + Math.random() * 50,
      driftY: -25 + Math.random() * 50,
      floatDuration: 8 + Math.random() * 10,
    }));

    setFloatingImages(newImages);
  }, [images, isVisible]);

  if (!isVisible || floatingImages.length === 0) return null;

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-10">
      {floatingImages.map((img) => {
        const parallaxX = gyro.x * 40 * img.depth;
        const parallaxY = gyro.y * 25 * img.depth;
        const isDragging = draggingId === img.id;

        return (
          <div
            key={img.id}
            className={cn(
              'absolute rounded-sm overflow-hidden pointer-events-auto touch-none cursor-grab active:cursor-grabbing',
              'shadow-2xl'
            )}
            onPointerDown={(e) => {
              e.preventDefault();
              (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
              setDraggingId(img.id);
            }}
            onPointerUp={(e) => {
              (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
              setDraggingId(null);
            }}
            onPointerCancel={() => setDraggingId(null)}
            onPointerMove={(e) => {
              if (draggingId !== img.id) return;
              const vw = window.innerWidth || 1;
              const vh = window.innerHeight || 1;
              const newX = (e.clientX / vw) * 100;
              const newY = (e.clientY / vh) * 100;
              setFloatingImages((prev) =>
                prev.map((item) =>
                  item.id === img.id ? { ...item, x: newX, y: newY } : item
                )
              );
            }}
            style={{
              left: `${img.x}%`,
              top: `${img.y}%`,
              width: `${img.size}px`,
              height: `${img.size}px`,
              transform: `translate(-50%, -50%) translate(${parallaxX}px, ${parallaxY}px) rotate(${img.rotation}deg)`,
              opacity: 1,
              animation: `floating-drift ${img.floatDuration}s ease-in-out ${img.delay}s infinite alternate`,
            }}
          >
            <div className="absolute -inset-6 -z-10"
              style={{
                background: `radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 40%, transparent 70%)`,
                filter: 'blur(20px)',
              }}
            />
            <div className="relative w-full h-full overflow-hidden rounded-sm"
              style={{ border: '1px solid rgba(246,248,250,0.1)' }}
            >
              <img src={img.src} alt="" className="w-full h-full object-cover"
                style={{ filter: `blur(${0.3 * (1 - img.depth)}px) saturate(1.1)` }}
                loading="lazy"
              />
              <div className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.1) 100%)` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
};
