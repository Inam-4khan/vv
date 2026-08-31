import React, { useState, useRef } from 'react';
import { 
  Search, 
  Plus, 
  Music, 
  X, 
  Send, 
  Mic, 
  Camera, 
  ArrowLeft, 
  Play, 
  Pause, 
  Zap, 
  Lock, 
  ShieldCheck, 
  MapPin,
  MessageSquarePlus,
  Phone,
  Video
} from 'lucide-react';
import { MOCK_USERS } from '../../constants';
import { User, HushNote } from '../../types';
import { useToast } from '../../src/context/ToastContext';

interface HushPageProps {
  isGhostMode: boolean;
  onCameraOpen: () => void;
  notes: HushNote[];
  isLoadingNotes?: boolean;
  onAddNote: (note: HushNote) => void | Promise<void>;
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
        ? 'bg-gradient-to-br from-[#0C3B46] via-[var(--app-primary)] to-[#0C3B46] border-[color-mix(in_srgb,var(--app-accent-light)_50%,transparent)] text-white shadow-lg ring-1 ring-[var(--app-accent-light)]/40' 
        : 'bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 border-amber-300/70 text-slate-900 dark:text-[#F1FAEE] shadow-md ring-1 ring-amber-300/40',
      badgeBg: isGhostMode ? 'bg-[var(--app-accent)]/30 text-[var(--app-accent-light)]' : 'bg-amber-500/20 text-amber-900',
      proximityStr: `${distanceKm}km • Just now`
    };
  } else if (isMidRange) {
    return {
      tierLabel: 'Mid Range',
      bubbleBg: isGhostMode 
        ? 'bg-gradient-to-br from-[var(--app-primary)] via-[var(--app-bg-ghost)] to-[#0C3B46] border-[var(--app-accent)]/30 text-[#F1FAEE] shadow-md' 
        : 'bg-gradient-to-br from-teal-50/70 via-sky-50 to-white border-teal-200/50 text-slate-900 dark:text-[#F1FAEE] shadow-sm',
      badgeBg: isGhostMode ? 'bg-[var(--app-primary)] text-[var(--app-accent-light)]' : 'bg-secondary/10 text-secondary',
      proximityStr: `${distanceKm}km • ${ageMinutes}m ago`
    };
  } else {
    return {
      tierLabel: 'Distant',
      bubbleBg: isGhostMode 
        ? 'bg-gradient-to-br from-[var(--app-bg-ghost)] via-[var(--app-primary)] to-[var(--app-bg-ghost)] border-white/10 text-slate-300 shadow-inner' 
        : 'bg-slate-50 border-slate-200 text-slate-600 dark:text-slate-300 shadow-sm',
      badgeBg: isGhostMode ? 'bg-[var(--app-bg-ghost)] text-slate-300' : 'bg-slate-200/60 text-slate-600',
      proximityStr: `${distanceKm}km • ${ageMinutes}m ago`
    };
  }
};

const INITIAL_CONVERSATIONS = [
  {
    userId: '2',
    lastMessage: 'Hey! Loved your latest Flow track breakdown 🎧',
    timestamp: '12:30 PM',
    unreadCount: 2,
    proximity: '0.2 km away',
    isEncrypted: true,
    isListening: true,
    songTitle: 'Lofi Study Chill'
  },
  {
    userId: '3',
    lastMessage: 'Let us grab coffee near the Shoreditch hub tomorrow.',
    timestamp: '11:45 AM',
    unreadCount: 0,
    proximity: '0.6 km away',
    isEncrypted: true,
    isListening: false,
    songTitle: null
  },
  {
    userId: '4',
    lastMessage: 'Uploaded the studio master files to the encrypted drive.',
    timestamp: 'Yesterday',
    unreadCount: 0,
    proximity: '1.4 km away',
    isEncrypted: true,
    isListening: false,
    songTitle: null
  }
];

