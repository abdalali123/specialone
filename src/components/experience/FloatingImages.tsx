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

// ⚡ FIXED: Named export
export const FloatingImages = ({ images, isVisible, enableGyro }: FloatingImagesProps) => {
  const [floatingImages, setFloatingImages] = useState<FloatingImage[]>([]);
  const [draggingId, setDraggingId] = useState<number | null>(null);
  const gyro = useGyroscope(enableGyro);

  useEffect(() => {
    if (!isVisible || images.length === 0) return;

    const newImages: FloatingImage[] = images.map((src, i) => ({
      id: i,
      src,
      x: 10 + Math.random() * 80,
      y: 10 + Math.random() * 70,
      size: 150 + Math.random() * 50, // ⚡ fixed size to fully show
      rotation: -15 + Math.random() * 30,
      delay: i * 0.5,
      depth: 0.3 + Math.random() * 0.7,
      driftX: -20 + Math.random() * 40,
      driftY: -20 + Math.random() * 40,
      floatDuration: 10 + Math.random() * 10,
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
              height: `${img.size * 0.75}px`,
              transform: `translate(-50%, -50%) translate(${parallaxX}px, ${parallaxY}px) rotate(${img.rotation}deg)`,
              opacity: 1,
              animation: `floating-drift ${img.floatDuration}s ease-in-out ${img.delay}s infinite alternate`,
            }}
          >
            {/* Soft halo */}
            <div
              className="absolute -inset-8 -z-10"
              style={{
                background: `radial-gradient(ellipse at center, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 40%, transparent 70%)`,
                filter: 'blur(30px)',
              }}
            />
            <div
              className="relative w-full h-full overflow-hidden rounded-sm"
              style={{ border: '1px solid rgba(246,248,250,0.1)' }}
            >
              <img
                src={img.src}
                alt=""
                className="w-full h-full object-cover"
                style={{ filter: `blur(${0.3 * (1 - img.depth)}px) saturate(1.1)` }}
                loading="lazy"
              />
              <div
                className="absolute inset-0"
                style={{ background: `linear-gradient(135deg, transparent 0%, rgba(0,0,0,0.1) 100%)` }}
              />
            </div>
          </div>
        );
      })}

      {/* Ambient particles */}
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
              opacity: 1,
              animation: `particle-float ${15 + Math.random() * 10}s ease-in-out ${Math.random() * 5}s infinite alternate`,
            }}
          />
        ))}
      </div>
    </div>
  );
};
