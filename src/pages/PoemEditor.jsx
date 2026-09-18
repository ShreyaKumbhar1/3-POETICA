import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import {
  Undo2, Redo2, Save, Sparkles, Feather, ArrowLeft,
  History, Type, Edit3, AlertCircle, RotateCcw
} from 'lucide-react';
import Layout from '../components/Layout';
import WritingTimer from '../components/WritingTimer';
import TitleLabModal from '../components/Modals/TitleLabModal';
import LineLabModal from '../components/Modals/LineLabModal';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { api } from '../services/api';

export default function PoemEditor() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();
  const { user, token } = useAuth();
  const toast = useToast();

  const [initialPoem, setInitialPoem] = useState(location.state?.poem || null);
  const [title, setTitle] = useState(location.state?.poem?.title || 'Untitled Verse');
  const [content, setContent] = useState(location.state?.poem?.content || '');
  const [language, setLanguage] = useState(location.state?.poem?.language || 'English');
  const [theme, setTheme] = useState(location.state?.poem?.theme || 'Memories');
  const [mood, setMood] = useState(location.state?.poem?.mood || 'Reflective');
  const [versions, setVersions] = useState(location.state?.poem?.versions || []);

  // Undo / Redo history stack
  const [history, setHistory] = useState([{ title, content }]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Modals & Panels
  const [isTitleLabOpen, setIsTitleLabOpen] = useState(false);
  const [isLineLabOpen, setIsLineLabOpen] = useState(false);
  const [activeLineForLab, setActiveLineForLab] = useState('');
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const [selectedPreviewVersion, setSelectedPreviewVersion] = useState(null);

  // Draft auto-save alert
  const [draftDetected, setDraftDetected] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // AI Assistant Toolbelt
  const [selectedText, setSelectedText] = useState('');
  const [assistModalOpen, setAssistModalOpen] = useState(false);
  const [assistAction, setAssistAction] = useState('improve_line');
  const [assistResult, setAssistResult] = useState(null);
  const [isAssisting, setIsAssisting] = useState(false);

  const textareaRef = useRef(null);

  // Load poem if id is given and state is empty
  useEffect(() => {
    async function loadPoemById() {
      if (id && !initialPoem) {
        try {
          const fetched = await api.getPoem(id, token);
          setInitialPoem(fetched);
          setTitle(fetched.title || 'Untitled Verse');
          setContent(fetched.content || '');
          setLanguage(fetched.language || 'English');
          setTheme(fetched.theme || 'Memories');
          setMood(fetched.mood || 'Reflective');
          setVersions(fetched.versions || []);
          setHistory([{ title: fetched.title, content: fetched.content }]);
        } catch (e) {
          toast.error('Could not load poem');
        }
      }
    }
    loadPoemById();
  }, [id]);

  // Check for auto-saved draft on mount
  useEffect(() => {
    const savedDraft = localStorage.getItem('poetica_autosave_draft');
    if (savedDraft && !initialPoem && !id) {
      try {
        const parsed = JSON.parse(savedDraft);
        if (parsed.content && parsed.content !== content) {
          setDraftDetected(true);
        }
      } catch (e) {}
    }
  }, []);

  // Auto-save draft locally
  useEffect(() => {
    if (content.trim()) {
      const draft = { title, content, language, theme, mood, updatedAt: new Date().toISOString() };
      localStorage.setItem('poetica_autosave_draft', JSON.stringify(draft));
      localStorage.setItem('poetica_recent_draft', JSON.stringify(draft));
    }
  }, [title, content, language, theme, mood]);

  // Handle Undo / Redo
  const updateContentWithHistory = (newContent, newTitle = title) => {
    const nextHistory = history.slice(0, historyIndex + 1);
    nextHistory.push({ title: newTitle, content: newContent });
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setContent(newContent);
    setTitle(newTitle);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const prev = history[historyIndex - 1];
      setHistoryIndex(historyIndex - 1);
      setTitle(prev.title);
      setContent(prev.content);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const next = history[historyIndex + 1];
      setHistoryIndex(historyIndex + 1);
      setTitle(next.title);
      setContent(next.content);
    }
  };

  const restoreDraft = () => {
    try {
      const savedDraft = localStorage.getItem('poetica_autosave_draft');
      if (savedDraft) {
        const parsed = JSON.parse(savedDraft);
        setTitle(parsed.title || 'Untitled Verse');
        setContent(parsed.content || '');
        setDraftDetected(false);
        toast.success('Restored previous draft');
      }
    } catch (e) {}
  };

  const discardDraft = () => {
    localStorage.removeItem('poetica_autosave_draft');
    setDraftDetected(false);
  };

  // Metrics
  const lineCount = content ? content.split('\n').length : 0;
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0;
  const charCount = content.length;

  // Handle Save
  const handleSave = async () => {
    if (!content.trim()) {
      toast.error('Poem cannot be empty');
      return;
    }
    if (!token) {
      toast.info('Please sign in to save poems to your sanctuary');
      return;
    }

    setIsSaving(true);
    try {
      const targetId = id || initialPoem?.id;
      if (targetId && user && (initialPoem?.userId === user.id || !initialPoem?.userId)) {
        const updated = await api.updatePoem(targetId, { title, content, language, theme, mood }, token);
        if (updated.versions) setVersions(updated.versions);
        toast.success('Poem updated and revision archived');
      } else {
        const saved = await api.savePoem({
          title,
          content,
          language,
          theme,
          mood,
          style: initialPoem?.style || 'Free Verse',
          atmosphere: initialPoem?.atmosphere || 'minimal'
        }, token);
        toast.success('Poem saved to sanctuary');
      }
      localStorage.removeItem('poetica_autosave_draft');
    } catch (e) {
      toast.error('Failed to save poem');
    } finally {
      setIsSaving(false);
    }
  };

  // Restore a prior version from version history
  const handleRestoreVersion = (versionItem) => {
    if (window.confirm(`Restore revision from ${new Date(versionItem.timestamp || Date.now()).toLocaleTimeString()}? Current text will be archived in history.`)) {
      // Archive current version to versions
      setVersions((prev) => [
        ...prev,
        {
          title,
          content,
          timestamp: new Date().toISOString(),
          reason: 'Auto-archived before restore'
        }
      ]);
      updateContentWithHistory(versionItem.content, versionItem.title || title);
      setSelectedPreviewVersion(null);
      toast.success('Version restored to editor');
    }
  };

  // Trigger AI assistant
  const handleRunAssist = async (action) => {
    const textToAnalyze = selectedText.trim() || content.split('\n')[0] || '';
    setAssistAction(action);
    setAssistModalOpen(true);
    setIsAssisting(true);

    try {
      const result = await api.assistPoem(action, textToAnalyze, content);
      setAssistResult(result);
    } catch (e) {
      toast.error('AI assistant failed');
    } finally {
      setIsAssisting(false);
    }
  };

  const handleApplySuggestion = (text) => {
    if (assistAction === 'continue_poem') {
      updateContentWithHistory(`${content}\n\n${text}`);
    } else if (selectedText) {
      updateContentWithHistory(content.replace(selectedText, text));
    } else {
      updateContentWithHistory(`${content}\n${text}`);
    }
    setAssistModalOpen(false);
    toast.success('Suggestion woven into verse');
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Unfinished Draft Banner */}
        {draftDetected && (
          <div className="mb-6 p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-800 text-xs flex items-center justify-between shadow-sm animate-fadeIn">
            <div className="flex items-center gap-2 text-[#422915] dark:text-amber-200 font-medium">
              <AlertCircle className="w-4 h-4 text-amber-600" />
              <span>You have an unfinished poem from your previous writing session.</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={restoreDraft}
                className="px-3 py-1 bg-[#542F5C] text-white rounded-lg hover:bg-[#683972] font-bold"
              >
                Restore
              </button>
              <button
                onClick={discardDraft}
                className="px-3 py-1 bg-white/80 dark:bg-white/10 text-[#422915] dark:text-amber-200 rounded-lg hover:bg-white border border-amber-200"
              >
                Discard
              </button>
            </div>
          </div>
        )}

        {/* Writing Timer Integration */}
        <div className="mb-6">
          <WritingTimer
            onSaveDraft={handleSave}
            onGenerateFromDraft={() => navigate(`/create?seed=${encodeURIComponent(content)}`)}
            onContinueWriting={() => {
              if (textareaRef.current) textareaRef.current.focus();
            }}
          />
        </div>

        {/* Top Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-[#D9B8CB]/25">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 rounded-full bg-white/80 dark:bg-white/10 hover:bg-[#542F5C]/10 text-[#2B1630] dark:text-[#FDFBF7] border border-[#D9B8CB]/35"
              aria-label="Go back"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <h1 className="font-serif text-2xl font-bold text-[#2B1630] dark:text-[#FDFBF7]">
                Poetry Studio Editor
              </h1>
              <p className="text-[11px] font-medium text-[#4F3354] dark:text-[#E2CFE6]">
                Fine-tune every cadence, rhythm, and stanza
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Version History Toggle */}
            <button
              onClick={() => setShowVersionHistory(!showVersionHistory)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                showVersionHistory
                  ? 'btn-primary shadow-xs'
                  : 'bg-white/80 dark:bg-white/10 border-[#D9B8CB]/35 text-[#2B1630] dark:text-[#FDFBF7] hover:bg-[#542F5C]/10'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>Versions ({versions.length})</span>
            </button>

            {/* Title Lab */}
            <button
              onClick={() => setIsTitleLabOpen(true)}
              className="btn-secondary inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold"
            >
              <Type className="w-3.5 h-3.5" />
              <span>Title Lab</span>
            </button>

            {/* Line Lab */}
            <button
              onClick={() => {
                const target = selectedText.trim() || content.split('\n')[0] || '';
                setActiveLineForLab(target);
                setIsLineLabOpen(true);
              }}
              className="btn-secondary inline-flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Line Lab</span>
            </button>

            {/* Undo / Redo */}
            <div className="flex items-center bg-white/80 dark:bg-white/10 rounded-xl p-1 border border-[#D9B8CB]/35">
              <button
                onClick={handleUndo}
                disabled={historyIndex === 0}
                title="Undo"
                className="p-1.5 rounded-lg text-[#2B1630] dark:text-[#FDFBF7] disabled:opacity-30 hover:bg-[#542F5C]/10"
              >
                <Undo2 className="w-4 h-4" />
              </button>
              <button
                onClick={handleRedo}
                disabled={historyIndex === history.length - 1}
                title="Redo"
                className="p-1.5 rounded-lg text-[#2B1630] dark:text-[#FDFBF7] disabled:opacity-30 hover:bg-[#542F5C]/10"
              >
                <Redo2 className="w-4 h-4" />
              </button>
            </div>

            {/* Save Button */}
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'Saving...' : 'Save Verse'}</span>
            </button>
          </div>
        </div>

        {/* Version History Drawer (if opened) */}
        {showVersionHistory && (
          <div className="hero-glass-surface mb-6 p-5 border border-[#D9B8CB]/40 shadow-lg animate-fadeIn backdrop-blur-xl">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-[#854479] dark:text-[#EBD8EE]" />
                <h3 className="font-serif font-bold text-sm text-[#2B1630] dark:text-[#FDFBF7]">
                  Poem Revision History
                </h3>
              </div>
              <span className="text-xs text-[#4F3354] dark:text-[#E2CFE6]">
                Click a revision to preview or restore
              </span>
            </div>

            {versions.length === 0 ? (
              <p className="text-xs font-serif italic text-[#4F3354] dark:text-[#E2CFE6] py-3 text-center">
                No past revisions yet. Every save or Line Lab refinement automatically captures a version checkpoint.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-56 overflow-y-auto pr-1">
                {versions.map((v, i) => (
                  <div
                    key={i}
                    onClick={() => setSelectedPreviewVersion(v)}
                    className="p-3 rounded-xl border border-[#D9B8CB]/35 bg-white/75 dark:bg-white/10 hover:border-[#854479] cursor-pointer transition-all text-xs shadow-xs"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-[#2B1630] dark:text-[#FDFBF7]">
                        Revision #{i + 1}: "{v.title || 'Untitled'}"
                      </span>
                      <span className="text-[10px] text-[#4F3354] dark:text-[#E2CFE6]">
                        {v.timestamp ? new Date(v.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Saved'}
                      </span>
                    </div>
                    <p className="font-serif italic text-[#3A2440] dark:text-[#E2CFE6] line-clamp-2">
                      {v.content}
                    </p>
                    <div className="mt-2 flex items-center justify-end gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRestoreVersion(v);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-[#542F5C] dark:text-[#EBD8EE] hover:underline"
                      >
                        <RotateCcw className="w-3 h-3" />
                        Restore this version
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI Assistant Toolbelt */}
        <div className="flex flex-wrap items-center gap-1.5 p-2.5 rounded-2xl bg-[#FFF9F5]/85 dark:bg-[#20172B]/85 border border-[#D9B8CB]/35 mb-6 text-xs backdrop-blur-md shadow-sm">
          <span className="text-[10px] uppercase font-bold text-[#542F5C] dark:text-[#EBD8EE] px-2 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Poetic Doctor:
          </span>
          <button
            onClick={() => handleRunAssist('improve_line')}
            className="px-3 py-1.5 rounded-xl font-semibold bg-white/75 dark:bg-white/10 border border-[#D9B8CB]/35 text-[#2B1630] dark:text-[#FDFBF7] hover:bg-[#542F5C]/10"
          >
            Improve line
          </button>
          <button
            onClick={() => handleRunAssist('find_better_word')}
            className="px-3 py-1.5 rounded-xl font-semibold bg-white/75 dark:bg-white/10 border border-[#D9B8CB]/35 text-[#2B1630] dark:text-[#FDFBF7] hover:bg-[#542F5C]/10"
          >
            Find a better word
          </button>
          <button
            onClick={() => handleRunAssist('make_more_poetic')}
            className="px-3 py-1.5 rounded-xl font-semibold bg-white/75 dark:bg-white/10 border border-[#D9B8CB]/35 text-[#2B1630] dark:text-[#FDFBF7] hover:bg-[#542F5C]/10"
          >
            Make more poetic
          </button>
          <button
            onClick={() => handleRunAssist('continue_poem')}
            className="px-3 py-1.5 rounded-xl font-semibold bg-white/75 dark:bg-white/10 border border-[#D9B8CB]/35 text-[#2B1630] dark:text-[#FDFBF7] hover:bg-[#542F5C]/10"
          >
            Continue poem
          </button>
          <button
            onClick={() => handleRunAssist('rewrite_stanza')}
            className="px-3 py-1.5 rounded-xl font-semibold bg-white/75 dark:bg-white/10 border border-[#D9B8CB]/35 text-[#2B1630] dark:text-[#FDFBF7] hover:bg-[#542F5C]/10"
          >
            Rewrite stanza
          </button>
        </div>

        {/* Writing Surface */}
        <div className="hero-glass-surface p-8 sm:p-12 border border-[#D9B8CB]/40 shadow-xl space-y-6 backdrop-blur-xl">
          {/* Title Editor */}
          <input
            type="text"
            value={title}
            onChange={(e) => updateContentWithHistory(content, e.target.value)}
            placeholder="Poem Title..."
            className="w-full font-serif text-2xl sm:text-4xl font-black text-center bg-transparent border-b border-transparent focus:border-[#542F5C] pb-2 outline-none text-[#2B1630] dark:text-[#FDFBF7] placeholder-[#725278]"
          />

          {/* Poem Body Editor */}
          <textarea
            ref={textareaRef}
            rows={14}
            value={content}
            onChange={(e) => updateContentWithHistory(e.target.value, title)}
            onSelect={() => {
              if (textareaRef.current) {
                const start = textareaRef.current.selectionStart;
                const end = textareaRef.current.selectionEnd;
                setSelectedText(content.substring(start, end));
              }
            }}
            placeholder="Write your verses here..."
            className="w-full font-serif text-lg sm:text-xl italic text-center leading-loose bg-transparent border-none focus:outline-none text-[#2B1630] dark:text-[#FDFBF7] placeholder-[#725278] resize-none max-w-2xl mx-auto block"
          />

          {/* Live Metrics Footnote */}
          <div className="pt-4 border-t border-[#D9B8CB]/25 flex items-center justify-between text-xs font-semibold text-[#4F3354] dark:text-[#E2CFE6]">
            <div className="flex items-center gap-4">
              <span>{wordCount} words</span>
              <span>•</span>
              <span>{lineCount} lines</span>
              <span>•</span>
              <span>{charCount} characters</span>
            </div>
            <span className="text-[11px] italic font-medium">Auto-saving locally</span>
          </div>
        </div>

        {/* AI Assistant Popover Modal */}
        {assistModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md p-6 rounded-3xl bg-[#FFF9F5] dark:bg-[#20172B] shadow-2xl border border-[#D9B8CB]/40 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#D9B8CB]/25">
                <span className="text-xs font-bold uppercase text-[#542F5C] dark:text-[#EBD8EE] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Poetic Suggestion
                </span>
                <button
                  onClick={() => setAssistModalOpen(false)}
                  className="text-[#4D3652] dark:text-[#E2CFE6] hover:underline text-xs font-semibold"
                >
                  Close
                </button>
              </div>

              {isAssisting ? (
                <div className="py-8 text-center text-xs font-serif italic text-[#542F5C] dark:text-[#EBD8EE]">
                  Consulting literary muses...
                </div>
              ) : assistResult ? (
                <div className="space-y-3">
                  {assistResult.suggestions && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-[#4D3652] dark:text-[#E2CFE6] mb-1">Alternative phrasings:</p>
                      {assistResult.suggestions.map((s, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleApplySuggestion(s)}
                          className="w-full p-2.5 rounded-xl border border-[#B491AF]/30 hover:bg-[#542F5C]/10 text-left text-xs font-serif italic text-[#231527] dark:text-[#FDFBF7]"
                        >
                          "{s}"
                        </button>
                      ))}
                    </div>
                  )}

                  {assistResult.alternatives && (
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-[#4D3652] dark:text-[#E2CFE6] mb-1">Nuanced vocabulary:</p>
                      {assistResult.alternatives.map((alt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleApplySuggestion(alt.word)}
                          className="w-full p-2.5 rounded-xl border border-[#B491AF]/30 hover:bg-[#542F5C]/10 text-left text-xs flex justify-between items-center"
                        >
                          <span className="font-serif font-bold text-sm text-[#231527] dark:text-[#FDFBF7]">{alt.word}</span>
                          <span className="text-[10px] text-[#4D3652] dark:text-[#E2CFE6]">{alt.nuance}</span>
                        </button>
                      ))}
                    </div>
                  )}

                  {assistResult.refined && (
                    <div>
                      <p className="text-xs font-semibold text-[#4D3652] dark:text-[#E2CFE6] mb-1">Poetic refinement:</p>
                      <button
                        onClick={() => handleApplySuggestion(assistResult.refined)}
                        className="w-full p-3 rounded-xl border border-[#B491AF]/30 hover:bg-[#542F5C]/10 text-left text-xs font-serif italic text-[#231527] dark:text-[#FDFBF7] whitespace-pre-line"
                      >
                        "{assistResult.refined}"
                      </button>
                    </div>
                  )}

                  {assistResult.continuation && (
                    <div>
                      <p className="text-xs font-semibold text-[#4D3652] dark:text-[#E2CFE6] mb-1">Suggested continuation:</p>
                      <button
                        onClick={() => handleApplySuggestion(assistResult.continuation)}
                        className="w-full p-3 rounded-xl border border-[#B491AF]/30 hover:bg-[#542F5C]/10 text-left text-xs font-serif italic text-[#231527] dark:text-[#FDFBF7] whitespace-pre-line"
                      >
                        "{assistResult.continuation}"
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>

      {/* Title Lab Modal */}
      <TitleLabModal
        isOpen={isTitleLabOpen}
        onClose={() => setIsTitleLabOpen(false)}
        poem={{ title, content, language, theme, mood }}
        onApplyTitle={(newTitle) => {
          updateContentWithHistory(content, newTitle);
          setIsTitleLabOpen(false);
        }}
      />

      {/* Line Lab Modal */}
      <LineLabModal
        isOpen={isLineLabOpen}
        onClose={() => setIsLineLabOpen(false)}
        poem={{ title, content, language, theme, mood }}
        initialLine={activeLineForLab}
        onApplyLine={(oldLine, newLine) => {
          updateContentWithHistory(content.replace(oldLine, newLine), title);
          setIsLineLabOpen(false);
        }}
      />
    </Layout>
  );
}
