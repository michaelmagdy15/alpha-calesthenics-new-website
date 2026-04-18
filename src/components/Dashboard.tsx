import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import Breadcrumbs from './Breadcrumbs';
import { FileWarning, ChevronRight, Activity, Zap, Play } from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ pullupsToday: 0, completedWorkouts: 0 });
  const [assessment, setAssessment] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchData = async () => {
      try {
        // Fetch user data
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          setUserData(userDocSnap.data());
        }

        // Fetch assessment
        const assessmentDocRef = doc(db, 'assessments', user.uid);
        const assessmentSnap = await getDoc(assessmentDocRef);
        if (assessmentSnap.exists()) {
          setAssessment(assessmentSnap.data());
        }

        // Fetch progress details
        const q = query(collection(db, 'userProgress'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        let pullups = 0;
        let workouts = 0;
        querySnapshot.forEach((d) => {
          const data = d.data();
          pullups += data.pullupsToday || 0;
          workouts += data.completedWorkouts || 0;
        });
        setStats({ pullupsToday: pullups, completedWorkouts: workouts });

      } catch (error) {
        console.error("Error fetching dashboard data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full" />
      </div>
    );
  }

  const isClient = userData?.role === 'paid_client' || userData?.packageTier;
  const hasAssessment = !!assessment;

  return (
    <div className="bg-background text-on-surface font-body min-h-screen pt-24 px-6">
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5 left-0">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <img alt="Alpha Calisthenics Logo" className="h-5 object-contain" src="/Alphalogowhite.png" />
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-on-surface-variant hidden sm:block">Welcome, {user.displayName || 'Athlete'}</span>
            {user.photoURL && <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border border-white/20" />}
            <button onClick={logout} className="text-sm font-semibold hover:text-primary transition-colors">Log Out</button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-12">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Dashboard' }]} />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-black font-headline mb-4">Dashboard</h1>
          <p className="text-on-surface-variant text-lg">Track your progress and access your programs.</p>
        </motion.div>

        {!isClient && (
          <div className="mb-12 p-6 glass-card rounded-2xl border border-primary/20 bg-primary/5 flex flex-col sm:flex-row gap-6 items-center justify-between">
            <div>
              <h2 className="text-xl font-bold uppercase tracking-tight text-white mb-2">Ready to Commit?</h2>
              <p className="text-on-surface-variant text-sm">You haven't selected a coaching package yet. Start your journey with Coach Akram today.</p>
            </div>
            <button onClick={() => navigate('/#packages-section')} className="px-6 py-3 shrink-0 bg-primary text-on-primary font-bold uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-95 transition-all">
              View Packages
            </button>
          </div>
        )}

        {isClient && !hasAssessment && (
          <div className="mb-12 p-6 glass-card rounded-2xl border border-amber-500/20 bg-amber-500/10 flex flex-col sm:flex-row gap-6 items-center justify-between">
            <div className="flex items-start gap-4">
              <FileWarning className="w-8 h-8 text-amber-500 shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-bold uppercase tracking-tight text-white mb-2">Onboarding Required</h2>
                <p className="text-amber-200/70 text-sm">We need your baseline metrics before initializing your personalized protocol.</p>
              </div>
            </div>
            <button onClick={() => navigate('/onboarding')} className="px-6 py-3 shrink-0 bg-amber-500 text-black font-bold uppercase tracking-widest rounded-xl hover:brightness-110 active:scale-95 transition-all flex items-center gap-2">
              Start Onboarding <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 rounded-2xl border-l-4 border-l-primary"
          >
            <div className="text-on-surface-variant text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
              <Zap className="w-4 h-4 text-primary" /> Max Pull-ups
            </div>
            <div className="text-4xl font-black font-headline text-primary">{assessment?.maxPullups || 0}</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-2xl border-l-4 border-l-blue-500"
          >
            <div className="text-on-surface-variant text-sm font-bold uppercase tracking-widest mb-2">Workouts Completed</div>
            <div className="text-4xl font-black font-headline text-blue-400">{stats.completedWorkouts}</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="glass-card p-6 rounded-2xl border-l-4 border-l-emerald-500"
          >
            <div className="text-on-surface-variant text-sm font-bold uppercase tracking-widest mb-2">Current Streak</div>
            <div className="text-4xl font-black font-headline text-emerald-400">3 Days</div>
          </motion.div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 rounded-2xl border-l-4 border-l-amber-500"
          >
            <div className="text-on-surface-variant text-sm font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-500" /> Primary Goal
            </div>
            <div className="text-2xl font-black font-headline text-amber-400 mt-2 truncate">
              {assessment?.primaryGoal ? assessment.primaryGoal.replace(/([A-Z])/g, ' $1').trim() : 'Setting...'}
            </div>
          </motion.div>
        </div>

        <h2 className="text-2xl font-bold font-headline mb-6">Your Protocol Status</h2>
        {isClient && hasAssessment ? (
          <div className="space-y-6">
            {/* Custom Routine Card */}
            <div className={`glass-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 items-center border ${assessment?.adminData?.deliverables?.customRoutineStatus === 'Assigned' ? 'border-primary/40' : 'border-white/10'}`}>
              <div className="w-full md:w-1/3 aspect-video rounded-xl overflow-hidden relative bg-black/50 border border-white/5">
                {assessment?.adminData?.deliverables?.customRoutineStatus === 'Assigned' ? (
                  <>
                    <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW1iJJ5COTEESGU5Q5slMC8_hQVHJYYZd8fuBZZlfah_0inRgaSJAZd1kj4QZJrAELIO72CcxMmSaeW_AJbwjR2DH2Yt1xjJKfAA06WQRkJxMJ4vPcaTr91d_IQgHKkkETbP39UsHE-P96en8xXDe0_jJh2DPrUPqbTmQgcUENsHGI_Pjf2ZhQRempu8SjQ-IwERetSoZ8zoe9-QBEPfOKj4ws8F13bYsIZLXcEfBaawnqRLD9QrLAv5jM1jzFBjGmGhJKTyvN5cRf" alt="Custom Plan" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                      <Play className="w-12 h-12 text-white/90 drop-shadow-lg" />
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Activity className="w-8 h-8 text-primary/40 animate-pulse" />
                  </div>
                )}
              </div>
              <div className="w-full md:w-2/3">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-2xl font-bold font-headline">Alpha Custom Profile</h3>
                  <span className={`text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border ${
                    assessment?.adminData?.deliverables?.customRoutineStatus === 'Assigned' 
                      ? 'bg-primary/20 text-primary border-primary/30'
                      : 'bg-white/5 text-on-surface-variant border-white/10'
                  }`}>
                    {assessment?.adminData?.deliverables?.customRoutineStatus || 'Pending Review'}
                  </span>
                </div>
                <p className="text-on-surface-variant mb-6 text-sm">
                   {assessment?.adminData?.deliverables?.customRoutineStatus === 'Assigned' 
                     ? `Targeting: ${assessment?.primaryGoal ? assessment.primaryGoal.replace(/([A-Z])/g, ' $1').trim() : 'Strength'}. Your customized protocol is active and ready.` 
                     : 'Coach Akram is reviewing your metrics and drafting your personalized protocol.'}
                </p>
                
                {assessment?.adminData?.deliverables?.customRoutineStatus === 'Assigned' ? (
                  <>
                    <div className="mb-2 flex justify-between text-xs font-bold">
                      <span>Progress</span>
                      <span className="text-primary">0%</span>
                    </div>
                    <div className="w-full bg-white/10 rounded-full h-2 mb-6 overflow-hidden">
                      <div className="bg-primary h-2 rounded-full" style={{ width: '0%' }}></div>
                    </div>
                    <button className="px-6 py-3 bg-primary text-on-primary font-bold uppercase tracking-widest rounded-xl hover:brightness-110 transition-all text-sm w-full md:w-auto">
                      Access Training Hub
                    </button>
                  </>
                ) : (
                  <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden">
                    <div className="bg-primary/30 h-2 rounded-full w-full animate-pulse"></div>
                  </div>
                )}
              </div>
            </div>

            {/* Nutrition & Mobility Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-bold font-headline">Nutritional Strategy</h4>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest border ${
                      assessment?.adminData?.deliverables?.nutritionalPlan && assessment.adminData.deliverables.nutritionalPlan !== 'Pending'
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                        : 'bg-white/5 text-on-surface-variant border-white/10'
                    }`}>
                      {assessment?.adminData?.deliverables?.nutritionalPlan || 'Pending'}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-sm mb-6">
                    {assessment?.adminData?.deliverables?.nutritionalPlan && assessment.adminData.deliverables.nutritionalPlan !== 'Pending'
                      ? 'Your dietary protocols have been assigned. Review your drive folder for details.'
                      : 'Waiting on coach assessment to determine required dietary provisioning.'}
                  </p>
                </div>
                {assessment?.adminData?.links?.drive && (
                  <a href={assessment.adminData.links.drive} target="_blank" rel="noreferrer" className="w-full block text-center px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold uppercase tracking-wider text-xs rounded-lg transition-colors">
                    Open Drive Folder
                  </a>
                )}
              </div>

              <div className="glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-bold font-headline">Mobility Routine</h4>
                    <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest border ${
                      assessment?.adminData?.deliverables?.mobilityRoutineStatus === 'Assigned'
                        ? 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        : 'bg-white/5 text-on-surface-variant border-white/10'
                    }`}>
                      {assessment?.adminData?.deliverables?.mobilityRoutineStatus || 'Not Assigned'}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-sm mb-6">
                    {assessment?.adminData?.deliverables?.mobilityRoutineStatus === 'Assigned'
                      ? 'A custom mobility flow has been generated for your specific biomechanical needs.'
                      : 'No specific mobility routines currently needed or assigned.'}
                  </p>
                </div>
                {assessment?.adminData?.links?.whatsapp && (
                  <a href={assessment.adminData.links.whatsapp} target="_blank" rel="noreferrer" className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold uppercase tracking-wider text-xs rounded-lg transition-colors">
                    Join WhatsApp Coach Chat
                  </a>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-12 text-center border-white/5 border-dashed">
            <h3 className="text-on-surface-variant text-lg font-bold mb-2">No Active Programs</h3>
            <p className="text-on-surface-variant/60 text-sm max-w-sm mx-auto">
              {!isClient 
                ? "You need to select a package first before accessing a program."
                : "Your program will appear here once your onboarding assessment is completed."}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
