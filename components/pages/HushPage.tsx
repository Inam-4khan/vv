
import React, { useState, useEffect, useRef } from 'react';
import { Search, Plus, Music, X, Send, EyeOff, Mic, Camera, Video, ArrowLeft, Clock, Eye, Play, Pause, SkipForward, Zap, Lock, ShieldAlert, Headphones, ShieldCheck, Flame, Archive, Ghost, Sparkles, Check, ChevronDown, Circle, RefreshCw, Trash2, RotateCcw, MapPin } from 'lucide-react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { MOCK_USERS, MOCK_HUSH_NOTES } from '../../constants';
import { User, Message, HushNote } from '../../types';

interface HushPageProps {
  isGhostMode: boolean;
  onCameraOpen: () => void;
  notes: HushNote[];
  onAddNote: (note: HushNote) => void;
}

// Proximity & Creation time background visual style variations
const getNoteStyleVariants = (note: HushNote, index: number, isGhostMode: boolean) => {
  let ageMinutes = 2;
  let distanceKm = 0.2;

  if (note.id === 'n1') { ageMinutes = 1; distanceKm = 0.1; }
  else if (note.id === 'n2') { ageMinutes = 8; distanceKm = 0.6; }
  else if (note.id === 'n3') { ageMinutes = 24; distanceKm = 2.1; }
  else if (note.expiresAt) {
    const elapsedSecs = Math.max(0, Math.floor((Date.now() - (note.expiresAt - (note.selfDestructDuration || 1800) * 1000)) / 1000));
    ageMinutes = Math.floor(elapsedSecs / 60);
    distanceKm = Number((0.2 + (index % 5) * 0.4).toFixed(1));
  }

  const isFreshNear = ageMinutes <= 5 || distanceKm <= 0.3;
  const isMidRange = (ageMinutes > 5 && ageMinutes <= 15) || (distanceKm > 0.3 && distanceKm <= 1.2);

  if (isFreshNear) {
    return {
      tierLabel: 'Fresh • Near',
      bubbleBg: isGhostMode 
        ? 'bg-gradient-to-br from-[#0C3B46] via-[#062B34] to-[#0C3B46] border-[#80FFEC]/50 text-white shadow-lg shadow-[#2EC4B6]/20 ring-1 ring-[#80FFEC]/40' 
        : 'bg-gradient-to-br from-amber-100 via-rose-50 to-orange-100 border-amber-300/70 text-primary shadow-lg shadow-amber-500/10 ring-1 ring-amber-300/40',
      badgeBg: isGhostMode ? 'bg-[#2EC4B6]/30 text-[#80FFEC]' : 'bg-amber-500/20 text-amber-900',
      tagIconColor: isGhostMode ? 'text-[#80FFEC]' : 'text-amber-600',
      proximityStr: `${distanceKm}km • Just now`
    };
  } else if (isMidRange) {
    return {
      tierLabel: 'Mid Range',
      bubbleBg: isGhostMode 
        ? 'bg-gradient-to-br from-[#062B34] via-[#03171C] to-[#0C3B46] border-[#2EC4B6]/30 text-[#F1FAEE] shadow-md shadow-[#062B34]/40' 
        : 'bg-gradient-to-br from-indigo-50/90 via-sky-50 to-white border-indigo-200/60 text-primary shadow-md shadow-indigo-500/5',
      badgeBg: isGhostMode ? 'bg-[#062B34] text-[#80FFEC]' : 'bg-indigo-500/10 text-indigo-800',
      tagIconColor: isGhostMode ? 'text-[#2EC4B6]' : 'text-indigo-500',
      proximityStr: `${distanceKm}km • ${ageMinutes}m ago`
    };
  } else {
    return {
      tierLabel: 'Distant',
      bubbleBg: isGhostMode 
        ? 'bg-gradient-to-br from-[#03171C] via-[#062B34] to-[#03171C] border-[#2EC4B6]/20 text-[#8AADB5] shadow-inner' 
        : 'bg-gradient-to-br from-slate-100/90 via-gray-50 to-slate-100/80 border-slate-200/80 text-primary/70 shadow-sm',
      badgeBg: isGhostMode ? 'bg-[#03171C] text-[#8AADB5]' : 'bg-slate-200/60 text-slate-600',
      tagIconColor: isGhostMode ? 'text-[#8AADB5]' : 'text-slate-400',
      proximityStr: `${distanceKm}km • ${ageMinutes}m ago`
    };
  }
};

interface SwipeableHushNoteItemProps {
  note: HushNote;
  index: number;
  isGhostMode: boolean;
  onDismiss: (id: string) => void;
  onQuickReply: (note: HushNote) => void;
}

