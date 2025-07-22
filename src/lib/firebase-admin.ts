import { getApps, initializeApp, cert, App } from 'firebase-admin/app';
import { getAuth, Auth } from 'firebase-admin/auth';
import { getFirestore, Firestore } from 'firebase-admin/firestore';

let app: App | undefined;
let auth: Auth | undefined;
let db: Firestore | undefined;

const initializeAdminApp = () => {
    if (getApps().length > 0) {
        app = getApps()[0];
    } else {
        const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
        if (!serviceAccountKey) {
            console.warn(
              'Firebase Admin SDK not initialized. FIREBASE_SERVICE_ACCOUNT_KEY is missing.'
            );
            return; // Ne plante pas, permet à l'app de démarrer
        }
        try {
            const serviceAccount = JSON.parse(serviceAccountKey);
            app = initializeApp({
                credential: cert(serviceAccount),
            });
        } catch (error) {
            console.error('Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:', error);
            return; // Ne plante pas
        }
    }

    if (app) {
        auth = getAuth(app);
        db = getFirestore(app);
    }
};

// Initialise l'app au premier chargement du module
initializeAdminApp();

// Exporte les instances, qui pourraient être undefined si l'initialisation a échoué.
export { app, db, auth };
