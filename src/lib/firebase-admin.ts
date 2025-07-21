
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
        : undefined, // Explicitly undefined if no service account
    });
     console.log('Firebase Admin SDK initialized.');
  } catch (e: any) {
    if (e.code === 'auth/invalid-credential' || e.message.includes('Must provide a "credential"')) {
      console.warn('Firebase Admin SDK not initialized due to missing or invalid credentials. This is expected if the service account key is not set in .env. API routes or Server Actions requiring admin access will fail.');
    } else {
      console.error('Firebase Admin SDK initialization error:', e);
    }
  }
}

export const db = admin.firestore();
export const auth = admin.auth();
