import React, { useEffect } from 'react';

export default function Preloader({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 3500); // 3.5 seconds for the preloader
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0a] overflow-hidden text-on-surface font-body select-none">
      {/* Ambient Grid Background */}
      <div className="absolute inset-0 hud-grid opacity-[0.03] pointer-events-none"></div>
      
      {/* Technical Overlay: Background Data Flickers */}
      <div className="absolute inset-0 pointer-events-none p-12 hidden md:block overflow-hidden">
        <div className="animate-flicker space-y-4 font-mono text-[10px] text-white/20 uppercase tracking-[0.2em] select-none">
          <div className="absolute top-20 left-20">CORE_STABILITY: 98%</div>
          <div className="absolute top-40 right-40">GRIP_STRENGTH: OPTIMIZED</div>
          <div className="absolute bottom-60 left-1/4">NEURAL_DRIVE: ACTIVE</div>
          <div className="absolute bottom-20 right-20">O2_SATURATION: 99%</div>
          <div className="absolute top-1/2 right-1/3">LACTATE_THRESHOLD: NULL_VOID</div>
          <div className="absolute bottom-1/3 left-10">TENSION_LOAD: BALANCED</div>
        </div>
      </div>
      
      {/* Central Container */}
      <div className="relative flex flex-col items-center w-full max-w-xs md:max-w-md">
        {/* Animated Tactical Athlete Graphic */}
        <div className="animate-reveal mb-8 flex flex-col items-center relative">
          <div className="relative w-64 h-64 flex items-center justify-center">
            {/* Pull-up Bar */}
            <div className="animate-bar absolute top-[35%] w-48 h-[2px] bg-white/30 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.1)]"></div>
            {/* Athlete Illustration */}
            <div className="animate-pullup absolute top-[35%] w-full flex flex-col items-center">
              <svg className="w-24 h-40 text-primary fill-current filter drop-shadow-[0_0_20px_rgba(255,184,0,0.3)]" viewBox="0 0 100 150">
                {/* Arms (Hands on bar) */}
                <path d="M35,0 L35,30 M65,0 L65,30" stroke="currentColor" strokeLinecap="round" strokeWidth="3"></path>
                {/* Head */}
                <circle cx="50" cy="35" r="7"></circle>
                {/* Torso/Musculature */}
                <path d="M32,45 Q50,40 68,45 L63,85 L37,85 Z"></path>
                {/* Legs */}
                <path d="M37,85 L42,130 L47,145 M63,85 L58,130 L53,145" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="3"></path>
              </svg>
            </div>
          </div>
          {/* Alpha Calisthenics Logo Image */}
          <div className="w-32 mt-4">
            <img alt="Alpha Calisthenics Logo" className="w-full h-auto object-contain" src="/Alphalogowhite.png"/>
          </div>
          <div className="h-px w-10 bg-primary mt-6"></div>
        </div>
        
        {/* Loading Interface */}
        <div className="w-full space-y-4 px-8">
          {/* Status Label */}
          <div className="flex justify-between items-end w-full animate-status">
            <span className="font-preloader text-[10px] font-extrabold tracking-[0.2em] text-white uppercase">
              CALIBRATING ATHLETE PROFILE
            </span>
            <span className="font-preloader text-[10px] font-bold tracking-widest text-primary">
              INITIATING
            </span>
          </div>
          {/* Progress Bar Monolith */}
          <div className="relative h-[2px] w-full bg-white/10 overflow-hidden">
            <div className="animate-scan absolute inset-y-0 left-0 w-full bg-white"></div>
            {/* Secondary Accent Scan */}
            <div className="animate-scan absolute inset-y-0 left-0 w-full bg-primary opacity-40" style={{ animationDelay: '0.2s' }}></div>
          </div>
          {/* Metadata/Telemetry Tags */}
          <div className="flex justify-between text-[8px] font-mono opacity-30 tracking-tighter uppercase">
            <span>ELITE PROTOCOL: LOADED</span>
            <span>LEVEL: MASTER</span>
            <span>GRAVITY: DEFIED</span>
          </div>
        </div>
      </div>
      
      {/* Decorative Elements: Corners */}
      <div className="absolute top-10 left-10 w-6 h-6 border-t border-l border-white/20"></div>
      <div className="absolute top-10 right-10 w-6 h-6 border-t border-r border-white/20"></div>
      <div className="absolute bottom-10 left-10 w-6 h-6 border-b border-l border-white/20"></div>
      <div className="absolute bottom-10 right-10 w-6 h-6 border-b border-r border-white/20"></div>
    </div>
  );
}