const SwipeableHushNoteItem: React.FC<SwipeableHushNoteItemProps> = ({
  note,
  index,
  isGhostMode,
  onDismiss,
  onQuickReply,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isDismissing, setIsDismissing] = useState(false);

  const styleVariant = getNoteStyleVariants(note, index, isGhostMode);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 15 }}
      animate={{ 
        opacity: isDismissing ? 0 : 1, 
        scale: isDismissing ? 0.5 : 1, 
        y: isDismissing ? -40 : 0 
      }}
      exit={{ opacity: 0, scale: 0.5, y: -40 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="flex flex-col items-center gap-2 shrink-0 relative"
    >
      {/* Swipe Trash Hint Indicator */}
      {isDragging && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -top-7 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full bg-red-500 text-white text-[8px] font-black uppercase tracking-widest shadow-md flex items-center gap-1 z-30 animate-pulse pointer-events-none"
        >
          <Trash2 size={9} />
          <span>Swipe to Clear</span>
        </motion.div>
      )}

      {/* Main Draggable Motion Container */}
      <motion.div
        drag
        dragConstraints={{ left: -60, right: 60, top: -80, bottom: 80 }}
        dragElastic={0.6}
        dragSnapToOrigin
        onDragStart={() => setIsDragging(true)}
        onDragEnd={(_, info) => {
          setIsDragging(false);
          const isFarVertical = Math.abs(info.offset.y) > 45 || Math.abs(info.velocity.y) > 280;
          const isFarHorizontal = Math.abs(info.offset.x) > 55 || Math.abs(info.velocity.x) > 300;

          if (isFarVertical || isFarHorizontal) {
            setIsDismissing(true);
            if (navigator.vibrate) navigator.vibrate([15, 30]);
            setTimeout(() => {
              onDismiss(note.id);
            }, 200);
          }
        }}
        whileTap={{ scale: 1.05 }}
        className="relative cursor-grab active:cursor-grabbing select-none touch-none"
        onClick={() => {
          if (!isDragging && !(note as any).isOfflineQueued) {
            onQuickReply(note);
          }
        }}
      >
        {/* Avatar Ring */}
        <div className={`w-16 h-16 rounded-3xl border-2 shadow-md overflow-hidden relative ${
          isGhostMode ? 'border-[#2EC4B6]/30 bg-[#062B34]' : 'border-white bg-white'
        }`}>
          <img
            src={note.avatar}
            loading="lazy"
            className={`w-full h-full object-cover ${isGhostMode ? 'opacity-80 grayscale brightness-110' : ''} ${
              (note as any).isOfflineQueued ? 'opacity-60 blur-[0.5px]' : ''
            }`}
            alt=""
          />
        </div>

        {(note as any).isOfflineQueued && (
          <div className="absolute -bottom-1 -right-1.5 flex items-center gap-0.5 bg-amber-500 text-white text-[8px] px-1.5 py-0.5 rounded-full font-black uppercase tracking-tight shadow-lg z-20 animate-pulse">
            <RefreshCw size={8} className="animate-spin" />
            <span>Queued</span>
          </div>
        )}

        {/* Speech Bubble with Dynamic Proximity/Age Gradient Background Styling */}
        <div
          className={`absolute -top-3 -left-2 px-3 py-2 rounded-2xl shadow-xl border max-w-[145px] pointer-events-none transition-all ${
            (note as any).isOfflineQueued
              ? 'bg-amber-500/10 text-amber-900 border-amber-500/20 shadow-amber-500/5'
              : styleVariant.bubbleBg
          }`}
        >
          {/* Proximity / Freshness Tag */}
          <div className="flex items-center justify-between gap-1 mb-0.5">
            <span className={`text-[7px] font-mono font-bold uppercase tracking-tighter flex items-center gap-0.5 ${styleVariant.tagIconColor}`}>
              <MapPin size={7} />
              <span>{styleVariant.proximityStr}</span>
            </span>
          </div>

          <p className="text-[10px] font-medium leading-tight line-clamp-2">
            {note.text}
          </p>

          {note.music && (
            <div className="flex items-center gap-1 mt-1 opacity-70">
              <Music size={8} className="text-secondary" />
              <span className="text-[7px] font-black uppercase truncate">{note.music.title}</span>
            </div>
          )}
        </div>

        {/* Quick Manual Dismiss Button for Mouse/Hover Accessibility */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (navigator.vibrate) navigator.vibrate(15);
            setIsDismissing(true);
            setTimeout(() => onDismiss(note.id), 200);
          }}
          className={`absolute -top-2 -right-2 p-1 rounded-full border shadow-md transition-all active:scale-75 ${
            isGhostMode 
              ? 'bg-purple-950 text-purple-300 border-purple-500/40 hover:bg-purple-800' 
              : 'bg-white text-gray-400 border-black/10 hover:text-red-500 hover:bg-red-50'
          }`}
          title="Dismiss whisper"
        >
          <X size={10} />
        </button>
      </motion.div>
    </motion.div>
  );
};

