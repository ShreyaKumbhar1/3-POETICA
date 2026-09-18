import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { ambientSound } from '../utils/audioSynth.js';

const AtmosphereContext = createContext(null);

export function AtmosphereProvider({ children }) {
  const [atmosphere, setAtmosphereState] = useState(() => localStorage.getItem('poetica_atmosphere') || 'sakura');
  const [atmosphereMode, setAtmosphereMode] = useState(() => localStorage.getItem('poetica_atmosphere_mode') || 'manual');
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem('poetica_theme_mode') || 'light');
  const [reducedMotion, setReducedMotionState] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });
  const [ambientAudioTrack, setAmbientAudioTrack] = useState(null);

  // Time of Day: 'morning' | 'golden' | 'sunset' | 'night' (Default: golden)
  const [timeOfDay, setTimeOfDayState] = useState(() => localStorage.getItem('poetica_time_of_day') || 'golden');

  // Ambient Mode (particle override & intensity: default 'medium')
  const [ambientParticle, setAmbientParticle] = useState(() => localStorage.getItem('poetica_ambient_particle') || 'auto');
  const [ambientIntensity, setAmbientIntensity] = useState(() => localStorage.getItem('poetica_ambient_intensity') || 'medium');

  // Petal Intensity ('low' | 'medium' | 'high', default 'medium')
  const [petalIntensity, setPetalIntensityState] = useState(() => localStorage.getItem('poetica_petal_intensity') || 'medium');

  // Wind Strength ('low' | 'medium' | 'high', default 'medium')
  const [windStrength, setWindStrengthState] = useState(() => localStorage.getItem('poetica_wind_strength') || 'medium');

  // Breeze Level ('off' | 'low' | 'medium' | 'high', default 'medium')
  const [breezeLevel, setBreezeLevelState] = useState(() => localStorage.getItem('poetica_breeze_level') || 'medium');

  // Interactive Breeze Trigger for Canvas
  const [breezeTrigger, setBreezeTrigger] = useState(0);

  // Mouse position ref for 60fps parallax without React re-rendering overhead
  const mousePosRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const handlePointerMove = (e) => {
      // Normalize mouse coordinates (-1 to 1) from center of screen
      const nx = (e.clientX / window.innerWidth - 0.5) * 2;
      const ny = (e.clientY / window.innerHeight - 0.5) * 2;
      mousePosRef.current.targetX = nx;
      mousePosRef.current.targetY = ny;
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  // Sync theme, atmosphere, and time-of-day data attributes to root HTML
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-atmosphere', atmosphere);
    root.setAttribute('data-time-of-day', timeOfDay);

    const isDark = atmosphere === 'night' || timeOfDay === 'night' || themeMode === 'dark';
    if (isDark) {
      root.classList.add('dark');
      root.setAttribute('data-theme', 'dark');
    } else {
      root.classList.remove('dark');
      root.setAttribute('data-theme', 'light');
    }

    localStorage.setItem('poetica_theme_mode', themeMode);
    localStorage.setItem('poetica_atmosphere', atmosphere);
    localStorage.setItem('poetica_time_of_day', timeOfDay);
  }, [themeMode, atmosphere, timeOfDay]);

  // Helper to map environment to its natural ambient soundscape
  const getDefaultAudioForAtmosphere = (atm) => {
    switch (atm) {
      case 'rain':
        return 'rain';
      case 'night':
        return 'night';
      case 'ocean':
        return 'ocean';
      case 'winter':
      case 'minimal':
      case 'sunrise':
        return 'bowl';
      case 'forest':
      case 'sakura':
      case 'autumn':
      case 'spring':
      case 'mountain':
      default:
        return 'wind';
    }
  };

  const setAtmosphere = (newAtmosphere, isManual = true) => {
    setAtmosphereState(newAtmosphere);
    if (isManual) {
      setAtmosphereMode('manual');
      localStorage.setItem('poetica_atmosphere_mode', 'manual');
    }

    // If sound is actively playing, smoothly shift soundscape to match the new environment
    if (ambientAudioTrack) {
      const targetAudio = getDefaultAudioForAtmosphere(newAtmosphere);
      ambientSound.stop();
      ambientSound.toggle(targetAudio);
      setAmbientAudioTrack(targetAudio);
    }
  };

  const setAutoAtmosphere = (detectedAtmosphere) => {
    if (atmosphereMode === 'auto' && detectedAtmosphere) {
      setAtmosphereState(detectedAtmosphere);
      if (ambientAudioTrack) {
        const targetAudio = getDefaultAudioForAtmosphere(detectedAtmosphere);
        ambientSound.stop();
        ambientSound.toggle(targetAudio);
        setAmbientAudioTrack(targetAudio);
      }
    }
  };

  const toggleAtmosphereMode = (mode) => {
    setAtmosphereMode(mode);
    localStorage.setItem('poetica_atmosphere_mode', mode);
  };

  const setTimeOfDay = (tod) => {
    setTimeOfDayState(tod);
    localStorage.setItem('poetica_time_of_day', tod);
  };

  const setReducedMotion = (enabled) => {
    setReducedMotionState(enabled);
    localStorage.setItem('poetica_reduced_motion', String(enabled));
  };

  const setParticleOverride = (type) => {
    setAmbientParticle(type);
    localStorage.setItem('poetica_ambient_particle', type);
  };

  const setIntensity = (level) => {
    setAmbientIntensity(level);
    localStorage.setItem('poetica_ambient_intensity', level);
  };

  const setPetalIntensity = (level) => {
    setPetalIntensityState(level);
    localStorage.setItem('poetica_petal_intensity', level);
  };

  const setWindStrength = (level) => {
    setWindStrengthState(level);
    localStorage.setItem('poetica_wind_strength', level);
  };

  const cycleWindStrength = () => {
    const levels = ['low', 'medium', 'high'];
    const currentIndex = levels.indexOf(windStrength);
    const nextLevel = levels[(currentIndex + 1) % levels.length];
    setWindStrength(nextLevel);
    return nextLevel;
  };

  const setBreezeLevel = (level) => {
    setBreezeLevelState(level);
    localStorage.setItem('poetica_breeze_level', level);
  };

  const cycleBreezeLevel = () => {
    const levels = ['off', 'low', 'medium', 'high'];
    const currentIndex = levels.indexOf(breezeLevel);
    const nextLevel = levels[(currentIndex + 1) % levels.length];
    setBreezeLevel(nextLevel);
    setBreezeTrigger((prev) => prev + 1); // Also trigger immediate gust feedback
    return nextLevel;
  };

  const triggerBreeze = useCallback(() => {
    setBreezeTrigger((prev) => prev + 1);
  }, []);

  // Toggle ambient audio on/off or change track explicitly
  const toggleSound = (specificTrack = null) => {
    if (specificTrack) {
      if (ambientAudioTrack === specificTrack) {
        // If clicking the same active track, turn off
        ambientSound.stop();
        setAmbientAudioTrack(null);
      } else {
        // Switch to new track
        ambientSound.stop();
        ambientSound.toggle(specificTrack);
        setAmbientAudioTrack(specificTrack);
      }
    } else {
      // Direct on/off toggle
      if (ambientAudioTrack) {
        ambientSound.stop();
        setAmbientAudioTrack(null);
      } else {
        const targetTrack = getDefaultAudioForAtmosphere(atmosphere);
        ambientSound.toggle(targetTrack);
        setAmbientAudioTrack(targetTrack);
      }
    }
  };

  const toggleAmbientAudio = (type) => {
    toggleSound(type);
  };

  const stopAmbientAudio = () => {
    ambientSound.stop();
    setAmbientAudioTrack(null);
  };

  return (
    <AtmosphereContext.Provider value={{
      atmosphere,
      atmosphereMode,
      themeMode,
      timeOfDay,
      reducedMotion,
      ambientAudioTrack,
      isSoundOn: !!ambientAudioTrack,
      ambientParticle,
      ambientIntensity,
      petalIntensity,
      windStrength,
      breezeLevel,
      breezeTrigger,
      mousePosRef,
      setAtmosphere,
      setAutoAtmosphere,
      toggleAtmosphereMode,
      setTimeOfDay,
      setThemeMode,
      setReducedMotion,
      setParticleOverride,
      setIntensity,
      setPetalIntensity,
      setWindStrength,
      cycleWindStrength,
      setBreezeLevel,
      cycleBreezeLevel,
      triggerBreeze,
      toggleSound,
      toggleAmbientAudio,
      stopAmbientAudio
    }}>
      {children}
    </AtmosphereContext.Provider>
  );
}

export function useAtmosphere() {
  const context = useContext(AtmosphereContext);
  if (!context) throw new Error('useAtmosphere must be used within AtmosphereProvider');
  return context;
}
