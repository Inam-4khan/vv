import React, { useState, useEffect } from 'react';
import { X, Heart, MessageCircle, Send, MoreHorizontal, Play, Pause } from 'lucide-react';
import { MOCK_STORIES } from '../../constants';
import { OptimizedImg } from '../common/OptimizedImg';

interface StoryViewerPageProps {
  storyId: string;
  onClose: () => void;
  isGhostMode: boolean;
}

export const StoryViewerPage: React.FC<StoryViewerPageProps> = React.memo(({ storyId, onClose, isGhostMode: _isGhostMode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAutoplay, setIsAutoplay] = useState(true);
  const [comment, setComment] = useState('');
  const [isLiked, setIsLiked] = useState(false);

  // Gesture physics for swipe dismissal
  const [startY, setStartY] = useState<number | null>(null);
  const [currentY, setCurrentY] = useState<number | null>(null);

  useEffect(() => {
    const initialIndex = MOCK_STORIES.findIndex(s => s.id === storyId);
    if (initialIndex !== -1) {
      setCurrentIndex(initialIndex);
    }
  }, [storyId]);

  const currentStory = MOCK_STORIES[currentIndex];

  const handleNext = React.useCallback(() => {
    if (currentIndex < MOCK_STORIES.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
      setIsLiked(false);
      if (navigator.vibrate) navigator.vibrate(15);
    } else {
      onClose();
    }
  }, [currentIndex, onClose]);

  useEffect(() => {
    if (isPaused || !isAutoplay) return;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 1; // 100 steps, 30ms each = 3 seconds per story
      });
    }, 30);

    return () => clearInterval(timer);
  }, [currentIndex, isPaused, isAutoplay, handleNext]);

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
      setIsLiked(false);
      if (navigator.vibrate) navigator.vibrate(15);
    } else {
      setProgress(0);
    }
  };

  const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
    setIsPaused(true);
    if ('touches' in e) {
      const touch = e.touches[0];
      if (touch) setStartY(touch.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    if (startY !== null && touch) {
      setCurrentY(touch.clientY);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent | React.MouseEvent) => {
    setIsPaused(false);
    
    // Check swipe gesture
    if (startY !== null && currentY !== null) {
      const diffY = currentY - startY;
      if (diffY > 120) { // Swiped downwards
        if (navigator.vibrate) navigator.vibrate(40);
        onClose();
        setStartY(null);
        setCurrentY(null);
        return;
      }
    }
    setStartY(null);
    setCurrentY(null);

    // Simple click navigation
    if ('clientX' in e) {
      const clickX = e.clientX;
      const screenWidth = window.innerWidth;
      // Prevent clicking from advancing if we click inside interactive zones
      if (e.target instanceof HTMLElement && e.target.closest('.interactive-zone')) {
        return;
      }
      if (clickX < screenWidth / 3) {
        handlePrev();
      } else if (clickX > (screenWidth / 3) * 2) {
        handleNext();
      }
    }
  };

  const handleSendComment = () => {
    if (!comment.trim() || !currentStory) return;
    if (navigator.vibrate) navigator.vibrate([30, 50, 30]);
    alert(`Comment sent to @${currentStory.username}: ${comment}`);
    setComment('');
  };

  const handleToggleLike = () => {
    const nextState = !isLiked;
    setIsLiked(nextState);
    if (navigator.vibrate) {
      if (nextState) {
        // High polish vibration score for user delight
        navigator.vibrate([40, 30, 60]);
      } else {
        navigator.vibrate(20);
      }
    }
  };

  if (!currentStory) return null;

  const dragOffset = startY !== null && currentY !== null ? Math.max(0, currentY - startY) : 0;

  return (
    <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex flex-col h-full w-full select-none">
      <div 
        className="relative flex-1 bg-black overflow-hidden rounded-[2rem] transition-transform duration-100 ease-out"
        style={{ transform: `translateY(${dragOffset}px)` }}
        onMouseDown={handleTouchStart}
        onMouseUp={handleTouchEnd}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {/* Story Image */}
        <OptimizedImg 
          src={currentStory.imageUrl} 
          alt="Story" 
          width={400}
          height={700}
          loading="lazy"
          className="w-full h-full object-cover pointer-events-none"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/90 pointer-events-none" />

        {/* Top Bar */}
        <div className="absolute top-0 left-0 w-full p-4 z-10 safe-area-inset-top interactive-zone">
          {/* Progress Bars */}
          <div className="flex gap-1 mb-4">
            {MOCK_STORIES.map((_, idx) => (
              <div key={idx} className="h-1 flex-1 bg-white/30 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-white transition-all duration-75 ease-linear"
                  style={{ 
                    width: idx === currentIndex 
                      ? `${isAutoplay ? progress : 100}%` 
                      : idx < currentIndex ? '100%' : '0%' 
                  }}
                />
              </div>
            ))}
          </div>

          {/* User Info & Autoplay toggle */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                <OptimizedImg src={currentStory.avatar} alt={currentStory.username} width={40} height={40} loading="lazy" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="text-white font-bold text-sm">@{currentStory.username}</p>
                <p className="text-white/60 text-[10px] uppercase font-bold tracking-widest">Active Story</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              {/* Autoplay Settings Pill Toggle */}
              <button 
                onClick={() => {
                  setIsAutoplay(prev => !prev);
                  if (navigator.vibrate) navigator.vibrate(30);
                }}
                className={`flex items-center gap-1 py-1.5 px-3 rounded-full text-[9px] font-black uppercase tracking-wider transition-all border ${
                  isAutoplay 
                    ? 'bg-[#2EC4B6]/90 border-[#2EC4B6]/20 text-white shadow-glow shadow-[#2EC4B6]/10' 
                    : 'bg-white/10 border-white/10 text-white/70'
                }`}
                title="Toggle Autoplay"
              >
                {isAutoplay ? <Play size={10} className="animate-pulse" /> : <Pause size={10} />}
                <span>{isAutoplay ? 'Auto' : 'Manual'}</span>
              </button>

              <button className="p-2 text-white/85 hover:bg-white/15 rounded-full transition-colors"><MoreHorizontal size={20} /></button>
              <button onClick={onClose} className="p-2 text-white/85 hover:bg-white/15 rounded-full transition-colors"><X size={24} /></button>
            </div>
          </div>
        </div>

        {/* Swipe Down Dismiss Alert Indicator */}
        <div className="absolute top-20 left-0 w-full text-center pointer-events-none opacity-25 animate-bounce-slow">
          <p className="text-[8px] uppercase tracking-[0.2em] text-white font-bold">↓ Swipe Down to Dismiss ↓</p>
        </div>

        {/* Bottom Bar */}
        <div 
          className="absolute bottom-0 left-0 w-full p-4 z-10 safe-area-inset-bottom interactive-zone"
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder={`Reply to @${currentStory.username}...`}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="w-full bg-white/20 border border-white/30 text-white placeholder-white/60 rounded-full py-3 px-5 pr-12 backdrop-blur-md focus:outline-none focus:bg-white/30 transition-colors"
                onFocus={() => setIsPaused(true)}
                onBlur={() => setIsPaused(false)}
              />
              {comment && (
                <button 
                  onClick={handleSendComment}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-white bg-secondary rounded-full"
                >
                  <Send size={14} />
                </button>
              )}
            </div>
            <button 
              onClick={handleToggleLike} 
              className={`p-3 rounded-full backdrop-blur-md transition-colors ${isLiked ? 'bg-red-500/20 text-red-500' : 'bg-white/20 text-white'}`}
            >
              <Heart size={24} fill={isLiked ? "currentColor" : "none"} />
            </button>
            <button className="p-3 rounded-full bg-white/20 text-white backdrop-blur-md">
              <MessageCircle size={24} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

