import React, { useState } from 'react';
import { X, AlertTriangle, Check } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

export default function ReportModal({ isOpen, onClose, poemId }) {
  const toast = useToast();
  const [reason, setReason] = useState('Inappropriate content');
  const [customNotes, setCustomNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    try {
      await api.reportPoem(poemId, `${reason}: ${customNotes}`);
      setSubmitted(true);
      toast.success('Report received. Thank you for preserving literary safety.');
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1500);
    } catch (e) {
      toast.error('Failed to submit report.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-6 rounded-3xl bg-[#FFF9F5]/95 dark:bg-[#20172B]/95 shadow-2xl border border-[#D9B8CB]/50 backdrop-blur-xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#542F5C] dark:text-[#EBD8EE] hover:bg-[#542F5C]/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-red-100 dark:bg-red-950/40 flex items-center justify-center text-red-600 dark:text-red-400">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-xl font-bold text-[#2B1630] dark:text-[#FDFBF7]">
              Report Poem
            </h3>
            <p className="text-xs font-medium text-[#542F5C] dark:text-[#D9B8CB]">
              Help maintain a welcoming literary sanctuary
            </p>
          </div>
        </div>

        {submitted ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <Check className="w-10 h-10 text-emerald-600 mb-2" />
            <p className="text-sm font-bold text-[#2B1630] dark:text-[#FDFBF7]">Thank you for your report.</p>
          </div>
        ) : (
          <div className="space-y-4 my-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1.5">
                Reason:
              </label>
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full p-2.5 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36] border border-[#D9B8CB]/40 text-[#2B1630] dark:text-[#FDFBF7] outline-none"
              >
                <option value="Inappropriate or offensive content">Inappropriate or offensive content</option>
                <option value="Hate speech or harassment">Hate speech or harassment</option>
                <option value="Spam or advertising">Spam or advertising</option>
                <option value="Copyright violation">Copyright violation</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#542F5C] dark:text-[#EBD8EE] mb-1.5">
                Additional Details (optional):
              </label>
              <textarea
                rows={3}
                value={customNotes}
                onChange={(e) => setCustomNotes(e.target.value)}
                placeholder="Explain why this content feels out of place..."
                className="w-full p-2.5 rounded-xl text-xs bg-white/80 dark:bg-[#2A1D36] border border-[#D9B8CB]/40 text-[#2B1630] dark:text-[#FDFBF7] placeholder-[#7E5E85] dark:placeholder-[#B491AF] outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-[#D9B8CB]/25">
              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-[#4F3354] dark:text-[#E2CFE6] hover:bg-black/5 rounded-xl"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-5 py-2 text-xs bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-xs"
              >
                Submit Report
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
