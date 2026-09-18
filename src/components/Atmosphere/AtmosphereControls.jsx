import React, { useState } from 'react';
import {
  Sparkles, Volume2, VolumeX, Eye, CloudRain, Wind, Moon, BellRing,
  Sliders, Sun, Sunset, ChevronDown, Waves
} from 'lucide-react';
import { useAtmosphere } from '../../context/AtmosphereContext';
import { ATMOSPHERES } from '../../data/options';

export default function AtmosphereControls() {
  const {
    atmosphere,
    atmosphereMode,
    timeOfDay,
    reducedMotion,
    ambientAudioTrack,
    isSoundOn,
    ambientParticle,
    ambientIntensity,
    petalIntensity,
    windStrength,
    breezeLevel = 'medium',
    setAtmosphere,
    toggleAtmosphereMode,
    setTimeOfDay,
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
    stopAmbientAudio
  } = useAtmosphere();

  const [isOpen, setIsOpen] = useState(false);
  const [isAudioMenuOpen, setIsAudioMenuOpen] = useState(false);
  const [isAmbientMenuOpen, setIsAmbientMenuOpen] = useState(false);
  const [breezeActiveVisual, setBreezeActiveVisual] = useState(false);

  const audioOptions = [
    { id: 'wind', label: 'Pine Breeze', icon: Wind },
    { id: 'rain', label: 'Gentle Rain', icon: CloudRain },
    { id: 'ocean', label: 'Ocean Waves', icon: Waves },
    { id: 'night', label: 'Night Resonance', icon: Moon },
    { id: 'bowl', label: 'Singing Bowl', icon: BellRing },
  ];

  const timeOfDayOptions = [
    { id: 'morning', label: 'Morning', icon: Sun, desc: 'Soft pink/blue dawn' },
    { id: 'golden', label: 'Golden Hour', icon: Sun, desc: 'Warm peach & gold' },
    { id: 'sunset', label: 'Sunset', icon: Sunset, desc: 'Rose & twilight purple' },
    { id: 'night', label: 'Night', icon: Moon, desc: 'Velvet indigo & starlight' },
  ];

  const particleTypes = [
    { id: 'auto', label: 'Auto' },
    { id: 'petals', label: 'Sakura' },
    { id: 'rain', label: 'Rain' },
    { id: 'snow', label: 'Snow' },
    { id: 'leaves', label: 'Leaves' },
    { id: 'stars', label: 'Stars' },
    { id: 'none', label: 'None' },
  ];

  const handleBreezeClick = () => {
    triggerBreeze();
    setBreezeActiveVisual(true);
    setTimeout(() => setBreezeActiveVisual(false), 900);
  };

  // Human readable label for current atmosphere
  const currentAtmObj = ATMOSPHERES.find(a => a.id === atmosphere) || { label: atmosphere };
  const currentAtmLabel = currentAtmObj.label.replace(' (From Poem)', '').replace(' Breeze', '').replace(' Midnight', '').replace(' Starlight', '');

  return (
    <div className="fixed bottom-4 left-4 sm:bottom-5 sm:left-5 z-40 no-print flex flex-wrap items-center gap-1.5 sm:gap-2">
      {/* 1. Environment / Atmosphere Selector Trigger */}
      <div className="relative">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            setIsAudioMenuOpen(false);
            setIsAmbientMenuOpen(false);
          }}
          title="Change Environmental Atmosphere"
          className="btn-secondary flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-bold transition-all shadow-sm active:scale-95"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#854479]" />
          <span className="capitalize text-[#35233F]">
            {atmosphereMode === 'auto' ? `Auto: ${currentAtmLabel}` : currentAtmLabel}
          </span>
          <ChevronDown className="w-3 h-3 text-[#59445F] opacity-70" />
        </button>

        {/* Atmosphere Popover Menu */}
        {isOpen && (
          <div className="absolute bottom-12 left-0 w-80 p-4 rounded-3xl bg-[#FFF9F5]/96 dark:bg-[#1E1428]/96 backdrop-blur-xl shadow-2xl border border-[#D9B8CB]/40 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#D9B8CB]/25">
              <span className="text-xs font-bold text-[#35233F] dark:text-[#FDFBF7] uppercase tracking-wider">
                Atmosphere Sanctuary
              </span>
              <button
                onClick={() => toggleAtmosphereMode(atmosphereMode === 'auto' ? 'manual' : 'auto')}
                className={`text-[10px] px-2.5 py-1 rounded-full font-bold transition-colors ${
                  atmosphereMode === 'auto'
                    ? 'btn-primary'
                    : 'bg-black/10 dark:bg-white/15 text-[#35233F] dark:text-[#FDFBF7]'
                }`}
              >
                {atmosphereMode === 'auto' ? 'Auto Mode' : 'Manual'}
              </button>
            </div>

            {/* Time of Day Picker */}
            <div className="mb-3">
              <span className="text-[10px] font-bold text-[#59445F] dark:text-[#D9C4DC] uppercase tracking-wider block mb-1.5">
                Time of Day
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {timeOfDayOptions.map(tod => {
                  const isSel = timeOfDay === tod.id;
                  const Icon = tod.icon;
                  return (
                    <button
                      key={tod.id}
                      onClick={() => setTimeOfDay(tod.id)}
                      className={`text-left p-2 rounded-xl text-xs transition-all flex items-center gap-2 ${
                        isSel
                          ? 'bg-gradient-to-r from-[#633367] to-[#854479] text-white font-bold shadow-xs'
                          : 'bg-white/70 dark:bg-white/5 hover:bg-white text-[#35233F] dark:text-[#FDFBF7] border border-[#D9B8CB]/25'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <div className="truncate font-bold text-[11px]">{tod.label}</div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Atmosphere Environments Grid */}
            <span className="text-[10px] font-bold text-[#59445F] dark:text-[#D9C4DC] uppercase tracking-wider block mb-1.5">
              Environment Presets
            </span>
            <div className="grid grid-cols-2 gap-1.5 max-h-48 overflow-y-auto pr-1 mb-3">
              {ATMOSPHERES.map(atm => (
                <button
                  key={atm.id}
                  onClick={() => {
                    if (atm.id === 'auto') {
                      toggleAtmosphereMode('auto');
                    } else {
                      setAtmosphere(atm.id, true);
                    }
                    setIsOpen(false);
                  }}
                  className={`text-left text-xs px-2.5 py-1.5 rounded-xl transition-all flex items-center gap-2 ${
                    atmosphere === atm.id
                      ? 'bg-gradient-to-r from-[#633367] to-[#854479] text-white font-bold shadow-xs'
                      : 'hover:bg-white/80 dark:hover:bg-white/10 text-[#35233F] dark:text-[#FDFBF7] font-semibold bg-white/50 dark:bg-white/5 border border-[#D9B8CB]/20'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: atm.color }} />
                  <span className="truncate">{atm.label.replace(' (From Poem)', '')}</span>
                </button>
              ))}
            </div>

            {/* Reduced Motion Toggle */}
            <div className="pt-2.5 border-t border-[#D9B8CB]/25 flex items-center justify-between">
              <span className="text-xs text-[#35233F] dark:text-[#FDFBF7] font-bold flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#854479]" /> Reduced Motion
              </span>
              <button
                onClick={() => setReducedMotion(!reducedMotion)}
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold transition-colors ${
                  reducedMotion ? 'btn-primary' : 'bg-black/10 dark:bg-white/10 text-[#35233F] dark:text-[#FDFBF7]'
                }`}
              >
                {reducedMotion ? 'On' : 'Off'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2. Wind Intensity & Particle Menu */}
      <div className="relative">
        <div className="flex items-center">
          {/* Main button: Click to cycle Wind: Low -> Medium -> High -> Low */}
          <button
            onClick={cycleWindStrength}
            title="Click to cycle Wind Intensity: Low / Medium / High"
            className="btn-secondary flex items-center gap-1.5 px-3 py-1.5 sm:px-3 sm:py-2 rounded-l-full text-xs font-bold active:scale-95 transition-all"
          >
            <Sliders className="w-3.5 h-3.5 text-[#854479]" />
            <span className="capitalize text-[#35233F]">Wind: {windStrength}</span>
          </button>
          {/* Popover trigger button for detailed particle & wind menu */}
          <button
            onClick={() => {
              setIsAmbientMenuOpen(!isAmbientMenuOpen);
              setIsOpen(false);
              setIsAudioMenuOpen(false);
            }}
            title="Open Particle & Wind Simulation Details"
            className="btn-secondary px-1.5 py-1.5 sm:py-2 rounded-r-full border-l-0 text-xs font-bold text-[#59445F] hover:text-[#35233F]"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {isAmbientMenuOpen && (
          <div className="absolute bottom-12 left-0 w-80 p-4 rounded-3xl bg-[#FFF9F5]/96 dark:bg-[#1E1428]/96 backdrop-blur-xl shadow-2xl border border-[#D9B8CB]/40 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="pb-2.5 mb-2.5 border-b border-[#D9B8CB]/25 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-[#35233F] dark:text-[#FDFBF7] uppercase tracking-wider block">
                  Wind & Environmental Simulation
                </span>
                <span className="text-[10px] text-[#59445F] dark:text-[#D9C4DC]">Living atmospheric particle physics</span>
              </div>
            </div>

            {/* Particle Type Overrides */}
            <span className="text-[10px] font-bold text-[#59445F] dark:text-[#D9C4DC] uppercase tracking-wider block mb-1.5">
              Particle Ambiance
            </span>
            <div className="grid grid-cols-4 gap-1 mb-3.5">
              {particleTypes.map(p => (
                <button
                  key={p.id}
                  onClick={() => setParticleOverride(p.id)}
                  className={`py-1.5 px-1 rounded-xl text-xs font-bold transition-all text-center ${
                    ambientParticle === p.id
                      ? 'bg-gradient-to-r from-[#633367] to-[#854479] text-white shadow-xs'
                      : 'bg-white/70 dark:bg-white/5 hover:bg-white text-[#35233F] dark:text-[#FDFBF7] border border-[#D9B8CB]/25'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>

            {/* Wind Control: Low / Medium / High */}
            <div className="pt-2 border-t border-[#D9B8CB]/25 flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-[#35233F] dark:text-[#FDFBF7]">Wind Intensity</span>
              <div className="flex gap-1">
                {['low', 'medium', 'high'].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setWindStrength(lvl)}
                    className={`capitalize px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                      windStrength === lvl
                        ? 'bg-gradient-to-r from-[#633367] to-[#854479] text-white shadow-xs'
                        : 'bg-white/70 dark:bg-white/10 text-[#35233F] dark:text-[#FDFBF7] border border-[#D9B8CB]/25'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Petal & Particle Density: Low / Medium / High */}
            <div className="pt-2 border-t border-[#D9B8CB]/25 flex items-center justify-between mb-2.5">
              <span className="text-xs font-bold text-[#35233F] dark:text-[#FDFBF7]">Particle Density</span>
              <div className="flex gap-1">
                {['low', 'medium', 'high'].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => {
                      setPetalIntensity(lvl);
                      setIntensity(lvl);
                    }}
                    className={`capitalize px-2.5 py-1 rounded-xl text-xs font-bold transition-all ${
                      petalIntensity === lvl
                        ? 'bg-gradient-to-r from-[#633367] to-[#854479] text-white shadow-xs'
                        : 'bg-white/70 dark:bg-white/10 text-[#35233F] dark:text-[#FDFBF7] border border-[#D9B8CB]/25'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>

            {/* Breeze Level: Off / Low / Medium / High */}
            <div className="pt-2 border-t border-[#D9B8CB]/25 flex items-center justify-between">
              <span className="text-xs font-bold text-[#35233F] dark:text-[#FDFBF7]">Breeze Swell</span>
              <div className="flex gap-1">
                {['off', 'low', 'medium', 'high'].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => setBreezeLevel(lvl)}
                    className={`capitalize px-2 py-1 rounded-xl text-xs font-bold transition-all ${
                      breezeLevel === lvl
                        ? 'bg-gradient-to-r from-[#633367] to-[#854479] text-white shadow-xs'
                        : 'bg-white/70 dark:bg-white/10 text-[#35233F] dark:text-[#FDFBF7] border border-[#D9B8CB]/25'
                    }`}
                  >
                    {lvl}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 3. Ambient Sound Control (Direct Toggle ON/OFF + Soundscape Popover) */}
      <div className="relative">
        <div className="flex items-center">
          <button
            onClick={() => toggleSound()}
            title={isSoundOn ? 'Click to Mute Sound' : 'Click to Enable Atmospheric Sound'}
            className={`btn-secondary flex items-center gap-1.5 px-3 py-1.5 sm:px-3 sm:py-2 rounded-l-full text-xs font-bold transition-all active:scale-95 ${
              isSoundOn ? '!bg-[#F8D8E0] !border-[#854479]' : ''
            }`}
          >
            {isSoundOn ? (
              <>
                <Volume2 className="w-3.5 h-3.5 text-[#854479] animate-pulse" />
                <span>Sound: On</span>
              </>
            ) : (
              <>
                <VolumeX className="w-3.5 h-3.5 text-[#5C3A5F]" />
                <span>Sound: Off</span>
              </>
            )}
          </button>
          <button
            onClick={() => {
              setIsAudioMenuOpen(!isAudioMenuOpen);
              setIsOpen(false);
              setIsAmbientMenuOpen(false);
            }}
            title="Select Specific Ambient Soundscape"
            className="btn-secondary px-1.5 py-1.5 sm:py-2 rounded-r-full border-l-0 text-xs font-bold text-[#59445F] hover:text-[#35233F]"
          >
            <ChevronDown className="w-3 h-3" />
          </button>
        </div>

        {isAudioMenuOpen && (
          <div className="absolute bottom-12 left-0 w-60 p-4 rounded-3xl bg-[#FFF9F5]/96 dark:bg-[#1E1428]/96 backdrop-blur-xl shadow-2xl border border-[#D9B8CB]/40 animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#D9B8CB]/25">
              <span className="text-xs font-bold text-[#2B1630] dark:text-[#FDFBF7] uppercase tracking-wider">
                Soundscapes
              </span>
              {isSoundOn && (
                <button
                  onClick={stopAmbientAudio}
                  className="text-xs font-bold text-rose-600 dark:text-rose-400 hover:underline"
                >
                  Mute
                </button>
              )}
            </div>

            <div className="space-y-1.5">
              {audioOptions.map(opt => {
                const Icon = opt.icon;
                const isActive = ambientAudioTrack === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      toggleSound(opt.id);
                      setIsAudioMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all text-left font-bold ${
                      isActive
                        ? 'bg-gradient-to-r from-[#633367] to-[#854479] text-white shadow-xs'
                        : 'bg-white/60 dark:bg-white/10 hover:bg-white text-[#2B1630] dark:text-[#FDFBF7] border border-[#D9B8CB]/25'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 text-[#854479]" />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
            <p className="mt-2.5 text-[10px] text-[#5C3A5F] dark:text-[#D9C4DC] italic text-center font-medium">
              Live browser audio synthesis • Zero external assets
            </p>
          </div>
        )}
      </div>

      {/* 4. Breeze Control (Off / Low / Medium / High) */}
      <button
        onClick={() => {
          cycleBreezeLevel();
          setBreezeActiveVisual(true);
          setTimeout(() => setBreezeActiveVisual(false), 900);
        }}
        title={`Click to cycle Breeze: Off / Low / Medium / High (Current: ${breezeLevel})`}
        className={`btn-secondary flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-full text-xs font-bold transition-all active:scale-95 ${
          breezeActiveVisual ? '!bg-[#F8D8E0] !border-[#854479] scale-105' : 'hover:scale-105'
        }`}
      >
        <Wind className={`w-3.5 h-3.5 text-[#854479] ${breezeLevel !== 'off' && !reducedMotion ? (breezeLevel === 'high' ? 'animate-spin' : '') : ''}`} />
        <span className="capitalize text-[#35233F]">
          Breeze: {breezeLevel === 'medium' ? 'Med' : breezeLevel}
        </span>
      </button>
    </div>
  );
}
