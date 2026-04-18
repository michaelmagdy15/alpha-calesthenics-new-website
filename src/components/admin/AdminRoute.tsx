import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { motion } from 'motion/react';

export default function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    let isMounted = true;
    const checkAdmin = async () => {
      if (!user) {
        if (isMounted) setIsAdmin(false);
        return;
      }
      
      // Override for Coach Akram's primary email 
      if (user.email === 'akramahmedh2022@gmail.com') {
        if (isMounted) setIsAdmin(true);
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists() && userDoc.data().role === 'admin') {
          if (isMounted) setIsAdmin(true);
        } else {
          if (isMounted) setIsAdmin(false);
        }
      } catch (error) {
        console.error("Error checking admin status:", error);
        if (isMounted) setIsAdmin(false);
      }
    };

    if (!authLoading) {
      checkAdmin();
    }

    return () => { isMounted = false; };
  }, [user, authLoading]);

  if (authLoading || isAdmin === null) {
    return (
      <div className="min-h-screen bg-background flex justify-center items-center">
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
           className="w-8 h-8 border-4 border-primary/30 border-t-primary rounded-full"
        />
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
