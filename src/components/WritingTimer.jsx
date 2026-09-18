import React, { useState, useEffect, useRef } from 'react';
import { Timer, Play, Pause, RotateCcw, Check, Sparkles, Feather, Save } from 'lucide-react';

const TIMER_PRESETS = [
  { label: '5 min', seconds: 5 * 60, desc: 'Quick spark' },
  { label: '10 min', seconds: 10 * 60, desc: 'Deep dive' },
  { label: '15 min', seconds: 15 * 60, desc: 'Extended flow' },
  { label: '25 min', seconds: 25 * 60, desc: 'Poetic sprint' },
];

export default function WritingTimer({
  onSaveDraft,
  onGenerateFromDraft,
  onContinueWriting,
  className = '',
}) {
  const [selectedDuration, setSelectedDuration] = useState(10 * 60);
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const timerRef = useRef(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsActive(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft]);

  const selectPreset = (seconds) => {
    setIsActive(false);
    setIsCompleted(false);
    setSelectedDuration(seconds);
    setTimeLeft(seconds);
  };

  const toggleTimer = () => {
    if (timeLeft === 0) {
      setTimeLeft(selectedDuration);
      setIsCompleted(false);
    }
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setIsCompleted(false);
    setTimeLeft(selectedDuration);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((selectedDuration - timeLeft) / selectedDuration) * 100;

  return (
    <div className={`p-4 rounded-2xl bg-[#FEFCF9]/90 dark:bg-[#1E1428]/90 border border-[#B491AF]/30 shadow-md backdrop-blur-md transition-all ${className}`}>
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#542F5C]/10 dark:bg-[#EBD8EE]/10 flex items-center justify-center text-[#542F5C] dark:text-[#EBD8EE]">
            <Timer className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-sm tracking-wide text-[#231527] dark:text-[#FDFBF7]">
                Creative Writing Timer
              </span>
              {isActive && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300 animate-pulse">
                  Flowing
                </span>
              )}
            </div>
            <p className="text-xs text-[#523A57] dark:text-[#E2CFE6]">
              Write without editing. Let the words flow uninterrupted.
            </p>
          </div>
        </div>

        {/* Quick controls on the right */}
        <div className="flex items-center gap-2">
          <div className="font-mono text-lg font-bold text-[#231527] dark:text-[#FDFBF7] px-3 py-1 bg-white/70 dark:bg-black/20 rounded-lg border border-[#B491AF]/20 shadow-inner">
            {formatTime(timeLeft)}
          </div>

          <button
            onClick={toggleTimer}
            className={`p-2 rounded-xl text-white font-medium transition-transform active:scale-95 ${
              isActive
                ? 'bg-amber-600 hover:bg-amber-700'
                : 'bg-[#542F5C] hover:bg-[#683972]'
            }`}
            title={isActive ? 'Pause Timer' : 'Start Timer'}
          >
            {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
          </button>

          <button
            onClick={resetTimer}
            className="p-2 rounded-xl text-[#523A57] dark:text-[#E2CFE6] hover:bg-[#542F5C]/10 dark:hover:bg-white/10 transition-colors"
            title="Reset Timer"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs font-medium text-[#542F5C] dark:text-[#EBD8EE] hover:underline px-2 py-1"
          >
            {isExpanded ? 'Less' : 'Presets'}
          </button>
        </div>
      </div>

      {/* Progress line */}
      <div className="mt-3 w-full bg-slate-200 dark:bg-slate-700/50 h-1.5 rounded-full overflow-hidden">
        <div
          className="bg-gradient-to-r from-[#542F5C] to-[#995589] h-full transition-all duration-300 rounded-full"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Preset options expanded */}
      {isExpanded && (
        <div className="mt-4 pt-3 border-t border-[#B491AF]/20 flex flex-wrap items-center gap-2">
          <span className="text-xs font-semibold text-[#523A57] dark:text-[#E2CFE6]">Session length:</span>
          {TIMER_PRESETS.map((preset) => {
            const isSel = selectedDuration === preset.seconds;
            return (
              <button
                key={preset.seconds}
                onClick={() => selectPreset(preset.seconds)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  isSel
                    ? 'bg-[#542F5C] text-white shadow-sm'
                    : 'bg-white/80 dark:bg-white/10 text-[#3A2440] dark:text-[#F3EBF5] hover:bg-[#542F5C]/15 border border-[#B491AF]/30'
                }`}
              >
                {preset.label} <span className="opacity-75 font-normal">({preset.desc})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Completion alert banner */}
      {isCompleted && (
        <div className="mt-4 p-3.5 rounded-xl bg-emerald-50/95 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700 text-[#231527] dark:text-[#FDFBF7] animate-fadeIn">
          <div className="flex items-center gap-2 mb-2">
            <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <h4 className="font-serif font-bold text-sm text-emerald-950 dark:text-emerald-200">
              Session complete! Your creative energy is captured.
            </h4>
          </div>
          <p className="text-xs text-emerald-900 dark:text-emerald-300 mb-3">
            Take a breath. Choose what you would like to do with your draft:
          </p>
          <div className="flex flex-wrap gap-2">
            {onSaveDraft && (
              <button
                onClick={onSaveDraft}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#542F5C] text-white hover:bg-[#683972] shadow-sm transition-transform active:scale-95"
              >
                <Save className="w-3.5 h-3.5" />
                Save Draft
              </button>
            )}
            {onGenerateFromDraft && (
              <button
                onClick={onGenerateFromDraft}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-[#2A1D36] text-[#542F5C] dark:text-[#EBD8EE] border border-[#542F5C]/30 hover:bg-[#542F5C]/10 shadow-sm transition-transform active:scale-95"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Generate From My Draft
              </button>
            )}
            {onContinueWriting && (
              <button
                onClick={() => {
                  setIsCompleted(false);
                  onContinueWriting();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-900 dark:text-emerald-200 hover:bg-emerald-200 dark:hover:bg-emerald-900 transition-colors"
              >
                <Feather className="w-3.5 h-3.5" />
                Continue Writing
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
