import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, User as UserIcon, ShieldCheck, Mail, Send, 
  ExternalLink, BarChart3, Dumbbell, ClipboardList, Utensils,
  MessageSquare, FolderOpen, Key, Activity, Loader2, Save
} from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import StatusBadge from './StatusBadge';
import Breadcrumbs from '../Breadcrumbs';

export default function ClientProfile() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Data state
  const [userData, setUserData] = useState<any>(null);
  const [assessmentData, setAssessmentData] = useState<any>(null);
  
  // Editable fields we save to 'assessments' locally
  const [deliverables, setDeliverables] = useState({
    customRoutineStatus: 'Not Started',
    nutritionalPlan: 'Pending',
    mobilityRoutineStatus: 'Not Assigned'
  });
  
  const [links, setLinks] = useState({ whatsapp: '', drive: '' });
  const [coachReviewed, setCoachReviewed] = useState(false);

  useEffect(() => {
    const fetchClientData = async () => {
      if (!id) return;
      try {
        const uDoc = await getDoc(doc(db, 'users', id));
        if (uDoc.exists()) {
          setUserData(uDoc.data());
        }

        const aDoc = await getDoc(doc(db, 'assessments', id));
        if (aDoc.exists()) {
          const data = aDoc.data();
          setAssessmentData(data);
          
          if (data.adminData) {
            if (data.adminData.deliverables) {
              setDeliverables({
                customRoutineStatus: data.adminData.deliverables.customRoutineStatus || 'Not Started',
                nutritionalPlan: data.adminData.deliverables.nutritionalPlan || 'Pending',
                mobilityRoutineStatus: data.adminData.deliverables.mobilityRoutineStatus || 'Not Assigned',
              });
            }
            if (data.adminData.links) {
              setLinks(data.adminData.links);
            }
          }
          if (data.coachReviewed !== undefined) {
             setCoachReviewed(data.coachReviewed);
          }
        }
      } catch (error) {
        console.error("Error fetching client details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchClientData();
  }, [id]);

  const handleSaveAdminData = async () => {
    if (!id) return;
    setSaving(true);
    try {
      await updateDoc(doc(db, 'assessments', id), {
        coachReviewed,
        adminData: {
          deliverables,
          links
        }
      });
      alert('Client updated successfully');
    } catch (e) {
      console.error(e);
      alert('Error saving client data');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-on-surface">
        <Loader2 className="w-8 h-8 text-primary animate-spin mb-4" />
        <p className="font-bold text-on-surface-variant uppercase tracking-widest text-xs">Loading Profile...</p>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-on-surface">
        <div className="text-center">
          <h2 className="text-2xl font-black mb-4">CLIENT NOT FOUND</h2>
          <button onClick={() => navigate('/admin')} className="text-primary hover:underline">Return to Roster</button>
        </div>
      </div>
    );
  }

  const joinDate = userData.createdAt ? new Date(userData.createdAt.seconds * 1000).toISOString().split('T')[0] : 'Unknown';
  const status = coachReviewed ? 'Active in App' : (assessmentData ? 'Program Building' : 'Assessment Pending');

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
             <span className="text-white font-headline text-lg italic tracking-tighter hidden sm:block">CLIENT VIEW // {id}</span>
             
             <button
              onClick={handleSaveAdminData}
              disabled={saving}
              className="px-4 py-2 bg-primary text-on-primary font-bold uppercase tracking-wider text-xs rounded-lg flex items-center gap-2 hover:brightness-110 disabled:opacity-50"
             >
                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                Save Changes
             </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Admin', path: '/admin' }, { label: userData.displayName || 'Unnamed' }]} />

        {/* Header Header */}
        <section className="mb-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center"
          >
            <div className="w-24 h-24 rounded-full bg-primary/20 flex items-center justify-center text-4xl font-black text-primary border-4 border-white/5">
              {(userData.displayName?.charAt(0) || 'U').toUpperCase()}
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl font-black font-headline uppercase italic tracking-tighter mb-2">{userData.displayName || 'Unnamed'}</h1>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 items-center">
                <div className="flex items-center gap-2 text-on-surface-variant text-sm">
                  <Mail className="w-4 h-4" />
                  {userData.email}
                </div>
                <div className="flex items-center gap-2 text-on-surface-variant text-sm border-l border-white/10 pl-4 md:border-none md:pl-0">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  Member since {joinDate}
                </div>
              </div>
            </div>
            <div className="flex flex-col gap-3 items-end">
              <StatusBadge type="tier" value={userData.packageTier || 'Unknown'} />
              <StatusBadge type="status" value={status} />
              
              {assessmentData && (
                <div className="flex items-center mt-2 gap-2 text-sm bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                  <input 
                    type="checkbox" 
                    id="coachReviewed"
                    checked={coachReviewed}
                    onChange={(e) => setCoachReviewed(e.target.checked)}
                    className="accent-primary"
                  />
                  <label htmlFor="coachReviewed" className="text-white cursor-pointer select-none">Mark as Active in App</label>
                </div>
              )}
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
              
              {!assessmentData ? (
                <div className="p-8 text-center bg-white/5 rounded-xl border border-white/10">
                  <p className="text-on-surface-variant text-sm italic">Assessment not yet submitted by client.</p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mb-8">
                    {[
                      { label: 'Age', value: assessmentData.age },
                      { label: 'Height', value: assessmentData.height },
                      { label: 'Weight', value: assessmentData.weight },
                      { label: 'Goals', value: assessmentData.primaryGoal },
                    ].map(stat => (
                      <div key={stat.label}>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-1">{stat.label}</div>
                        <div className="text-sm font-bold text-white">{stat.value || '--'}</div>
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
                          <div className="text-2xl font-black font-headline text-primary">{assessmentData.maxPullups || '--'}</div>
                        </div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                          <div className="text-[10px] uppercase font-bold text-on-surface-variant">Max Push-ups</div>
                          <div className="text-2xl font-black font-headline text-primary">{assessmentData.maxPushups || '--'}</div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                         <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Form Video</div>
                         <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-sm">
                           {assessmentData.formVideoUrl ? (
                             <a href={assessmentData.formVideoUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline flex items-center gap-2">
                               <ExternalLink className="w-4 h-4" /> Watch Video
                             </a>
                           ) : 'No video provided.'}
                         </div>
                      </div>
                      <div>
                        <div className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant mb-2">Previous Training</div>
                        <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-sm text-on-surface leading-relaxed capitalize">
                          {assessmentData.trainingHistory || 'None'}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
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
                <p className="text-xs text-on-surface-variant italic pb-2">These statuses are manually updated by you. "Not Started" / "Drafted" / "Assigned".</p>
                
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
                      onChange={(e) => setDeliverables({...deliverables, customRoutineStatus: e.target.value})}
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
                    onChange={(e) => setDeliverables({...deliverables, nutritionalPlan: e.target.value})}
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
                    {links.whatsapp && (
                       <a href={links.whatsapp} target="_blank" rel="noreferrer" className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                          <ExternalLink className="w-4 h-4 text-emerald-400" />
                       </a>
                    )}
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
                    {links.drive && (
                      <a href={links.drive} target="_blank" rel="noreferrer" className="p-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition-colors">
                        <FolderOpen className="w-4 h-4 text-emerald-400" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </motion.section>

          </div>
        </div>
      </main>
    </div>
  );
}



export default ClientProfile;
