import { useState, useEffect, useCallback } from 'react';

interface GyroscopeState {
  x: number;
  y: number;
  isSupported: boolean;
  hasPermission: boolean;
}

export const useGyroscope = (enabled: boolean = true) => {
  const [state, setState] = useState<GyroscopeState>({
    x: 0,
    y: 0,
    isSupported: false,
    hasPermission: false,
  });
  
  const requestPermission = useCallback(async () => {
    // Check if DeviceOrientationEvent exists
    if (typeof DeviceOrientationEvent === 'undefined') {
      return false;
    }
    
    // iOS 13+ requires permission
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        return permission === 'granted';
      } catch (e) {
        console.log('Gyroscope permission denied:', e);
        return false;
      }
    }
    
    // Android and older iOS don't need permission
    return true;
  }, []);
  
  useEffect(() => {
    if (!enabled) {
      setState(prev => ({ ...prev, x: 0, y: 0 }));
      return;
    }
    
    const handleOrientation = (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event;
      
      if (beta !== null && gamma !== null) {
        // Normalize values to -1 to 1 range
        // beta: front-to-back tilt (-180 to 180)
        // gamma: left-to-right tilt (-90 to 90)
        const normalizedX = Math.max(-1, Math.min(1, (gamma || 0) / 45));
        const normalizedY = Math.max(-1, Math.min(1, ((beta || 0) - 45) / 45));
        
        setState(prev => ({
          ...prev,
          x: normalizedX,
          y: normalizedY,
          isSupported: true,
          hasPermission: true,
        }));
      }
    };
    
    // Check support and set up listener
    const init = async () => {
      const hasPermission = await requestPermission();
      
      if (hasPermission) {
        window.addEventListener('deviceorientation', handleOrientation, true);
        setState(prev => ({ ...prev, isSupported: true, hasPermission: true }));
      }
    };
    
    init();
    
    return () => {
      window.removeEventListener('deviceorientation', handleOrientation, true);
    };
  }, [enabled, requestPermission]);
  
  // Fallback to mouse position for desktop
  useEffect(() => {
    if (!enabled || state.isSupported) return;
    
    const handleMouseMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 2;
      const y = (event.clientY / window.innerHeight - 0.5) * 2;
      
      setState(prev => ({
        ...prev,
        x,
        y,
      }));
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [enabled, state.isSupported]);
  
  return state;
};
