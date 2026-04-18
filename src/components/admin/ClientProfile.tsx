import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, User as UserIcon, ShieldCheck, Mail, Send, 
  ExternalLink, BarChart3, Dumbbell, ClipboardList, Utensils,
  MessageSquare, FolderOpen, Key, Activity
} from 'lucide-react';
import { Client, PackageTier, ClientStatus } from '../../types/admin';
import StatusBadge from './StatusBadge';
import Breadcrumbs from '../Breadcrumbs';

// Reusing MOCK_CLIENTS for simplicity
const MOCK_CLIENTS: Client[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    joinDate: '2026-03-15',
    packageTier: 'Alpha Elite',
    status: 'Active in App',
    assessmentData: {
      age: 28, height: "180cm", weight: "85kg", fitnessGoals: "Muscle Gain",
      maxPullups: 12, maxPushups: 35, mobilityLimitations: "Tight shoulders", injuryHistory: "None"
    },
    deliverables: { customRoutineStatus: 'Assigned', nutritionalPlan: 'Custom Diet Plan', mobilityRoutineStatus: 'Assigned' },
    whatsappLink: 'https://wa.me/group-link-id',
    googleDriveLink: 'https://drive.google.com/folder-id',
    appCredentialsSent: true
  },
  {
    id: '2',
    name: 'Sarah Smith',
    email: 'sarah@example.com',
    joinDate: '2026-04-01',
    packageTier: 'Alpha Athlete',
    status: 'Assessment Pending',
    assessmentData: {
      age: 25, height: "165cm", weight: "60kg", fitnessGoals: "Fat Loss & Strength",
      maxPullups: 2, maxPushups: 15, mobilityLimitations: "Ankle mobility", injuryHistory: "ACL surgery 2023"
    },
    deliverables: { customRoutineStatus: 'Not Started', nutritionalPlan: 'Pending', mobilityRoutineStatus: 'Not Assigned' },
    appCredentialsSent: false
  }
];

const ClientProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Find client from mock data
  const client: Client | undefined = MOCK_CLIENTS.find(c => c.id === id);

  if (!client) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-on-surface">
        <div className="text-center">
          <h2 className="text-2xl font-black mb-4">CLIENT NOT FOUND</h2>
          <button onClick={() => navigate('/admin')} className="text-primary hover:underline">Return to Roster</button>
        </div>
      </div>
    );
  }

  const [deliverables, setDeliverables] = useState(client.deliverables);
  const [links, setLinks] = useState({ whatsapp: client.whatsappLink || '', drive: client.googleDriveLink || '' });
  const [isProvisioning, setIsProvisioning] = useState(false);
  const [provisioned, setProvisioned] = useState(client.appCredentialsSent);

  const handleLinkSave = (type: 'whatsapp' | 'drive') => {
    // In a real app, this would hit an API
    alert(`Saved ${type} link: ${links[type]}`);
  };

  const triggerProvisioning = () => {
    setIsProvisioning(true);
    // Simulate API call
    setTimeout(() => {
      setIsProvisioning(false);
      setProvisioned(true);
      alert("Success: Credentials sent to client via email and WhatsApp.");
    }, 2000);
  };

  return (
    <div className="bg-background text-on-surface font-body min-h-screen pt-24 px-6 pb-20">
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5 left-0">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
          <button 
            onClick={() => navigate('/admin')}
            className="flex items-center gap-2 text-on-surface-variant hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-xs font-bold uppercase tracking-widest">Back to Roster</span>
          </button>
          <div className="flex items-center gap-3">
             <span className="text-white font-headline text-lg italic tracking-tighter">CLIENT VIEW // {client.id}</span>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Admin', path: '/admin' }, { label: client.name }]} />

        {/* Header Header */}
        <section className="mb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center"
          >
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-4xl font-black text-primary border-4 border-white/5">
              {client.name.charAt(0)}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-black font-headline uppercase italic tracking-tighter mb-2">{client.name}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 items-center">
                <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                  <Mail className="w-4 h-4" />
                  {client.email}
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant text-sm border-l border-white/10 pl-4 md:border-none md:pl-0">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Member since {client.joinDate}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <StatusBadge type="tier" value={client.packageTier} />
              <StatusBadge type="status" value={client.status} />
            </div>
          </motion.div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Section A: Assessment & Biometrics (Left Column) */}
          <div className="lg:col-span-2 space-y-8">
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-6 border-l-4 border-l-primary"
            >
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <BarChart3 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-black font-headline uppercase">Assessment & Biometrics</h3>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                {[
                  { label: 'Age', value: client.assessmentData.age },
                  { label: 'Height', value: client.assessmentData.height },
                  { label: 'Weight', value: client.assessmentData.weight },
                  { label: 'Goals', value: client.assessmentData.fitnessGoals },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">{stat.label}</div>
                    <div className="text-sm font-bold text-white">{stat.value}</div>
                  </div>
                ))}
              </div>

              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Dumbbell className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold uppercase tracking-widest">Baseline Strength</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <div className="text-[10px] uppercase font-bold text-on-surface-variant">Max Pull-ups</div>
                      <div className="text-2xl font-black font-headline text-primary">{client.assessmentData.maxPullups}</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                      <div className="text-[10px] uppercase font-bold text-on-surface-variant">Max Push-ups</div>
                      <div className="text-2xl font-black font-headline text-primary">{client.assessmentData.maxPushups}</div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Mobility & Limitations</div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-sm text-on-surface leading-relaxed">
                      {client.assessmentData.mobilityLimitations}
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Injury History</div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-sm text-on-surface leading-relaxed">
                      {client.assessmentData.injuryHistory}
                    </div>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section B: Deliverables & Program Tracking */}
            <motion.section 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-6 border-l-4 border-l-blue-500"
            >
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <ClipboardList className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-black font-headline uppercase">Deliverables & Program Tracking</h3>
              </div>

              <div className="space-y-4">
                {/* 4-Week Custom Routine */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <Dumbbell className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">4-Week Custom Routine</div>
                      <div className="text-[10px] text-on-surface-variant uppercase font-bold">Priority: High</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <select 
                      value={deliverables.customRoutineStatus}
                      onChange={(e) => setDeliverables({...deliverables, customRoutineStatus: e.target.value as any})}
                      className="bg-background border border-white/20 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:border-primary"
                    >
                      <option value="Not Started">Not Started</option>
                      <option value="Drafted">Drafted</option>
                      <option value="Assigned">Assigned</option>
                    </select>
                  </div>
                </div>

                {/* Nutritional Plan */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-emerald-500/10 rounded-lg">
                      <Utensils className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">Nutritional Strategy</div>
                      <div className="text-[10px] text-on-surface-variant uppercase font-bold">Standard or Custom</div>
                    </div>
                  </div>
                  <select 
                    value={deliverables.nutritionalPlan}
                    onChange={(e) => setDeliverables({...deliverables, nutritionalPlan: e.target.value as any})}
                    className="bg-background border border-white/20 rounded-lg px-3 py-1.5 text-xs font-bold outline-none focus:border-primary"
                  >
                    <option value="Pending">Pending</option>
                    <option value="General Guidelines">General Guidelines</option>
                    <option value="Custom Diet Plan">Custom Diet Plan</option>
                  </select>
                </div>

                {/* Mobility Routine */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10 gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-amber-500/10 rounded-lg">
                      <Activity className="w-5 h-5 text-amber-400" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">Mobility Routine</div>
                      <div className="text-[10px] text-on-surface-variant uppercase font-bold">Based on limitations</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-bold uppercase text-on-surface-variant">Status:</span>
                    <button 
                      onClick={() => setDeliverables({...deliverables, mobilityRoutineStatus: deliverables.mobilityRoutineStatus === 'Assigned' ? 'Not Assigned' : 'Assigned'})}
                      className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase transition-all border ${
                        deliverables.mobilityRoutineStatus === 'Assigned' 
                        ? 'bg-emerald-500 text-white border-emerald-400' 
                        : 'bg-white/5 text-on-surface-variant border-white/10'
                      }`}
                    >
                      {deliverables.mobilityRoutineStatus}
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>
          </div>

          {/* Right Column: Communication & App Provisioning */}
          <div className="space-y-8">
            
            {/* Section C: Communication & Media */}
            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card rounded-2xl p-6 border-l-4 border-l-emerald-500"
            >
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <MessageSquare className="w-5 h-5 text-emerald-400" />
                <h3 className="text-lg font-black font-headline uppercase">Communication Hub</h3>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">WhatsApp Group Link</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input 
                        type="text" 
                        placeholder="Paste link here..."
                        className="bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-primary focus:outline-none w-full"
                        value={links.whatsapp}
                        onChange={(e) => setLinks({...links, whatsapp: e.target.value})}
                      />
                    </div>
                    <button 
                      onClick={() => handleLinkSave('whatsapp')}
                      className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2 block">Google Drive Folder</label>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <FolderOpen className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/20" />
                      <input 
                        type="text" 
                        placeholder="Paste link here..."
                        className="bg-white/5 border border-white/10 rounded-lg py-2 pl-10 pr-4 text-xs focus:ring-1 focus:ring-primary focus:outline-none w-full"
                        value={links.drive}
                        onChange={(e) => setLinks({...links, drive: e.target.value})}
                      />
                    </div>
                    <button 
                      onClick={() => handleLinkSave('drive')}
                      className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <FolderOpen className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.section>

            {/* Section D: App Provisioning */}
            <motion.section 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="glass-card rounded-2xl p-6 border-l-4 border-l-amber-500"
            >
              <div className="flex items-center gap-3 mb-6 border-b border-white/5 pb-4">
                <ShieldCheck className="w-5 h-5 text-amber-400" />
                <h3 className="text-lg font-black font-headline uppercase">App Access</h3>
              </div>

              <div className="bg-amber-400/5 border border-amber-400/10 p-4 rounded-xl mb-6">
                <p className="text-xs text-amber-200/60 leading-relaxed italic">
                  Credential generation triggers an automated email to the client with their unique username and temporary password for the Alpha Mobile training app.
                </p>
              </div>

              {provisioned ? (
                <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3 text-emerald-400">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-xs font-bold uppercase tracking-widest">Active In App</span>
                  </div>
                  <button className="text-[10px] font-bold uppercase text-on-surface-variant hover:text-white transition-colors">Resend Credentials</button>
                </div>
              ) : (
                <button 
                  onClick={triggerProvisioning}
                  disabled={isProvisioning}
                  className="w-full py-4 bg-primary text-on-primary font-black uppercase text-sm font-headline tracking-tighter flex items-center justify-center gap-3 hover:brightness-110 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProvisioning ? (
                    <>
                      <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Key className="w-5 h-5" />
                      Generate App Credentials
                    </>
                  )}
                </button>
              )}
            </motion.section>

            {/* Quick Actions Footer */}
            <div className="grid grid-cols-1 gap-3">
              <button className="flex items-center justify-between p-4 glass-card rounded-xl text-sm font-bold group">
                <span className="group-hover:text-primary transition-colors">Archive Client Profile</span>
                <ChevronRight className="w-4 h-4 text-on-surface-variant" />
              </button>
              <button className="flex items-center justify-between p-4 glass-card rounded-xl text-sm font-bold text-red-400 hover:bg-red-500/10 group">
                <span>Delete Account Record</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const ChevronRight: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18l6-6-6-6" />
  </svg>
);

export default ClientProfile;
