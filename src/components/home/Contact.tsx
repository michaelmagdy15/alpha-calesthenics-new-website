import React from 'react';
import { motion } from 'motion/react';
import { Phone, MessageCircle, MapPin, Mail, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export default function Contact() {
  const { language } = useLanguage();

  return (
    <section id="contact" className="py-24 px-6 bg-background relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row gap-16 items-start">
          <div className="lg:w-1/2">
            <span className="text-primary font-black text-xs uppercase tracking-[0.3em] mb-4 block">
              {language === 'ar' ? 'تواصل معي' : 'Get In Touch'}
            </span>
            <h2 className="text-4xl md:text-6xl font-black font-headline mb-8 leading-tight uppercase tracking-tighter">
              {language === 'ar' ? (
                <>مستعد لبدء <br /> تحولك الجسدي؟</>
              ) : (
                <>Ready to start your <br /> Transformation?</>
              )}
            </h2>
            <p className="text-on-surface-variant text-lg mb-12 font-light leading-relaxed max-w-xl">
              {language === 'ar' 
                ? 'هل لديك أسئلة حول البرامج أو تحتاج إلى حل مخصص؟ تواصل معي مباشرة ودعنا نناقش كيف يمكننا الوصول إلى أهدافك.'
                : "Have questions about the programs or need a custom solution? Reach out directly and let's discuss how we can reach your goals."}
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
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">
                    {language === 'ar' ? 'راسلي على واتساب' : 'WhatsApp Us'}
                  </p>
                  <p className="text-xl font-bold">+20 105 577 1547</p>
                </div>
                <ArrowRight className={`ml-auto w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all ${language === 'ar' ? 'rotate-180' : ''}`} />
              </a>

              <a 
                href="tel:+201055771547" 
                className="group flex items-center gap-6 p-6 glass-card rounded-2xl border-white/5 hover:border-primary/30 transition-all hover:-translate-y-1"
              >
                <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center text-white group-hover:scale-110 transition-transform">
                  <Phone className="w-7 h-7" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant mb-1">
                    {language === 'ar' ? 'اتصل بي مباشرة' : 'Call Directly'}
                  </p>
                  <p className="text-xl font-bold">+20 105 577 1547</p>
                </div>
                <ArrowRight className={`ml-auto w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-2 transition-all ${language === 'ar' ? 'rotate-180' : ''}`} />
              </a>
            </div>
          </div>

          <div className="lg:w-1/2 w-full">
            <div className="glass-card p-10 rounded-3xl border-white/5 relative bg-white/2">
              <h3 className="text-2xl font-black font-headline mb-8 uppercase tracking-tight">
                {language === 'ar' ? 'أرسل رسالة' : 'Send a Message'}
              </h3>
              <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                      {language === 'ar' ? 'الاسم' : 'Name'}
                    </label>
                    <input type="text" placeholder={language === 'ar' ? 'فلان الفلاني' : 'John Doe'} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-primary/50 transition-colors" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                      {language === 'ar' ? 'البريد الإلكتروني' : 'Email'}
                    </label>
                    <input type="email" placeholder="john@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-primary/50 transition-colors" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                    {language === 'ar' ? 'الموضوع' : 'Subject'}
                  </label>
                  <select className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-primary/50 transition-colors appearance-none text-on-surface-variant">
                    <option>{language === 'ar' ? 'استفسار عام' : 'General Inquiry'}</option>
                    <option>{language === 'ar' ? 'تدريب ألفا إيليت' : 'Alpha Elite Coaching'}</option>
                    <option>{language === 'ar' ? 'برنامج ألفا الرياضي' : 'Alpha Athlete Program'}</option>
                    <option>{language === 'ar' ? 'الإعلام والشراكات' : 'Media & Partnerships'}</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant ml-1">
                    {language === 'ar' ? 'الرسالة' : 'Message'}
                  </label>
                  <textarea rows={4} placeholder={language === 'ar' ? 'كيف يمكننا مساعدتك؟' : 'How can we help you?'} className="w-full bg-white/5 border border-white/10 rounded-xl px-5 py-4 focus:outline-none focus:border-primary/50 transition-colors resize-none"></textarea>
                </div>
                <button className="w-full py-5 bg-primary text-on-primary font-black rounded-xl uppercase tracking-[0.2em] text-xs hover:shadow-[0_0_30px_rgba(255,184,0,0.3)] hover:-translate-y-0.5 transition-all">
                  {language === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