export const HushPage: React.FC<HushPageProps> = React.memo(({ 
  isGhostMode, 
  onCameraOpen, 
  notes = [], 
  isLoadingNotes = false, 
  onAddNote 
}) => {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'proximity' | 'vault'>('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);

  // Note form state
  const [noteText, setNoteText] = useState('');
  const [noteMusicTitle, setNoteMusicTitle] = useState('');
  const [noteMusicArtist, setNoteMusicArtist] = useState('');
  const [timerDuration, setTimerDuration] = useState<number | null>(1800);

  // Quick reply state
  const [quickReplyNote, setQuickReplyNote] = useState<HushNote | null>(null);
  const [quickReplyText, setQuickReplyText] = useState('');

  // Local visible notes state
  const [visibleNotes, setVisibleNotes] = useState<HushNote[]>(notes);

  React.useEffect(() => {
    setVisibleNotes(notes);
  }, [notes]);

  const handleCreateNote = () => {
    if (!noteText.trim()) return;
    const expiresAt = timerDuration ? Date.now() + (timerDuration * 1000) : (Date.now() + 1800000);
    const newNote: HushNote = {
      id: Date.now().toString(),
      userId: 'me',
      username: 'me',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      text: noteText,
      ...(noteMusicTitle ? { music: { title: noteMusicTitle, artist: noteMusicArtist || 'Unknown Persona' } } : {}),
      timestamp: 'Just now',
      ...(expiresAt ? { expiresAt } : {}),
      selfDestructDuration: timerDuration || 1800
    };

    onAddNote(newNote);
    setVisibleNotes(prev => [newNote, ...prev]);
    setNoteText('');
    setNoteMusicTitle('');
    setNoteMusicArtist('');
    setIsNoteModalOpen(false);
    showToast('Secret whisper note published!', 'success');
  };

  const handleDismissNote = (noteId: string) => {
    setVisibleNotes(prev => prev.filter(n => n.id !== noteId));
    showToast('Whisper dismissed', 'info');
  };

  const handleSendQuickReply = () => {
    if (!quickReplyText.trim() || !quickReplyNote) return;
    showToast(`Whispered reply to @${quickReplyNote.username}`, 'success');
    setQuickReplyNote(null);
    setQuickReplyText('');
  };

  if (selectedUser) {
    return <HushChatView user={selectedUser} onBack={() => setSelectedUser(null)} isGhostMode={isGhostMode} />;
  }

  // Filter conversations
  const filteredUsers = MOCK_USERS.filter(u => {
    if (!searchQuery) return true;
    return u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) || 
           u.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  return (
    <div className={`min-h-full flex flex-col transition-colors duration-500 pb-24 ${
      isGhostMode ? 'bg-[var(--app-bg-ghost)] text-[#F1FAEE]' : 'bg-[var(--app-bg)] text-slate-900 dark:text-[#F1FAEE]'
    }`}>
      {/* Header */}
      <header className={`p-5 sticky top-0 z-40 shadow-md transition-colors duration-500 text-white ${
        isGhostMode ? 'bg-[var(--app-bg-ghost)]' : 'bg-[var(--app-primary)]'
      }`}>
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold font-montserrat tracking-tight leading-none text-white">Hush</h1>
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider ${
                isGhostMode ? 'bg-[var(--app-accent)]/20 text-[var(--app-accent-light)] border border-[var(--app-accent)]/30' : 'bg-white/15 text-white'
              }`}>
                {isGhostMode ? 'Encrypted Mesh' : 'Proximity Chats'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setIsNewChatModalOpen(true)}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95 flex items-center gap-1.5 text-xs font-bold"
                title="New Whisper"
              >
                <MessageSquarePlus size={16} />
                <span className="hidden sm:inline text-[11px]">New Chat</span>
              </button>
              <button 
                onClick={() => setIsVaultOpen(!isVaultOpen)}
                className={`p-2 rounded-xl transition-all border border-white/10 flex items-center gap-1.5 ${
                  isVaultOpen 
                    ? 'bg-[var(--app-accent)] text-slate-900 font-bold' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
                title="Secret Vault"
              >
                <Lock size={15} />
                <span className="text-[10px] font-bold uppercase tracking-wider hidden sm:inline">Vault</span>
              </button>
              <button 
                onClick={onCameraOpen}
                className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-95"
                title="Camera Snap"
              >
                <Camera size={16} />
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/60" size={16} />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats, contacts or whispers..." 
              className="w-full bg-white/10 border border-white/15 py-2 pl-10 pr-4 rounded-xl text-xs text-white placeholder:text-white/50 focus:outline-none focus:bg-white/20 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>
        </div>
      </header>

      <div className="max-w-2xl mx-auto w-full px-4 pt-4">
        {/* Horizontal Whisper Notes Bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between px-1 mb-2">
            <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${isGhostMode ? 'text-[var(--app-accent-light)]' : 'text-slate-500 dark:text-slate-400'}`}>
              Ephemeral Whispers (24h)
            </span>
            <span className="text-[10px] text-slate-400 font-bold">
              {visibleNotes.length} active
            </span>
          </div>

          <div className="overflow-x-auto no-scrollbar flex gap-4 pb-2 pt-1" role="region" aria-label="Whispers bar">
            {/* Create note button */}
            <div className="flex flex-col items-center gap-1.5 shrink-0">
              <button 
                type="button"
                onClick={() => setIsNoteModalOpen(true)}
                className={`w-16 h-16 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center transition-all shadow-sm active:scale-95 ${
                  isGhostMode 
                    ? 'bg-white/5 border-[var(--app-accent)]/40 text-[var(--app-accent-light)] hover:bg-white/10' 
                    : 'bg-white border-secondary/40 text-secondary hover:bg-secondary/5'
                }`}
                title="Post Whisper Note"
              >
                <Plus size={20} />
                <span className="text-[8px] font-black uppercase tracking-tighter mt-0.5">Whisper</span>
              </button>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">Add Note</span>
            </div>

            {/* Render Notes */}
            {visibleNotes.map((note, idx) => {
              const variant = getNoteStyleVariants(note, idx, isGhostMode);
              return (
                <div 
                  key={note.id} 
                  className="flex flex-col items-center gap-1.5 shrink-0 relative group animate-fade-in"
                >
                  <button
                    type="button"
                    onClick={() => setQuickReplyNote(note)}
                    className={`w-16 h-16 rounded-2xl p-2 border flex flex-col justify-between text-left transition-all active:scale-95 cursor-pointer relative overflow-hidden ${variant.bubbleBg}`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[8px] font-black uppercase truncate max-w-[36px]">@{note.username}</span>
                      {note.music && <Music size={10} className="text-secondary animate-pulse shrink-0" />}
                    </div>
                    <p className="text-[9px] font-medium leading-tight line-clamp-2">{note.text}</p>
                  </button>

                  <div className="flex items-center justify-between w-16 px-0.5">
                    <span className="text-[8px] font-bold text-slate-400 truncate">{variant.proximityStr.split('•')[0]}</span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDismissNote(note.id);
                      }}
                      className="text-slate-300 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Dismiss"
                    >
                      <X size={10} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filter Navigation Tabs */}
        <div className="flex gap-2 mb-4 p-1 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10">
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              activeTab === 'all' 
                ? (isGhostMode ? 'bg-[var(--app-primary)] text-[var(--app-accent-light)] shadow-sm' : 'bg-white text-slate-900 shadow-sm dark:bg-white/15 dark:text-white')
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            All Chats ({filteredUsers.length})
          </button>
          <button
            onClick={() => setActiveTab('proximity')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'proximity' 
                ? (isGhostMode ? 'bg-[var(--app-primary)] text-[var(--app-accent-light)] shadow-sm' : 'bg-white text-slate-900 shadow-sm dark:bg-white/15 dark:text-white')
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <MapPin size={12} /> Nearby Proximity
          </button>
          <button
            onClick={() => setActiveTab('vault')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'vault' 
                ? (isGhostMode ? 'bg-[var(--app-primary)] text-[var(--app-accent-light)] shadow-sm' : 'bg-white text-slate-900 shadow-sm dark:bg-white/15 dark:text-white')
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ShieldCheck size={12} /> Secret Vault
          </button>
        </div>

        {/* Active Chats List */}
        <div className="space-y-3">
          {filteredUsers.map((user, idx) => {
            const convoMeta = INITIAL_CONVERSATIONS.find(c => c.userId === user.id) || {
              lastMessage: `Connected via Proximity Whisper`,
              timestamp: '10:15 AM',
              unreadCount: idx === 0 ? 1 : 0,
              proximity: `${(0.3 + idx * 0.4).toFixed(1)} km away`,
              isEncrypted: true,
              isListening: idx === 0,
              songTitle: idx === 0 ? 'Lofi Study Beats' : null
            };

            // If proximity tab is active, only show near ones
            if (activeTab === 'proximity' && idx > 2) return null;
            // If vault tab is active, only show vaulted users
            if (activeTab === 'vault' && idx !== 1 && idx !== 2) return null;

            return (
              <button 
                type="button"
                key={user.id} 
                onClick={() => setSelectedUser(user)}
                className={`w-full text-left p-4 rounded-[1.8rem] flex items-center gap-3.5 border shadow-sm transition-all active:scale-[0.99] cursor-pointer group ${
                  isGhostMode 
                    ? 'bg-[var(--app-primary)] border-[color-mix(in_srgb,var(--app-accent)_20%,transparent)] hover:border-[var(--app-accent)]/40' 
                    : 'bg-white border-black/5 hover:border-secondary/30 dark:bg-[#0C3B46] dark:border-white/10'
                }`}
              >
                {/* User Avatar with status dot */}
                <div className="relative shrink-0">
                  <div className="w-13 h-13 rounded-2xl overflow-hidden border-2 border-secondary/30 bg-slate-200">
                    <img src={user.avatar} loading="lazy" className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 border-2 border-white rounded-full ${
                    user.status === 'online' ? 'bg-emerald-500' : 'bg-slate-400'
                  }`} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-1">
                    <div className="flex items-center gap-2">
                      <h3 className={`font-bold text-sm truncate ${isGhostMode ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        {user.displayName}
                      </h3>
                      <span className="text-[10px] text-slate-400 font-medium">@{user.username}</span>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] font-bold text-slate-400">{convoMeta.timestamp}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className={`text-xs truncate ${convoMeta.unreadCount > 0 ? 'font-bold text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                      {convoMeta.lastMessage}
                    </p>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      {convoMeta.isListening && convoMeta.songTitle && (
                        <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-[8px] font-black uppercase">
                          <Music size={10} className="animate-spin" />
                          <span className="truncate max-w-[70px]">{convoMeta.songTitle}</span>
                        </div>
                      )}

                      {convoMeta.unreadCount > 0 && (
                        <span className="w-5 h-5 rounded-full bg-secondary text-white text-[10px] font-black flex items-center justify-center shadow-sm">
                          {convoMeta.unreadCount}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Proximity meta badge */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 flex items-center gap-1">
                      <MapPin size={9} /> {convoMeta.proximity}
                    </span>
                    <span className="text-[9px] font-mono text-emerald-500 dark:text-emerald-400 flex items-center gap-0.5">
                      <ShieldCheck size={9} /> Encrypted
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Start New Chat Modal */}
      {isNewChatModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm rounded-[2rem] p-6 shadow-2xl bg-white dark:bg-[#062B34] text-slate-900 dark:text-white border border-black/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold font-montserrat">Start Whisper Chat</h3>
              <button onClick={() => setIsNewChatModalOpen(false)} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <p className="text-xs text-slate-500 mb-4">Select a persona nearby to initiate an ephemeral whisper conversation.</p>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {MOCK_USERS.map((user) => (
                <button
                  key={user.id}
                  onClick={() => {
                    setSelectedUser(user);
                    setIsNewChatModalOpen(false);
                  }}
                  className="w-full p-3 rounded-2xl flex items-center gap-3 bg-black/5 dark:bg-white/5 hover:bg-secondary/10 transition-colors text-left"
                >
                  <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover" alt="" />
                  <div>
                    <h4 className="text-xs font-bold">{user.displayName}</h4>
                    <p className="text-[10px] text-secondary font-bold">@{user.username}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Note Creation Modal */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm rounded-[2rem] p-6 shadow-2xl bg-white dark:bg-[#062B34] text-slate-900 dark:text-white border border-black/10">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-bold font-montserrat">Post a Whisper Note</h3>
              <button onClick={() => setIsNoteModalOpen(false)} className="p-1 text-slate-400 hover:text-slate-600">
                <X size={18} />
              </button>
            </div>
            <div className="space-y-4">
              <textarea 
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="What's the whisper vibe?"
                className="w-full h-20 p-3 rounded-xl text-xs focus:outline-none resize-none border bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10"
                maxLength={80}
              />
              
              {/* Music track */}
              <div>
                <p className="text-[10px] font-black uppercase text-slate-400 mb-1.5 flex items-center gap-1">
                  <Music size={11} /> Attach Song (Optional)
                </p>
                <input 
                  type="text"
                  value={noteMusicTitle}
                  onChange={(e) => setNoteMusicTitle(e.target.value)}
                  placeholder="Song Title (e.g., Midnight City)"
                  className="w-full p-2.5 rounded-xl text-xs focus:outline-none border bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsNoteModalOpen(false)} 
                  className="flex-1 py-3 rounded-xl text-xs font-bold bg-black/5 dark:bg-white/5 hover:bg-black/10"
                >
                  Cancel
                </button>
                <button 
                  type="button" 
                  onClick={handleCreateNote} 
                  disabled={!noteText.trim()}
                  className="flex-1 py-3 rounded-xl text-xs font-bold bg-secondary text-white shadow-md disabled:opacity-40"
                >
                  Post Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quick Reply Modal */}
      {quickReplyNote && (
        <div className="fixed inset-0 z-[220] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm rounded-[2rem] p-6 shadow-2xl bg-white dark:bg-[#062B34] text-slate-900 dark:text-white border border-black/10">
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <span className="p-1.5 rounded-lg bg-secondary/10 text-secondary">
                  <Zap size={14} />
                </span>
                <h3 className="text-xs font-bold">Quick Whisper Reply</h3>
              </div>
              <button onClick={() => setQuickReplyNote(null)} className="p-1 text-slate-400">
                <X size={16} />
              </button>
            </div>

            <div className="p-3 rounded-xl bg-black/5 dark:bg-white/5 mb-3 flex items-center gap-2.5">
              <img src={quickReplyNote.avatar} className="w-8 h-8 rounded-lg object-cover" alt="" />
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-bold text-secondary">@{quickReplyNote.username}</p>
                <p className="text-xs truncate italic">"{quickReplyNote.text}"</p>
              </div>
            </div>

            {/* Quick emojis */}
            <div className="flex justify-between gap-1 mb-3">
              {['🔥', '👀', '✨', '💯', '🤫'].map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setQuickReplyText(prev => `${prev} ${emoji}`)}
                  className="px-2.5 py-1.5 rounded-lg text-xs bg-black/5 dark:bg-white/5 hover:bg-black/10"
                >
                  {emoji}
                </button>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={quickReplyText}
                onChange={(e) => setQuickReplyText(e.target.value)}
                placeholder="Type whisper reply..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSendQuickReply();
                }}
                className="flex-1 px-3 py-2 rounded-xl text-xs bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleSendQuickReply}
                disabled={!quickReplyText.trim()}
                className="px-3.5 py-2 rounded-xl bg-secondary text-white text-xs font-bold disabled:opacity-40"
              >
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});

const HushChatView: React.FC<{ user: User; onBack: () => void; isGhostMode?: boolean }> = ({ user, onBack, isGhostMode }) => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState<any[]>([
    { id: '1', senderId: user.id, receiverId: 'me', text: "Hey! Did you check out the new audio mix on Flow?", timestamp: '12:30 PM' },
    { id: 'music-1', senderId: user.id, receiverId: 'me', mediaType: 'music', music: { title: 'Lofi Study Beats', artist: 'Chillhop Records', albumArt: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80' }, timestamp: '12:32 PM' },
    { id: '2', senderId: 'me', receiverId: user.id, text: "Yeah! The soundstage is incredibly crisp.", timestamp: '12:34 PM' },
    { id: '3', senderId: user.id, receiverId: 'me', text: "Let's test the proximity live room when you are nearby.", timestamp: '12:35 PM' }
  ]);
  const [input, setInput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    if (navigator.vibrate) navigator.vibrate(20);
    setMessages(prev => [...prev, newMsg]);
    setInput('');
    showToast('Whisper sent securely', 'info');
  };

  const handleVoiceNote = () => {
    if (isRecordingVoice) {
      setIsRecordingVoice(false);
      const voiceMsg = {
        id: Date.now().toString(),
        senderId: 'me',
        receiverId: user.id,
        text: '🎤 Voice note (0:12)',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages(prev => [...prev, voiceMsg]);
      showToast('Voice whisper sent', 'success');
    } else {
      setIsRecordingVoice(true);
      showToast('Recording voice note...', 'info');
    }
  };

  return (
    <div className={`h-full flex flex-col transition-colors duration-500 ${
      isGhostMode ? 'bg-[var(--app-bg-ghost)] text-[#F1FAEE]' : 'bg-[var(--app-bg)] text-slate-900 dark:text-[#F1FAEE]'
    }`}>
      {/* Chat Header */}
      <header className={`p-4 sticky top-0 z-40 shadow-md flex items-center justify-between text-white ${
        isGhostMode ? 'bg-[var(--app-bg-ghost)]' : 'bg-[var(--app-primary)]'
      }`}>
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-1.5 hover:bg-white/10 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2.5">
            <div className="relative">
              <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover border border-white/20" alt="" />
              <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white ${
                user.status === 'online' ? 'bg-emerald-400' : 'bg-slate-400'
              }`} />
            </div>
            <div>
              <h3 className="text-sm font-bold leading-tight">{user.displayName}</h3>
              <p className="text-[10px] text-teal-300 font-bold flex items-center gap-1">
                <ShieldCheck size={11} /> Proximity Encrypted • 0.2km
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 text-white/80">
          <button onClick={() => showToast('Audio call initiating...', 'info')} className="p-2 hover:bg-white/10 rounded-full">
            <Phone size={18} />
          </button>
          <button onClick={() => showToast('Video call initiating...', 'info')} className="p-2 hover:bg-white/10 rounded-full">
            <Video size={18} />
          </button>
        </div>
      </header>

      {/* Messages Timeline */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 max-w-2xl mx-auto w-full">
        {messages.map((msg) => {
          const isMe = msg.senderId === 'me';
          
          if (msg.mediaType === 'music') {
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
                <div className="p-3.5 rounded-2xl max-w-[85%] border shadow-md flex items-center gap-3 bg-white dark:bg-[#0C3B46] border-black/5 dark:border-white/10">
                  <div className="relative group">
                    <img src={msg.music.albumArt} className="w-14 h-14 rounded-xl object-cover shadow-sm" alt="" />
                    <button 
                      onClick={() => setIsPlaying(!isPlaying)}
                      className="absolute inset-0 flex items-center justify-center bg-black/40 text-white rounded-xl"
                    >
                      {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold truncate">{msg.music.title}</h4>
                    <p className="text-[10px] text-slate-400 truncate mb-1">{msg.music.artist}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <div className={`h-full bg-secondary ${isPlaying ? 'w-2/3 animate-pulse' : 'w-1/3'}`} />
                      </div>
                      <span className="text-[9px] text-slate-400">2:45</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div className={`max-w-[78%] px-4 py-3 rounded-2xl shadow-sm ${
                isMe 
                  ? 'bg-secondary text-white rounded-tr-none' 
                  : 'bg-white dark:bg-[#0C3B46] text-slate-900 dark:text-white border border-black/5 dark:border-white/10 rounded-tl-none'
              }`}>
                <p className="text-xs leading-relaxed">{msg.text}</p>
                <span className={`block text-[8px] mt-1 text-right font-mono ${
                  isMe ? 'text-white/70' : 'text-slate-400'
                }`}>
                  {msg.timestamp}
                </span>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Composer */}
      <div className="p-3 border-t bg-white/80 dark:bg-[#062B34]/80 backdrop-blur-md border-black/5 dark:border-white/10">
        <div className="max-w-2xl mx-auto flex items-center gap-2">
          <button 
            onClick={handleVoiceNote}
            className={`p-2.5 rounded-xl transition-all ${
              isRecordingVoice ? 'bg-rose-500 text-white animate-pulse' : 'bg-black/5 dark:bg-white/10 text-slate-600 dark:text-slate-300'
            }`}
            title="Voice Whisper"
          >
            <Mic size={18} />
          </button>

          <input 
            type="text" 
            placeholder="Whisper message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') sendMessage('text');
            }}
            className="flex-1 py-2.5 px-4 rounded-xl text-xs bg-black/5 dark:bg-white/10 focus:outline-none text-slate-900 dark:text-white placeholder:text-slate-400"
          />

          <button 
            onClick={() => sendMessage('text')}
            disabled={!input.trim()}
            className="p-2.5 rounded-xl bg-secondary text-white shadow-md disabled:opacity-40 transition-all active:scale-95"
            title="Send"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default HushPage;
