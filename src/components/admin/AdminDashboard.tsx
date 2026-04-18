import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Search, Users, Calendar, Award, Activity, ChevronRight } from 'lucide-react';
import { Client } from '../../types/admin';
import StatusBadge from './StatusBadge';
import Breadcrumbs from '../Breadcrumbs';
import LanguageToggle from '../LanguageToggle';
import { useLanguage } from '../../contexts/LanguageContext';

// Mock Data for the Dashboard
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
  },
  {
    id: '3',
    name: 'Michael Chen',
    email: 'mchen@example.com',
    joinDate: '2026-04-10',
    packageTier: 'Alpha Elite',
    status: 'Program Building',
    assessmentData: {
      age: 32, height: "175cm", weight: "78kg", fitnessGoals: "Skill focus (Muscle up)",
      maxPullups: 15, maxPushups: 40, mobilityLimitations: "None", injuryHistory: "Wrist sprain"
    },
    deliverables: { customRoutineStatus: 'Drafted', nutritionalPlan: 'General Guidelines', mobilityRoutineStatus: 'Not Assigned' },
    appCredentialsSent: false
  }
];

const AdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredClients = MOCK_CLIENTS.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    client.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-background text-on-surface font-body min-h-screen pt-24 px-6 pb-12">
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-md border-b border-white/5 left-0">
        <div className="flex justify-between items-center w-full px-6 py-4 max-w-screen-2xl mx-auto">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <img alt="Alpha Calisthenics Logo" className="h-5 object-contain" src="/Alphalogowhite.png" />
            <span className="text-white font-headline text-lg hidden sm:block">MISSION CONTROL</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-on-surface-variant" />
              <input 
                type="text" 
                placeholder="Search clients..."
                className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-primary transition-all w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <LanguageToggle />
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto">
        <Breadcrumbs items={[{ label: 'Home', path: '/' }, { label: 'Admin Dashboard' }]} />
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-4xl md:text-5xl font-black font-headline mb-2 uppercase italic tracking-tighter">Client Roster</h1>
              <p className="text-on-surface-variant text-lg">Manage elite profiles and track deliverable status.</p>
            </div>
            
            <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
              <div className="px-4 py-2 bg-primary text-on-primary rounded-lg text-xs font-bold uppercase tracking-wider">Active</div>
              <div className="px-4 py-2 text-on-surface-variant rounded-lg text-xs font-bold uppercase tracking-wider">Prospects</div>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Clients', value: MOCK_CLIENTS.length, icon: Users, color: 'text-primary' },
            { label: 'Pending Assessment', value: MOCK_CLIENTS.filter(c => c.status === 'Assessment Pending').length, icon: Calendar, color: 'text-amber-400' },
            { label: 'Alpha Elite', value: MOCK_CLIENTS.filter(c => c.packageTier === 'Alpha Elite').length, icon: Award, color: 'text-primary' },
            { label: 'Active In-App', value: MOCK_CLIENTS.filter(c => c.status === 'Active in App').length, icon: Activity, color: 'text-emerald-400' },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-5 rounded-2xl flex items-center gap-4"
            >
              <div className={`p-3 rounded-xl bg-white/5 ${stat.color}`}>
                <stat.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-on-surface-variant text-[10px] font-bold uppercase tracking-widest">{stat.label}</div>
                <div className="text-2xl font-black font-headline leading-none mt-1">{stat.value}</div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Table View */}
        <div className="glass-card rounded-2xl overflow-hidden border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 bg-white/5">
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant">Profile</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant hidden sm:table-cell">Join Date</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant md:table-cell hidden">Tier</th>
                  <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-widest text-on-surface-variant text-right sm:text-left">Status</th>
                  <th className="px-6 py-4 text-right hidden sm:table-cell"></th>
                </tr>
              </thead>
              <tbody>
                {filteredClients.map((client, i) => (
                  <motion.tr 
                    key={client.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    className="group border-b border-white/5 hover:bg-white/[0.02] cursor-pointer transition-colors"
                    onClick={() => navigate(`/admin/client/${client.id}`)}
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold overflow-hidden shrink-0">
                          {client.name.charAt(0)}
                        </div>
                        <div className="min-w-0">
                          <div className="font-bold text-white group-hover:text-primary transition-colors truncate">{client.name}</div>
                          <div className="text-xs text-on-surface-variant truncate">{client.email}</div>
                          {/* Mobile-only tier info */}
                          <div className="md:hidden mt-1 inline-block">
                             <StatusBadge type="tier" value={client.packageTier} isCompact />
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-on-surface-variant font-mono hidden sm:table-cell">
                      {client.joinDate}
                    </td>
                    <td className="px-6 py-5 md:table-cell hidden">
                      <StatusBadge type="tier" value={client.packageTier} />
                    </td>
                    <td className="px-6 py-5 text-right sm:text-left">
                      <StatusBadge type="status" value={client.status} />
                    </td>
                    <td className="px-6 py-5 text-right hidden sm:table-cell">
                      <button className="p-2 hover:bg-white/10 rounded-lg transition-all text-on-surface-variant group-hover:text-white">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {filteredClients.length === 0 && (
            <div className="py-20 text-center">
              <Users className="w-12 h-12 text-white/10 mx-auto mb-4" />
              <p className="text-on-surface-variant">No clients found matching your search.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
