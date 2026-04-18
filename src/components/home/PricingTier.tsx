import React from 'react';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingTierDetails {
  id: string;
  name: string;
  price: string;
  billingPeriod: string;
  description: string;
  features: PricingFeature[];
  isPopular?: boolean;
  ctaText: string;
  onCtaClick?: () => void;
}

export interface PricingProps {
  title?: string;
  subtitle?: string;
  tiers: PricingTierDetails[];
}

export default function PricingTier({
  title = "Unlock Your True Potential",
  subtitle = "Select the tier that matches your commitment level.",
  tiers
}: PricingProps) {
  if (!tiers || tiers.length === 0) return null;

  return (
    <section className="py-24 px-6 bg-surface-container-lowest border-b border-white/5 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black font-headline mb-4">{title}</h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">{subtitle}</p>
        </div>

        <div className="flex flex-col md:flex-row justify-center items-stretch gap-8 max-w-5xl mx-auto">
          {tiers.map((tier, index) => (
            <motion.div 
              key={tier.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`flex-1 glass-card rounded-3xl p-8 flex flex-col relative transition-transform hover:-translate-y-2 ${tier.isPopular ? 'border-primary/50 shadow-[0_10px_40px_rgba(255,255,255,0.08)] scale-100 md:scale-105 z-10' : 'border-white/5'}`}
            >
              {tier.isPopular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-on-primary px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                    Most Popular
                  </span>
                </div>
              )}

              <div className="text-center mb-8 pb-8 border-b border-white/10">
                <h3 className="text-2xl font-black font-headline mb-2">{tier.name}</h3>
                <p className="text-on-surface-variant text-sm mb-6 h-10">{tier.description}</p>
                <div className="flex items-end justify-center gap-1">
                  <span className="text-5xl font-black">{tier.price}</span>
                  {tier.billingPeriod && <span className="text-on-surface-variant mb-2">/{tier.billingPeriod}</span>}
                </div>
              </div>

              <div className="flex-grow">
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`mt-0.5 shrink-0 ${feature.included ? 'text-primary' : 'text-on-surface-variant/40'}`}>
                        {feature.included ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                      </div>
                      <span className={`text-sm ${feature.included ? 'text-on-surface' : 'text-on-surface-variant/40 line-through'}`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={tier.onCtaClick}
                className={`w-full py-4 rounded-xl font-black text-sm uppercase tracking-wider transition-all ${tier.isPopular ? 'bg-primary-container text-on-primary-container hover:shadow-[0_0_25px_rgba(255,255,255,0.2)] hover:brightness-110' : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white'}`}
              >
                {tier.ctaText}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
