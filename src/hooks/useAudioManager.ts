import { useCallback, useRef, useState } from 'react';

interface AudioState {
  isPlaying: boolean;
  isLoaded: boolean;
  isMuted: boolean;
}

export const useAudioManager = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const celebrationRef = useRef<HTMLAudioElement | null>(null);
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const heartbeatRef = useRef<HTMLAudioElement | null>(null);
  
  const [audioState, setAudioState] = useState<AudioState>({
    isPlaying: false,
    isLoaded: false,
    isMuted: false,
  });
  
  // Initialize Web Audio API context
  const initAudioContext = useCallback(() => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    return audioContextRef.current;
  }, []);
  
  // Create audio element with proper settings
  const createAudioElement = useCallback((src: string, loop: boolean = true): HTMLAudioElement => {
    const audio = new Audio();
    audio.src = src;
    audio.loop = loop;
    audio.preload = 'auto';
    audio.volume = 0;
    return audio;
  }, []);
  
  // Fade audio in/out
  const fadeAudio = useCallback((
    audio: HTMLAudioElement,
    targetVolume: number,
    duration: number = 1000
  ): Promise<void> => {
    return new Promise((resolve) => {
      const startVolume = audio.volume;
      const startTime = performance.now();
      
      const fade = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Smooth easing
        const eased = 1 - Math.pow(1 - progress, 3);
        audio.volume = startVolume + (targetVolume - startVolume) * eased;
        
        if (progress < 1) {
          requestAnimationFrame(fade);
        } else {
          audio.volume = targetVolume;
          resolve();
        }
      };
      
      requestAnimationFrame(fade);
    });
  }, []);
  
  // Hard stop - IMMEDIATE, no fade
  const hardStop = useCallback((audio: HTMLAudioElement | null) => {
    if (audio) {
      audio.pause();
      audio.volume = 0;
      audio.currentTime = 0;
    }
  }, []);
  
  // Stop all audio immediately
  const stopAll = useCallback(() => {
    hardStop(celebrationRef.current);
    hardStop(ambientRef.current);
    hardStop(heartbeatRef.current);
    setAudioState(prev => ({ ...prev, isPlaying: false }));
  }, [hardStop]);
  
  // Play celebration audio (loud, festive)
  const playCelebration = useCallback(async (src?: string) => {
    initAudioContext();
    
    if (!celebrationRef.current && src) {
      celebrationRef.current = createAudioElement(src, true);
    }
    
    if (celebrationRef.current) {
      try {
        celebrationRef.current.currentTime = 0;
        await celebrationRef.current.play();
        await fadeAudio(celebrationRef.current, 0.8, 500);
        setAudioState(prev => ({ ...prev, isPlaying: true }));
      } catch (e) {
        console.log('Audio play prevented:', e);
      }
    }
  }, [initAudioContext, createAudioElement, fadeAudio]);
  
  // Stop celebration with hard cut
  const stopCelebration = useCallback(() => {
    hardStop(celebrationRef.current);
  }, [hardStop]);
  
  // Play ambient audio (subtle, atmospheric)
  const playAmbient = useCallback(async (src?: string) => {
    initAudioContext();
    
    if (!ambientRef.current && src) {
      ambientRef.current = createAudioElement(src, true);
    }
    
    if (ambientRef.current) {
      try {
        await ambientRef.current.play();
        await fadeAudio(ambientRef.current, 0.3, 2000);
        setAudioState(prev => ({ ...prev, isPlaying: true }));
      } catch (e) {
        console.log('Ambient audio play prevented:', e);
      }
    }
  }, [initAudioContext, createAudioElement, fadeAudio]);
  
  // Stop ambient with fade
  const stopAmbient = useCallback(async () => {
    if (ambientRef.current) {
      await fadeAudio(ambientRef.current, 0, 1500);
      ambientRef.current.pause();
    }
  }, [fadeAudio]);
  
  // Play heartbeat (very subtle, Phase 2-3)
  const playHeartbeat = useCallback(async (src?: string) => {
    initAudioContext();
    
    if (!heartbeatRef.current && src) {
      heartbeatRef.current = createAudioElement(src, true);
    }
    
    if (heartbeatRef.current) {
      try {
        await heartbeatRef.current.play();
        await fadeAudio(heartbeatRef.current, 0.1, 3000);
      } catch (e) {
        console.log('Heartbeat audio play prevented:', e);
      }
    }
  }, [initAudioContext, createAudioElement, fadeAudio]);
  
  // Play celebration at reduced volume (for reinterpret phase)
  const playCelebrationDistant = useCallback(async () => {
    if (celebrationRef.current) {
      try {
        celebrationRef.current.currentTime = 0;
        celebrationRef.current.playbackRate = 0.85; // Slightly slowed
        await celebrationRef.current.play();
        await fadeAudio(celebrationRef.current, 0.2, 1500);
      } catch (e) {
        console.log('Distant celebration prevented:', e);
      }
    }
  }, [fadeAudio]);
  
  // Mute toggle
  const toggleMute = useCallback(() => {
    const muted = !audioState.isMuted;
    
    [celebrationRef, ambientRef, heartbeatRef].forEach(ref => {
      if (ref.current) {
        ref.current.muted = muted;
      }
    });
    
    setAudioState(prev => ({ ...prev, isMuted: muted }));
  }, [audioState.isMuted]);
  
  // Preload all audio
  const preloadAudio = useCallback((config: { celebration?: string; ambient?: string; heartbeat?: string }) => {
    if (config.celebration) {
      celebrationRef.current = createAudioElement(config.celebration, true);
    }
    if (config.ambient) {
      ambientRef.current = createAudioElement(config.ambient, true);
    }
    if (config.heartbeat) {
      heartbeatRef.current = createAudioElement(config.heartbeat, true);
    }
    setAudioState(prev => ({ ...prev, isLoaded: true }));
  }, [createAudioElement]);
  
  return {
    audioState,
    initAudioContext,
    playCelebration,
    stopCelebration,
    playAmbient,
    stopAmbient,
    playHeartbeat,
    playCelebrationDistant,
    stopAll,
    toggleMute,
    preloadAudio,
  };
};
