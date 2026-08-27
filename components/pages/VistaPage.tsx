import React, { useEffect, useRef, useState } from 'react';
import { MOCK_USERS } from '../../constants';
import { Plus, Radio } from 'lucide-react';
import { GlassCard, GlassButton, GlassBadge } from '../common/GlassmorphicHUD';

export const VistaPage: React.FC<{ isGhostMode: boolean }> = React.memo(({ isGhostMode }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<'ar' | 'map'>('ar');
  const [nearbyUsers] = useState(MOCK_USERS);
  const [showAROverlay] = useState(true);
  const [selectedUserOnMap, setSelectedUserOnMap] = useState<any | null>(null);
  const [activeFilter, setActiveFilter] = useState<string>('All');

  useEffect(() => {
    let currentVideo: HTMLVideoElement | null = null;
    if (mode === 'ar' && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then(stream => { 
          if (videoRef.current) {
            videoRef.current.srcObject = stream; 
            currentVideo = videoRef.current;
          }
        })
        .catch(err => console.error("Camera access denied", err));
    }
    return () => {
      if (currentVideo?.srcObject) {
        (currentVideo.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      }
    };
  }, [mode]);

  return (
    <div className={`h-full relative overflow-hidden transition-all duration-500 ${isGhostMode ? 'bg-[var(--app-bg-ghost)]' : 'bg-[var(--app-primary)]'}`}>
      {mode === 'ar' ? (
        <div className="h-full w-full relative">
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            className={`w-full h-full object-cover transition-all duration-700 ${isGhostMode ? 'grayscale brightness-50 contrast-125' : ''}`}
          />

          {/* AR Glassmorphic Floating HUD Header Stack */}
          <div className="absolute top-4 left-0 right-0 z-40 px-4 sm:px-6 pointer-events-none">
            <GlassCard isDarkMode={true} className="p-3.5 flex items-center justify-between pointer-events-auto">
              <div className="flex items-center gap-2.5">
                <GlassBadge label="LIVE AR" active={true} icon={<Radio size={12} className="text-[var(--app-accent-light)]" />} />
                <span className="text-[10px] font-mono text-[#8AADB5] hidden sm:inline">60 FPS • 37.7749° N, 122.4194° W</span>
              </div>

              <div className="flex items-center gap-2">
                {['All', 'Friends', 'Nearby'].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter)}
                    className={`px-2.5 py-1 rounded-xl text-[9px] font-mono uppercase tracking-wider transition-all ${
                      activeFilter === filter
                        ? 'bg-[var(--app-accent)] text-primary dark:text-white font-black'
                        : 'bg-white/5 text-[#8AADB5] hover:text-[#F1FAEE]'
                    }`}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </GlassCard>
          </div>
          
          {/* Spatial Persona Bubbles / Glassmorphic Floating AR Cards */}
          {showAROverlay && (
            <div className="absolute inset-0 pointer-events-none z-30 perspective-1000">
              {nearbyUsers.map((user, idx) => {
                return (
                  <div 
                    key={user.id} 
                    className="absolute animate-bounce-slow pointer-events-auto"
                    style={{ top: `${18 + idx * 24}%`, left: `${12 + (idx % 2) * 32}%` }}
                  >
                    <GlassCard 
                      isDarkMode={true}
                      glowOnHover={true}
                      className="w-52 p-4 text-center rotate-y-12 hover:rotate-y-0 transition-all duration-500"
                    >
                      {/* Avatar with Rim Ring */}
                      <div className="relative w-16 h-16 mx-auto mb-3">
                        <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-[var(--app-accent-light)] to-[var(--app-accent)] opacity-75 blur-xs animate-pulse" />
                        <img src={user.avatar} className="relative w-full h-full rounded-full object-cover border-2 border-[var(--app-accent-light)]" alt="Avatar" />
                      </div>

                      <h4 className="text-base font-black text-[#F1FAEE] leading-tight mb-0.5">{user.displayName}</h4>
                      <p className="text-[10px] font-mono text-[#8AADB5] mb-2 tracking-widest uppercase">@{user.username}</p>
                      <p className="text-[11px] text-[#F1FAEE]/80 line-clamp-2 leading-relaxed mb-3 font-medium">{user.bio}</p>
                      
                      <div className="flex gap-2 w-full pt-1 border-t border-white/10">
                        <GlassButton 
                          variant="solid" 
                          size="sm" 
                          fullWidth={true}
                          onClick={() => alert(`Connecting with @${user.username}`)}
                        >
                          Wave
                        </GlassButton>
                      </div>
                    </GlassCard>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        <div className={`h-full w-full relative overflow-hidden flex flex-col transition-all duration-500 ${isGhostMode ? 'bg-[var(--app-bg-ghost)]' : 'bg-[var(--app-primary)]'}`}>
           {/* Futuristic Header bar on Map with Glassmorphic HUD */}
           <div className="absolute top-4 left-4 right-4 z-40">
             <GlassCard isDarkMode={true} className="p-4 flex justify-between items-center whitespace-nowrap">
               <div className="flex items-center gap-2">
                 <GlassBadge label={isGhostMode ? 'Stealth Ping' : 'Radar Active'} active={true} />
               </div>
               <span className="text-[9px] font-mono tracking-widest text-[#8AADB5]">PROXIMITY: ENABLED</span>
             </GlassCard>
           </div>

           {/* Live Map Mesh Visual Overlay grid */}
           <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, var(--app-accent-light) 1.5px, transparent 1.5px)', backgroundSize: '28px 28px' }} />

           {/* Pulse rings from Radar Center */}
           <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-24 h-24 rounded-full border border-[color-mix(in_srgb,var(--app-accent-light)_20%,transparent)] animate-radar-pulse-1 absolute" />
             <div className="w-48 h-48 rounded-full border border-[color-mix(in_srgb,var(--app-accent-light)_20%,transparent)] animate-radar-pulse-2 absolute" />
             <div className="w-72 h-72 rounded-full border border-[color-mix(in_srgb,var(--app-accent-light)_15%,transparent)] animate-radar-pulse-3 absolute" />
             <div className="w-96 h-96 rounded-full border border-[color-mix(in_srgb,var(--app-accent-light)_10%,transparent)] absolute" />
             
             {/* Crosshairs */}
             <div className="w-full h-[1px] bg-[color-mix(in_srgb,var(--app-accent-light)_10%,transparent)] absolute" />
             <div className="h-full w-[1px] bg-[color-mix(in_srgb,var(--app-accent-light)_10%,transparent)] absolute" />
           </div>

           {/* Self Locator (Center) */}
           <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
             <div className="relative">
               <div className="w-10 h-10 rounded-full bg-[var(--app-accent)] border-2 border-[var(--app-accent-light)] overflow-hidden shadow-[0_0_20px_rgba(128,255,236,0.6)]">
                 <img src="https://picsum.photos/seed/user_me/100" className="w-full h-full object-cover" alt="Me" />
               </div>
               <div className="absolute -inset-2 bg-[color-mix(in_srgb,var(--app-accent-light)_40%,transparent)] rounded-full animate-ping -z-10" />
             </div>
             <span className="text-[8px] font-black uppercase text-[var(--app-accent-light)] tracking-[0.2em] mt-1.5 bg-[color-mix(in_srgb,var(--app-primary)_80%,transparent)] backdrop-blur-md px-2 py-0.5 rounded-full border border-[color-mix(in_srgb,var(--app-accent-light)_30%,transparent)]">Me</span>
           </div>

           {/* Nearby active user coordinates */}
           {[
             { id: 'u1', name: 'Alina K.', username: 'alinak', avatar: 'https://picsum.photos/seed/user_1/100', distance: '12m', x: 25, y: 35 },
             { id: 'u2', name: 'Zane M.', username: 'zanem', avatar: 'https://picsum.photos/seed/user_2/100', distance: '34m', x: 72, y: 28 },
             { id: 'u3', name: 'Ray B.', username: 'rayb', avatar: 'https://picsum.photos/seed/user_3/100', distance: '55m', x: 30, y: 72 },
             { id: 'u4', name: 'Faye D.', username: 'faye', avatar: 'https://picsum.photos/seed/user_4/100', distance: '80m', x: 78, y: 65 },
           ].map((user) => (
             <div 
               key={user.id} 
               onClick={() => {
                 setSelectedUserOnMap(selectedUserOnMap?.id === user.id ? null : user);
                 if (navigator.vibrate) navigator.vibrate(35);
               }}
               style={{ left: `${user.x}%`, top: `${user.y}%` }}
               className="absolute z-30 -translate-x-1/2 -translate-y-1/2 cursor-pointer group active:scale-90 transition-transform"
             >
               <div className="relative">
                 <div className="absolute -inset-3 rounded-full animate-ping opacity-35 bg-[var(--app-accent-light)]" />
                 <div className="w-10 h-10 rounded-2xl border-2 border-[var(--app-accent-light)] transition-all p-0.5 bg-[var(--app-primary)] shadow-[0_0_15px_rgba(128,255,236,0.4)]">
                   <img src={user.avatar} className="w-full h-full rounded-2xl object-cover" alt="" />
                 </div>
               </div>
             </div>
           ))}

           {/* Micro Map Popover for Selected User */}
           {selectedUserOnMap && (
             <div className="absolute top-[62%] left-1/2 -translate-x-1/2 z-50 w-[240px]">
               <GlassCard isDarkMode={true} className="p-4 flex items-center gap-3">
                 <div className="w-10 h-10 rounded-xl overflow-hidden shadow-inner border border-[color-mix(in_srgb,var(--app-accent-light)_40%,transparent)] shrink-0">
                   <img src={selectedUserOnMap.avatar} className="w-full h-full object-cover" alt="" />
                 </div>
                 <div className="flex-1 min-w-0">
                   <h4 className="text-xs font-black truncate text-[#F1FAEE]">{selectedUserOnMap.name}</h4>
                   <p className="text-[9px] text-[#8AADB5] font-mono uppercase">@{selectedUserOnMap.username}</p>
                   <span className="text-[9px] font-black uppercase text-[var(--app-accent-light)]">● {selectedUserOnMap.distance} away</span>
                 </div>
                 <GlassButton 
                   variant="solid" 
                   size="sm"
                   onClick={() => {
                     alert(`Initiating wave stream with @${selectedUserOnMap.username}`);
                     if (navigator.vibrate) navigator.vibrate([40, 20, 60]);
                   }}
                 >
                   Wave
                 </GlassButton>
               </GlassCard>
             </div>
           )}

           {/* Pulse overlay help guide */}
           <div className="absolute bottom-24 left-1/2 -translate-x-1/2 text-center pointer-events-none z-30 whitespace-nowrap">
             <GlassBadge label="Pulse Waves signal real-time coordinates. Tap on anyone." active={false} />
           </div>
        </div>
      )}

      {/* Toggle Controls */}
      <div className="absolute bottom-6 left-0 w-full px-6 flex justify-between items-center z-50 safe-area-inset-bottom">
        <GlassButton 
          variant="solid"
          size="md"
          icon={<Plus size={18} />}
          onClick={() => alert("Create Content")}
        >
          Create
        </GlassButton>

        <GlassCard isDarkMode={true} className="p-1.5 flex gap-1">
          <button 
            onClick={() => setMode('ar')} 
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
              mode === 'ar' ? 'bg-[var(--app-accent)] text-primary dark:text-white shadow-lg font-black' : 'text-[#8AADB5] hover:text-[#F1FAEE]'
            }`}
          >
            Vista
          </button>
          <button 
            onClick={() => setMode('map')} 
            className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all ${
              mode === 'map' ? 'bg-[var(--app-accent)] text-primary dark:text-white shadow-lg font-black' : 'text-[#8AADB5] hover:text-[#F1FAEE]'
            }`}
          >
            Map
          </button>
        </GlassCard>
      </div>

      <style>{`
        @keyframes bounceSlow { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-12px); } }
        .animate-bounce-slow { animation: bounceSlow 4s ease-in-out infinite; }
        .perspective-1000 { perspective: 1000px; }
        .rotate-y-12 { transform: rotateY(12deg) rotateX(8deg); }
        .hover\\:rotate-y-0:hover { transform: rotateY(0deg) rotateX(0deg); }

        @keyframes radar-1 {
          0% { transform: scale(0.6); opacity: 0; }
          50% { opacity: 0.5; }
          100% { transform: scale(1.4); opacity: 0; }
        }
        @keyframes radar-2 {
          0% { transform: scale(0.8); opacity: 0; }
          50% { opacity: 0.4; }
          100% { transform: scale(2.0); opacity: 0; }
        }
        @keyframes radar-3 {
          0% { transform: scale(0.9); opacity: 0; }
          50% { opacity: 0.3; }
          100% { transform: scale(2.4); opacity: 0; }
        }
        .animate-radar-pulse-1 { animation: radar-1 3.5s cubic-bezier(0.1, 0.8, 0.3, 1) infinite; }
        .animate-radar-pulse-2 { animation: radar-2 4.5s cubic-bezier(0.1, 0.8, 0.3, 1) infinite; }
        .animate-radar-pulse-3 { animation: radar-3 5.5s cubic-bezier(0.1, 0.8, 0.3, 1) infinite; }
      `}</style>
    </div>
  );
});

export default VistaPage;
