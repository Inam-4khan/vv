import React, { useState } from 'react';
import { 
  Radio, 
  Sparkles, 
  Music, 
  Play, 
  Pause, 
  Flame, 
  MapPin, 
  MessageSquare, 
  Send, 
  Compass, 
  UserCheck, 
  UserPlus, 
  Waves
} from 'lucide-react';
import { MOCK_USERS } from '../../constants';
import { useAppState } from '../../src/context/AppStateContext';
import { useToast } from '../../src/context/ToastContext';
import { OptimizedImg } from '../common/OptimizedImg';
import { HushNote } from '../../types';

interface DesktopRightSidebarProps {
  onNavigate?: (path: string) => void;
  onOpenWhisperModal?: () => void;
  recentNotes?: HushNote[];
}

const TRENDING_VIBES = [
  { tag: '#CyberpunkLoFi', count: '4.2k vibes', category: 'Music & Flow' },
  { tag: '#ShoreditchMeetup', count: '1.8k zaps', category: 'Local Hotspot' },
  { tag: '#AmbientVisuals', count: '950 whispers', category: 'Creative' },
  { tag: '#LateNightCode', count: '2.1k moments', category: 'Proximity' },
];

export const DesktopRightSidebar: React.FC<DesktopRightSidebarProps> = ({
  onNavigate,
  onOpenWhisperModal,
  recentNotes = [],
}) => {
  const { showToast } = useToast();
  const { isGlobalGhostMode, user } = useAppState();
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [wavedUsers, setWavedUsers] = useState<string[]>([]);
  const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

  // Nearby simulated contacts
  const nearbyPersonas = MOCK_USERS.filter(u => u.id !== user?.id).slice(0, 3);

  const handleWave = (personaId: string, name: string) => {
    if (navigator.vibrate) navigator.vibrate([30, 40]);
    setWavedUsers(prev => [...prev, personaId]);
    showToast(`Sent a proximity pulse wave to ${name}! 📡`, 'success');
  };

  const handleToggleConnect = (personaId: string, name: string) => {
    setConnectedUsers(prev => {
      const isConnected = prev.includes(personaId);
      if (isConnected) {
        showToast(`Disconnected from ${name}`, 'info');
        return prev.filter(id => id !== personaId);
      } else {
        showToast(`Connected with ${name} via proximity mesh! ✨`, 'success');
        return [...prev, personaId];
      }
    });
  };

  const toggleAudioPreview = () => {
    setIsPlayingAudio(prev => {
      const next = !prev;
      if (next) {
        showToast('Streaming nearby ambient channel: "Neon Midnight 104.2" 🎧', 'info');
      }
      return next;
    });
  };

  return (
    <aside 
      aria-label="Proximity Radar and Trending Sidebar"
      className="hidden lg:flex flex-col w-80 xl:w-88 shrink-0 space-y-5 pb-8 select-none"
    >
      {/* 1. Proximity Radar Pulse Widget */}
      <section 
        className={`p-5 rounded-3xl border transition-all duration-300 shadow-sm ${
          isGlobalGhostMode 
            ? 'bg-[var(--app-primary)] border-[color-mix(in_srgb,var(--app-accent)_20%,transparent)] shadow-teal-950/20' 
            : 'bg-white border-slate-200/80 dark:bg-[#0C3B46] dark:border-white/10 shadow-slate-200/40'
        }`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="relative flex items-center justify-center w-6 h-6">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--app-accent)] opacity-50" />
              <Radio size={16} className="text-[var(--app-accent)] relative z-10" />
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white font-montserrat">
                Proximity Radar
              </h2>
              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                {isGlobalGhostMode ? 'Ghost Cloaked' : '5 creators within 1.2km'}
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('/vista')}
            className="text-[10px] font-bold text-[var(--app-accent)] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <Compass size={12} />
            <span>Full Radar</span>
          </button>
        </div>

        {/* Radar Visual Strip */}
        <div className="relative h-20 rounded-2xl overflow-hidden bg-slate-900 border border-teal-500/20 flex items-center justify-center mb-4">
          <div className="absolute inset-0 bg-radial from-teal-900/30 via-slate-900 to-slate-950" />
          {/* Concentric radar rings */}
          <div className="absolute w-36 h-36 rounded-full border border-teal-400/20 animate-pulse" />
          <div className="absolute w-24 h-24 rounded-full border border-dashed border-teal-400/30" />
          <div className="absolute w-12 h-12 rounded-full border border-teal-400/40" />
          {/* Radar sweeping line */}
          <div 
            className="absolute inset-0 bg-gradient-to-tr from-transparent via-teal-400/10 to-teal-400/30 rounded-full animate-spin" 
            style={{ animationDuration: '4s' }}
          />

          {/* Pulsing Nodes */}
          <div className="absolute top-4 left-10 w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#34d399] animate-ping" />
          <div className="absolute bottom-5 right-12 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
          <div className="absolute top-6 right-16 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_#fbbf24]" />

          <div className="relative z-10 text-center pointer-events-none">
            <span className="px-2.5 py-1 rounded-full text-[9px] font-mono font-bold bg-slate-900/80 text-[var(--app-accent-light)] border border-teal-400/30 backdrop-blur-sm">
              TELEMETRY: 2.4GHz MESH
            </span>
          </div>
        </div>

        {/* Nearby Personas list */}
        <div className="space-y-3">
          {nearbyPersonas.map((persona, index) => {
            const distances = ['0.2 km', '0.6 km', '1.1 km'];
            const distance = distances[index % distances.length];
            const hasWaved = wavedUsers.includes(persona.id);
            const isConnected = connectedUsers.includes(persona.id);

            return (
              <div 
                key={persona.id}
                className="flex items-center justify-between p-2 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="relative w-9 h-9 shrink-0">
                    <OptimizedImg
                      src={persona.avatar}
                      alt={persona.displayName}
                      width={36}
                      height={36}
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white dark:border-slate-800 rounded-full" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold truncate text-slate-800 dark:text-slate-100">
                      {persona.displayName}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1 font-mono">
                      <MapPin size={9} className="text-[var(--app-accent)] shrink-0" />
                      <span>{distance} away</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleWave(persona.id, persona.displayName)}
                    disabled={hasWaved}
                    className={`p-1.5 rounded-xl text-[10px] font-bold transition-all ${
                      hasWaved
                        ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400'
                        : 'bg-teal-50 hover:bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300 active:scale-95'
                    }`}
                    title={hasWaved ? 'Wave sent' : 'Send spatial wave'}
                  >
                    <Waves size={14} />
                  </button>
                  <button
                    onClick={() => handleToggleConnect(persona.id, persona.displayName)}
                    className={`px-2 py-1 rounded-xl text-[10px] font-bold transition-all ${
                      isConnected
                        ? 'bg-slate-200 text-slate-700 dark:bg-white/10 dark:text-white'
                        : 'bg-[var(--app-accent)] text-[#062B34] hover:bg-teal-400 active:scale-95'
                    }`}
                  >
                    {isConnected ? <UserCheck size={12} /> : <UserPlus size={12} />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 2. Live Ephemeral Whispers (Hush Preview) */}
      <section 
        className={`p-5 rounded-3xl border transition-all duration-300 shadow-sm ${
          isGlobalGhostMode 
            ? 'bg-[var(--app-primary)] border-[color-mix(in_srgb,var(--app-accent)_20%,transparent)] shadow-teal-950/20' 
            : 'bg-white border-slate-200/80 dark:bg-[#0C3B46] dark:border-white/10 shadow-slate-200/40'
        }`}
      >
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <MessageSquare size={16} className="text-amber-500" />
            <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white font-montserrat">
              Nearby Whispers
            </h2>
          </div>
          <button
            onClick={() => onNavigate && onNavigate('/hush')}
            className="text-[10px] font-bold text-[var(--app-accent)] hover:underline cursor-pointer"
          >
            View All
          </button>
        </div>
        <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-snug">
          Secret encrypted notes decaying in 24 hours nearby.
        </p>

        <div className="space-y-2.5">
          {(recentNotes.length > 0 ? recentNotes.slice(0, 2) : [
            {
              id: 'wn-1',
              username: 'elena_art',
              text: 'Vinyl selector spinning vintage jazz right behind the arches 🎷',
              music: { title: 'Autumn Leaves', artist: 'Miles Davis' },
              timestamp: '18m left'
            },
            {
              id: 'wn-2',
              username: 'anon_walker',
              text: 'Secret rooftop garden unlocked on 4th floor. Golden sunset is unbelievable.',
              timestamp: '42m left'
            }
          ]).map((note, i) => (
            <div 
              key={note.id || i}
              className="p-3 rounded-2xl bg-amber-500/5 dark:bg-white/5 border border-amber-500/20 text-slate-800 dark:text-slate-200"
            >
              <div className="flex items-center justify-between text-[9px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-1">
                <span>@{note.username}</span>
                <span>{note.timestamp || '24h left'}</span>
              </div>
              <p className="text-xs font-medium leading-snug line-clamp-2">
                "{note.text}"
              </p>
              {note.music && (
                <div className="mt-2 flex items-center gap-1 text-[10px] font-mono text-[var(--app-accent)] truncate">
                  <Music size={11} className="shrink-0 animate-bounce" />
                  <span className="truncate">{note.music.title} • {note.music.artist}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={onOpenWhisperModal || (() => onNavigate && onNavigate('/hush'))}
          className="w-full mt-3.5 py-2.5 px-4 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
        >
          <Send size={13} />
          <span>Post Quick Whisper</span>
        </button>
      </section>

      {/* 3. Trending Vibes & Hotspots */}
      <section 
        className={`p-5 rounded-3xl border transition-all duration-300 shadow-sm ${
          isGlobalGhostMode 
            ? 'bg-[var(--app-primary)] border-[color-mix(in_srgb,var(--app-accent)_20%,transparent)] shadow-teal-950/20' 
            : 'bg-white border-slate-200/80 dark:bg-[#0C3B46] dark:border-white/10 shadow-slate-200/40'
        }`}
      >
        <div className="flex items-center gap-2 mb-3">
          <Flame size={16} className="text-rose-500" />
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white font-montserrat">
            Trending in Shoreditch
          </h2>
        </div>

        <div className="space-y-2.5">
          {TRENDING_VIBES.map((vibe) => (
            <div 
              key={vibe.tag}
              onClick={() => showToast(`Filtered flow by ${vibe.tag}`, 'info')}
              className="group p-2.5 rounded-2xl hover:bg-slate-50 dark:hover:bg-white/5 transition-all cursor-pointer flex items-center justify-between"
            >
              <div>
                <p className="text-xs font-black text-slate-800 dark:text-slate-100 group-hover:text-[var(--app-accent)] transition-colors">
                  {vibe.tag}
                </p>
                <p className="text-[10px] text-slate-400">
                  {vibe.category}
                </p>
              </div>
              <span className="text-[10px] font-mono text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200">
                {vibe.count}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Ambient Proximity Audio Player */}
      <section 
        className={`p-4 rounded-3xl border transition-all duration-300 shadow-sm ${
          isGlobalGhostMode 
            ? 'bg-slate-950/70 border-teal-500/30' 
            : 'bg-gradient-to-r from-teal-900 via-slate-900 to-[#062B34] text-white border-teal-500/20'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={toggleAudioPreview}
              className="w-10 h-10 rounded-2xl bg-[var(--app-accent)] text-[#062B34] flex items-center justify-center shrink-0 shadow-md hover:scale-105 active:scale-95 transition-all"
              aria-label={isPlayingAudio ? 'Pause ambient stream' : 'Play ambient stream'}
            >
              {isPlayingAudio ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                <p className="text-[10px] font-black uppercase tracking-wider text-teal-300 font-mono">
                  PROXIMITY RADIO
                </p>
              </div>
              <p className="text-xs font-bold truncate text-white">
                Neon Midnight 104.2
              </p>
              <p className="text-[10px] text-teal-200/70 truncate">
                3 creators streaming nearby
              </p>
            </div>
          </div>

          {isPlayingAudio && (
            <div className="flex items-end gap-0.5 h-5 shrink-0 px-1">
              <span className="w-1 bg-[var(--app-accent)] rounded-full animate-[bounce_1s_infinite_100ms] h-4" />
              <span className="w-1 bg-[var(--app-accent)] rounded-full animate-[bounce_1s_infinite_300ms] h-2" />
              <span className="w-1 bg-[var(--app-accent)] rounded-full animate-[bounce_1s_infinite_200ms] h-5" />
              <span className="w-1 bg-[var(--app-accent)] rounded-full animate-[bounce_1s_infinite_400ms] h-3" />
            </div>
          )}
        </div>
      </section>

      {/* Footer info */}
      <footer className="px-3 text-[10px] text-slate-400 dark:text-slate-500 space-y-1">
        <p className="flex items-center gap-1 font-mono">
          <Sparkles size={10} className="text-[var(--app-accent)]" />
          <span>VIZU Mesh Engine v2.4 • Zero Tracking</span>
        </p>
        <p>© 2026 VIZU Proximity Network</p>
      </footer>
    </aside>
  );
};
