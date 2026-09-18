import React from 'react';
import { Sparkles, Edit3, Globe, Wand2, Bookmark, Clock, GitCommit } from 'lucide-react';

const EVENT_ICONS = {
  created: Sparkles,
  edited: Edit3,
  remixed: Wand2,
  translated: Globe,
  saved: Bookmark,
  default: GitCommit,
};

export default function PoemJourneyTimeline({ poem, className = '' }) {
  if (!poem) return null;

  // Build journey steps from explicit poem.journey or derive from metadata
  let steps = [];
  if (Array.isArray(poem.journey) && poem.journey.length > 0) {
    steps = poem.journey;
  } else {
    // Derive fallback steps
    steps.push({
      event: 'created',
      title: 'Poem Created',
      detail: `Born from ${poem.emotion || 'raw emotion'} and ${poem.theme || 'heartfelt theme'} in ${poem.atmosphere || 'peaceful'} atmosphere`,
      timestamp: poem.createdAt || 'Original creation',
    });

    if (poem.isRemix || poem.remixCount > 0) {
      steps.push({
        event: 'remixed',
        title: 'Remixed Voice',
        detail: `Explored a new tonal variation or stylistic rhythm`,
        timestamp: poem.updatedAt || 'Remix phase',
      });
    }

    if (poem.language && poem.language !== 'en') {
      steps.push({
        event: 'translated',
        title: `Carried across languages`,
        detail: `Translated into ${poem.language.toUpperCase()}`,
        timestamp: 'Global verse',
      });
    }

    if (poem.versions && poem.versions.length > 0) {
      steps.push({
        event: 'edited',
        title: `${poem.versions.length} Version${poem.versions.length > 1 ? 's' : ''} Refined`,
        detail: 'Polished lines, title, and cadence',
        timestamp: poem.updatedAt || 'Recent edit',
      });
    } else if (poem.updatedAt && poem.updatedAt !== poem.createdAt) {
      steps.push({
        event: 'edited',
        title: 'Refined by Author',
        detail: 'Subtle edits to deepen imagery',
        timestamp: poem.updatedAt,
      });
    }

    steps.push({
      event: 'saved',
      title: 'Preserved in Library',
      detail: poem.visibility === 'public' ? 'Shared with the Poetica community' : 'Kept close in personal sanctuary',
      timestamp: poem.updatedAt || poem.createdAt || 'Treasured',
    });
  }

  const formatTime = (ts) => {
    if (!ts) return '';
    try {
      const d = new Date(ts);
      if (isNaN(d.getTime())) return ts;
      return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return ts;
    }
  };

  return (
    <div className={`p-4 rounded-2xl bg-[#FEFCF9]/95 dark:bg-[#1E1428]/95 border border-[#B491AF]/30 shadow-sm backdrop-blur-md ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Clock className="w-4 h-4 text-[#542F5C] dark:text-[#EBD8EE]" />
        <h4 className="font-serif font-bold text-sm tracking-wide text-[#231527] dark:text-[#FDFBF7]">
          Poem Journey & Evolution
        </h4>
      </div>

      <div className="relative pl-6 space-y-4 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#B491AF]/30 dark:before:bg-[#8F658A]/30">
        {steps.map((step, idx) => {
          const IconComponent = EVENT_ICONS[step.event] || EVENT_ICONS.default;
          return (
            <div key={idx} className="relative group">
              {/* Dot */}
              <div className="absolute -left-6 top-1 w-5 h-5 rounded-full bg-[#542F5C] dark:bg-[#C282BA] text-white flex items-center justify-center shadow-sm">
                <IconComponent className="w-2.5 h-2.5" />
              </div>

              <div>
                <div className="flex items-baseline justify-between gap-2">
                  <h5 className="font-serif font-bold text-xs text-[#231527] dark:text-[#FDFBF7]">
                    {step.title || step.label || step.event}
                  </h5>
                  {step.timestamp && (
                    <span className="text-[10px] font-mono text-[#523A57] dark:text-[#E2CFE6]">
                      {formatTime(step.timestamp)}
                    </span>
                  )}
                </div>
                {step.detail && (
                  <p className="text-xs text-[#523A57] dark:text-[#E2CFE6] mt-0.5 leading-relaxed">
                    {step.detail}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
