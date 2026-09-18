import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  X, Volume2, VolumeX, Plus, Minus, Feather,
  ChevronLeft, ChevronRight
} from 'lucide-react';
import AtmosphericCanvas from '../components/Atmosphere/AtmosphericCanvas';
import { useAtmosphere } from '../context/AtmosphereContext';
import { api } from '../services/api';

export default function ReadingMode() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { ambientAudioTrack, toggleAmbientAudio, setAutoAtmosphere } = useAtmosphere();

  const [poem, setPoem] = useState(null);
  const [allPoems, setAllPoems] = useState([]);
  const [fontSizeLevel, setFontSizeLevel] = useState(2); // 0 to 4
  const [isLoading, setIsLoading] = useState(true);

  const fontSizes = [
    'text-lg sm:text-xl leading-relaxed',
    'text-xl sm:text-2xl leading-loose',
    'text-2xl sm:text-3xl leading-loose',
    'text-3xl sm:text-4xl leading-loose',
    'text-4xl sm:text-5xl leading-loose'
  ];

  // Fetch current poem
  useEffect(() => {
    async function load() {
      try {
        const data = await api.getPoem(id);
        setPoem(data);
        if (data.atmosphere) {
          setAutoAtmosphere(data.atmosphere);
        }
      } catch (e) {
        navigate('/explore');
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [id]);

  // Fetch poem list for Prev / Next navigation
  useEffect(() => {
    async function loadExploreList() {
      try {
        const list = await api.getExplorePoems();
        if (Array.isArray(list)) {
          setAllPoems(list);
        }
      } catch {}
    }
    loadExploreList();
  }, []);

  // Compute Prev & Next
  const currentIndex = allPoems.findIndex((p) => String(p.id) === String(id));
  const prevPoem = currentIndex > 0 ? allPoems[currentIndex - 1] : null;
  const nextPoem = currentIndex >= 0 && currentIndex < allPoems.length - 1 ? allPoems[currentIndex + 1] : null;

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && prevPoem) {
        navigate(`/reading/${prevPoem.id}`);
      } else if (e.key === 'ArrowRight' && nextPoem) {
        navigate(`/reading/${nextPoem.id}`);
      } else if (e.key === 'Escape') {
        navigate(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [prevPoem, nextPoem]);

  if (isLoading || !poem) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FEFCF9] dark:bg-[#1E1428]">
        <p className="font-serif text-xl italic text-[#542F5C] dark:text-[#EBD8EE] animate-pulse">
          Entering Reading Sanctuary...
        </p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden selection:bg-[#542F5C]/20">
      {/* 3D Atmospheric Background */}
      <AtmosphericCanvas />

      {/* Floating Top Minimal Bar */}
      <div className="relative z-20 max-w-5xl mx-auto w-full px-6 py-6 flex items-center justify-between text-xs">
        <button
          onClick={() => navigate(-1)}
          className="btn-secondary flex items-center gap-1.5 px-4 py-2 rounded-full font-bold shadow-sm"
        >
          <X className="w-4 h-4" />
          <span>Exit Reading Mode</span>
        </button>

        {/* Center Minimal Indicator */}
        <div className="hidden sm:flex items-center gap-2 text-[#4D3652] dark:text-[#E2CFE6]">
          <Feather className="w-3.5 h-3.5 text-[#542F5C] dark:text-[#C282BA]" />
          <span className="font-serif font-bold tracking-widest uppercase text-[11px]">
            POETICA SANCTUARY
          </span>
        </div>

        {/* Ambient Audio & Font Scale Controls */}
        <div className="flex items-center gap-2">
          {/* Audio toggle */}
          <button
            onClick={() => toggleAmbientAudio('rain')}
            title="Toggle Soft Rain Ambience"
            className={`p-2 rounded-full border border-[#D9B8CB]/35 shadow-sm transition-colors ${
              ambientAudioTrack
                ? 'btn-primary'
                : 'bg-white/80 dark:bg-white/10 text-[#2B1630] dark:text-[#FDFBF7] hover:bg-[#542F5C]/10'
            }`}
          >
            {ambientAudioTrack ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Font scale */}
          <div className="flex items-center gap-1 bg-white/80 dark:bg-white/10 rounded-full p-1 border border-[#D9B8CB]/35 shadow-sm">
            <button
              onClick={() => setFontSizeLevel((prev) => Math.max(0, prev - 1))}
              disabled={fontSizeLevel === 0}
              className="p-1 rounded-full text-[#2B1630] dark:text-[#FDFBF7] hover:bg-[#542F5C]/10 disabled:opacity-30"
              title="Smaller font"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="text-[10px] px-1 text-[#4F3354] dark:text-[#E2CFE6] font-serif font-bold">A</span>
            <button
              onClick={() => setFontSizeLevel((prev) => Math.min(fontSizes.length - 1, prev + 1))}
              disabled={fontSizeLevel === fontSizes.length - 1}
              className="p-1 rounded-full text-[#2B1630] dark:text-[#FDFBF7] hover:bg-[#542F5C]/10 disabled:opacity-30"
              title="Larger font"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Centered Literary Poem Content inside Readability Veil */}
      <main className="relative z-10 max-w-3xl mx-auto px-6 py-8 text-center my-auto w-full">
        <div className="hero-glass-surface p-8 sm:p-14 border border-[#D9B8CB]/40 shadow-2xl backdrop-blur-xl">
          <div className="mb-6">
            <span className="text-[11px] uppercase tracking-widest text-[#542F5C] dark:text-[#C282BA] font-bold block mb-2">
              {poem.language} • {poem.theme} • {poem.mood}
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-black text-[#2B1630] dark:text-[#FDFBF7] leading-tight">
              {poem.title}
            </h1>
          </div>

          {/* Distraction-Free Verse */}
          <div className={`font-serif italic text-[#2B1630] dark:text-[#FDFBF7] whitespace-pre-line max-w-2xl mx-auto my-8 ${fontSizes[fontSizeLevel]}`}>
            {poem.content}
          </div>

          <p className="mt-8 text-xs text-[#4F3354] dark:text-[#E2CFE6] font-serif italic font-semibold">
            — {poem.authorName || 'Anonymous Author'}
          </p>
        </div>

        {/* Previous / Next Controls */}
        <div className="mt-8 flex items-center justify-between gap-4">
          {prevPoem ? (
            <button
              onClick={() => navigate(`/reading/${prevPoem.id}`)}
              className="btn-secondary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
              title="Previous poem (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous:</span> "{prevPoem.title.slice(0, 20)}..."
            </button>
          ) : (
            <div />
          )}

          {nextPoem && (
            <button
              onClick={() => navigate(`/reading/${nextPoem.id}`)}
              className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold shadow-sm"
              title="Next poem (Right Arrow)"
            >
              <span className="hidden sm:inline">Next:</span> "{nextPoem.title.slice(0, 20)}..."
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </main>

      {/* Minimal Bottom Spacer */}
      <div className="relative z-10 py-6 text-center text-xs font-serif font-semibold text-[#4D3652] dark:text-[#E2CFE6] tracking-wider">
        POETICA • {poem.mood} Atmosphere • Use ← and → keys to browse
      </div>
    </div>
  );
}
