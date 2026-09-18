import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  Compass,
  Feather,
  Globe,
  BookOpen,
  ArrowRight,
  Wand2,
  RefreshCw,
  Heart,
  Lightbulb,
  Clock,
  PenTool,
} from 'lucide-react';
import Layout from '../components/Layout';
import PoemCard from '../components/PoemCard';
import { useAtmosphere } from '../context/AtmosphereContext';
import { api } from '../services/api';
import { THEMES, MOODS, POEM_SEEDS, FEELING_WORDS, COMPLETE_THOUGHT_PROMPTS } from '../data/options';

export default function Home() {
  const navigate = useNavigate();
  const { triggerBreeze } = useAtmosphere();
  const [featuredPoems, setFeaturedPoems] = useState([]);
  const [dailyPrompt, setDailyPrompt] = useState(null);
  const [feelingIndex, setFeelingIndex] = useState(0);
  const [seedStart, setSeedStart] = useState(0);
  const [thoughtIndex, setThoughtIndex] = useState(0);
  const [thoughtCompletion, setThoughtCompletion] = useState(null);
  const [isCompletingThought, setIsCompletingThought] = useState(false);
  const [recentDraft, setRecentDraft] = useState(null);

  useEffect(() => {
    async function load() {
      try {
        const exploreData = await api.getExplorePoems({ sort: 'likes' });
        setFeaturedPoems(exploreData.slice(0, 3));

        const promptData = await api.getPrompts();
        if (promptData.daily) setDailyPrompt(promptData.daily);
      } catch (err) {
        console.warn('Could not fetch home showcase:', err);
      }

      // Check for recent draft or poem in localStorage
      try {
        const savedDraft = localStorage.getItem('poetica_recent_draft');
        if (savedDraft) {
          setRecentDraft(JSON.parse(savedDraft));
        }
      } catch {
        // ignore
      }
    }
    load();
  }, []);

  const handleQuickSurprise = () => {
    triggerBreeze();
    const randomTheme = THEMES[Math.floor(Math.random() * THEMES.length)];
    const randomMood = MOODS[Math.floor(Math.random() * MOODS.length)];
    navigate(`/create?theme=${encodeURIComponent(randomTheme)}&mood=${encodeURIComponent(randomMood)}&surprise=true`);
  };

  const handleRefreshInspiration = async () => {
    triggerBreeze();
    try {
      const promptData = await api.getPrompts();
      if (promptData.prompts && promptData.prompts.length > 0) {
        const randomPrompt = promptData.prompts[Math.floor(Math.random() * promptData.prompts.length)];
        setDailyPrompt(randomPrompt);
      }
    } catch {
      const fallback = THEMES[Math.floor(Math.random() * THEMES.length)];
      setDailyPrompt({ prompt: `Write about the quiet beauty of ${fallback.toLowerCase()}...`, theme: fallback, mood: 'Contemplative' });
    }
  };

  const currentFeeling = FEELING_WORDS[feelingIndex % FEELING_WORDS.length];
  const currentSeeds = POEM_SEEDS.slice(seedStart, seedStart + 3);
  const currentThought = COMPLETE_THOUGHT_PROMPTS[thoughtIndex % COMPLETE_THOUGHT_PROMPTS.length];

  const handleNextFeeling = () => {
    triggerBreeze();
    setFeelingIndex((prev) => (prev + 1) % FEELING_WORDS.length);
  };

  const handleNextSeeds = () => {
    triggerBreeze();
    setSeedStart((prev) => (prev + 3 >= POEM_SEEDS.length ? 0 : prev + 3));
  };

  const handleNextThought = () => {
    triggerBreeze();
    setThoughtIndex((prev) => (prev + 1) % COMPLETE_THOUGHT_PROMPTS.length);
    setThoughtCompletion(null);
  };

  const handleAskAIComplete = async () => {
    triggerBreeze();
    setIsCompletingThought(true);
    try {
      const res = await api.completeThought(currentThought);
      setThoughtCompletion(res.completion || res);
    } catch (err) {
      setThoughtCompletion('...where memories drift like slow autumn leaves upon water.');
    } finally {
      setIsCompletingThought(false);
    }
  };

  return (
    <Layout>
      {/* Continue Where You Left Off Banner */}
      {recentDraft && (
        <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-4 pb-2 no-print">
          <div className="p-4 rounded-2xl bg-[#FFF9F5]/78 border border-[#D9B8CB]/45 shadow-sm backdrop-blur-md flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
            <div className="flex items-center gap-3 text-left">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#633367] to-[#854479] text-white flex items-center justify-center shrink-0 shadow-xs">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#854479]">
                  Welcome Back
                </span>
                <p className="font-serif text-sm font-bold text-[#35233F]">
                  Continue your poem: "{recentDraft.title || 'Untitled Draft'}"
                </p>
              </div>
            </div>
            <Link
              to={recentDraft.id ? `/editor/${recentDraft.id}` : `/create`}
              className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shrink-0 hover:scale-105 transition-all"
            >
              <span>Resume Writing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      )}

      {/* Hero Section with Frosted Glass Surface merging into Sakura Forest */}
      <section className="relative max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-14 text-center flex flex-col items-center">
        {/* Frosted Glass Window inside Sakura Garden */}
        <div
          onMouseEnter={triggerBreeze}
          className="w-full hero-glass-surface p-8 sm:p-14 flex flex-col items-center relative group"
        >
          {/* Poetic Floating Fragment */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/85 border border-[#D9B8CB]/45 shadow-xs text-xs font-bold text-[#35233F] mb-6 animate-pulse-gentle">
            <Sparkles className="w-3.5 h-3.5 text-[#854479]" />
            <span>Every feeling has a poem waiting to be written</span>
          </div>

          {/* Centerpiece Literary Title */}
          <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl font-black tracking-tight text-[#35233F] mb-4 leading-none select-none">
            POETICA
          </h1>

          {/* Literary Emotional Tagline */}
          <p className="font-serif text-2xl sm:text-3xl text-[#7B2D54] italic font-bold max-w-2xl mb-4 tracking-wide">
            "Turn feelings into words."
          </p>

          <p className="text-sm sm:text-base text-[#35233F] font-medium max-w-xl mx-auto mb-9 leading-relaxed">
            An immersive AI poetry sanctuary. Create, understand, save, and share poetry in 60+ world languages, shaped by your mood, rhythm, and atmosphere.
          </p>

          {/* CTA Actions */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/create"
              className="btn-primary flex items-center gap-2 px-8 py-3.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <Feather className="w-4 h-4" />
              <span>Create a Poem</span>
            </Link>

            <button
              onClick={handleQuickSurprise}
              className="btn-secondary flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold shadow-xs hover:scale-105 transition-all duration-300 text-[#35233F]"
            >
              <Wand2 className="w-4 h-4 text-[#854479]" />
              <span>Surprise Me</span>
            </button>

            <Link
              to="/explore"
              className="btn-ghost flex items-center gap-2 px-6 py-3.5 rounded-full text-sm font-bold transition-all text-[#35233F]"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Poetry</span>
            </Link>
          </div>
        </div>

        {/* Floating Tonight's Inspiration Card */}
        <div className="w-full max-w-3xl mt-8 p-6 rounded-3xl bg-[#FFF9F5]/78 border border-[#D9B8CB]/40 shadow-md relative overflow-hidden backdrop-blur-md">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-left flex-1">
              <div className="flex items-center gap-2 mb-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-600" />
                <span className="text-[10px] uppercase tracking-widest text-[#854479] font-bold">
                  Tonight's Inspiration
                </span>
              </div>
              <p className="font-serif text-lg font-bold italic text-[#35233F]">
                "{dailyPrompt ? dailyPrompt.prompt : 'Write about a goodbye you never said...'}"
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleRefreshInspiration}
                className="p-2.5 rounded-xl border border-[#D9B8CB]/40 hover:bg-white text-[#35233F] transition-colors"
                title="Refresh Inspiration (Send Breeze)"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <Link
                to={`/create?theme=${encodeURIComponent(dailyPrompt?.theme || 'Memories')}&mood=${encodeURIComponent(dailyPrompt?.mood || 'Melancholic')}`}
                className="btn-primary whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold shadow-xs hover:scale-105 transition-all"
              >
                Write This
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Poetry Seeds & Feeling of the Day Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CARD 1: Feeling of the Day */}
          <div className="p-7 rounded-3xl bg-[#FFF9F5]/78 border border-[#D9B8CB]/40 shadow-sm hover:shadow-md backdrop-blur-md flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#854479]/10 text-[#854479]">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
                  Feeling of the Day
                </span>
                <button
                  onClick={handleNextFeeling}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#854479] hover:underline"
                >
                  <RefreshCw className="w-3 h-3" />
                  Another feeling
                </button>
              </div>

              <h3 className="font-serif text-3xl font-bold text-[#35233F] mb-2">
                {currentFeeling.word}
              </h3>
              <p className="text-xs font-medium text-[#59445F] italic mb-4 leading-relaxed">
                "{currentFeeling.nuance}"
              </p>
              <p className="text-xs text-[#35233F] font-semibold mb-6">
                A poem could begin here. What would your words hold?
              </p>
            </div>

            <div className="pt-4 border-t border-[#D9B8CB]/25">
              <Link
                to={`/create?emotion=${encodeURIComponent(currentFeeling.word)}&theme=${encodeURIComponent(currentFeeling.word)}`}
                className="btn-primary w-full py-2.5 rounded-xl text-xs font-bold text-center block shadow-xs hover:scale-[1.01] transition-all"
              >
                Write from this feeling
              </Link>
            </div>
          </div>

          {/* CARD 2: Poem Seeds */}
          <div className="p-7 rounded-3xl bg-[#FFF9F5]/78 border border-[#D9B8CB]/40 shadow-sm hover:shadow-md backdrop-blur-md flex flex-col justify-between transition-all">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#854479]/10 text-[#854479]">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  Poem Seeds
                </span>
                <button
                  onClick={handleNextSeeds}
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#854479] hover:underline"
                >
                  <RefreshCw className="w-3 h-3" />
                  Give me another seed
                </button>
              </div>

              <h3 className="font-serif text-xl font-bold text-[#35233F] mb-2">
                Curated Spark Lines
              </h3>
              <p className="text-xs font-medium text-[#59445F] mb-4">
                Click any seed below to plant it directly into the Creation Studio:
              </p>

              <div className="space-y-2 mb-4">
                {currentSeeds.map((seed, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      triggerBreeze();
                      navigate(`/create?seed=${encodeURIComponent(seed)}`);
                    }}
                    className="w-full text-left p-3 rounded-xl bg-white/75 border border-[#D9B8CB]/35 hover:border-[#854479] hover:bg-white text-xs font-medium text-[#35233F] flex items-center justify-between group transition-all"
                  >
                    <span className="font-serif italic text-sm text-[#35233F]">
                      "{seed}"
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#854479] group-hover:translate-x-1 transition-transform" />
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-3 border-t border-[#D9B8CB]/25 text-[11px] text-[#59445F] italic text-center">
              * Seeds offer a gentle starting compass for your own verse
            </div>
          </div>
        </div>

        {/* Complete the Thought Interactive Banner */}
        <div className="mt-8 p-7 rounded-3xl bg-[#FFF9F5]/78 border border-[#D9B8CB]/40 shadow-md backdrop-blur-md">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#633367] to-[#854479] text-white flex items-center justify-center shadow-xs">
                <PenTool className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#854479]">
                  Interactive Lyricist
                </span>
                <h3 className="font-serif text-lg font-bold text-[#35233F]">
                  Complete the Thought
                </h3>
              </div>
            </div>

            <button
              onClick={handleNextThought}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-[#854479] hover:underline"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Different Prompt
            </button>
          </div>

          <div className="p-5 rounded-2xl bg-white/80 border border-[#D9B8CB]/40 mb-4 shadow-xs">
            <p className="font-serif text-lg sm:text-xl font-bold italic text-[#35233F]">
              "{currentThought}"
            </p>

            {thoughtCompletion && (
              <div className="mt-3 pt-3 border-t border-[#D9B8CB]/25 animate-fadeIn">
                <p className="font-serif text-base text-[#7B2D54] italic font-semibold">
                  {thoughtCompletion}
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={handleAskAIComplete}
              disabled={isCompletingThought}
              className="btn-secondary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold text-[#35233F]"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>{isCompletingThought ? 'Thinking in verse...' : 'Ask AI to continue'}</span>
            </button>

            <Link
              to={`/create?seed=${encodeURIComponent(thoughtCompletion ? `${currentThought} ${thoughtCompletion}` : currentThought)}`}
              className="btn-primary inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold hover:scale-105 transition-all"
            >
              <Feather className="w-3.5 h-3.5" />
              <span>Continue it yourself in Studio</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Product Highlights / Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-black text-[#35233F] mb-2">
            A Sanctuary for Thought & Verse
          </h2>
          <p className="text-xs sm:text-sm font-medium text-[#59445F]">
            Designed for literary depth, cultural nuance, and emotional tranquility.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-8 rounded-3xl bg-[#FFF9F5]/78 border border-[#D9B8CB]/40 shadow-sm hover:shadow-md backdrop-blur-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#854479]/10 text-[#854479] flex items-center justify-center mb-5">
              <Globe className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#35233F] mb-2">
              World Language Support
            </h3>
            <p className="text-xs sm:text-sm text-[#59445F] font-normal leading-relaxed">
              Compose in 60+ world languages—from Japanese and Hindi to French and Gaelic. Preserves grammar, emotional nuance, and cadence rather than sterile translation.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-8 rounded-3xl bg-[#FFF9F5]/78 border border-[#D9B8CB]/40 shadow-sm hover:shadow-md backdrop-blur-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#854479]/10 text-[#854479] flex items-center justify-center mb-5">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#35233F] mb-2">
              Understand This Poem
            </h3>
            <p className="text-xs sm:text-sm text-[#59445F] font-normal leading-relaxed">
              Unpack the hidden meanings, emotional metaphors, sensory imagery, and cultural vocabulary behind every generated verse with thoughtful literary analysis.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-8 rounded-3xl bg-[#FFF9F5]/78 border border-[#D9B8CB]/40 shadow-sm hover:shadow-md backdrop-blur-md transition-all">
            <div className="w-12 h-12 rounded-2xl bg-[#854479]/10 text-[#854479] flex items-center justify-center mb-5">
              <Sparkles className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-[#35233F] mb-2">
              Atmospheric Sanctuary
            </h3>
            <p className="text-xs sm:text-sm text-[#59445F] font-normal leading-relaxed">
              Experience an organic environment that surrounds your poetry—dancing spring petals, continuous gentle wind, dynamic seasonal atmospheres, and ambient soundscapes.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Community Poems */}
      {featuredPoems.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-serif text-3xl font-bold text-[#35233F]">
                Recent Verses from the Sanctuary
              </h2>
              <p className="text-xs font-medium text-[#59445F]">
                Created by authors around the globe
              </p>
            </div>
            <Link
              to="/explore"
              className="btn-ghost flex items-center gap-1.5 text-xs font-bold text-[#35233F]"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredPoems.map((poem) => (
              <PoemCard key={poem.id} poem={poem} />
            ))}
          </div>
        </section>
      )}
    </Layout>
  );
}
