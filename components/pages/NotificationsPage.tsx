
import React, { useState } from 'react';
import { ArrowLeft, UserPlus, Heart, MessageCircle, Zap, ShieldCheck, Star, Check } from 'lucide-react';
import { MOCK_USERS } from '../../constants';

interface NotificationsPageProps {
  onBack: () => void;
  isGhostMode: boolean;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = React.memo(({ onBack, isGhostMode }) => {
  const [activeTab, setActiveTab] = useState<'activity' | 'requests'>('activity');
  const [followedSuggestions, setFollowedSuggestions] = useState<Record<string, boolean>>({});

  const suggestions = [
    {
      id: 's1',
      displayName: 'Maya Chen',
      username: 'maya_codes',
      avatar: 'https://picsum.photos/seed/maya/200',
      reason: 'Shared interest: AI & Matcha Coffee',
      sharedInterests: ['AI', 'Bouldering', 'Matcha'],
      proximityCount: 14,
    },
    {
      id: 's2',
      displayName: 'Zane Miller',
      username: 'zane_waves',
      avatar: 'https://picsum.photos/seed/zane/200',
      reason: 'Frequent presence: Crossed paths 8 times today',
      sharedInterests: ['Vinyl', 'Techno', 'Synthwave'],
      proximityCount: 8,
    },
    {
      id: 's3',
      displayName: 'Faye Davis',
      username: 'faye_art',
      avatar: 'https://picsum.photos/seed/faye/200',
      reason: 'Close proximity: Nearby 22 times this week',
      sharedInterests: ['Analog', 'Travel', 'Street Art'],
      proximityCount: 22,
    }
  ];

  const handleFollowToggle = (id: string) => {
    setFollowedSuggestions(prev => {
      const next = { ...prev, [id]: !prev[id] };
      if (navigator.vibrate) {
        navigator.vibrate(next[id] ? [40, 25, 40] : 15);
      }
      return next;
    });
  };

  const notifications = [
    { id: 1, type: 'like', user: MOCK_USERS[1], text: 'liked your post from the weekend.', time: '2m ago' },
    { id: 2, type: 'mention', user: MOCK_USERS[2], text: 'mentioned you in a Hush note.', time: '15m ago' },
    { id: 3, type: 'zap', user: MOCK_USERS[0], text: 'is vibing nearby! Catch their Zap.', time: '1h ago' },
    { id: 4, type: 'comment', user: MOCK_USERS[1], text: 'commented: "This rhythm is fire! 🔥"', time: '2h ago' },
  ];

  const requests = [
    { id: 'r1', user: MOCK_USERS[2], type: 'proximity', text: 'wants to unlock your Persona via Vista.', time: '5m ago' },
    { id: 'r2', user: MOCK_USERS[1], type: 'follow', text: 'requested to follow your Flow.', time: '3h ago' },
  ];

  return (
    <div className={`min-h-full flex flex-col transition-colors duration-500 ${isGhostMode ? 'bg-[#020F14] text-white' : 'bg-[var(--app-bg)] text-white'}`}>
      <header className={`p-6 text-white sticky top-0 z-20 shadow-xl transition-colors duration-500 ${isGhostMode ? 'bg-[#020F14]' : 'bg-[#062B34]'}`}>
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90">
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold font-montserrat tracking-tight leading-none">Vitals</h1>
            <p className={`text-[9px] font-black uppercase tracking-[0.3em] mt-1 ${isGhostMode ? 'text-[#80FFEC]' : 'text-[#2EC4B6]'}`}>Activity Center</p>
          </div>
        </div>

        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5">
          <button 
            onClick={() => setActiveTab('activity')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'activity' ? (isGhostMode ? 'bg-[#2EC4B6] text-[#062B34]' : 'bg-[#2EC4B6] text-[#062B34]') + ' font-bold shadow-lg' : 'text-white/40'}`}
          >
            Activity
          </button>
          <button 
            onClick={() => setActiveTab('requests')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${activeTab === 'requests' ? (isGhostMode ? 'bg-[#2EC4B6] text-[#062B34]' : 'bg-[#2EC4B6] text-[#062B34]') + ' font-bold shadow-lg' : 'text-white/40'}`}
          >
            Requests
            {requests.length > 0 && <span className="absolute top-2 right-4 w-2 h-2 bg-red-500 rounded-full" />}
          </button>
        </div>
      </header>

      <div className="p-4 space-y-4 flex-1 overflow-y-auto no-scrollbar">
        {activeTab === 'activity' ? (
          <div className="space-y-3 animate-fade-in">
            {notifications.map((notif) => (
              <div 
                key={notif.id}
                className={`p-4 rounded-[2rem] border flex items-start gap-4 transition-all hover:scale-[1.01] ${isGhostMode ? 'bg-[#031820] border-[#2EC4B6]/10' : 'bg-[#0A2832] border-white/10 shadow-sm'}`}
              >
                <div className="relative">
                  <img src={notif.user?.avatar} loading="lazy" className={`w-12 h-12 rounded-2xl border-2 ${isGhostMode ? 'border-[#2EC4B6]/20 grayscale opacity-70' : 'border-[#062B34]'}`} alt="" />
                  <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-full text-white shadow-lg ${
                    notif.type === 'like' ? 'bg-red-500' : 
                    notif.type === 'comment' ? 'bg-blue-500' : 
                    notif.type === 'mention' ? 'bg-[#2EC4B6]' : 'bg-orange-500'
                  }`}>
                    {notif.type === 'like' && <Heart size={10} fill="currentColor" />}
                    {notif.type === 'comment' && <MessageCircle size={10} fill="currentColor" />}
                    {notif.type === 'mention' && <Star size={10} fill="currentColor" />}
                    {notif.type === 'zap' && <Zap size={10} fill="currentColor" />}
                  </div>
                </div>
                <div className="flex-1 min-w-0 pt-1">
                  <p className={`text-sm leading-snug ${isGhostMode ? 'text-white/80' : 'text-white'}`}>
                    <span className="font-black">@{notif.user?.username ?? 'user'}</span> {notif.text}
                  </p>
                  <span className="text-[10px] font-bold uppercase tracking-widest opacity-30 mt-1 block text-white">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4 animate-fade-in">
            {requests.length > 0 ? (
              requests.map((req) => (
                <div 
                  key={req.id}
                  className={`p-5 rounded-[2.5rem] border flex flex-col gap-4 transition-all ${isGhostMode ? 'bg-[#031820] border-[#2EC4B6]/10 shadow-none' : 'bg-[#0A2832] border-white/10 shadow-xl'}`}
                >
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img src={req.user?.avatar} loading="lazy" className={`w-14 h-14 rounded-[1.8rem] border-2 ${isGhostMode ? 'border-[#2EC4B6]/40 opacity-70' : 'border-[#2EC4B6]'}`} alt="" />
                      <div className="absolute -bottom-1 -right-1 p-2 rounded-full text-[#062B34] bg-[#2EC4B6]">
                        {req.type === 'proximity' ? <Zap size={14} fill="currentColor" /> : <UserPlus size={14} />}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-black text-white">@{req.user?.username ?? 'user'}</h4>
                      <p className="text-[11px] leading-tight opacity-50 font-medium text-white">{req.text}</p>
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-tighter opacity-20 text-white">{req.time}</span>
                  </div>
                  
                  <div className="flex gap-2 pt-2">
                    <button className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 ${isGhostMode ? 'bg-[#2EC4B6] text-[#062B34]' : 'bg-[#2EC4B6] text-[#062B34] shadow-lg shadow-[#2EC4B6]/20'}`}>
                      <Check size={16} strokeWidth={3} /> Accept
                    </button>
                    <button className="px-6 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] transition-all active:scale-95 bg-white/5 text-white/40">
                      Ignore
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center px-8">
                 <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isGhostMode ? 'bg-[#2EC4B6]/10 text-[#80FFEC]' : 'bg-white/5 text-white/20'}`}>
                    <ShieldCheck size={40} />
                 </div>
                 <h3 className="text-lg font-bold mb-2 text-white">No Pending Trace</h3>
                 <p className="text-xs opacity-40 leading-relaxed italic text-white">Your Persona visibility is optimized. No proximity requests currently queued.</p>
              </div>
            )}
          </div>
        )}

        {/* Suggested Connections section based on shared interests or proximity frequency */}
        <div className="mt-8 pt-6 border-t border-white/10 animate-fade-in pb-10">
          <div className="flex justify-between items-center mb-4 px-2">
            <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] ${isGhostMode ? 'text-[#80FFEC]' : 'text-white/40'}`}>
              Suggested Connections
            </h3>
            <span className="text-[8px] font-black opacity-30 uppercase tracking-[0.1em] text-white">ENCOUNTERS BASED</span>
          </div>

          <div className="space-y-3">
            {suggestions.map((sug) => {
              const isFollowed = !!followedSuggestions[sug.id];
              return (
                <div 
                  key={sug.id} 
                  className={`p-4 rounded-[2rem] border flex items-center justify-between gap-3 transition-all ${
                    isGhostMode 
                      ? 'bg-[#031820] border-[#2EC4B6]/10 hover:border-[#2EC4B6]/20' 
                      : 'bg-[#0A2832] border-white/10 shadow-md'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative shrink-0">
                      <img src={sug.avatar} loading="lazy" className={`w-11 h-11 rounded-[1.2rem] border-2 ${isGhostMode ? 'border-[#2EC4B6]/40 opacity-85' : 'border-white/10 bg-[#0A2832]'}`} alt="" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-xs font-black truncate text-white">
                        @{sug.username}
                      </h4>
                      <p className={`text-[10px] opacity-70 leading-snug ${isGhostMode ? 'text-[#80FFEC]' : 'text-[#2EC4B6]'} font-medium`}>
                        {sug.reason}
                      </p>
                      <div className="flex gap-1 mt-1 flex-wrap">
                        {sug.sharedInterests.map(interest => (
                          <span 
                            key={interest} 
                            className={`text-[8px] px-1.5 py-0.5 rounded font-mono font-bold ${
                              isGhostMode ? 'bg-[#2EC4B6]/20 text-[#80FFEC]' : 'bg-white/10 text-white/60'
                            }`}
                          >
                            #{interest}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleFollowToggle(sug.id)}
                    className={`ml-2 px-3 py-1.5 rounded-xl font-bold font-mono text-[9px] uppercase tracking-wider transition-all min-w-[70px] ${
                      isFollowed 
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' 
                        : (isGhostMode ? 'bg-[#2EC4B6]/20 text-[#80FFEC] border border-[#2EC4B6]/30 hover:bg-[#2EC4B6]/30' : 'bg-[#2EC4B6] text-[#062B34] hover:bg-opacity-90')
                    }`}
                  >
                    {isFollowed ? 'Mutual' : 'Connect'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
});
