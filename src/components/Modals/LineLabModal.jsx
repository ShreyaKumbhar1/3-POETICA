import React, { useState, useEffect } from 'react';
import { X, Sparkles, Wand2, Check, RefreshCw, ArrowRight } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function LineLabModal({ isOpen, onClose, poem, initialLine = '', onApplyLine }) {
  const toast = useToast();
  const [targetLine, setTargetLine] = useState(initialLine);
  const [mode, setMode] = useState('improve');
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedReplacement, setSelectedReplacement] = useState('');

  const lineModes = [
    { id: 'improve', label: 'Improve Line' },
    { id: 'softer', label: 'Make Softer' },
    { id: 'deeper', label: 'Make Deeper' },
    { id: 'romantic', label: 'Make Romantic' },
    { id: 'mysterious', label: 'Make Mysterious' },
    { id: 'simplify', label: 'Simplify' },
    { id: 'alternatives', label: 'Alternatives' }
  ];

  useEffect(() => {
    if (initialLine) {
      setTargetLine(initialLine);
    } else if (poem?.content) {
      const firstLine = poem.content.split('\n').find(l => l.trim().length > 0) || '';
      setTargetLine(firstLine);
    }
  }, [initialLine, poem]);

  useEffect(() => {
    if (isOpen && targetLine) {
      handleAnalyze(mode);
    }
  }, [isOpen]);

  const handleAnalyze = async (selectedMode) => {
    if (!targetLine.trim()) return;
    setMode(selectedMode);
    setIsLoading(true);
    try {
      const res = await api.analyzeLine(targetLine.trim(), selectedMode);
      setResult(res);
      setSelectedReplacement(res.suggestion || (res.variants && res.variants[0]) || '');
    } catch (e) {
      toast.error('Line lab analysis failed');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const handleApply = () => {
    if (!selectedReplacement) {
      onClose();
      return;
    }
    onApplyLine(targetLine, selectedReplacement);
    toast.success('Line updated in poem');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl p-6 sm:p-8 rounded-3xl bg-[#FFF9F5] dark:bg-[#1E1328] shadow-2xl border border-[#D9C4D6] dark:border-[#3D2847] max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#4D3652] dark:text-[#EADEEF] hover:bg-black/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#633367] to-[#854479] flex items-center justify-center text-white shadow-sm">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#2B1630] dark:text-[#FDFBF7]">
              Line Lab Studio
            </h3>
            <p className="text-xs font-medium text-[#4D3652] dark:text-[#E2CFE6]">
              Isolate and refine individual verses with targeted tonal treatments
            </p>
          </div>
        </div>

        {/* Target Line Selector / Input */}
        <div className="mb-4">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1">
            Target Verse to Refine:
          </label>
          <input
            type="text"
            value={targetLine}
            onChange={(e) => setTargetLine(e.target.value)}
            placeholder="Select or paste a line from your poem..."
            className="w-full px-4 py-2.5 rounded-2xl text-xs glass-input font-serif italic text-[#2B1630] dark:text-[#FDFBF7]"
          />
        </div>

        {/* Mode Selector Chips */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {lineModes.map(m => (
            <button
              key={m.id}
              onClick={() => handleAnalyze(m.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                mode === m.id
                  ? 'bg-[#542F5C] text-white shadow-xs'
                  : 'btn-secondary !text-xs !py-1'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Side-by-Side Comparison Container */}
        <div className="flex-1 overflow-y-auto space-y-4 my-2 pr-1">
          {isLoading ? (
            <div className="py-12 text-center text-xs font-medium text-[#542F5C] flex flex-col items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-[#854479]" />
              <span>Polishing the verse...</span>
            </div>
          ) : result ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Original */}
              <div className="p-4 rounded-2xl bg-black/5 dark:bg-white/5 border border-[#D9B8CB]/35">
                <span className="text-[10px] uppercase font-bold text-[#542F5C] dark:text-[#EBD8EE] block mb-2">Original Line</span>
                <p className="font-serif text-sm italic text-[#2B1630] dark:text-[#FDFBF7]">
                  "{result.original}"
                </p>
              </div>

              {/* Suggestions */}
              <div className="p-4 rounded-2xl bg-white/85 dark:bg-purple-950/30 border border-[#D9B8CB]/45 shadow-xs">
                <span className="text-[10px] uppercase font-bold text-[#542F5C] dark:text-[#EBD8EE] block mb-2">
                  {result.mode} Suggestion
                </span>

                {result.suggestion && (
                  <div>
                    <p className="font-serif text-base font-semibold italic text-[#2B1630] dark:text-[#FDFBF7] mb-2">
                      "{result.suggestion}"
                    </p>
                    {result.nuance && (
                      <p className="text-[11px] font-medium text-[#4D3652] dark:text-[#E2CFE6] italic">
                        Nuance: {result.nuance}
                      </p>
                    )}
                  </div>
                )}

                {result.variants && (
                  <div className="space-y-2">
                    {result.variants.map((v, i) => (
                      <button
                        key={i}
                        onClick={() => setSelectedReplacement(v)}
                        className={`w-full text-left p-2.5 rounded-xl border text-xs font-serif italic transition-all ${
                          selectedReplacement === v
                            ? 'bg-[#542F5C] text-white border-[#542F5C]'
                            : 'border-[#D9B8CB]/40 bg-white/80 dark:bg-white/10 hover:bg-white text-[#2B1630] dark:text-[#FDFBF7]'
                        }`}
                      >
                        "{v}"
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-black/10 dark:border-white/10 mt-auto">
          <span className="text-[11px] text-[#6B5270] italic">
            * Original line remains unchanged until you confirm replacement.
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#4A334F] hover:bg-black/5 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              disabled={isLoading || !selectedReplacement}
              className="btn-primary px-5 py-2 rounded-xl text-xs font-semibold disabled:opacity-50"
            >
              Replace Line in Poem
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
