import React, { useState, useEffect } from 'react';
import { Download, X, Ghost } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const InstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // 1. Track visit count in localStorage
    const storedVisits = parseInt(localStorage.getItem('vizu_visit_count') || '0', 10);
    const newVisitCount = storedVisits + 1;
    localStorage.setItem('vizu_visit_count', newVisitCount.toString());

    // 2. Check if user dismissed prompt in session
    const dismissedSession = sessionStorage.getItem('vizu_install_dismissed');
    if (dismissedSession) {
      setIsDismissed(true);
    }

    // 3. Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(promptEvent);

      // Only show banner after user has visited 3 times or more
      if (newVisitCount >= 3 && !dismissedSession) {
        setIsVisible(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if already running as standalone application
    const isStandalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as unknown as { standalone?: boolean }).standalone;
    if (isStandalone) {
      setIsVisible(false);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choiceResult = await deferredPrompt.userChoice;
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the Vizu install prompt');
    }
    setDeferredPrompt(null);
    setIsVisible(false);
  };

  const handleDismiss = () => {
    setIsVisible(false);
    setIsDismissed(true);
    sessionStorage.setItem('vizu_install_dismissed', 'true');
  };

  if (!isVisible || isDismissed || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:max-w-md z-50 animate-fade-in">
      <div className="bg-[color-mix(in_srgb,var(--app-bg-ghost)_95%,transparent)] border border-[color-mix(in_srgb,var(--app-accent)_40%,transparent)] rounded-3xl p-4 shadow-2xl backdrop-blur-xl flex items-center gap-3 text-slate-900 dark:text-[#F1FAEE]">
        <div className="w-12 h-12 rounded-2xl bg-[color-mix(in_srgb,var(--app-accent)_20%,transparent)] border border-[color-mix(in_srgb,var(--app-accent)_40%,transparent)] flex items-center justify-center shrink-0">
          <Ghost size={24} className="text-[var(--app-accent-light)]" />
        </div>

        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-black uppercase tracking-wider text-[var(--app-accent-light)]">
            Install Vizu
          </h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
            Add to home screen for fast proximity alerts.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleInstallClick}
            className="px-3.5 py-2 rounded-xl bg-[var(--app-accent)] hover:bg-[var(--app-accent-light)] text-slate-900 dark:text-[#F1FAEE] font-black text-xs uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md active:scale-95 cursor-pointer"
          >
            <Download size={14} />
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="p-1.5 rounded-xl hover:bg-white/10 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-[#F1FAEE] transition-colors cursor-pointer"
            aria-label="Close install prompt"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default InstallPrompt;
