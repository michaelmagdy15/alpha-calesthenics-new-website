import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyBy2ear7krH_eSJBNGzTy3q0PVhmYHUJRQ",
  authDomain: "alpha-calesthenics.firebaseapp.com",
  projectId: "alpha-calesthenics",
  storageBucket: "alpha-calesthenics.firebasestorage.app",
  messagingSenderId: "385539655760",
  appId: "1:385539655760:web:d94b3e44a65c9246d32955",
  measurementId: "G-M514PGM40P"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
