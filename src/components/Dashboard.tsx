import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import Breadcrumbs from './Breadcrumbs';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ pullupsToday: 0, completedWorkouts: 0 });

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const fetchProgress = async () => {
      try {
        const q = query(collection(db, 'userProgress'), where('userId', '==', user.uid));
        const querySnapshot = await getDocs(q);
        let pullups = 0;
        let workouts = 0;
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          pullups += data.pullupsToday || 0;
          workouts += data.completedWorkouts || 0;
        });
        setStats({ pullupsToday: pullups, completedWorkouts: workouts });
      } catch (error) {
        console.error("Error fetching progress", error);
      }
    };

    fetchProgress();
  }, [user, navigate]);

  if (!user) return null;

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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 rounded-2xl border-l-4 border-l-primary"
          >
            <div className="text-on-surface-variant text-sm font-bold uppercase tracking-widest mb-2">Pull-ups Today</div>
            <div className="text-4xl font-black font-headline text-primary">{stats.pullupsToday}</div>
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
            <div className="text-on-surface-variant text-sm font-bold uppercase tracking-widest mb-2">Next Milestone</div>
            <div className="text-2xl font-black font-headline text-amber-400 mt-2">Muscle-Up</div>
          </motion.div>
        </div>

        <h2 className="text-2xl font-bold font-headline mb-6">Your Active Programs</h2>
        <div className="glass-card rounded-2xl p-8 flex flex-col md:flex-row gap-8 items-center">
          <div className="w-full md:w-1/3 aspect-video rounded-xl overflow-hidden relative">
            <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW1iJJ5COTEESGU5Q5slMC8_hQVHJYYZd8fuBZZlfah_0inRgaSJAZd1kj4QZJrAELIO72CcxMmSaeW_AJbwjR2DH2Yt1xjJKfAA06WQRkJxMJ4vPcaTr91d_IQgHKkkETbP39UsHE-P96en8xXDe0_jJh2DPrUPqbTmQgcUENsHGI_Pjf2ZhQRempu8SjQ-IwERetSoZ8zoe9-QBEPfOKj4ws8F13bYsIZLXcEfBaawnqRLD9QrLAv5jM1jzFBjGmGhJKTyvN5cRf" alt="Fundamentals" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="material-symbols-outlined text-5xl text-white/80">lock_open</span>
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-2xl font-bold font-headline">Alpha Fundamentals</h3>
              <span className="bg-primary/20 text-primary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest border border-primary/30">In Progress</span>
            </div>
            <p className="text-on-surface-variant mb-6">Week 2: Core stability and push-up progressions.</p>
            
            <div className="mb-2 flex justify-between text-xs font-bold">
              <span>Progress</span>
              <span className="text-primary">30%</span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mb-6 overflow-hidden">
              <div className="bg-primary h-2 rounded-full" style={{ width: '30%' }}></div>
            </div>
            
            <button className="px-6 py-3 bg-primary text-on-primary font-bold rounded-lg hover:brightness-110 transition-all">
              Continue Workout
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
