import React, { useState } from 'react';
import { BookOpen, Sparkles, Heart, Eye, Globe, ChevronDown, ChevronUp, Layers, Compass } from 'lucide-react';

export default function PoemExplanation({ poem }) {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('meaning');

  if (!poem) return null;

  const exp = poem.explanation || {};
  const isNonEnglish = poem.language && poem.language.toLowerCase() !== 'english';
  const hasTranslation = !!poem.translation;

  const tabs = [
    { id: 'meaning', label: 'Meaning', icon: Sparkles },
    ...(isNonEnglish || hasTranslation ? [{ id: 'translation', label: 'Translation', icon: Globe }] : []),
    { id: 'imagery', label: 'Imagery', icon: Eye },
    { id: 'metaphors', label: 'Metaphors', icon: Layers },
    { id: 'emotion', label: 'Emotion', icon: Heart },
    ...(poem.vocabulary && poem.vocabulary.length > 0 ? [{ id: 'vocabulary', label: 'Vocabulary', icon: BookOpen }] : []),
  ];

  return (
    <div className="hero-glass-surface mt-8 rounded-3xl border border-[#D9B8CB]/35 shadow-lg p-6 sm:p-8 backdrop-blur-xl">
      {/* Header with Collapsible Toggle */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between cursor-pointer group select-none pb-4 border-b border-[#D9B8CB]/25"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#633367] to-[#B06086] text-white flex items-center justify-center shadow-xs">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2B1630] dark:text-[#FDFBF7]">
              Understand This Poem
            </h3>
            <p className="text-xs font-medium text-[#4F3354] dark:text-[#E2CFE6]">
              Deconstruct the cadence, metaphors, emotions, and imagery
            </p>
          </div>
        </div>
        <button
          className="p-2 rounded-full text-[#2B1630] dark:text-[#EBD8EE] hover:bg-[#542F5C]/10 transition-colors"
          aria-label={isOpen ? 'Collapse section' : 'Expand section'}
        >
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </button>
      </div>

      {isOpen && (
        <div className="mt-6 animate-fadeIn">
          {/* Tab Navigation */}
          <div className="flex flex-wrap items-center gap-2 pb-4 border-b border-[#D9B8CB]/25">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'btn-primary shadow-xs'
                      : 'bg-white/75 dark:bg-white/10 text-[#2B1630] dark:text-[#F3EBF5] hover:bg-[#542F5C]/10 border border-[#D9B8CB]/35'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Tab Content Panels */}
          <div className="mt-6">
            {/* TAB: MEANING */}
            {activeTab === 'meaning' && (
              <div className="space-y-5">
                {exp.simpleMeaning && (
                  <div className="p-5 rounded-2xl bg-[#FFF9F5]/80 dark:bg-black/25 border border-[#D9B8CB]/25">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#C282BA] flex items-center gap-1.5 mb-2">
                      <Sparkles className="w-4 h-4" /> Core Meaning
                    </h4>
                    <p className="text-sm font-sans text-[#2B1630] dark:text-[#FDFBF7] leading-relaxed">
                      {exp.simpleMeaning}
                    </p>
                  </div>
                )}

                {exp.themeInterpretation && (
                  <div className="p-5 rounded-2xl bg-[#FFF9F5]/70 dark:bg-white/5 border border-[#D9B8CB]/25">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#C282BA] flex items-center gap-1.5 mb-2">
                      <Compass className="w-4 h-4" /> Thematic Interpretation
                    </h4>
                    <p className="text-sm text-[#3A2440] dark:text-[#F3EBF5] leading-relaxed">
                      {exp.themeInterpretation.startsWith('This poem')
                        ? exp.themeInterpretation
                        : `This poem can be interpreted as ${exp.themeInterpretation}`}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: TRANSLATION */}
            {activeTab === 'translation' && (
              <div className="space-y-5">
                {isNonEnglish && (
                  <div className="p-5 rounded-2xl bg-[#FFF9F5]/80 dark:bg-black/25 border border-[#D9B8CB]/30">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#C282BA]">
                      <Globe className="w-4 h-4" />
                      <span>Original Poem ({poem.language})</span>
                    </div>
                    <p className="font-serif text-base text-[#2B1630] dark:text-[#FDFBF7] whitespace-pre-line leading-relaxed">
                      {poem.content}
                    </p>
                  </div>
                )}

                {hasTranslation && (
                  <div className="p-5 rounded-2xl bg-[#FFF9F5]/70 dark:bg-white/5 border border-[#D9B8CB]/30">
                    <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#C282BA]">
                      <Globe className="w-4 h-4" />
                      <span>English Poetic Translation</span>
                    </div>
                    <p className="font-serif text-base text-[#2B1630] dark:text-[#FDFBF7] whitespace-pre-line leading-relaxed italic">
                      {poem.translation}
                    </p>
                  </div>
                )}

                <div className="p-4 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/40 text-xs text-[#422915] dark:text-amber-200 leading-relaxed">
                  <strong>Cultural Nuance:</strong> Poetic translations endeavor to preserve cadence, emotional resonance, and metaphorical subtext rather than strictly literal word-for-word substitutions.
                </div>
              </div>
            )}

            {/* TAB: IMAGERY */}
            {activeTab === 'imagery' && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-[#FFF9F5]/80 dark:bg-black/25 border border-[#D9B8CB]/25">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#C282BA] flex items-center gap-1.5 mb-2">
                    <Eye className="w-4 h-4" /> Important Visual & Sensory Imagery
                  </h4>
                  <p className="text-sm text-[#3A2440] dark:text-[#F3EBF5] leading-relaxed">
                    {exp.imagery || 'Rich sensory impressions evoking tactile quietude, light, and natural textures across the verse.'}
                  </p>
                </div>
              </div>
            )}

            {/* TAB: METAPHORS */}
            {activeTab === 'metaphors' && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-[#FFF9F5]/80 dark:bg-black/25 border border-[#D9B8CB]/25">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#C282BA] flex items-center gap-1.5 mb-2">
                    <Layers className="w-4 h-4" /> Metaphors & Symbolic Motifs
                  </h4>
                  <p className="text-sm text-[#3A2440] dark:text-[#F3EBF5] leading-relaxed">
                    {exp.metaphors || 'Subtle layers where outward physical landscapes mirror interior emotional states.'}
                    {exp.symbols ? ` Key symbols: ${exp.symbols}` : ''}
                  </p>
                </div>
              </div>
            )}

            {/* TAB: EMOTION */}
            {activeTab === 'emotion' && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-[#FFF9F5]/80 dark:bg-black/25 border border-[#D9B8CB]/25">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#C282BA] flex items-center gap-1.5 mb-2">
                    <Heart className="w-4 h-4" /> Emotional Resonance & Tone
                  </h4>
                  <p className="text-sm text-[#3A2440] dark:text-[#F3EBF5] leading-relaxed">
                    {exp.emotionalInterpretation || 'A contemplative vibration bridging vulnerability, memory, and emotional stillness.'}
                  </p>
                </div>
              </div>
            )}

            {/* TAB: VOCABULARY */}
            {activeTab === 'vocabulary' && poem.vocabulary && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {poem.vocabulary.map((v, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl bg-white/75 dark:bg-white/10 border border-[#D9B8CB]/30 shadow-xs"
                  >
                    <span className="font-serif font-bold text-base text-[#2B1630] dark:text-[#FDFBF7]">
                      {v.word}
                    </span>
                    <p className="text-xs text-[#4F3354] dark:text-[#E2CFE6] mt-1 leading-relaxed">
                      {v.meaning}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <p className="text-[11px] text-[#725278] dark:text-[#C282BA] italic text-center pt-6 border-t border-[#D9B8CB]/25 mt-6">
            * Note: Poetry invites multiple truths. The interpretations above are contemplative doorways, not rigid definitions.
          </p>
        </div>
      )}
    </div>
  );
}
