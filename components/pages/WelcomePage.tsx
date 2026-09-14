import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Loader2, 
  ArrowRight, 
  Radio, 
  MessageSquare, 
  Sparkles, 
  Ghost, 
  Waves,
  Heart,
  Music
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { MOCK_USERS } from '../../constants';

interface WelcomePageProps {
  onGetStarted: () => void;
}

export const WelcomePage: React.FC<WelcomePageProps> = React.memo(({ onGetStarted }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'flow' | 'radar' | 'hush'>('flow');

  const handleClick = () => {
    setIsLoading(true);
    setTimeout(() => {
      onGetStarted();
    }, 300);
  };

  const handleSignIn = () => {
    navigate('/auth/login');
  };

  return (
    <div className="min-h-full w-full flex-1 flex flex-col justify-between bg-[var(--app-bg)] text-slate-900 dark:text-[#F1FAEE] select-none transition-colors duration-500 overflow-y-auto">
      
      {/* Desktop Navigation Header */}
      <header className="w-full border-b border-black/5 dark:border-white/10 px-6 lg:px-12 py-4 bg-[var(--app-bg)]/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-2xl bg-[var(--app-primary)] text-white shadow-md">
              <BrandLogo size={24} color="var(--app-bg)" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-black font-montserrat tracking-tight text-slate-900 dark:text-white">
                  VIZU
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              </div>
              <p className="text-[9px] font-mono tracking-widest text-slate-500 dark:text-slate-400 uppercase hidden sm:block">
                PROXIMITY SOCIAL
              </p>
            </div>
          </div>

          {/* Center feature highlights (hidden on mobile) */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600 dark:text-slate-300">
            <div className="flex items-center gap-1.5 text-slate-900 dark:text-white">
              <Radio size={14} className="text-[var(--app-accent)]" />
              <span>Proximity Radar</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MessageSquare size={14} className="text-amber-500" />
              <span>24h Hush Whispers</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Ghost size={14} className="text-teal-400" />
              <span>Ghost Cloak</span>
            </div>
          </nav>

          {/* Top CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={handleSignIn}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-black/5 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              Sign In
            </button>
            <button
              onClick={handleClick}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl bg-[var(--app-accent)] hover:bg-teal-400 text-[#062B34] font-black text-xs shadow-md shadow-teal-500/20 transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <>
                  <span>Launch App</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Hero Section */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-8 lg:py-16 flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left Column: Hero Text & Value Proposition */}
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-start text-center lg:text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-700 dark:text-[var(--app-accent-light)] text-xs font-mono font-bold tracking-wide">
            <Sparkles size={13} className="animate-spin" style={{ animationDuration: '6s' }} />
            <span>LOCAL MESH • ZERO SURVEILLANCE</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white font-montserrat leading-[1.1]">
            Discover who's nearby.{' '}
            <span className="text-[var(--app-accent)] block lg:inline">
              Experience the flow.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-xl font-normal leading-relaxed">
            The proximity social network connecting nearby creators, spatial augmented reality vistas, and ephemeral 24-hour music whispers—without invasive facial recognition or permanent tracking.
          </p>

          {/* Action Button Row */}
          <div className="w-full max-w-md flex flex-col sm:flex-row items-center gap-3 pt-2">
            <button
              onClick={handleClick}
              disabled={isLoading}
              className="w-full sm:w-auto flex-1 bg-[var(--app-accent)] text-[#062B34] font-black py-4 px-8 rounded-2xl text-base shadow-xl shadow-teal-500/25 hover:bg-teal-400 active:scale-98 transition-all flex items-center justify-center gap-2 disabled:opacity-90 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Entering VIZU...</span>
                </>
              ) : (
                <>
                  <span>Get Started Free</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>

            <button
              onClick={handleSignIn}
              className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white dark:bg-white/10 border border-slate-200 dark:border-white/15 text-slate-800 dark:text-white font-bold text-sm hover:bg-slate-50 dark:hover:bg-white/15 transition-all cursor-pointer"
            >
              Sign In to Persona
            </button>
          </div>

          {/* Live Trust Metrics */}
          <div className="pt-4 border-t border-slate-200 dark:border-white/10 w-full grid grid-cols-3 gap-4 text-left">
            <div>
              <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-montserrat">
                24 Hours
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Auto-Destruct Notes
              </p>
            </div>
            <div>
              <p className="text-lg sm:text-xl font-black text-slate-900 dark:text-white font-montserrat">
                100%
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                No Facial Rec
              </p>
            </div>
            <div>
              <p className="text-lg sm:text-xl font-black text-[var(--app-accent)] font-montserrat">
                Mesh AR
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                Spatial Proximity
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Interactive App Preview Showcase */}
        <div className="w-full lg:w-1/2 flex items-center justify-center relative">
          
          {/* Ambient glow backgrounds */}
          <div className="absolute w-72 h-72 rounded-full bg-teal-500/20 blur-3xl -top-10 -right-10 pointer-events-none" />
          <div className="absolute w-72 h-72 rounded-full bg-amber-500/15 blur-3xl -bottom-10 -left-10 pointer-events-none" />

          {/* Glassmorphic App Frame */}
          <div className="w-full max-w-md bg-white/80 dark:bg-slate-900/90 border border-black/10 dark:border-white/15 rounded-[2.5rem] shadow-2xl p-5 backdrop-blur-xl relative z-10 transition-all duration-300 hover:shadow-teal-500/10">
            
            {/* Mock Header */}
            <div className="flex items-center justify-between pb-4 border-b border-black/5 dark:border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
                <span className="text-[11px] font-mono text-slate-400 ml-2 font-bold">
                  vizu.mesh/proximity
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-teal-500/15 text-teal-700 dark:text-[var(--app-accent-light)] flex items-center gap-1">
                <Radio size={11} className="animate-pulse" />
                <span>5 NEARBY</span>
              </span>
            </div>

            {/* Interactive Tabs within Mockup */}
            <div className="flex items-center gap-1.5 my-4 p-1 rounded-2xl bg-slate-100 dark:bg-white/5 text-xs font-bold">
              <button
                onClick={() => setActiveTab('flow')}
                className={`flex-1 py-1.5 rounded-xl transition-all ${
                  activeTab === 'flow'
                    ? 'bg-white dark:bg-[#0C3B46] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Live Flow
              </button>
              <button
                onClick={() => setActiveTab('radar')}
                className={`flex-1 py-1.5 rounded-xl transition-all ${
                  activeTab === 'radar'
                    ? 'bg-white dark:bg-[#0C3B46] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Spatial Radar
              </button>
              <button
                onClick={() => setActiveTab('hush')}
                className={`flex-1 py-1.5 rounded-xl transition-all ${
                  activeTab === 'hush'
                    ? 'bg-white dark:bg-[#0C3B46] text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                Hush Whispers
              </button>
            </div>

            {/* Mockup Body Content */}
            {activeTab === 'flow' && (
              <div className="space-y-4 animate-fade-in">
                {/* Active Stories Carousel Mockup */}
                <div className="flex items-center gap-3 overflow-hidden py-1">
                  {MOCK_USERS.slice(0, 4).map((u, i) => (
                    <div key={u.id} className="flex flex-col items-center gap-1 shrink-0">
                      <div className={`p-0.5 rounded-full ${i === 0 ? 'bg-gradient-to-tr from-amber-400 to-rose-500' : 'bg-gradient-to-tr from-teal-400 to-cyan-500'} animate-pulse`}>
                        <img 
                          src={u.avatar} 
                          alt={u.displayName}
                          className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-900" 
                        />
                      </div>
                      <span className="text-[10px] font-mono font-bold text-slate-700 dark:text-slate-300">
                        @{u.username}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Sample Live Feed Post */}
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/60 dark:border-white/10 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img 
                        src={MOCK_USERS[0]?.avatar} 
                        alt="Maya" 
                        className="w-8 h-8 rounded-xl object-cover" 
                      />
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">Maya Lin</p>
                        <p className="text-[10px] text-teal-600 dark:text-[var(--app-accent-light)] font-mono">0.2 km away • Shoreditch</p>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">12m ago</span>
                  </div>

                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Testing the new spatial synthesizer out by the courtyard. Ambient frequency loops are synchronized with nearby beacons! 🎧✨
                  </p>

                  <div className="h-32 rounded-xl overflow-hidden relative">
                    <img 
                      src="https://images.unsplash.com/photo-1509198397868-475647b2a1e5?auto=format&fit=crop&w=600&q=80" 
                      alt="Vizu Post Visual" 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[10px] flex items-center gap-1.5 font-mono">
                      <Music size={11} className="text-[var(--app-accent)]" />
                      <span>Neon Resonance (Original Mix)</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span className="flex items-center gap-1 text-rose-500">
                      <Heart size={14} fill="currentColor" /> 42
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare size={14} /> 8
                    </span>
                    <span className="text-[10px] font-mono text-[var(--app-accent)]">#CyberLofi</span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'radar' && (
              <div className="h-64 rounded-2xl bg-slate-950 border border-teal-500/30 relative flex flex-col items-center justify-center overflow-hidden animate-fade-in p-4 text-center">
                <div className="absolute inset-0 bg-radial from-teal-900/40 via-slate-950 to-black" />
                <div className="absolute w-48 h-48 rounded-full border border-teal-500/20 animate-ping" />
                <div className="absolute w-36 h-36 rounded-full border border-dashed border-teal-500/30" />
                <div className="absolute w-20 h-20 rounded-full border border-teal-500/40" />
                <div 
                  className="absolute inset-0 bg-gradient-to-tr from-transparent via-teal-400/15 to-teal-400/30 rounded-full animate-spin" 
                  style={{ animationDuration: '4s' }}
                />

                {/* Detected node blips */}
                <div className="absolute top-8 left-12 flex items-center gap-1 px-2 py-1 rounded-full bg-black/80 border border-teal-400/40 text-[9px] text-teal-300 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  @maya (0.2km)
                </div>

                <div className="absolute bottom-10 right-10 flex items-center gap-1 px-2 py-1 rounded-full bg-black/80 border border-teal-400/40 text-[9px] text-teal-300 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                  @sam (0.6km)
                </div>

                <div className="relative z-10 space-y-2">
                  <p className="text-xs font-black uppercase tracking-wider text-teal-300 font-mono">
                    SPATIAL VIEW ACTIVE
                  </p>
                  <p className="text-[11px] text-slate-400 max-w-xs">
                    Detecting real-world proximity telemetry within 1.5km without GPS cloud logging.
                  </p>
                </div>
              </div>
            )}

            {activeTab === 'hush' && (
              <div className="space-y-3 animate-fade-in py-2">
                <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                    <span>@elena_art • 0.3km</span>
                    <span className="font-mono">Decays in 42m</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                    "Found an underground ambient gallery space behind the old cinema. Secret password at the door: 1042."
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-amber-700 dark:text-amber-300">
                    <Music size={11} />
                    <span>♪ Floating Points - Falaise</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-2xl bg-teal-500/10 border border-teal-500/30 space-y-2">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-300">
                    <span>Encrypted Whisper • 0.1km</span>
                    <span className="font-mono">Decays in 1h 15m</span>
                  </div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-100">
                    "Coffee spot has amazing cold brew and synthwave playlist today. Come through if you're around."
                  </p>
                </div>
              </div>
            )}

            {/* Mock Floating Badge */}
            <div className="mt-4 p-2.5 rounded-2xl bg-teal-500/10 border border-teal-500/25 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Waves size={16} className="text-[var(--app-accent)] animate-bounce" />
                <span className="font-bold text-slate-800 dark:text-slate-200 text-[11px]">
                  Mesh Connected: London Node 04
                </span>
              </div>
              <span className="text-[10px] font-mono text-emerald-500 font-bold">● 60 FPS</span>
            </div>

          </div>
        </div>

      </main>

      {/* Bento Pillar Features Showcase */}
      <section className="max-w-7xl w-full mx-auto px-6 lg:px-12 py-10 border-t border-black/5 dark:border-white/10">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <p className="text-[10px] font-mono font-bold uppercase tracking-widest text-[var(--app-accent)] mb-1">
            ARCHITECTURE & CAPABILITIES
          </p>
          <h2 className="text-2xl sm:text-3xl font-black font-montserrat text-slate-900 dark:text-white">
            Social networking engineered for real life.
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0C3B46] border border-black/5 dark:border-white/10 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-teal-500/15 text-[var(--app-accent)] flex items-center justify-center">
              <Radio size={24} />
            </div>
            <h3 className="text-base font-black font-montserrat text-slate-900 dark:text-white">
              Spatial Vista Station
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Scan your physical surroundings with augmented reality and high-precision spatial coordinates to discover creators, moments, and music in your vicinity.
            </p>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0C3B46] border border-black/5 dark:border-white/10 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-base font-black font-montserrat text-slate-900 dark:text-white">
              Ephemeral Hush Whispers
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Post anonymous or tagged secrets tied to your exact latitude and favorite audio tracks. Every whisper automatically self-destructs after 24 hours.
            </p>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0C3B46] border border-black/5 dark:border-white/10 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-500 flex items-center justify-center">
              <Ghost size={24} />
            </div>
            <h3 className="text-base font-black font-montserrat text-slate-900 dark:text-white">
              Ghost Mode Privacy Cloak
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              One-click encryption mode cloaks your avatar and proximity signals. Browse freely and engage on your terms with zero digital surveillance footprint.
            </p>
          </div>
        </div>
      </section>

      {/* Web App Footer */}
      <footer className="w-full border-t border-black/5 dark:border-white/10 py-6 px-6 lg:px-12 text-center text-xs text-slate-400 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p>© 2026 VIZU Proximity Social • Zero Tracking • No Facial Recognition</p>
          <div className="flex items-center gap-4">
            <button onClick={handleClick} className="hover:text-[var(--app-accent)] transition-colors">Launch Flow</button>
            <span>•</span>
            <button onClick={handleSignIn} className="hover:text-[var(--app-accent)] transition-colors">Sign In</button>
            <span>•</span>
            <span className="text-emerald-400">Mesh Active</span>
          </div>
        </div>
      </footer>

    </div>
  );
});

WelcomePage.displayName = 'WelcomePage';
