
'use server';

import { 
    signInWithEmailAndPassword,
} from "firebase/auth";
import { auth as firebaseAuth } from "@/lib/firebase"; // Client SDK for sign-in
import { auth, db } from "@/lib/firebase-admin"; // Admin SDK for user data
import { User } from "./types";

// This is a server-side only function that interacts with Firebase Admin SDK
export async function getUserData(uid: string): Promise<User | null> {
    // Vérifie si le SDK admin est disponible
    if (!db) {
        console.warn("Firestore Admin SDK not available. Cannot fetch user data.");
        // Retourne null pour que l'app ne plante pas, l'utilisateur devra se reconnecter.
        return null; 
    }
    try {
        const userDocRef = db.collection('users').doc(uid);
        const docSnap = await userDocRef.get();
        if (docSnap.exists) {
            return {
                uid: docSnap.id,
                ...docSnap.data()
            } as User;
        }
        return null;
    } catch (error) {
        console.error("Error getting user data:", error);
        throw new Error("Impossible de récupérer les données de l'utilisateur.");
    }
}

// Utilise le SDK client pour l'authentification.
// Appelée depuis un composant client mais s'exécute sur le serveur via une Server Action.
export async function loginWithEmailAndPassword(email: string, pass: string) {
    try {
        const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, pass);
        return { user: userCredential.user };
    } catch (error: any) {
        console.error("Firebase Auth Error:", error.code, error.message);
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
            throw new Error('Adresse e-mail ou mot de passe invalide.');
        }
        throw new Error("Une erreur s'est produite lors de la connexion.");
    }
}

export async function logout() {
  // Pour une app "serverless", on se fie surtout à la déconnexion client.
  return Promise.resolve();
}
