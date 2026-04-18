import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import LanguageToggle from './LanguageToggle';
import VideoModal from './VideoModal';
import GoogleSignInButton from './auth/GoogleSignInButton';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { HeroVideo, AboutCoach, PricingTier, FAQ, TransformationsGallery, Contact, TransformationsSlideshow } from './home';

const coachProfile = {
  name: "Coach Akram",
  title: "Head Calisthenics Coach",
  description: "I don’t just hand you a generic template and hope for the best. I build athletes.\n\nWith years of in-the-trenches experience mastering bodyweight mechanics, strength development, and physical transformation, I know exactly what it takes to break through plateaus and build a physique that performs as incredibly as it looks.",
  image: "/actual images/Coach hero.png",
  signature: "\"Zero guesswork. 100% custom programming.\"",
  credentials: [
    { text: "10+ Years Experience", icon: "sports_martial_arts" },
    { text: "Certified Strength Coach", icon: "verified" },
    { text: "Mobility Specialist", icon: "fitness_center" }
  ]
};

const transformationsData = [
  {
    name: "Alex M.",
    tagline: "From 0 to 15 strict pull-ups",
    quote: "The programming is intense but the results are undeniable.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDQkH99iO2z41m6n-Nq_03t1G_i0F1s8b2eK_9f3m_7v0v2f1v5t8e2n0_2_9t1s2e1u5r8p0_1_7-V2N2M9u5u-V-9N5t8-v2f1_9N7-8e1m5j1s5j0t2_0N0N0V0M9N0V9N0V0V0V0V0V",
    stats: [
      { label: "Pull-ups", before: "0", after: "15" },
      { label: "Muscle-ups", before: "0", after: "5" }
    ],
    verified: true
  }
];

const COACHING_TIERS = [
  {
    id: 'alpha-athlete',
    name: 'Alpha Athlete',
    price: '4,500 EGP',
    billingPeriod: '3 Months',
    description: 'Perfect for the driven individual who needs a world-class plan and focused support. (Original: 7,000 EGP)',
    features: [
      { text: 'Initial Strength & Mobility Assessment', textAr: 'تحديد مستوي في القوة والمرونه وتحديد هدفك', included: true },
      { text: 'Custom 100% Training Program (Supervised by Akram)', textAr: 'تصميم برنامج تمرين مخصص (تحت اشراف كابتن أكرم)', included: true },
      { text: 'Detailed HD Exercise Video Library', textAr: 'كل تمرين مشروح بفيديوهات شرح تفصيلي', included: true },
      { text: 'Monthly Program Progressions', textAr: 'تغير البرنامج كل شهر بحد ادني', included: true },
      { text: 'Custom Nutrition Guidelines (Optional)', textAr: 'ارشادات تغذية مخصصه ليك (اختياري)', included: true },
      { text: 'Daily WhatsApp Support (Alpha Team Coach)', textAr: 'متابعة يومية مع مدرب من فريق ألفا', included: true },
      { text: 'Weekly Performance Video Form Checks', textAr: 'مراجعة فيديوهات لادائك للتأكد من ان الاداء صحيح', included: true },
      { text: 'Alpha Calisthenics App Access', textAr: 'وصول لمميزات تطبيق ألفا كاليستنكس', included: true },
      { text: 'Direct 1-on-1 Support with Akram', textAr: 'متابعة مباشرة مع كابتن أكرم', included: false },
      { text: 'Monthly Phone Consultation', textAr: 'مكالمة هاتفيه شهرياً', included: false }
    ],
    isPopular: false,
    ctaText: 'Become an Athlete'
  },
  {
    id: 'alpha-elite',
    name: 'Alpha Elite',
    price: '7,999 EGP',
    billingPeriod: '3 Months',
    description: 'Premium world-class coaching directly with Akram for elite results. (Original: 10,000 EGP)',
    features: [
      { text: 'Initial Strength & Mobility Assessment', textAr: 'تحديد مستوي في القوة والمرونه وتحديد هدفك', included: true },
      { text: 'Premium Custom Training Program', textAr: 'تصميم برنامج تمرين مخصص ليك ولهدفك', included: true },
      { text: 'Post-PT / Injury Specific Programming', textAr: 'التمرين بعد علاج طبيعي او حول الاصابات', included: true },
      { text: 'Direct Daily 1-on-1 with Coach Akram', textAr: 'متابعة يومية مباشرةً مع كابتن أكرم', included: true },
      { text: 'Monthly Phone Call with Akram', textAr: 'مكالمة هاتفيه مع كابتن أكرم', included: true },
      { text: 'Detailed HD Exercise Video Library', textAr: 'كل تمرين مشروح بفيديوهات شرح تفصيلي', included: true },
      { text: 'Monthly Program Progressions', textAr: 'تغير البرنامج كل شهر بحد ادني', included: true },
      { text: 'Full Nutrition & Macro Strategy', textAr: 'ارشادات تغذية مخصصه ليك', included: true },
      { text: 'Weekly Video Reviews (Direct with Akram)', textAr: 'مراجعة فيديوهات الاداء اسبوعياً', included: true },
      { text: 'Full Alpha App Access', textAr: 'وصول كامل لكل مميزات تطبيق ألفا كاليستنكس', included: true }
    ],
    isPopular: true,
    ctaText: 'Go Elite'
  }
];

