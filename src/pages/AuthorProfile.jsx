import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Edit3, Heart, Feather, BookOpen, Globe, Shield, Sparkles, Plus, Check
} from 'lucide-react';
import Layout from '../components/Layout';
import PoemCard from '../components/PoemCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export default function AuthorProfile() {
  const { user, token, isAuthenticated, updateProfile } = useAuth();
  const toast = useToast();

  const [authorPoems, setAuthorPoems] = useState([]);
  const [stats, setStats] = useState({
    totalPoems: 0,
    publishedPoems: 0,
    totalFavorites: 0,
    totalCollections: 0
  });

  // Edit Profile Modal
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [bio, setBio] = useState('');
  const [isPublic, setIsPublic] = useState(true);

  useEffect(() => {
    if (user) {
      setDisplayName(user.displayName || user.username);
      setBio(user.bio || '');
      setIsPublic(user.isPublic !== undefined ? user.isPublic : true);
    }
  }, [user]);

  useEffect(() => {
    if (!token) return;
    async function loadData() {
      try {
        const me = await api.getMe(token);
        setStats(me.stats || {});

        const poems = await api.getLibraryPoems({}, token);
        setAuthorPoems(poems.slice(0, 6));
      } catch (e) {
        console.error(e);
      }
    }
    loadData();
  }, [token]);

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="hero-glass-surface max-w-md mx-auto my-20 p-8 sm:p-10 text-center border border-[#D9B8CB]/45 shadow-xl backdrop-blur-xl">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#633367] to-[#854479] text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
            <User className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1630] dark:text-[#FDFBF7] mb-2">
            Author Sanctuary
          </h2>
          <p className="text-xs sm:text-sm font-medium text-[#4D3652] dark:text-[#E2CFE6] mb-6 leading-relaxed">
            Please sign in to view your author profile, published verses, and creative statistics.
          </p>
          <Link
            to="/login"
            className="btn-primary inline-flex items-center justify-center px-6 py-2.5 rounded-full text-xs font-bold shadow-md hover:scale-105 transition-all"
          >
            Sign In to Studio
          </Link>
        </div>
      </Layout>
    );
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await updateProfile({ displayName, bio, isPublic });
      setEditModalOpen(false);
      toast.success('Author profile updated');
    } catch (err) {
      toast.error('Failed to update profile');
    }
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-10">
        {/* Profile Bio Header Card */}
        <div className="hero-glass-surface p-8 sm:p-12 border border-[#D9B8CB]/40 shadow-xl relative backdrop-blur-xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80'}
              alt={user.displayName}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl object-cover shadow-md border-2 border-white/80"
            />

            <div className="flex-1 space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1630] dark:text-[#FDFBF7]">
                    {user.displayName || user.username}
                  </h1>
                  <p className="text-xs text-[#4F3354] dark:text-[#E2CFE6]">
                    @{user.username} • Author since {new Date(user.createdAt || Date.now()).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <button
                  onClick={() => setEditModalOpen(true)}
                  className="btn-secondary inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold"
                >
                  <Edit3 className="w-3.5 h-3.5 text-[#542F5C] dark:text-[#C282BA]" />
                  <span>Edit Profile</span>
                </button>
              </div>

              <p className="text-sm font-serif italic text-[#4F3354] dark:text-[#E2CFE6] leading-relaxed max-w-2xl pt-1">
                "{user.bio || 'Wandering through quiet words and starlit pages.'}"
              </p>

              {/* Badges */}
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-2">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#542F5C]/10 text-[#542F5C] dark:bg-[#EBD8EE]/10 dark:text-[#EBD8EE] border border-[#D9B8CB]/35">
                  {user.isPublic ? 'Public Author Profile' : 'Private Profile'}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-white/75 dark:bg-white/10 text-[#2B1630] dark:text-[#FDFBF7] border border-[#D9B8CB]/35">
                  Preferred: English & World Languages
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Tasteful Visual Literary Statistics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="hero-glass-surface p-6 border border-[#D9B8CB]/35 text-center shadow-md backdrop-blur-md">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1630] dark:text-[#FDFBF7] block mb-1">
              {stats.totalPoems || authorPoems.length}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4F3354] dark:text-[#E2CFE6]">
              Poems Created
            </span>
          </div>

          <div className="hero-glass-surface p-6 border border-[#D9B8CB]/35 text-center shadow-md backdrop-blur-md">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1630] dark:text-[#FDFBF7] block mb-1">
              {stats.publishedPoems || 0}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4F3354] dark:text-[#E2CFE6]">
              Published
            </span>
          </div>

          <div className="hero-glass-surface p-6 border border-[#D9B8CB]/35 text-center shadow-md backdrop-blur-md">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1630] dark:text-[#FDFBF7] block mb-1">
              {stats.totalFavorites || 0}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4F3354] dark:text-[#E2CFE6]">
              Favorites
            </span>
          </div>

          <div className="hero-glass-surface p-6 border border-[#D9B8CB]/35 text-center shadow-md backdrop-blur-md">
            <span className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1630] dark:text-[#FDFBF7] block mb-1">
              {stats.totalCollections || 0}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4F3354] dark:text-[#E2CFE6]">
              Collections
            </span>
          </div>
        </div>

        {/* Recent Author Works */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-2xl font-bold text-[#2B1630] dark:text-[#FDFBF7]">
              Recent Compositions
            </h2>
            <Link to="/library" className="text-xs font-semibold text-[#542F5C] dark:text-[#EBD8EE] hover:underline">
              View All in Library →
            </Link>
          </div>

          {authorPoems.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {authorPoems.map(poem => (
                <PoemCard key={poem.id} poem={poem} />
              ))}
            </div>
          ) : (
            <div className="hero-glass-surface text-center py-12 p-8 border border-[#D9B8CB]/35 max-w-lg mx-auto shadow-md">
              <p className="text-xs text-[#4F3354] dark:text-[#E2CFE6] mb-4">You have not composed any poems yet.</p>
              <Link
                to="/create"
                className="btn-primary px-5 py-2 rounded-full text-xs font-bold shadow-md"
              >
                Create Your First Poem
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Edit Profile Modal */}
      {editModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 sm:p-8 rounded-3xl bg-[#FFF9F5] dark:bg-[#20172B] shadow-2xl border border-[#D9B8CB]/40 backdrop-blur-xl">
            <h3 className="font-serif text-2xl font-bold text-[#2B1630] dark:text-[#FDFBF7] mb-4">
              Edit Author Profile
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#542F5C] dark:text-[#EBD8EE] mb-1">
                  Display Name
                </label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36]/80 border border-[#D9B8CB]/40 text-[#2B1630] dark:text-[#FDFBF7] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#542F5C] dark:text-[#EBD8EE] mb-1">
                  Poetic Bio
                </label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell your readers about your poetic journey..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36]/80 border border-[#D9B8CB]/40 text-[#2B1630] dark:text-[#FDFBF7] resize-none outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isPublic"
                  checked={isPublic}
                  onChange={(e) => setIsPublic(e.target.checked)}
                  className="rounded border-[#D9B8CB] text-[#542F5C] focus:ring-[#542F5C]"
                />
                <label htmlFor="isPublic" className="text-xs font-semibold text-[#2B1630] dark:text-[#FDFBF7]">
                  Public Profile (visible to readers on explore & detail pages)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#D9B8CB]/25">
                <button
                  type="button"
                  onClick={() => setEditModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#4F3354] dark:text-[#E2CFE6] hover:bg-black/5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 text-xs font-bold rounded-xl shadow-xs"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
