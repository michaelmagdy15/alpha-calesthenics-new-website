import * as admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config();

let credential;
const firebaseEnvJson = process.env.FIREBASE_ADMIN_JSON;

try {
  if (firebaseEnvJson) {
    console.log("Loading Firebase credentials from FIREBASE_ADMIN_JSON environment variable");
    const serviceAccount = JSON.parse(firebaseEnvJson);
    credential = admin.credential.cert(serviceAccount);
  } else {
    const serviceAccountPath = path.join(process.cwd(), 'firebase-adminsdk.json');
    if (fs.existsSync(serviceAccountPath)) {
      console.log("Loading Firebase credentials from local firebase-adminsdk.json file");
      credential = admin.credential.cert(serviceAccountPath);
    } else {
      console.log("No Firebase credentials found! Please set FIREBASE_ADMIN_JSON");
    }
  }

  if (credential) {
    admin.initializeApp({ credential });
    console.log('Firebase Admin initialized successfully.');
  }
} catch (error) {
  console.log('Firebase Admin initialization failed. Error:', error);
}

export const db = admin.firestore();
export const auth = admin.auth();
