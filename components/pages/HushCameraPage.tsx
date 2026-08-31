import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, Send, Check, ArrowLeft, Image as ImageIcon, Zap, ShieldCheck } from 'lucide-react';
import { MOCK_USERS } from '../../constants';
import { useToast } from '../../src/context/ToastContext';

interface HushCameraPageProps {
  onBack: () => void;
  isGhostMode: boolean;
}

export const HushCameraPage: React.FC<HushCameraPageProps> = React.memo(({ onBack, isGhostMode: _isGhostMode }) => {
  const { showToast } = useToast();
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [showRecipients, setShowRecipients] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>(['1', '2']);
  const [hasCameraAccess, setHasCameraAccess] = useState<boolean | null>(null);
  const [simulatedIndex, setSimulatedIndex] = useState(0);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const PRESET_HUSH_SNAPS = [
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&w=800&q=80',
  ];

  useEffect(() => {
    let isMounted = true;
    const initCamera = async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          setHasCameraAccess(false);
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
        if (!isMounted) {
          stream.getTracks().forEach(t => t.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(() => {});
        }
        setHasCameraAccess(true);
      } catch (err) {
        console.warn("Camera fallback in Hush Snap:", err);
        setHasCameraAccess(false);
      }
    };
    
    initCamera();
    
    return () => {
      isMounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
        streamRef.current = null;
      }
      if (videoRef.current) {
        videoRef.current.srcObject = null;
      }
    };
  }, []);

  const takePicture = () => {
    if (navigator.vibrate) navigator.vibrate(25);
    if (hasCameraAccess && videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth || 720;
        canvasRef.current.height = videoRef.current.videoHeight || 1280;
        context.drawImage(videoRef.current, 0, 0);
        const data = canvasRef.current.toDataURL('image/jpeg', 0.85);
        setCapturedMedia(data);
        setShowRecipients(true);
        return;
      }
    }

    // Simulated snap
    setCapturedMedia(PRESET_HUSH_SNAPS[simulatedIndex]);
    setShowRecipients(true);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setCapturedMedia(event.target.result as string);
          setShowRecipients(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleRecipient = (userId: string) => {
    if (selectedRecipients.includes(userId)) {
      setSelectedRecipients(selectedRecipients.filter(id => id !== userId));
    } else {
      setSelectedRecipients([...selectedRecipients, userId]);
    }
    if (navigator.vibrate) navigator.vibrate(10);
  };

  const sendStreak = () => {
    if (navigator.vibrate) navigator.vibrate([30, 20, 60]);
    showToast(`Hush Streak sent secretly to ${selectedRecipients.length} friend${selectedRecipients.length > 1 ? 's' : ''}! 🔒`, 'success');
    onBack();
  };

  return (
    <div className="fixed inset-0 z-[150] bg-black text-white flex flex-col h-full w-full select-none">
      <canvas ref={canvasRef} className="hidden" />
      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />

      <div className="relative flex-1 overflow-hidden bg-black flex items-center justify-center">
        {!capturedMedia ? (
          hasCameraAccess ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          ) : (
            <div className="relative w-full h-full">
              <img 
                src={PRESET_HUSH_SNAPS[simulatedIndex]} 
                className="w-full h-full object-cover brightness-90" 
                alt="Hush Simulated Lens" 
              />
              <div className="absolute top-20 left-6 px-3 py-1 rounded-xl bg-black/60 backdrop-blur-md text-[10px] font-mono text-[var(--app-accent-light)] border border-white/10 flex items-center gap-2">
                <ShieldCheck size={13} /> ENCRYPTED EPHEMERAL SNAP LENS
              </div>
            </div>
          )
        ) : (
          <img src={capturedMedia} className="w-full h-full object-cover" alt="Captured" />
        )}
        
        {/* Top Header */}
        <header className="absolute top-0 left-0 right-0 p-5 flex justify-between items-center z-30 safe-area-inset-top bg-gradient-to-b from-black/80 to-transparent">
          <button 
            type="button"
            onClick={onBack} 
            aria-label="Back" 
            className="p-3 rounded-2xl bg-black/60 text-white border border-white/15 backdrop-blur-md hover:bg-black/80 transition-all active:scale-95 shadow-md"
          >
            <ArrowLeft size={20} />
          </button>
          
          <div className="px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-xs font-bold text-white flex items-center gap-1.5">
            <Zap size={14} className="text-amber-400" /> Hush Snap
          </div>
        </header>
        
        {/* Shutter Bottom Bar */}
        {!capturedMedia && (
          <footer className="absolute bottom-10 left-0 right-0 flex justify-center items-center gap-8 z-30 safe-area-inset-bottom">
            <button 
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Upload Photo" 
              className="p-4 rounded-3xl bg-white/20 text-white border border-white/20 backdrop-blur-md hover:bg-white/30 transition-all active:scale-90 shadow-xl"
            >
              <ImageIcon size={22} />
            </button>
            <button 
              type="button"
              onClick={takePicture}
              aria-label="Take picture"
              className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 active:scale-95 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.4)]"
            >
              <div className="w-16 h-16 rounded-full bg-[var(--app-accent)]" />
            </button>
            <button 
              type="button"
              onClick={() => setSimulatedIndex(prev => (prev + 1) % PRESET_HUSH_SNAPS.length)}
              aria-label="Switch Lens" 
              className="p-4 rounded-3xl bg-white/20 text-white border border-white/20 backdrop-blur-md hover:bg-white/30 transition-all active:scale-90 shadow-xl"
            >
              <RefreshCw size={22} />
            </button>
          </footer>
        )}
      </div>

      {/* Recipient Drawer */}
      <div className={`fixed bottom-0 left-0 right-0 bg-[#0A2832] text-white rounded-t-[2.5rem] border-t border-white/15 transition-transform duration-400 ease-out z-40 flex flex-col max-h-[75vh] shadow-2xl ${showRecipients ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="p-3 flex justify-center">
          <div className="w-12 h-1.5 rounded-full bg-white/20" />
        </div>
        <div className="px-6 pb-3 border-b border-white/10 flex justify-between items-center">
          <div>
            <h3 className="text-base font-black text-white">Send Secret Snap</h3>
            <p className="text-[10px] text-[var(--app-accent-light)] font-mono">Disappears immediately after opening</p>
          </div>
          <button 
            type="button"
            onClick={() => { setCapturedMedia(null); setShowRecipients(false); }} 
            className="text-xs font-bold text-white/70 hover:text-white px-3 py-1.5 rounded-xl bg-white/10"
          >
            Retake
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2 max-h-60">
          {MOCK_USERS.map(user => {
            const isSelected = selectedRecipients.includes(user.id);
            return (
              <button 
                type="button"
                key={user.id} 
                onClick={() => toggleRecipient(user.id)}
                className={`w-full text-left flex items-center gap-3 p-3 rounded-2xl border transition-all cursor-pointer ${
                  isSelected ? 'bg-[var(--app-accent)]/20 border-[var(--app-accent)]' : 'bg-black/30 border-white/5 hover:bg-black/50'
                }`}
              >
                <img src={user.avatar} className="w-10 h-10 rounded-xl object-cover" alt="" />
                <div className="flex-1">
                  <h4 className="font-bold text-sm text-white">@{user.username}</h4>
                  <p className="text-[10px] text-white/50">{user.displayName}</p>
                </div>
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-[var(--app-accent)] border-[var(--app-accent)]' : 'border-white/30'
                }`}>
                  {isSelected && <Check size={13} className="text-slate-900 font-bold" />}
                </div>
              </button>
            );
          })}
        </div>
        <div className="p-4 border-t border-white/10 bg-black/40 safe-area-inset-bottom">
          <button 
            type="button"
            onClick={sendStreak}
            disabled={selectedRecipients.length === 0}
            className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${
              selectedRecipients.length > 0 ? 'bg-[var(--app-accent)] text-slate-900 shadow-xl active:scale-95' : 'bg-white/10 text-white/30'
            }`}
          >
            <Send size={18} /> Send Hush Snap {selectedRecipients.length > 0 && `(${selectedRecipients.length})`}
          </button>
        </div>
      </div>
    </div>
  );
});

export default HushCameraPage;
