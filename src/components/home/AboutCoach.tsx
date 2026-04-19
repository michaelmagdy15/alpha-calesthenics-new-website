import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';

export interface Credential {
  id: string | number;
  title: string;
}

export interface CoachProfile {
  name: string;
  title: string;
  photoUrl: string;
  bio: string[];
  credentials: Credential[];
}

export interface AboutCoachProps {
  profile: CoachProfile;
}

export default function AboutCoach({ profile }: AboutCoachProps) {
  if (!profile) return null;

  return (
    <section className="py-24 px-6 max-w-7xl mx-auto border-b border-white/5">
      <div className="flex flex-col lg:flex-row items-center gap-16">
        
        {/* Photo Column */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8 }}
          className="w-full lg:w-1/2 relative"
        >
          <div className="aspect-[4/5] max-w-md mx-auto relative rounded-3xl overflow-hidden glass-card p-2 md:p-3 shadow-[0_20px_50px_rgba(0,0,0,0.3)]">
            <div className="w-full h-full rounded-2xl overflow-hidden relative">
              <img 
                src={profile.photoUrl} 
                alt={profile.name} 
                className="w-full h-full object-cover object-top filter grayscale-[20%]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent"></div>
              
              {/* Floating Name Badge */}
              <div className="absolute bottom-6 left-6 right-6">
                <h2 className="text-3xl font-black font-headline text-white mb-1">{profile.name}</h2>
                <p className="text-primary font-bold text-sm tracking-widest uppercase">{profile.title}</p>
              </div>
            </div>
          </div>
          
          {/* Decorative element */}
          <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-primary/20 rounded-full blur-[40px] z-[-1]"></div>
        </motion.div>

        {/* Content Column */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-full lg:w-1/2 flex flex-col justify-center"
        >
          <span className="text-on-surface-variant font-bold text-sm uppercase tracking-widest mb-4 block">Meet Your Guide</span>
          <h3 className="text-4xl md:text-5xl font-black font-headline mb-8 leading-tight">
            Built from scratch. <br />
            <span className="text-white">Tested in reality.</span>
          </h3>
          
          <div className="space-y-4 mb-10">
            {profile.bio.map((paragraph, index) => (
              <p key={index} className="text-base md:text-lg text-on-surface-variant leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="bg-surface-container-low p-6 rounded-2xl border border-white/5">
            <h4 className="text-lg font-bold mb-4 font-headline uppercase tracking-wider text-white">Credentials & Experience</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profile.credentials.map(credential => (
                <li key={credential.id} className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-on-surface">{credential.title}</span>
                </li>
              ))}
            </ul>
          </div>

        </motion.div>
      </div>
    </section>
  );
}
