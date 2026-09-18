import React, { useRef } from 'react';
import { X, Printer, Download, Share2, Copy, Check, Feather } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export default function PrintablePoemModal({ isOpen, onClose, poem }) {
  const toast = useToast();
  const printRef = useRef(null);

  if (!isOpen || !poem) return null;

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadTxt = () => {
    const text = `${poem.title.toUpperCase()}\nby ${poem.authorName || 'Anonymous'}\n\n${poem.content}\n\nLanguage: ${poem.language} | Theme: ${poem.theme} | Mood: ${poem.mood}\nCreated via POETICA — Turn feelings into words.\n`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${poem.title.toLowerCase().replace(/[^a-z0-9]/g, '_')}_poetica.txt`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Poem downloaded as text file');
  };

  const handleShare = async () => {
    const shareData = {
      title: `${poem.title} — POETICA`,
      text: `"${poem.title}"\n\n${poem.content.slice(0, 140)}...\n\nRead more on POETICA`,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        toast.success('Poem shared');
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`);
      toast.success('Poem excerpt and link copied to clipboard');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl p-6 sm:p-8 rounded-3xl bg-[#FFF9F5]/95 dark:bg-[#20172B]/95 shadow-2xl border border-[#D9B8CB]/50 backdrop-blur-xl max-h-[95vh] flex flex-col">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#542F5C] dark:text-[#EBD8EE] hover:bg-[#542F5C]/10 transition-colors no-print"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4 no-print">
          <div className="w-10 h-10 rounded-2xl bg-[#542F5C] flex items-center justify-center text-white shadow-sm">
            <Feather className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-2xl font-bold text-[#2B1630] dark:text-[#FDFBF7]">
              Poetic Keepsake
            </h3>
            <p className="text-xs font-medium text-[#542F5C] dark:text-[#D9B8CB]">
              Print, frame, download, or share this verse
            </p>
          </div>
        </div>

        {/* Printable Card Area */}
        <div
          ref={printRef}
          className="printable-poem-container flex-1 overflow-y-auto p-8 my-3 rounded-2xl bg-white dark:bg-[#2A1D36] border border-[#D9B8CB]/60 shadow-xs flex flex-col items-center justify-center text-center"
        >
          <div className="w-8 h-8 mb-4 rounded-full border border-[#D9B8CB] flex items-center justify-center text-[#542F5C] dark:text-[#EBD8EE]">
            <Feather className="w-4 h-4" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#2B1630] dark:text-[#FDFBF7] mb-2">
            {poem.title}
          </h2>

          <div className="flex items-center gap-2 text-[11px] uppercase tracking-widest font-semibold text-[#542F5C] dark:text-[#D9B8CB] mb-6">
            <span>{poem.language}</span>
            <span>•</span>
            <span>{poem.theme}</span>
            <span>•</span>
            <span>{poem.mood}</span>
          </div>

          <div className="font-serif text-base sm:text-lg leading-loose text-[#2B1630] dark:text-[#FDFBF7] whitespace-pre-line italic max-w-md">
            {poem.content}
          </div>

          <div className="mt-8 pt-4 border-t border-[#D9B8CB]/30 text-[10px] text-[#542F5C] dark:text-[#D9B8CB] tracking-wider uppercase font-serif">
            POETICA STUDIO • {new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#D9B8CB]/25 no-print">
          <button
            onClick={handleDownloadTxt}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#D9B8CB]/50 bg-white/60 dark:bg-white/5 hover:bg-black/5 text-[#4F3354] dark:text-[#E2CFE6]"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download .txt</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border border-[#D9B8CB]/50 bg-white/60 dark:bg-white/5 hover:bg-black/5 text-[#4F3354] dark:text-[#E2CFE6]"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share</span>
            </button>
            <button
              onClick={handlePrint}
              className="btn-primary flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold shadow-md"
            >
              <Printer className="w-4 h-4" />
              <span>Print Keepsake</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
