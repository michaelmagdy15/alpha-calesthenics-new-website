import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface Transformation {
  id: string | number;
  image: string;
  clientName?: string;
  clientNameAr?: string;
}

export interface TransformationsSlideshowProps {
  transformations: Transformation[];
  autoPlayInterval?: number;
  title: string;
  titleAr: string;
  subtitle: string;
  subtitleAr: string;
  language: 'en' | 'ar';
}

export default function TransformationsSlideshow({
  transformations,
  autoPlayInterval = 5000,
  title,
  titleAr,
  subtitle,
  subtitleAr,
  language
}: TransformationsSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % transformations.length);
  }, [transformations.length]);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + transformations.length) % transformations.length);
  }, [transformations.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, autoPlayInterval);
    return () => clearInterval(timer);
  }, [nextSlide, autoPlayInterval]);

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
      scale: 0.9,
      transition: {
        duration: 0.4,
      }
    }),
  };

  if (!transformations || transformations.length === 0) return null;

  return (
    <section className="py-32 bg-background relative overflow-hidden border-y border-white/5">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-20">
          <span className="text-primary font-black text-xs uppercase tracking-[0.4em] mb-4 block">
            {language === 'en' ? 'Proven Results' : 'نتائج حقيقية'}
          </span>
          <h2 className="text-4xl md:text-7xl font-black font-headline mb-6 leading-tight uppercase tracking-tighter">
            {language === 'en' ? (
              <>Witness the <span className="gradient-text">Transformation</span></>
            ) : (
              <>شاهد <span className="gradient-text">التحول</span></>
            )}
          </h2>
          <p className="text-on-surface-variant max-w-2xl mx-auto font-light text-lg">
            {language === 'en' ? subtitle : subtitleAr}
          </p>
        </div>

        <div className="relative aspect-[16/9] md:aspect-[21/9] w-full max-w-5xl mx-auto group">
          <div className="absolute inset-0 z-10 flex items-center justify-between px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <button 
              onClick={(e) => { e.stopPropagation(); prevSlide(); }}
              className="w-14 h-14 rounded-full bg-background/40 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all pointer-events-auto"
            >
              <span className="material-symbols-outlined">
                {language === 'en' ? 'chevron_left' : 'chevron_right'}
              </span>
            </button>
            <button 
              onClick={(e) => { e.stopPropagation(); nextSlide(); }}
              className="w-14 h-14 rounded-full bg-background/40 backdrop-blur-xl border border-white/10 flex items-center justify-center hover:bg-primary hover:text-on-primary transition-all pointer-events-auto"
            >
              <span className="material-symbols-outlined">
                {language === 'en' ? 'chevron_right' : 'chevron_left'}
              </span>
            </button>
          </div>

          <div className="relative w-full h-full rounded-3xl overflow-hidden glass-card border-white/10">
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.4 },
                }}
                className="absolute inset-0"
              >
                <img 
                  src={transformations[currentIndex].image} 
                  alt={
                    language === 'en' 
                      ? (transformations[currentIndex].clientName || "Transformation Result")
                      : (transformations[currentIndex].clientNameAr || "نتيجة التحول")
                  } 
                  className="w-full h-full object-contain md:object-cover"
                />
                
                {/* Overlay for client name at bottom */}
                {(transformations[currentIndex].clientName || transformations[currentIndex].clientNameAr) && (
                  <div className={`absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent ${
                    language === 'ar' ? 'text-right' : 'text-left'
                  }`}>
                    <h3 className="text-2xl font-black uppercase tracking-tight text-white">
                      {language === 'en' 
                        ? transformations[currentIndex].clientName 
                        : transformations[currentIndex].clientNameAr}
                    </h3>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Indicators */}
          <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 flex gap-3">
            {transformations.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirection(idx > currentIndex ? 1 : -1);
                  setCurrentIndex(idx);
                }}
                className={`h-1 rounded-full transition-all duration-500 ${
                  idx === currentIndex ? "w-12 bg-primary shadow-[0_0_15px_rgba(255,255,255,0.4)]" : "w-4 bg-white/20 hover:bg-white/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
