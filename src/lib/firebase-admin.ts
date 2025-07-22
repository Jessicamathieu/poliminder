import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let app: App;
let auth: Auth;
let db: Firestore;

if (getApps().length === 0) {
  const serviceAccount = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
    : undefined;

  if (!serviceAccount) {
    console.warn(
      'Firebase Admin SDK not initialized. FIREBASE_SERVICE_ACCOUNT_KEY is missing.'
    );
  } else {
     app = initializeApp({
      credential: cert(serviceAccount),
    });
  }
} else {
  app = getApps()[0];
}

if (app) {
  auth = getAuth(app);
  db = getFirestore(app);
}

// Export initialized instances, which might be undefined if initialization failed.
export { app, db, auth };
