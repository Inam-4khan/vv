import React, { useState, useRef, useEffect, useCallback } from 'react';
import { 
  X, 
  RefreshCw, 
  Send, 
  Image as ImageIcon, 
  Camera, 
  Sparkles, 
  Type, 
  Music, 
  Zap, 
  Clock, 
  Grid, 
  ShieldCheck, 
  Globe, 
  Users
} from 'lucide-react';
import { useToast } from '../../src/context/ToastContext';
import { MOCK_USERS } from '../../constants';
import { Story } from '../../types';

interface StoryCreatorPageProps {
  onBack: () => void;
  isGhostMode: boolean;
  onStoryCreated?: (newStory: Story) => void;
}

type StudioMode = 'camera' | 'upload' | 'text' | 'audio';

interface FilterPreset {
  id: string;
  name: string;
  css: string;
  previewBg: string;
}

const FILTER_PRESETS: FilterPreset[] = [
  { id: 'normal', name: 'Normal', css: 'none', previewBg: 'bg-slate-700' },
  { id: 'cyber', name: 'Cyber Glow', css: 'hue-rotate(170deg) saturate(1.8) brightness(1.08) contrast(1.1)', previewBg: 'bg-gradient-to-r from-teal-400 to-cyan-600' },
  { id: 'sunset', name: 'Warm Sunset', css: 'sepia(0.35) saturate(1.6) contrast(1.1) brightness(1.05)', previewBg: 'bg-gradient-to-r from-amber-500 to-rose-500' },
  { id: 'noir', name: 'Noir Film', css: 'grayscale(1) contrast(1.4) brightness(0.95)', previewBg: 'bg-gradient-to-r from-zinc-800 to-zinc-400' },
  { id: 'neon', name: 'Neon Aqua', css: 'hue-rotate(85deg) saturate(2.1) brightness(1.1)', previewBg: 'bg-gradient-to-r from-emerald-400 to-cyan-500' },
  { id: 'vintage', name: '90s Retro', css: 'sepia(0.5) contrast(0.92) brightness(1.08)', previewBg: 'bg-gradient-to-r from-orange-400 to-yellow-600' },
  { id: 'vibrant', name: 'Vivid Pop', css: 'saturate(2.2) contrast(1.15)', previewBg: 'bg-gradient-to-r from-pink-500 to-indigo-500' },
];

const GRADIENT_CANVASES = [
  { id: 'g1', name: 'Sunset Glow', bg: 'from-amber-600 via-rose-600 to-purple-800' },
  { id: 'g2', name: 'Cyber Neon', bg: 'from-cyan-500 via-teal-600 to-blue-900' },
  { id: 'g3', name: 'Midnight Aurora', bg: 'from-indigo-900 via-purple-900 to-slate-950' },
  { id: 'g4', name: 'Emerald Dusk', bg: 'from-emerald-700 via-teal-800 to-slate-900' },
  { id: 'g5', name: 'Rose Gold', bg: 'from-rose-500 via-pink-600 to-amber-700' },
  { id: 'g6', name: 'Cosmic Violet', bg: 'from-violet-600 via-fuchsia-700 to-slate-950' },
  { id: 'g7', name: 'Monolith Dark', bg: 'from-slate-900 via-neutral-900 to-black' },
];

