import React, { useState, useEffect } from 'react';
import { Search, Filter, Compass, Sparkles } from 'lucide-react';
import Layout from '../components/Layout';
import PoemCard from '../components/PoemCard';
import ReportModal from '../components/Modals/ReportModal';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { MOODS, THEMES } from '../data/options';
import { WORLD_LANGUAGES } from '../data/languages';

export default function Explore() {
  const { token } = useAuth();
  const [poems, setPoems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('');
  const [sort, setSort] = useState('newest');

  // Report Modal
  const [reportPoemId, setReportPoemId] = useState(null);

  const fetchExplore = async () => {
    setIsLoading(true);
    try {
      const data = await api.getExplorePoems({
        search,
        language: selectedLanguage,
        mood: selectedMood,
        theme: selectedTheme,
        sort
      }, token);
      setPoems(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchExplore();
  }, [selectedLanguage, selectedMood, selectedTheme, sort, token]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchExplore();
  };

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-white/10 border border-[#D9B8CB]/35 text-xs text-[#542F5C] dark:text-[#EBD8EE] mb-3 font-semibold backdrop-blur-md shadow-xs">
            <Compass className="w-3.5 h-3.5" />
            <span>Public Poetry Showcase</span>
          </div>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#2B1630] dark:text-[#FDFBF7] mb-3">
            Wander Through Verses
          </h1>
          <p className="text-xs sm:text-sm text-[#4F3354] dark:text-[#E2CFE6]">
            Discover poems woven by authors from across the world in their native tongues and quiet moods.
          </p>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 sm:p-5 rounded-3xl hero-glass-surface border border-[#D9B8CB]/35 shadow-md mb-8">
          <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-[#725278] absolute left-3.5 top-3" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search poems by title, theme, verse, or author..."
                className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36]/80 border border-[#D9B8CB]/40 text-[#2B1630] dark:text-[#FDFBF7] placeholder-[#725278] outline-none"
              />
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="p-2 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36]/80 border border-[#D9B8CB]/40 text-[#2B1630] dark:text-[#FDFBF7] font-semibold outline-none"
              >
                <option value="">All Languages</option>
                {WORLD_LANGUAGES.map(l => <option key={l.code} value={l.name}>{l.name}</option>)}
              </select>

              <select
                value={selectedMood}
                onChange={(e) => setSelectedMood(e.target.value)}
                className="p-2 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36]/80 border border-[#D9B8CB]/40 text-[#2B1630] dark:text-[#FDFBF7] font-semibold outline-none"
              >
                <option value="">All Moods</option>
                {MOODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>

              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="p-2 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36]/80 border border-[#D9B8CB]/40 text-[#2B1630] dark:text-[#FDFBF7] font-semibold outline-none"
              >
                <option value="">All Themes</option>
                {THEMES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="p-2 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36]/80 border border-[#D9B8CB]/40 text-[#2B1630] dark:text-[#FDFBF7] font-bold outline-none"
              >
                <option value="newest">Newest First</option>
                <option value="likes">Most Appreciated</option>
                <option value="alphabetical">Alphabetical</option>
              </select>
            </div>
          </form>
        </div>

        {/* Poems Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <p className="font-serif text-lg italic text-[#542F5C] dark:text-[#EBD8EE] animate-pulse">Listening to the archive...</p>
          </div>
        ) : poems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {poems.map(poem => (
              <PoemCard
                key={poem.id}
                poem={poem}
                onReportClick={(id) => setReportPoemId(id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 p-8 rounded-3xl hero-glass-surface border border-[#D9B8CB]/35 max-w-lg mx-auto shadow-xl">
            <Sparkles className="w-10 h-10 text-[#854479] dark:text-[#C282BA] mx-auto mb-3" />
            <h3 className="font-serif text-2xl font-bold text-[#2B1630] dark:text-[#FDFBF7] mb-2">
              No verses found
            </h3>
            <p className="text-xs text-[#4F3354] dark:text-[#E2CFE6]">
              Try adjusting your search criteria or language filter to discover other poems.
            </p>
          </div>
        )}
      </div>

      <ReportModal
        isOpen={!!reportPoemId}
        onClose={() => setReportPoemId(null)}
        poemId={reportPoemId}
      />
    </Layout>
  );
}
