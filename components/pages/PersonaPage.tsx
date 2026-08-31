
import React, { useState } from 'react';
import { User } from '../../types';
import { Settings, Grid, Bookmark, Play, Share2, Ghost, Lock, Globe, Heart, Star, MoreHorizontal, Archive, Trash2, Eye, Clock, MessageSquare, X, Send } from 'lucide-react';
import { HushNote } from '../../types';
import { OptimizedImg } from '../common/OptimizedImg';
import { useToast } from '../../src/context/ToastContext';

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

const GRID_IMAGES = [
  'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&w=600&q=80',
  'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=600&q=80'
];

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
  const { showToast } = useToast();
  const [isPrivate, setIsPrivate] = useState(user?.isPrivate || false);
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'zaps' | 'stories'>('posts');
  const [archivedStories, setArchivedStories] = useState([
    { id: 'as1', imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80', timestamp: '2 days ago', views: 142, likes: 24 },
    { id: 'as2', imageUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600&q=80', timestamp: '5 days ago', views: 98, likes: 12 },
    { id: 'as3', imageUrl: 'https://images.unsplash.com/photo-1477959858617-67f30bc75b82?auto=format&fit=crop&w=600&q=80', timestamp: '1 week ago', views: 220, likes: 45 },
    { id: 'as4', imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=600&q=80', timestamp: '2 weeks ago', views: 185, likes: 30 },
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
    showToast("Shared archived story as active post!", 'success');
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
      imageUrl: GRID_IMAGES[index % GRID_IMAGES.length] || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80',
      caption: captions[index % captions.length] ?? "Moments captured in full flow ✨ #vizu #vibes",
      likes: 142 + index * 37,
      commentsCount: 18 + index * 4,
      comments: [
        { id: 'c1', user: 'Elena Vance', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80', text: 'This aesthetic is unreal! 😍', time: '2h ago' },
        { id: 'c2', user: 'Marcus Wright', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80', text: 'Stunning shot bro 🔥', time: '1h ago' },
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
    <div className={`min-h-full pb-24 transition-all duration-700 ${isGhostMode ? 'bg-[var(--app-bg-ghost)] text-[#F1FAEE]' : 'bg-[var(--app-bg)] text-slate-900 dark:text-[#F1FAEE]'}`}>
      <header className={`p-6 flex justify-between items-center transition-colors duration-500 ${isGhostMode ? 'bg-[var(--app-bg-ghost)] shadow-lg shadow-[color-mix(in_srgb,var(--app-accent)_10%,transparent)]' : 'bg-[var(--app-primary)] text-white'}`}>
        <div className="max-w-3xl mx-auto w-full flex justify-between items-center">
          <h1 className="text-xl font-bold font-montserrat">Persona</h1>
          <div className="flex items-center gap-2">
            <button onClick={handleToggleGhostWithHaptic} className={`p-2 rounded-xl transition-all ${isGhostMode ? 'bg-[var(--app-accent-light)] text-[var(--app-bg-ghost)] shadow-glow' : 'bg-white/10'}`} title="Ghost Mode"><Ghost size={22} /></button>
            <button onClick={onSettings} className="p-2 hover:bg-white/10 rounded-xl transition-all" title="Settings"><Settings size={22} /></button>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto w-full relative">
        {/* Cover */}
        <div className={`h-48 relative overflow-hidden transition-all duration-700 ${isGhostMode ? 'opacity-30 grayscale brightness-50' : 'opacity-100'}`}>
          <OptimizedImg src="https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80" alt="Cover" width={800} height={400} loading="lazy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {isGhostMode && <div className="absolute inset-0 bg-[color-mix(in_srgb,var(--app-accent)_10%,transparent)]" />}
        </div>

        <div className="px-6 -mt-20 mb-8 relative z-10">
          <div className="flex items-end justify-between mb-6">
            <div className="relative group">
              <div className={`p-1.5 rounded-[3rem] transition-all duration-500 ${isGhostMode ? 'bg-[var(--app-accent)] shadow-[0_0_30px_rgba(46,196,182,0.4)]' : 'bg-[var(--app-bg-surface)] shadow-2xl shadow-[color-mix(in_srgb,var(--app-primary)_20%,transparent)]'}`}>
                 <OptimizedImg src={user.avatar} alt={user.displayName} width={128} height={128} loading="lazy" className="w-32 h-32 rounded-[2.8rem] border-4 border-transparent object-cover group-hover:scale-105 transition-transform" />
              </div>
              <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-4 flex items-center justify-center ${isGhostMode ? 'bg-[var(--app-accent)] border-[var(--app-bg-ghost)]' : 'bg-[var(--app-accent)] border-[var(--app-primary)]'}`}>
                 <Star size={12} className="text-slate-900 dark:text-[#F1FAEE]" fill="currentColor" />
              </div>
            </div>
            <div className="flex gap-2 mb-2">
               <button className={`p-3.5 rounded-2xl shadow-lg transition-all active:scale-90 ${isGhostMode ? 'bg-[var(--app-bg-ghost)] text-[var(--app-accent-light)] border border-[color-mix(in_srgb,var(--app-accent)_20%,transparent)]' : 'bg-[var(--app-bg-surface)] text-slate-900 dark:text-[#F1FAEE] '}`}><Share2 size={20} /></button>
               <button onClick={onEditProfile} className={`px-8 py-3.5 rounded-2xl shadow-xl font-black text-xs uppercase tracking-widest transition-all active:scale-95 ${isGhostMode ? 'bg-[var(--app-accent)] text-[#062B34] font-black' : 'bg-[var(--app-accent)] text-[#062B34] font-black'}`}>Edit</button>
            </div>
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-3xl font-black">{user.displayName}</h2>
              <button className={`p-2 rounded-xl ${isGhostMode ? 'text-[var(--app-accent-light)]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-[#F1FAEE]'}`}><MoreHorizontal size={20} /></button>
            </div>
            <p className={`font-black text-sm mb-6 tracking-widest uppercase ${isGhostMode ? 'text-[var(--app-accent-light)]' : 'text-[var(--app-accent)]'}`}>@{user.username}</p>
            
            {/* Followers / Following */}
            <div className="flex gap-8 mb-8">
              <button className="flex flex-col items-start group" onClick={onConnections}>
                <span className="text-xl font-black">1.2K</span>
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isGhostMode ? 'text-[var(--app-accent-light)] group-hover:text-slate-900 dark:text-[#F1FAEE]' : 'text-slate-500 dark:text-slate-400 group-hover:text-[var(--app-accent)]'}`}>Followers</span>
              </button>
              <button className="flex flex-col items-start group" onClick={onConnections}>
                <span className="text-xl font-black">482</span>
                <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${isGhostMode ? 'text-[var(--app-accent-light)] group-hover:text-slate-900 dark:text-[#F1FAEE]' : 'text-slate-500 dark:text-slate-400 group-hover:text-[var(--app-accent)]'}`}>Following</span>
              </button>
            </div>

            <p className={`text-sm leading-relaxed mb-10 ${isGhostMode ? 'text-slate-500 dark:text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>{user.bio}</p>

            {/* Account Status Toggle */}
            {!isGhostMode && (
              <div className={`p-6 rounded-[2.5rem] border mb-6 transition-colors ${isGhostMode ? 'bg-[var(--app-bg-ghost)] border-[color-mix(in_srgb,var(--app-accent)_20%,transparent)]' : 'bg-[var(--app-bg-surface)] border-white/10 shadow-sm'}`}>
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
              className={`flex-1 min-w-[70px] py-4 text-[9px] font-black uppercase tracking-wider transition-all border-b-2 ${activeTab === 'posts' ? (isGhostMode ? 'text-[var(--app-accent-light)] border-[var(--app-accent-light)]' : 'text-[var(--app-accent)] border-[var(--app-accent)]') : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-[#F1FAEE] border-transparent'}`}
            >
              <Grid size={15} className="mx-auto mb-1" />
              Posts
            </button>
            <button 
              onClick={() => setActiveTab('zaps')}
              className={`flex-1 min-w-[70px] py-4 text-[9px] font-black uppercase tracking-wider transition-all border-b-2 ${activeTab === 'zaps' ? (isGhostMode ? 'text-[var(--app-accent-light)] border-[var(--app-accent-light)]' : 'text-[var(--app-accent)] border-[var(--app-accent)]') : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-[#F1FAEE] border-transparent'}`}
            >
              <Play size={15} className="mx-auto mb-1" />
              Zaps
            </button>
            <button 
              onClick={() => setActiveTab('saved')}
              className={`flex-1 min-w-[70px] py-4 text-[9px] font-black uppercase tracking-wider transition-all border-b-2 ${activeTab === 'saved' ? (isGhostMode ? 'text-[var(--app-accent-light)] border-[var(--app-accent-light)]' : 'text-[var(--app-accent)] border-[var(--app-accent)]') : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-[#F1FAEE] border-transparent'}`}
            >
              <Bookmark size={15} className="mx-auto mb-1" />
              Saved
            </button>
            <button 
              onClick={() => setActiveTab('stories')}
              className={`flex-1 min-w-[70px] py-4 text-[9px] font-black uppercase tracking-wider transition-all border-b-2 ${activeTab === 'stories' ? (isGhostMode ? 'text-[var(--app-accent-light)] border-[var(--app-accent-light)]' : 'text-[var(--app-accent)] border-[var(--app-accent)]') : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-[#F1FAEE] border-transparent'}`}
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
                    isGhostMode ? 'border-[color-mix(in_srgb,var(--app-accent)_20%,transparent)] shadow-glow shadow-[color-mix(in_srgb,var(--app-accent)_5%,transparent)] bg-[var(--app-bg-ghost)]' : 'border-white/10 shadow-md bg-[var(--app-bg-surface)]'
                  }`}
                >
                  <OptimizedImg src={story.imageUrl} alt="Archived story" width={200} height={350} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent flex flex-col justify-end p-4 text-slate-900 dark:text-[#F1FAEE]">
                    <p className="text-[10px] uppercase font-black tracking-widest text-[var(--app-accent)] flex items-center gap-1">
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
                    <OptimizedImg src={GRID_IMAGES[i % GRID_IMAGES.length] || 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=600&q=80'} alt={`Post ${i + 1}`} width={200} height={200} loading="lazy" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 text-slate-900 dark:text-[#F1FAEE] text-xs font-bold">
                      <span className="flex items-center gap-1"><Heart size={14} fill="currentColor" className="text-red-400" /> {142 + i * 37}</span>
                      <span className="flex items-center gap-1"><MessageSquare size={14} fill="currentColor" /> {18 + i * 4}</span>
                    </div>
                    {activeTab === 'zaps' && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={24} className="text-slate-900 dark:text-[#F1FAEE]" fill="currentColor" />
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
            isGhostMode ? 'bg-[var(--app-primary)] text-[#F1FAEE] border-[color-mix(in_srgb,var(--app-accent)_20%,transparent)]' : 'bg-white text-slate-900 dark:text-[#F1FAEE] border-black/5'
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
                className={`p-2 rounded-xl transition-all ${isGhostMode ? 'hover:bg-white/10 text-slate-500 dark:text-slate-400' : 'hover:bg-black/5 text-slate-500 dark:text-slate-400'}`}
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
                    selectedPostDetail.isLiked ? 'text-red-500' : isGhostMode ? 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-[#F1FAEE]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-[#F1FAEE]'
                  }`}
                >
                  <Heart size={20} fill={selectedPostDetail.isLiked ? 'currentColor' : 'none'} />
                  <span>{selectedPostDetail.likes}</span>
                </button>

                <div className={`flex items-center gap-1.5 text-xs font-bold ${isGhostMode ? 'text-slate-500 dark:text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  <MessageSquare size={19} />
                  <span>{selectedPostDetail.commentsCount}</span>
                </div>

                <button className={`transition-all active:scale-90 ${isGhostMode ? 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-[#F1FAEE]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-[#F1FAEE]'}`}>
                  <Share2 size={19} />
                </button>
              </div>

              <button className={`transition-all active:scale-90 ${isGhostMode ? 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-[#F1FAEE]' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:text-[#F1FAEE]'}`}>
                <Bookmark size={19} />
              </button>
            </div>

            {/* Caption */}
            <p className={`text-xs font-medium leading-relaxed mb-4 ${isGhostMode ? 'text-slate-900 dark:text-[#F1FAEE]' : 'text-slate-500 dark:text-slate-400'}`}>
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
                      <span className={`font-normal opacity-80 ml-1 ${isGhostMode ? 'text-slate-500 dark:text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>{comment.text}</span>
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
                  isGhostMode ? 'bg-white/10 border-white/10 text-slate-900 dark:text-[#F1FAEE] placeholder:text-slate-500 dark:text-slate-400' : 'bg-primary/5 border-primary/10 text-slate-900 dark:text-[#F1FAEE] placeholder:text-slate-500 dark:text-slate-400'
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
            isGhostMode ? 'bg-[var(--app-primary)] text-[#F1FAEE] border-[color-mix(in_srgb,var(--app-accent)_20%,transparent)]' : 'bg-white text-slate-900 dark:text-[#F1FAEE] border-black/5'
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
              <div className="absolute bottom-4 left-4 right-4 bg-black/60 p-3 rounded-xl backdrop-blur-sm text-slate-900 dark:text-[#F1FAEE] text-xs flex justify-between">
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
