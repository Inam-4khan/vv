import React, { useState, useRef, useEffect } from 'react';
import { MOCK_POSTS, MOCK_STORIES, MOCK_USERS } from '../../constants';
import { 
  Compass, 
  Plus, 
  Heart, 
  MessageCircle, 
  Send, 
  MoreVertical, 
  Bookmark, 
  Bell, 
  RefreshCw, 
  Image as ImageIcon, 
  Sparkles, 
  MapPin, 
  Music, 
  X 
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { OptimizedImg } from '../common/OptimizedImg';
import { useToast } from '../../src/context/ToastContext';
import { Post } from '../../types';

interface FlowPageProps {
  onExplore?: () => void;
  onNotifications?: () => void;
  onAddStory?: () => void;
  onViewStory?: (storyId: string) => void;
  isGhostMode?: boolean;
}

const PRESET_MEDIA = [
  { id: '1', title: 'Urban Neon', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80' },
  { id: '2', title: 'Studio Setup', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80' },
  { id: '3', title: 'Late Night Code', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80' },
  { id: '4', title: 'Golden Horizon', url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80' },
];

export const FlowPage: React.FC<FlowPageProps> = React.memo(({ onExplore, onNotifications, onAddStory, onViewStory, isGhostMode }) => {
  const { showToast } = useToast();
  const [posts, setPosts] = useState<Post[]>(MOCK_POSTS);
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  
  const getCombinedStories = () => {
    try {
      const custom = localStorage.getItem('vizu_custom_stories');
      if (custom) {
        const parsed = JSON.parse(custom);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return [...parsed, ...MOCK_STORIES];
        }
      }
    } catch (e) {
      console.error(e);
    }
    return MOCK_STORIES;
  };

  const [stories, setStories] = useState(getCombinedStories);

  useEffect(() => {
    setStories(getCombinedStories());
  }, []);

  // Post Creator State
  const [postContent, setPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [isMediaPickerOpen, setIsMediaPickerOpen] = useState(false);
  const [isPosting, setIsPosting] = useState(false);

  // Comments modal state
  const [activeCommentsPostId, setActiveCommentsPostId] = useState<string | null>(null);
  const [postComments, setPostComments] = useState<Record<string, Array<{ id: string; user: string; text: string; time: string }>>>({
    p1: [
      { id: 'c1', user: 'maya_codes', text: 'That sound design was mind-blowing! 🔥', time: '1h ago' },
      { id: 'c2', user: 'sam_vista', text: 'Visuals complemented the rhythm so well.', time: '35m ago' }
    ],
    p2: [
      { id: 'c3', user: 'alex_rhythm', text: 'Love the minimalist keyboard layout 👌', time: '2h ago' }
    ]
  });
  const [newCommentText, setNewCommentText] = useState('');

  // Pull to refresh state
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStartPos, setTouchStartPos] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleLike = (id: string) => {
    if (navigator.vibrate) navigator.vibrate(15);
    setLikedPosts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const toggleSave = (id: string) => {
    if (navigator.vibrate) navigator.vibrate(15);
    setSavedPosts(prev => {
      const isSaved = prev.includes(id);
      showToast(isSaved ? 'Post removed from bookmarks' : 'Post saved to bookmarks!', isSaved ? 'info' : 'success');
      return isSaved ? prev.filter(p => p !== id) : [...prev, id];
    });
  };

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!postContent.trim() && !selectedImage) {
      showToast('Please enter some thoughts or select a photo.', 'info');
      return;
    }

    setIsPosting(true);
    setTimeout(() => {
      const newPost: Post = {
        id: `post-${Date.now()}`,
        userId: MOCK_USERS[0]?.id || '1',
        username: MOCK_USERS[0]?.username || 'alex_rhythm',
        content: postContent.trim(),
        image: selectedImage || undefined,
        likes: 0,
        comments: 0,
        timestamp: 'Just now',
        type: 'flow',
        bandName: selectedTag || 'Flow Vibes'
      };

      setPosts(prev => [newPost, ...prev]);
      setPostContent('');
      setSelectedImage(null);
      setSelectedTag(null);
      setIsMediaPickerOpen(false);
      setIsPosting(false);
      showToast('Post shared to Flow successfully!', 'success');
    }, 400);
  };

  const handleAddComment = (postId: string) => {
    if (!newCommentText.trim()) return;
    const newComment = {
      id: `comm-${Date.now()}`,
      user: MOCK_USERS[0]?.username || 'alex_rhythm',
      text: newCommentText.trim(),
      time: 'Just now'
    };

    setPostComments(prev => ({
      ...prev,
      [postId]: [...(prev[postId] || []), newComment]
    }));

    setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: p.comments + 1 } : p));
    setNewCommentText('');
    showToast('Comment posted!', 'success');
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touch && containerRef.current && containerRef.current.scrollTop === 0) {
      setTouchStartPos(touch.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (touchStartPos !== null && touch && containerRef.current && containerRef.current.scrollTop <= 0) {
      const currentY = touch.clientY;
      const distance = currentY - touchStartPos;
      if (distance > 0) {
        setPullDistance(Math.min(distance * 0.45, 110));
      }
    }
  };

  const handleTouchEnd = () => {
    if (pullDistance >= 55 && !isRefreshing) {
      triggerRefresh();
    } else {
      setPullDistance(0);
    }
    setTouchStartPos(null);
  };

  const triggerRefresh = () => {
    setIsRefreshing(true);
    setPullDistance(65);
    setTimeout(() => {
      setStories(prev => [...prev.map(s => ({ ...s, isSeen: false }))]);
      setIsRefreshing(false);
      setPullDistance(0);
      showToast('Flow feed & stories refreshed!', 'success');
    }, 1000);
  };

  return (
    <div 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`min-h-full transition-all duration-500 pb-24 ${
        isGhostMode ? 'bg-[var(--app-bg-ghost)] text-[#F1FAEE]' : 'bg-[var(--app-bg)] text-slate-900 dark:text-[#F1FAEE]'
      }`}
    >
      {/* Pull to Refresh Indicator */}
      <div 
        className="overflow-hidden transition-all duration-200 flex items-center justify-center pointer-events-none select-none"
        style={{ height: `${pullDistance}px`, opacity: pullDistance > 10 ? 1 : 0 }}
      >
        <div className={`flex items-center gap-2.5 px-4 py-2 rounded-full border backdrop-blur-md shadow-md text-xs font-bold ${
          isGhostMode 
            ? 'bg-[color-mix(in_srgb,var(--app-primary)_90%,transparent)] border-[color-mix(in_srgb,var(--app-accent)_20%,transparent)] text-[var(--app-accent-light)]' 
            : 'bg-white/90 border-[#20878E]/20 text-slate-900 dark:text-[#F1FAEE]'
        }`}>
          <RefreshCw 
            size={16} 
            className={`${isRefreshing ? 'animate-spin text-[var(--app-accent)]' : ''}`} 
            style={{ transform: !isRefreshing ? `rotate(${pullDistance * 3}deg)` : undefined }}
          />
          <span>{isRefreshing ? 'Refreshing stories & feed...' : pullDistance >= 55 ? 'Release to refresh' : 'Pull to refresh'}</span>
        </div>
      </div>

      {/* Header */}
      <header className={`p-5 sticky top-0 z-40 shadow-md transition-colors duration-500 text-white ${isGhostMode ? 'bg-[var(--app-bg-ghost)]' : 'bg-[var(--app-primary)]'}`}>
        <div className="max-w-2xl mx-auto flex justify-between items-center animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="animate-vizu-logo-entrance inline-flex items-center justify-center">
              <BrandLogo size={30} color={isGhostMode ? 'var(--app-accent-light)' : 'var(--app-bg)'} />
            </div>
            <div className="flex flex-col">
              <span className={`text-[10px] font-black tracking-[0.3em] leading-none mb-1 uppercase ${isGhostMode ? 'text-[var(--app-accent-light)]' : 'text-[var(--app-accent)]'}`}>VIZU</span>
              <h1 className="text-xl font-bold font-montserrat tracking-tight leading-none text-white">Flow</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onNotifications} className="p-2 hover:bg-white/10 rounded-full transition-colors relative" title="Notifications">
              <Bell size={20} className="text-white/80" />
              <div className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[var(--app-primary)] animate-pulse" />
            </button>
            <button onClick={onExplore} className="p-2 hover:bg-white/10 rounded-full transition-colors md:hidden" title="Explore">
              <Compass size={20} className="text-white/80" />
            </button>
          </div>
        </div>
      </header>

      {/* Stories Bar */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-5 pb-3">
        <div className="flex items-center justify-between px-1 mb-2.5">
          <span className={`text-[10px] font-black uppercase tracking-[0.25em] ${isGhostMode ? 'text-[var(--app-accent-light)]' : 'text-slate-500 dark:text-slate-400'}`}>
            Live Stories & Vibes
          </span>
          <button 
            onClick={onAddStory}
            className={`text-[10px] font-bold flex items-center gap-1 transition-colors ${isGhostMode ? 'text-[var(--app-accent-light)] hover:underline' : 'text-secondary hover:underline'}`}
          >
            <Plus size={12} /> Add Story
          </button>
        </div>

        <div className="overflow-x-auto no-scrollbar flex gap-4 pb-2" role="region" aria-label="Stories feed">
          {/* Add to my story button */}
          <button 
            type="button"
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group focus:outline-none rounded-full p-1"
            onClick={onAddStory}
            aria-label="Add to my story"
          >
            <div className="relative">
              <div className={`w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr ${isGhostMode ? 'from-[var(--app-accent)] via-[var(--app-accent-light)] to-[var(--app-accent)]' : 'from-secondary to-[var(--app-accent)]'} group-hover:scale-105 transition-transform duration-300 shadow-md`}>
                <div className={`w-full h-full rounded-full border-2 ${isGhostMode ? 'border-[var(--app-primary)] bg-[var(--app-bg-ghost)]' : 'border-[var(--app-bg)] bg-white'} overflow-hidden flex items-center justify-center`}>
                  <OptimizedImg src={MOCK_USERS[0]?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"} alt="My Story" width={64} height={64} loading="lazy" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className={`absolute bottom-0 right-0 p-1 rounded-full border-2 text-white shadow-sm ${isGhostMode ? 'bg-[var(--app-accent)] border-[var(--app-primary)] text-slate-900' : 'bg-secondary border-[var(--app-bg)]'}`}>
                <Plus size={12} />
              </div>
            </div>
            <span className={`text-[10px] font-bold uppercase tracking-tight ${isGhostMode ? 'text-slate-300' : 'text-slate-700 dark:text-slate-300'}`}>My Story</span>
          </button>

          {/* Active Stories */}
          {stories.map((story) => (
            <button 
              type="button"
              key={story.id} 
              className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group focus:outline-none rounded-full p-1" 
              onClick={() => onViewStory && onViewStory(story.id)}
              aria-label={`View story by @${story.username}`}
            >
              <div className={`w-16 h-16 rounded-full p-0.5 transition-all duration-300 group-hover:scale-105 shadow-md ${
                story.isSeen 
                  ? 'bg-slate-300 opacity-60' 
                  : `ring-2 ring-offset-2 ${isGhostMode ? 'bg-gradient-to-tr from-[var(--app-accent)] via-[var(--app-accent-light)] to-[var(--app-accent)] ring-[var(--app-accent)]/30' : 'bg-gradient-to-tr from-secondary to-[var(--app-accent)] ring-secondary/30'}`
              }`}>
                <div className={`w-full h-full rounded-full border-2 ${isGhostMode ? 'border-[var(--app-primary)] bg-[var(--app-bg-ghost)]' : 'border-[var(--app-bg)] bg-white'} overflow-hidden`}>
                  <OptimizedImg src={story.avatar} alt={`@${story.username}`} width={64} height={64} loading="lazy" className="w-full h-full object-cover" />
                </div>
              </div>
              <span className={`text-[10px] font-bold truncate w-16 text-center ${isGhostMode ? 'text-slate-300' : 'text-slate-800 dark:text-slate-200'}`}>@{story.username}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Post Box / Create Post Box */}
      <div className="max-w-2xl mx-auto w-full px-4 py-3">
        <form 
          onSubmit={handleCreatePost}
          className={`p-5 rounded-[2rem] border shadow-lg transition-all ${
            isGhostMode 
              ? 'bg-[var(--app-primary)] border-[color-mix(in_srgb,var(--app-accent)_20%,transparent)] shadow-[color-mix(in_srgb,var(--app-accent)_5%,transparent)]' 
              : 'bg-white border-black/5 dark:bg-[#0C3B46] dark:border-white/10'
          }`}
        >
          <div className="flex gap-3 items-start">
            <div className="w-11 h-11 rounded-2xl overflow-hidden shrink-0 border border-secondary/30">
              <OptimizedImg 
                src={MOCK_USERS[0]?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"} 
                alt="My Avatar" 
                width={44} 
                height={44} 
                className="w-full h-full object-cover" 
              />
            </div>
            <div className="flex-1 min-w-0">
              <textarea
                value={postContent}
                onChange={(e) => setPostContent(e.target.value)}
                placeholder="What's flowing in your circle? Share a moment..."
                rows={2}
                className={`w-full bg-transparent resize-none text-sm focus:outline-none placeholder:text-slate-400 dark:placeholder:text-slate-500 ${
                  isGhostMode ? 'text-white' : 'text-slate-900 dark:text-white'
                }`}
              />

              {/* Selected Image Preview */}
              {selectedImage && (
                <div className="relative mt-2 mb-3 rounded-2xl overflow-hidden border border-black/10 shadow-sm max-h-48 group">
                  <img src={selectedImage} alt="Attachment" className="w-full h-44 object-cover" />
                  <button
                    type="button"
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}

              {/* Tag / Mood badge */}
              {selectedTag && (
                <div className="flex items-center gap-1.5 mb-2.5">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border ${
                    isGhostMode ? 'bg-[var(--app-bg-ghost)] border-[var(--app-accent)]/30 text-[var(--app-accent-light)]' : 'bg-secondary/10 border-secondary/20 text-secondary'
                  }`}>
                    <Sparkles size={11} /> {selectedTag}
                    <button type="button" onClick={() => setSelectedTag(null)} className="ml-1 opacity-70 hover:opacity-100">
                      <X size={10} />
                    </button>
                  </span>
                </div>
              )}

              {/* Media Picker Popover */}
              {isMediaPickerOpen && (
                <div className="p-3 mb-3 rounded-2xl bg-black/5 dark:bg-white/5 border border-black/5 dark:border-white/10 animate-fade-in">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
                    Select a Visual Preset or Mood
                  </p>
                  <div className="grid grid-cols-4 gap-2">
                    {PRESET_MEDIA.map((media) => (
                      <button
                        type="button"
                        key={media.id}
                        onClick={() => {
                          setSelectedImage(media.url);
                          setIsMediaPickerOpen(false);
                        }}
                        className={`relative rounded-xl overflow-hidden h-16 border-2 transition-all group ${
                          selectedImage === media.url ? 'border-[var(--app-accent)] scale-95' : 'border-transparent hover:opacity-90'
                        }`}
                      >
                        <img src={media.url} alt={media.title} className="w-full h-full object-cover" />
                        <span className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[8px] font-bold p-0.5 truncate text-center">
                          {media.title}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions row */}
              <div className="flex items-center justify-between pt-2 border-t border-black/5 dark:border-white/10 mt-1">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsMediaPickerOpen(!isMediaPickerOpen)}
                    className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold ${
                      isMediaPickerOpen || selectedImage 
                        ? 'bg-secondary text-white' 
                        : isGhostMode ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300'
                    }`}
                    title="Attach Photo"
                  >
                    <ImageIcon size={16} />
                    <span className="text-[11px] hidden sm:inline">Photo</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTag(selectedTag === '🎵 Soundwave' ? null : '🎵 Soundwave')}
                    className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold ${
                      selectedTag === '🎵 Soundwave'
                        ? 'bg-[var(--app-accent)] text-slate-900'
                        : isGhostMode ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300'
                    }`}
                    title="Add Music Tag"
                  >
                    <Music size={16} />
                    <span className="text-[11px] hidden sm:inline">Music</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedTag(selectedTag === '📍 Shoreditch Hub' ? null : '📍 Shoreditch Hub')}
                    className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-bold ${
                      selectedTag === '📍 Shoreditch Hub'
                        ? 'bg-emerald-500 text-white'
                        : isGhostMode ? 'bg-white/5 text-slate-300 hover:bg-white/10' : 'bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-white/10 dark:text-slate-300'
                    }`}
                    title="Add Location Tag"
                  >
                    <MapPin size={16} />
                    <span className="text-[11px] hidden sm:inline">Location</span>
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={isPosting || (!postContent.trim() && !selectedImage)}
                  className="px-5 py-2 rounded-full font-bold text-xs bg-[var(--app-accent)] hover:bg-[#25A89B] text-slate-900 shadow-md active:scale-95 disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-1.5"
                >
                  {isPosting ? (
                    <RefreshCw size={14} className="animate-spin" />
                  ) : (
                    <Send size={14} />
                  )}
                  <span>Post</span>
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Feed Posts */}
      <div className="max-w-2xl mx-auto w-full px-4 pb-6 space-y-6">
        {posts.map((post) => {
          const author = MOCK_USERS.find(u => u.username === post.username) || MOCK_USERS[0];
          const isLiked = likedPosts.includes(post.id);
          const isSaved = savedPosts.includes(post.id);
          const currentComments = postComments[post.id] || [];

          return (
            <article 
              key={post.id} 
              className={`rounded-[2.2rem] overflow-hidden shadow-lg border animate-fade-in transition-all ${
                isGhostMode 
                  ? 'bg-[var(--app-primary)] border-[color-mix(in_srgb,var(--app-accent)_15%,transparent)]' 
                  : 'bg-white dark:bg-[#0C3B46] border-black/5 dark:border-white/10'
              }`}
            >
              {/* Author Row */}
              <div className="p-5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-11 h-11 rounded-2xl border-2 overflow-hidden ${isGhostMode ? 'border-[var(--app-accent)]/30' : 'border-secondary/40'}`}>
                    <OptimizedImg 
                      src={author?.avatar || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80"} 
                      alt={`@${post.username}`} 
                      width={44} 
                      height={44} 
                      loading="lazy" 
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className={`font-bold text-sm leading-none ${isGhostMode ? 'text-white' : 'text-slate-900 dark:text-white'}`}>
                        @{post.username}
                      </h3>
                      {post.bandName && (
                        <span className={`text-[9px] px-2 py-0.5 rounded-full font-black uppercase ${
                          isGhostMode ? 'bg-[var(--app-bg-ghost)] text-[var(--app-accent-light)]' : 'bg-secondary/10 text-secondary'
                        }`}>
                          {post.bandName}
                        </span>
                      )}
                    </div>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mt-1 ${isGhostMode ? 'text-slate-400' : 'text-slate-500 dark:text-slate-400'}`}>
                      {post.timestamp}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => showToast('Post options saved', 'info')}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-full" 
                  aria-label="More options"
                >
                  <MoreVertical size={18} />
                </button>
              </div>

              {/* Post Content */}
              {post.content && (
                <div className="px-5 pb-3">
                  <p className={`text-sm leading-relaxed ${isGhostMode ? 'text-slate-200' : 'text-slate-800 dark:text-slate-200'}`}>
                    {post.content}
                  </p>
                </div>
              )}

              {/* Post Media */}
              {post.image && (
                <div className="px-5 pb-4">
                  <OptimizedImg 
                    src={post.image} 
                    alt="Post media" 
                    width={600} 
                    height={300} 
                    loading="lazy" 
                    className="w-full h-72 object-cover rounded-[1.8rem] shadow-sm" 
                  />
                </div>
              )}

              {/* Interactions Bar */}
              <div className={`p-4 mx-5 mb-4 rounded-2xl flex items-center justify-between border ${
                isGhostMode ? 'bg-[var(--app-bg-ghost)] border-white/5' : 'bg-slate-50 dark:bg-white/5 border-slate-100 dark:border-white/5'
              }`}>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => toggleLike(post.id)} 
                    className={`flex items-center gap-1.5 text-xs font-bold transition-transform active:scale-90 ${
                      isLiked ? 'text-rose-500' : isGhostMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    <Heart size={18} fill={isLiked ? "currentColor" : "none"} />
                    <span>{post.likes + (isLiked ? 1 : 0)}</span>
                  </button>

                  <button 
                    onClick={() => setActiveCommentsPostId(activeCommentsPostId === post.id ? null : post.id)}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                      activeCommentsPostId === post.id 
                        ? 'text-secondary' 
                        : isGhostMode ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                    }`}
                  >
                    <MessageCircle size={18} />
                    <span>{post.comments + (currentComments.length > 2 ? currentComments.length - 2 : 0)}</span>
                  </button>

                  <button 
                    onClick={() => showToast(`Post shared to Hush Whisper network!`, 'success')}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-colors ${
                      isGhostMode ? 'text-slate-400 hover:text-[var(--app-accent-light)]' : 'text-slate-600 hover:text-secondary dark:text-slate-400'
                    }`} 
                    title="Share to Hush"
                  >
                    <Send size={16} />
                    <span className="text-[10px] uppercase tracking-wider hidden sm:inline">Hush</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleSave(post.id)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      isSaved ? 'text-[var(--app-accent)]' : isGhostMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
                    }`}
                    title="Bookmark Post"
                  >
                    <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                  </button>
                </div>
              </div>

              {/* Inline Comments Drawer */}
              {activeCommentsPostId === post.id && (
                <div className="px-5 pb-5 animate-fade-in border-t border-black/5 dark:border-white/10 pt-3">
                  <p className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-3">
                    Comments ({currentComments.length})
                  </p>

                  <div className="space-y-2.5 mb-3 max-h-48 overflow-y-auto pr-1">
                    {currentComments.length === 0 ? (
                      <p className="text-xs text-slate-400 italic">No comments yet. Be the first to reply!</p>
                    ) : (
                      currentComments.map(comm => (
                        <div key={comm.id} className="p-2.5 rounded-xl bg-black/5 dark:bg-white/5 flex items-start justify-between gap-2">
                          <div>
                            <span className="text-[11px] font-bold text-secondary mr-2">@{comm.user}</span>
                            <span className="text-xs text-slate-800 dark:text-slate-200">{comm.text}</span>
                          </div>
                          <span className="text-[9px] text-slate-400 shrink-0 mt-0.5">{comm.time}</span>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add comment input */}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Write a comment..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddComment(post.id);
                      }}
                      className="flex-1 px-3.5 py-2 rounded-xl text-xs bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 focus:outline-none focus:border-secondary"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddComment(post.id)}
                      disabled={!newCommentText.trim()}
                      className="px-3 py-2 rounded-xl bg-secondary text-white text-xs font-bold disabled:opacity-40"
                    >
                      Reply
                    </button>
                  </div>
                </div>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
});

export default FlowPage;
