import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Sparkles, Feather, Wand2, RefreshCw, Bookmark, Copy,
  Printer, Globe, Volume2, VolumeX, Edit3, Sliders, Check,
  BarChart2, Type, Compass, Heart, Flame, Shield, Sun, CloudRain
} from 'lucide-react';
import Layout from '../components/Layout';
import PoemExplanation from '../components/PoemExplanation';
import RemixModal from '../components/Modals/RemixModal';
import TranslateModal from '../components/Modals/TranslateModal';
import PrintablePoemModal from '../components/Modals/PrintablePoemModal';
import TitleLabModal from '../components/Modals/TitleLabModal';
import LineLabModal from '../components/Modals/LineLabModal';
import { useAtmosphere } from '../context/AtmosphereContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { poeticaSpeech } from '../utils/speech';
import { WORLD_LANGUAGES } from '../data/languages';
import {
  THEMES, MOODS, EMOTIONS, POETRY_STYLES, LENGTHS,
  TONES, PERSPECTIVES, ROTATING_LOADING_MESSAGES
} from '../data/options';

export default function CreateStudio() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { setAutoAtmosphere, triggerBreeze } = useAtmosphere();
  const { user, token } = useAuth();
  const toast = useToast();

  // Studio Mode: 'simple' | 'advanced'
  const [mode, setMode] = useState('simple');

  // Input states
  const [theme, setTheme] = useState(searchParams.get('theme') || 'Love');
  const [customTheme, setCustomTheme] = useState(searchParams.get('seed') || '');
  const [mood, setMood] = useState(searchParams.get('mood') || 'Romantic');
  const [emotion, setEmotion] = useState(searchParams.get('emotion') || 'Wonder');
  const [style, setStyle] = useState('Free Verse');
  const [length, setLength] = useState('Medium');
  const [language, setLanguage] = useState('English');
  const [customLanguage, setCustomLanguage] = useState('');
  const [tone, setTone] = useState('Lyrical');
  const [perspective, setPerspective] = useState('First person');
  const [rhyme, setRhyme] = useState('Free');
  const [customInstructions, setCustomInstructions] = useState('');

  // Language search
  const [langSearch, setLangSearch] = useState('');
  const [langPickerOpen, setLangPickerOpen] = useState(false);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);
  const [generatedPoem, setGeneratedPoem] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);
  const [copied, setCopied] = useState(false);

  // Modals
  const [isRemixOpen, setIsRemixOpen] = useState(false);
  const [isTranslateOpen, setIsTranslateOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isTitleLabOpen, setIsTitleLabOpen] = useState(false);
  const [isLineLabOpen, setIsLineLabOpen] = useState(false);
  const [surpriseBadge, setSurpriseBadge] = useState(null);

  // Rotating loading messages
  useEffect(() => {
    let interval;
    if (isGenerating) {
      interval = setInterval(() => {
        setLoadingMessageIndex(prev => (prev + 1) % ROTATING_LOADING_MESSAGES.length);
      }, 1800);
    }
    return () => clearInterval(interval);
  }, [isGenerating]);

  // Speech callback
  useEffect(() => {
    poeticaSpeech.onStateChange = (playing) => setIsPlayingSpeech(playing);
    return () => poeticaSpeech.stop();
  }, []);

  // Handle URL surprise trigger or seed
  useEffect(() => {
    if (searchParams.get('surprise') === 'true') {
      handleSurpriseMe();
    }
    if (searchParams.get('seed')) {
      setCustomTheme(searchParams.get('seed'));
    }
    if (searchParams.get('emotion')) {
      setEmotion(searchParams.get('emotion'));
    }
  }, [searchParams]);

  // Filter languages
  const filteredLanguages = WORLD_LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(langSearch.toLowerCase()) ||
    l.nativeName.toLowerCase().includes(langSearch.toLowerCase())
  );

  const activeLanguageObj = WORLD_LANGUAGES.find(l => l.name === language) || {
    name: language,
    speechLang: 'en-US'
  };

  const handleGenerate = async () => {
    const finalTheme = customTheme.trim() ? customTheme.trim() : theme;
    const finalLanguage = customLanguage.trim() ? customLanguage.trim() : language;

    setIsGenerating(true);
    poeticaSpeech.stop();

    try {
      const payload = {
        theme: finalTheme,
        mood,
        emotion,
        style,
        length,
        language: finalLanguage,
        tone,
        perspective,
        rhyme,
        customInstructions
      };

      const poem = await api.generatePoem(payload);
      setGeneratedPoem(poem);
      setIsSaved(false);
      setAutoAtmosphere(poem.atmosphere);
      triggerBreeze();
      
      // Save recent draft in local storage for "Continue Where You Left Off"
      try {
        localStorage.setItem('poetica_recent_draft', JSON.stringify({
          title: poem.title,
          content: poem.content,
          theme: finalTheme,
          mood: poem.mood,
          date: new Date().toISOString()
        }));
      } catch {}

      toast.success('Your poem has been woven');
    } catch (err) {
      console.error(err);
      toast.error('Poetic generation failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSurpriseMe = () => {
    const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
    const randomMood = MOODS[Math.floor(Math.random() * MOODS.length)];
    const randomEmotion = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
    const randomStyle = POETRY_STYLES[Math.floor(Math.random() * POETRY_STYLES.length)].id;
    const popularLangs = WORLD_LANGUAGES.filter(l => l.popular).map(l => l.name);
    const randomLang = popularLangs[Math.floor(Math.random() * popularLangs.length)];

    setTheme(randomTheme);
    setCustomTheme('');
    setMood(randomMood);
    setEmotion(randomEmotion);
    setStyle(randomStyle);
    setLanguage(randomLang);
    setCustomLanguage('');

    setSurpriseBadge(`Inspiration: ${randomTheme} • ${randomMood} • ${randomLang}`);
    triggerBreeze();
    setTimeout(() => handleGenerate(), 100);
  };

  const handleSaveToLibrary = async () => {
    if (!generatedPoem) return;
    if (!token) {
      toast.info('Sign in to permanently keep this poem in your personal library.');
      return;
    }

    try {
      const saved = await api.savePoem(generatedPoem, token);
      setIsSaved(true);
      try {
        localStorage.setItem('poetica_recent_draft', JSON.stringify({
          id: saved.id,
          title: saved.title,
          content: saved.content,
          date: new Date().toISOString()
        }));
      } catch {}
      toast.success(`Saved "${saved.title}" to your library`);
    } catch (e) {
      toast.error('Failed to save poem');
    }
  };

  const handleRemixApply = async (remixType) => {
    if (!generatedPoem) return;
    setIsGenerating(true);
    try {
      const remixed = await api.remixPoem(generatedPoem, remixType);
      // Track version history
      const prevVersions = generatedPoem.versions || [];
      remixed.versions = [
        ...prevVersions,
        {
          title: generatedPoem.title,
          content: generatedPoem.content,
          reason: `Remix: ${remixType}`,
          timestamp: new Date().toISOString()
        }
      ];
      setGeneratedPoem(remixed);
      setAutoAtmosphere(remixed.atmosphere);
      triggerBreeze();
      toast.success('Poem remixed successfully');
    } catch (e) {
      toast.error('Remix failed');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleApplyTitle = (newTitle) => {
    if (!generatedPoem) return;
    const prevVersions = generatedPoem.versions || [];
    setGeneratedPoem({
      ...generatedPoem,
      title: newTitle,
      versions: [
        ...prevVersions,
        {
          title: generatedPoem.title,
          content: generatedPoem.content,
          reason: 'Title Lab revision',
          timestamp: new Date().toISOString()
        }
      ]
    });
    setIsTitleLabOpen(false);
  };

  const handleApplyLine = (oldLine, newLine) => {
    if (!generatedPoem) return;
    const updatedContent = generatedPoem.content.replace(oldLine, newLine);
    const prevVersions = generatedPoem.versions || [];
    setGeneratedPoem({
      ...generatedPoem,
      content: updatedContent,
      versions: [
        ...prevVersions,
        {
          title: generatedPoem.title,
          content: generatedPoem.content,
          reason: 'Line Lab revision',
          timestamp: new Date().toISOString()
        }
      ]
    });
    setIsLineLabOpen(false);
  };

  const handleCopy = () => {
    if (!generatedPoem) return;
    navigator.clipboard.writeText(`${generatedPoem.title}\n\n${generatedPoem.content}\n\n— ${user?.displayName || 'Poetica'}`);
    setCopied(true);
    toast.success('Poem copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTextToSpeech = () => {
    if (!generatedPoem) return;
    if (isPlayingSpeech) {
      poeticaSpeech.stop();
    } else {
      const success = poeticaSpeech.speak(
        `${generatedPoem.title}. ${generatedPoem.content}`,
        activeLanguageObj.speechLang || 'en-US'
      );
      if (!success) {
        toast.info('Speech synthesis voice not available for this language.');
      }
    }
  };

  // Helper to compute stats
  const poemStats = generatedPoem ? (generatedPoem.stats || {
    words: generatedPoem.content ? generatedPoem.content.trim().split(/\s+/).filter(Boolean).length : 0,
    lines: generatedPoem.content ? generatedPoem.content.split('\n').filter(l => l.trim()).length : 0,
    characters: generatedPoem.content ? generatedPoem.content.length : 0,
    stanzas: generatedPoem.content ? generatedPoem.content.split(/\n\s*\n/).filter(Boolean).length : 1,
    readingTime: `${Math.max(1, Math.ceil((generatedPoem.content ? generatedPoem.content.trim().split(/\s+/).length : 0) / 40))} min`,
    emotionalIntensity: generatedPoem.emotion || 'Resonant'
  }) : null;

  // Poem DNA
  const poemDNA = generatedPoem ? (generatedPoem.dna || {
    emotion: generatedPoem.emotion || emotion,
    mood: generatedPoem.mood || mood,
    theme: generatedPoem.theme || theme,
    energy: 'Gentle Cadence',
    tone: generatedPoem.tone || tone,
    atmosphere: generatedPoem.atmosphere || 'peaceful'
  }) : null;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Studio Title Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#231527] dark:text-[#FDFBF7] flex items-center gap-3">
              Poetry Studio
              <span className="text-xs font-sans uppercase tracking-widest px-3 py-1 rounded-full bg-[#542F5C]/10 text-[#542F5C] dark:bg-[#EBD8EE]/15 dark:text-[#EBD8EE] font-bold">
                AI Powered
              </span>
            </h1>
            <p className="text-xs sm:text-sm font-medium text-[#4D3652] dark:text-[#E2CFE6]">
              Shape themes, rhythms, and world languages into living verse.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSurpriseMe}
              className="btn-secondary flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold shadow-sm hover:scale-105 transition-all"
            >
              <Wand2 className="w-3.5 h-3.5 text-[#542F5C] dark:text-[#C282BA]" />
              <span>Surprise Me</span>
            </button>

            {/* Mode Switcher */}
            <div className="flex items-center p-1 rounded-full bg-[#FFF9F5]/80 dark:bg-[#20172B]/80 border border-[#D9B8CB]/35 text-xs shadow-sm backdrop-blur-md">
              <button
                onClick={() => setMode('simple')}
                className={`px-3 py-1 rounded-full transition-all ${
                  mode === 'simple'
                    ? 'btn-primary shadow-sm'
                    : 'text-[#2B1630] dark:text-[#F3EBF5] hover:text-[#542F5C] font-semibold'
                }`}
              >
                Simple
              </button>
              <button
                onClick={() => setMode('advanced')}
                className={`px-3 py-1 rounded-full transition-all flex items-center gap-1 ${
                  mode === 'advanced'
                    ? 'btn-primary shadow-sm'
                    : 'text-[#2B1630] dark:text-[#F3EBF5] hover:text-[#542F5C] font-semibold'
                }`}
              >
                <Sliders className="w-3 h-3" />
                <span>Advanced</span>
              </button>
            </div>
          </div>
        </div>

        {/* Surprise Me Banner */}
        {surpriseBadge && (
          <div className="mb-6 p-3.5 rounded-2xl bg-[#FFF9F5]/85 dark:bg-[#20172B]/85 border border-[#D9B8CB]/40 text-xs text-[#2B1630] dark:text-[#FDFBF7] flex items-center justify-between shadow-sm backdrop-blur-md">
            <span className="font-bold flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#854479] dark:text-[#C282BA]" />
              {surpriseBadge}
            </span>
            <button
              onClick={() => setSurpriseBadge(null)}
              className="text-[#4F3354] dark:text-[#E2CFE6] hover:underline font-semibold text-xs"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Studio Grid: Controls on Left, Live Preview on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="hero-glass-surface p-6 sm:p-7 border border-[#D9B8CB]/35 shadow-lg space-y-5">
              {/* Language Selector */}
              <div className="relative">
                <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-2 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5" /> Language of Verse
                </label>
                <button
                  type="button"
                  onClick={() => setLangPickerOpen(!langPickerOpen)}
                  className="w-full flex items-center justify-between px-4 py-2.5 rounded-2xl bg-white/80 dark:bg-[#2A1D36]/80 border border-[#D9B8CB]/40 text-xs text-left shadow-xs backdrop-blur-sm"
                >
                  <span className="font-bold text-[#2B1630] dark:text-[#FDFBF7]">
                    {customLanguage ? `Custom: ${customLanguage}` : `${language} (${activeLanguageObj.nativeName || language})`}
                  </span>
                  <span className="text-[10px] font-bold text-[#542F5C] dark:text-[#EBD8EE] bg-[#542F5C]/10 px-2 py-0.5 rounded-full">
                    Change (60+)
                  </span>
                </button>

                {/* Searchable Language Popover */}
                {langPickerOpen && (
                  <div className="absolute top-16 left-0 right-0 z-30 p-3 rounded-2xl bg-[#FFF9F5]/98 dark:bg-[#20172B]/98 shadow-2xl border border-[#D9B8CB]/40 backdrop-blur-xl animate-fadeIn">
                    <input
                      type="text"
                      value={langSearch}
                      onChange={(e) => setLangSearch(e.target.value)}
                      placeholder="Search languages..."
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white/90 dark:bg-[#2A1D36] text-[#2B1630] dark:text-[#FDFBF7] border border-[#D9B8CB]/40 mb-2 outline-none"
                    />
                    <div className="max-h-52 overflow-y-auto grid grid-cols-2 gap-1.5 pr-1">
                      {filteredLanguages.map(l => (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => {
                            setLanguage(l.name);
                            setCustomLanguage('');
                            setLangPickerOpen(false);
                          }}
                          className={`text-left p-2 rounded-xl text-xs transition-colors ${
                            language === l.name && !customLanguage
                              ? 'btn-primary shadow-xs'
                              : 'hover:bg-[#542F5C]/10 text-[#2B1630] dark:text-[#FDFBF7]'
                          }`}
                        >
                          <div className="truncate font-bold">{l.name}</div>
                          <div className="text-[9px] opacity-80 truncate">{l.nativeName}</div>
                        </button>
                      ))}
                    </div>

                    {/* Custom Language Input Option */}
                    <div className="mt-2 pt-2 border-t border-[#D9B8CB]/30">
                      <input
                        type="text"
                        value={customLanguage}
                        onChange={(e) => setCustomLanguage(e.target.value)}
                        placeholder="Or enter custom language..."
                        className="w-full px-3 py-1.5 rounded-xl text-xs bg-white/90 dark:bg-[#2A1D36] text-[#2B1630] dark:text-[#FDFBF7] border border-[#D9B8CB]/40 outline-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Theme Picker */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-2">
                  Theme / Inspiration
                </label>
                <div className="flex flex-wrap gap-1.5 mb-2 max-h-28 overflow-y-auto pr-1">
                  {THEMES.slice(0, 14).map(t => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => {
                        setTheme(t);
                        setCustomTheme('');
                      }}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                        theme === t && !customTheme
                          ? 'btn-primary shadow-xs'
                          : 'bg-white/75 dark:bg-white/10 border border-[#D9B8CB]/35 text-[#2B1630] dark:text-[#FDFBF7] hover:bg-[#542F5C]/10'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
                <input
                  type="text"
                  value={customTheme}
                  onChange={(e) => setCustomTheme(e.target.value)}
                  placeholder="Or type your own theme (e.g. The quiet rain on an old roof)..."
                  className="w-full px-4 py-2 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36]/80 text-[#2B1630] dark:text-[#FDFBF7] border border-[#D9B8CB]/40 placeholder-[#725278] dark:placeholder-[#B491AF] outline-none"
                />
              </div>

              {/* Mood & Emotion */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1.5">
                    Mood
                  </label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36]/80 text-[#2B1630] dark:text-[#FDFBF7] border border-[#D9B8CB]/40 font-semibold outline-none"
                  >
                    {MOODS.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1.5">
                    Emotion
                  </label>
                  <select
                    value={emotion}
                    onChange={(e) => setEmotion(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36]/80 text-[#2B1630] dark:text-[#FDFBF7] border border-[#D9B8CB]/40 font-semibold outline-none"
                  >
                    {EMOTIONS.map(em => (
                      <option key={em} value={em}>{em}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Style & Length */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1.5">
                    Poetry Style
                  </label>
                  <select
                    value={style}
                    onChange={(e) => setStyle(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36]/80 text-[#2B1630] dark:text-[#FDFBF7] border border-[#D9B8CB]/40 font-semibold outline-none"
                  >
                    {POETRY_STYLES.map(s => (
                      <option key={s.id} value={s.id}>{s.id}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1.5">
                    Length
                  </label>
                  <select
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    className="w-full p-2.5 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36]/80 text-[#2B1630] dark:text-[#FDFBF7] border border-[#D9B8CB]/40 font-semibold outline-none"
                  >
                    {LENGTHS.map(l => (
                      <option key={l.id} value={l.id}>{l.id} ({l.lines})</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Advanced Mode Additional Fields */}
              {mode === 'advanced' && (
                <div className="space-y-4 pt-4 border-t border-[#D9B8CB]/25 animate-fadeIn">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1">
                        Tone
                      </label>
                      <select
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                        className="w-full p-2 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36]/80 text-[#2B1630] dark:text-[#FDFBF7] border border-[#D9B8CB]/40 font-semibold outline-none"
                      >
                        {TONES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1">
                        Perspective
                      </label>
                      <select
                        value={perspective}
                        onChange={(e) => setPerspective(e.target.value)}
                        className="w-full p-2 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36]/80 text-[#2B1630] dark:text-[#FDFBF7] border border-[#D9B8CB]/40 font-semibold outline-none"
                      >
                        {PERSPECTIVES.map(p => <option key={p} value={p}>{p}</option>)}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1">
                      Rhyme Preference
                    </label>
                    <select
                      value={rhyme}
                      onChange={(e) => setRhyme(e.target.value)}
                      className="w-full p-2 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36]/80 text-[#2B1630] dark:text-[#FDFBF7] border border-[#D9B8CB]/40 font-semibold outline-none"
                    >
                      <option value="Free">Free cadence (unrhymed)</option>
                      <option value="AABB">Couplets (AABB)</option>
                      <option value="ABAB">Alternating (ABAB)</option>
                      <option value="Classic">Traditional lyrical meter</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1">
                      Custom Creative Instructions
                    </label>
                    <textarea
                      rows={2}
                      value={customInstructions}
                      onChange={(e) => setCustomInstructions(e.target.value)}
                      placeholder="e.g. Include the scent of petrichor and make it feel like an unspoken letter..."
                      className="w-full p-2.5 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36]/80 text-[#2B1630] dark:text-[#FDFBF7] border border-[#D9B8CB]/40 resize-none outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <button
                type="button"
                onClick={handleGenerate}
                disabled={isGenerating}
                className="btn-primary w-full py-3.5 rounded-2xl text-sm font-bold shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                {isGenerating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Weaving Poem...</span>
                  </>
                ) : (
                  <>
                    <Feather className="w-4 h-4" />
                    <span>Generate Poem</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Poem Display & Action Column */}
          <div className="lg:col-span-7">
            {isGenerating ? (
              /* Atmospheric Loading Screen */
              <div className="hero-glass-surface p-12 text-center flex flex-col items-center justify-center min-h-[420px] backdrop-blur-xl border border-[#D9B8CB]/40 shadow-xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#633367] to-[#B06086] text-white flex items-center justify-center mb-6 animate-pulse shadow-md">
                  <Feather className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl font-bold text-[#2B1630] dark:text-[#FDFBF7] mb-2">
                  {ROTATING_LOADING_MESSAGES[loadingMessageIndex]}
                </h3>
                <p className="text-xs font-medium text-[#4F3354] dark:text-[#E2CFE6] max-w-sm">
                  Weaving your chosen mood ({mood}) and theme into rhythmic prose in {customLanguage || language}...
                </p>
              </div>
            ) : generatedPoem ? (
              /* Generated Poem Presentation */
              <div className="space-y-6 animate-fadeIn">
                {/* 1. Poem Atmosphere Banner */}
                <div className="p-4 rounded-2xl bg-[#FFF9F5]/85 dark:bg-[#20172B]/85 border border-[#D9B8CB]/35 backdrop-blur-md flex items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#633367] to-[#B06086] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Sparkles className="w-5 h-5 text-amber-200" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#C282BA]">
                        Your Poem Feels Like...
                      </span>
                      <h4 className="font-serif font-bold text-sm text-[#2B1630] dark:text-[#FDFBF7] capitalize">
                        {generatedPoem.atmosphere || 'Serene'} Atmosphere
                      </h4>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/80 dark:bg-white/10 text-[#542F5C] dark:text-[#EBD8EE] border border-[#D9B8CB]/35">
                    Live Canvas Reactive
                  </span>
                </div>

                {/* 2. Poem Mood DNA Strip */}
                {poemDNA && (
                  <div className="p-3.5 rounded-2xl bg-[#FFF9F5]/85 dark:bg-[#20172B]/85 border border-[#D9B8CB]/35 backdrop-blur-md shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#C282BA] flex items-center gap-1.5">
                        <Flame className="w-3.5 h-3.5 text-amber-500" />
                        Poem Mood DNA
                      </span>
                      <span className="text-[10px] text-[#4F3354] dark:text-[#E2CFE6] font-medium">Emotional Spectrum</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold btn-primary shadow-xs">
                        Emotion: {poemDNA.emotion}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/80 dark:bg-white/10 border border-[#D9B8CB]/35 text-[#2B1630] dark:text-[#FDFBF7]">
                        Mood: {poemDNA.mood}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/80 dark:bg-white/10 border border-[#D9B8CB]/35 text-[#2B1630] dark:text-[#FDFBF7]">
                        Theme: {poemDNA.theme}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/80 dark:bg-white/10 border border-[#D9B8CB]/35 text-[#2B1630] dark:text-[#FDFBF7]">
                        Tone: {poemDNA.tone}
                      </span>
                      <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/80 dark:bg-white/10 border border-[#D9B8CB]/35 text-[#2B1630] dark:text-[#FDFBF7] capitalize">
                        Scene: {poemDNA.atmosphere}
                      </span>
                    </div>
                  </div>
                )}

                {/* 3. Poetic Commands Quick Bar */}
                <div className="p-3.5 rounded-2xl bg-[#FFF9F5]/85 dark:bg-[#20172B]/85 border border-[#D9B8CB]/35 backdrop-blur-md shadow-sm">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#C282BA] block mb-2">
                    Poetic Commands (One-Click Alchemy)
                  </span>
                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => setIsTitleLabOpen(true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#542F5C]/10 dark:bg-[#EBD8EE]/10 text-[#542F5C] dark:text-[#EBD8EE] hover:bg-[#542F5C] hover:text-white transition-all shadow-xs"
                    >
                      <Type className="w-3.5 h-3.5" />
                      <span>Title Lab</span>
                    </button>
                    <button
                      onClick={() => setIsLineLabOpen(true)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-[#542F5C]/10 dark:bg-[#EBD8EE]/10 text-[#542F5C] dark:text-[#EBD8EE] hover:bg-[#542F5C] hover:text-white transition-all shadow-xs"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Line Lab</span>
                    </button>
                    <button
                      onClick={() => handleRemixApply('shorter')}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white/80 dark:bg-white/10 border border-[#D9B8CB]/35 text-[#2B1630] dark:text-[#FDFBF7] hover:bg-[#542F5C]/10"
                    >
                      Make Shorter
                    </button>
                    <button
                      onClick={() => handleRemixApply('deeper')}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white/80 dark:bg-white/10 border border-[#D9B8CB]/35 text-[#2B1630] dark:text-[#FDFBF7] hover:bg-[#542F5C]/10"
                    >
                      Make Deeper
                    </button>
                    <button
                      onClick={() => handleRemixApply('more_romantic')}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white/80 dark:bg-white/10 border border-[#D9B8CB]/35 text-[#2B1630] dark:text-[#FDFBF7] hover:bg-[#542F5C]/10"
                    >
                      More Romantic
                    </button>
                    <button
                      onClick={() => handleRemixApply('happier')}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white/80 dark:bg-white/10 border border-[#D9B8CB]/35 text-[#2B1630] dark:text-[#FDFBF7] hover:bg-[#542F5C]/10"
                    >
                      Make Happier
                    </button>
                    <button
                      onClick={() => handleRemixApply('sadder')}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-white/80 dark:bg-white/10 border border-[#D9B8CB]/35 text-[#2B1630] dark:text-[#FDFBF7] hover:bg-[#542F5C]/10"
                    >
                      Make Sadder
                    </button>
                  </div>
                </div>

                {/* 4. Poem Card */}
                <div className="hero-glass-surface p-8 sm:p-10 border border-[#D9B8CB]/45 shadow-2xl relative backdrop-blur-xl">
                  {/* Top Bar Badges */}
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-[#D9B8CB]/25">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-3 py-1 rounded-full text-xs font-bold btn-primary shadow-xs">
                        {generatedPoem.language}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/80 dark:bg-white/10 border border-[#D9B8CB]/35 text-[#2B1630] dark:text-[#FDFBF7]">
                        {generatedPoem.theme}
                      </span>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/80 dark:bg-white/10 border border-[#D9B8CB]/35 text-[#2B1630] dark:text-[#FDFBF7]">
                        {generatedPoem.style}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#542F5C] dark:text-[#EBD8EE]">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span className="capitalize">{generatedPoem.atmosphere} Atmosphere</span>
                    </div>
                  </div>

                  {/* Poem Title */}
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1630] dark:text-[#FDFBF7] text-center mb-8 leading-tight">
                    {generatedPoem.title}
                  </h2>

                  {/* Poem Verses (with line-by-line reveal animation) */}
                  <div className="poem-text font-serif text-lg sm:text-xl text-[#2B1630] dark:text-[#FDFBF7] leading-loose whitespace-pre-line text-center italic max-w-xl mx-auto my-8">
                    {generatedPoem.content.split('\n').map((line, idx) => (
                      <div
                        key={idx}
                        className="poem-line hover:bg-[#542F5C]/5 px-2 rounded-lg cursor-pointer transition-colors"
                        title="Click to refine this line in Line Lab"
                        onClick={() => {
                          if (line.trim()) {
                            setIsLineLabOpen(true);
                          }
                        }}
                        style={{ animationDelay: `${idx * 0.08}s` }}
                      >
                        {line || <span className="inline-block h-4" />}
                      </div>
                    ))}
                  </div>

                  {/* Author Signature */}
                  <div className="text-center pt-4 pb-2 border-t border-[#D9B8CB]/25">
                    <p className="font-serif italic text-sm font-semibold text-[#4F3354] dark:text-[#E2CFE6]">
                      — {user?.displayName || user?.username || 'Pen of Poetica'}
                    </p>
                  </div>

                  {/* Action Bar */}
                  <div className="pt-6 mt-6 border-t border-[#D9B8CB]/25 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={handleSaveToLibrary}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all shadow-xs ${
                          isSaved
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'btn-secondary'
                        }`}
                      >
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>{isSaved ? 'Saved in Library' : 'Save'}</span>
                      </button>

                      <button
                        onClick={() => navigate('/editor', { state: { poem: generatedPoem } })}
                        className="btn-secondary flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit Studio</span>
                      </button>

                      <button
                        onClick={() => setIsRemixOpen(true)}
                        className="btn-secondary flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold"
                      >
                        <Wand2 className="w-3.5 h-3.5" />
                        <span>Remix</span>
                      </button>

                      <button
                        onClick={() => setIsTranslateOpen(true)}
                        className="btn-secondary flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold"
                      >
                        <Globe className="w-3.5 h-3.5" />
                        <span>Translate</span>
                      </button>

                      <button
                        onClick={handleTextToSpeech}
                        className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
                          isPlayingSpeech
                            ? 'btn-primary'
                            : 'btn-secondary'
                        }`}
                      >
                        {isPlayingSpeech ? <VolumeX className="w-3.5 h-3.5 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
                        <span>{isPlayingSpeech ? 'Stop Voice' : 'Listen'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleCopy}
                        title="Copy to clipboard"
                        className="p-2.5 rounded-xl border border-[#D9B8CB]/35 hover:bg-[#542F5C]/10 text-[#2B1630] dark:text-[#FDFBF7]"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => setIsPrintOpen(true)}
                        title="Print Keepsake"
                        className="p-2.5 rounded-xl border border-[#D9B8CB]/35 hover:bg-[#542F5C]/10 text-[#2B1630] dark:text-[#FDFBF7]"
                      >
                        <Printer className="w-4 h-4" />
                      </button>

                      <button
                        onClick={handleGenerate}
                        title="Regenerate another"
                        className="btn-primary flex items-center gap-1 px-4 py-2 rounded-xl font-bold"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Regenerate</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 5. Poem Statistics Card */}
                {poemStats && (
                  <div className="p-5 rounded-2xl bg-[#FFF9F5]/85 dark:bg-[#20172B]/85 border border-[#D9B8CB]/35 backdrop-blur-md shadow-sm">
                    <div className="flex items-center gap-2 mb-3">
                      <BarChart2 className="w-4 h-4 text-[#542F5C] dark:text-[#C282BA]" />
                      <h4 className="font-serif font-bold text-sm text-[#2B1630] dark:text-[#FDFBF7]">
                        Poem Statistics & Cadence
                      </h4>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
                      <div className="p-2.5 rounded-xl bg-white/70 dark:bg-black/20 border border-[#D9B8CB]/25">
                        <span className="block font-serif font-bold text-base text-[#2B1630] dark:text-[#FDFBF7]">
                          {poemStats.words}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-[#4F3354] dark:text-[#E2CFE6]">Words</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/70 dark:bg-black/20 border border-[#D9B8CB]/25">
                        <span className="block font-serif font-bold text-base text-[#2B1630] dark:text-[#FDFBF7]">
                          {poemStats.lines}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-[#4F3354] dark:text-[#E2CFE6]">Lines</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/70 dark:bg-black/20 border border-[#D9B8CB]/25">
                        <span className="block font-serif font-bold text-base text-[#2B1630] dark:text-[#FDFBF7]">
                          {poemStats.stanzas}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-[#4F3354] dark:text-[#E2CFE6]">Stanzas</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/70 dark:bg-black/20 border border-[#D9B8CB]/25">
                        <span className="block font-serif font-bold text-base text-[#2B1630] dark:text-[#FDFBF7]">
                          {poemStats.characters}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-[#4F3354] dark:text-[#E2CFE6]">Characters</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/70 dark:bg-black/20 border border-[#D9B8CB]/25">
                        <span className="block font-serif font-bold text-base text-[#2B1630] dark:text-[#FDFBF7]">
                          {poemStats.readingTime}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-[#4F3354] dark:text-[#E2CFE6]">Reading Time</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white/70 dark:bg-black/20 border border-[#D9B8CB]/25">
                        <span className="block font-serif font-bold text-xs truncate text-[#2B1630] dark:text-[#FDFBF7]">
                          {poemStats.emotionalIntensity}
                        </span>
                        <span className="text-[10px] font-bold uppercase text-[#4F3354] dark:text-[#E2CFE6]">Energy</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* 6. "Understand This Poem" Breakdown */}
                <PoemExplanation poem={generatedPoem} />
              </div>
            ) : (
              /* Empty Initial State */
              <div className="hero-glass-surface p-12 text-center flex flex-col items-center justify-center min-h-[420px] backdrop-blur-xl border border-[#D9B8CB]/40 shadow-xl">
                <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#633367] to-[#B06086] text-white flex items-center justify-center mb-6 shadow-md">
                  <Feather className="w-8 h-8" />
                </div>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1630] dark:text-[#FDFBF7] mb-2">
                  The Canvas Awaits
                </h3>
                <p className="text-xs sm:text-sm font-medium text-[#4F3354] dark:text-[#E2CFE6] max-w-md mx-auto mb-6 leading-relaxed">
                  Select your theme, mood, and world language from the studio controls on the left, or let chance inspire you with "Surprise Me".
                </p>
                <button
                  onClick={handleGenerate}
                  className="btn-primary px-6 py-2.5 rounded-full text-xs font-bold shadow-md"
                >
                  Weave First Poem
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Remix Modal */}
      <RemixModal
        isOpen={isRemixOpen}
        onClose={() => setIsRemixOpen(false)}
        onRemix={handleRemixApply}
        poem={generatedPoem}
      />

      {/* Poetic Translation Modal */}
      <TranslateModal
        isOpen={isTranslateOpen}
        onClose={() => setIsTranslateOpen(false)}
        poem={generatedPoem}
      />

      {/* Printable Keepsake & Download Modal */}
      <PrintablePoemModal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        poem={generatedPoem}
      />

      {/* Title Lab Modal */}
      <TitleLabModal
        isOpen={isTitleLabOpen}
        onClose={() => setIsTitleLabOpen(false)}
        poem={generatedPoem}
        onApplyTitle={handleApplyTitle}
      />

      {/* Line Lab Modal */}
      <LineLabModal
        isOpen={isLineLabOpen}
        onClose={() => setIsLineLabOpen(false)}
        poem={generatedPoem}
        onApplyLine={handleApplyLine}
      />
    </Layout>
  );
}
