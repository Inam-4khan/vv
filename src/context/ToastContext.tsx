import React, { createContext, useContext, useState, useCallback, useMemo, ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  isExiting?: boolean;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

const getToastStyle = (type: ToastType) => {
  switch (type) {
    case 'success':
      return {
        bg: 'bg-[#062B34] text-white border-[#2EC4B6]/60 shadow-[0_8px_25px_rgba(46,196,182,0.35)]',
        badgeBg: 'bg-[#2EC4B6]/20 text-[#80FFEC]',
        icon: <CheckCircle2 className="w-5 h-5 text-[#2EC4B6] shrink-0" />,
      };
    case 'error':
      return {
        bg: 'bg-[#1F080C] text-white border-rose-500/60 shadow-[0_8px_25px_rgba(244,63,94,0.35)]',
        badgeBg: 'bg-rose-500/20 text-rose-300',
        icon: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
      };
    case 'warning':
      return {
        bg: 'bg-[#1F1706] text-white border-amber-500/60 shadow-[0_8px_25px_rgba(245,158,11,0.35)]',
        badgeBg: 'bg-amber-500/20 text-amber-300',
        icon: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
      };
    case 'info':
    default:
      return {
        bg: 'bg-[#062B34] text-white border-[#80FFEC]/40 shadow-[0_8px_25px_rgba(6,43,52,0.5)]',
        badgeBg: 'bg-[#80FFEC]/20 text-[#80FFEC]',
        icon: <Info className="w-5 h-5 text-[#80FFEC] shrink-0" />,
      };
  }
};

interface ToastListProps {
  toasts: Toast[];
  onRemove: (id: string) => void;
}

export const ToastList: React.FC<ToastListProps> = React.memo(({ toasts, onRemove }) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[300] w-full max-w-sm px-4 pointer-events-none flex flex-col items-center gap-2">
      {toasts.map((toast) => {
        const style = getToastStyle(toast.type);

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto w-full flex items-center justify-between gap-3 px-4 py-3 rounded-2xl border backdrop-blur-md transition-all duration-200 select-none ${
              style.bg
            } ${toast.isExiting ? 'animate-toast-exit' : 'animate-toast-enter'}`}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className={`p-1.5 rounded-xl ${style.badgeBg}`}>
                {style.icon}
              </div>
              <p className="text-xs font-semibold leading-snug tracking-wide font-montserrat break-words">
                {toast.message}
              </p>
            </div>

            <button
              onClick={() => onRemove(toast.id)}
              className="p-1.5 rounded-xl hover:bg-white/10 text-white/60 hover:text-white transition-colors shrink-0"
              aria-label="Close notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
});

ToastList.displayName = 'ToastList';

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    // First mark as exiting to trigger CSS exit transition
    setToasts((prev) =>
      prev.map((t) => (t.id === id ? { ...t, isExiting: true } : t))
    );

    // After animation duration, remove from state
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 200);
  }, []);

  const showToast = useCallback(
    (message: string, type: ToastType = 'info') => {
      const id = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      const newToast: Toast = { id, message, type };

      setToasts((prev) => [...prev.slice(-4), newToast]); // Keep max 5 toasts

      // Auto dismiss after 3 seconds
      setTimeout(() => {
        removeToast(id);
      }, 3000);
    },
    [removeToast]
  );

  const contextValue = useMemo(
    () => ({ showToast, removeToast }),
    [showToast, removeToast]
  );

  const activeAnnouncements = useMemo(() => {
    return toasts
      .filter((t) => !t.isExiting)
      .map((t) => `${t.type}: ${t.message}`)
      .join('. ');
  }, [toasts]);

  const memoizedToastList = useMemo(
    () => <ToastList toasts={toasts} onRemove={removeToast} />,
    [toasts, removeToast]
  );

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Screen reader accessible announcements container */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {activeAnnouncements}
      </div>

      {memoizedToastList}
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

