import React, { useState } from 'react';
import { X, Sparkles, Wand2 } from 'lucide-react';
import { REMIX_OPTIONS } from '../../data/options';

export default function RemixModal({ isOpen, onClose, onRemix, poem }) {
  const [selectedOption, setSelectedOption] = useState('more_poetic');
  const [customStyle, setCustomStyle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !poem) return null;

  const handleApply = async () => {
    setIsLoading(true);
    try {
      await onRemix(customStyle.trim() ? customStyle : selectedOption);
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#FFF9F5]/95 dark:bg-[#20172B]/95 shadow-2xl border border-[#D9B8CB]/50 backdrop-blur-xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#542F5C] dark:text-[#EBD8EE] hover:bg-[#542F5C]/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-[#542F5C] flex items-center justify-center text-white shadow-sm">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#2B1630] dark:text-[#FDFBF7]">
              Remix This Poem
            </h3>
            <p className="text-xs font-medium text-[#542F5C] dark:text-[#D9B8CB]">
              Transform cadence, emotional tone, length, or poetic density
            </p>
          </div>
        </div>

        {/* Preset Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-5 max-h-60 overflow-y-auto pr-1">
          {REMIX_OPTIONS.map(opt => (
            <button
              key={opt.id}
              onClick={() => {
                setSelectedOption(opt.id);
                setCustomStyle('');
              }}
              className={`text-left p-3 rounded-xl border text-xs transition-all ${
                selectedOption === opt.id && !customStyle
                  ? 'border-[#542F5C] bg-[#542F5C] font-semibold text-white shadow-xs'
                  : 'border-[#D9B8CB]/40 bg-white/60 dark:bg-white/5 hover:bg-[#542F5C]/10 text-[#2B1630] dark:text-[#FDFBF7]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Custom Modifier Field */}
        <div className="mb-6">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1.5">
            Or custom remix instruction:
          </label>
          <input
            type="text"
            value={customStyle}
            onChange={(e) => setCustomStyle(e.target.value)}
            placeholder="e.g. Keep the meaning but make it like a 19th-century letter..."
            className="w-full px-4 py-2.5 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36] border border-[#D9B8CB]/40 text-[#2B1630] dark:text-[#FDFBF7] placeholder-[#7E5E85] dark:placeholder-[#B491AF] outline-none focus:border-[#542F5C]"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#D9B8CB]/25">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#4F3354] dark:text-[#E2CFE6] hover:bg-black/5"
          >
            Cancel
          </button>
          <button
            onClick={handleApply}
            disabled={isLoading}
            className="btn-primary flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold shadow-md disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isLoading ? 'Remixing...' : 'Apply Remix'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
