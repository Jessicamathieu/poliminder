import { getApps, initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'

const firebaseAdminConfig = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
  ? JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY)
  : null

if (firebaseAdminConfig && getApps().length === 0) {
  initializeApp({
    credential: cert(firebaseAdminConfig),
  })
}

// ✅ Ne PAS exporter `const db = getFirestore();` ici directement.
export const getDb = () => {
  if (getApps().length === 0) {
    // In a production environment, this might indicate a configuration error
    // but for the build process, it's expected if the service account isn't available.
    // We can return null or throw a specific error that build can handle if necessary.
    // For now, let's return null and handle it in the consuming code.
    console.warn("⚠️ Firebase Admin app not initialized when getDb was called.");
    return null; // Or throw an error if you prefer stricter behavior
  }
  return getFirestore()
}

// Also update getAuth if it's used in a similar way
export const getAuthInstance = () => {
    if (getApps().length === 0) {
        console.warn("⚠️ Firebase Admin app not initialized when getAuthInstance was called.");
        return null; // Or throw
    }
    return getAuth();
}
