
import React, { useState } from 'react';
import { User } from '../../types';
import { Settings, Grid, Bookmark, Play, Share2, Ghost, Lock, Globe, Heart, Star, MoreHorizontal, Archive, Trash2, Eye, Clock, MessageSquare, X, Send } from 'lucide-react';
import { HushNote } from '../../types';
import { OptimizedImg } from '../common/OptimizedImg';

interface PersonaPageProps {
  user: User | null;
  isGhostMode: boolean;
  onToggleGhost: () => void;
  isDarkMode?: boolean;
  onToggleTheme?: () => void;
  onSettings: () => void;
  onConnections: () => void;
  onEditProfile: () => void;
  userNotes?: HushNote[];
}

export const PersonaPage: React.FC<PersonaPageProps> = React.memo(({ 
  user, 
  isGhostMode, 
  onToggleGhost, 
  isDarkMode: _isDarkMode = false,
  onToggleTheme: _onToggleTheme,
  onSettings, 
  onConnections, 
  onEditProfile 
}) => {
  const [isPrivate, setIsPrivate] = useState(user?.isPrivate || false);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'zaps' | 'stories'>('posts');
  const [archivedStories, setArchivedStories] = useState([
    { id: 'as1', imageUrl: 'https://picsum.photos/seed/arch1/400/700', timestamp: '2 days ago', views: 142, likes: 24 },
    { id: 'as2', imageUrl: 'https://picsum.photos/seed/arch2/400/700', timestamp: '5 days ago', views: 98, likes: 12 },
    { id: 'as3', imageUrl: 'https://picsum.photos/seed/arch3/400/700', timestamp: '1 week ago', views: 220, likes: 45 },
    { id: 'as4', imageUrl: 'https://picsum.photos/seed/arch4/400/700', timestamp: '2 weeks ago', views: 185, likes: 30 },
  ]);
  const [selectedArchivedStory, setSelectedArchivedStory] = useState<any | null>(null);

  // Selected post detail modal state
  const [selectedPostDetail, setSelectedPostDetail] = useState<{
    id: string;
    imageUrl: string;
    caption: string;
    likes: number;
    commentsCount: number;
    comments: { id: string; user: string; avatar: string; text: string; time: string }[];
    timestamp: string;
    isLiked: boolean;
  } | null>(null);

  const [newCommentText, setNewCommentText] = useState('');

  if (!user) return null;

  const handleDeleteStory = (id: string) => {
    setArchivedStories(prev => prev.filter(story => story.id !== id));
    setSelectedArchivedStory(null);
  };

  const handleShareStoryAsPost = (_story: { id: string }) => {
    alert("Shared archived story as active post!");
    setSelectedArchivedStory(null);
  };

  const handleToggleGhostWithHaptic = () => {
    if (navigator.vibrate) {
      if (!isGhostMode) {
        navigator.vibrate([150, 80, 150]);
      } else {
        navigator.vibrate([50, 50]);
      }
    }
    onToggleGhost();
  };

  const handlePostClick = (index: number) => {
    const seed = `p-${activeTab}-${index}`;
    const captions = [
      "Moments captured in full flow ✨ #vizu #vibes",
      "Sunset reflections and late night thoughts 🌅",
      "Exploring new horizons with the squad 🔥",
      "Designing the future of social networks 🚀",
      "Pure energy and unstoppable momentum ⚡",
      "Grateful for this beautiful journey 🌿"
    ];

    setSelectedPostDetail({
      id: `post-${index}`,
      imageUrl: `https://picsum.photos/seed/${seed}/800`,
      caption: captions[index % captions.length] ?? "Moments captured in full flow ✨ #vizu #vibes",
      likes: 142 + index * 37,
      commentsCount: 18 + index * 4,
      comments: [
        { id: 'c1', user: 'Elena Vance', avatar: 'https://picsum.photos/seed/elena/100', text: 'This aesthetic is unreal! 😍', time: '2h ago' },
        { id: 'c2', user: 'Marcus Wright', avatar: 'https://picsum.photos/seed/marcus/100', text: 'Stunning shot bro 🔥', time: '1h ago' },
      ],
      timestamp: `${index + 1}d ago`,
      isLiked: false,
    });
  };

  const handleAddComment = () => {
    if (!newCommentText.trim() || !selectedPostDetail) return;
    const newComment = {
      id: Date.now().toString(),
      user: user.displayName,
      avatar: user.avatar,
      text: newCommentText.trim(),
      time: 'Just now',
    };

    setSelectedPostDetail(prev => prev ? {
      ...prev,
      commentsCount: prev.commentsCount + 1,
      comments: [...prev.comments, newComment],
    } : null);

    setNewCommentText('');
  };

  const handleToggleLikePost = () => {
    if (!selectedPostDetail) return;
    setSelectedPostDetail(prev => prev ? {
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1,
    } : null);
  };

  if (!user) {
    return null;
  }

  return (
    <div className={`min-h-full pb-24 transition-all duration-700 ${isGhostMode ? 'bg-[#03171C] text-[#F1FAEE]' : 'bg-[var(--app-bg,#FFF9E6)] text-[var(--text-primary,#0B1720)]'}`}>
      <header className={`p-6 flex justify-between items-center transition-colors duration-500 ${isGhostMode ? 'bg-[#03171C] shadow-lg shadow-[#2EC4B6]/10' : 'bg-[#062B34] text-white'}`}>
        <h1 className="text-xl font-bold font-montserrat">Persona</h1>
        <div className="flex items-center gap-2">
          <button onClick={handleToggleGhostWithHaptic} className={`p-2 rounded-xl transition-all ${isGhostMode ? 'bg-[#80FFEC] text-[#03171C] shadow-glow' : 'bg-white/10'}`} title="Ghost Mode"><Ghost size={22} /></button>
          <button onClick={onSettings} className="p-2 hover:bg-white/10 rounded-xl transition-all" title="Settings"><Settings size={22} /></button>
        </div>
      </header>

      <div className="relative">
        {/* Cover */}
        <div className={`h-48 relative overflow-hidden transition-all duration-700 ${isGhostMode ? 'opacity-30 grayscale brightness-50' : 'opacity-100'}`}>
          <OptimizedImg src="https://picsum.photos/seed/cover/800/400" alt="Cover" width={800} height={400} loading="lazy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {isGhostMode && <div className="absolute inset-0 bg-[#2EC4B6]/10" />}
        </div>

        <div className="px-6 -mt-20 mb-8 relative z-10">
          <div className="flex items-end justify-between mb-6">
            <div className="relative group">
              <div className={`p-1.5 rounded-[3rem] transition-all duration-500 ${isGhostMode ? 'bg-[#2EC4B6] shadow-[0_0_30px_rgba(46,196,182,0.4)]' : 'bg-[#0A2832] shadow-2xl shadow-[#062B34]/20'}`}>
                 <OptimizedImg src={user.avatar} alt={user.displayName} width={128} height={128} loading="lazy" className="w-32 h-32 rounded-[2.8rem] border-4 border-transparent object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-4 flex items-center justify-center ${isGhostMode ? 'bg-[#2EC4B6] border-[#03171C]' : 'bg-[#2EC4B6] border-[#062B34]'}`}>
                 <Star size={12} className="text-[#062B34]" fill="currentColor" />
              </div>
            </div>
            <div className="flex gap-2 mb-2">
               <button className={`p-3.5 rounded-2xl shadow-lg transition-all active:scale-90 ${isGhostMode ? 'bg-[#03171C] text-[#80FFEC] border border-[#2EC4B6]/20' : 'bg-[#0A2832] text-white'}`}><Share2 size={20} /></button>
               <button onClick={onEditProfile} className={`px-8 py-3.5 rounded-2xl shadow-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${isGhostMode ? 'bg-[#2EC4B6] text-[#062B34]' : 'bg-[#2EC4B6] text-[#062B34]'}`}>Edit</button>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-3xl font-black">{user.displayName}</h2>
              <button className={`p-2 rounded-xl ${isGhostMode ? 'text-[#80FFEC]' : 'text-white/40'}`}><MoreHorizontal size={20} /></button>
            </div>
            <p className={`font-black text-sm mb-6 tracking-widest uppercase ${isGhostMode ? 'text-[#80FFEC]' : 'text-[#2EC4B6]'}`}>@{user.username}</p>
            
            {/* Followers / Following */}
            <div className="flex gap-8 mb-8">
              <button className="flex flex-col items-start group" onClick={onConnections}>
                <span className="text-xl font-black">1.2K</span>
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isGhostMode ? 'text-[#80FFEC] group-hover:text-white' : 'text-white/40 group-hover:text-[#2EC4B6]'}`}>Followers</span>
              </button>
              <button className="flex flex-col items-start group" onClick={onConnections}>
                <span className="text-xl font-black">482</span>
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isGhostMode ? 'text-[#80FFEC] group-hover:text-white' : 'text-white/40 group-hover:text-[#2EC4B6]'}`}>Following</span>
              </button>
            </div>

            <p className={`text-sm leading-relaxed mb-10 ${isGhostMode ? 'text-white/60' : 'text-white/80'}`}>{user.bio}</p>

            {/* Account Status Toggle */}
            {!isGhostMode && (
              <div className={`p-6 rounded-[2.5rem] border mb-6 transition-colors ${isGhostMode ? 'bg-[#03171C] border-[#2EC4B6]/20' : 'bg-[#0A2832] border-white/10 shadow-sm'}`}>
                 <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                       <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${isPrivate ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                          {isPrivate ? <Lock size={22} /> : <Globe size={22} />}
                       </div>
                       <div>
                          <h4 className="text-sm font-bold">Visibility Status</h4>
                          <p className={`text-[10px] font-black uppercase tracking-tight ${isPrivate ? 'text-red-400/60' : 'text-green-400/60'}`}>{isPrivate ? 'Private Persona' : 'Public Explorer'}</p>
                       </div>
                    </div>
                    <button 
                      onClick={() => setIsPrivate(!isPrivate)}
                      className={`w-14 h-8 rounded-full p-1 transition-all flex items-center ${isPrivate ? 'bg-red-500 justify-end' : 'bg-green-500 justify-start'}`}
                    >
                      <div className="w-6 h-6 bg-white rounded-full shadow-lg" />
                    </button>
                 </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <div className="flex border-b border-white/10 mb-6 overflow-x-auto no-scrollbar">
            <button 
              onClick={() => setActiveTab('posts')}
              className={`flex-1 min-w-[70px] py-4 text-[9px] font-black uppercase tracking-wider transition-all border-b-2 ${activeTab === 'posts' ? (isGhostMode ? 'text-[#80FFEC] border-[#80FFEC]' : 'text-[#2EC4B6] border-[#2EC4B6]') : 'text-white/40 border-transparent'}`}
            >
              <Grid size={15} className="mx-auto mb-1" />
              Posts
            </button>
            <button 
              onClick={() => setActiveTab('zaps')}
              className={`flex-1 min-w-[70px] py-4 text-[9px] font-black uppercase tracking-wider transition-all border-b-2 ${activeTab === 'zaps' ? (isGhostMode ? 'text-[#80FFEC] border-[#80FFEC]' : 'text-[#2EC4B6] border-[#2EC4B6]') : 'text-white/40 border-transparent'}`}
            >
              <Play size={15} className="mx-auto mb-1" />
              Zaps
            </button>
            <button 
              onClick={() => setActiveTab('saved')}
              className={`flex-1 min-w-[70px] py-4 text-[9px] font-black uppercase tracking-wider transition-all border-b-2 ${activeTab === 'saved' ? (isGhostMode ? 'text-[#80FFEC] border-[#80FFEC]' : 'text-[#2EC4B6] border-[#2EC4B6]') : 'text-white/40 border-transparent'}`}
            >
              <Bookmark size={15} className="mx-auto mb-1" />
              Saved
            </button>
            <button 
              onClick={() => setActiveTab('stories')}
              className={`flex-1 min-w-[70px] py-4 text-[9px] font-black uppercase tracking-wider transition-all border-b-2 ${activeTab === 'stories' ? (isGhostMode ? 'text-[#80FFEC] border-[#80FFEC]' : 'text-[#2EC4B6] border-[#2EC4B6]') : 'text-white/40 border-transparent'}`}
            >
              <Archive size={15} className="mx-auto mb-1" />
              Stories
            </button>
          </div>

          {activeTab === 'stories' ? (
            <div className="grid grid-cols-2 gap-3 pb-8">
              {archivedStories.map((story) => (
                <div 
                  key={story.id} 
                  onClick={() => setSelectedArchivedStory(story)}
                  className={`aspect-[9/16] relative overflow-hidden rounded-[2rem] border cursor-pointer hover:scale-[1.02] active:scale-98 transition-all group ${
                    isGhostMode ? 'border-[#2EC4B6]/20 shadow-glow shadow-[#2EC4B6]/5 bg-[#03171C]' : 'border-white/10 shadow-md bg-[#0A2832]'
                  }`}
                >
                  <OptimizedImg src={story.imageUrl} alt="Archived story" width={200} height={350} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-4 text-white">
                    <p className="text-[10px] uppercase font-black tracking-widest text-[#2EC4B6] flex items-center gap-1">
                      <Clock size={10} /> {story.timestamp}
                    </p>
                    <div className="flex justify-between items-center mt-1.5 pt-1.5 border-t border-white/10">
                      <span className="text-[10px] font-bold flex items-center gap-1 opacity-95">
                        <Eye size={12} /> {story.views}
                      </span>
                      <span className="text-[10px] font-bold flex items-center gap-1 opacity-95 text-red-400">
                        <Heart size={12} fill="currentColor" /> {story.likes}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {archivedStories.length === 0 && (
                <div className="col-span-2 text-center py-12">
                  <Archive size={32} className="mx-auto opacity-20 mb-2" />
                  <p className="text-xs font-bold tracking-widest opacity-40 uppercase">No Archived Stories</p>
                </div>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-1.5">
               {[...Array(6)].map((_, i) => (
                 <div 
                   key={i} 
                   onClick={() => handlePostClick(i)}
                   className={`aspect-square relative overflow-hidden rounded-2xl group cursor-pointer transition-transform duration-300 hover:scale-[1.03] active:scale-95 ${
                     isGhostMode ? 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100' : ''
                   }`}
                 >
                    <OptimizedImg src={`https://picsum.photos/seed/p-${activeTab}-${i}/400`} alt={`Post ${i + 1}`} width={200} height={200} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-white text-xs font-bold">
                      <span className="flex items-center gap-1"><Heart size={14} fill="currentColor" className="text-red-400" /> {142 + i * 37}</span>
                      <span className="flex items-center gap-1"><MessageSquare size={14} fill="currentColor" /> {18 + i * 4}</span>
                    </div>
                    {activeTab === 'zaps' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={24} className="text-white" fill="currentColor" />
                      </div>
                    )}
                 </div>
               ))}
            </div>
          )}
        </div>
      </div>

      {/* Post Detail Info Modal */}
      {selectedPostDetail && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in overflow-y-auto">
          <div className={`w-full max-w-lg rounded-[2.5rem] p-6 shadow-2xl animate-scale-up border my-auto ${
            isGhostMode ? 'bg-[#062B34] text-[#F1FAEE] border-[#2EC4B6]/20' : 'bg-white text-primary border-black/5'
          }`}>
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
              <div className="flex items-center gap-3">
                <OptimizedImg src={user.avatar} alt={user.displayName} width={40} height={40} loading="lazy" className="w-10 h-10 rounded-2xl object-cover border border-secondary" />
                <div>
                  <h4 className="text-sm font-bold leading-tight">{user.displayName}</h4>
                  <p className="text-[10px] opacity-40 font-mono">@{user.username} • {selectedPostDetail.timestamp}</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedPostDetail(null)}
                className={`p-2 rounded-xl transition-all ${isGhostMode ? 'hover:bg-white/10 text-white/60' : 'hover:bg-black/5 text-primary/60'}`}
              >
                <X size={20} />
              </button>
            </div>

            {/* Image Preview */}
            <div className="aspect-square rounded-2xl overflow-hidden relative mb-4 border border-black/5 shadow-md">
              <OptimizedImg src={selectedPostDetail.imageUrl} alt="Post detail" width={400} height={400} loading="lazy" className="w-full h-full object-cover" />
            </div>

            {/* Actions Bar */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-4">
                <button 
                  onClick={handleToggleLikePost}
                  className={`flex items-center gap-1.5 text-xs font-bold transition-all active:scale-90 ${
                    selectedPostDetail.isLiked ? 'text-red-500' : isGhostMode ? 'text-white/60 hover:text-white' : 'text-primary/60 hover:text-primary'
                  }`}
                >
                  <Heart size={20} fill={selectedPostDetail.isLiked ? 'currentColor' : 'none'} />
                  <span>{selectedPostDetail.likes}</span>
                </button>

                <div className={`flex items-center gap-1.5 text-xs font-bold ${isGhostMode ? 'text-white/60' : 'text-primary/60'}`}>
                  <MessageSquare size={19} />
                  <span>{selectedPostDetail.commentsCount}</span>
                </div>

                <button className={`transition-all active:scale-90 ${isGhostMode ? 'text-white/60 hover:text-white' : 'text-primary/60 hover:text-primary'}`}>
                  <Share2 size={19} />
                </button>
              </div>

              <button className={`transition-all active:scale-90 ${isGhostMode ? 'text-white/60 hover:text-white' : 'text-primary/60 hover:text-primary'}`}>
                <Bookmark size={19} />
              </button>
            </div>

            {/* Caption */}
            <p className={`text-xs font-medium leading-relaxed mb-4 ${isGhostMode ? 'text-white/80' : 'text-primary/80'}`}>
              {selectedPostDetail.caption}
            </p>

            {/* Comments List */}
            <div className="space-y-3 max-h-48 overflow-y-auto pr-1 mb-4 border-t border-b border-primary/5 py-3 no-scrollbar">
              {selectedPostDetail.comments.map((comment) => (
                <div key={comment.id} className="flex gap-2.5 items-start text-xs">
                  <OptimizedImg src={comment.avatar} alt={comment.user} width={28} height={28} loading="lazy" className="w-7 h-7 rounded-xl object-cover shrink-0 mt-0.5" />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-[11px]">
                      {comment.user}{' '}
                      <span className={`font-normal opacity-80 ml-1 ${isGhostMode ? 'text-white/70' : 'text-primary/70'}`}>{comment.text}</span>
                    </p>
                    <p className="text-[9px] opacity-40 font-mono mt-0.5">{comment.time}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Comment Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddComment()}
                placeholder="Add a comment..."
                className={`flex-1 px-4 py-2.5 rounded-xl text-xs focus:outline-none border transition-all ${
                  isGhostMode ? 'bg-white/10 border-white/10 text-white placeholder:text-white/40' : 'bg-primary/5 border-primary/10 text-primary placeholder:text-primary/40'
                }`}
              />
              <button
                onClick={handleAddComment}
                className="p-2.5 rounded-xl bg-secondary text-white hover:brightness-110 active:scale-90 transition-all"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Archive Story Management Modal */}
      {selectedArchivedStory && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/70 backdrop-blur-md animate-fade-in">
          <div className={`w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl animate-scale-up border ${
            isGhostMode ? 'bg-[#062B34] text-[#F1FAEE] border-[#2EC4B6]/20' : 'bg-white text-primary border-black/5'
          }`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
                <Archive size={18} className="text-secondary animate-pulse" /> Story Detail
              </h3>
              <button 
                onClick={() => setSelectedArchivedStory(null)} 
                className={`text-xs font-black uppercase tracking-widest py-1 px-3 border rounded-lg ${isGhostMode ? 'border-white/10 hover:bg-white/5' : 'border-black/5 hover:bg-black/5'}`}
              >
                Close
              </button>
            </div>
            
            <div className="aspect-[9/16] rounded-2xl overflow-hidden relative mb-4">
              <OptimizedImg src={selectedArchivedStory.imageUrl} alt="Archived story detail" width={300} height={533} loading="lazy" className="w-full h-full object-cover" />
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 p-3 rounded-xl backdrop-blur-sm text-white text-xs flex justify-between">
                <span className="flex items-center gap-1"><Eye size={12} /> {selectedArchivedStory.views} Views</span>
                <span className="flex items-center gap-1 text-red-400"><Heart size={12} fill="currentColor" /> {selectedArchivedStory.likes} Likes</span>
              </div>
            </div>

            <p className="text-xs text-center opacity-60 mb-4 uppercase font-bold tracking-widest">Archived {selectedArchivedStory.timestamp}</p>

            <div className="flex gap-2.5">
              <button 
                onClick={() => handleDeleteStory(selectedArchivedStory.id)}
                className="flex-1 py-3.5 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 active:scale-95 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5"
              >
                <Trash2 size={14} /> Delete
              </button>
              <button 
                onClick={() => handleShareStoryAsPost(selectedArchivedStory)}
                className="flex-1 py-3.5 rounded-xl bg-secondary text-white shadow-md hover:brightness-110 active:scale-95 transition-all text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-1.5"
              >
                <Share2 size={13} /> Share Post
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`
        .shadow-glow { box-shadow: 0 0 20px rgba(128, 255, 236, 0.4); }
      `}</style>
    </div>
  );
});
