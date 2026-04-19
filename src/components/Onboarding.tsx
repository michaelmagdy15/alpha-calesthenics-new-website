import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ChevronRight, ChevronLeft, Save, Flag, Flame, User, Youtube } from 'lucide-react';

type Step = 'biometrics' | 'baseline' | 'video' | 'complete';

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState<Step>('biometrics');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form Data State
  const [formData, setFormData] = useState({
    age: '',
    weight: '',
    height: '',
    activityLevel: 'Moderate',
    trainingHistory: '',
    maxPullups: '',
    maxPushups: '',
    injuryHistory: '',
    primaryGoal: 'Strength',
    videoType: 'Pull-ups',
    videoFile: null as File | null
  });

  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData(prev => ({ ...prev, videoFile: e.target.files![0] }));
    }
  };

  const handleNext = (nextStep: Step) => {
    setCurrentStep(nextStep);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async () => {
    if (!user) return;
    setIsSubmitting(true);

    try {
      let formVideoUrl = '';
      if (formData.videoFile) {
        const uploadData = new FormData();
        uploadData.append('video', formData.videoFile);
        uploadData.append('userId', user.uid);
        uploadData.append('videoType', formData.videoType);

        try {
          const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';
          const response = await fetch(`${backendUrl}/api/assessment/upload`, {
            method: 'POST',
            body: uploadData,
          });
          const result = await response.json();
          if (result.success && result.clientVideo?.driveFileId) {
            formVideoUrl = `https://drive.google.com/file/d/${result.clientVideo.driveFileId}/view`;
          }
        } catch (uploadError) {
          console.error("Video upload failed:", uploadError);
        }
      }

      const assessmentRef = doc(db, 'assessments', user.uid);
      
      const assessmentData = {
        age: parseInt(formData.age) || 0,
        weight: formData.weight,
        height: formData.height,
        activityLevel: formData.activityLevel,
        trainingHistory: formData.trainingHistory,
        maxPullups: formData.maxPullups,
        maxPushups: formData.maxPushups,
        injuryHistory: formData.injuryHistory,
        primaryGoal: formData.primaryGoal,
        videoType: formData.videoType,
        formVideoUrl,
        hasUploadedVideo: !!formData.videoFile,
        userId: user.uid,
        userName: user.displayName || 'Athlete',
        status: 'pending_review'
      };

      try {
        await setDoc(assessmentRef, {
          ...assessmentData,
          createdAt: new Date().toISOString()
        });
      } catch (e: any) {
        console.warn("Possible pre-existing document, using update strategy", e);
        // Fallback for pre-existing docs to avoid changing createdAt (which causes permission denied)
        const { updateDoc } = await import('firebase/firestore');
        await updateDoc(assessmentRef, assessmentData);
      }

      setCurrentStep('complete');
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    } catch (error) {
      console.error("Error saving assessment:", error);
      alert("There was an error saving your assessment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) return null;

  const renderBiometrics = () => (
    <motion.div
      key="biometrics"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
          <User className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight">Step 1: Bio & Base</h2>
        <p className="text-on-surface-variant text-sm mt-2">Let's establish your starting point.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-on-surface-variant tracking-widest pl-2">Age</label>
          <input 
            type="number" 
            name="age"
            value={formData.age}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-white/20"
            placeholder="e.g. 25"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-on-surface-variant tracking-widest pl-2">Weight (kg)</label>
          <input 
            type="number" 
            name="weight"
            value={formData.weight}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-white/20"
            placeholder="e.g. 75"
          />
        </div>
        <div className="space-y-2 md:col-span-1 col-span-2">
          <label className="text-xs font-bold uppercase text-on-surface-variant tracking-widest pl-2">Height (cm)</label>
          <input 
            type="number" 
            name="height"
            value={formData.height}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-white/20"
            placeholder="e.g. 180"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase text-on-surface-variant tracking-widest pl-2">Current Activity Level</label>
        <select 
          name="activityLevel"
          value={formData.activityLevel}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none text-white [&>option]:bg-surface-container"
        >
          <option value="Sedentary">Sedentary (Little to no exercise)</option>
          <option value="Light">Light (1-2 days/week)</option>
          <option value="Moderate">Moderate (3-4 days/week)</option>
          <option value="Active">Active (5-6 days/week)</option>
          <option value="Athlete">Athlete (Intense training)</option>
        </select>
      </div>

      <button onClick={() => handleNext('baseline')} className="w-full py-4 mt-8 rounded-xl font-black uppercase tracking-widest bg-primary text-on-primary hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
        Next Step <ChevronRight className="w-5 h-5" />
      </button>
    </motion.div>
  );

  const renderBaseline = () => (
    <motion.div
      key="baseline"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
          <Flame className="w-8 h-8 text-amber-500" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight">Step 2: Calisthenics Baseline</h2>
        <p className="text-on-surface-variant text-sm mt-2">Be honest. We need real numbers to plot the route.</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-on-surface-variant tracking-widest pl-2">Max Pull-ups</label>
          <input 
            type="number" 
            name="maxPullups"
            value={formData.maxPullups}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-white/20"
            placeholder="Strict form"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-on-surface-variant tracking-widest pl-2">Max Push-ups</label>
          <input 
            type="number" 
            name="maxPushups"
            value={formData.maxPushups}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-white/20"
            placeholder="Strict form"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase text-on-surface-variant tracking-widest pl-2">Primary Goal</label>
        <select 
          name="primaryGoal"
          value={formData.primaryGoal}
          onChange={handleChange}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none text-white [&>option]:bg-surface-container"
        >
          <option value="Strength">Raw Strength & Basics</option>
          <option value="Endurance">High Rep Endurance</option>
          <option value="Shredding">Body Recomposition & Fat Loss</option>
          <option value="MuscleUp">Unlock the Muscle-up</option>
          <option value="FrontLever">Unlock the Front Lever</option>
          <option value="HumanFlag">Unlock the Human Flag</option>
        </select>
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase text-on-surface-variant tracking-widest pl-2">Training History</label>
        <textarea 
          name="trainingHistory"
          value={formData.trainingHistory}
          onChange={handleChange}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none placeholder:text-white/20 text-sm leading-relaxed"
          placeholder="Describe your training background (gym, calisthenics, sports, etc.)"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs font-bold uppercase text-on-surface-variant tracking-widest pl-2">Injury History (Leave blank if none)</label>
        <textarea 
          name="injuryHistory"
          value={formData.injuryHistory}
          onChange={handleChange}
          rows={3}
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-none placeholder:text-white/20 text-sm leading-relaxed"
          placeholder="Past shoulder issues, wrist pain, etc."
        />
      </div>

      <div className="flex gap-4 mt-8">
        <button onClick={() => handleNext('biometrics')} className="w-1/3 py-4 rounded-xl font-bold uppercase tracking-widest bg-white/5 text-white hover:bg-white/10 transition-all flex items-center justify-center">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <button onClick={() => handleNext('video')} className="w-2/3 py-4 rounded-xl font-black uppercase tracking-widest bg-primary text-on-primary hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          Next Step <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </motion.div>
  );

  const renderVideo = () => (
    <motion.div
      key="video"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <div className="text-center mb-8">
        <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center mx-auto mb-4">
          <Youtube className="w-8 h-8 text-blue-500" />
        </div>
        <h2 className="text-2xl font-black uppercase tracking-tight">Step 3: Form Check</h2>
        <p className="text-on-surface-variant text-sm mt-2">Paste a link to a video of your current pull-up/push-up form (Google Drive, YouTube unlisted).</p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-on-surface-variant tracking-widest pl-2">Workout / Skill Type</label>
          <select 
            name="videoType"
            value={formData.videoType}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all appearance-none text-white [&>option]:bg-surface-container"
          >
            <option value="Pull-ups">Pull-ups (Strict)</option>
            <option value="Push-ups">Push-ups (Strict)</option>
            <option value="Dips">Dips</option>
            <option value="Muscle-up">Muscle-up Attempt</option>
            <option value="Front Lever">Front Lever Attempt</option>
            <option value="Planche">Planche Attempt</option>
            <option value="Handstand">Handstand Attempt</option>
            <option value="Other">Other Freestyle / Basics</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-bold uppercase text-on-surface-variant tracking-widest pl-2">Video File (Max ~200MB)</label>
          <div className="relative">
            <input 
              type="file" 
              accept="video/*"
              name="videoFile"
              onChange={handleFileChange}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-blue-500 file:text-white hover:file:bg-blue-600 file:cursor-pointer cursor-pointer text-sm text-white/70"
            />
          </div>
        </div>
      </div>
      
      <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-xs text-blue-200/80 leading-relaxed italic">
        Please ensure your video is well-lit and captures your entire body to allow Coach Akram to audit your biomechanics fully. Our system will compress it automatically before securely storing it.
      </div>

      <div className="flex gap-4 mt-8">
        <button onClick={() => handleNext('baseline')} className="w-1/3 py-4 rounded-xl font-bold uppercase tracking-widest bg-white/5 text-white hover:bg-white/10 transition-all flex items-center justify-center">
          <ChevronLeft className="w-5 h-5" /> Back
        </button>
        <button onClick={handleSubmit} disabled={isSubmitting} className="w-2/3 py-4 rounded-xl font-black uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
          {isSubmitting ? (
             <>
               <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
               Submitting...
             </>
          ) : (
            <>
              <Save className="w-5 h-5" /> Submit Audit
            </>
          )}
        </button>
      </div>
    </motion.div>
  );

  const renderComplete = () => (
    <motion.div
      key="complete"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="text-center py-10"
    >
      <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-6">
        <Flag className="w-12 h-12 text-primary" />
      </div>
      <h2 className="text-3xl font-black uppercase tracking-tight mb-4 text-white">Audit Received</h2>
      <p className="text-on-surface-variant leading-relaxed max-w-sm mx-auto">
        Coach Akram will review your data and assign your custom protocol soon.
        <br/><br/>
        Taking you to your Dashboard...
      </p>
    </motion.div>
  );

  return (
    <div className="bg-background text-on-surface font-body min-h-screen pt-32 px-6 pb-24">
      <div className="max-w-xl mx-auto w-full">
        {/* Progress Tracker */}
        {currentStep !== 'complete' && (
          <div className="flex items-center gap-2 mb-12">
            {['biometrics', 'baseline', 'video'].map((step, index) => {
              const stages = ['biometrics', 'baseline', 'video'];
              const isActive = step === currentStep;
              const isPast = stages.indexOf(step) < stages.indexOf(currentStep);
              
              return (
                <React.Fragment key={step}>
                  <div className={`h-2 flex-1 rounded-full transition-all duration-500 ${isActive ? 'bg-primary' : isPast ? 'bg-primary/40' : 'bg-white/5'}`} />
                </React.Fragment>
              );
            })}
          </div>
        )}

        <div className="glass-card rounded-3xl p-6 md:p-10 border-white/5 shadow-2xl relative overflow-hidden">
          {/* Subtle bg glow */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-[80px] pointer-events-none"></div>

          <AnimatePresence mode="wait">
            {currentStep === 'biometrics' && renderBiometrics()}
            {currentStep === 'baseline' && renderBaseline()}
            {currentStep === 'video' && renderVideo()}
            {currentStep === 'complete' && renderComplete()}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
