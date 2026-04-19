import * as admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: path.join(__dirname, '../.env') });

/**
 * Run once: npx ts-node scripts/setAdminClaim.ts <uid-or-email>
 * 
 * This script sets the { admin: true } custom claim for a Firebase user.
 * It accepts either a UID or an email address.
 */

const identifier = process.argv[2];

if (!identifier) {
  console.error('Usage: npx ts-node scripts/setAdminClaim.ts <uid-or-email>');
  process.exit(1);
}

// Initialize Firebase Admin SDK (Reusing logic from server/src/utils/firebase.ts)
let credential;
const firebaseEnvJson = process.env.FIREBASE_ADMIN_JSON;

try {
  if (firebaseEnvJson) {
    const serviceAccount = JSON.parse(firebaseEnvJson);
    credential = admin.credential.cert(serviceAccount);
  } else {
    const serviceAccountPath = path.join(__dirname, '../firebase-adminsdk.json');
    if (fs.existsSync(serviceAccountPath)) {
      credential = admin.credential.cert(serviceAccountPath);
    } else {
      console.error('No Firebase credentials found! Please set FIREBASE_ADMIN_JSON or ensure firebase-adminsdk.json exists in the server directory.');
      process.exit(1);
    }
  }

  admin.initializeApp({ credential });
  console.log('Firebase Admin initialized successfully.');

  const setAdmin = async (id: string) => {
    let uid = id;

    // Check if the identifier is an email
    if (id.includes('@')) {
      try {
        const userRecord = await admin.auth().getUserByEmail(id);
        uid = userRecord.uid;
        console.log(`Found user ${id} with UID: ${uid}`);
      } catch (error) {
        console.error(`Error finding user by email ${id}:`, error);
        process.exit(1);
      }
    }

    try {
      await admin.auth().setCustomUserClaims(uid, { admin: true });
      console.log(`Successfully set admin claim for user: ${uid}`);
      
      // Verification
      const updatedUser = await admin.auth().getUser(uid);
      console.log('Current custom claims:', updatedUser.customClaims);
      
      process.exit(0);
    } catch (error) {
      console.error('Error setting custom claims:', error);
      process.exit(1);
    }
  };

  setAdmin(identifier);
} catch (error) {
  console.error('Initialization failed:', error);
  process.exit(1);
}
