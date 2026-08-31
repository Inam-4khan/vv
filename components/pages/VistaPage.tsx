import React, { useEffect, useRef, useState } from 'react';
import { MOCK_USERS } from '../../constants';
import { Plus, Radio, Compass, Navigation } from 'lucide-react';
import { GlassCard, GlassButton, GlassBadge } from '../common/GlassmorphicHUD';
import { OptimizedImg } from '../common/OptimizedImg';
import { useToast } from '../../src/context/ToastContext';

interface VistaPageProps {
  isGhostMode: boolean;
  onCreateContent?: () => void;
}

export const VistaPage: React.FC<VistaPageProps> = React.memo(({ isGhostMode, onCreateContent }) => {
  const { showToast } = useToast();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<'ar' | 'map'>('ar');
  const [nearbyUsers] = useState(MOCK_USERS);
  const [showAROverlay] = useState(true);
  const [selectedUserOnMap, setSelectedUserOnMap] = useState<any | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [hasCameraAccess, setHasCameraAccess] = useState<boolean | null>(null);

  useEffect(() => {
    let currentVideo: HTMLVideoElement | null = null;
    let isMounted = true;

    if (mode === 'ar') {
      if (navigator.mediaDevices?.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
          .then(stream => { 
            if (!isMounted) {
              stream.getTracks().forEach(t => t.stop());
              return;
            }
            if (videoRef.current) {
              videoRef.current.srcObject = stream; 
              currentVideo = videoRef.current;
              videoRef.current.play().catch(() => {});
            }
            setHasCameraAccess(true);
          })
          .catch(err => {
            console.warn("AR Camera access unavailable or denied. Using spatial cyber radar.", err);
            setHasCameraAccess(false);
          });
      } else {
        setHasCameraAccess(false);
      }
    }

    return () => {
      isMounted = false;
      if (currentVideo?.srcObject) {
        (currentVideo.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, [mode]);

  const handleWave = (username: string) => {
    if (navigator.vibrate) navigator.vibrate([40, 30, 60]);
    showToast(`Sent spatial pulse wave to @${username}! 📡`, 'success');
  };

  return (
    <div className={`h-full relative overflow-hidden transition-all duration-500 ${isGhostMode ? 'bg-[var(--app-bg-ghost)]' : 'bg-[var(--app-primary)]'}`}>
      {mode === 'ar' ? (
        <div className="h-full w-full relative">
          {hasCameraAccess ? (
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              muted 
              className="w-full h-full object-cover"
            />
          ) : (
            /* Futuristic Cyber Spatial Radar Grid View */
            <div className="w-full h-full relative bg-radial from-slate-900 via-[#062B34] to-[#03171C] overflow-hidden flex items-center justify-center">
              {/* Radar Grid Circles */}
              <div className="absolute w-[500px] h-[500px] rounded-full border border-[var(--app-accent)]/20 animate-ping opacity-25" />
              <div className="absolute w-[360px] h-[360px] rounded-full border border-dashed border-[var(--app-accent)]/30" />
              <div className="absolute w-[220px] h-[220px] rounded-full border border-[var(--app-accent)]/40" />
              
              {/* Scanning Sweep Beam */}
              <div className="absolute w-96 h-96 rounded-full bg-gradient-to-tr from-transparent via-[var(--app-accent)]/10 to-[var(--app-accent-light)]/25 animate-spin" style={{ animationDuration: '4s' }} />

              <div className="text-center z-10 space-y-2 pointer-events-none">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-md border border-[var(--app-accent)]/30 text-[var(--app-accent-light)] text-xs font-mono">
                  <Compass size={14} className="animate-spin" /> SPATIAL RADAR ACTIVE • 5 SIGNALS DETECTED
                </div>
              </div>
            </div>
          )}

          {/* AR UI Controls Overlay */}
          <div className="absolute top-6 left-6 right-6 flex justify-between items-center pointer-events-none z-30 safe-area-inset-top">
            <GlassBadge label="Spatial Flow Viewfinder" icon={<Radio size={14} />} active={true} />
            <div className="bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-mono text-[var(--app-accent-light)]">
              FOV 110° • 60 FPS
            </div>
          </div>

          {/* AR Nearby Floating Contact Badges */}
          {showAROverlay && (
            <div className="absolute inset-0 pointer-events-none z-20 flex flex-col justify-center items-center gap-6 p-6">
              {nearbyUsers.slice(0, 3).map((user, index) => {
                const offsets = [
                  'translate-x-[-20%] translate-y-[-40%]',
                  'translate-x-[25%] translate-y-[-10%]',
                  'translate-x-[-15%] translate-y-[35%]'
                ];
                return (
                  <div key={user.id} className={`pointer-events-auto transform ${offsets[index] || ''} transition-transform`}>
                    <GlassCard 
                      isDarkMode={true} 
                      className="p-3 flex items-center gap-3 border-[color-mix(in_srgb,var(--app-accent-light)_30%,transparent)] shadow-2xl hover:scale-105 transition-all"
                    >
                      <div className="w-10 h-10 rounded-xl overflow-hidden border border-[var(--app-accent)] shrink-0">
                        <OptimizedImg src={user.avatar} className="w-full h-full object-cover" alt={user.displayName} />
                      </div>
                      <div className="min-w-0">
                        <h4 className="text-xs font-black text-[#F1FAEE] truncate">{user.displayName}</h4>
                        <p className="text-[9px] font-mono text-[#8AADB5]">@{user.username} • {user.distance}m</p>
                      </div>
                      <GlassButton 
                        variant="solid" 
                        size="sm"
                        onClick={() => handleWave(user.username)}
                      >
                        Wave
                      </GlassButton>
                    </GlassCard>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Map View */
        <div className={`h-full w-full relative overflow-hidden flex flex-col transition-all duration-500 ${isGhostMode ? 'bg-[var(--app-bg-ghost)]' : 'bg-[var(--app-primary)]'}`}>
          <div className="p-6 safe-area-inset-top z-30 flex justify-between items-center">
            <GlassBadge label="Proximity Map" icon={<Navigation size={14} />} active={true} />
            <div className="flex gap-1.5">
              {['All', 'Friends', 'Active'].map(f => (
                <button
                  key={f}
                  type="button"
                  onClick={() => setActiveFilter(f)}
                  className={`px-3 py-1 rounded-xl text-[10px] font-bold transition-all ${
                    activeFilter === f ? 'bg-[var(--app-accent)] text-[#062B34]' : 'bg-black/40 text-white/70 hover:text-white'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 relative flex items-center justify-center p-6">
            <div className="w-full max-w-md aspect-square rounded-3xl bg-black/40 border border-white/10 relative overflow-hidden flex items-center justify-center shadow-2xl">
              {/* Pulsing center radar beacon */}
              <div className="w-4 h-4 rounded-full bg-[var(--app-accent)] shadow-[0_0_20px_var(--app-accent)] animate-ping" />
              <div className="w-4 h-4 rounded-full bg-[var(--app-accent-light)] z-10" />

              {/* Plotted Users */}
              {nearbyUsers.map((user, i) => {
                const positions = [
                  { top: '25%', left: '30%' },
                  { top: '65%', left: '70%' },
                  { top: '30%', left: '75%' },
                  { top: '75%', left: '25%' },
                  { top: '50%', left: '85%' },
                ];
                const pos = positions[i % positions.length];
                return (
                  <button
                    key={user.id}
                    type="button"
                    style={{ top: pos.top, left: pos.left }}
                    onClick={() => {
                      setSelectedUserOnMap(user);
                      handleWave(user.username);
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group transition-transform hover:scale-125 focus:outline-none"
                  >
                    <div className="w-8 h-8 rounded-full border-2 border-[var(--app-accent)] overflow-hidden shadow-lg">
                      <OptimizedImg src={user.avatar} className="w-full h-full object-cover" alt="" />
                    </div>
                    <span className="sr-only">{user.displayName}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {selectedUserOnMap && (
            <div className="p-6 safe-area-inset-bottom z-30">
              <GlassCard isDarkMode={true} className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={selectedUserOnMap.avatar} className="w-10 h-10 rounded-xl object-cover" alt="" />
                  <div>
                    <h4 className="text-xs font-bold text-white">{selectedUserOnMap.displayName}</h4>
                    <p className="text-[10px] text-white/60">@{selectedUserOnMap.username} • {selectedUserOnMap.distance}m</p>
                  </div>
                </div>
                <GlassButton variant="solid" size="sm" onClick={() => handleWave(selectedUserOnMap.username)}>
                  Wave
                </GlassButton>
              </GlassCard>
            </div>
          )}
        </div>
      )}

      {/* Bottom Mode Switcher & Create Action */}
      <footer className="absolute bottom-6 left-0 right-0 px-6 flex justify-between items-center z-40 safe-area-inset-bottom pointer-events-auto">
        <GlassButton 
          variant="solid"
          size="md"
          icon={<Plus size={18} />}
          onClick={onCreateContent || (() => showToast('Opening Creator Studio...', 'info'))}
        >
          Create
        </GlassButton>

        <GlassCard isDarkMode={true} className="p-1.5 flex gap-1 shadow-2xl">
          <button 
            type="button"
            onClick={() => setMode('ar')} 
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
              mode === 'ar' ? 'bg-[var(--app-accent)] text-[#062B34] shadow-lg' : 'text-[#8AADB5] hover:text-[#F1FAEE]'
            }`}
          >
            Vista AR
          </button>
          <button 
            type="button"
            onClick={() => setMode('map')} 
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
              mode === 'map' ? 'bg-[var(--app-accent)] text-[#062B34] shadow-lg' : 'text-[#8AADB5] hover:text-[#F1FAEE]'
            }`}
          >
            Map
          </button>
        </GlassCard>
      </footer>
    </div>
  );
});

export default VistaPage;
