
import React, { useState, useRef } from 'react';
import { MOCK_POSTS, MOCK_STORIES } from '../../constants';
import { Compass, Plus, Heart, MessageCircle, Send, MoreHorizontal, MoreVertical, Bookmark, Bell, RefreshCw } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { OptimizedImg } from '../common/OptimizedImg';
import { useToast } from '../../src/context/ToastContext';

interface FlowPageProps {
  onExplore?: () => void;
  onNotifications?: () => void;
  onAddStory?: () => void;
  onViewStory?: (storyId: string) => void;
  isGhostMode?: boolean;
}

export const FlowPage: React.FC<FlowPageProps> = React.memo(({ onExplore, onNotifications, onAddStory, onViewStory, isGhostMode }) => {
  const { showToast } = useToast();
  const [likedPosts, setLikedPosts] = useState<string[]>([]);
  const [savedPosts, setSavedPosts] = useState<string[]>([]);
  const [stories, setStories] = useState(MOCK_STORIES);

  // Pull to refresh state
  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [touchStartPos, setTouchStartPos] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleLike = (id: string) => {
    setLikedPosts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
  };

  const toggleSave = (id: string) => {
    setSavedPosts(prev => prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]);
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
    }, 1200);
  };

  return (
    <div 
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className={`min-h-full transition-all duration-700 pb-24 ${
        isGhostMode ? 'bg-[var(--app-bg-ghost)] text-[#F1FAEE]' : 'bg-[var(--app-bg,var(--app-bg))] text-[var(--text-primary,var(--text-primary))]'
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
            : 'bg-white/90 border-[#20878E]/20 text-[var(--app-primary)]'
        }`}>
          <RefreshCw 
            size={16} 
            className={`${isRefreshing ? 'animate-spin text-[var(--app-accent)]' : ''}`} 
            style={{ transform: !isRefreshing ? `rotate(${pullDistance * 3}deg)` : undefined }}
          />
          <span>{isRefreshing ? 'Refreshing stories & feed...' : pullDistance >= 55 ? 'Release to refresh' : 'Pull to refresh'}</span>
        </div>
      </div>

      <header className={`p-6 sticky top-0 z-50 shadow-md transition-colors duration-500 text-white ${isGhostMode ? 'bg-[var(--app-bg-ghost)]' : 'bg-[var(--app-primary)]'}`}>
        <div className="flex justify-between items-center animate-fade-in">
          <div className="flex items-center gap-3">
            <div className="animate-vizu-logo-entrance inline-flex items-center justify-center">
              <BrandLogo size={32} color={isGhostMode ? 'var(--app-accent-light)' : 'var(--app-bg)'} />
            </div>
            <div className="flex flex-col">
              <span className={`text-[10px] font-black tracking-[0.3em] leading-none mb-1 uppercase ${isGhostMode ? 'text-[var(--app-accent-light)]' : 'text-secondary'}`}>VIZU</span>
              <h1 className="text-xl font-bold font-montserrat tracking-tight leading-none">Flow</h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onNotifications} className="p-2 hover:bg-white/10 rounded-full transition-colors relative" title="Notifications">
              <Bell size={22} className="text-white/60" />
              <div className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[var(--app-primary)] animate-pulse" />
            </button>
            <button onClick={onExplore} className="p-2 hover:bg-white/10 rounded-full transition-colors md:hidden" title="Explore">
              <Compass size={22} className="text-white/60" />
            </button>
          </div>
        </div>
      </header>

      {/* Stories */}
      <div className="px-4 py-6 overflow-x-auto no-scrollbar flex gap-4" role="region" aria-label="Stories feed">
        <button 
          type="button"
          className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group animate-fade-in focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-full p-1"
          style={{ animationDelay: '0ms', animationFillMode: 'both' }}
          onClick={onAddStory}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              onAddStory?.();
            }
          }}
          aria-label="Add to my story"
        >
          <div className="relative">
            <div className={`w-16 h-16 rounded-full p-0.5 bg-gradient-to-tr ${isGhostMode ? 'from-[var(--app-accent)] via-[var(--app-accent-light)] to-[var(--app-accent)]' : 'from-secondary to-[var(--app-accent)]'} group-hover:scale-110 transition-transform duration-300`}>
              <div className={`w-full h-full rounded-full border-2 ${isGhostMode ? 'border-[var(--app-primary)] bg-[var(--app-bg-ghost)]' : 'border-[var(--app-bg,var(--app-bg))] bg-white'} overflow-hidden flex items-center justify-center`}>
                <OptimizedImg src="https://picsum.photos/seed/user_me/100" alt="My Story" width={64} height={64} loading="lazy" className="w-full h-full object-cover" />
              </div>
            </div>
            <div className={`absolute bottom-0 right-0 p-1 rounded-full border-2 text-white ${isGhostMode ? 'bg-[var(--app-accent)] border-[var(--app-primary)]' : 'bg-secondary border-[var(--app-bg,var(--app-bg))]'}`}>
              <Plus size={10} />
            </div>
          </div>
          <span className={`text-[10px] font-bold uppercase ${isGhostMode ? 'text-white/40' : 'text-[var(--text-primary,var(--text-primary))]/40'}`}>My Story</span>
        </button>
        {stories.map((story, index) => (
          <button 
            type="button"
            key={story.id} 
            className="flex flex-col items-center gap-2 shrink-0 cursor-pointer group animate-fade-in focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary rounded-full p-1" 
            style={{ animationDelay: `${(index + 1) * 70}ms`, animationFillMode: 'both' }}
            onClick={() => onViewStory && onViewStory(story.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onViewStory?.(story.id);
              }
            }}
            aria-label={`View story by @${story.username}`}
          >
            <div className={`w-16 h-16 rounded-full p-0.5 transition-all duration-300 group-hover:scale-110 ${story.isSeen ? 'bg-gray-250 opacity-60' : `ring-2 ring-offset-2 ${isGhostMode ? 'bg-gradient-to-tr from-[var(--app-accent)] via-[var(--app-accent-light)] to-[var(--app-accent)] ring-[color-mix(in_srgb,var(--app-accent)_20%,transparent)]' : 'bg-gradient-to-tr from-secondary to-[var(--app-accent)] ring-secondary/20'}`}`}>
              <div className={`w-full h-full rounded-full border-2 ${isGhostMode ? 'border-[var(--app-primary)] bg-[var(--app-bg-ghost)]' : 'border-[var(--app-bg,var(--app-bg))] bg-white'} overflow-hidden`}>
                <OptimizedImg src={story.avatar} alt={`@${story.username}`} width={64} height={64} loading="lazy" className="w-full h-full object-cover" />
              </div>
            </div>
            <span className={`text-[10px] font-bold truncate w-16 text-center ${isGhostMode ? 'text-white/80' : 'text-[var(--text-primary,var(--text-primary))]'}`}>@{story.username}</span>
          </button>
        ))}
      </div>

      {/* Posts */}
      <div className="px-4 pb-6 space-y-6">
        {MOCK_POSTS.map((post, index) => (
          <div 
            key={post.id} 
            className={`rounded-[2.5rem] overflow-hidden shadow-xl border animate-fade-in transition-all duration-550 ${isGhostMode ? 'bg-[var(--app-bg-ghost)] border-[color-mix(in_srgb,var(--app-accent)_15%,transparent)]' : 'bg-white border-black/5'}`}
            style={{ animationDelay: `${(index + 1) * 110}ms`, animationFillMode: 'both' }}
          >
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-12 h-12 rounded-2xl border-2 bg-gray-200 overflow-hidden ${isGhostMode ? 'border-[color-mix(in_srgb,var(--app-accent)_25%,transparent)]' : 'border-secondary'}`}>
                  <OptimizedImg src={`https://picsum.photos/seed/${post.username}/100`} alt={`@${post.username}`} width={48} height={48} loading="lazy" className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className={`font-bold text-sm ${isGhostMode ? 'text-white' : 'text-[var(--text-primary,var(--text-primary))]'}`}>@{post.username}</h4>
                  <p className={`text-[10px] font-bold uppercase tracking-widest ${isGhostMode ? 'text-white/40' : 'text-[var(--text-primary,var(--text-primary))]/40'}`}>{post.timestamp}</p>
                </div>
              </div>
              <button className={`p-2 ${isGhostMode ? isGhostMode ? 'text-white/20 hover:text-white' : 'text-primary/20 hover:text-primary dark:text-white/20 dark:hover:text-white' : 'text-primary/20 hover:text-primary'}`}><MoreVertical size={20} /></button>
            </div>

            {post.image && (
              <div className="px-5">
                <OptimizedImg src={post.image} alt="Post media" width={600} height={288} loading="lazy" className="w-full h-72 object-cover rounded-[2rem]" />
              </div>
            )}

            <div className="p-6">
              <p className={`mb-6 text-sm leading-relaxed ${isGhostMode ? 'text-white/70' : 'text-[var(--text-primary,var(--text-primary))]/70'}`}>{post.content}</p>
              
              <div className={`flex items-center justify-between pt-4 border-t ${isGhostMode ? 'border-white/5' : 'border-primary/5'}`}>
                <div className="flex items-center gap-4">
                  <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1.5 transition-all active:scale-90 ${likedPosts.includes(post.id) ? 'text-red-500' : isGhostMode ? 'text-white/40 hover:text-white' : 'text-[var(--text-primary,var(--text-primary))]/40 hover:text-primary'}`}>
                    <Heart size={20} fill={likedPosts.includes(post.id) ? "currentColor" : "none"} />
                    <span className="text-[11px] font-black">{post.likes + (likedPosts.includes(post.id) ? 1 : 0)}</span>
                  </button>
                  <button className={`flex items-center gap-1.5 ${isGhostMode ? 'text-white/40' : 'text-[var(--text-primary,var(--text-primary))]/40'}`}>
                    <MessageCircle size={20} />
                    <span className="text-[11px] font-black">{post.comments}</span>
                  </button>
                  <button className={`flex items-center gap-1.5 transition-colors ${isGhostMode ? 'text-white/30 hover:text-[var(--app-accent-light)]' : 'text-primary/30 hover:text-secondary'}`} title="Share to Hush">
                    <Send size={18} />
                    <span className="text-[9px] font-black uppercase">Hush</span>
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      toggleSave(post.id);
                      showToast(savedPosts.includes(post.id) ? 'Post unsaved' : 'Post saved to bookmarks!', 'info');
                    }}
                    className={`p-1.5 transition-colors ${savedPosts.includes(post.id) ? 'text-[var(--app-accent)]' : isGhostMode ? 'text-white/20 hover:text-white' : 'text-primary/20 hover:text-primary dark:text-white/20 dark:hover:text-white'}`}
                    title="Bookmark Post"
                  >
                    <Bookmark size={18} fill={savedPosts.includes(post.id) ? "currentColor" : "none"} />
                  </button>
                  <button 
                    onClick={() => {
                      showToast('Post link copied to clipboard!', 'info');
                    }} 
                    className={`p-1.5 transition-colors ${isGhostMode ? 'text-white/20 hover:text-[var(--app-accent-light)]' : 'text-primary/20 hover:text-secondary'}`} 
                    title="Post Options"
                  >
                    <MoreHorizontal size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

