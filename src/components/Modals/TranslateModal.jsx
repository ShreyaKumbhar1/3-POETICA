import React, { useState } from 'react';
import { X, Globe, Copy, Check, Sparkles, ArrowLeft } from 'lucide-react';
import { WORLD_LANGUAGES } from '../../data/languages';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function TranslateModal({ isOpen, onClose, poem }) {
  const toast = useToast();
  const [selectedLang, setSelectedLang] = useState('French');
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [translationResult, setTranslationResult] = useState(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen || !poem) return null;

  const filteredLanguages = WORLD_LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.nativeName.toLowerCase().includes(search.toLowerCase())
  );

  const handleTranslate = async () => {
    setIsLoading(true);
    try {
      const res = await api.translatePoem(poem, selectedLang);
      setTranslationResult(res);
      toast.success(`Translated into ${selectedLang}`);
    } catch (err) {
      toast.error('Poetic translation failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyTranslated = () => {
    if (!translationResult) return;
    navigator.clipboard.writeText(`${translationResult.translatedTitle}\n\n${translationResult.translatedContent}`);
    setCopied(true);
    toast.success('Translated poem copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-3xl p-6 sm:p-8 rounded-3xl bg-[#FEFCF9] dark:bg-[#1E1428] shadow-2xl border border-[#B491AF]/40 max-h-[90vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#3A2440] dark:text-[#EBD8EE] hover:bg-[#542F5C]/10 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-11 h-11 rounded-2xl bg-[#542F5C] text-white flex items-center justify-center shadow-sm">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#231527] dark:text-[#FDFBF7]">
              Poetic Translation Studio
            </h3>
            <p className="text-xs font-medium text-[#4D3652] dark:text-[#E2CFE6]">
              Preserves emotional cadence, metaphors, and cultural rhythm across world languages
            </p>
          </div>
        </div>

        {!translationResult ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            {/* Target Language Selection */}
            <div className="mb-3">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-2">
                Translate verse from <span className="underline">{poem.language || 'Original'}</span> to:
              </label>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search 60+ world languages (e.g. Japanese, Spanish, Hindi, French)..."
                className="w-full px-4 py-2.5 rounded-xl text-sm bg-white dark:bg-[#2A1D36] text-[#231527] dark:text-[#FDFBF7] border border-[#B491AF]/40 focus:border-[#542F5C] focus:ring-2 focus:ring-[#542F5C]/20 placeholder-[#6D5273] dark:placeholder-[#B491AF] outline-none"
              />
            </div>

            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2.5 p-1 max-h-64 my-2">
              {filteredLanguages.map(lang => {
                const isSel = selectedLang === lang.name;
                return (
                  <button
                    key={lang.code}
                    onClick={() => setSelectedLang(lang.name)}
                    className={`text-left p-3 rounded-xl border text-xs transition-all flex flex-col justify-between ${
                      isSel
                        ? 'border-[#542F5C] bg-[#542F5C] text-white shadow-md font-semibold'
                        : 'border-[#B491AF]/30 bg-white/80 dark:bg-white/5 hover:bg-[#542F5C]/10 text-[#231527] dark:text-[#FDFBF7]'
                    }`}
                  >
                    <span className="font-bold text-xs">{lang.name}</span>
                    <span className={`text-[10px] mt-0.5 ${isSel ? 'text-white/80' : 'text-[#4D3652] dark:text-[#C282BA]'}`}>
                      {lang.nativeName}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-4 pt-4 border-t border-[#B491AF]/20 flex items-center justify-end gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#4D3652] dark:text-[#E2CFE6] hover:bg-[#542F5C]/10"
              >
                Cancel
              </button>
              <button
                onClick={handleTranslate}
                disabled={isLoading}
                className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold disabled:opacity-50"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>{isLoading ? 'Translating Verse...' : `Translate into ${selectedLang}`}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-y-auto pr-1 space-y-4">
            {/* Two-Column Side-by-Side View on Desktop, Stacked on Mobile */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ORIGINAL */}
              <div className="p-5 rounded-2xl bg-white/90 dark:bg-[#2A1D36]/80 border border-[#B491AF]/30 shadow-sm flex flex-col">
                <div className="flex items-center justify-between border-b border-[#B491AF]/20 pb-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#C282BA]">
                    Original ({poem.language || 'Original'})
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#542F5C]/10 text-[#542F5C] dark:text-[#EBD8EE] font-medium">
                    Source
                  </span>
                </div>
                <h4 className="font-serif font-bold text-lg mb-3 text-[#231527] dark:text-[#FDFBF7]">
                  {poem.title}
                </h4>
                <div className="font-serif text-sm text-[#231527] dark:text-[#FDFBF7] whitespace-pre-line leading-relaxed flex-1">
                  {poem.content}
                </div>
              </div>

              {/* TRANSLATION */}
              <div className="p-5 rounded-2xl bg-[#FAF7F2] dark:bg-[#191022] border-2 border-[#542F5C]/40 shadow-sm flex flex-col">
                <div className="flex items-center justify-between border-b border-[#B491AF]/20 pb-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#C282BA]">
                    Poetic Translation ({selectedLang})
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-medium">
                    Translated
                  </span>
                </div>
                <h4 className="font-serif font-bold text-lg mb-3 text-[#231527] dark:text-[#FDFBF7]">
                  {translationResult.translatedTitle}
                </h4>
                <div className="font-serif text-sm text-[#231527] dark:text-[#FDFBF7] whitespace-pre-line leading-relaxed italic flex-1">
                  {translationResult.translatedContent}
                </div>
              </div>
            </div>

            {translationResult.poeticNotes && (
              <div className="p-3.5 rounded-xl bg-purple-50/80 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800/40 text-xs text-[#3A2440] dark:text-purple-200 italic leading-relaxed">
                <strong>Translator's Note:</strong> {translationResult.poeticNotes}
              </div>
            )}

            <div className="flex items-center justify-between pt-4 border-t border-[#B491AF]/20">
              <button
                onClick={() => setTranslationResult(null)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-[#542F5C] dark:text-[#C282BA] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Choose Another Language
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={copyTranslated}
                  className="btn-secondary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy Translation'}</span>
                </button>
                <button
                  onClick={onClose}
                  className="btn-primary px-5 py-2 rounded-xl text-xs font-semibold"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
