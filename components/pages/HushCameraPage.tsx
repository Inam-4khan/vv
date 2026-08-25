import React, { useState, useRef, useEffect } from 'react';
import { Video, RefreshCw, Send, Check, ArrowLeft } from 'lucide-react';
import { MOCK_USERS } from '../../constants';

interface HushCameraPageProps {
  onBack: () => void;
  isGhostMode: boolean;
}

export const HushCameraPage: React.FC<HushCameraPageProps> = React.memo(({ onBack, isGhostMode: _isGhostMode }) => {
  const [capturedMedia, setCapturedMedia] = useState<string | null>(null);
  const [showRecipients, setShowRecipients] = useState(false);
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);
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
        setShowRecipients(true);
      }
    }
  };

  const toggleRecipient = (userId: string) => {
    if (selectedRecipients.includes(userId)) {
      setSelectedRecipients(selectedRecipients.filter(id => id !== userId));
    } else {
      setSelectedRecipients([...selectedRecipients, userId]);
    }
  };

  const sendStreak = () => {
    // Logic to send would go here
    alert(`Sent to ${selectedRecipients.length} recipients!`);
    onBack();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col h-full w-full relative">
      <div className="relative flex-1 overflow-hidden bg-black rounded-b-[2.5rem]">
        {!capturedMedia ? (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        ) : (
          <img src={capturedMedia} className="w-full h-full object-cover" alt="Captured" />
        )}
        <canvas ref={canvasRef} className="hidden" />
        
        {/* Camera Controls */}
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10 safe-area-inset-top">
           <button 
             onClick={onBack} 
             aria-label="Back" 
             className="p-2 rounded-full bg-black/40 text-white backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2EC4B6]"
           >
             <ArrowLeft size={24} aria-hidden="true" />
           </button>
        </div>
        
        {!capturedMedia && (
          <div className="absolute bottom-10 left-0 w-full flex justify-center items-center gap-8 safe-area-inset-bottom">
             <button aria-label="Toggle video mode" className="p-4 rounded-full bg-white/10 text-white backdrop-blur-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#2EC4B6]">
               <Video size={24} aria-hidden="true" />
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
        )}
      </div>

      {/* Recipient Slider */}
      <div className={`fixed bottom-0 left-0 w-full bg-white rounded-t-[2.5rem] transition-transform duration-500 ease-out z-20 flex flex-col max-h-[80vh] ${showRecipients ? 'translate-y-0' : 'translate-y-full'}`}>
         <div className="p-2 flex justify-center">
           <div className="w-12 h-1.5 rounded-full bg-gray-300" />
         </div>
         <div className="px-6 pb-4 border-b flex justify-between items-center">
           <h3 className="text-lg font-bold text-primary">Send to...</h3>
           <button onClick={() => { setCapturedMedia(null); setShowRecipients(false); }} className="text-sm font-bold text-secondary">Retake</button>
         </div>
         <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {MOCK_USERS.map(user => (
              <button 
                type="button"
                key={user.id} 
                onClick={() => toggleRecipient(user.id)}
                aria-pressed={selectedRecipients.includes(user.id)}
                aria-label={`Send to ${user.displayName}`}
                className={`w-full text-left flex items-center gap-4 p-3 rounded-2xl border transition-all cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-secondary ${selectedRecipients.includes(user.id) ? 'bg-secondary/10 border-secondary' : 'bg-white border-gray-100'}`}
              >
                 <img src={user.avatar} loading="lazy" className="w-10 h-10 rounded-xl object-cover" alt="" />
                 <div className="flex-1">
                    <h4 className="font-bold text-sm text-primary">@{user.username}</h4>
                 </div>
                 <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${selectedRecipients.includes(user.id) ? 'bg-secondary border-secondary' : 'border-gray-300'}`}>
                    {selectedRecipients.includes(user.id) && <Check size={14} className="text-white" />}
                 </div>
              </button>
            ))}
         </div>
         <div className="p-4 border-t bg-white safe-area-inset-bottom">
            <button 
              onClick={sendStreak}
              disabled={selectedRecipients.length === 0}
              className={`w-full py-4 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all ${selectedRecipients.length > 0 ? 'bg-secondary text-white shadow-lg active:scale-95' : 'bg-gray-100 text-gray-400'}`}
            >
              <Send size={18} /> Send Streak {selectedRecipients.length > 0 && `(${selectedRecipients.length})`}
            </button>
         </div>
      </div>
    </div>
  );
});
