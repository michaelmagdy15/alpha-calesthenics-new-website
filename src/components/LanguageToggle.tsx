import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Languages } from 'lucide-react';
import { motion } from 'motion/react';

const LanguageToggle: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={toggleLanguage}
      className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-primary/50 transition-all text-sm font-bold tracking-tight"
      title={language === 'en' ? 'Switch to Arabic' : 'Switch to English'}
    >
      <Languages className="w-4 h-4 text-primary" />
      <span className="text-on-surface uppercase">
        {language === 'en' ? 'العربية' : 'English'}
      </span>
    </motion.button>
  );
};

export default LanguageToggle;