const FAQS = [
  {
    id: 1,
    question: "Do I need a full gym setup to get started?",
    questionAr: "هل أحتاج لصالة رياضية كاملة للبدء؟",
    answer: "Not at all. Your programming is 100% custom-built around the equipment you actually have access to. Whether you train at a fully equipped commercial gym, a local calisthenics park, or just have a pull-up bar in your living room, I will design a plan that guarantees progress.",
    answerAr: "لا، نظام ألفا مصمم ليتكيف مع البيئة المحيطة بك. سواء كان لديك جيم كامل، أو بارات في الحديقة، أو حتى بار منزلي بسيط، سنبني برنامجك بناءً على الأدوات المتاحة لديك."
  },
  {
    id: 2,
    question: "How soon can I expect to see results?",
    questionAr: "متى يمكنني توقع رؤية النتائج؟",
    answer: "Most athletes feel an increase in energy and neural strength within the first 2 weeks. Visual physical changes typically become noticeable in 4-6 weeks of consistent adherence to the program and nutrition blocks.",
    answerAr: "يشعر معظم الرياضيين بزيادة في الطاقة والقوة خلال أول أسبوعين. أما التغيرات الجسدية الملحوظة فتظهر عادةً خلال ٤-٦ أسابيع من الالتزام المستمر بالبرنامج ونظام التغذية."
  },
  {
    id: 3,
    question: "I have a very busy schedule. Can this work for me?",
    questionAr: "جدولي مزدحم جداً، هل يمكن لهذا النظام أن ينجح معي؟",
    answer: "Yes. Efficiency is a core pillar of Alpha Coaching. We optimize your training sessions to yield maximum results in minimum time. Even with 45 minutes, 3-4 times a week, we can generate significant progress.",
    answerAr: "نعم. الكفاءة هي ركيزة أساسية في تدريب ألفا. نقوم بتحسين حصصك التدريبية لتحقيق أقصى قدر من النتائج في أقل وقت ممكن. حتى لو كان لديك ٤٥ دقيقة فقط، ٣-٤ مرات في الأسبوع، يمكننا تحقيق تقدم كبير."
  },
  {
    id: 4,
    question: "Is it safe if I have past injuries?",
    questionAr: "هل التدريب آمن إذا كان لدي إصابات سابقة؟",
    answer: "Safety and joint health are priorities. We focus on 'bulletproofing' your joints and improving mobility. If you have specific past injuries, we adjust the exercise selection to ensure you progress without pain or risk.",
    answerAr: "الأمان وصحة المفاصل من أولوياتنا. نركز على تقوية المفاصل وتحسين الحركة. إذا كان لديك إصابات سابقة، سنقوم بتعديل اختيار التمارين لضمان تقدمك بدون ألم أو خطر."
  },
  {
    id: 5,
    question: "Will the nutrition plan force me to give up the foods I love?",
    questionAr: "هل سيحرمني نظام التغذية من الأطعمة التي أحبها؟",
    answer: "Absolutely not. Restrictive diets fail. I’ll teach you how to properly fuel your body for performance and aesthetics using balance and macro-management without eliminating your favorites.",
    answerAr: "بالتأكيد لا. الحمية القاسية تفشل دائماً. سأعلمك كيف تغذي جسمك للأداء العالي والشكل المناسب باستخدام التوازن وإدارة السعرات دون حرمان."
  }
];

