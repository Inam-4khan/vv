
import React, { useState } from 'react';
import { ArrowLeft, Search, MapPin, Compass, Filter, Ghost, ShieldCheck, Tag, Star, Plus, Image, Headphones, Video } from 'lucide-react';
import { MOCK_USERS } from '../../constants';

interface ExplorePageProps {
  onBack: () => void;
  isGhostMode: boolean;
}

export const ExplorePage: React.FC<ExplorePageProps> = React.memo(({ onBack, isGhostMode }) => {
  const [activeTab, setActiveTab] = useState<'all' | 'people' | 'spots'>('all');

  return (
    <div className={`min-h-full flex flex-col transition-colors duration-500 ${isGhostMode ? 'bg-[#020F14] text-white' : 'bg-[var(--app-bg)] text-white'}`}>
      <header className={`p-6 text-white sticky top-0 z-20 shadow-xl transition-colors duration-500 ${isGhostMode ? 'bg-[#020F14]' : 'bg-[#062B34]'}`}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90"
            >
              <ArrowLeft size={24} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-2xl font-bold font-montserrat tracking-tight leading-none">Explore</h1>
              <p className={`text-[9px] font-black uppercase tracking-[0.3em] mt-1 ${isGhostMode ? 'text-[#80FFEC]' : 'text-[#2EC4B6]'}`}>Discover Proximity</p>
            </div>
          </div>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" size={18} />
          <input 
            type="text" 
            placeholder="Find personas, spots, or tags..." 
            className="w-full bg-white/10 border border-white/10 py-3 pl-12 pr-12 rounded-2xl text-sm focus:outline-none focus:bg-white/20 transition-all placeholder:text-white/20"
          />
          <button className={`absolute right-4 top-1/2 -translate-y-1/2 p-1 ${isGhostMode ? 'text-[#80FFEC]' : 'text-[#2EC4B6]'}`}>
             <Filter size={18} />
          </button>
        </div>
      </header>

      <div className="p-6 space-y-8 flex-1 overflow-y-auto no-scrollbar">
        {/* Media Exploration Tiles */}
        <section className="animate-fade-in">
          <h3 className="text-[10px] font-black uppercase tracking-[0.3em] mb-4 px-1 text-white/40">Media Discovery</h3>
          <div className="grid grid-cols-3 gap-3">
            <button className={`flex flex-col items-center gap-4 p-5 rounded-[2.5rem] border transition-all active:scale-95 shadow-sm ${isGhostMode ? 'bg-[#031820] border-[#2EC4B6]/10 text-white hover:border-[#2EC4B6]/30' : 'bg-[#0A2832] border-white/10 text-white hover:border-[#2EC4B6]/20'}`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${isGhostMode ? 'bg-[#2EC4B6]/10 text-[#80FFEC]' : 'bg-[#2EC4B6]/10 text-[#2EC4B6]'}`}>
                <Image size={28} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Pictures</span>
            </button>
            <button className={`flex flex-col items-center gap-4 p-5 rounded-[2.5rem] border transition-all active:scale-95 shadow-sm ${isGhostMode ? 'bg-[#031820] border-[#2EC4B6]/10 text-white hover:border-[#2EC4B6]/30' : 'bg-[#0A2832] border-white/10 text-white hover:border-[#2EC4B6]/20'}`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${isGhostMode ? 'bg-[#2EC4B6]/10 text-[#80FFEC]' : 'bg-primary/10 text-primary'}`}>
                <Video size={28} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-center leading-tight">Short<br/>Videos</span>
            </button>
            <button className={`flex flex-col items-center gap-4 p-5 rounded-[2.5rem] border transition-all active:scale-95 shadow-sm ${isGhostMode ? 'bg-[#031820] border-[#2EC4B6]/10 text-white hover:border-[#2EC4B6]/30' : 'bg-[#0A2832] border-white/10 text-white hover:border-[#2EC4B6]/20'}`}>
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg ${isGhostMode ? 'bg-[#2EC4B6]/10 text-[#80FFEC]' : 'bg-orange-500/10 text-orange-500'}`}>
                <Headphones size={28} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest">Music</span>
            </button>
          </div>
        </section>

        {/* Quick Tabs */}
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
           {['Trending', 'New Personas', 'Hot Spots', 'Audio Hubs'].map((tab, idx) => (
             <button 
              key={tab}
              onClick={() => setActiveTab(tab.toLowerCase() as any)}
              className={`px-5 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
                idx === 0 
                ? (isGhostMode ? 'bg-[#2EC4B6] border-[#2EC4B6] text-[#062B34]' : 'bg-[#2EC4B6] border-[#2EC4B6] text-[#062B34]') + ' font-black shadow-lg' 
                : (isGhostMode ? 'bg-white/5 text-white/40 border-transparent hover:border-white/10' : 'bg-white/5 text-white/40 border-transparent hover:border-white/10')
              }`}
             >
               {tab}
             </button>
           ))}
        </div>

        {/* Discovery Hot Spot */}
        <section className="animate-fade-in">
           <div className="flex justify-between items-center mb-4 px-1">
              <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 ${isGhostMode ? 'text-white/40' : 'text-white/40'}`}>
                <MapPin size={12} className={isGhostMode ? 'text-[#80FFEC]' : 'text-[#2EC4B6]'} /> Discovery Zone
              </h3>
              <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 ${isGhostMode ? 'text-[#80FFEC]' : 'text-[#2EC4B6]'}`}>
                <Star size={10} fill="currentColor" /> Live Hotspot
              </span>
           </div>
           <div className={`relative h-48 rounded-[3rem] overflow-hidden shadow-2xl border-4 group transition-all duration-500 ${isGhostMode ? 'border-[#2EC4B6]/20 shadow-[#2EC4B6]/10' : 'border-white/10 shadow-black/10'}`}>
              <img src="https://picsum.photos/seed/map_explore/800/400" loading="lazy" className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${isGhostMode ? 'grayscale brightness-50' : ''}`} alt="Map Preview" />
              <div className="absolute inset-0 bg-gradient-to-t via-transparent to-transparent from-primary/90" />
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                 <div>
                    <h4 className="text-white font-bold text-xl leading-tight mb-1">Camden Town Hub</h4>
                    <p className="text-white/60 text-[10px] uppercase font-black tracking-[0.2em] flex items-center gap-2">
                       <Plus size={12} /> 1.2km away • 42 personas
                    </p>
                 </div>
                 <button className={`p-4 text-white rounded-[1.5rem] shadow-2xl active:scale-90 transition-all ${isGhostMode ? 'bg-[#2EC4B6] text-[#062B34]' : 'bg-[#2EC4B6] text-[#062B34]'} group-hover:rotate-6 font-bold`}>
                    <Compass size={24} />
                 </button>
              </div>
           </div>
        </section>

        {/* Rising Personas Section */}
        <section className="animate-fade-in delay-100">
           <div className="flex justify-between items-center mb-5 px-1">
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] flex items-center gap-2 text-white/40">
                <Compass size={12} className={isGhostMode ? 'text-[#80FFEC]' : 'text-[#2EC4B6]'} /> Rising Personas
              </h3>
              <button className="text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-[#2EC4B6] transition-colors">Global View</button>
           </div>
           <div className="flex gap-5 overflow-x-auto no-scrollbar pb-4 -mx-6 px-6">
              {MOCK_USERS.map((user) => (
                <div key={user.id} className="flex flex-col items-center gap-3 shrink-0 group cursor-pointer transition-all active:scale-95">
                  <div className="relative">
                    <div className={`w-28 h-28 rounded-[2.5rem] p-0.5 shadow-xl transition-all group-hover:scale-105 group-hover:-rotate-3 overflow-hidden border relative ${isGhostMode ? 'bg-[#031820] border-[#2EC4B6]/20' : 'bg-[#0A2832] border-white/10'}`}>
                       <img src={user.avatar} loading="lazy" className={`w-full h-full object-cover rounded-[2.3rem] ${isGhostMode ? 'grayscale opacity-70' : ''}`} alt="" />
                       
                       <div className={`absolute inset-x-0 bottom-0 p-1.5 backdrop-blur-md flex flex-wrap gap-1 justify-center border-t ${isGhostMode ? 'bg-[#031820]/70 border-[#2EC4B6]/20' : 'bg-[#0A2832]/70 border-white/10'}`}>
                         {user.interests?.slice(0, 2).map(int => (
                             <span key={int} className={`text-[7px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm ${isGhostMode ? 'bg-[#2EC4B6] text-[#062B34]' : 'bg-[#2EC4B6] text-[#062B34]'}`}>{int}</span>
                         ))}
                       </div>
                    </div>
                  </div>
                  <div className="text-center w-28">
                    <p className="text-xs font-bold truncate mb-0.5 text-white">@{user.username}</p>
                    <div className="flex items-center justify-center gap-1 opacity-50">
                       <Tag size={9} className={isGhostMode ? 'text-[#80FFEC]' : 'text-[#2EC4B6]'} />
                       <p className={`text-[8px] font-black uppercase tracking-widest ${isGhostMode ? 'text-[#80FFEC]' : 'text-[#2EC4B6]'}`}>Vibe Scout</p>
                    </div>
                  </div>
                </div>
              ))}
           </div>
        </section>

        <div className="h-24" />
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
});
