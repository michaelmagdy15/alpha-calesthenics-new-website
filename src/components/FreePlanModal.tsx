import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { X, Phone, User, Globe, Download, CheckCircle } from 'lucide-react';

interface FreePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function FreePlanModal({ isOpen, onClose }: FreePlanModalProps) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.displayName || '',
    whatsapp: '',
    country: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setIsSubmitting(true);

    try {
      // 1. Update Firebase
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        fullName: formData.fullName,
        whatsapp: formData.whatsapp,
        country: formData.country,
        hasFreePlanAccess: true,
        updatedAt: new Date().toISOString()
      });

      // 2. Submit to Google Sheets
      const GOOGLE_SHEETS_URL = "https://script.google.com/macros/s/AKfycbwFPmUuUEYXFvQ3QApxqOhqtaH4Ou62HjAZpQvvTgCFDZkSX02Wp-1LuWp3VIyowN4/exec";
      try {
        await fetch(GOOGLE_SHEETS_URL, {
          method: "POST",
          mode: "no-cors",
          headers: {
            "Content-Type": "text/plain",
          },
          body: JSON.stringify({
            fullName: formData.fullName,
            whatsapp: formData.whatsapp,
            country: formData.country
          }),
        });
      } catch (sheetError) {
        console.error("Error saving to Google Sheets:", sheetError);
        // We continue even if sheet fails, as long as firebase succeeds
      }

      setIsSuccess(true);
    } catch (error) {
      console.error("Error updating user profile:", error);
      alert("Failed to save your details. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const pdfUrl = "/FREE PLAN/FREE PLAN BY C.AKRAM.pdf";

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-surface-container rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10 p-8 sm:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onClose}
              className="absolute top-6 right-6 z-10 w-10 h-10 bg-white/5 hover:bg-white/10 text-white rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {!isSuccess ? (
              <>
                <div className="text-center mb-10">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-4">
                    <Globe className="w-8 h-8 text-primary" />
                  </div>
                  <h2 className="text-2xl font-black uppercase tracking-tight text-white mb-2">Alpha Free Program</h2>
                  <p className="text-on-surface-variant text-sm">Please provide your details to unlock the free plan PDF.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-on-surface-variant tracking-widest pl-2 flex items-center gap-2">
                      <User className="w-3 h-3" /> Full Name
                    </label>
                    <input 
                      required
                      type="text" 
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-white/20"
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-on-surface-variant tracking-widest pl-2 flex items-center gap-2">
                      <Phone className="w-3 h-3" /> WhatsApp Number
                    </label>
                    <input 
                      required
                      type="tel" 
                      name="whatsapp"
                      value={formData.whatsapp}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-white/20"
                      placeholder="e.g. +20 123 456 7890"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase text-on-surface-variant tracking-widest pl-2 flex items-center gap-2">
                      <Globe className="w-3 h-3" /> Country
                    </label>
                    <input 
                      required
                      type="text" 
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-4 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-white/20"
                      placeholder="e.g. Egypt"
                    />
                  </div>

                  <button 
                    disabled={isSubmitting}
                    className="w-full py-5 mt-4 rounded-2xl font-black uppercase tracking-widest bg-primary text-on-primary hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      "Get Access Now"
                    )}
                  </button>
                </form>
              </>
            ) : (
              <div className="text-center py-10">
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tight text-white mb-4">Access Granted</h2>
                <p className="text-on-surface-variant mb-10 max-w-xs mx-auto">
                  Thank you! You can now download the Alpha Free Plan PDF.
                </p>
                <a
                  href={pdfUrl}
                  download="FREE PLAN BY C.AKRAM.pdf"
                  className="inline-flex items-center gap-3 px-10 py-5 bg-emerald-600 text-white font-black uppercase tracking-widest rounded-2xl hover:bg-emerald-500 transition-all shadow-[0_0_40px_rgba(16,185,129,0.2)]"
                >
                  <Download className="w-6 h-6" /> Download PDF
                </a>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