const TRANSFORMATIONS = [
  { id: 1, image: "/transformations/A-.png", clientName: "Alpha Results", clientNameAr: "نتائج ألفا" },
  { id: 2, image: "/transformations/ab.png", clientName: "Symmetry & Strength", clientNameAr: "التناسق والقوة" },
  { id: 3, image: "/transformations/fareed.png", clientName: "Fareed's Evolution", clientNameAr: "تطور فريد" },
  { id: 4, image: "/transformations/k.png", clientName: "Core Definition", clientNameAr: "تحديد العضلات الأساسية" },
  { id: 5, image: "/transformations/l.png", clientName: "Athlete Build", clientNameAr: "بنية رياضية" },
  { id: 6, image: "/transformations/o9.png", clientName: "Shredded Protocol", clientNameAr: "بروتوكول التنشيف" },
  { id: 7, image: "/transformations/re.png", clientName: "Back Power", clientNameAr: "قوة الظهر" },
  { id: 8, image: "/transformations/tt.png", clientName: "Total Body Recomp", clientNameAr: "إعادة تشكيل الجسم بالكامل" },
  { id: 9, image: "/transformations/tyu.png", clientName: "Alpha Performance", clientNameAr: "أداء ألفا" },
];

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const { user, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1]
      }
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 600);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-background text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container min-h-screen">
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-4">
            <LanguageToggle />
            <img alt="Alpha Calisthenics Logo" className="h-5 object-contain" src="/Alphalogowhite.png" />
            <div className="hidden sm:block h-6 w-px bg-white/10 mx-2"></div>
            <span className="hidden sm:block text-[10px] font-black uppercase tracking-[0.3em] text-on-surface-variant">Est. MMVI</span>
          </div>
          
          <div className="hidden md:flex items-center gap-10">
            <a className="text-sm font-bold tracking-tight hover:text-primary transition-colors" href="#about">About</a>
            <a className="text-sm font-bold tracking-tight hover:text-primary transition-colors" href="#packages">Coaching</a>
            <a className="text-sm font-bold tracking-tight hover:text-primary transition-colors" href="#faq">FAQ</a>
            <a className="text-sm font-bold tracking-tight hover:text-primary transition-colors" href="#contact">Contact</a>
            {user ? (
              <button onClick={() => navigate('/dashboard')} className="bg-primary-container text-on-primary-container px-6 py-2.5 rounded-lg border border-primary/20 font-black uppercase text-[10px] tracking-widest hover:shadow-[0_0_20px_rgba(255,255,255,0.15)] transition-all">
                Dashboard
              </button>
            ) : (
              <GoogleSignInButton onClick={signInWithGoogle} />
            )}
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            <span className="material-symbols-outlined text-2xl">
              {isMobileMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-[73px] left-0 w-full bg-background/95 backdrop-blur-xl border-b border-white/10 z-40 md:hidden overflow-hidden"
          >
            <div className="flex flex-col px-6 py-8 gap-6">
              <a className="text-primary font-bold text-lg" href="#about" onClick={() => setIsMobileMenuOpen(false)}>About</a>
              <a className="text-on-surface-variant font-bold text-lg" href="#packages" onClick={() => setIsMobileMenuOpen(false)}>Coaching</a>
              <a className="text-on-surface-variant font-bold text-lg" href="#faq" onClick={() => setIsMobileMenuOpen(false)}>FAQ</a>
              <a className="text-on-surface-variant font-bold text-lg" href="#contact" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
              <div className="h-px w-full bg-white/10 my-2"></div>
              {user ? (
                <button className="bg-primary-container text-on-primary-container px-5 py-4 rounded-xl font-black uppercase tracking-wider w-full mt-2" onClick={() => { setIsMobileMenuOpen(false); navigate('/dashboard'); }}>
                  Dashboard
                </button>
              ) : (
                <div className="mt-2">
                  <GoogleSignInButton onClick={() => { setIsMobileMenuOpen(false); signInWithGoogle(); }} className="w-full justify-center" />
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        <HeroVideo 
          title="Master your body. Unlock your power."
          subtitle="Step-by-step calisthenics programs designed to take you from your first pull-up to elite-level strength. No fluff, just results."
          localVideoUrl="/ALPHA_PROMO_web.mp4"
          poster="/actual images/Coach hero.png"
          isVertical={true}
          onCtaClick={() => {
            const el = document.getElementById('packages');
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <section id="about" className="py-24 px-6 bg-surface-container-lowest">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
            <div className="md:w-1/2">
              <div className="relative group">
                <div className="absolute -inset-4 bg-primary/20 rounded-3xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                <img src="/actual images/Coach hero.png" alt="Coach Akram" className="relative z-10 w-full rounded-2xl shadow-2xl grayscale hover:grayscale-0 transition-all duration-700" />
              </div>
            </div>
            <div className="md:w-1/2">
              <span className="text-on-surface font-black text-xs uppercase tracking-[0.3em] mb-4 block">The Mission</span>
              <h2 className="text-4xl md:text-6xl font-black font-headline mb-6 leading-tight uppercase">About Coach Akram</h2>
              <div className="space-y-6 text-on-surface-variant text-lg font-light leading-relaxed">
                <p>I don’t just hand you a generic template and hope for the best. <span className="text-white font-bold text-xl uppercase">I build athletes.</span></p>
                <p>With years of in-the-trenches experience mastering bodyweight mechanics, strength development, and physical transformation, I know exactly what it takes to break through plateaus and build a physique that performs as incredibly as it looks.</p>
                <p className="border-l-4 border-white pl-6 py-4 bg-white/5 italic text-white/90" dir="ltr">"My philosophy is simple: Zero guesswork. 100% custom programming. Every rep, every set, and every macro is calculated specifically for you."</p>
                <p>I am fully committed to your progression because your results are my reputation. If you are ready to put in the work, I am ready to show you exactly how far you can go.</p>
              </div>
              {user ? (
                <button onClick={() => navigate('/dashboard')} className="mt-10 px-8 py-4 bg-primary/20 border border-primary/30 text-white font-bold rounded-xl hover:bg-primary/30 transition-all uppercase tracking-widest text-xs">
                  Review Program
                </button>
              ) : (
                <button onClick={signInWithGoogle} className="mt-10 px-8 py-4 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 transition-all uppercase tracking-widest text-xs">
                  Let's Work
                </button>
              )}
            </div>
          </div>
        </section>

        <div id="packages">
          <PricingTier 
            tiers={COACHING_TIERS.map(tier => ({
              ...tier,
              onCtaClick: user ? () => navigate('/dashboard') : signInWithGoogle
            }))} 
          />
        </div>

        <section id="next-steps" className="py-24 px-6 bg-surface-container">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-black font-headline mb-4 uppercase tracking-tight">The Onboarding Flow</h2>
              <p className="text-on-surface-variant uppercase text-xs tracking-[0.2em]">Three steps to starting your <span className="text-white">transformation</span>.</p>
            </div>
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid grid-cols-1 md:grid-cols-3 gap-12"
            >
              {[
                { step: "01", title: "Initial Audit", desc: "Upon joining, you'll complete an intensive physical and nutritional audit. We identify your starting point and clear objectives." },
                { step: "02", title: "System Build", desc: "Coach Akram personally builds your custom training blocks and macro-strategy. Tailored to your biology." },
                { step: "03", title: "App Activation", desc: "Receive your private coaching app login. Your custom protocol, macros, and tracking tools will be synced and ready." }
              ].map((s, i) => (
                <motion.div 
                  key={i} 
                  variants={itemVariants}
                  className="relative group p-8 glass-card rounded-2xl border-white/5 hover:border-white/20 transition-all duration-500"
                >
                  <div className="w-14 h-14 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                    <span className="text-xl font-black text-white">{s.step}</span>
                  </div>
                  <h3 className="text-xl font-black uppercase tracking-tight mb-4">{s.title}</h3>
                  <p className="text-on-surface-variant text-sm leading-relaxed font-light opacity-80 group-hover:opacity-100 transition-opacity">{s.desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        <TransformationsSlideshow 
          transformations={TRANSFORMATIONS} 
          title="Witness the Transformation"
          titleAr="شاهد التحول"
          subtitle="Our athletes don't just train. They evolve. Explore the results of dedicated programming and elite-level discipline."
          subtitleAr="رياضيونا لا يكتفون بالتدريب، بل يتطورون. استكشف نتائج البرامج المخصصة والانضباط العالي."
          language={language as 'en' | 'ar'}
        />

        <section id="faq" className="py-24 px-6 max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-6xl font-black font-headline mb-4 uppercase tracking-tighter">Common Questions</h2>
            <p className="text-on-surface-variant uppercase text-xs tracking-[0.2em]">Everything you need to know before we start.</p>
          </div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="space-y-4"
          >
            {FAQS.map((faq, index) => (
              <motion.div 
                key={index} 
                variants={itemVariants}
                className="glass-card rounded-2xl overflow-hidden border-white/5 hover:border-white/10 transition-all"
              >
                <button 
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)} 
                  className="w-full px-8 py-7 flex items-center justify-between text-left hover:bg-white/5 transition-colors group"
                >
                  <span className="font-black uppercase tracking-tight text-sm opacity-90 group-hover:opacity-100 transition-opacity">
                    {language === 'ar' ? faq.questionAr : faq.question}
                  </span>
                  <span className={`material-symbols-outlined transition-transform duration-500 ${openFaqIndex === index ? 'rotate-180 text-primary' : ''}`}>
                    expand_more
                  </span>
                </button>
                <AnimatePresence>
                  {openFaqIndex === index && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }} 
                      animate={{ height: 'auto', opacity: 1 }} 
                      exit={{ height: 0, opacity: 0 }} 
                      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-8 pb-8 text-on-surface-variant text-sm leading-relaxed border-t border-white/5 pt-6 font-light opacity-90">
                        {language === 'ar' ? faq.answerAr : faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </motion.div>
        </section>

        <section id="community" className="py-24 bg-surface-container-lowest">
          <div className="px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-20">
            <div className="lg:w-1/2">
              <span className="text-primary font-black text-[10px] uppercase tracking-[0.4em] mb-6 block">The Alpha Tribe</span>
              <h2 className="text-4xl md:text-6xl font-black font-headline mb-8 leading-tight uppercase tracking-tight">Join a global tribe of driven athletes.</h2>
              <p className="text-on-surface-variant text-lg mb-12 font-light leading-relaxed">Connect with thousands of members, share your progress, and get expert feedback. The journey is better together.</p>
              <div className="grid grid-cols-2 gap-12 mb-12">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="text-5xl md:text-6xl font-black font-headline text-gradient-premium mb-2 tracking-tighter" dir="ltr">12K+</div>
                  <div className="text-[10px] text-on-surface-variant uppercase font-black tracking-[0.3em] opacity-60">Active Members</div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="text-5xl md:text-6xl font-black font-headline text-gradient-premium mb-2 tracking-tighter" dir="ltr">890+</div>
                  <div className="text-[10px] text-on-surface-variant uppercase font-black tracking-[0.3em] opacity-60">Local Groups</div>
                </motion.div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-5 p-5 glass-card rounded-2xl border-white/5">
                  <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center font-black text-primary text-xs tracking-tighter shadow-lg">JD</div>
                  <p className="text-sm font-medium italic opacity-90">"Just hit my first muscle-up after 4 weeks of the program! The progressions actually work."</p>
                </div>
              </div>
            </div>
            <div className="lg:w-1/2 relative group">
              <div className="aspect-square relative rounded-3xl overflow-hidden shadow-2xl skew-y-3 group-hover:skew-y-0 transition-transform duration-1000">
                <img className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000" alt="Community training" src="/community-vibe.png" />
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <button onClick={() => setIsVideoModalOpen(true)} className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center hover:scale-110 transition-all shadow-2xl">
                    <span className="material-symbols-outlined text-5xl">play_arrow</span>
                  </button>
                </div>
              </div>
              <div className="absolute -bottom-10 -right-4 p-8 glass-card rounded-2xl max-w-[280px] hidden md:block border-white/20 shadow-2xl">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_10px_#10b981]"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-400">Live Community Feed</span>
                </div>
                <p className="text-xs leading-relaxed font-light italic">Join the Alpha Live Session starting in <span className="text-white font-bold">14:02</span>. 420 athletes already in.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-40 px-6 text-center bg-background relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px] pointer-events-none opacity-50"></div>
          <div className="relative z-10 max-w-4xl mx-auto">
            <h2 className="text-5xl md:text-8xl font-black font-headline mb-10 leading-[0.9] uppercase tracking-tighter">Ready to rewrite your<br/><span className="gradient-text">potential?</span></h2>
            <p className="text-on-surface-variant text-xl mb-16 max-w-2xl mx-auto font-light tracking-wide">Get unlimited access to all coaching plans, nutrition blocks, and our exclusive athlete community today.</p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full">
              {user ? (
                <button onClick={() => navigate('/dashboard')} className="w-full sm:w-auto px-12 py-6 bg-primary-container text-on-primary-container font-black text-xl rounded-xl hover:scale-110 transition-all shadow-[0_0_60px_rgba(255,255,255,0.15)] uppercase tracking-[0.2em]">
                  Go to Dashboard
                </button>
              ) : (
                <GoogleSignInButton 
                  onClick={signInWithGoogle} 
                  text="Start Your Transformation"
                  className="w-full sm:w-auto px-12 py-8 text-xl font-headline tracking-tight uppercase"
                />
              )}
              <a href="#packages" className="w-full sm:w-auto px-12 py-6 border border-white/20 text-white font-black text-xl rounded-xl hover:bg-white/10 transition-all inline-block text-center uppercase tracking-[0.2em]">
                View Packages
              </a>
            </div>
            <p className="mt-12 text-[10px] font-black uppercase tracking-[0.4em] text-on-surface-variant/40">No long-term commitment. Cancel anytime.</p>
          </div>
        </section>

        <Contact />
      </main>

      <footer className="w-full py-20 border-t border-white/5 bg-background font-body text-[10px] text-on-surface-variant uppercase tracking-[0.2em]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-12 mb-12">
            <img alt="Alpha Logo" className="h-6 object-contain opacity-30" src="/Alphalogowhite.png" />
            <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-14 font-black">
              <a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
              <a className="hover:text-primary transition-colors" href="#">Terms of Service</a>
              <a className="hover:text-primary transition-colors" href="#contact">Contact Support</a>
            </div>
          </div>
          <div className="text-center md:text-left font-bold opacity-20">
            © 2026 Alpha Fitness. All rights reserved. Built by Michael Mitry.
          </div>
        </div>
      </footer>

      <AnimatePresence>
        {showScrollTop && (
          <motion.button initial={{ opacity: 0, scale: 0.5, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.5, y: 20 }} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={scrollToTop} className="fixed bottom-10 right-10 z-50 p-5 bg-white text-black rounded-full shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)] transition-all flex items-center justify-center" aria-label="Scroll to top">
            <span className="material-symbols-outlined text-3xl block leading-none">arrow_upward</span>
          </motion.button>
        )}
      </AnimatePresence>

      <VideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} videoUrl="" />
    </div>
  );
}
