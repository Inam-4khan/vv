import React, { useState } from 'react';
import { ArrowLeft, Camera, Save, User as UserIcon, Image as ImageIcon, AtSign, FileText, Palette, Sparkles } from 'lucide-react';
import { User } from '../../types';

export const CARD_SKINS = [
  { id: 'default', name: 'Default', bg: 'bg-white', text: 'text-primary', border: 'border-gray-200' },
  { id: 'holographic', name: 'Holographic', bg: 'bg-gradient-to-br from-[#2EC4B6] via-[#80FFEC] to-[#062B34]', text: 'text-white', border: 'border-white/40' },
  { id: 'neon', name: 'Neon', bg: 'bg-black', text: 'text-green-400', border: 'border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]' },
  { id: 'gold', name: 'Gold', bg: 'bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-700', text: 'text-black', border: 'border-yellow-200' },
  { id: 'cyberpunk', name: 'Cyberpunk', bg: 'bg-yellow-400', text: 'text-black', border: 'border-black border-4' },
];

interface EditProfilePageProps {
  user: User;
  onBack: () => void;
  onSave: (updatedUser: User) => void;
  isGhostMode: boolean;
}

export const EditProfilePage: React.FC<EditProfilePageProps> = React.memo(({ user, onBack, onSave, isGhostMode }) => {
  const [displayName, setDisplayName] = useState(user.displayName);
  const [username, setUsername] = useState(user.username);
  const [bio, setBio] = useState(user.bio);
  const [avatar, setAvatar] = useState(user.avatar);
  // Mock banner state since User type might not have it yet, but requested
  const [banner, setBanner] = useState("https://picsum.photos/seed/cover/800/400"); 
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [cardSkin, setCardSkin] = useState('holographic');

  const handleAvatarClick = () => {
    setIsUploadingAvatar(true);
    setTimeout(() => setIsUploadingAvatar(false), 2000);
  };

  const handleBannerClick = () => {
    setIsUploadingBanner(true);
    setTimeout(() => setIsUploadingBanner(false), 2000);
  };

  const handleSave = () => {
    onSave({
      ...user,
      displayName,
      username,
      bio,
      avatar,
    });
    onBack();
  };

  return (
    <div className={`min-h-full flex flex-col transition-colors duration-500 ${isGhostMode ? 'bg-[#020F14] text-white' : 'bg-[var(--app-bg)] text-white'}`}>
      <header className={`p-6 sticky top-0 z-20 shadow-xl transition-colors duration-500 flex items-center justify-between ${isGhostMode ? 'bg-[#020F14]' : 'bg-[#062B34] text-white'}`}>
        <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors active:scale-90">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold font-montserrat">Edit Profile</h1>
        <button onClick={handleSave} className={`p-2 rounded-xl transition-colors ${isGhostMode ? 'text-[#80FFEC] hover:bg-white/10' : 'text-[#2EC4B6] hover:bg-white/10'}`}>
          <Save size={24} />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {/* Banner Edit */}
        <div className="relative h-40 rounded-[2rem] overflow-hidden group" onClick={handleBannerClick}>
          <img src={banner} loading="lazy" className={`w-full h-full object-cover transition-all duration-500 ${isGhostMode ? 'opacity-50 grayscale' : ''} ${isUploadingBanner ? 'scale-110 blur-sm' : ''}`} alt="Banner" />
          <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity cursor-pointer ${isUploadingBanner ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
            <Camera size={32} className={`text-white ${isUploadingBanner ? 'animate-bounce' : ''}`} />
          </div>
        </div>

        {/* Avatar Edit */}
        <div className="flex justify-center -mt-16 relative z-10">
          <div className="relative group" onClick={handleAvatarClick}>
            <div className={`w-32 h-32 rounded-[2.5rem] p-1 transition-all duration-500 ${isGhostMode ? 'bg-[#020F14]' : 'bg-[#062B34]'} ${isUploadingAvatar ? 'scale-95' : ''}`}>
              <img src={avatar} loading="lazy" className={`w-full h-full rounded-[2.3rem] object-cover transition-all duration-500 ${isUploadingAvatar ? 'brightness-50 blur-[2px]' : ''}`} alt="Avatar" />
            </div>
            <div className={`absolute inset-0 flex items-center justify-center transition-opacity cursor-pointer ${isUploadingAvatar ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
              <div className="bg-black/50 p-3 rounded-full backdrop-blur-sm">
                <Camera size={24} className={`text-white ${isUploadingAvatar ? 'animate-spin' : ''}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-4 ${isGhostMode ? 'text-[#80FFEC]' : 'text-white/40'}`}>Display Name</label>
            <div className={`flex items-center gap-3 p-4 rounded-2xl border ${isGhostMode ? 'bg-[#031820] border-[#2EC4B6]/20' : 'bg-[#0A2832] border-white/10'}`}>
              <UserIcon size={18} className={isGhostMode ? 'text-[#80FFEC]' : 'text-[#2EC4B6]'} />
              <input 
                type="text" 
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="flex-1 bg-transparent focus:outline-none text-sm font-bold text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-4 ${isGhostMode ? 'text-[#80FFEC]' : 'text-white/40'}`}>Username</label>
            <div className={`flex items-center gap-3 p-4 rounded-2xl border ${isGhostMode ? 'bg-[#031820] border-[#2EC4B6]/20' : 'bg-[#0A2832] border-white/10'}`}>
              <AtSign size={18} className={isGhostMode ? 'text-[#80FFEC]' : 'text-[#2EC4B6]'} />
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="flex-1 bg-transparent focus:outline-none text-sm font-bold text-white"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-4 ${isGhostMode ? 'text-[#80FFEC]' : 'text-white/40'}`}>Bio</label>
            <div className={`flex items-start gap-3 p-4 rounded-2xl border ${isGhostMode ? 'bg-[#031820] border-[#2EC4B6]/20' : 'bg-[#0A2832] border-white/10'}`}>
              <FileText size={18} className={`mt-1 ${isGhostMode ? 'text-[#80FFEC]' : 'text-[#2EC4B6]'}`} />
              <textarea 
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="flex-1 bg-transparent focus:outline-none text-sm font-medium resize-none h-24 text-white"
                maxLength={150}
              />
            </div>
            <p className="text-[9px] text-right opacity-40 font-mono text-white">{bio.length}/150</p>
          </div>
        </div>

        {/* Profile Card Editor */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles size={20} className={isGhostMode ? 'text-[#80FFEC]' : 'text-[#2EC4B6]'} />
            <h3 className="text-lg font-bold font-montserrat text-white">Vista Profile Card</h3>
          </div>
          
          <p className="text-xs mb-6 text-white/60">
            Customize the floating 3D card that other users see when they discover you on the Vista page.
          </p>

          {/* 3D Card Preview */}
          <div className="flex justify-center mb-8 perspective-1000">
            <div className={`w-64 h-80 rounded-3xl p-1 transition-all duration-500 rotate-y-12 hover:rotate-y-0 shadow-2xl ${CARD_SKINS.find(s => s.id === cardSkin)?.bg} ${CARD_SKINS.find(s => s.id === cardSkin)?.border}`}>
              <div className={`w-full h-full rounded-[1.4rem] flex flex-col items-center p-6 text-center ${CARD_SKINS.find(s => s.id === cardSkin)?.text} ${cardSkin === 'default' ? 'bg-white' : 'bg-black/10 backdrop-blur-sm'}`}>
                <div className="w-24 h-24 rounded-full p-1 bg-white/20 mb-4">
                  <img src={avatar} loading="lazy" className="w-full h-full rounded-full object-cover" alt="Avatar" />
                </div>
                <h4 className="text-xl font-black mb-1">{displayName || 'Your Name'}</h4>
                <p className="text-xs font-bold opacity-80 mb-4 tracking-widest uppercase">@{username || 'username'}</p>
                <p className="text-xs opacity-90 line-clamp-3">{bio || 'Your bio will appear here.'}</p>
                
                <div className="mt-auto flex gap-2 w-full">
                  <div className="h-8 flex-1 rounded-xl bg-white/20" />
                  <div className="h-8 w-8 rounded-xl bg-white/20" />
                </div>
              </div>
            </div>
          </div>

          {/* Skin Selector */}
          <div className="space-y-3">
            <label className={`text-[10px] font-black uppercase tracking-widest ml-4 flex items-center gap-2 ${isGhostMode ? 'text-[#80FFEC]' : 'text-white/40'}`}>
              <Palette size={14} /> Card Skin
            </label>
            <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar px-2">
              {CARD_SKINS.map(skin => (
                <button
                  key={skin.id}
                  onClick={() => setCardSkin(skin.id)}
                  className={`flex-shrink-0 w-20 h-28 rounded-2xl border-2 transition-all flex flex-col items-center justify-end p-2 ${skin.bg} ${cardSkin === skin.id ? 'scale-110 border-white shadow-xl' : 'scale-95 border-transparent opacity-60 hover:opacity-100'}`}
                >
                  <span className={`text-[9px] font-black uppercase tracking-tighter ${skin.text} ${skin.id === 'default' ? 'bg-gray-100 px-2 py-1 rounded-md' : 'bg-black/40 px-2 py-1 rounded-md backdrop-blur-sm'}`}>
                    {skin.name}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .rotate-y-12 { transform: rotateY(12deg) rotateX(12deg); }
        .hover\\:rotate-y-0:hover { transform: rotateY(0deg) rotateX(0deg); }
      `}</style>
    </div>
  );
});
