
import * as admin from 'firebase-admin';

// This file is intended for server-side use ONLY (e.g., in API Routes or Server Actions)

const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : undefined;

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: serviceAccount 
        ? admin.credential.cert(serviceAccount)
        : admin.credential.applicationDefault(), // Fallback for environments like Cloud Run
    });
     console.log('Firebase Admin SDK initialized.');
  } catch (e: any) {
    if (e.code !== 'auth/invalid-credential') {
      console.error('Firebase Admin SDK initialization error:', e);
    } else {
      console.warn('Firebase Admin SDK not initialized due to missing credentials. This is expected in some local dev environments. API routes requiring admin access may fail.');
    }
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
