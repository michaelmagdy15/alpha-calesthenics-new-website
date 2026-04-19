import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, onSnapshot } from 'firebase/firestore';

export default function PaymentSuccess() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'processing' | 'success' | 'timeout'>('processing');

  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    // Listen to user document to see when the webhook updates the role
    const unsubscribe = onSnapshot(doc(db, 'users', user.uid), (doc) => {
      const data = doc.data();
      if (data?.role === 'paid_client') {
        setStatus('success');
        // Auto redirect after a short delay
        setTimeout(() => {
          navigate('/onboarding');
        }, 3000);
      }
    });

    // Timeout after 30 seconds if webhook fails
    const timer = setTimeout(() => {
      if (status === 'processing') {
        setStatus('timeout');
      }
    }, 30000);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, [user, navigate, status]);

  return (
    <div className="bg-background text-on-surface font-body min-h-screen pt-32 px-6 flex items-center justify-center">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card rounded-3xl p-12 max-w-md w-full text-center border-white/10"
      >
        {status === 'processing' && (
          <>
            <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mx-auto mb-8">
              <Loader2 className="w-10 h-10 text-primary animate-spin" />
            </div>
            <h1 className="text-3xl font-black uppercase mb-4">Confirming Payment</h1>
            <p className="text-on-surface-variant">We're waiting for confirmation from Paymob. This usually takes a few seconds...</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto mb-8">
              <CheckCircle2 className="w-10 h-10 text-emerald-500" />
            </div>
            <h1 className="text-3xl font-black uppercase mb-4 text-emerald-500">Payment Verified!</h1>
            <p className="text-on-surface-variant mb-8">Your account has been upgraded. Redirecting you to onboarding...</p>
            <button 
              onClick={() => navigate('/onboarding')}
              className="w-full py-4 rounded-xl font-black uppercase tracking-widest bg-primary text-on-primary hover:brightness-110"
            >
              Go to Onboarding Now
            </button>
          </>
        )}

        {status === 'timeout' && (
          <>
            <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-8">
              <Loader2 className="w-10 h-10 text-amber-500" />
            </div>
            <h1 className="text-3xl font-black uppercase mb-4 font-headline">Taking a moment...</h1>
            <p className="text-on-surface-variant mb-6">Payment is still processing. You can wait here or check your dashboard later.</p>
            <button 
              onClick={() => navigate('/dashboard')}
              className="w-full py-4 rounded-xl font-black uppercase tracking-widest bg-white/10 text-on-surface hover:bg-white/20"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </motion.div>
    </div>
  );
}
