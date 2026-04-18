import React, { useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { PlayCircle, ArrowRight, Volume2, VolumeX } from 'lucide-react';

export interface HeroVideoProps {
  title?: string;
  subtitle?: string;
  /** Direct URL to a local video file (MP4/WebM) */
  localVideoUrl?: string;
  /** YouTube embed URL or similar video player URL as fallback */
  videoUrl?: string;
  ctaText?: string;
  onCtaClick?: () => void;
  isVertical?: boolean;
  poster?: string;
}

export default function HeroVideo({
  title = "The Alpha Transformation System",
  subtitle = "Watch the breakdown of exactly how our coaching system builds elite strength and transforms physiques.",
  localVideoUrl,
  videoUrl = "https://www.youtube.com/embed/dQw4w9WgXcQ",
  ctaText = "View Training Packages",
  onCtaClick,
  isVertical = true,
  poster
}: HeroVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isMuted, setIsMuted] = React.useState(false);

  useEffect(() => {
    const unmute = (e: Event) => {
      // If they clicked the specific button, let the toggleMute function handle it
      if (e.target instanceof Element && e.target.closest('.mute-button')) return;

      if (videoRef.current && videoRef.current.muted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
      cleanup();
    };

    const cleanup = () => {
      window.removeEventListener('click', unmute);
      window.removeEventListener('touchstart', unmute);
      window.removeEventListener('keydown', unmute);
    };

    window.addEventListener('click', unmute);
    window.addEventListener('touchstart', unmute);
    window.addEventListener('keydown', unmute);

    if (videoRef.current) {
      // First attempt: try to play unmuted
      videoRef.current.muted = false;
      videoRef.current.play().catch(error => {
        console.log("Unmuted autoplay prevented by browser policy, waiting for interaction:", error);
        // Fallback: If unmuted autoplay fails, try muted autoplay
        if (videoRef.current) {
          videoRef.current.muted = true;
          setIsMuted(true);
          videoRef.current.play().catch(e => console.error("Muted autoplay also failed:", e));
        }
      });
    }

    return cleanup;
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      const newMutedState = !videoRef.current.muted;
      videoRef.current.muted = newMutedState;
      setIsMuted(newMutedState);
    }
  };

  return (
    <section className="relative w-full py-20 lg:py-32 bg-background overflow-hidden border-b border-white/5">
      {/* Background ambient accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-full bg-primary/5 rounded-full blur-[120px] pointer-events-none opacity-50"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 flex flex-col items-center">
        
        {/* Header Text */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <span className="inline-block px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold tracking-[0.2em] text-primary uppercase mb-6">
            Meet Your Coach
          </span>
          <h2 className="text-4xl md:text-7xl font-black font-headline tracking-tighter leading-[0.9] mb-8 uppercase">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-on-surface-variant font-light max-w-2xl mx-auto">
            {subtitle}
          </p>
        </motion.div>

        {/* Video Player Container */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={`w-full relative group ${isVertical ? 'max-w-md' : 'max-w-5xl'} rounded-[2.5rem] overflow-hidden glass-card p-3 shadow-[0_40px_100px_rgba(0,0,0,0.6)] border-white/10 mb-16 aspect-[9/16]`}
        >
          {/* Blurred Background for Portrait Videos */}
          {isVertical && localVideoUrl && (
            <div className="absolute inset-0 z-0 overflow-hidden opacity-40 scale-125 blur-[100px]">
              <video 
                src={localVideoUrl} 
                muted 
                loop 
                playsInline 
                autoPlay 
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="relative z-10 w-full h-full rounded-[2rem] overflow-hidden bg-black/40 backdrop-blur-sm">
            {localVideoUrl ? (
              <div className="relative w-full h-full">
                <video 
                  ref={videoRef}
                  src={localVideoUrl}
                  className="w-full h-full object-cover"
                  autoPlay
                  loop
                  playsInline
                  poster={poster}
                />
                
                {/* Custom Overlay Controls */}
                <div className="absolute bottom-10 right-8 z-20 flex flex-col items-center gap-4">
                  {isMuted && (
                    <motion.span 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10"
                    >
                      Sound Blocked by Browser
                    </motion.span>
                  )}
                  <button 
                    onClick={toggleMute}
                    className={`mute-button w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white hover:scale-110 active:scale-95 transition-all shadow-2xl ${isMuted ? 'animate-pulse bg-primary/20 border-primary/40 shadow-[0_0_30px_rgba(var(--primary-rgb),0.3)]' : ''}`}
                  >
                    {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                  </button>
                </div>

                {/* Ambient Light Frame */}
                <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/80 to-transparent pointer-events-none"></div>
              </div>
            ) : (
              <iframe 
                src={`${videoUrl}?autoplay=1&mute=0&loop=1&playlist=${videoUrl.split('/').pop()}`}
                title="Explainer Video"
                className="w-full h-full absolute inset-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowFullScreen
              ></iframe>
            )}
          </div>

          {/* Device Gloss Glow */}
          <div className="absolute inset-0 pointer-events-none border border-white/20 rounded-[2.5rem] z-20 mix-blend-overlay"></div>
        </motion.div>

        {/* CTA Button */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <button 
            onClick={onCtaClick}
            className="group flex items-center justify-center gap-4 px-10 sm:px-14 py-5 sm:py-6 bg-primary-container text-on-primary-container font-black text-xl sm:text-2xl rounded-2xl hover:scale-105 transition-all shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:shadow-[0_0_70px_rgba(255,255,255,0.4)] uppercase tracking-wider"
          >
            {ctaText}
            <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform" />
          </button>
        </motion.div>

      </div>
    </section>
  );
}
