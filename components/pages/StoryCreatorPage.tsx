import React, { useState, useRef, useEffect } from 'react';
import { X, RefreshCw, Send, Image as ImageIcon } from 'lucide-react';

interface StoryCreatorPageProps {
  onBack: () => void;
  isGhostMode: boolean;
}

export const StoryCreatorPage: React.FC<StoryCreatorPageProps> = React.memo(({ onBack, isGhostMode: _isGhostMode }) => {
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [privacy, setPrivacy] = useState<'public' | 'circle'>('public');
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const stopCamera = () => {
    const stream = videoRef.current?.srcObject as MediaStream;
    stream?.getTracks().forEach(t => t.stop());
  };

  const takePicture = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const data = canvasRef.current.toDataURL('image/png');
        setCapturedMedia(data);
      }
    }
  };

  const shareStory = () => {
    alert(`Story published successfully (${privacy === 'public' ? 'Publicly in Flow' : 'To connections in Circle only'})!`);
    onBack();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col h-full w-full relative">
      <div className="relative flex-1 overflow-hidden bg-black rounded-b-[2.5rem]">
        {!capturedMedia ? (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        ) : (
          <img src={capturedMedia} loading="lazy" className="w-full h-full object-cover" alt="Captured" />
        )}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Camera Controls */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10 safe-area-inset-top">
           <button onClick={onBack} aria-label="Close story creator" className="p-2 rounded-full bg-black/40 text-white backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2EC4B6]">
             <X size={24} aria-hidden="true" />
           </button>
        </div>
        
        {!capturedMedia ? (
          <div className="absolute bottom-10 left-0 w-full flex justify-center items-center gap-8 safe-area-inset-bottom">
             <button aria-label="Upload photo from gallery" className="p-4 rounded-full bg-white/10 text-white backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2EC4B6]">
               <ImageIcon size={24} aria-hidden="true" />
             </button>
             <button 
               type="button"
               onClick={takePicture}
               aria-label="Take picture"
               className="w-20 h-20 rounded-full border-4 border-white flex items-center justify-center bg-white/20 active:scale-95 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2EC4B6]"
             >
               <div className="w-16 h-16 rounded-full bg-white" />
             </button>
             <button aria-label="Flip camera" className="p-4 rounded-full bg-white/10 text-white backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2EC4B6]">
               <RefreshCw size={24} aria-hidden="true" />
             </button>
          </div>
        ) : (
          <>
            {/* Audience Privacy Selector */}
            <div className="absolute bottom-28 left-0 w-full px-6 flex flex-col items-center gap-1.5 z-20">
              <span className="text-[9px] font-black uppercase tracking-widest text-white/50">Who can see this story?</span>
              <div className="flex bg-black/60 backdrop-blur-md p-1 rounded-2xl border border-white/10 gap-1 shadow-2xl">
                <button 
                  type="button" 
                  onClick={() => setPrivacy('public')} 
                  className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                    privacy === 'public' 
                      ? 'bg-[#2EC4B6] text-white shadow-md' 
                      : 'text-white/45 hover:text-white'
                  }`}
                >
                  🌐 Public
                </button>
                <button 
                  type="button" 
                  onClick={() => setPrivacy('circle')} 
                  className={`px-4 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${
                    privacy === 'circle' 
                      ? 'bg-[#2EC4B6] text-[#062B34] shadow-md font-bold' 
                      : 'text-white/45 hover:text-white'
                  }`}
                >
                  👥 Circle
                </button>
              </div>
            </div>

            <div className="absolute bottom-10 left-0 w-full px-6 flex justify-between items-center safe-area-inset-bottom z-10">
               <button onClick={() => setCapturedMedia(null)} className="px-6 py-3 rounded-full bg-white/20 text-white backdrop-blur-md font-bold text-xs uppercase tracking-widest">
                 Retake
               </button>
               <button onClick={shareStory} className="px-8 py-3 rounded-full bg-[#2EC4B6] text-[#062B34] font-black uppercase tracking-widest flex items-center gap-2 shadow-lg active:scale-95 transition-transform text-xs">
                 <Send size={15} /> Share Story
               </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
});
