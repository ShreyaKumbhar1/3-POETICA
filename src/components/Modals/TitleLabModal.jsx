import React, { useState, useEffect } from 'react';
import { X, Sparkles, Wand2, Check, RefreshCw } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function TitleLabModal({ isOpen, onClose, poem, onApplyTitle }) {
  const toast = useToast();
  const [titles, setTitles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState('');

  useEffect(() => {
    if (isOpen && poem) {
      loadTitles();
    }
  }, [isOpen, poem]);

  const loadTitles = async () => {
    setIsLoading(true);
    try {
      const res = await api.generateTitles(poem);
      setTitles(res);
      setSelectedTitle(poem.title || '');
    } catch (e) {
      toast.error('Failed to summon title variations');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen || !poem) return null;

  const handleConfirm = () => {
    if (!selectedTitle || selectedTitle === poem.title) {
      onClose();
      return;
    }
    if (window.confirm(`Replace current title "${poem.title}" with "${selectedTitle}"?`)) {
      onApplyTitle(selectedTitle);
      toast.success('Title updated');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-[#FFF9F5] dark:bg-[#1E1328] shadow-2xl border border-[#D9C4D6] dark:border-[#3D2847]">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#4D3652] dark:text-[#EADEEF] hover:bg-black/5 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#542F5C] to-[#74417A] flex items-center justify-center text-white shadow-sm">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#2B1630] dark:text-[#FFFDF9]">
              Poem Title Lab
            </h3>
            <p className="text-xs text-[#4D3652] dark:text-[#EADEEF]">
              Explore 5 distinct lyrical perspectives for your verse
            </p>
          </div>
        </div>

        <div className="my-4 p-3.5 rounded-2xl bg-[#F8F0F6] dark:bg-purple-950/40 border border-[#D9C4D6] dark:border-[#3D2847] text-xs">
          <span className="text-[11px] uppercase tracking-wider font-bold text-[#542F5C] dark:text-[#E0C0ED] block mb-0.5">Current Title</span>
          <span className="font-serif text-base font-semibold text-[#2B1630] dark:text-[#FFFDF9]">{poem.title}</span>
        </div>

        {isLoading ? (
          <div className="py-12 text-center text-xs text-[#4D3652] dark:text-[#EADEEF] flex flex-col items-center gap-2">
            <RefreshCw className="w-5 h-5 animate-spin text-[#542F5C] dark:text-[#E0C0ED]" />
            <span className="font-medium">Consulting poetic muses...</span>
          </div>
        ) : (
          <div className="space-y-2 my-4">
            {titles.map((t, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedTitle(t.title)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                  selectedTitle === t.title
                    ? 'border-[#542F5C] bg-[#F2EBF5] dark:bg-purple-900/40 text-[#2B1630] dark:text-[#FFFDF9] font-semibold shadow-xs ring-1 ring-[#542F5C]'
                    : 'border-[#E0D0DE] dark:border-white/10 hover:bg-[#F8F0F6] dark:hover:bg-white/10 text-[#35233F] dark:text-[#EADEEF]'
                }`}
              >
                <div>
                  <span className="text-[10px] uppercase tracking-wider font-bold text-[#542F5C] dark:text-[#E0C0ED] block mb-0.5">
                    {t.category}
                  </span>
                  <span className="font-serif text-sm italic">{t.title}</span>
                </div>
                {selectedTitle === t.title && (
                  <Check className="w-4 h-4 text-[#542F5C] dark:text-[#E0C0ED] shrink-0" />
                )}
              </button>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-[#E5D5E3] dark:border-white/10">
          <button
            onClick={loadTitles}
            disabled={isLoading}
            className="flex items-center gap-1.5 text-xs text-[#542F5C] dark:text-[#E0C0ED] hover:underline font-semibold"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Regenerate Titles</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#4D3652] dark:text-[#EADEEF] hover:bg-black/5 rounded-xl"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirm}
              disabled={isLoading || !selectedTitle || selectedTitle === poem.title}
              className="btn-primary px-5 py-2 rounded-xl text-xs font-semibold disabled:opacity-50"
            >
              Apply Title
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
