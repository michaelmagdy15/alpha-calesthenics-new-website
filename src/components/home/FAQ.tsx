import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown } from 'lucide-react';

export interface FAQItem {
  id: string | number;
  question: string;
  answer: string;
}

export interface FAQProps {
  title?: string;
  subtitle?: string;
  questions: FAQItem[];
}

export default function FAQ({
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know about the Alpha Calisthenics programs.",
  questions
}: FAQProps) {
  const [openId, setOpenId] = useState<string | number | null>(null);

  const toggleQuestion = (id: string | number) => {
    setOpenId(openId === id ? null : id);
  };

  if (!questions || questions.length === 0) return null;

  return (
    <section className="py-24 bg-background border-b border-white/5">
      <div className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black font-headline mb-4">{title}</h2>
          <p className="text-on-surface-variant text-lg">{subtitle}</p>
        </div>

        <div className="space-y-4">
          {questions.map((item, index) => {
            const isOpen = openId === item.id;
            return (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`glass-card rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-primary/30 shadow-[0_5px_20px_rgba(255,184,0,0.1)]' : 'border-white/5 hover:border-white/20'}`}
              >
                <button
                  onClick={() => toggleQuestion(item.id)}
                  className="w-full text-left px-6 py-6 flex justify-between items-center bg-transparent focus:outline-none"
                >
                  <span className="font-bold text-lg pr-8">{item.question}</span>
                  <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3, ease: "easeInOut" }}
                    className={`shrink-0 ${isOpen ? 'text-primary' : 'text-on-surface-variant'}`}
                  >
                    <ChevronDown className="w-6 h-6" />
                  </motion.div>
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-0 text-on-surface-variant leading-relaxed border-t border-white/5 mt-2">
                        <div className="pt-4">
                          {item.answer}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
