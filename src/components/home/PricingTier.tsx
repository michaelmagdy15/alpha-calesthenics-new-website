import React from 'react';
import { motion } from 'motion/react';
import { Check, X } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

export interface PricingFeature {
  text: string;
  textAr?: string;
  included: boolean;
}

export interface PricingTierDetails {
  id: string;
  name: string;
  nameAr?: string;
  price: string;
  billingPeriod: string;
  billingPeriodAr?: string;
  description: string;
  descriptionAr?: string;
  features: PricingFeature[];
  isPopular?: boolean;
  ctaText: string;
  ctaTextAr?: string;
  onCtaClick?: () => void;
}

export interface PricingProps {
  title?: string;
  titleAr?: string;
  subtitle?: string;
  subtitleAr?: string;
  tiers: PricingTierDetails[];
}

export default function PricingTier({
  title = "Unlock Your True Potential",
  titleAr,
  subtitle = "Select the tier that matches your commitment level.",
  subtitleAr,
  tiers
}: PricingProps) {
  const { language } = useLanguage();
  if (!tiers || tiers.length === 0) return null;

  return (
    <section id="packages-section" className="py-24 px-6 bg-surface-container-lowest border-b border-white/5 relative overflow-hidden scroll-mt-24">
      {/* Background decoration */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-black font-headline mb-4">{language === 'ar' && titleAr ? titleAr : title}</h2>
          <p className="text-on-surface-variant max-w-xl mx-auto">{language === 'ar' && subtitleAr ? subtitleAr : subtitle}</p>
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
                    {language === 'ar' ? 'الأكثر شيوعاً' : 'Most Popular'}
                  </span>
                </div>
              )}

              <div className="text-center mb-8 pb-8 border-b border-white/10">
                <h3 className="text-2xl font-black font-headline mb-2">{language === 'ar' && tier.nameAr ? tier.nameAr : tier.name}</h3>
                <p className="text-on-surface-variant text-sm mb-6 min-h-[2.5rem]">{language === 'ar' && tier.descriptionAr ? tier.descriptionAr : tier.description}</p>
                <div className="flex items-end justify-center gap-1.5" dir="ltr">
                  <span className="text-4xl md:text-6xl font-black tracking-tighter text-gradient-premium">{tier.price}</span>
                  {tier.billingPeriod && <span className="text-on-surface-variant mb-2 text-sm font-medium opacity-60">/{language === 'ar' && tier.billingPeriodAr ? tier.billingPeriodAr : tier.billingPeriod}</span>}
                </div>
              </div>

              <div className="flex-grow">
                <ul className="space-y-4 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className={`mt-0.5 shrink-0 ${feature.included ? 'text-primary' : 'text-on-surface-variant/40'}`}>
                        {feature.included ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-sm leading-tight ${feature.included ? 'text-on-surface' : 'text-on-surface-variant/40 line-through'}`}>
                          {language === 'ar' && feature.textAr ? feature.textAr : feature.text}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <button 
                onClick={tier.onCtaClick}
                className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-500 relative overflow-hidden group ${tier.isPopular ? 'bg-primary-container text-on-primary-container shadow-[0_10px_40px_rgba(255,255,255,0.05)] hover:shadow-[0_20px_60px_rgba(255,255,255,0.15)] hover:scale-[1.02]' : 'bg-white/5 border border-white/10 hover:bg-white/10 text-white hover:scale-[1.02]'}`}
              >
                <span className="relative z-10">{tier.ctaText}</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-5 transition-opacity"></div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
