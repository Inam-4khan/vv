
import React, { useState } from 'react';
import { ArrowLeft, Search, UserPlus, MessageCircle, MoreHorizontal, User } from 'lucide-react';
import { MOCK_USERS } from '../../constants';
import { User as UserType } from '../../types';

interface ConnectionsPageProps {
  onBack: () => void;
  onViewProfile: (user: UserType) => void;
  isGhostMode: boolean;
}

export const ConnectionsPage: React.FC<ConnectionsPageProps> = React.memo(({ onBack, onViewProfile, isGhostMode }) => {
  const [activeTab, setActiveTab] = useState<'followers' | 'following'>('followers');
  const [searchQuery, setSearchQuery] = useState('');

  const followers = MOCK_USERS.slice(1, 4);
  const following = MOCK_USERS.slice(2, 5);

  const currentList = activeTab === 'followers' ? followers : following;
  const filteredList = currentList.filter(u => 
    u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`min-h-full flex flex-col transition-colors duration-500 ${isGhostMode ? 'bg-[#0A001F] text-white' : 'bg-[var(--app-bg,#FFF9E6)] text-[var(--text-primary,#0B1720)]'}`}>
      <header className={`p-6 sticky top-0 z-20 shadow-xl transition-colors duration-500 ${isGhostMode ? 'bg-[#150036]' : 'bg-primary text-white'}`}>
        <div className="flex items-center gap-4 mb-6">
          <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90">
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold font-montserrat tracking-tight leading-none">Connections</h1>
            <p className={`text-[9px] font-black uppercase tracking-[0.3em] mt-1 ${isGhostMode ? 'text-purple-400' : 'text-secondary'}`}>Your Network</p>
          </div>
        </div>

        <div className="flex p-1 bg-white/5 rounded-2xl border border-white/5 mb-6">
          <button 
            onClick={() => setActiveTab('followers')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'followers' ? (isGhostMode ? 'bg-purple-600' : 'bg-secondary') + ' text-white shadow-lg' : 'text-white/40'}`}
          >
            Followers
          </button>
          <button 
            onClick={() => setActiveTab('following')}
            className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'following' ? (isGhostMode ? 'bg-purple-600' : 'bg-secondary') + ' text-white shadow-lg' : 'text-white/40'}`}
          >
            Following
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input 
            type="text" 
            placeholder="Search connections..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/10 border border-white/10 py-3 pl-12 pr-4 rounded-xl text-sm focus:outline-none focus:bg-white/20 transition-all placeholder:text-white/20"
          />
        </div>
      </header>

      <div className="p-4 space-y-3 flex-1 overflow-y-auto no-scrollbar">
        {filteredList.map((user) => (
          <div 
            key={user.id}
            onClick={() => onViewProfile(user)}
            className={`p-4 rounded-[2rem] border flex items-center gap-4 transition-all active:scale-[0.98] cursor-pointer ${isGhostMode ? 'bg-[#150036] border-purple-500/10' : 'bg-white border-black/5 shadow-sm'}`}
          >
            <div className="relative">
              <img src={user.avatar} loading="lazy" className={`w-14 h-14 rounded-2xl border-2 ${isGhostMode ? 'border-purple-500/20 grayscale opacity-70' : 'border-[var(--app-bg,#FFF9E6)]'}`} alt="" />
              <div className={`absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full ${user.status === 'online' ? 'bg-green-500' : 'bg-gray-400'}`}></div>
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-bold truncate">@{user.username}</h4>
              <p className={`text-[10px] font-bold uppercase tracking-widest opacity-40`}>{user.displayName}</p>
            </div>
            <div className="flex items-center gap-2">
              <button className={`p-2 rounded-xl ${isGhostMode ? 'bg-purple-600/20 text-purple-400' : 'bg-secondary/10 text-secondary'}`}>
                <MessageCircle size={18} />
              </button>
              <button className={`p-2 rounded-xl ${isGhostMode ? 'text-white/20' : 'text-primary/10'}`}>
                <MoreHorizontal size={18} />
              </button>
            </div>
          </div>
        ))}

        {filteredList.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center text-center px-8 opacity-40">
             <User size={48} className="mb-4" />
             <p className="text-sm font-bold">No connections found</p>
             <p className="text-xs italic">Try a different search term</p>
          </div>
        )}
      </div>
    </div>
  );
});
