import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Sparkles, Share2, MoreVertical, Trash2, Edit3, Flag } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export default function PoemCard({ poem, onDeleted, onReportClick }) {
  const navigate = useNavigate();
  const { user, token, favoriteIds, toggleFavoriteId } = useAuth();
  const toast = useToast();

  const [likesCount, setLikesCount] = useState(poem.likesCount || 0);
  const [isLiked, setIsLiked] = useState(poem.isLiked || false);
  const [isFavorited, setIsFavorited] = useState(
    poem.isFavorited || (user && favoriteIds.includes(poem.id)) || false
  );
  const [menuOpen, setMenuOpen] = useState(false);

  const isOwner = user && poem.userId === user.id;

  const handleToggleLike = async (e) => {
    e.stopPropagation();
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

  const handleToggleFavorite = async (e) => {
    e.stopPropagation();
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

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you wish to delete "${poem.title}"?`)) return;
    try {
      await api.deletePoem(poem.id, token);
      toast.success('Poem deleted');
      if (onDeleted) onDeleted(poem.id);
    } catch (e) {
      toast.error('Failed to delete poem');
    }
  };

  const handleShare = (e) => {
    e.stopPropagation();
    const url = `${window.location.origin}/poem/${poem.id}`;
    if (navigator.share) {
      navigator.share({ title: poem.title, url });
    } else {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard');
    }
  };

  return (
    <div
      onClick={() => navigate(`/poem/${poem.id}`)}
      className="group relative flex flex-col p-6 rounded-3xl bg-[#FFF9F5]/80 dark:bg-[#20172B]/80 border border-[#D9B8CB]/35 shadow-sm hover:shadow-md hover:border-[#854479]/50 backdrop-blur-md cursor-pointer transition-all duration-300"
    >
      {/* Top Metadata Badges */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gradient-to-r from-[#633367] to-[#854479] text-white shadow-xs">
            {poem.language}
          </span>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#854479]/10 dark:bg-white/10 text-[#854479] dark:text-[#E8D8EE]">
            {poem.theme}
          </span>
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-[#5C3A5F] dark:text-[#D9C4DC]">
            {poem.mood}
          </span>
        </div>

        {/* Options Dropdown Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setMenuOpen(!menuOpen);
            }}
            className="p-1 rounded-full text-[#854479] dark:text-[#E8D8EE] hover:bg-[#FBEBF0]/70 transition-colors"
            aria-label="Poem options"
          >
            <MoreVertical className="w-4 h-4" />
          </button>

          {menuOpen && (
            <div className="absolute right-0 top-6 w-36 py-1 rounded-2xl bg-[#FFF9F5]/96 dark:bg-[#1E1428]/96 backdrop-blur-xl shadow-xl border border-[#D9B8CB]/40 z-20 text-xs animate-fadeIn">
              <button
                onClick={handleShare}
                className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-[#FBEBF0]/70 text-[#2B1630] dark:text-[#FDFBF7] font-semibold"
              >
                <Share2 className="w-3.5 h-3.5" /> Share
              </button>
              {isOwner && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/editor/${poem.id}`);
                    }}
                    className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-[#FBEBF0]/70 text-[#2B1630] dark:text-[#FDFBF7] font-semibold"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 font-semibold"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Delete
                  </button>
                </>
              )}
              {!isOwner && onReportClick && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setMenuOpen(false);
                    onReportClick(poem.id);
                  }}
                  className="w-full px-3 py-1.5 text-left flex items-center gap-2 hover:bg-rose-50 text-rose-600 font-semibold"
                >
                  <Flag className="w-3.5 h-3.5" /> Report
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Poem Title */}
      <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#2B1630] dark:text-[#FDFBF7] mb-2 group-hover:text-[#854479] dark:group-hover:text-[#EBD8EE] transition-colors leading-snug">
        {poem.title}
      </h3>

      {/* Poem Excerpt */}
      <p className="font-serif text-sm text-[#3E2442] dark:text-[#F3EBF5] font-normal leading-relaxed italic line-clamp-4 whitespace-pre-line mb-4">
        {poem.content}
      </p>

      {/* Footer Details & Interactions */}
      <div className="mt-auto pt-3 border-t border-[#D9B8CB]/25 flex items-center justify-between text-xs text-[#5C3A5F] dark:text-[#D9C4DC]">
        <div className="flex items-center gap-2">
          <span className="font-bold text-[#2B1630] dark:text-[#FDFBF7]">
            — {poem.authorName || 'Poetica Author'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Like Button */}
          <button
            onClick={handleToggleLike}
            className={`flex items-center gap-1 transition-colors ${
              isLiked ? 'text-rose-600 font-bold' : 'text-[#5C3A5F] dark:text-[#D9C4DC] hover:text-rose-600'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="font-bold">{likesCount}</span>
          </button>

          {/* Favorite Button */}
          <button
            onClick={handleToggleFavorite}
            className={`transition-colors ${
              isFavorited ? 'text-amber-500 font-bold' : 'text-[#5C3A5F] dark:text-[#D9C4DC] hover:text-amber-500'
            }`}
          >
            <Sparkles className={`w-3.5 h-3.5 ${isFavorited ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
}
