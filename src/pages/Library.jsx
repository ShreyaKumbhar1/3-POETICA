import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart, FolderPlus, Folder, Bookmark, Plus, Search, Filter,
  Trash2, Edit, Sparkles, Feather, ArrowRight
} from 'lucide-react';
import Layout from '../components/Layout';
import PoemCard from '../components/PoemCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export default function Library() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated } = useAuth();
  const toast = useToast();

  const [activeTab, setActiveTab] = useState('all'); // all | favorites | published | drafts
  const [poems, setPoems] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedCollectionId, setSelectedCollectionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Search & Filters
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');

  // Collection modal
  const [collectionModalOpen, setCollectionModalOpen] = useState(false);
  const [newCollectionName, setNewCollectionName] = useState('');
  const [newCollectionDesc, setNewCollectionDesc] = useState('');

  useEffect(() => {
    if (!isAuthenticated) return;
    loadLibraryData();
  }, [isAuthenticated, token, activeTab, sort]);

  const loadLibraryData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'favorites') {
        const favs = await api.getLibraryPoems({ sort }, token);
        const favPoems = favs.filter(p => p.isFavorited);
        setPoems(favPoems);
      } else {
        const filters = { sort, search };
        if (activeTab === 'published') filters.isPublic = 'true';
        const data = await api.getLibraryPoems(filters, token);
        setPoems(data);
      }

      const cols = await api.getCollections(token);
      setCollections(cols);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateCollection = async (e) => {
    e.preventDefault();
    if (!newCollectionName.trim()) return;
    try {
      const created = await api.createCollection({
        name: newCollectionName.trim(),
        description: newCollectionDesc.trim()
      }, token);
      setCollections(prev => [...prev, created]);
      setNewCollectionName('');
      setNewCollectionDesc('');
      setCollectionModalOpen(false);
      toast.success(`Collection "${created.name}" created`);
    } catch (err) {
      toast.error('Failed to create collection');
    }
  };

  const handleDeleteCollection = async (id, name) => {
    if (!window.confirm(`Delete collection "${name}"? (Poems will remain in your library)`)) return;
    try {
      await api.deleteCollection(id, token);
      setCollections(prev => prev.filter(c => c.id !== id));
      if (selectedCollectionId === id) setSelectedCollectionId(null);
      toast.success('Collection removed');
    } catch (err) {
      toast.error('Failed to delete collection');
    }
  };

  if (!isAuthenticated) {
    return (
      <Layout>
        <div className="hero-glass-surface max-w-md mx-auto my-16 px-8 py-14 text-center border border-[#D9B8CB]/35 shadow-xl backdrop-blur-xl">
          <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#633367] to-[#B06086] flex items-center justify-center text-white mx-auto mb-4 shadow-sm">
            <Heart className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#2B1630] dark:text-[#FDFBF7] mb-2">
            Your Personal Sanctuary
          </h2>
          <p className="text-xs text-[#4F3354] dark:text-[#E2CFE6] mb-6 leading-relaxed">
            Sign in to preserve your generated poems, organize thematic collections, and build your author library.
          </p>
          <div className="flex justify-center gap-3">
            <Link
              to="/login"
              className="btn-primary px-6 py-2.5 rounded-full text-xs font-bold shadow-sm"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              className="btn-secondary px-6 py-2.5 rounded-full text-xs font-bold"
            >
              Become Author
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  // Filter by selected collection if active
  const displayedPoems = selectedCollectionId
    ? poems.filter(p => {
        const col = collections.find(c => c.id === selectedCollectionId);
        return col && col.poemIds && col.poemIds.includes(p.id);
      })
    : poems;

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#2B1630] dark:text-[#FDFBF7]">
              My Library
            </h1>
            <p className="text-xs text-[#4F3354] dark:text-[#E2CFE6]">
              Your private sanctuary of verses, drafts, and collections.
            </p>
          </div>

          <Link
            to="/create"
            className="btn-primary flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Create Something</span>
          </Link>
        </div>

        {/* Tabs & Collections Ribbon */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-4 border-b border-[#D9B8CB]/25">
          {/* Main Tabs */}
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => {
                setActiveTab('all');
                setSelectedCollectionId(null);
              }}
              className={`px-4 py-2 rounded-full transition-all ${
                activeTab === 'all' && !selectedCollectionId
                  ? 'btn-primary shadow-xs'
                  : 'text-[#2B1630] dark:text-[#F3EBF5] hover:bg-[#542F5C]/10 font-semibold'
              }`}
            >
              All Poems ({poems.length})
            </button>

            <button
              onClick={() => {
                setActiveTab('favorites');
                setSelectedCollectionId(null);
              }}
              className={`px-4 py-2 rounded-full transition-all ${
                activeTab === 'favorites'
                  ? 'btn-primary shadow-xs'
                  : 'text-[#2B1630] dark:text-[#F3EBF5] hover:bg-[#542F5C]/10 font-semibold'
              }`}
            >
              Favorites
            </button>

            <button
              onClick={() => {
                setActiveTab('published');
                setSelectedCollectionId(null);
              }}
              className={`px-4 py-2 rounded-full transition-all ${
                activeTab === 'published'
                  ? 'btn-primary shadow-xs'
                  : 'text-[#2B1630] dark:text-[#F3EBF5] hover:bg-[#542F5C]/10 font-semibold'
              }`}
            >
              Published
            </button>
          </div>

          {/* Collections Action */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCollectionModalOpen(true)}
              className="btn-secondary flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold"
            >
              <FolderPlus className="w-3.5 h-3.5 text-[#542F5C] dark:text-[#C282BA]" />
              <span>New Collection</span>
            </button>
          </div>
        </div>

        {/* Collections Chips */}
        {collections.length > 0 && (
          <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2">
            <span className="text-[10px] uppercase font-bold text-[#542F5C] dark:text-[#C282BA] whitespace-nowrap">
              Collections:
            </span>
            {collections.map(c => (
              <div
                key={c.id}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs cursor-pointer transition-all ${
                  selectedCollectionId === c.id
                    ? 'btn-primary shadow-xs'
                    : 'bg-white/75 dark:bg-white/10 border border-[#D9B8CB]/35 text-[#2B1630] dark:text-[#FDFBF7] hover:border-[#854479]'
                }`}
                onClick={() => setSelectedCollectionId(selectedCollectionId === c.id ? null : c.id)}
              >
                <Folder className="w-3 h-3 text-[#854479] dark:text-[#C282BA]" />
                <span className="font-semibold">{c.name} ({c.poemIds?.length || 0})</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteCollection(c.id, c.name);
                  }}
                  className="hover:text-red-500 ml-1 font-bold text-sm"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Poems Grid */}
        {isLoading ? (
          <div className="text-center py-20">
            <p className="font-serif text-lg italic text-[#542F5C] dark:text-[#EBD8EE] animate-pulse">Opening library volumes...</p>
          </div>
        ) : displayedPoems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayedPoems.map(poem => (
              <PoemCard
                key={poem.id}
                poem={poem}
                onDeleted={(id) => setPoems(prev => prev.filter(p => p.id !== id))}
              />
            ))}
          </div>
        ) : (
          /* Poetic Empty States */
          <div className="hero-glass-surface text-center py-16 p-10 border border-[#D9B8CB]/35 max-w-lg mx-auto shadow-xl backdrop-blur-xl">
            <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-[#633367] to-[#B06086] text-white flex items-center justify-center mx-auto mb-4 shadow-sm">
              <Feather className="w-7 h-7" />
            </div>

            {activeTab === 'favorites' ? (
              <>
                <h3 className="font-serif text-2xl font-bold text-[#2B1630] dark:text-[#FDFBF7] mb-2">
                  Nothing here yet
                </h3>
                <p className="text-xs text-[#4F3354] dark:text-[#E2CFE6] mb-6">
                  Save a poem that speaks to you to keep it forever close at hand.
                </p>
                <Link
                  to="/explore"
                  className="btn-primary px-6 py-2.5 rounded-full text-xs font-bold shadow-sm"
                >
                  Explore Poems
                </Link>
              </>
            ) : (
              <>
                <h3 className="font-serif text-2xl font-bold text-[#2B1630] dark:text-[#FDFBF7] mb-2">
                  My Library is waiting for your first poem
                </h3>
                <p className="text-xs text-[#4F3354] dark:text-[#E2CFE6] mb-6">
                  Every feeling has a poem waiting to be written. Begin with a single mood or memory.
                </p>
                <Link
                  to="/create"
                  className="btn-primary px-6 py-2.5 rounded-full text-xs font-bold shadow-md"
                >
                  Create Something
                </Link>
              </>
            )}
          </div>
        )}
      </div>

      {/* New Collection Modal */}
      {collectionModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-md p-6 rounded-3xl bg-[#FFF9F5] dark:bg-[#20172B] shadow-2xl border border-[#D9B8CB]/40 backdrop-blur-xl">
            <h3 className="font-serif text-2xl font-bold text-[#2B1630] dark:text-[#FDFBF7] mb-1">
              New Collection
            </h3>
            <p className="text-xs text-[#4F3354] dark:text-[#E2CFE6] mb-4">
              e.g. "Love Letters", "Midnight Thoughts", "Rain Collection"
            </p>

            <form onSubmit={handleCreateCollection} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase text-[#542F5C] dark:text-[#EBD8EE] mb-1">
                  Collection Name
                </label>
                <input
                  type="text"
                  required
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  placeholder="Midnight Thoughts"
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36]/80 border border-[#D9B8CB]/40 text-[#2B1630] dark:text-[#FDFBF7] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-[#542F5C] dark:text-[#EBD8EE] mb-1">
                  Description (optional)
                </label>
                <textarea
                  rows={2}
                  value={newCollectionDesc}
                  onChange={(e) => setNewCollectionDesc(e.target.value)}
                  placeholder="Verses composed in the quiet midnight hours..."
                  className="w-full px-3 py-2 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36]/80 border border-[#D9B8CB]/40 text-[#2B1630] dark:text-[#FDFBF7] resize-none outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-[#D9B8CB]/25">
                <button
                  type="button"
                  onClick={() => setCollectionModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#4F3354] dark:text-[#E2CFE6] hover:bg-black/5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary px-5 py-2 text-xs font-bold rounded-xl"
                >
                  Create Collection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
}
