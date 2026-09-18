import React, { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', duration = 3500) => {
    const id = `toast_${Date.now()}_${Math.random()}`;
    setToasts(prev => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (msg) => addToast(msg, 'success'),
    error: (msg) => addToast(msg, 'error', 4500),
    info: (msg) => addToast(msg, 'info')
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl shadow-lg border backdrop-blur-md transition-all duration-300 transform translate-y-0 ${
              t.type === 'success'
                ? 'bg-[#FAF7F2]/90 border-[#D4B2B9] text-[#2D283E]'
                : t.type === 'error'
                ? 'bg-[#FFF2F2]/95 border-[#E57373] text-[#782828]'
                : 'bg-[#FDFBF7]/90 border-[#E8E4F3] text-[#2D283E]'
            }`}
          >
            <div className="flex items-center gap-3">
              {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-700" />}
              {t.type === 'error' && <AlertCircle className="w-5 h-5 text-[#D32F2F]" />}
              {t.type === 'info' && <Info className="w-5 h-5 text-[#542F5C]" />}
              <span className="text-sm font-medium leading-relaxed">{t.message}</span>
            </div>
            <button
              onClick={() => removeToast(t.id)}
              className="ml-3 p-1 rounded-full hover:bg-black/5 text-[#4D3652] hover:text-[#2B1630] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
