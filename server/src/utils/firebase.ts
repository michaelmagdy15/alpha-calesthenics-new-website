import * as admin from 'firebase-admin';
import path from 'path';

// Note: you will need a service account JSON file from Firebase Console
// e.g., 'firebase-adminsdk.json' at the root of the server directory
const serviceAccountPath = path.join(process.cwd(), 'firebase-adminsdk.json');

try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccountPath),
  });
  console.log('Firebase Admin initialized successfully.');
} catch (error) {
  console.log('Firebase Admin initialization failed. Ensure firebase-adminsdk.json is present if needed. Error:', error);
}

export const db = admin.firestore();
export const auth = admin.auth();
