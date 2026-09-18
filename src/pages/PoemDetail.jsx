import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Heart, Sparkles, Copy, Printer, Volume2, VolumeX,
  Eye, ArrowLeft, Wand2, Globe, Check, Edit3, History, Clock
} from 'lucide-react';
import Layout from '../components/Layout';
import PoemExplanation from '../components/PoemExplanation';
import PoemJourneyTimeline from '../components/PoemJourneyTimeline';
import TranslateModal from '../components/Modals/TranslateModal';
import PrintablePoemModal from '../components/Modals/PrintablePoemModal';
import RemixModal from '../components/Modals/RemixModal';
import { useAuth } from '../context/AuthContext';
import { useAtmosphere } from '../context/AtmosphereContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';
import { poeticaSpeech } from '../utils/speech';
import { WORLD_LANGUAGES } from '../data/languages';

export default function PoemDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, token, favoriteIds, toggleFavoriteId } = useAuth();
  const { setAutoAtmosphere } = useAtmosphere();
  const toast = useToast();

  const [poem, setPoem] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);
  const [isPlayingSpeech, setIsPlayingSpeech] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showVersions, setShowVersions] = useState(false);

  // Modals
  const [isTranslateOpen, setIsTranslateOpen] = useState(false);
  const [isPrintOpen, setIsPrintOpen] = useState(false);
  const [isRemixOpen, setIsRemixOpen] = useState(false);

  useEffect(() => {
    async function loadPoem() {
      try {
        const data = await api.getPoem(id, token);
        setPoem(data);
        setLikesCount(data.likesCount || 0);
        setIsLiked(data.isLiked || false);
        setIsFavorited(data.isFavorited || (user && favoriteIds.includes(data.id)) || false);
        setAutoAtmosphere(data.atmosphere);
      } catch (err) {
        toast.error('Poem not found or private');
        navigate('/explore');
      } finally {
        setIsLoading(false);
      }
    }
    loadPoem();
  }, [id, token]);

  useEffect(() => {
    poeticaSpeech.onStateChange = (playing) => setIsPlayingSpeech(playing);
    return () => poeticaSpeech.stop();
  }, []);

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
          <p className="font-serif text-xl italic text-[#542F5C] dark:text-[#EBD8EE] animate-pulse">
            Unveiling verse...
          </p>
        </div>
      </Layout>
    );
  }

  if (!poem) return null;

  const isOwner = user && poem.userId === user.id;
  const activeLangObj = WORLD_LANGUAGES.find(l => l.name === poem.language) || { speechLang: 'en-US' };

  const handleToggleLike = async () => {
    if (!token) {
      toast.info('Sign in to appreciate poems');
      return;
    }
    try {
      const res = await api.toggleLike(poem.id, token);
      setIsLiked(res.isLiked);
      setLikesCount(res.likesCount);
    } catch (e) {
      toast.error('Failed to like poem');
    }
  };

  const handleToggleFavorite = async () => {
    if (!token) {
      toast.info('Sign in to save poems to your sanctuary');
      return;
    }
    try {
      const res = await api.toggleFavorite(poem.id, token);
      setIsFavorited(res.isFavorited);
      toggleFavoriteId(poem.id);
      toast.success(res.isFavorited ? 'Saved to Favorites' : 'Removed from Favorites');
    } catch (e) {
      toast.error('Failed to update favorite');
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(`${poem.title}\n\n${poem.content}\n\n— ${poem.authorName || 'Poetica'}`);
    setCopied(true);
    toast.success('Poem copied to clipboard');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTextToSpeech = () => {
    if (isPlayingSpeech) {
      poeticaSpeech.stop();
    } else {
      poeticaSpeech.speak(`${poem.title}. ${poem.content}`, activeLangObj.speechLang || 'en-US');
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {/* Navigation & Reading Mode Banner */}
        <div className="flex items-center justify-between gap-4 mb-8">
          <Link
            to="/explore"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#3A2440] dark:text-[#F3EBF5] hover:text-[#542F5C] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Explore</span>
          </Link>

          <div className="flex items-center gap-2">
            {isOwner && (
              <Link
                to={`/editor/${poem.id}`}
                className="btn-secondary inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </Link>
            )}

            <Link
              to={`/reading/${poem.id}`}
              className="btn-primary inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Reading Mode</span>
            </Link>
          </div>
        </div>

        {/* Main Poem Display Card */}
        <article className="hero-glass-surface p-8 sm:p-14 border border-[#D9B8CB]/40 shadow-2xl relative backdrop-blur-xl">
          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-bold btn-primary shadow-xs">
              {poem.language}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#542F5C]/10 dark:bg-[#EBD8EE]/10 text-[#542F5C] dark:text-[#EBD8EE] border border-[#D9B8CB]/35">
              {poem.theme}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/80 dark:bg-white/10 border border-[#D9B8CB]/35 text-[#2B1630] dark:text-[#FDFBF7]">
              {poem.mood}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold text-[#4F3354] dark:text-[#E2CFE6]">
              {poem.style}
            </span>
          </div>

          {/* Poem Title */}
          <h1 className="font-serif text-3xl sm:text-5xl font-black text-center text-[#2B1630] dark:text-[#FDFBF7] mb-4 leading-tight">
            {poem.title}
          </h1>

          {/* Author Byline */}
          <p className="text-center text-xs font-medium text-[#4F3354] dark:text-[#E2CFE6] mb-10">
            Penned by <span className="font-bold text-[#2B1630] dark:text-[#FDFBF7]">{poem.authorName || 'Anonymous Author'}</span> • {new Date(poem.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          {/* Verses */}
          <div className="font-serif text-xl sm:text-2xl text-[#2B1630] dark:text-[#FDFBF7] leading-loose whitespace-pre-line text-center italic max-w-xl mx-auto my-10">
            {poem.content}
          </div>

          {/* Author Signature */}
          <div className="text-center pt-4 pb-4 border-t border-[#D9B8CB]/25">
            <p className="font-serif italic text-base font-semibold text-[#4F3354] dark:text-[#E2CFE6]">
              — {poem.authorName || 'Pen of Poetica'}
            </p>
          </div>

          {/* Action Ribbon */}
          <div className="pt-6 mt-6 border-t border-[#D9B8CB]/25 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <button
                onClick={handleToggleLike}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition-all ${
                  isLiked
                    ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-200 border-rose-300 font-bold'
                    : 'btn-secondary'
                }`}
              >
                <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current text-rose-600' : ''}`} />
                <span>{likesCount} Likes</span>
              </button>

              <button
                onClick={handleToggleFavorite}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border transition-all ${
                  isFavorited
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-200 border-amber-300 font-bold'
                    : 'btn-secondary'
                }`}
              >
                <Sparkles className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current text-amber-500' : ''}`} />
                <span>{isFavorited ? 'Favorited' : 'Favorite'}</span>
              </button>

              <button
                onClick={handleTextToSpeech}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold transition-all ${
                  isPlayingSpeech ? 'btn-primary' : 'btn-secondary'
                }`}
              >
                {isPlayingSpeech ? <VolumeX className="w-3.5 h-3.5 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5" />}
                <span>{isPlayingSpeech ? 'Stop' : 'Listen'}</span>
              </button>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRemixOpen(true)}
                className="btn-secondary flex items-center gap-1 px-3 py-2 rounded-xl font-bold"
              >
                <Wand2 className="w-3.5 h-3.5" />
                <span>Remix</span>
              </button>

              <button
                onClick={() => setIsTranslateOpen(true)}
                className="btn-secondary flex items-center gap-1 px-3 py-2 rounded-xl font-bold"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Translate</span>
              </button>

              <button
                onClick={handleCopy}
                className="p-2.5 rounded-xl border border-[#D9B8CB]/35 hover:bg-[#542F5C]/10 text-[#2B1630] dark:text-[#FDFBF7]"
                title="Copy poem"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              </button>

              <button
                onClick={() => setIsPrintOpen(true)}
                className="p-2.5 rounded-xl border border-[#D9B8CB]/35 hover:bg-[#542F5C]/10 text-[#2B1630] dark:text-[#FDFBF7]"
                title="Print Keepsake"
              >
                <Printer className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </article>

        {/* Version History Drawer / Preview (if present) */}
        {poem.versions && poem.versions.length > 0 && (
          <div className="hero-glass-surface mt-8 p-5 border border-[#D9B8CB]/35 shadow-md backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#854479] dark:text-[#EBD8EE]" />
                <h4 className="font-serif font-bold text-sm text-[#2B1630] dark:text-[#FDFBF7]">
                  Version Archive ({poem.versions.length} prior revision{poem.versions.length > 1 ? 's' : ''})
                </h4>
              </div>
              <button
                onClick={() => setShowVersions(!showVersions)}
                className="text-xs font-semibold text-[#542F5C] dark:text-[#EBD8EE] hover:underline"
              >
                {showVersions ? 'Hide Versions' : 'View Revisions'}
              </button>
            </div>

            {showVersions && (
              <div className="space-y-3 mt-3 pt-3 border-t border-[#D9B8CB]/25">
                {poem.versions.map((v, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#FFF9F5]/70 dark:bg-black/20 border border-[#D9B8CB]/25 text-xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#2B1630] dark:text-[#FDFBF7]">
                        Revision #{i + 1}: "{v.title || poem.title}"
                      </span>
                      <span className="text-[10px] text-[#4F3354] dark:text-[#E2CFE6]">
                        {v.timestamp ? new Date(v.timestamp).toLocaleString() : 'Past save'}
                      </span>
                    </div>
                    <p className="font-serif italic text-[#4F3354] dark:text-[#E2CFE6] line-clamp-2">
                      {v.content}
                    </p>
                    {isOwner && (
                      <div className="mt-2 text-right">
                        <button
                          onClick={() => navigate(`/editor/${poem.id}`)}
                          className="text-[11px] font-semibold text-[#542F5C] dark:text-[#EBD8EE] hover:underline"
                        >
                          Open in Editor to restore →
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Poem Journey Timeline */}
        <div className="mt-8">
          <PoemJourneyTimeline poem={poem} />
        </div>

        {/* "Understand This Poem" Breakdown */}
        <PoemExplanation poem={poem} />
      </div>

      <TranslateModal
        isOpen={isTranslateOpen}
        onClose={() => setIsTranslateOpen(false)}
        poem={poem}
      />

      <PrintablePoemModal
        isOpen={isPrintOpen}
        onClose={() => setIsPrintOpen(false)}
        poem={poem}
      />

      <RemixModal
        isOpen={isRemixOpen}
        onClose={() => setIsRemixOpen(false)}
        onRemix={async (remixType) => {
          const remixed = await api.remixPoem(poem, remixType);
          setPoem(remixed);
          setAutoAtmosphere(remixed.atmosphere);
        }}
        poem={poem}
      />
    </Layout>
  );
}