const PRESET_STOCK_PHOTOS = [
  { id: 'sp1', title: 'Urban Skyline', url: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80' },
  { id: 'sp2', title: 'Music Studio', url: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=800&q=80' },
  { id: 'sp3', title: 'Late Night Workspace', url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80' },
  { id: 'sp4', title: 'Golden Hour Coast', url: 'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80' },
  { id: 'sp5', title: 'Cyberpunk Alley', url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80' },
];

const SOUND_TRACKS = [
  { id: 'st1', title: 'Midnight City', artist: 'M83', vibe: 'Synthwave' },
  { id: 'st2', title: 'Lofi Study Chill', artist: 'Chillhop Records', vibe: 'Cozy Chill' },
  { id: 'st3', title: 'Deep Horizon', artist: 'Solaris Wave', vibe: 'Ambient' },
  { id: 'st4', title: 'Cyber Pulse', artist: 'Neon Flow', vibe: 'Electronic' },
];

const STICKERS = ['🔥', '✨', '🎧', '🚀', '🌙', '⚡', '💯', '💖', '👀', '🌊', '📍 Shoreditch', '🎵 Live Stream'];

export const StoryCreatorPage: React.FC<StoryCreatorPageProps> = React.memo(({ onBack, isGhostMode: _isGhostMode, onStoryCreated }) => {
  const { showToast } = useToast();
  
  // Active Creation Mode
  const [mode, setMode] = useState<StudioMode>('camera');

  // Camera & Capture State
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');
  const [hasCameraAccess, setHasCameraAccess] = useState<boolean | null>(null);
  const [isFlashActive, setIsFlashActive] = useState(false);
  const [flashMode, setFlashMode] = useState<'off' | 'on' | 'auto'>('off');
  const [timerDuration, setTimerDuration] = useState<number>(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [showGrid, setShowGrid] = useState(false);
  const [activeFilter, setActiveFilter] = useState<FilterPreset>(FILTER_PRESETS[0]);
  const [simulatedSceneIndex, setSimulatedSceneIndex] = useState(0);

  // Text Story Mode State
  const [textStoryContent, setTextStoryContent] = useState('Type your thought or mood here...');
  const [selectedGradient, setSelectedGradient] = useState(GRADIENT_CANVASES[0]);
  const [fontFamily, setFontFamily] = useState<'sans' | 'serif' | 'mono' | 'display'>('sans');
  const [fontSize, setFontSize] = useState<number>(24);

  // Media Editing & Overlay State
  const [overlayCaption, setOverlayCaption] = useState('');
  const [selectedStickers, setSelectedStickers] = useState<string[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<typeof SOUND_TRACKS[0] | null>(null);
  const [privacy, setPrivacy] = useState<'public' | 'circle' | 'hush'>('public');

  // References
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize Camera
  const initCamera = useCallback(async () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      
      if (!navigator.mediaDevices?.getUserMedia) {
        setHasCameraAccess(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode, width: { ideal: 1080 }, height: { ideal: 1920 } },
        audio: false,
      });

      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(() => {});
      }
      setHasCameraAccess(true);
    } catch (err) {
      console.warn('Camera access unavailable or denied. Using interactive simulated viewfinder.', err);
      setHasCameraAccess(false);
    }
  }, [facingMode]);

  useEffect(() => {
    if (mode === 'camera' && !capturedMedia) {
      initCamera();
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, [mode, capturedMedia, initCamera]);

  // Flip Camera
  const handleFlipCamera = () => {
    if (navigator.vibrate) navigator.vibrate(20);
    setFacingMode(prev => (prev === 'user' ? 'environment' : 'user'));
    if (!hasCameraAccess) {
      setSimulatedSceneIndex(prev => (prev + 1) % PRESET_STOCK_PHOTOS.length);
      showToast('Switched simulated camera lens', 'info');
    }
  };

  // Perform Shutter Snap
  const executeCapture = () => {
    // Flash effect trigger
    if (flashMode === 'on' || flashMode === 'auto') {
      setIsFlashActive(true);
      setTimeout(() => setIsFlashActive(false), 200);
    }

    if (navigator.vibrate) navigator.vibrate([25, 40, 25]);

    if (hasCameraAccess && videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 720;
      canvas.height = video.videoHeight || 1280;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        if (activeFilter.css !== 'none') {
          ctx.filter = activeFilter.css;
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedMedia(dataUrl);
        showToast('Moment captured!', 'success');
        return;
      }
    }

    // Simulated Fallback Capture
    const currentStock = PRESET_STOCK_PHOTOS[simulatedSceneIndex] || PRESET_STOCK_PHOTOS[0];
    setCapturedMedia(currentStock.url);
    showToast('Moment captured via Studio Lens!', 'success');
  };

  // Handle Shutter Press with Timer
  const handleShutterPress = () => {
    if (timerDuration > 0) {
      setCountdown(timerDuration);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev === null || prev <= 1) {
            clearInterval(timer);
            executeCapture();
            return null;
          }
          if (navigator.vibrate) navigator.vibrate(10);
          return prev - 1;
        });
      }, 1000);
    } else {
      executeCapture();
    }
  };

  // Handle File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedMedia(event.target.result as string);
          setMode('upload');
          showToast('Image loaded into Creator Studio', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Publish and Share Story
  const handlePublishStory = () => {
    let finalImageUrl = capturedMedia;

    if (mode === 'text') {
      // In text mode, generate a colored canvas story data URL or placeholder
      finalImageUrl = 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=800&q=80';
    }

    if (!finalImageUrl) {
      finalImageUrl = PRESET_STOCK_PHOTOS[0].url;
    }

    const newStory: Story = {
      id: `story-${Date.now()}`,
      userId: MOCK_USERS[0]?.id || '1',
      username: MOCK_USERS[0]?.username || 'alex_rhythm',
      avatar: MOCK_USERS[0]?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80',
      imageUrl: finalImageUrl,
      isSeen: false,
    };

    // Store in localStorage for instant retrieval across pages
    try {
      const existing = localStorage.getItem('vizu_custom_stories');
      const parsed = existing ? JSON.parse(existing) : [];
      localStorage.setItem('vizu_custom_stories', JSON.stringify([newStory, ...parsed]));
    } catch (e) {
      console.error(e);
    }

    if (onStoryCreated) {
      onStoryCreated(newStory);
    }

    if (navigator.vibrate) navigator.vibrate([40, 30, 80]);
    showToast(`Story published successfully (${privacy === 'public' ? 'Publicly to Flow' : privacy === 'circle' ? 'To Circle only' : 'As Secret Whisper'})!`, 'success');
    onBack();
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black text-white flex flex-col h-full w-full overflow-hidden select-none font-sans">
      <canvas ref={canvasRef} className="hidden" />
      <input 
        ref={fileInputRef} 
        type="file" 
        accept="image/*" 
        onChange={handleFileUpload} 
        className="hidden" 
      />

      {/* Realistic Flash Overlay */}
      {isFlashActive && (
        <div className="absolute inset-0 z-50 bg-white opacity-95 transition-opacity duration-200 pointer-events-none" />
      )}

      {/* Countdown Timer Overlay */}
      {countdown !== null && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs pointer-events-none">
          <span className="text-8xl font-black text-[var(--app-accent-light)] font-mono animate-ping">
            {countdown}
          </span>
        </div>
      )}

      {/* TOP HEADER CONTROLS */}
      <header className="absolute top-0 left-0 right-0 z-40 p-4 sm:p-5 flex items-center justify-between pointer-events-auto safe-area-inset-top bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        {/* Close Button */}
        <button
          type="button"
          onClick={onBack}
          className="p-3 rounded-2xl bg-black/60 hover:bg-black/80 text-white border border-white/15 backdrop-blur-md transition-all active:scale-95 flex items-center gap-1.5 shadow-lg"
          aria-label="Close Studio"
        >
          <X size={20} className="text-white" />
        </button>

        {/* Studio Mode Selector Switcher */}
        {!capturedMedia && (
          <div className="flex bg-black/60 backdrop-blur-md p-1 rounded-2xl border border-white/15 shadow-2xl">
            <button
              type="button"
              onClick={() => setMode('camera')}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                mode === 'camera' 
                  ? 'bg-[var(--app-accent)] text-slate-900 shadow-md' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Camera size={13} />
              <span className="hidden sm:inline">Camera</span>
            </button>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                mode === 'upload' 
                  ? 'bg-[var(--app-accent)] text-slate-900 shadow-md' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <ImageIcon size={13} />
              <span className="hidden sm:inline">Upload</span>
            </button>
            <button
              type="button"
              onClick={() => setMode('text')}
              className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                mode === 'text' 
                  ? 'bg-[var(--app-accent)] text-slate-900 shadow-md' 
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Type size={13} />
              <span className="hidden sm:inline">Text</span>
            </button>
          </div>
        )}

        {/* Quick Tools Tray (Flash, Timer, Grid) */}
        {!capturedMedia && mode === 'camera' && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setFlashMode(prev => (prev === 'off' ? 'on' : prev === 'on' ? 'auto' : 'off'))}
              className={`p-2.5 rounded-2xl border backdrop-blur-md transition-all ${
                flashMode !== 'off' 
                  ? 'bg-amber-400 text-slate-900 border-amber-300 shadow-md font-bold' 
                  : 'bg-black/60 text-white/80 border-white/15 hover:text-white'
              }`}
              title={`Flash: ${flashMode.toUpperCase()}`}
            >
              <Zap size={16} />
            </button>
            <button
              type="button"
              onClick={() => setTimerDuration(prev => (prev === 0 ? 3 : prev === 3 ? 10 : 0))}
              className={`p-2.5 rounded-2xl border backdrop-blur-md transition-all text-xs font-bold ${
                timerDuration > 0 
                  ? 'bg-[var(--app-accent)] text-slate-900 border-[var(--app-accent)] shadow-md font-black' 
                  : 'bg-black/60 text-white/80 border-white/15 hover:text-white'
              }`}
              title={`Timer: ${timerDuration ? `${timerDuration}s` : 'Off'}`}
            >
              {timerDuration > 0 ? `${timerDuration}s` : <Clock size={16} />}
            </button>
            <button
              type="button"
              onClick={() => setShowGrid(prev => !prev)}
              className={`p-2.5 rounded-2xl border backdrop-blur-md transition-all ${
                showGrid 
                  ? 'bg-[var(--app-accent)] text-slate-900 border-[var(--app-accent)] shadow-md' 
                  : 'bg-black/60 text-white/80 border-white/15 hover:text-white'
              }`}
              title="Toggle Grid Guide"
            >
              <Grid size={16} />
            </button>
          </div>
        )}

        {capturedMedia && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                setCapturedMedia(null);
                setOverlayCaption('');
                setSelectedStickers([]);
              }}
              className="px-4 py-2 rounded-2xl bg-white/20 hover:bg-white/30 text-white text-xs font-bold backdrop-blur-md transition-all flex items-center gap-1.5"
            >
              <RefreshCw size={14} /> Retake
            </button>
          </div>
        )}
      </header>

      {/* MAIN VIEWPORT CANVAS */}
      <main className="relative flex-1 w-full h-full overflow-hidden flex items-center justify-center bg-zinc-950">
        {/* 1. TEXT STORY MODE CANVAS */}
        {mode === 'text' && !capturedMedia && (
          <div className={`w-full h-full flex flex-col justify-between p-6 sm:p-10 bg-gradient-to-br ${selectedGradient.bg} transition-all duration-700`}>
            <div className="pt-16 flex justify-end">
              <span className="px-3 py-1 rounded-full bg-black/30 backdrop-blur-md text-[10px] font-mono text-white/80 uppercase tracking-widest border border-white/10">
                Canvas Mode
              </span>
            </div>

            <div className="max-w-md mx-auto w-full text-center space-y-4">
              <textarea
                value={textStoryContent}
                onChange={(e) => setTextStoryContent(e.target.value)}
                rows={4}
                className={`w-full bg-transparent text-white placeholder:text-white/50 text-center font-bold outline-none resize-none leading-snug drop-shadow-lg ${
                  fontFamily === 'serif' ? 'font-serif' : fontFamily === 'mono' ? 'font-mono' : 'font-montserrat'
                }`}
                style={{ fontSize: `${fontSize}px` }}
                placeholder="What's happening right now?"
                maxLength={240}
              />
              
              {/* Selected Stickers Display */}
              {selectedStickers.length > 0 && (
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {selectedStickers.map((sticker, idx) => (
                    <span key={idx} className="px-3 py-1 rounded-2xl bg-black/40 backdrop-blur-md text-sm border border-white/20 shadow-md">
                      {sticker}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Canvas Customizer Tools */}
            <div className="space-y-3 pb-20 max-w-lg mx-auto w-full">
              {/* Font Family Toggles */}
              <div className="flex justify-center gap-2">
                {([
                  { id: 'sans' as const, label: 'Clean' },
                  { id: 'serif' as const, label: 'Serif' },
                  { id: 'mono' as const, label: 'Code' }
                ]).map(f => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setFontFamily(f.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      fontFamily === f.id ? 'bg-white text-slate-900 shadow-md' : 'bg-black/30 text-white/80 hover:bg-black/50'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Gradient Color Palette Picker */}
              <div className="flex justify-center items-center gap-2 overflow-x-auto py-1">
                {GRADIENT_CANVASES.map(g => (
                  <button
                    key={g.id}
                    type="button"
                    onClick={() => setSelectedGradient(g)}
                    className={`w-7 h-7 rounded-full bg-gradient-to-br ${g.bg} border-2 transition-transform ${
                      selectedGradient.id === g.id ? 'scale-125 border-white shadow-lg' : 'border-white/30 opacity-75'
                    }`}
                    title={g.name}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 2. CAMERA LIVE VIEWPORT OR SIMULATED HIGH-TECH VIEWPORT */}
        {mode === 'camera' && !capturedMedia && (
          <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
            {hasCameraAccess ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ filter: activeFilter.css }}
                className="w-full h-full object-cover"
              />
            ) : (
              /* Simulated High-Tech Scenery Viewfinder with Lens HUD */
              <div className="relative w-full h-full overflow-hidden flex items-center justify-center">
                <img
                  src={PRESET_STOCK_PHOTOS[simulatedSceneIndex]?.url}
                  style={{ filter: activeFilter.css }}
                  className="w-full h-full object-cover transition-all duration-500 scale-105"
                  alt="Live Viewfinder Preview"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/40 pointer-events-none" />

                {/* Simulated Lens Telemetry HUD */}
                <div className="absolute top-20 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[9px] font-mono text-teal-300 flex items-center gap-2 shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>VIZU STUDIO LENS • 4K 60FPS • ISO 100 • 24MM</span>
                </div>

                <div className="absolute top-20 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/10 text-[9px] font-mono text-white/80">
                  SCENE {simulatedSceneIndex + 1}/{PRESET_STOCK_PHOTOS.length}
                </div>
              </div>
            )}

            {/* 3x3 Rule-of-Thirds Grid Overlay */}
            {showGrid && (
              <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none z-20">
                <div className="border-r border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-r border-b border-white/20" />
                <div className="border-b border-white/20" />
                <div className="border-r border-white/20" />
                <div className="border-r border-white/20" />
                <div className="" />
              </div>
            )}

            {/* Live Center Focus Focal Reticle */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-20 flex flex-col items-center">
              <div className="w-16 h-16 border-2 border-dashed border-[var(--app-accent-light)]/60 rounded-2xl animate-pulse flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--app-accent-light)]" />
              </div>
            </div>
          </div>
        )}

        {/* 3. CAPTURED MEDIA PREVIEW & INTERACTIVE EDITOR */}
        {capturedMedia && (
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={capturedMedia}
              className="w-full h-full object-cover"
              alt="Story Preview"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Custom Overlay Caption */}
            {overlayCaption && (
              <div className="absolute bottom-40 left-6 right-6 text-center z-30 animate-fade-in">
                <span className="inline-block px-4 py-2.5 rounded-2xl bg-black/70 backdrop-blur-md border border-white/20 text-white font-black text-base shadow-2xl">
                  {overlayCaption}
                </span>
              </div>
            )}

            {/* Attached Stickers Overlay */}
            {selectedStickers.length > 0 && (
              <div className="absolute top-28 left-6 right-6 flex flex-wrap gap-2 justify-center z-30">
                {selectedStickers.map((sticker, idx) => (
                  <span key={idx} className="px-3 py-1 rounded-2xl bg-black/60 backdrop-blur-md text-sm border border-white/20 text-white shadow-lg">
                    {sticker}
                  </span>
                ))}
              </div>
            )}

            {/* Sound Track Badge */}
            {selectedTrack && (
              <div className="absolute top-20 left-6 z-30">
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-black/70 backdrop-blur-md border border-[var(--app-accent)]/50 text-[var(--app-accent-light)] shadow-xl">
                  <Music size={13} className="animate-spin" />
                  <span className="text-[10px] font-bold">{selectedTrack.title} • {selectedTrack.artist}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* BOTTOM CONTROLS & PUBLISHING BAR */}
      <footer className="absolute bottom-0 left-0 right-0 z-40 p-4 sm:p-6 flex flex-col items-center gap-4 bg-gradient-to-t from-black via-black/80 to-transparent pointer-events-auto safe-area-inset-bottom">
        {/* A. Before Capture: Filter Selection Carousel & Shutter Controls */}
        {!capturedMedia && mode === 'camera' && (
          <div className="w-full max-w-lg space-y-4 flex flex-col items-center">
            {/* Live Filter Carousel */}
            <div className="flex items-center justify-center gap-2 overflow-x-auto w-full py-1 no-scrollbar">
              {FILTER_PRESETS.map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => {
                    setActiveFilter(f);
                    if (navigator.vibrate) navigator.vibrate(10);
                  }}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-mono uppercase tracking-wider transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    activeFilter.id === f.id
                      ? 'bg-[var(--app-accent)] text-slate-900 font-black shadow-lg scale-105'
                      : 'bg-black/60 text-white/80 border border-white/15 hover:bg-black/80'
                  }`}
                >
                  <span className={`w-2 h-2 rounded-full ${f.previewBg}`} />
                  {f.name}
                </button>
              ))}
            </div>

            {/* Main Shutter & Lens Switch Controls */}
            <div className="flex items-center justify-around w-full px-6">
              {/* Photo Upload Gallery Trigger */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-4 rounded-3xl bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md transition-all active:scale-90 shadow-xl flex flex-col items-center gap-1"
                aria-label="Upload from gallery"
              >
                <ImageIcon size={22} className="text-white" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-white/80">Gallery</span>
              </button>

              {/* Main Shutter Button */}
              <button
                type="button"
                onClick={handleShutterPress}
                aria-label="Capture Moment"
                className="relative w-20 h-20 rounded-full border-4 border-white/90 p-1 flex items-center justify-center active:scale-95 transition-transform group shadow-[0_0_25px_rgba(255,255,255,0.4)]"
              >
                <div className="w-full h-full rounded-full bg-[var(--app-accent)] group-hover:scale-95 transition-transform flex items-center justify-center shadow-inner">
                  <div className="w-4 h-4 rounded-full bg-white animate-pulse" />
                </div>
              </button>

              {/* Flip Camera / Scene Switcher */}
              <button
                type="button"
                onClick={handleFlipCamera}
                className="p-4 rounded-3xl bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-md transition-all active:scale-90 shadow-xl flex flex-col items-center gap-1"
                aria-label="Flip Camera"
              >
                <RefreshCw size={22} className="text-white group-hover:rotate-180 transition-transform duration-500" />
                <span className="text-[8px] font-bold uppercase tracking-widest text-white/80">Flip</span>
              </button>
            </div>
          </div>
        )}

        {/* B. Text Mode Action */}
        {!capturedMedia && mode === 'text' && (
          <div className="w-full max-w-md flex justify-between items-center px-4">
            <button
              type="button"
              onClick={() => {
                const random = GRADIENT_CANVASES[Math.floor(Math.random() * GRADIENT_CANVASES.length)];
                setSelectedGradient(random);
              }}
              className="p-3 rounded-2xl bg-white/15 text-white text-xs font-bold flex items-center gap-2"
            >
              <Sparkles size={16} /> Randomize
            </button>
            <button
              type="button"
              onClick={handlePublishStory}
              className="px-8 py-3.5 rounded-2xl bg-[var(--app-accent)] text-slate-900 font-black text-xs uppercase tracking-widest flex items-center gap-2 shadow-xl active:scale-95 transition-transform"
            >
              <Send size={16} /> Publish Text Story
            </button>
          </div>
        )}

        {/* C. After Capture / Composed Media: Customizer Tools & Publish Action */}
        {capturedMedia && (
          <div className="w-full max-w-lg space-y-3">
            {/* Overlay Caption Input & Emojis */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={overlayCaption}
                  onChange={(e) => setOverlayCaption(e.target.value)}
                  placeholder="Add a story caption..."
                  className="flex-1 bg-white/15 border border-white/20 rounded-2xl px-4 py-2.5 text-xs text-white placeholder:text-white/60 focus:outline-none focus:bg-white/25 transition-all"
                  maxLength={60}
                />
                <button
                  type="button"
                  onClick={() => setSelectedTrack(selectedTrack ? null : SOUND_TRACKS[0])}
                  className={`p-2.5 rounded-2xl border transition-all flex items-center gap-1 text-xs font-bold ${
                    selectedTrack 
                      ? 'bg-secondary text-white border-secondary shadow-md' 
                      : 'bg-white/15 text-white/80 border-white/20 hover:text-white'
                  }`}
                  title="Attach Song"
                >
                  <Music size={16} />
                </button>
              </div>

              {/* Quick Stickers Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 no-scrollbar">
                {STICKERS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => {
                      if (selectedStickers.includes(s)) {
                        setSelectedStickers(prev => prev.filter(item => item !== s));
                      } else {
                        setSelectedStickers(prev => [...prev, s]);
                      }
                      if (navigator.vibrate) navigator.vibrate(10);
                    }}
                    className={`px-2.5 py-1 rounded-xl text-xs backdrop-blur-md border transition-all ${
                      selectedStickers.includes(s)
                        ? 'bg-[var(--app-accent)] text-slate-900 border-[var(--app-accent)] font-bold shadow-md'
                        : 'bg-white/10 text-white border-white/15 hover:bg-white/20'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Audience Privacy Selector & Publish Action */}
            <div className="flex items-center justify-between gap-3 pt-1 border-t border-white/15">
              {/* Privacy Selector */}
              <div className="flex bg-black/60 backdrop-blur-md p-1 rounded-2xl border border-white/20 gap-1 shadow-md">
                <button
                  type="button"
                  onClick={() => setPrivacy('public')}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
                    privacy === 'public' ? 'bg-[var(--app-accent)] text-slate-900 shadow-md font-black' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Globe size={11} /> Public
                </button>
                <button
                  type="button"
                  onClick={() => setPrivacy('circle')}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
                    privacy === 'circle' ? 'bg-[var(--app-accent)] text-slate-900 shadow-md font-black' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <Users size={11} /> Circle
                </button>
                <button
                  type="button"
                  onClick={() => setPrivacy('hush')}
                  className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1 ${
                    privacy === 'hush' ? 'bg-rose-500 text-white shadow-md font-black' : 'text-white/60 hover:text-white'
                  }`}
                >
                  <ShieldCheck size={11} /> Hush
                </button>
              </div>

              {/* Share Story Button */}
              <button
                type="button"
                onClick={handlePublishStory}
                className="flex-1 py-3.5 rounded-2xl bg-[var(--app-accent)] hover:bg-[var(--app-accent-light)] text-slate-900 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl active:scale-95 transition-transform"
              >
                <Send size={16} /> Share Story
              </button>
            </div>
          </div>
        )}
      </footer>
    </div>
  );
});

export default StoryCreatorPage;
