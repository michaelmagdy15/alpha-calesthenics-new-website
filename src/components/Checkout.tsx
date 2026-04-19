import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ShieldCheck, CreditCard, Lock, CheckCircle2 } from 'lucide-react';

export default function Checkout() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const tierId = searchParams.get('tier') || 'alpha-athlete';
  const tierName = tierId === 'alpha-elite' ? 'Alpha Elite' : 'Alpha Athlete';
  const tierPrice = tierId === 'alpha-elite' ? '7,999 EGP' : '4,500 EGP';

  useEffect(() => {
    if (!user) {
      // If the user happens to not be logged in, redirect them to home to log in
      navigate('/');
    }
  }, [user, navigate]);

  const handlePayment = async () => {
    if (!user) return;
    setIsProcessing(true);

    try {
      const token = await user.getIdToken();
      const amountValue = tierId === 'alpha-elite' ? 7999 : 4500;

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/payment/initiate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          packageTier: tierName,
          amount: amountValue
        })
      });

      if (!response.ok) {
        throw new Error('Failed to initiate payment');
      }

      const { iframeUrl } = await response.json();
      
      // Redirect to Paymob Iframe
      window.location.href = iframeUrl;

    } catch (error) {
      console.error("Error initiating payment:", error);
      setIsProcessing(false);
      alert("Something went wrong while initiating payment. Please try again.");
    }
  };

  if (!user) return null;

  return (
    <div className="bg-background text-on-surface font-body min-h-screen pt-32 px-6 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black font-headline uppercase tracking-tighter mb-2">Secure Checkout</h1>
          <p className="text-on-surface-variant text-sm flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" /> SSL Encrypted Transaction
          </p>
        </div>

        <div className="glass-card rounded-3xl p-8 mb-6 border-white/10 relative overflow-hidden">
          {/* Background glow */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl"></div>

          {isSuccess ? (
             <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="py-12 flex flex-col items-center text-center"
             >
                <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-6">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500" />
                </div>
                <h2 className="text-2xl font-black uppercase mb-2">Payment Successful!</h2>
                <p className="text-on-surface-variant">Redirecting to your onboarding...</p>
             </motion.div>
          ) : (
            <>
              <div className="mb-6 pb-6 border-b border-white/5">
                <div className="text-[10px] uppercase tracking-widest text-on-surface-variant font-bold mb-1">Selected Package</div>
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-black text-primary uppercase">{tierName}</h2>
                  <span className="text-xl font-bold">{tierPrice}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                    <img src="https://upload.wikimedia.org/wikipedia/commons/4/41/Visa_Logo.png" alt="Visa" className="w-6 opacity-70" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold">PayMob Secure Gateway</div>
                    <div className="text-[10px] text-on-surface-variant">Redirecting to Payment Portal</div>
                  </div>
                </div>
              </div>


              <button 
                onClick={handlePayment}
                disabled={isProcessing}
                className="w-full py-4 rounded-xl font-black uppercase tracking-widest bg-primary text-on-primary hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isProcessing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-on-primary/30 border-t-on-primary rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5" />
                    Complete Purchase
                  </>
                )}
              </button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}
