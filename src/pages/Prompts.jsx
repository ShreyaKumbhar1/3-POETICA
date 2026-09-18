import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, BookOpen, Wand2, Feather, ArrowRight, RefreshCw } from 'lucide-react';
import Layout from '../components/Layout';
import { api } from '../services/api';
import { useToast } from '../context/ToastContext';
import { THEMES, MOODS, EMOTIONS } from '../data/options';

export default function Prompts() {
  const navigate = useNavigate();
  const toast = useToast();

  const [dailyPrompt, setDailyPrompt] = useState(null);
  const [generatedPrompt, setGeneratedPrompt] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // Filter params for prompt generator
  const [theme, setTheme] = useState('Memories');
  const [mood, setMood] = useState('Melancholic');
  const [emotion, setEmotion] = useState('Longing');
  const [difficulty, setDifficulty] = useState('Medium');

  useEffect(() => {
    async function load() {
      try {
        const res = await api.getPrompts();
        if (res.daily) setDailyPrompt(res.daily);
        setGeneratedPrompt(res.daily);
      } catch (e) {
        console.error(e);
      }
    }
    load();
  }, []);

  const handleGeneratePrompt = async () => {
    setIsGenerating(true);
    try {
      const res = await api.generatePrompt({ theme, mood, emotion, difficulty });
      setGeneratedPrompt(res);
      toast.success('New writing spark ignited');
    } catch (e) {
      toast.error('Failed to generate prompt');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSurprisePrompt = () => {
    const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
    const randomMood = MOODS[Math.floor(Math.random() * MOODS.length)];
    const randomEmotion = EMOTIONS[Math.floor(Math.random() * EMOTIONS.length)];
    setTheme(randomTheme);
    setMood(randomMood);
    setEmotion(randomEmotion);
    setTimeout(() => handleGeneratePrompt(), 50);
  };

  const handleWriteFromThis = (promptItem) => {
    if (!promptItem) return;
    navigate(
      `/create?theme=${encodeURIComponent(promptItem.theme || theme)}&mood=${encodeURIComponent(promptItem.mood || mood)}&prompt=${encodeURIComponent(promptItem.prompt)}`
    );
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/85 dark:bg-white/10 border border-[#D9B8CB]/40 shadow-xs text-xs font-bold text-[#542F5C] dark:text-[#EBD8EE] mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Creative Muse & Prompts</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2B1630] dark:text-[#FDFBF7] mb-3">
            Ignite the Spark
          </h1>
          <p className="text-xs sm:text-sm font-medium text-[#4D3652] dark:text-[#E2CFE6]">
            When the page feels silent, let a thought, a memory, or an evocative question guide your hand.
          </p>
        </div>

        {/* Today's Inspiration Spotlight */}
        {dailyPrompt && (
          <div className="p-8 sm:p-10 rounded-3xl hero-glass-surface border border-[#D9B8CB]/45 shadow-xl relative overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div className="space-y-2 max-w-2xl">
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#542F5C] dark:text-[#EBD8EE] flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Today's Inspiration
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1630] dark:text-[#FDFBF7]">
                  "{dailyPrompt.title}"
                </h2>
                <p className="font-serif text-base sm:text-lg italic text-[#35233F] dark:text-[#FDFBF7] leading-relaxed">
                  {dailyPrompt.prompt}
                </p>
                <div className="flex items-center gap-2 pt-2 text-[11px] font-semibold text-[#4D3652] dark:text-[#D9C4DC]">
                  <span className="bg-[#542F5C]/10 dark:bg-white/10 px-2.5 py-0.5 rounded-md">Theme: {dailyPrompt.theme}</span>
                  <span>•</span>
                  <span className="bg-[#542F5C]/10 dark:bg-white/10 px-2.5 py-0.5 rounded-md">Mood: {dailyPrompt.mood}</span>
                </div>
              </div>

              <button
                onClick={() => handleWriteFromThis(dailyPrompt)}
                className="btn-primary whitespace-nowrap flex items-center gap-2 px-6 py-3 rounded-full text-xs font-bold shadow-md hover:scale-105 transition-all"
              >
                <Feather className="w-4 h-4" />
                <span>Write This Now</span>
              </button>
            </div>
          </div>
        )}

        {/* Interactive Prompt Generator Studio */}
        <div className="p-8 sm:p-10 rounded-3xl hero-glass-surface border border-[#D9B8CB]/45 shadow-md">
          <div className="mb-6">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1630] dark:text-[#FDFBF7] mb-1">
              Interactive Prompt Generator
            </h2>
            <p className="text-xs sm:text-sm font-medium text-[#4D3652] dark:text-[#E2CFE6]">
              Customize emotional contours to summon a unique writing cue
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1.5">
                Theme
              </label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full p-2.5 rounded-xl text-xs bg-white/85 dark:bg-[#2A1D36]/90 border border-[#D9B8CB]/45 text-[#2B1630] dark:text-[#FDFBF7] font-semibold outline-none"
              >
                {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1.5">
                Mood
              </label>
              <select
                value={mood}
                onChange={(e) => setMood(e.target.value)}
                className="w-full p-2.5 rounded-xl text-xs bg-white/85 dark:bg-[#2A1D36]/90 border border-[#D9B8CB]/45 text-[#2B1630] dark:text-[#FDFBF7] font-semibold outline-none"
              >
                {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1.5">
                Emotion
              </label>
              <select
                value={emotion}
                onChange={(e) => setEmotion(e.target.value)}
                className="w-full p-2.5 rounded-xl text-xs bg-white/85 dark:bg-[#2A1D36]/90 border border-[#D9B8CB]/45 text-[#2B1630] dark:text-[#FDFBF7] font-semibold outline-none"
              >
                {EMOTIONS.map(em => <option key={em} value={em}>{em}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1.5">
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="w-full p-2.5 rounded-xl text-xs bg-white/85 dark:bg-[#2A1D36]/90 border border-[#D9B8CB]/45 text-[#2B1630] dark:text-[#FDFBF7] font-semibold outline-none"
              >
                <option value="Accessible">Accessible</option>
                <option value="Medium">Medium Depth</option>
                <option value="Advanced">Philosophical & Complex</option>
                <option value="Creative">Surreal & Experimental</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <button
              onClick={handleGeneratePrompt}
              disabled={isGenerating}
              className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold shadow-sm"
            >
              {isGenerating ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              <span>Generate Prompt</span>
            </button>

            <button
              onClick={handleSurprisePrompt}
              className="btn-secondary flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold"
            >
              <Wand2 className="w-3.5 h-3.5 text-[#854479]" />
              <span>Surprise Me</span>
            </button>
          </div>

          {/* Result Card */}
          {generatedPrompt && (
            <div className="p-6 rounded-2xl bg-white/85 dark:bg-[#2A1D36]/85 border border-[#D9B8CB]/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm backdrop-blur-md">
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2B1630] dark:text-[#FDFBF7] mb-1">
                  {generatedPrompt.title}
                </h3>
                <p className="font-serif text-sm italic text-[#35233F] dark:text-[#FDFBF7] leading-relaxed">
                  "{generatedPrompt.prompt}"
                </p>
              </div>

              <button
                onClick={() => handleWriteFromThis(generatedPrompt)}
                className="btn-secondary whitespace-nowrap flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold"
              >
                <span>Write From This</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