export const HushPage: React.FC<HushPageProps> = React.memo(({ isGhostMode, onCameraOpen, notes, onAddNote }) => {
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [noteText, setNoteText] = useState('');
  const [noteMusicTitle, setNoteMusicTitle] = useState('');
  const [noteMusicArtist, setNoteMusicArtist] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const sessionStartTimeRef = useRef<number>(Date.now());
  
  // Quick Reply States
  const [quickReplyNote, setQuickReplyNote] = useState<HushNote | null>(null);
  const [quickReplyText, setQuickReplyText] = useState('');
  const [quickReplyFeedback, setQuickReplyFeedback] = useState<string | null>(null);

  const handleSendQuickReply = () => {
    if (!quickReplyText.trim() || !quickReplyNote) return;
    if (navigator.vibrate) navigator.vibrate([20, 50, 20]);
    
    const recipientUser = MOCK_USERS.find(u => u.username === quickReplyNote.username) || {
      id: quickReplyNote.userId || 'u1',
      username: quickReplyNote.username,
      displayName: quickReplyNote.username,
      avatar: quickReplyNote.avatar,
      bio: '',
      isPrivate: false,
      status: 'online' as const
    };

    setQuickReplyFeedback(`Ephemeral quick reply sent to @${quickReplyNote.username}!`);
    
    setTimeout(() => {
      setQuickReplyFeedback(null);
      setQuickReplyNote(null);
      setQuickReplyText('');
      setSelectedUser(recipientUser as User);
    }, 900);
  };

  const [timerDuration, setTimerDuration] = useState<number | null>(null); // duration in seconds
  const [tick, setTick] = useState(0);

  // Connection management
  const [isOnline, setIsOnline] = useState<boolean>(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isOfflineSimulated, setIsOfflineSimulated] = useState<boolean>(false);
  const [queuedNotesState, setQueuedNotesState] = useState<HushNote[]>([]);

  // Gestural touch drag states for modal dismissal
  const [modalStartY, setModalStartY] = useState<number | null>(null);
  const [modalCurrentY, setModalCurrentY] = useState<number | null>(null);

  const currentOnlineStatus = isOnline && !isOfflineSimulated;

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial load of offline queue
    const queue = localStorage.getItem('hush_offline_queue');
    if (queue) {
      try {
        setQueuedNotesState(JSON.parse(queue));
      } catch (e) {
        console.error(e);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const syncOfflineQueue = () => {
    const queue = localStorage.getItem('hush_offline_queue');
    if (queue) {
      try {
        const queuedNotes: HushNote[] = JSON.parse(queue);
        if (queuedNotes.length > 0) {
          if (navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
          }
          queuedNotes.forEach(note => {
            const syncedNote = { ...note };
            delete (syncedNote as any).isOfflineQueued;
            onAddNote(syncedNote);
          });
          localStorage.removeItem('hush_offline_queue');
          setQueuedNotesState([]);
          alert(`Connection Restored! Synced ${queuedNotes.length} offline note(s) to Flow.`);
        }
      } catch (e) {
        console.error(e);
      }
    }
  };

  useEffect(() => {
    if (currentOnlineStatus) {
      syncOfflineQueue();
    }
  }, [currentOnlineStatus]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTick(t => t + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const isNoteExpired = (note: HushNote) => {
    let expires = note.expiresAt;
    if (!expires) {
      const offsetMs = note.id === 'n1' ? 420000 : note.id === 'n2' ? 240000 : 1800000;
      expires = sessionStartTimeRef.current + offsetMs;
    }
    return Date.now() >= expires;
  };

  // Dismissed notes state & clear all toast
  const [dismissedNoteIds, setDismissedNoteIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('hush_dismissed_note_ids');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [clearedToastMessage, setClearedToastMessage] = useState<string | null>(null);
  const [lastClearedNotes, setLastClearedNotes] = useState<HushNote[]>([]);

  useEffect(() => {
    try {
      localStorage.setItem('hush_dismissed_note_ids', JSON.stringify(dismissedNoteIds));
    } catch (e) {
      console.error(e);
    }
  }, [dismissedNoteIds]);

  const handleDismissNote = (id: string) => {
    if (navigator.vibrate) navigator.vibrate(20);
    setDismissedNoteIds(prev => [...prev, id]);
  };

  const activeNotes = notes.filter(note => !isNoteExpired(note));
  const allCurrentNotes = [...queuedNotesState, ...activeNotes];
  const visibleNotes = allCurrentNotes.filter(note => !dismissedNoteIds.includes(note.id));

  const handleClearAll = () => {
    if (visibleNotes.length === 0) return;
    if (navigator.vibrate) navigator.vibrate([20, 40, 20]);
    const cleared = [...visibleNotes];
    setLastClearedNotes(cleared);
    const newDismissedIds = Array.from(new Set([...dismissedNoteIds, ...cleared.map(n => n.id)]));
    setDismissedNoteIds(newDismissedIds);
    setClearedToastMessage(`Workspace cleared! Removed ${cleared.length} whisper(s).`);
    setTimeout(() => {
      setClearedToastMessage(null);
    }, 4500);
  };

  const handleUndoClearAll = () => {
    if (lastClearedNotes.length === 0) return;
    if (navigator.vibrate) navigator.vibrate(20);
    const restoredIds = lastClearedNotes.map(n => n.id);
    setDismissedNoteIds(prev => prev.filter(id => !restoredIds.includes(id)));
    setLastClearedNotes([]);
    setClearedToastMessage("Whispers restored to feed!");
    setTimeout(() => {
      setClearedToastMessage(null);
    }, 2000);
  };

  useEffect(() => {
    if (isGhostMode) {
      setIsVaultOpen(true);
    } else {
      setIsVaultOpen(false);
    }
  }, [isGhostMode]);

  const handleCreateNote = () => {
    if (!noteText.trim()) return;
    const expiresAt = timerDuration ? Date.now() + (timerDuration * 1000) : (Date.now() + 1800000);
    const newNote: HushNote = {
      id: Date.now().toString(),
      userId: 'me',
      username: 'me',
      avatar: 'https://picsum.photos/seed/user_me/100',
      text: noteText,
      ...(noteMusicTitle ? { music: { title: noteMusicTitle, artist: noteMusicArtist || 'Unknown Persona' } } : {}),
      timestamp: 'Just now',
      ...(expiresAt ? { expiresAt } : {}),
      selfDestructDuration: timerDuration || 1800
    };

    if (!currentOnlineStatus) {
      // Save to local storage queue
      const queueRaw = localStorage.getItem('hush_offline_queue');
      const queue = queueRaw ? JSON.parse(queueRaw) : [];
      const updatedNote = { ...newNote, isOfflineQueued: true };
      queue.push(updatedNote);
      localStorage.setItem('hush_offline_queue', JSON.stringify(queue));
      setQueuedNotesState(queue);

      if (navigator.vibrate) navigator.vibrate([100]);
      alert("Note Queued Offline! It will upload automatically the instant connection restores.");
    } else {
      onAddNote(newNote);
      if (navigator.vibrate) navigator.vibrate(30);
    }

    setNoteText('');
    setNoteMusicTitle('');
    setNoteMusicArtist('');
    setTimerDuration(null);
    setIsNoteModalOpen(false);
  };

  if (selectedUser) {
    return <HushChatView user={selectedUser} onBack={() => setSelectedUser(null)} />;
  }

  return (
    <div className={`min-h-full transition-all duration-700 pb-24 px-4 ${isGhostMode ? 'bg-[#03171C] text-[#F1FAEE]' : 'bg-[var(--app-bg,#FFF9E6)] text-[var(--text-primary,#0B1720)]'}`}>
      <header className={`-mx-4 px-4 py-5 text-white sticky top-0 z-30 shadow-md transition-colors duration-500 ${isGhostMode ? 'bg-[#062B34]' : 'bg-primary'}`}>
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-black font-montserrat tracking-tight">Hush</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => {
                setIsVaultOpen(!isVaultOpen);
                if (navigator.vibrate) navigator.vibrate(20);
              }}
              className={`px-3 py-1.5 rounded-xl transition-all active:scale-90 flex items-center justify-center gap-1.5 border ${
                isVaultOpen 
                  ? (isGhostMode ? 'bg-[#2EC4B6] text-[#062B34] border-[#80FFEC] shadow-lg shadow-[#2EC4B6]/50 font-black' : 'bg-secondary text-white border-secondary shadow-md')
                  : (isGhostMode ? 'bg-white/10 text-[#80FFEC] border-white/10 hover:text-white' : 'bg-white/10 text-white/80 border-white/10 hover:text-white')
              }`}
              title="Vaulted Secret Whispers"
            >
              <Lock size={16} />
              <span className="text-[10px] font-black uppercase tracking-wider">Vault</span>
            </button>
            <button 
              onClick={onCameraOpen}
              className={`p-2 rounded-xl transition-all active:scale-90 flex items-center justify-center border border-white/10 ${isGhostMode ? 'bg-white/10 text-[#80FFEC] hover:text-white' : 'bg-white/10 text-white/80 hover:text-white'}`}
              title="Snap"
            >
              <Camera size={18} />
            </button>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input 
            type="text" 
            placeholder="Search whispers..." 
            className="w-full bg-white/10 border border-white/10 py-2.5 pl-12 pr-4 rounded-xl text-sm focus:outline-none focus:bg-white/20 transition-all placeholder:text-white/40"
          />
        </div>
      </header>

      {/* User Notes List with Swipe to Dismiss */}
      <div className="pt-6 pb-2 overflow-x-auto no-scrollbar">
        <div className="flex gap-6 items-center">
          {/* Action: Add Note */}
          <div className="flex flex-col items-center gap-2 shrink-0">
            <button 
              onClick={() => {
                setIsNoteModalOpen(true);
                if (navigator.vibrate) navigator.vibrate(15);
              }}
              className={`relative w-16 h-16 rounded-3xl border-2 border-dashed flex items-center justify-center active:scale-90 transition-all shadow-sm ${isGhostMode ? 'bg-white/5 border-[#2EC4B6]/40 text-[#80FFEC]' : 'bg-white border-secondary/40 text-secondary'}`}
            >
              <Plus size={24} />
            </button>
            <span className={`text-[10px] font-bold uppercase tracking-widest ${isGhostMode ? 'text-white/40' : 'text-primary/40'}`}>Note</span>
          </div>

          {/* User Notes List */}
          <AnimatePresence mode="popLayout">
            {visibleNotes.map((note, idx) => (
              <SwipeableHushNoteItem
                key={note.id}
                note={note}
                index={idx}
                isGhostMode={isGhostMode}
                onDismiss={handleDismissNote}
                onQuickReply={(selectedNote) => {
                  setQuickReplyNote(selectedNote);
                  setQuickReplyText('');
                  if (navigator.vibrate) navigator.vibrate(15);
                }}
              />
            ))}
          </AnimatePresence>

          {visibleNotes.length === 0 && (
            <div className="py-6 px-4 text-center font-mono text-[10px] opacity-50 flex items-center gap-2 shrink-0">
              <Sparkles size={12} className="text-secondary" />
              <span>Workspace clean • No active whispers</span>
            </div>
          )}
        </div>
      </div>

      {/* Cleared Toast Banner with Undo */}
      {clearedToastMessage && (
        <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[250] px-4 py-2.5 rounded-2xl bg-primary text-white text-[11px] font-bold shadow-2xl flex items-center gap-3 animate-bounce border border-white/20">
          <span>{clearedToastMessage}</span>
          {lastClearedNotes.length > 0 && (
            <button
              onClick={handleUndoClearAll}
              className="px-2.5 py-1 rounded-xl bg-white/20 hover:bg-white/30 text-white text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1"
            >
              <RotateCcw size={10} />
              <span>Undo</span>
            </button>
          )}
        </div>
      )}

      {/* Vaulted Whispers Section (Unlocked via Header Icon or Ghost Mode) */}
      {isVaultOpen && (
        <div className="px-4 pt-8 animate-fade-in">
           <div className="flex items-center justify-between px-2 mb-4">
              <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 ${isGhostMode ? 'text-[#80FFEC]' : 'text-primary/40'}`}>
                 <ShieldCheck size={14} className="animate-pulse" /> {isGhostMode ? 'Unlocked Vault' : 'Secret Archives'}
              </h3>
              {!isGhostMode && <button onClick={() => setIsVaultOpen(false)} className={`text-[8px] font-black uppercase tracking-widest hover:opacity-100 opacity-40 ${isGhostMode ? 'text-white' : 'text-primary'}`}>Close Vault</button>}
           </div>
           <div className="space-y-3">
              {[MOCK_USERS[1], MOCK_USERS[2]].filter((u): u is User => Boolean(u)).map(user => (
                <button 
                  type="button"
                  key={`hidden-${user.id}`}
                  onClick={() => setSelectedUser(user)}
                  aria-label={`Open chat with Shadow Persona @${user.username}`}
                  className={`w-full text-left p-4 rounded-[2.5rem] flex items-center gap-4 transition-all cursor-pointer shadow-lg border focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2EC4B6] ${isGhostMode ? 'bg-[#062B34] border-[#2EC4B6]/30 hover:bg-[#0C3B46] shadow-[#2EC4B6]/10' : 'bg-white border-black/5 hover:border-primary/10'}`}
                >
                   <div className="w-12 h-12 rounded-2xl border overflow-hidden relative shrink-0">
                      <img src={user.avatar} loading="lazy" className={`w-full h-full object-cover ${isGhostMode ? 'grayscale brightness-125' : ''}`} alt="" />
                      <div className={`absolute inset-0 ${isGhostMode ? 'bg-[#2EC4B6]/10' : 'bg-primary/5'}`} />
                   </div>
                   <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-bold ${isGhostMode ? 'text-white' : 'text-primary'}`}>Shadow Persona</h4>
                      <p className={`text-[10px] font-black uppercase tracking-widest ${isGhostMode ? 'text-[#80FFEC]' : 'text-primary/40'}`}>Ephemeral Trace • Open</p>
                   </div>
                   <div className={`p-2 rounded-xl shrink-0 ${isGhostMode ? 'bg-[#2EC4B6]/20 text-[#80FFEC]' : 'bg-primary/5 text-primary/40'}`}>
                    <Archive size={16} aria-hidden="true" />
                   </div>
                </button>
              ))}
           </div>
        </div>
      )}

      {/* Regular Chat List */}
      <div className="p-4 space-y-4">
        <h3 className={`px-2 text-[10px] font-black uppercase tracking-[0.3em] mb-2 ${isGhostMode ? 'text-white/40' : 'text-primary/30'}`}>Active Whispers</h3>
        {MOCK_USERS.map((user) => (
          <button 
            type="button"
            key={user.id} 
            onClick={() => setSelectedUser(user)}
            aria-label={`Open chat with ${user.displayName}`}
            className={`w-full text-left p-4 rounded-[2.5rem] flex items-center gap-4 border shadow-sm active:scale-[0.98] transition-all cursor-pointer group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2EC4B6] ${
              isGhostMode 
                ? 'bg-[#062B34] border-[#2EC4B6]/20 hover:border-[#2EC4B6]/40 hover:bg-[#0C3B46]' 
                : 'bg-white border-black/5 hover:border-primary/20'
            }`}
          >
            <div className="relative">
              <img src={user.avatar} loading="lazy" className={`w-14 h-14 rounded-2xl border-2 transition-colors group-hover:border-[#2EC4B6] ${isGhostMode ? 'border-[#03171C]' : 'border-[var(--app-bg,#FFF9E6)]'}`} alt="" />
              <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-center mb-1">
                <h4 className={`font-bold truncate ${isGhostMode ? 'text-white' : 'text-primary'}`}>{user.displayName}</h4>
                <div className="flex items-center gap-2">
                   <Zap size={10} className="text-orange-500" />
                   <span className={`text-[10px] ${isGhostMode ? 'text-white/40' : 'text-primary/40'}`}>12:30 PM</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className={`text-xs truncate italic ${isGhostMode ? 'text-white/60' : 'text-primary/60'}`}>"Hey! Let's catch up on Flow."</p>
                <div className="flex items-center gap-1.5 bg-secondary/5 px-2 py-0.5 rounded-full border border-secondary/10">
                  <Music size={10} className="text-secondary animate-spin-slow" />
                  <span className="text-[8px] font-black text-secondary uppercase tracking-tighter">Listening • 3:45</span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Note Creation Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-6 bg-black/60 backdrop-blur-md animate-fade-in">
          <div 
            onTouchStart={(e) => {
              const touch = e.touches[0];
              if (touch) setModalStartY(touch.clientY);
            }}
            onTouchMove={(e) => {
              const touch = e.touches[0];
              if (modalStartY !== null && touch) {
                setModalCurrentY(touch.clientY);
              }
            }}
            onTouchEnd={() => {
              if (modalStartY !== null && modalCurrentY !== null) {
                const diffY = modalCurrentY - modalStartY;
                if (diffY > 100) { // Swiped downwards
                  setIsNoteModalOpen(false);
                  if (navigator.vibrate) navigator.vibrate(30);
                }
              }
              setModalStartY(null);
              setModalCurrentY(null);
            }}
            style={{
              transform: modalStartY !== null && modalCurrentY !== null 
                ? `translateY(${Math.max(0, modalCurrentY - modalStartY)}px)` 
                : undefined,
              transition: modalStartY === null ? 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)' : 'none'
            }}
            className="w-full max-w-sm rounded-[2.5rem] p-8 shadow-2xl animate-scale-up bg-white text-primary select-none touch-none"
          >
             {/* Beautiful swipe indicator */}
             <div className="w-12 h-1 bg-primary/10 rounded-full mx-auto mb-4 opacity-60 sm:hidden" />
             <h3 className="text-xl font-bold mb-4 font-montserrat tracking-tight">Post a Note</h3>
             <p className="text-[8px] font-black uppercase tracking-widest opacity-25 mb-4 sm:hidden">↓ Swipe Down to Dismiss ↓</p>
             <div className="space-y-4">
                <textarea 
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="What's the vibe?"
                  className="w-full h-24 p-4 rounded-2xl text-sm focus:outline-none resize-none border bg-primary/5 border-primary/5"
                  maxLength={80}
                />
                
                {/* Self-Destruct Timer */}
                <div className="space-y-2">
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1 flex items-center gap-2">
                     <Clock size={12} className="text-red-500 animate-pulse" /> Self-Destruct Timer
                   </p>
                   <div className="flex flex-wrap gap-1.5 p-1 rounded-2xl bg-primary/5">
                     {[
                       { label: 'None', val: null },
                       { label: '10s', val: 10 },
                       { label: '1m', val: 60 },
                       { label: '5m', val: 300 },
                       { label: '1h', val: 3600 },
                       { label: '24h', val: 86400 }
                     ].map((opt, i) => (
                       <button
                         key={i}
                         type="button"
                         onClick={() => setTimerDuration(opt.val)}
                         className={`flex-1 py-1 px-1 text-[9px] font-black tracking-tight rounded-xl transition-all uppercase ${
                           timerDuration === opt.val 
                             ? 'bg-red-500 text-white shadow-md font-extrabold' 
                             : 'text-primary/60 hover:bg-black/5 font-semibold'
                         }`}
                       >
                         {opt.label}
                       </button>
                     ))}
                   </div>
                </div>

                <div className="space-y-3">
                   <p className="text-[10px] font-black uppercase tracking-widest opacity-40 ml-1 flex items-center gap-2">
                     <Music size={12} /> Add Music Track
                   </p>
                   <input 
                      type="text"
                      value={noteMusicTitle}
                      onChange={(e) => setNoteMusicTitle(e.target.value)}
                      placeholder="Song Title (e.g., Midnight City)"
                      className="w-full p-4 rounded-xl text-xs focus:outline-none border bg-primary/5 border-primary/5"
                   />
                   <input 
                      type="text"
                      value={noteMusicArtist}
                      onChange={(e) => setNoteMusicArtist(e.target.value)}
                      placeholder="Artist Name"
                      className="w-full p-4 rounded-xl text-xs focus:outline-none border bg-primary/5 border-primary/5"
                   />
                </div>
             </div>
             <div className="flex gap-3 mt-8">
                <button onClick={() => setIsNoteModalOpen(false)} className="flex-1 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest bg-primary/5">Cancel</button>
                <button onClick={handleCreateNote} className="flex-1 py-4 rounded-2xl bg-secondary text-white font-black text-[10px] uppercase tracking-widest shadow-lg active:scale-95">Post</button>
             </div>
          </div>
        </div>
      )}

      {/* Quick Reply Ephemeral Input Overlay */}
      {quickReplyNote && (
        <div className="fixed inset-0 z-[220] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl animate-scale-up border transition-colors ${
            isGhostMode ? 'bg-[#062B34] text-white border-[#2EC4B6]/30' : 'bg-white text-primary border-black/5'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className={`p-2 rounded-xl ${isGhostMode ? 'bg-[#2EC4B6]/20 text-[#80FFEC]' : 'bg-secondary/10 text-secondary'}`}>
                  <Zap size={16} />
                </span>
                <div>
                  <h3 className="text-sm font-bold tracking-tight">Quick Reply</h3>
                  <p className="text-[9px] font-mono opacity-50 uppercase">Ephemeral Whisper</p>
                </div>
              </div>
              <button 
                onClick={() => setQuickReplyNote(null)}
                className={`p-1.5 rounded-full hover:bg-black/5 transition-colors ${isGhostMode ? 'text-white/60 hover:text-white' : 'text-primary/40 hover:text-primary'}`}
              >
                <X size={18} />
              </button>
            </div>

            {/* Target Note Preview */}
            <div className={`p-3.5 rounded-2xl border mb-4 flex items-center gap-3 ${
              isGhostMode ? 'bg-[#03171C] border-[#2EC4B6]/20' : 'bg-primary/5 border-primary/5'
            }`}>
              <img src={quickReplyNote.avatar} loading="lazy" className="w-10 h-10 rounded-xl object-cover shrink-0 border border-secondary/20" alt="" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-black uppercase tracking-wider opacity-50">@{quickReplyNote.username}</p>
                <p className="text-xs font-medium truncate mt-0.5">"{quickReplyNote.text}"</p>
              </div>
            </div>

            {/* Quick Emoji Reaction Shortcuts */}
            <div className="flex items-center justify-between gap-1 mb-4 px-0.5">
              {['🔥', '👀', '✨', '💯', '🤫'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => {
                    setQuickReplyText(prev => prev ? `${prev} ${emoji}` : emoji);
                    if (navigator.vibrate) navigator.vibrate(10);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all active:scale-90 ${
                    isGhostMode 
                      ? 'bg-[#0C3B46] border-[#2EC4B6]/20 text-[#80FFEC] hover:bg-[#2EC4B6]/30' 
                      : 'bg-gray-100 border-black/5 text-primary/80 hover:bg-gray-200'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>

            {/* Quick Reply Input */}
            <div className="space-y-3">
              <div className="relative">
                <input
                  type="text"
                  value={quickReplyText}
                  onChange={(e) => setQuickReplyText(e.target.value)}
                  placeholder={`Whisper reply to @${quickReplyNote.username}...`}
                  className={`w-full py-3.5 pl-4 pr-12 rounded-2xl text-xs focus:outline-none border transition-all ${
                    isGhostMode 
                      ? 'bg-white/5 border-[#2EC4B6]/20 text-white placeholder:text-white/30 focus:border-[#80FFEC]' 
                      : 'bg-primary/5 border-primary/10 text-primary placeholder:text-primary/30 focus:border-secondary'
                  }`}
                  maxLength={120}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && quickReplyText.trim()) {
                      handleSendQuickReply();
                    }
                  }}
                />
                <button
                  onClick={handleSendQuickReply}
                  disabled={!quickReplyText.trim()}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all ${
                    quickReplyText.trim() 
                      ? (isGhostMode ? 'bg-[#2EC4B6] text-[#062B34] font-black shadow-md active:scale-90' : 'bg-secondary text-white shadow-md active:scale-90') 
                      : 'opacity-30 pointer-events-none'
                  }`}
                >
                  <Send size={14} />
                </button>
              </div>

              <div className="flex justify-between items-center px-1">
                <span className="text-[9px] font-mono opacity-40 uppercase tracking-widest flex items-center gap-1">
                  <ShieldCheck size={10} className="text-emerald-400" /> Ephemeral & Encrypted
                </span>
                <span className="text-[9px] font-mono opacity-40">{quickReplyText.length}/120</span>
              </div>
            </div>

            {/* Feedback Toast */}
            {quickReplyFeedback && (
              <div className="mt-3 p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold text-center animate-fade-in flex items-center justify-center gap-1.5">
                <Check size={12} />
                <span>{quickReplyFeedback}</span>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes streakBlast {
          0% { transform: scale(0.5); opacity: 0; filter: blur(20px); }
          50% { transform: scale(1.1); opacity: 0.8; filter: blur(0); }
          100% { transform: scale(1.8); opacity: 0; filter: blur(40px); }
        }
        .animate-streak-blast { animation: streakBlast 2s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .shadow-glow { box-shadow: 0 0 20px rgba(46, 196, 182, 0.5); }
        .shadow-glow-orange { box-shadow: 0 0 15px rgba(249, 115, 22, 0.4); }
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
});

const HushChatView: React.FC<{ user: User; onBack: () => void }> = ({ user, onBack }) => {
  const [messages, setMessages] = useState<any[]>([
    { id: '1', senderId: user.id, receiverId: 'me', text: "Hey! Did you see that new story earlier?", timestamp: '12:30 PM' },
    { id: 'music-1', senderId: user.id, receiverId: 'me', mediaType: 'music', music: { title: 'Lofi Study', artist: 'Chillhop', albumArt: 'https://picsum.photos/seed/music1/200' }, timestamp: '12:32 PM' },
    { id: '2', senderId: 'me', receiverId: user.id, text: "Yeah, it looked like a cool spot!", timestamp: '12:31 PM' }
  ]);
  const [input, setInput] = useState('');
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeMusicId, setActiveMusicId] = useState<string | null>(null);

  const sendMessage = (type: string = 'text') => {
    if (!input.trim() && type === 'text') return;
    const newMsg: any = {
      id: Date.now().toString(),
      senderId: 'me',
      receiverId: user.id,
      text: type === 'text' ? input : undefined,
      mediaType: type,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isViewed: false
    };
    if (navigator.vibrate) navigator.vibrate(25);
    setMessages([...messages, newMsg]);
    setInput('');
    setIsCameraOpen(false);
  };

  const toggleMusic = (id: string) => {
    if (activeMusicId === id) {
      setIsPlaying(!isPlaying);
    } else {
      setActiveMusicId(id);
      setIsPlaying(true);
    }
  };

  return (
    <div className="h-full flex flex-col transition-colors duration-500 bg-[var(--app-bg,#FFF9E6)]">
      <header className="p-6 text-white flex items-center justify-between shadow-xl transition-colors duration-500 bg-primary">
         <div className="flex items-center gap-4">
           <button onClick={onBack} className="p-1 active:scale-90 transition-transform"><ArrowLeft size={24} /></button>
           <div className="flex items-center gap-3">
              <img src={user.avatar} loading="lazy" className="w-10 h-10 rounded-xl border border-white/20" alt="" />
              <div>
                <h3 className="text-sm font-bold">{user.displayName}</h3>
                <p className="text-[9px] text-secondary font-black tracking-widest uppercase">Whispering...</p>
              </div>
           </div>
         </div>
         <div className="flex items-center gap-2">
            <Headphones size={18} className="text-white/40" />
            <div className="flex flex-col items-end">
               <span className="text-[8px] font-black uppercase tracking-widest text-white/40">Status</span>
               <div className="flex items-center gap-1">
                 <span className="text-[9px] font-bold text-secondary truncate max-w-[80px]">Listening to Lofi...</span>
                 <span className="text-[8px] font-black text-secondary/60">2:15</span>
               </div>
            </div>
         </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((msg) => {
          const isMe = msg.senderId === 'me';
          if (msg.mediaType === 'music') {
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                 <div className="p-4 rounded-[2rem] max-w-[85%] border shadow-xl flex items-center gap-4 bg-white border-black/5 text-primary">
                    <div className="relative group">
                       <img src={msg.music.albumArt} loading="lazy" className="w-16 h-16 rounded-2xl shadow-lg group-hover:brightness-75 transition-all" alt="" />
                       <button 
                        onClick={() => toggleMusic(msg.id)}
                        className="absolute inset-0 flex items-center justify-center text-white"
                       >
                         {activeMusicId === msg.id && isPlaying ? <Pause size={24} fill="white" /> : <Play size={24} fill="white" />}
                       </button>
                    </div>
                    <div className="flex-1 min-w-0 pr-2">
                       <h4 className="text-xs font-black uppercase tracking-tight truncate">{msg.music.title}</h4>
                       <p className="text-[10px] font-bold opacity-60 truncate mb-2">{msg.music.artist}</p>
                       <div className="flex items-center gap-4">
                          <button className="opacity-40 hover:opacity-100 transition-opacity"><SkipForward size={14} className="rotate-180" /></button>
                          <div className="flex-1 h-1 bg-primary/10 rounded-full relative overflow-hidden">
                             <div className={`h-full bg-secondary transition-all duration-300 ${activeMusicId === msg.id && isPlaying ? 'w-1/2 animate-progress' : 'w-0'}`}></div>
                          </div>
                          <button className="opacity-40 hover:opacity-100 transition-opacity"><SkipForward size={14} /></button>
                       </div>
                    </div>
                 </div>
              </div>
            );
          }
          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`max-w-[80%] p-4 rounded-2xl relative shadow-md ${
                  isMe ? 'bg-secondary text-white rounded-tr-none' : 'bg-white text-primary border border-black/5'
                }`}>
                <p className="text-sm">{msg.text}</p>
                <span className="block text-[8px] mt-2 opacity-40 uppercase font-black text-right">{msg.timestamp}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t transition-colors duration-500 relative bg-primary/5 border-primary/5">
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsCameraOpen(!isCameraOpen)}
            className={`p-3.5 rounded-2xl transition-all shadow-md ${isCameraOpen ? 'bg-secondary text-white' : 'bg-white text-primary/20'}`}
          >
            <Camera size={20} />
          </button>
          <div className="flex-1 rounded-2xl flex items-center px-4 py-1.5 shadow-inner border bg-white border-black/5 text-primary">
            <input 
              type="text" 
              placeholder="Whisper something..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1 bg-transparent text-sm py-2 focus:outline-none"
            />
            <button className="p-2 text-primary/20 hover:text-secondary"><Mic size={20} /></button>
          </div>
          <button 
            onClick={() => sendMessage()}
            className={`p-4 rounded-2xl shadow-lg transition-all ${input.trim() ? 'bg-secondary text-white scale-100' : 'bg-primary/5 text-primary/20 scale-95 pointer-events-none'}`}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
      <style>{`
        @keyframes progress { 0% { width: 0%; } 100% { width: 100%; } }
        .animate-progress { animation: progress 30s linear infinite; }
      `}</style>
    </div>
  );
}
