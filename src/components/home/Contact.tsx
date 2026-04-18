import React from 'react';
import { motion } from 'motion/react';
import { Phone, MessageCircle, MapPin, Mail, ArrowRight } from 'lucide-react';

export default function Contact() {
  return (
    <section id="contact" className="py-24 px-6 bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/2">
            <span className="text-primary font-black text-xs uppercase tracking-[0.3em] mb-4 block">Get In Touch</span>
            <h2 className="text-4xl md:text-6xl font-black font-headline mb-8 leading-tight uppercase tracking-tighter">
              Ready to start your <br />
              <span className="gradient-text">Transformation?</span>
            </h2>
            <p className="text-on-surface-variant text-lg mb-12 font-light leading-relaxed max-w-xl">
              Have questions about the programs or need a custom solution? Reach out directly and let's discuss how we can reach your goals.
            </p>

            <div className="space-y-8">
              <a 
                href="https://wa.me/+201055771547" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group flex items-center gap-6 p-6 glass-card rounded-2xl border-white/5 hover:border-primary/30 transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <MessageCircle className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">WhatsApp Us</p>
                  <p className="text-xl font-bold">+20 105 577 1547</p>
                </div>
                <ArrowRight className="ml-auto w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
              </a>

              <a 
                href="tel:+201055771547" 
                className="group flex items-center gap-6 p-6 glass-card rounded-2xl border-white/5 hover:border-primary/30 transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Phone className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">Call Directly</p>
                  <p className="text-xl font-bold">+20 105 577 1547</p>
                </div>
                <ArrowRight className="ml-auto w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all" />
              </a>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="glass-card p-10 rounded-3xl border-white/5 relative bg-white/2">
              <h3 className="text-2xl font-black font-headline mb-8 uppercase tracking-tight">Send a Message</h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Name</label>
                    <input type="text" placeholder="John Doe" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-primary/50 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Email</label>
                    <input type="email" placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-primary/50 transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Subject</label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-primary/50 transition-colors appearance-none text-on-surface-variant">
                    <option>General Inquiry</option>
                    <option>Alpha Elite Coaching</option>
                    <option>Alpha Athlete Program</option>
                    <option>Media & Partnerships</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">Message</label>
                  <textarea rows={4} placeholder="How can we help you?" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-primary/50 transition-colors resize-none"></textarea>
                </div>
                <button className="w-full py-5 bg-primary text-on-primary font-black rounded-xl uppercase tracking-[0.2em] text-xs hover:shadow-[0_0_30px_rgba(255,184,0,0.3)] hover:-translate-y-0.5 transition-all">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
